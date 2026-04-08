import mongoose, { Schema, Document } from "mongoose";

export interface IBadge extends Document {
  name: string;
  colorClass: string; // e.g. "badge-green", "badge-primary"
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true },
    colorClass: { type: String, required: true, default: "badge-green" },
  },
  { timestamps: true }
);

export default mongoose.models.Badge || mongoose.model<IBadge>("Badge", BadgeSchema);
