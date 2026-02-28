// src/pages/api/orders/[id].js
// GET  /api/orders/:orderId  → single order (admin)
// PATCH /api/orders/:orderId → update status (admin)

import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { isAdmin } from "../../../lib/adminCheck";

const VALID_STATUSES = ["Processing","Confirmed","Shipped","Out for Delivery","Delivered","Cancelled"];

export default async function handler(req, res) {
  await connectDB();

  // Auth check for all methods
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await clerkClient.users.getUser(userId);
  if (!isAdmin(user)) return res.status(403).json({ error: "Forbidden — admins only" });

  const { id } = req.query;

  // ── GET single order ──────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const order = await Order.findOne({ orderId: id }).lean();
      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.status(200).json({ success: true, order });
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  // ── PATCH: update status + adminNote ─────────────────────────────
  if (req.method === "PATCH") {
    try {
      const { status, adminNote } = req.body;

      if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Valid: ${VALID_STATUSES.join(", ")}` });
      }

      const update = {};
      if (status) update.status = status;
      if (adminNote !== undefined) update.adminNote = adminNote;

      const order = await Order.findOneAndUpdate(
        { orderId: id },
        { $set: update },
        { new: true }
      ).lean();

      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.status(200).json({ success: true, order });

    } catch (err) {
      console.error("PATCH /api/orders/[id] error:", err.message);
      return res.status(500).json({ error: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
