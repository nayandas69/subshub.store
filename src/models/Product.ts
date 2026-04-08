import mongoose, { Schema, Document } from "mongoose";

export interface IPlan {
  id: string; // we keep a local unique string id for frontend mapping
  tier: string;
  price: number;
  duration: string;
  originalPrice?: number;
}

export interface IProduct extends Document {
  productId: string; // explicitly mapped ID matching what the frontend expects
  category: string;  
  name: string;
  description: string;
  badge: string | null;
  icon: string;
  iconBg: string;
  iconColor: string;
  plans: IPlan[];
  features: string[];
}

const PlanSchema = new Schema<IPlan>({
  id: { type: String, required: true },
  tier: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  originalPrice: { type: Number, required: false },
});

const ProductSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    badge: { type: String, default: null },
    icon: { type: String, required: true },
    iconBg: { type: String, required: true },
    iconColor: { type: String, required: true },
    plans: [PlanSchema],
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
