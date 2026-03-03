// src/pages/api/orders/[id].js
// GET   /api/orders/:orderId  → single order (admin)
// PATCH /api/orders/:orderId  → update status (admin)

import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";

const VALID_STATUSES = ["Processing","Confirmed","Shipped","Out for Delivery","Delivered","Cancelled"];

export default async function handler(req, res) {
  try {
    // Admin-only — lazy import Clerk
    const { getAuth }     = await import("@clerk/nextjs/server");
    const { clerkClient } = await import("@clerk/nextjs/server");
    const { isAdmin }     = await import("../../../lib/adminCheck");

    await connectDB();

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await clerkClient.users.getUser(userId);
    if (!isAdmin(user)) return res.status(403).json({ error: "Forbidden" });

    const { id } = req.query;

    if (req.method === "GET") {
      const order = await Order.findOne({ orderId: id }).lean();
      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.status(200).json({ success: true, order });
    }

    if (req.method === "PATCH") {
      const { status, adminNote } = req.body;
      if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const update = {};
      if (status)              update.status    = status;
      if (adminNote !== undefined) update.adminNote = adminNote;

      const order = await Order.findOneAndUpdate(
        { orderId: id },
        { $set: update },
        { new: true }
      ).lean();

      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.status(200).json({ success: true, order });
    }

    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (err) {
    console.error("orders/[id] error:", err.message);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
