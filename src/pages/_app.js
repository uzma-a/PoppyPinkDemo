import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "../context/CartContext";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </ClerkProvider>
  );
}