import "../config/env";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import SATTest from "../models/SATTest";

async function main() {
  const connected = await connectDB();
  if (!connected) return;

  const tests = await SATTest.find().sort({ testNumber: 1 });
  console.log("=== TESTS IN DATABASE ===");
  for (const t of tests) {
    console.log(`TestNumber: ${t.testNumber} | Title: "${t.title}" | Modules: ${t.modules.length}`);
  }
  await mongoose.disconnect();
}

main().catch(console.error);
