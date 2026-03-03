// src/lib/mongodb.js
// FIX: Don't throw at module level — throw inside connectDB() so errors
//      are caught by the API route's try/catch and return proper JSON.

import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  // Throw here (inside function) so it's caught by API try/catch → returns JSON
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in .env.local");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 20000,
      })
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // reset so next call retries
    throw e;
  }

  return cached.conn;
}

export default connectDB;
