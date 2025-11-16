import mongoose, { Schema, Document, models } from "mongoose";

export interface IBooking extends Document {
  userId: string | null;
  name: string;
  age: number;
  phone: string;
  email: string;
  type: "clinic" | "quick";
  price: number;
  date: string;
  day: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  trackingCode: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["clinic", "quick"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    trackingCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
