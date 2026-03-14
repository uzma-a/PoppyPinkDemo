// src/pages/api/products/[id].js
import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/Order";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ product: updated });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      // Soft delete — just mark inactive
      const updated = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!updated) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}