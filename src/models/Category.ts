import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  icon: string; // e.g. "Tv2", "Gamepad2"
  order: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
