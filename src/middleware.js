import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/cart(.*)",
  // /track removed — Google should be able to crawl it
]);

export default clerkMiddleware((auth, req) => {
  // Bypass bots — Googlebot ko redirect mat karo
  const ua = req.headers.get("user-agent") || "";
  const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex/i.test(ua);
  if (isBot) return;

  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
