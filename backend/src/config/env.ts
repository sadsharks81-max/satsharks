import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredInProduction = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"] as const;

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === "production" && !process.env[key]) {
    throw new Error(`${key} is required in production`);
  }
}

export const env = {
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
};
