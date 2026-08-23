// src/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  article: { type: Number },
  color: { type: String, default: "" },
  colorHex: { type: String, default: "#e55d6a" },
  price: Number,
  offerPrice: Number,
  sizes: [String],
  images: [String],
  colorOptions: [{ name: String, hex: String, productId: String }],
  material: { type: String, default: "" },
  heelType: { type: String, default: "" },
  heelHeight: { type: String, default: "" },
  badge: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);