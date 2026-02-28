// src/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId:      { type: String, required: true, unique: true, trim: true },
  userId:       { type: String, default: "" },
  customerName: { type: String, required: true, trim: true },
  customerPhone:{ type: String, default: "" },
  customerEmail:{ type: String, default: "", lowercase: true },
  address: {
    line1:   { type: String, default: "" },
    city:    { type: String, default: "" },
    state:   { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  product: {
    id:       { type: Number, required: true },
    name:     { type: String, required: true },
    category: { type: String, default: "" },
    size:     { type: String, default: "" },
    color:    { type: String, default: "" },
    qty:      { type: Number, default: 1 },
    price:    { type: Number, required: true },
    image:    { type: String, default: "" },
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Processing","Confirmed","Shipped","Out for Delivery","Delivered","Cancelled"],
    default: "Processing",
  },
  adminNote: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
