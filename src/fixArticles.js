// src/fixArticles.js
require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");
const { PRODUCTS } = require("./data/products.js");
const Product = require("./models/Product.js").default;

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  for (const p of PRODUCTS) {
    const match = await Product.findOne({ name: p.name, offerPrice: p.offerPrice, images: p.images[0] });
    if (!match) {
      console.log(`Not found: ${p.name} - ${p.details.color}`);
      continue;
    }
    match.article = p.article;
    match.color = p.details.color;
    match.colorHex = p.details.hex;
    await match.save();
    console.log(`Fixed: ${p.name} - ${p.details.color} -> article ${p.article}`);
  }

  console.log("Done!");
  process.exit(0);
}

fix().catch((err) => {
  console.error(err);
  process.exit(1);
});