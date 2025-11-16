import mongoose from "mongoose";

const quickSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: { type: String, required: true },
    price: { type: Number, default: 50 },
    status: { type: String, default: "pending" }, // pending | replied | closed
    trackingCode: String,
  },
  { timestamps: true }
);

export default mongoose.models.QuickQuery ||
  mongoose.model("QuickQuery", quickSchema);
