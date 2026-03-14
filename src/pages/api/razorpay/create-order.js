// src/pages/api/razorpay/create-order.js
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { amount, currency = "INR", receipt } = req.body;

  if (!amount || amount < 1)
    return res.status(400).json({ error: "Invalid amount" });

  try {
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency,
      receipt:  receipt || `rcpt_${Date.now()}`,
    });

    return res.status(200).json({
      id:       order.id,       // razorpay order id
      amount:   order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return res.status(500).json({ error: err.message || "Failed to create payment order" });
  }
}