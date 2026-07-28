import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentProof extends Document {
  user: mongoose.Types.ObjectId;
  planId: string;
  planName: string;
  amount: string;
  paymentMethod: "BANK" | "EASYPAISA" | "JAZZCASH" | "CARD" | "WALLET";
  screenshotUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const PaymentProofSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    amount: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["BANK", "EASYPAISA", "JAZZCASH", "CARD", "WALLET"],
      required: true,
    },
    screenshotUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

PaymentProofSchema.index({ status: 1 });
PaymentProofSchema.index({ user: 1 });

export default mongoose.model<IPaymentProof>("PaymentProof", PaymentProofSchema);
