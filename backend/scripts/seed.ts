import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../src/models/User";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@satsharks.com",
    password: "password123",
    role: "ADMIN",
    country: "USA",
    region: "INTERNATIONAL",
    subscription: "FREE",
    status: "ACTIVE",
  },
  {
    name: "Student 1",
    email: "localfree@test.com",
    password: "password123",
    role: "STUDENT",
    country: "Pakistan",
    region: "LOCAL",
    subscription: "FREE",
    status: "ACTIVE",
  },
  {
    name: "Student 2",
    email: "localpaid@test.com",
    password: "password123",
    role: "STUDENT",
    country: "Pakistan",
    region: "LOCAL",
    subscription: "PAID",
    status: "ACTIVE",
  },
  {
    name: "Student 3",
    email: "internationalfree@test.com",
    password: "password123",
    role: "STUDENT",
    country: "USA",
    region: "INTERNATIONAL",
    subscription: "FREE",
    status: "ACTIVE",
  },
  {
    name: "Student 4",
    email: "internationalpaid@test.com",
    password: "password123",
    role: "STUDENT",
    country: "Canada",
    region: "INTERNATIONAL",
    subscription: "PAID",
    status: "ACTIVE",
  },
];

const seedDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("No DATABASE_URL found. Skipping seed.");
      process.exit(0);
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Insert new
    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`Created user: ${u.email}`);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();
