// The base vite-tanstack-config already includes the following, do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vercel had NODE_ENV=development set during `npm run build`, which makes Vite
// emit jsxDEV calls while React's server bundle still selects its production
// runtime (where jsxDEV is undefined). Correct it while Vite resolves this config.
if (["build", "vercel-build"].includes(process.env.npm_lifecycle_event ?? "")) {
  process.env.NODE_ENV = "production";
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
  vite: {
    // Defense in depth: never allow a production build to emit calls to
    // react/jsx-dev-runtime, even if the host injects a bad NODE_ENV.
    esbuild: {
      jsxDev: false,
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/uploads": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/media": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  },
});
