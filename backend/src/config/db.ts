import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    if (!env.databaseUrl) {
      console.warn("DATABASE_URL not found. Running with mock data services.");
      return false;
    }
    
    await mongoose.connect(env.databaseUrl, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
