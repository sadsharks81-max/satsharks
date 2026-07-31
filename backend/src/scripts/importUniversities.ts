import "../config/env";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db";
import University from "../models/University";

async function main() {
  const connected = await connectDB();
  if (!connected) {
    console.error("Failed to connect to database.");
    process.exit(1);
  }

  const jsonPath = path.resolve(__dirname, "../../../reference_data/universitymatcher/universities.json");
  if (!fs.existsSync(jsonPath)) {
    console.error(`JSON file not found at: ${jsonPath}`);
    process.exit(1);
  }

  console.log("Reading universities.json...");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const universities = JSON.parse(rawData);

  console.log(`Found ${universities.length} universities in JSON.`);

  const sheetName = "Verified Database";
  
  console.log(`Clearing existing universities for sheet "${sheetName}"...`);
  const deleteResult = await University.deleteMany({ sheetName });
  console.log(`Deleted ${deleteResult.deletedCount} existing universities.`);

  try {
    console.log("Dropping old unique index uniId_1 if it exists...");
    await University.collection.dropIndex("uniId_1");
    console.log("Dropped old unique index uniId_1.");
  } catch (err) {
    console.log("Old index uniId_1 did not exist or already dropped.");
  }

  console.log("Inserting new universities...");
  const insertResult = await University.insertMany(universities);
  console.log(`Successfully inserted ${insertResult.length} universities.`);

  console.log("Database sync complete!");
}

main()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
