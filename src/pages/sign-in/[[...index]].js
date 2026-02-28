// src/pages/sign-in/[[...index]].js
// Must be [[...index]].js (catch-all) for Clerk's routing to work
import { SignIn } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In — POPPYPINK</title>
      </Head>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #FFF8F5 0%, #FFE8D8 50%, #FFF5F0 100%)",
        padding: "2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Brand */}
        <div style={{ marginBottom: "1.8rem", textAlign: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: ".08em", color: "#1A0500" }}>
              POPPY<span style={{ color: "#E8391D" }}>PINK</span>
            </div>
          </Link>
          <p style={{ color: "#B07060", fontSize: ".85rem", marginTop: ".4rem" }}>
            Sign in to your account
          </p>
        </div>

        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      </div>
    </>
  );
}
