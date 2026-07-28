import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User";

dotenv.config();

const migrateDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("No DATABASE_URL found. Skipping migration.");
      process.exit(0);
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB for migration...");

    const users = await User.find({});
    console.log(`Found ${users.length} users to analyze...`);

    let updatedCount = 0;

    for (const user of users) {
      let needsUpdate = false;

      // Handle missing country
      if (!user.country || user.country === "Unknown") {
        if (user.region === "LOCAL") {
          user.country = "Pakistan";
        } else if (user.region === "INTERNATIONAL") {
          user.country = "USA";
        } else {
          user.country = "Pakistan";
        }
        needsUpdate = true;
      }

      // Recalculate region correctly based on country
      const expectedRegion = user.country.toLowerCase() === "pakistan" ? "LOCAL" : "INTERNATIONAL";
      if (user.region !== expectedRegion) {
        user.region = expectedRegion;
        needsUpdate = true;
      }

      // Handle subscription
      if (!user.subscription) {
        user.subscription = "FREE";
        needsUpdate = true;
      }

      // Handle status
      if (!user.status) {
        user.status = "ACTIVE";
        needsUpdate = true;
      }

      if (needsUpdate) {
        await user.save();
        updatedCount++;
        console.log(`Migrated user: ${user.email}`);
      }
    }

    console.log(`Migration complete! ${updatedCount} users updated.`);
    process.exit(0);
  } catch (error) {
    console.error("Error migrating DB:", error);
    process.exit(1);
  }
};

migrateDB();
