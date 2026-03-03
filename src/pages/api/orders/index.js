// src/pages/api/orders/index.js
// POST → create new order (PUBLIC - no auth needed)
// GET  → list all orders  (admin only)

import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";

function generateOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "PP-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export default async function handler(req, res) {

  // ── POST: Create order (public, no auth) ────────────────────────
  if (req.method === "POST") {
    try {
      await connectDB();

      const { customerName, customerPhone, customerEmail, address, product, totalAmount, paymentMethod } = req.body;

      if (!customerName || !product || !totalAmount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate unique order ID
      let orderId;
      for (let i = 0; i < 5; i++) {
        const candidate = generateOrderId();
        const exists = await Order.findOne({ orderId: candidate }).lean();
        if (!exists) { orderId = candidate; break; }
      }
      if (!orderId) orderId = generateOrderId(); // fallback

      const order = await Order.create({
        orderId,
        userId: "",
        customerName:  customerName.trim(),
        customerPhone: customerPhone?.trim()  || "",
        customerEmail: customerEmail?.trim()  || "",
        address:       address                || {},
        product,
        totalAmount,
        paymentMethod: paymentMethod          || "COD",
        status:        "Processing",
      });

      return res.status(201).json({ success: true, orderId: order.orderId });

    } catch (err) {
      console.error("POST /api/orders:", err.message);
      return res.status(500).json({ error: err.message || "Server error" });
    }
  }

  // ── GET: List all orders (admin only) ───────────────────────────
  if (req.method === "GET") {
    try {
      // Lazy-import Clerk only for admin route so it doesn't break public POST
      const { getAuth }     = await import("@clerk/nextjs/server");
      const { clerkClient } = await import("@clerk/nextjs/server");
      const { isAdmin }     = await import("../../../lib/adminCheck");

      await connectDB();

      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const user = await clerkClient.users.getUser(userId);
      if (!isAdmin(user)) return res.status(403).json({ error: "Forbidden" });

      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, orders });

    } catch (err) {
      console.error("GET /api/orders:", err.message);
      return res.status(500).json({ error: err.message || "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
