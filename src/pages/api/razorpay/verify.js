// src/pages/api/razorpay/verify.js
import crypto   from "crypto";
import dbConnect from "../../../lib/dbConnect";
import Order    from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,           // full order payload to save to MongoDB
  } = req.body;

  // ── 1. Verify Razorpay signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Payment verification failed. Invalid signature." });
  }

  // ── 2. Signature valid → save order to MongoDB
  try {
    await dbConnect();

    // Generate PP-XXXXX order ID
    const orderId =
      "PP-" +
      Math.random().toString(36).toUpperCase().slice(2, 7) +
      Math.random().toString(36).toUpperCase().slice(2, 4);

    const order = await Order.create({
      orderId,
      customerName:      orderData.customerName,
      customerPhone:     orderData.customerPhone,
      customerEmail:     orderData.customerEmail || "",
      userId:            orderData.userId        || "",
      address:           orderData.address,
      product:           orderData.product,
      totalAmount:       orderData.totalAmount,
      paymentMethod:     "Online",
      paymentStatus:     "paid",
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status:            "confirmed",
    });

    return res.status(200).json({ success: true, orderId: order.orderId });
  } catch (err) {
    console.error("Razorpay verify / save order error:", err);
    return res.status(500).json({ error: err.message || "Failed to save order" });
  }
}