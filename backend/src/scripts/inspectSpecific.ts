import "../config/env";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import SATTest from "../models/SATTest";
import Question from "../models/Question";

async function main() {
  const connected = await connectDB();
  if (!connected) {
    console.error("Database connection failed");
    return;
  }
  
  const questions = await Question.find({ text: /For certain altitudes/i });
  console.log(`Found ${questions.length} questions matching "For certain altitudes":`);
  for (const q of questions) {
    console.log(`- ID: ${q._id}, Text: "${q.text}"`);
    console.log(`  Options:`, q.options);
  }
  
  await mongoose.disconnect();
}

main().catch(console.error);
