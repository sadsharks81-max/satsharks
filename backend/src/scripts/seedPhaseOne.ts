import "../config/env";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import SubscriptionPlan from "../models/SubscriptionPlan";
import SuccessStory from "../models/SuccessStory";
import { phaseOneSubscriptionPlans, phaseOneSuccessStories } from "../data/phaseOne";

const seedPhaseOne = async () => {
  const connected = await connectDB();

  if (!connected) {
    throw new Error("DATABASE_URL is required to seed Phase 1 data.");
  }

  await Promise.all(
    phaseOneSubscriptionPlans.map((plan) =>
      SubscriptionPlan.updateOne(
        { roleRequired: plan.roleRequired },
        { $set: plan },
        { upsert: true }
      )
    )
  );

  await Promise.all(
    phaseOneSuccessStories.map((story) =>
      SuccessStory.updateOne(
        { name: story.name, university: story.university },
        { $set: story },
        { upsert: true }
      )
    )
  );

  console.log("Phase 1 seed data is ready.");
};

seedPhaseOne()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
