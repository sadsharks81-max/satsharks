import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentProof extends Document {
  user: mongoose.Types.ObjectId;
  userName?: string;
  userEmail?: string;
  planId: string;
  planName: string;
  amount: string;
  paymentMethod: "BANK" | "EASYPAISA" | "JAZZCASH" | "CARD" | "WALLET";
  screenshotUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentProofSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, trim: true, maxlength: 200 },
    userEmail: { type: String, trim: true, lowercase: true, maxlength: 320 },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    amount: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["BANK", "EASYPAISA", "JAZZCASH", "CARD", "WALLET"],
      required: true,
    },
    // Cleared as soon as the payment is approved/rejected. Settled records keep
    // payment metadata only; the sensitive receipt is never retained.
    screenshotUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

PaymentProofSchema.index({ status: 1 });
PaymentProofSchema.index({ user: 1 });
PaymentProofSchema.index({ processedAt: -1 });

export default mongoose.model<IPaymentProof>("PaymentProof", PaymentProofSchema);
