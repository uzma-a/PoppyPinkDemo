// src/pages/admin/index.js
// Server-side Clerk auth check using Pages Router + Clerk v5

import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "../../lib/adminCheck";
import AdminDashboard from "../../components/admin/AdminDashboard";
import Head from "next/head";

export async function getServerSideProps(context) {
  const { req } = context;

  // getAuth() needs the raw req object in Pages Router
  const { userId } = getAuth(req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    if (!isAdmin(user)) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        adminName: user.firstName || user.emailAddresses?.[0]?.emailAddress || "Admin",
      },
    };
  } catch (err) {
    console.error("Admin SSP error:", err.message);
    return {
      redirect: { destination: "/sign-in", permanent: false },
    };
  }
}

export default function AdminPage({ adminName }) {
  return (
    <>
      <Head>
        <title>Admin Panel — POPPYPINK</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AdminDashboard adminName={adminName} />
    </>
  );
}
