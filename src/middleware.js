// src/middleware.js
// IMPORTANT: Must be in src/ directory (not project root) when using src/ layout
// FIX: Exclude /api/orders (public) from Clerk middleware to avoid HTML error responses

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ONLY protect the admin dashboard page — NOT public API routes
const isAdminPage = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminPage(req)) {
    await auth.protect();
  }
  // All other routes (including /api/orders) pass through freely
});

export const config = {
  matcher: [
    // Skip static files and images entirely
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
