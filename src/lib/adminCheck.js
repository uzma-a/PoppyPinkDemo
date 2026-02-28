// src/lib/adminCheck.js
export function isAdmin(user) {
  if (!user) return false;
  if (user.publicMetadata?.role === "admin") return true;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  return email ? adminEmails.includes(email) : false;
}
