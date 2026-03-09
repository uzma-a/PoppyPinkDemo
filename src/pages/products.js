// src/pages/products.js
import { useState, useRef } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { PRODUCTS } from "../data/products";
import dbConnect from "../lib/dbConnect";
import ProductModel from "../models/Product";

const BRAND = "#e55d6a";

export async function getServerSideProps() {
  try {
    await dbConnect();
    const dbProducts = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    const normalized = dbProducts.map(p => ({
      id:           p._id.toString(),
      name:         p.name,
      category:     p.category,
      price:        p.price,
      offerPrice:   p.offerPrice,
      sizes:        p.sizes        || [],
      images:       p.images       || [],
      image:        p.images?.[0]  || "",
      colorOptions: p.colorOptions || [],
      badge:        p.badge        || "",
    }));

    const allProducts = [...normalized, ...PRODUCTS];
    return { props: { allProducts: JSON.parse(JSON.stringify(allProducts)) } };
  } catch (e) {
    console.error("products getServerSideProps error:", e.message);
    return { props: { allProducts: PRODUCTS } };
  }
}

export default function ProductsPage({ allProducts }) {
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState("");
  const footerRef = useRef(null);

  const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];

  const filtered = allProducts.filter(p => {
    const matchCat    = filter ? p.category === filter : true;
    const matchSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head>
        <title>Products — POPPYPINK</title>
        <meta name="description" content="Browse all POPPYPINK premium women's sandals." />
        {/* ✅ Styles in <Head> avoids hydration mismatch */}
        <style suppressHydrationWarning>{`
          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.75rem;
          }
          .filter-chip {
            padding: .45rem 1.1rem;
            border-radius: 50px;
            border: 1.5px solid rgba(229,93,106,.3);
            background: transparent;
            color: #1a1a1a;
            font-family: 'DM Sans', sans-serif;
            font-size: .8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all .2s;
            white-space: nowrap;
          }
          .filter-chip:hover { border-color: #e55d6a; background: rgba(229,93,106,.06); }
          .filter-chip.active { background: #e55d6a; border-color: #e55d6a; color: #fff; }
          .pp-search-input {
            padding: .6rem 1.1rem .6rem 2.6rem;
            border: 1.5px solid rgba(229,93,106,.25);
            border-radius: 50px;
            font-family: 'DM Sans', sans-serif;
            font-size: .88rem;
            color: #1a1a1a;
            outline: none;
            background: #fff;
            transition: border-color .2s, box-shadow .2s;
            width: 240px;
          }
          .pp-search-input:focus { border-color: #e55d6a; box-shadow: 0 0 0 3px rgba(229,93,106,.1); }
          .glass-card { background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,.07); transition: transform .25s, box-shadow .25s; }
          .glass-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(229,93,106,.15); }
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          .pp-page-enter { animation: fadeUp .4s ease; }
          @media (max-width: 600px) {
            .pp-search-input { width: 100%; }
            .pp-top-bar { flex-direction: column !important; align-items: flex-start !important; }
          }
        `}</style>
      </Head>

      <Navbar footerRef={footerRef} />

      <main style={{ minHeight: "100vh", background: "#FFF8F5", paddingTop: "68px" }}>

        

        {/* ── Sticky filter bar ── */}
        <div style={{
          background: "#fff",
          borderBottom: "1px solid rgba(229,93,106,.1)",
          padding: ".9rem 2rem",
          position: "sticky",
          top: 68,
          zIndex: 100,
          boxShadow: "0 2px 12px rgba(0,0,0,.04)",
        }}>
          <div
            className="pp-top-bar"
            style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
          >
            {/* Search */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg
                style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "#aaa" }}
                width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="pp-search-input"
                placeholder="Search sandals…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", flex: 1 }}>
              <button className={`filter-chip ${!filter ? "active" : ""}`} onClick={() => setFilter(null)}>
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${filter === cat ? "active" : ""}`}
                  onClick={() => setFilter(filter === cat ? null : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Clear */}
            {(filter || search) && (
              <button
                onClick={() => { setFilter(null); setSearch(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: ".8rem", fontWeight: 600, whiteSpace: "nowrap", padding: ".3rem .6rem", borderRadius: 6, transition: "color .2s", fontFamily: "'DM Sans', sans-serif" }}
                onMouseOver={e => e.currentTarget.style.color = BRAND}
                onMouseOut={e => e.currentTarget.style.color = "#aaa"}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Product Grid ── */}
        <section style={{ padding: "2.5rem 2rem 5rem" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }} className="pp-page-enter">
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
                  No products found
                </p>
                <p style={{ fontSize: ".85rem", color: "#aaa", marginTop: ".4rem", fontFamily: "'DM Sans', sans-serif" }}>
                  Try a different category or clear your search
                </p>
                <button
                  onClick={() => { setFilter(null); setSearch(""); }}
                  style={{ marginTop: "1.5rem", background: BRAND, color: "#fff", border: "none", padding: ".7rem 2rem", borderRadius: 50, cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", boxShadow: "0 6px 20px rgba(229,93,106,.35)" }}
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer ref={footerRef} />
    </>
  );
}