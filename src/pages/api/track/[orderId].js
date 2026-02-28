// src/pages/api/track/[orderId].js
// GET /api/track/:orderId  → public order tracking

import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.query;

  if (!orderId || orderId.trim().length < 3) {
    return res.status(400).json({ error: "Invalid Order ID" });
  }

  try {
    await connectDB();

    const order = await Order.findOne(
      { orderId: orderId.trim().toUpperCase() },
      // Only expose safe public fields — never leak userId or adminNote
      { orderId:1, customerName:1, status:1, product:1, totalAmount:1, createdAt:1, updatedAt:1, address:1 }
    ).lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found. Please check your Order ID." });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("GET /api/track/[orderId] error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
