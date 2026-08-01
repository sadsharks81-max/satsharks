import mongoose from "mongoose";
import { env } from "./env";

/**
 * Fail fast on a malformed filter instead of silently ignoring it. With the
 * default (`strictQuery: false`) a typo'd or injected field name is dropped from
 * the query, so `find({ notAField: x })` quietly matches the entire collection.
 */
mongoose.set("strictQuery", true);
// Mongoose 7+ default, set explicitly so an unknown path in an update is an
// error rather than a silently discarded write.
mongoose.set("strict", true);

export const connectDB = async () => {
  try {
    if (!env.databaseUrl) {
      console.warn("DATABASE_URL not found. Running with mock data services.");
      return false;
    }

    await mongoose.connect(env.databaseUrl, {
      serverSelectionTimeoutMS: 10000,
      // Bounds the pool so a traffic spike cannot exhaust the cluster's
      // connection allowance; the driver default (100) is far above what a
      // single instance of this API needs.
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
      minPoolSize: 0,
      socketTimeoutMS: 45000,
      // Keeps a slow query from occupying a pool slot indefinitely.
      maxIdleTimeMS: 60000,
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);

    // Post-connection faults previously went unobserved: the process kept
    // serving traffic against a dead connection with no signal in the logs.
    mongoose.connection.on("error", (error) => {
      console.error("[error] mongodb connection:", error);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("[warn] mongodb disconnected; driver will attempt to reconnect");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("mongodb reconnected");
    });

    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
