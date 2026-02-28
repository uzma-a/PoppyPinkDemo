// src/pages/api/orders/index.js
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { isAdmin } from "../../../lib/adminCheck";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export default async function handler(req, res) {
  await connectDB();

  // ── GET all orders (admin only) ──────────────────────────────────
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const user = await clerkClient.users.getUser(userId);
      if (!isAdmin(user)) return res.status(403).json({ error: "Forbidden — admins only" });

      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, orders });

    } catch (err) {
      console.error("GET /api/orders error:", err.message);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // ── POST create order (public) ───────────────────────────────────
  if (req.method === "POST") {
    try {
      const { customerName, customerPhone, customerEmail, address, product, totalAmount } = req.body;

      if (!customerName || !product || !totalAmount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Optional: attach userId if user is signed in
      let userId = "";
      try { userId = getAuth(req).userId || ""; } catch (_) {}

      const orderId = "PP-" + nanoid();

      const order = await Order.create({
        orderId,
        userId,
        customerName: customerName.trim(),
        customerPhone: customerPhone?.trim() || "",
        customerEmail: customerEmail?.trim() || "",
        address: address || {},
        product,
        totalAmount,
        status: "Processing",
      });

      return res.status(201).json({ success: true, orderId: order.orderId });

    } catch (err) {
      console.error("POST /api/orders error:", err.message);
      if (err.code === 11000) return res.status(409).json({ error: "Duplicate orderId, retry" });
      return res.status(500).json({ error: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
