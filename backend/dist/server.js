"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const app = (0, express_1.default)();
const productionFrontendOrigins = new Set([
    env_1.env.frontendUrl,
    "https://satsharks-frontend.vercel.app",
].map((origin) => origin.replace(/\/$/, "")));
const isAllowedProductionOrigin = (origin) => {
    const normalized = origin.replace(/\/$/, "");
    if (productionFrontendOrigins.has(normalized))
        return true;
    try {
        const hostname = new URL(normalized).hostname;
        return hostname === "satsharks.com" ||
            hostname === "www.satsharks.com" ||
            /^satsharks-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(hostname);
    }
    catch {
        return false;
    }
};
// Stripe webhook must come BEFORE express.json() because it needs the raw body
const payment_controller_1 = require("./controllers/payment.controller");
app.post("/api/payment/webhook/stripe", express_1.default.raw({ type: "application/json" }), payment_controller_1.stripeWebhook);
// Middleware
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // In dev, allow all origins (LAN IPs, localhost, etc.)
        if (env_1.env.nodeEnv !== "production") {
            return callback(null, true);
        }
        // In production, allow the configured site and the canonical Vercel domain.
        if (!origin || isAllowedProductionOrigin(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to load cross-origin
}));
app.use((0, morgan_1.default)("dev"));
// Connect to database (or run in mock mode)
(0, db_1.connectDB)();
// Basic Route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "API is running" });
});
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const success_stories_routes_1 = __importDefault(require("./routes/success-stories.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const question_routes_1 = __importDefault(require("./routes/question.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const practice_routes_1 = __importDefault(require("./routes/practice.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const admin_analytics_routes_1 = __importDefault(require("./routes/admin-analytics.routes"));
const sat_routes_1 = __importDefault(require("./routes/sat.routes"));
const consulting_routes_1 = __importDefault(require("./routes/consulting.routes"));
const essay_routes_1 = __importDefault(require("./routes/essay.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const university_routes_1 = __importDefault(require("./routes/university.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const study_material_routes_1 = __importDefault(require("./routes/study-material.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const live_class_routes_1 = __importDefault(require("./routes/live-class.routes"));
const vocabulary_routes_1 = __importDefault(require("./routes/vocabulary.routes"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/subscriptions", subscription_routes_1.default);
app.use("/api/contact", contact_routes_1.default);
app.use("/api/success-stories", success_stories_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/questions", question_routes_1.default);
app.use("/api/tests", test_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/api/practice", practice_routes_1.default);
app.use("/api/uploads", upload_routes_1.default);
app.use("/api/admin/analytics", admin_analytics_routes_1.default);
app.use("/api/sat", sat_routes_1.default);
app.use("/api/consulting", consulting_routes_1.default);
app.use("/api/essays", essay_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
app.use("/api/universities", university_routes_1.default);
app.use("/api/payment", payment_routes_1.default);
app.use("/api/study-materials", study_material_routes_1.default);
app.use("/api/reports", report_routes_1.default);
app.use("/api/live-classes", live_class_routes_1.default);
app.use("/api/vocabulary", vocabulary_routes_1.default);
// Serve uploaded files with cross-origin headers so images load from any network origin
const path_1 = __importDefault(require("path"));
app.use("/uploads", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express_1.default.static(path_1.default.resolve(__dirname, "../uploads")));
// Dynamic Sitemap and Robots.txt
app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "satsharks.com";
    const protocol = req.secure ? "https" : "http";
    const origin = `${protocol}://${host}`;
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
        xml += '  <url>\n';
        xml += `    <loc>${url.loc}</loc>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
    });
    xml += '</urlset>';
    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
});
app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "satsharks.com";
    const protocol = req.secure ? "https" : "http";
    const origin = `${protocol}://${host}`;
    let robots = "User-agent: *\n";
    robots += "Allow: /\n";
    robots += "Disallow: /admin\n";
    robots += "Disallow: /dashboard\n";
    robots += `Sitemap: ${origin}/sitemap.xml\n`;
    res.header("Content-Type", "text/plain");
    res.status(200).send(robots);
});
// Error handling middleware
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Server Error"
    });
});
app.listen(env_1.env.port, () => {
    console.log(`Server running in ${env_1.env.nodeEnv} mode on port ${env_1.env.port}`);
});
