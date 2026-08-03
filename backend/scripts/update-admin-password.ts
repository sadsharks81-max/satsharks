import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../src/models/User";

dotenv.config();

const updateAdminPassword = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("No DATABASE_URL found.");
      process.exit(1);
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB...");

    const email = "admin@satsharks.com";
    const rawPassword = "@satsharks123@";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const existing = await User.findOne({ email }).select("+password");
    if (!existing) {
      console.error(`No user found with email ${email}.`);
      process.exit(1);
    }

    existing.password = hashedPassword;
    await existing.save();
    console.log(`Updated password for ${email}.`);

    process.exit(0);
  } catch (error) {
    console.error("Error updating admin password:", error);
    process.exit(1);
  }
};

updateAdminPassword();
