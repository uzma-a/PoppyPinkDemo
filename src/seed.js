// src/seed.js
require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");
const { PRODUCTS } = require("./data/products.js");
const Product = require("./models/Product.js").default;

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ article: p.article, "details.color": p.details.color });
    if (exists) {
      console.log(`Skipping (already exists): ${p.name} - ${p.details.color}`);
      continue;
    }

    await Product.create({
      name: p.name,
      category: p.category,
      price: p.price,
      offerPrice: p.offerPrice,
      sizes: p.sizes,
      images: p.images,
      colorOptions: p.colorOptions,
      badge: p.badge || "",
      isActive: true,
    });
    console.log(`Added: ${p.name} - ${p.details.color}`);
  }

  console.log("Seeding done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});