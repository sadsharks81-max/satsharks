import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../src/models/User";

dotenv.config();

const addAdmin2 = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("No DATABASE_URL found.");
      process.exit(1);
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB...");

    const email = "admin2@satsharks.com";
    const rawPassword = "password123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const existing = await User.findOne({ email });
    if (existing) {
      existing.name = "Admin 2";
      existing.password = hashedPassword;
      existing.role = "ADMIN";
      existing.status = "ACTIVE";
      existing.subscription = "PAID";
      await existing.save();
      console.log(`Updated existing Admin 2 user (${email}).`);
    } else {
      await User.create({
        name: "Admin 2",
        email,
        password: hashedPassword,
        role: "ADMIN",
        country: "USA",
        region: "INTERNATIONAL",
        subscription: "PAID",
        status: "ACTIVE",
      });
      console.log(`Created new Admin 2 user (${email}).`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating Admin 2:", error);
    process.exit(1);
  }
};

addAdmin2();
