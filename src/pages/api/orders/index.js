// src/pages/api/orders/index.js
import dbConnect from "../../../lib/dbConnect";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  await dbConnect();

  // ── GET: fetch orders (admin gets all, user gets their own via ?userId=)
  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      // If userId param provided → return only that user's orders
      const filter = userId ? { userId } : {};

      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ orders });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── POST: create new order
  if (req.method === "POST") {
    try {
      const {
        customerName, customerPhone, customerEmail,
        userId, address, product, totalAmount, paymentMethod,
      } = req.body;

      if (!customerName || !customerPhone || !address || !product) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate unique order ID: PP-XXXXX
      const orderId =
        "PP-" +
        Math.random().toString(36).toUpperCase().slice(2, 7) +
        Math.random().toString(36).toUpperCase().slice(2, 4);

      const order = await Order.create({
        orderId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || "",
        userId:        userId        || "",
        address,
        product,
        totalAmount,
        paymentMethod: paymentMethod || "COD",
        status: "pending",   // ✅ matches enum in Order model
      });

      return res.status(201).json({ orderId: order.orderId, order });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}