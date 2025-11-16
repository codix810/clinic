import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    clinicName: String,
    address: String,
    phone1: String,
    phone2: String,
    logo: String,
    priceClinic: Number,
    priceQuick: Number,
    workingHours: String,
    whatsappMessage: String,
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
