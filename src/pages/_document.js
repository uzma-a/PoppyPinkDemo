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
        <meta name="title" content="Poppy Pink Shoes | Women's Footwear in Delhi & India" />
        <meta name="author" content="Poppy Pink Shoes" />
        <meta
          name="description"
          content="Shop POPPYPINK — India's trendy women's footwear brand. Buy stylish sandals, wedge heels, block heels & party wear online. Free delivery. Starting ₹999."
        />
        <meta
          name="keywords"
          content="poppy pink shoes, poppy pink sandals, poppypink, women sandals online india, heels online india, wedge sandals, block heel sandals, party heels, women footwear india, buy sandals online, poppypinkshoes"
        />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://poppypinkshoes.com/" />

        {/* ── Open Graph (WhatsApp / Facebook preview) ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://poppypinkshoes.com/" />
        <meta property="og:site_name" content="POPPYPINK" />
        <meta property="og:title" content="POPPYPINK — Women's Sandals, Heels & Wedges | Shop Online India" />
        <meta property="og:description" content="Shop POPPYPINK — India's trendy women's footwear brand. Buy stylish sandals, wedge heels & party wear online. Free delivery. Starting ₹999." />
        <meta property="og:image" content="https://poppypinkshoes.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="POPPYPINK — Women's Sandals & Heels | Shop Online India" />
        <meta name="twitter:description" content="Trendy women's sandals, wedge heels & party wear. Free delivery across India." />
        <meta name="twitter:image" content="https://poppypinkshoes.com/og-image.jpg" />

        {/* ── Schema.org Structured Data (Google Rich Results) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ShoeStore",

              "name": "Poppy Pink Shoes",
              "alternateName": "PoppyPink",

              "url": "https://poppypinkshoes.com",
              "logo": "https://poppypinkshoes.com/logo.png",
              "image": "https://poppypinkshoes.com/og-image.jpg",

              "description": "Poppy Pink Shoes (PoppyPink brand) is a women's footwear store in Delhi offering trendy sandals, heels, sliders and stylish shoes. Shop affordable women's footwear online in India.",

              "priceRange": "₹999 - ₹2999",
              "currenciesAccepted": "INR",
              "paymentAccepted": "Online Payment",

              "address": {
                "@type": "PostalAddress",
                "streetAddress": "FF WZ 257 CA, Madipur Village",
                "addressLocality": "Punjabi Bagh",
                "addressRegion": "Delhi",
                "postalCode": "110063",
                "addressCountry": "IN"
              },

              "areaServed": "Delhi NCR",

              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9773948133",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              },

              "sameAs": [
                "https://www.instagram.com/poppypinkshoes"
              ]
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