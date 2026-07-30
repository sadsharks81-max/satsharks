"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const requiredInProduction = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];
for (const key of requiredInProduction) {
    if (process.env.NODE_ENV === "production" && !process.env[key]) {
        throw new Error(`${key} is required in production`);
    }
}
exports.env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 5000),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    databaseUrl: process.env.DATABASE_URL || "",
    jwtSecret: process.env.JWT_SECRET || "development_access_secret",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "development_refresh_secret",
    isDatabaseConfigured: Boolean(process.env.DATABASE_URL),
    allowMockAuth: process.env.ALLOW_MOCK_AUTH === "true",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    payproClientId: process.env.PAYPRO_CLIENT_ID || "",
    payproSecretKey: process.env.PAYPRO_SECRET_KEY || "",
    livekitUrl: process.env.LIVEKIT_URL || "",
    livekitApiKey: process.env.LIVEKIT_API_KEY || "",
    livekitApiSecret: process.env.LIVEKIT_API_SECRET || "",
    isLiveKitConfigured: Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET),
};
