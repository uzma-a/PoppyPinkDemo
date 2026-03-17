// src/pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ── Favicon ── */}
        <link rel="icon" href="/favicon.ico" />

        {/* ── Fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ── Theme ── */}
        <meta name="theme-color" content="#e55d6a" />

        {/* ── Primary SEO ── */}
        <meta name="title" content="POPPYPINK — Women's Sandals, Heels & Wedges | Shop Online India" />
        <meta
          name="description"
          content="Shop POPPYPINK — India's trendy women's footwear brand. Buy stylish sandals, wedge heels, block heels & party wear online. Free delivery. Starting ₹999."
        />
        <meta
          name="keywords"
          content="poppy pink shoes, poppy pink sandals, poppypink, women sandals online india, heels online india, wedge sandals, block heel sandals, party heels, women footwear india, buy sandals online, poppypinkshoes"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="POPPYPINK" />
        <link rel="canonical" href="https://poppypinkshoes.com/" />

        {/* ── Open Graph (WhatsApp / Facebook preview) ── */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://poppypinkshoes.com/" />
        <meta property="og:site_name"   content="POPPYPINK" />
        <meta property="og:title"       content="POPPYPINK — Women's Sandals, Heels & Wedges | Shop Online India" />
        <meta property="og:description" content="Shop POPPYPINK — India's trendy women's footwear brand. Buy stylish sandals, wedge heels & party wear online. Free delivery. Starting ₹999." />
        <meta property="og:image"       content="https://poppypinkshoes.com/og-image.jpg" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale"      content="en_IN" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="POPPYPINK — Women's Sandals & Heels | Shop Online India" />
        <meta name="twitter:description" content="Trendy women's sandals, wedge heels & party wear. Free delivery across India. Starting ₹999." />
        <meta name="twitter:image"       content="https://poppypinkshoes.com/og-image.jpg" />

        {/* ── Schema.org Structured Data (Google Rich Results) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "POPPYPINK",
              "url": "https://poppypinkshoes.com",
              "logo": "https://poppypinkshoes.com/logo.png",
              "image": "https://poppypinkshoes.com/og-image.jpg",
              "description": "India's trendy women's footwear brand — sandals, wedge heels, block heels & party wear. Free delivery. Starting ₹999.",
              "priceRange": "₹999 - ₹2999",
              "currenciesAccepted": "INR",
              "paymentAccepted": "Online Payment",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9773948133",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": []
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
