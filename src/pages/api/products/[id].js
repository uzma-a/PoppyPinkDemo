// src/pages/api/products/[id].js
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { name, category, price, offerPrice, sizes, images, colorOptions, badge, article, color, colorHex, material, heelType, heelHeight } = req.body;

      const updated = await Product.findByIdAndUpdate(
        id,
        {
          name, category,
          article: article !== undefined ? Number(article) : undefined,
          color: color || "",
          colorHex: colorHex || "#e55d6a",
          material: material || "",
          heelType: heelType || "",
          heelHeight: heelHeight || "",
          price: Number(price),
          offerPrice: Number(offerPrice),
          sizes: sizes || [],
          images: images || [],
          colorOptions: colorOptions || [],
          badge: badge || "",
        },
        { new: true }
      );
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
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}