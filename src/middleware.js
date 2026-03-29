import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/cart(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/", "/products(.*)", "/about(.*)", "/track(.*)",
  "/sign-in(.*)", "/sign-up(.*)", "/login(.*)",
  "/api/products(.*)", "/api/track(.*)", "/api/orders(.*)",
  "/sitemap.xml", "/robots.txt",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
