import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/User";
import { hashPassword } from "../src/utils/password";

dotenv.config();

const createPaidTestUser = async () => {
  const email = process.env.TEST_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.TEST_USER_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL;
  if (!email || !password) {
    throw new Error("TEST_USER_EMAIL and TEST_USER_PASSWORD are required");
  }
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

  await mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 10_000 });
  const now = new Date();
  const portalAccessStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const portalAccessEnd = new Date(now);
  portalAccessEnd.setFullYear(portalAccessEnd.getFullYear() + 1);

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Live Class Paid Test Student",
        email,
        password: await hashPassword(password),
        role: "STUDENT",
        country: "Pakistan",
        region: "LOCAL",
        subscription: "PAID",
        subscriptionPlan: "Live Class Testing",
        subscriptionExpiry: portalAccessEnd,
        portalAccessStart,
        portalAccessEnd,
        status: "ACTIVE",
        sessionId: null,
        targetScore: 1400,
        dailyGoal: 10,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  )
    .select("_id email role subscription status portalAccessEnd")
    .lean();

  console.log(
    JSON.stringify(
      {
        createdOrUpdated: true,
        id: String(user!._id),
        email: user!.email,
        role: user!.role,
        subscription: user!.subscription,
        status: user!.status,
        portalAccessEnd: user!.portalAccessEnd,
      },
      null,
      2,
    ),
  );
};

createPaidTestUser()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Unable to create paid test user",
    );
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
