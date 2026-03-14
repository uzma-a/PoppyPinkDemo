// src/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },
  offerPrice:  { type: Number, required: true },
  sizes:       { type: [String], default: [] },
  images:      { type: [String], default: [] },
  colorOptions: {
    type: [{ name: String, hex: String }],
    default: [],
  },
  badge:       { type: String, default: "" },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);