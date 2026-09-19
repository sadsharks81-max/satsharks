import { spawn } from "child_process";
import {
  createReadStream,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "fs";
import { createServer } from "http";
import { tmpdir } from "os";
import path from "path";
import { env } from "../config/env";
import {
  TrackSource,
  deleteRoomIfExists,
  ensureRoomExists,
  issueRoomToken,
} from "../services/livekit.service";

const roomName = `sat-sharks-browser-smoke-${Date.now()}`;
const identity = `browser-smoke-${Date.now()}`;
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

const evaluatePage = async (debuggerUrl: string) =>
  new Promise<{ status?: string; result?: string }>((resolve, reject) => {
    const socket = new WebSocket(debuggerUrl);
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error("Chrome debugging response timed out"));
    }, 3_000);
    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          id: 1,
          method: "Runtime.evaluate",
          params: {
            expression:
              "({status: document.documentElement.dataset.result, result: document.getElementById('result')?.textContent})",
            returnByValue: true,
          },
        }),
      );
    });
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id !== 1) return;
      clearTimeout(timeout);
      socket.close();
      resolve(message.result?.result?.value || {});
    });
    socket.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(new Error("Unable to read Chrome debugging state"));
    });
  });

const page = `<!doctype html>
<html><body><pre id="result">STARTING</pre><script>
const result = document.getElementById('result');
const events = [];
let finished = false;
const record = (event, detail) => {
  events.push({ atMs: Math.round(performance.now()), event, detail });
  result.textContent = JSON.stringify({ status: 'RUNNING', events });
};
const finish = (status, detail) => {
  if (finished) return;
  finished = true;
  record(status, detail);
  document.documentElement.dataset.result = status;
  document.title = status;
  result.textContent = JSON.stringify({ status, events });
};
const NativeWebSocket = window.WebSocket;
window.WebSocket = class DiagnosticWebSocket extends NativeWebSocket {
  constructor(url, protocols) {
    super(url, protocols);
    const parsed = new URL(url);
    const safeUrl = parsed.origin + parsed.pathname;
    this.addEventListener('open', () => record('websocket-open', { url: safeUrl }));
    this.addEventListener('error', () => record('websocket-error', { url: safeUrl }));
    this.addEventListener('close', (event) => record('websocket-close', {
      url: safeUrl,
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    }));
  }
};
const nativeFetch = window.fetch.bind(window);
window.fetch = async (...args) => {
  const response = await nativeFetch(...args);
  const requestUrl = new URL(typeof args[0] === 'string' ? args[0] : args[0].url, location.href);
  if (requestUrl.hostname.endsWith('.livekit.cloud')) {
    record('livekit-http', {
      url: requestUrl.origin + requestUrl.pathname,
      status: response.status,
      statusText: response.statusText,
      body: response.ok ? undefined : await response.clone().text(),
    });
  }
  return response;
};
</script><script src="/livekit.js"></script><script>
const verifyGenericWebSocket = () => new Promise((resolve) => {
  const socket = new NativeWebSocket('wss://ws.postman-echo.com/raw');
  const timeout = setTimeout(() => {
    socket.close();
    resolve({ ok: false, reason: 'timeout' });
  }, 5000);
  socket.addEventListener('open', () => socket.send('sat-sharks-websocket-check'));
  socket.addEventListener('message', () => {
    clearTimeout(timeout);
    socket.close();
    resolve({ ok: true });
  }, { once: true });
  socket.addEventListener('error', () => {
    clearTimeout(timeout);
    resolve({ ok: false, reason: 'error' });
  }, { once: true });
});
(async () => {
  try {
    record('generic-websocket', await verifyGenericWebSocket());
    const config = await fetch('/config').then((response) => response.json());
    const room = new LivekitClient.Room({
      adaptiveStream: { pauseVideoInBackground: true },
      dynacast: true,
      singlePeerConnection: true,
    });
    let connected = false;
    room.on(LivekitClient.RoomEvent.ConnectionStateChanged, (state) => record('state', state));
    room.on(LivekitClient.RoomEvent.Reconnecting, () => record('reconnecting'));
    room.on(LivekitClient.RoomEvent.Reconnected, () => record('reconnected'));
    room.on(LivekitClient.RoomEvent.Disconnected, (reason) => {
      record('disconnected', { reason });
      if (connected) finish('FAIL', { reason });
    });
    await room.connect(config.url, config.token, {
      autoSubscribe: true,
      maxRetries: 3,
      peerConnectionTimeout: 20000,
      websocketTimeout: 15000,
    });
    connected = true;
    record('connected', { identity: room.localParticipant.identity });
    await room.localParticipant.setMicrophoneEnabled(true);
    record('microphone-published', { enabled: room.localParticipant.isMicrophoneEnabled });
    await room.localParticipant.setCameraEnabled(true);
    record('camera-published', { enabled: room.localParticipant.isCameraEnabled });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    finish('PASS', { connectionState: room.state });
    await room.disconnect();
  } catch (error) {
    finish('FAIL', { name: error?.name, message: error?.message || String(error) });
  }
})();
</script></body></html>`;

const run = async () => {
  if (!env.isLiveKitConfigured)
    throw new Error("LiveKit environment variables are not configured");

  const chromePath = chromeCandidates.find((candidate) =>
    existsSync(candidate),
  );
  if (!chromePath)
    throw new Error("Chrome or Edge is required for the browser smoke test");

  const token = await issueRoomToken({
    roomName,
    identity,
    name: "Browser Smoke Test",
    role: "TEACHER",
    ttlSeconds: 10 * 60,
    grant: {
      canPublish: true,
      canPublishSources: [TrackSource.CAMERA, TrackSource.MICROPHONE],
      canSubscribe: true,
      canUpdateOwnMetadata: true,
    },
  });
  await ensureRoomExists(roomName, 2);

  const livekitBundle = path.resolve(
    __dirname,
    "../../../node_modules/livekit-client/dist/livekit-client.umd.js",
  );
  const server = createServer((request, response) => {
    if (request.url === "/livekit.js") {
      response.writeHead(200, { "content-type": "text/javascript" });
      createReadStream(livekitBundle).pipe(response);
      return;
    }
    if (request.url === "/config") {
      response.writeHead(200, {
        "content-type": "application/json",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ url: env.livekitUrl, token }));
      return;
    }
    response.writeHead(200, {
      "content-type": "text/html",
      "cache-control": "no-store",
    });
    response.end(page);
  });

  const profileDirectory = mkdtempSync(
    path.join(tmpdir(), "sat-sharks-livekit-"),
  );
  try {
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const address = server.address();
    if (!address || typeof address === "string")
      throw new Error("Unable to start smoke-test server");

    const browser = spawn(
      chromePath,
      [
        "--headless=new",
        "--disable-gpu",
        "--disable-background-networking",
        "--disable-component-update",
        "--no-sandbox",
        "--no-first-run",
        "--remote-debugging-port=0",
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
        `--user-data-dir=${profileDirectory}`,
        `http://127.0.0.1:${address.port}`,
      ],
      { stdio: "ignore" },
    );
    try {
      const activePortFile = path.join(profileDirectory, "DevToolsActivePort");
      for (
        let attempt = 0;
        attempt < 60 && !existsSync(activePortFile);
        attempt += 1
      ) {
        await wait(250);
      }
      if (!existsSync(activePortFile))
        throw new Error("Chrome debugging endpoint did not start");
      const debugPort = Number(
        readFileSync(activePortFile, "utf8").split(/\r?\n/)[0],
      );

      let pageResult: { status?: string; result?: string } = {};
      for (let attempt = 0; attempt < 60; attempt += 1) {
        const targets = (await fetch(
          `http://127.0.0.1:${debugPort}/json/list`,
        ).then((response) => response.json())) as Array<{
          type: string;
          webSocketDebuggerUrl: string;
        }>;
        const target = targets.find((candidate) => candidate.type === "page");
        if (target)
          pageResult = await evaluatePage(target.webSocketDebuggerUrl);
        if (pageResult.status === "PASS" || pageResult.status === "FAIL") break;
        await wait(500);
      }
      if (pageResult.status !== "PASS") {
        throw new Error(
          `Browser LiveKit smoke test failed: ${pageResult.result || "no result"}`,
        );
      }
      console.info(pageResult.result);
    } finally {
      browser.kill();
      for (
        let attempt = 0;
        attempt < 30 && browser.exitCode === null;
        attempt += 1
      ) {
        await wait(100);
      }
    }
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    rmSync(profileDirectory, { recursive: true, force: true });
    await deleteRoomIfExists(roomName);
  }
};

void run().catch((error) => {
  console.error(
    error instanceof Error
      ? error.message
      : "Browser LiveKit smoke test failed",
  );
  process.exitCode = 1;
});
