// src/middleware.js
// ─────────────────────────────────────────────────────────
// IMPORTANT: This file lives in src/ because the project uses src/ directory
// Clerk v5 Pages Router — async middleware with proper protect() call
// ─────────────────────────────────────────────────────────

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect /admin routes — unauthenticated users get redirected to sign-in
  if (isAdminRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
    "/(api|trpc)(.*)",
  ],
};
