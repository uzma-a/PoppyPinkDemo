// src/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId:       { type: String, required: true, unique: true, trim: true },
  userId:        { type: String, default: "" },
  customerName:  { type: String, required: true, trim: true },
  customerPhone: { type: String, default: "" },
  customerEmail: { type: String, default: "", lowercase: true },
  address: {
    line1:   { type: String, default: "" },
    city:    { type: String, default: "" },
    state:   { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  product: {
    id:       { type: Number,  required: true },
    name:     { type: String,  required: true },
    article:  { type: String,  default: "" },     // ← added
    category: { type: String,  default: "" },
    size:     { type: String,  default: "" },
    color:    { type: String,  default: "" },
    qty:      { type: Number,  default: 1 },
    price:    { type: Number,  required: true },
    image:    { type: String,  default: "" },
  },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type:    String,
    enum:    ["COD", "Online"],
    default: "Online",
  },
  paymentStatus: {
    type:    String,
    enum:    ["pending", "paid", "failed"],
    default: "pending",
  },
  razorpayOrderId:   { type: String, default: "" },
  razorpayPaymentId: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "processing", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },
  adminNote: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);