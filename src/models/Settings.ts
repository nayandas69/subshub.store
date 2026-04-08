import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  flashSaleEnabled: boolean;
  flashSaleEndTime: Date | null;
  currency: string;
  popupEnabled: boolean;
  popupText: string;
  popupDelay: number;
}

const SettingsSchema = new Schema<ISettings>(
  {
    flashSaleEnabled: { type: Boolean, default: false },
    flashSaleEndTime: { type: Date, default: null },
    currency: { type: String, default: "$" },
    popupEnabled: { type: Boolean, default: false },
    popupText: { type: String, default: "" },
    popupDelay: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
