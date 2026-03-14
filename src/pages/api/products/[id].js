// src/pages/api/products/[id].js
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ product });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { name, category, price, offerPrice, sizes, images, colorOptions, badge } = req.body;
      const product = await Product.findByIdAndUpdate(
        id,
        { name, category, price: Number(price), offerPrice: Number(offerPrice), sizes, images, colorOptions, badge },
        { new: true }
      );
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ product });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}