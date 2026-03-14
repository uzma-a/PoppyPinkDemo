// src/pages/api/admin/users.js
// Fetches users from Clerk Backend API
// Requires CLERK_SECRET_KEY in .env.local

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "CLERK_SECRET_KEY not set in .env.local" });
  }

  try {
    const r = await fetch("https://api.clerk.com/v1/users?limit=100&order_by=-created_at", {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!r.ok) {
      const err = await r.json();
      return res.status(r.status).json({ error: err.errors?.[0]?.message || "Clerk API error" });
    }
    const users = await r.json();
    return res.status(200).json({ users });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}