import "../config/env";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import Question from "../models/Question";

async function main() {
  await connectDB();
  console.log("Connected to MongoDB.");
  
  const total = await Question.countDocuments({});
  console.log(`Total questions in database: ${total}`);
  
  const bySource = await Question.aggregate([
    { $group: { _id: "$source", count: { $sum: 1 } } }
  ]);
  console.log("Questions by source:", bySource);
  
  const byTag = await Question.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  console.log("Top tags in database:", byTag.slice(0, 10));
  
  await mongoose.disconnect();
}

main().catch(console.error);
