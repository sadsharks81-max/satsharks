import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User";
import { hashPassword } from "../src/utils/password";

dotenv.config();

const updateAdminPassword = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("No DATABASE_URL found.");
      process.exit(1);
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB...");

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const rawPassword = process.env.ADMIN_PASSWORD;

    if (!email || !rawPassword) {
      console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
      process.exit(1);
    }

    if (rawPassword.length < 8) {
      console.error("ADMIN_PASSWORD must be at least 8 characters.");
      process.exit(1);
    }

    const existing = await User.findOne({ email }).select("role");
    if (!existing) {
      console.error(`No user found with email ${email}.`);
      process.exit(1);
    }

    if (existing.role !== "ADMIN") {
      console.error(`Refusing to update ${email}: the account is not an administrator.`);
      process.exit(1);
    }

    await User.updateOne(
      { _id: existing._id },
      { $set: { password: await hashPassword(rawPassword) } },
    );
    console.log(`Updated password for ${email}.`);

    process.exit(0);
  } catch (error) {
    console.error("Error updating admin password:", error);
    process.exit(1);
  }
};

updateAdminPassword();
