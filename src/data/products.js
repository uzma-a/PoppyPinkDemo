// src/data/products.js
// Each product has: images[] (multiple angles), colorOptions[], sizes[]

export const PRODUCTS = [
  {
    id: 1, name: "Blossom Slide", category: "Party Wear", price: 2499, offerPrice: 1499,
    image: "/assets/Rose Gold-12113/1.JPG",
    images: [
      "/assets/Rose Gold-12113/2.JPG",
      "/assets/Rose Gold-12113/3.JPG",
      "/assets/Rose Gold-12113/4.JPG",
      "/assets/Rose Gold-12113/5.JPG",
      "/assets/Rose Gold-12113/6.JPG",
      "/assets/Rose Gold-12113/7.JPG",
    ],
    sizes: ["35","36","37","38","39","40"],
    colorOptions: [
      { name:"Ivory White",hex:"#F5F0E8" },
      { name:"Blush Pink", hex:"#F4A0A0" },
    ],
  },
  {
    id: 2, name: "Velvet Rose Heel", category: "Party Wear", price: 4999, offerPrice: 3199,
    image: "/assets/Silver-12113/1.JPG",
    images: [
      "/assets/Silver-12113/2.JPG",
      "/assets/Silver-12113/3.JPG",
      "/assets/Silver-12113/4.JPG",
      "/assets/Silver-12113/5.JPG",
      "/assets/Silver-12113/6.JPG",
      "/assets/Silver-12113/7.JPG",
    ],
    sizes: ["35","36","37","38","39"],
    colorOptions: [
      { name:"Rose Gold",  hex:"#C9956C" },
      { name:"Coral",      hex:"#E8391D" },
    ],
  },
]