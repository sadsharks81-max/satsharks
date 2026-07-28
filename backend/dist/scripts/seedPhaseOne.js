"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const SubscriptionPlan_1 = __importDefault(require("../models/SubscriptionPlan"));
const SuccessStory_1 = __importDefault(require("../models/SuccessStory"));
const phaseOne_1 = require("../data/phaseOne");
const seedPhaseOne = async () => {
    const connected = await (0, db_1.connectDB)();
    if (!connected) {
        throw new Error("DATABASE_URL is required to seed Phase 1 data.");
    }
    await Promise.all(phaseOne_1.phaseOneSubscriptionPlans.map((plan) => SubscriptionPlan_1.default.updateOne({ roleRequired: plan.roleRequired }, { $set: plan }, { upsert: true })));
    await Promise.all(phaseOne_1.phaseOneSuccessStories.map((story) => SuccessStory_1.default.updateOne({ name: story.name, university: story.university }, { $set: story }, { upsert: true })));
    console.log("Phase 1 seed data is ready.");
};
seedPhaseOne()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
