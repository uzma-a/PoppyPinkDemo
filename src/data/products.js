// src/data/products.js
// Each product has: images[] (multiple angles), colorOptions[] with productId links, sizes[]

export const PRODUCTS = [
  {
    id: 14,
    article: 12160,
    name: "Party Block Mules",
    category: "Slim Heeled Pumps",
    price: 3999,
    offerPrice: 9,
    image: "/assets/Cream-12160/2.jpeg",
    images: [
      "/assets/Cream-12160/2.jpeg",
      "/assets/Cream-12160/1.jpeg",
      "/assets/Cream-12160/3.jpeg",
      "/assets/Cream-12160/4.jpeg",
      "/assets/Cream-12160/5.jpeg",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Black", hex: "#000000", productId: 11 }, // links to id:6
      { name: "Cream", hex: "#f1d4af", productId: 12 }, // links to id:7
      { name: "Cherry", hex: "#421010", productId: 13 }, // self
    ],
    details: {
      Material: "Synthetic",
      heelType: "Slim",
      heelHeight: "2 inches",
      color: "Cream",
    },
  },
  {
    id: 12,
    article: 12160,
    name: "Party Block Mules",
    category: "Slim Heeled Pumps",
    price: 3999,
    offerPrice: 999,
    image: "/assets/Cream-12160/2.jpeg",
    images: [
      "/assets/Cream-12160/2.jpeg",
      "/assets/Cream-12160/1.jpeg",
      "/assets/Cream-12160/3.jpeg",
      "/assets/Cream-12160/4.jpeg",
      "/assets/Cream-12160/5.jpeg",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Black", hex: "#000000", productId: 11 }, // links to id:6
      { name: "Cream", hex: "#f1d4af", productId: 12 }, // links to id:7
      { name: "Cherry", hex: "#421010", productId: 13 }, // self
    ],
    details: {
      Material: "Synthetic",
      heelType: "Slim",
      heelHeight: "2 inches",
      color: "Cream",
    },
  },
  {
    id: 3,
    article: 12113,
    name: "Women Embellished Strappy",
    category: "Wedge Heel Sandals",
    price: 4499,
    offerPrice: 2249,
    image: "/assets/RoseGold-12113/1.JPG",
    images: [
      "/assets/RoseGold-12113/1.JPG",
      "/assets/RoseGold-12113/2.JPG",
      "/assets/RoseGold-12113/3.JPG",
      "/assets/RoseGold-12113/4.JPG",
      "/assets/RoseGold-12113/5.JPG",
      "/assets/RoseGold-12113/6.JPG",
      "/assets/RoseGold-12113/7.JPG",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Rose Gold", hex: "#C9956C", productId: 3 }, // self
      { name: "Silver", hex: "#C0C0C0", productId: 4 }, // links to id:4
    ],
    details: {
      Material: "Synthetic",
      heelType: "Wedge Heel",
      heelHeight: "3 inches",
      color: "Rose-Gold",
    },
  },
  {
    id: 1,
    article: 12151,
    name: "Women Embellished Wedge",
    category: "Wedges Sandal",
    price: 4499,
    offerPrice: 2249,
    image: "/assets/Gold-12151/1.JPG",
    images: [
      "/assets/Gold-12151/1.JPG",
      "/assets/Gold-12151/2.JPG",
      "/assets/Gold-12151/3.JPG",
      "/assets/Gold-12151/4.JPG",
      "/assets/Gold-12151/5.JPG",
      "/assets/Gold-12151/6.JPG",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Gold", hex: "#FFB300", productId: 1 }, // self
      { name: "Rose Gold", hex: "#C9956C", productId: 2 }, // links to id:2
      { name: "Silver", hex: "#C0C0C0", productId: 5 }, // links to id:5
    ],
    details: {
      upperMaterial: "Synthetic Leather",
      heelType: "Wedge Heel",
      heelHeight: "3.2 inches",
      color: "Gold",
    },
  },
  {
    id: 13,
    article: 12160,
    name: "Party Block Mules",
    category: "Slim Heeled Pumps",
    price: 3999,
    offerPrice: 999,
    image: "/assets/Cherry-12160/1.jpeg",
    images: [
      "/assets/Cherry-12160/1.jpeg",
      "/assets/Cherry-12160/2.jpeg",
      "/assets/Cherry-12160/3.jpeg",
      "/assets/Cherry-12160/4.jpeg",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Black", hex: "#000000", productId: 11 }, // links to id:6
      { name: "Cream", hex: "#f1d4af", productId: 12 }, // links to id:7
      { name: "Cherry", hex: "#421010", productId: 13 }, // self
    ],
    details: {
      Material: "Synthetic",
      heelType: "Slim",
      heelHeight: "2 inches",
      color: "Cherry",
    },
  },
  {
    id: 2,
    article: 12151,
    name: "Women Embellished Wedge",
    category: "Wedges Sandal",
    price: 4499,
    offerPrice: 2249,
    image: "/assets/Rose-Gold-12151/1.JPG",
    images: [
      "/assets/Rose-Gold-12151/1.JPG",
      "/assets/Rose-Gold-12151/2.JPG",
      "/assets/Rose-Gold-12151/3.JPG",
      "/assets/Rose-Gold-12151/4.JPG",
      "/assets/Rose-Gold-12151/5.JPG",
      "/assets/Rose-Gold-12151/6.JPG",
      "/assets/Rose-Gold-12151/7.JPG",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Gold", hex: "#FFB300", productId: 1 }, // links to id:1
      { name: "Rose Gold", hex: "#C9956C", productId: 2 },
      { name: "Silver", hex: "#C0C0C0", productId: 5 }, // links to id:5
    ],
    details: {
      upperMaterial: "Synthetic Leather",
      heelType: "Wedge Heel",
      heelHeight: "3.2 inches",
      color: "Rose-Gold",
    },
  },

  
{
    id: 11,
    article: 12160,
    name: "Party Block Mules",
    category: "Slim Heeled Pumps",
    price: 3999,
    offerPrice: 999,
    image: "/assets/Black-12160/1.jpeg",
    images: [
      "/assets/Black-12160/1.jpeg",
      "/assets/Black-12160/2.jpeg",
      "/assets/Black-12160/3.jpeg",
      "/assets/Black-12160/4.jpeg",
      "/assets/Black-12160/5.jpeg",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Black", hex: "#000000", productId: 11 }, // links to id:6
      { name: "Cream", hex: "#f1d4af", productId: 12 }, // links to id:7
      { name: "Cherry", hex: "#421010", productId: 13 }, // self
    ],
    details: {
      Material: "Synthetic",
      heelType: "Slim",
      heelHeight: "2 inches",
      color: "Black",
    },
  },
  {
    id: 4,
    article: 12113,
    name: "Women Embellished Strappy",
    category: "Wedge Heel Sandals",
    price: 4499,
    offerPrice: 2249,
    image: "/assets/Silver-12113/1.jpg",
    images: [
      "/assets/Silver-12113/1.jpg",
      "/assets/Silver-12113/2.jpg",
      "/assets/Silver-12113/3.jpg",
      "/assets/Silver-12113/4.jpg",
      "/assets/Silver-12113/5.jpg",
      "/assets/Silver-12113/6.jpg",
      "/assets/Silver-12113/7.jpg",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Rose Gold", hex: "#C9956C", productId: 3 }, // links to id:3
      { name: "Silver", hex: "#C0C0C0", productId: 4 }, // self
    ],
    details: {
      Material: "Synthetic",
      heelType: "Wedge Heel",
      heelHeight: "3 inches",
      color: "Silver",
    },
  },
  {
    id: 10,
    article: 12159,
    name: "Women Block Mules",
    category: "Block Heel Mules",
    price: 3999,
    offerPrice: 990,
    image: "/assets/Brown-12159/1.jpeg",
    images: [
      "/assets/Brown-12159/1.jpeg",
      "/assets/Brown-12159/2.jpeg",
      "/assets/Brown-12159/3.jpeg",
      "/assets/Brown-12159/4.jpeg",

    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Black", hex: "#000000", productId: 9 },
      { name: "Brown", hex: "rgb(49, 32, 7)", productId: 10 },
    ],
    details: {
      Material: "Synthetic",
      heelType: "Block",
      heelHeight: "2 inches",
      color: "Brown",
    },
  },
 
  {
    id: 5,
    article: 12151,
    name: "Women Embellished Wedge",
    category: "Wedges Sandal",
    price: 4499,
    offerPrice: 2249,
    image: "/assets/Silver-12151/1.JPG",
    images: [
      "/assets/Silver-12151/1.JPG",
      "/assets/Silver-12151/2.JPG",
      "/assets/Silver-12151/3.JPG",
      "/assets/Silver-12151/4.JPG",
      "/assets/Silver-12151/5.JPG",
      "/assets/Silver-12151/6.JPG",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Gold", hex: "#FFB300", productId: 1 }, // links to id:1
      { name: "Rose Gold", hex: "#C9956C", productId: 2 }, // links to id:2
      { name: "Silver", hex: "#C0C0C0", productId: 5 }, // self
    ],
    details: {
      upperMaterial: "Synthetic Leather",
      heelType: "Wedge Heel",
      heelHeight: "3.2 inches",
      color: "Silver",
    },
  },

  {
    id: 6,
    article: 12133,
    name: "Women Embellished Regular",
    category: "Party Block Heel Sandals",
    price: 3299,
    offerPrice: 1649,
    image: "/assets/Gold-12133/1.JPG",
    images: [
      "/assets/Gold-12133/1.JPG",
      "/assets/Gold-12133/2.JPG",
      "/assets/Gold-12133/3.JPG",
      "/assets/Gold-12133/4.jpg",
      "/assets/Gold-12133/5.JPG",
      "/assets/Gold-12133/6.JPG",
      "/assets/Gold-12133/7.JPG",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Gold", hex: "#FFB300", productId: 6 }, // self
      { name: "Silver", hex: "#C0C0C0", productId: 7 }, // links to id:7
      { name: "Rose Gold", hex: "#C9956C", productId: 8 }, // links to id:8
    ],
    details: {
      Material: "Synthetic",
      heelType: "Block",
      heelHeight: "3 inches",
      color: "Gold",
    },
  },
  
 {
    id: 9,
    article: 12159,
    name: "Women Block Mules",
    category: "Block Heel Mules",
    price: 3999,
    offerPrice: 990,
    image: "/assets/Black-12159/1.jpeg",
    images: [
      "/assets/Black-12159/1.jpeg",
      "/assets/Black-12159/2.jpeg",
      "/assets/Black-12159/3.jpeg",
      "/assets/Black-12159/4.jpeg",

    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Black", hex: "#000000", productId: 9 },
      { name: "Brown", hex: "rgb(49, 32, 7)", productId: 10 },
    ],
    details: {
      Material: "Synthetic",
      heelType: "Block",
      heelHeight: "2 inches",
      color: "Black",
    },
  },
  {
    id: 7,
    article: 12133,
    name: "Women Embellished Regular",
    category: "Party Block Heel Sandals",
    price: 3299,
    offerPrice: 1649,
    image: "/assets/Silver-12133/1.JPG",
    images: [
      "/assets/Silver-12133/1.JPG",
      "/assets/Silver-12133/2.jpg",
      "/assets/Silver-12133/3.jpg",
      "/assets/Silver-12133/4.JPG",
      "/assets/Silver-12133/5.JPG",
      "/assets/Silver-12133/6.JPG",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Gold", hex: "#FFB300", productId: 6 }, // links to id:6
      { name: "Silver", hex: "#C0C0C0", productId: 7 }, // self
      { name: "Rose Gold", hex: "#C9956C", productId: 8 }, // links to id:8
    ],
    details: {
      Material: "Synthetic",
      heelType: "Block",
      heelHeight: "3 inches",
      color: "Silver",
    },
  },

  {
    id: 8,
    article: 12133,
    name: "Women Embellished Regular",
    category: "Party Block Heel Sandals",
    price: 3299,
    offerPrice: 1649,
    image: "/assets/RoseGold-12133/0.JPG",
    images: [
      "/assets/RoseGold-12133/0.JPG",
      "/assets/RoseGold-12133/1.JPG",
      "/assets/RoseGold-12133/2.JPG",
      "/assets/RoseGold-12133/3.jpg",
      "/assets/RoseGold-12133/4.JPG",
      "/assets/RoseGold-12133/5.JPG",
      "/assets/RoseGold-12133/6.JPG",
    ],
    sizes: ["3", "4", "5", "6", "7", "8"],
    colorOptions: [
      { name: "Gold", hex: "#FFB300", productId: 6 }, // links to id:6
      { name: "Silver", hex: "#C0C0C0", productId: 7 }, // links to id:7
      { name: "Rose Gold", hex: "#C9956C", productId: 8 }, // self
    ],
    details: {
      Material: "Synthetic",
      heelType: "Block",
      heelHeight: "3 inches",
      color: "Rose Gold",
    },
  },

];