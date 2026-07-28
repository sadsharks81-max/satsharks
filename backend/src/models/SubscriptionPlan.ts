import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  roleRequired: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], required: true },
    roleRequired: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);
