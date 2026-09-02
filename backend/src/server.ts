import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { apiRateLimiter } from "./middleware/rate-limit.middleware";
import { streamUploadedImage } from "./controllers/upload.controller";

const app = express();

// Railway/Vercel terminate TLS upstream. Without this, req.ip is the proxy's
// address for every caller, which would collapse all rate-limit buckets into one,
// and req.secure is always false.
app.set("trust proxy", 1);
// Nothing downstream reads an implicit "X-Powered-By: Express" fingerprint.
app.disable("x-powered-by");

const productionFrontendOrigins = new Set(
  [env.frontendUrl, "https://satsharks-frontend.vercel.app", ...env.extraCorsOrigins].map((origin) =>
    origin.replace(/\/$/, ""),
  ),
);

/**
 * Allowlist check for browser origins.
 *
 * The previous implementation also accepted anything matching
 * /^satsharks-frontend(-[a-z0-9-]+)?\.vercel\.app$/ . Vercel subdomains are
 * first-come-first-served, so an attacker could register
 * `satsharks-frontend-x.vercel.app`, host a page there, and , because
 * `credentials: true` is set , read authenticated API responses from any logged
 * in visitor. Preview deployments are now listed explicitly via
 * CORS_ALLOWED_ORIGINS instead of being pattern matched.
 */
const isAllowedProductionOrigin = (origin: string) => {
  const normalized = origin.replace(/\/$/, "");
  if (productionFrontendOrigins.has(normalized)) return true;
  try {
    const hostname = new URL(normalized).hostname.toLowerCase();
    return hostname === "satsharks.com" || hostname === "www.satsharks.com";
  } catch {
    return false;
  }
};

// Security headers first, so they also cover the webhook routes and any error
// response produced before the router is reached.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to load cross-origin
  }),
);

// Stripe webhook must come BEFORE express.json() because it needs the raw body
import { stripeWebhook } from "./controllers/payment.controller";
app.post("/api/payment/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// LiveKit webhook must also come BEFORE express.json() - signature verification needs the raw body
import { liveKitWebhook } from "./controllers/live-class.controller";
app.post("/api/live-classes/webhook", express.raw({ type: "application/json" }), liveKitWebhook);

app.use(express.json({ limit: env.jsonBodyLimit }));
app.use(express.urlencoded({ limit: env.urlencodedBodyLimit, extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // In dev, allow all origins (LAN IPs, localhost, etc.)
      if (!env.isProduction) {
        return callback(null, true);
      }
      // In production, allow the configured site and any explicitly listed origin.
      if (!origin || isAllowedProductionOrigin(origin)) {
        return callback(null, true);
      }
      // Reject by omitting CORS headers rather than throwing. Throwing here
      // surfaced as an opaque 500 through the error handler instead of the
      // browser's own CORS failure.
      return callback(null, false);
    },
    credentials: true,
    maxAge: 86400,
  }),
);
// Compress JSON, HTML and text responses. Large public datasets and analytics
// payloads otherwise spend much longer on the wire than they do in MongoDB.
app.use(compression({ threshold: 1024 }));
// `combined` in production so logs carry status, size, referrer and user agent.
app.use(morgan(env.isProduction ? "combined" : "dev"));

// Basic Route , registered before the rate limiter so uptime probes are never
// throttled.
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// Immutable public images live outside the API limiter. A full class behind one
// NAT address can therefore load a shared page without exhausting an anonymous
// request bucket, and browsers/CDNs may cache the binary for a year.
app.get("/media/images/:id", streamUploadedImage);

app.use("/api", apiRateLimiter);

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import contactRoutes from "./routes/contact.routes";
import successStoryRoutes from "./routes/success-stories.routes";
import categoryRoutes from "./routes/category.routes";
import questionRoutes from "./routes/question.routes";
import testRoutes from "./routes/test.routes";
import analyticsRoutes from "./routes/analytics.routes";
import practiceRoutes from "./routes/practice.routes";
import uploadRoutes from "./routes/upload.routes";
import adminAnalyticsRoutes from "./routes/admin-analytics.routes";
import satRoutes from "./routes/sat.routes";
import consultingRoutes from "./routes/consulting.routes";
import essayRoutes from "./routes/essay.routes";
import notificationRoutes from "./routes/notification.routes";
import universityRoutes from "./routes/university.routes";
import paymentRoutes from "./routes/payment.routes";
import studyMaterialRoutes from "./routes/study-material.routes";
import reportRoutes from "./routes/report.routes";
import liveClassRoutes from "./routes/live-class.routes";
import vocabularyRoutes from "./routes/vocabulary.routes";
import homepageStatsRoutes from "./routes/homepage-stats.routes";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/sat", satRoutes);
app.use("/api/consulting", consultingRoutes);
app.use("/api/essays", essayRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/live-classes", liveClassRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/homepage-stats", homepageStatsRoutes);

/**
 * Uploaded files.
 *
 * `nosniff` plus a non-inline disposition means a file that slipped past the
 * mimetype filter cannot execute as HTML/JS on this origin. `dotfiles: "deny"`
 * blocks requests for things like /uploads/.env, and `index: false` stops
 * directory listings.
 */
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    next();
  },
  express.static(path.resolve(__dirname, "../uploads"), {
    dotfiles: "deny",
    index: false,
    maxAge: "7d",
    setHeaders: (res, filePath) => {
      if (!/\.(png|jpe?g|webp|gif|pdf)$/i.test(filePath)) {
        res.setHeader("Content-Disposition", "attachment");
      }
    },
  }),
);

// Dynamic Sitemap and Robots.txt
const publicOrigin = (req: Request) => {
  // In production the canonical host is the configured frontend URL. Deriving it
  // from the Host header let a caller inject arbitrary hosts into the emitted
  // sitemap (host header poisoning).
  if (env.isProduction) return env.frontendUrl;
  const host = req.get("host") || "satsharks.com";
  return `${req.secure ? "https" : "http"}://${host}`;
};

app.get("/sitemap.xml", (req: Request, res: Response) => {
  const origin = publicOrigin(req);

  const urls = [
    { loc: `${origin}/`, changefreq: "daily", priority: 1.0 },
    { loc: `${origin}/sat`, changefreq: "weekly", priority: 0.8 },
    { loc: `${origin}/counseling-abroad`, changefreq: "weekly", priority: 0.8 },
    { loc: `${origin}/consulting`, changefreq: "weekly", priority: 0.8 },
    { loc: `${origin}/contact`, changefreq: "monthly", priority: 0.5 },
    { loc: `${origin}/success-stories`, changefreq: "daily", priority: 0.7 },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach((url) => {
    xml += "  <url>\n";
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += "  </url>\n";
  });
  xml += "</urlset>";

  res.header("Content-Type", "application/xml");
  res.status(200).send(xml);
});

app.get("/robots.txt", (req: Request, res: Response) => {
  const origin = publicOrigin(req);

  let robots = "User-agent: *\n";
  robots += "Allow: /\n";
  robots += "Disallow: /admin\n";
  robots += "Disallow: /dashboard\n";
  robots += `Sitemap: ${origin}/sitemap.xml\n`;

  res.header("Content-Type", "text/plain");
  res.status(200).send(robots);
});

// Unknown API paths return JSON, not the HTML-ish default, so the frontend's
// `res.json()` parsing behaves predictably.
app.use("/api", (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

/**
 * Terminal error handler.
 *
 * Previously this echoed `err.message` and printed `err.stack` for every fault,
 * which forwarded driver and filesystem detail to clients. Multer's own errors
 * are surfaced (they are actionable and safe), everything else is logged
 * server-side and reported generically.
 */
import multer from "multer";

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "That file is too large."
        : err.field || "That file type is not allowed.";
    return res.status(400).json({ success: false, error: message });
  }

  if (typeof err === "object" && err !== null && "type" in err) {
    const bodyError = err as { type?: string; status?: number };
    if (bodyError.type === "entity.too.large") {
      return res.status(413).json({ success: false, error: "Request payload is too large." });
    }
    if (bodyError.type === "entity.parse.failed") {
      return res.status(400).json({ success: false, error: "Malformed JSON body." });
    }
  }

  console.error("[error] unhandled:", err);
  const status = (err as { status?: number })?.status ?? 500;
  res.status(status >= 400 && status < 600 ? status : 500).json({
    success: false,
    error: status < 500 ? (err as Error)?.message || "Request failed" : "Server Error",
  });
});

let server: ReturnType<typeof app.listen> | null = null;

/**
 * Do not accept traffic until MongoDB is ready. Mongoose otherwise buffers the
 * first burst of login requests during a deploy, which looks like intermittent
 * login failures and can exhaust request timeouts under a full class arrival.
 */
export const startServer = async () => {
  await connectDB();
  server = app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
  return server;
};

/**
 * Without these, an unhandled rejection leaves the process in an unknown state
 * (Node's default is to terminate on unhandled rejections), and a container stop
 * signal killed in-flight requests mid-write.
 */
const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  if (!server) {
    process.exit(0);
  }
  server.close(() => {
    void import("mongoose").then(({ default: mongoose }) =>
      mongoose.connection.close(false).finally(() => process.exit(0)),
    );
  });
  // Backstop so a hung connection cannot block the deploy indefinitely.
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("[fatal] unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[fatal] uncaught exception:", error);
  shutdown("uncaughtException");
});

void startServer().catch((error) => {
  console.error("[fatal] server startup failed:", error);
  process.exit(1);
});

export default app;
