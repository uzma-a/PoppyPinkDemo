// src/pages/api/products/index.js
import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/Product";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
      return res.status(200).json({ products });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        name, category, price, offerPrice,
        sizes, images, colorOptions, badge,
      } = req.body;

      if (!name || !category || !price || !offerPrice) {
        return res.status(400).json({ error: "name, category, price, offerPrice are required" });
      }

      const product = await Product.create({
        name,
        category,
        price:       Number(price),
        offerPrice:  Number(offerPrice),
        sizes:       sizes || [],
        images:      images || [],
        colorOptions: colorOptions || [],
        badge:       badge || "",
        isActive:    true,
      });

      return res.status(201).json({ product });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}