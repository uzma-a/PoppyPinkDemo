// src/pages/index.js
import { useRef, useState, useEffect } from "react";
import Head from "next/head";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
// import CategorySection from "../components/CategorySection";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { PRODUCTS } from "../data/products";

const BRAND = "#e55d6a";

export default function Home() {
  const [loaded,   setLoaded]   = useState(false);
  const [filter,   setFilter]   = useState(null);
  const shopRef    = useRef(null);
  const footerRef  = useRef(null);
  const productsRef= useRef(null);

  const handleCategory = (cat) => {
    setFilter(cat);
    setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const filtered = filter ? PRODUCTS.filter(p => p.category === filter) : PRODUCTS;

  return (
    <>
      <Head>
        <title>Poppypink Shoes – Premium & Trendy Women Sandals Online in India</title>
        <meta name="description" content="Shop premium and trendy women's sandals at Poppypink Shoes. Discover stylish, comfortable, and affordable footwear designed for modern women. " />
        <meta name="viewport"    content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={BRAND} />
      </Head>

      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      {loaded && (
        <main>
          <Navbar footerRef={footerRef} />
          <Hero shopRef={shopRef} />
          {/* <CategorySection onSelectCategory={handleCategory} shopRef={shopRef} /> */}

          {/* ── PRODUCTS ── */}
          <section ref={productsRef} style={{ padding:"5rem 2rem 7rem", background:"#FFF8F5" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"3rem", flexWrap:"wrap", gap:"1rem" }}>
                <div>
                  <p style={{ color:BRAND, fontSize:".75rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", marginBottom:".5rem" }}>✦ COLLECTION ✦</p>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900, color:"#1A0500" }}>
                    {filter
                      ? <em style={{ fontStyle:"italic", background:`linear-gradient(135deg,${BRAND},#C42E15)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{filter}</em>
                      : <>All <em style={{ fontStyle:"italic", background:`linear-gradient(135deg,${BRAND},#C42E15)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sandals</em></>
                    }
                  </h2>
                  <p style={{ color:"#B07060", fontSize:".85rem", marginTop:".4rem" }}>{filtered.length} style{filtered.length!==1?"s":""} — Click any to view details</p>
                </div>
                {filter && (
                  <button className="btn-outline-dark" onClick={() => setFilter(null)} style={{ padding:".5rem 1.3rem", fontSize:".8rem" }}>
                    ✕ Clear Filter
                  </button>
                )}
              </div>
              <div className="product-grid">
                {filtered.map((p,i) => <ProductCard key={p.id} product={p} index={i}/>)}
              </div>
            </div>
          </section>

          {/* ── BRAND STORY BANNER ── */}
          <section style={{ padding:"5rem 2rem", background:`linear-gradient(135deg,${BRAND} 0%,#A82410 100%)`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,.07) 1.5px,transparent 1.5px)", backgroundSize:"36px 36px" }}/>
            <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative" }}>
              <p style={{ color:"rgba(255,255,255,.7)", fontSize:".75rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", marginBottom:"1rem" }}>✦ OUR STORY ✦</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:900, color:"#fff", marginBottom:"1.5rem", lineHeight:1.2 }}>
                Crafted for the Modern Woman
              </h2>
              <p style={{ color:"rgba(255,255,255,.7)", lineHeight:1.8, fontSize:"1rem", marginBottom:"2rem" }}>
                Every POPPYPINK sandal is designed with passion, precision, and love. From sunrise walks to midnight parties — we have a pair for every moment.
              </p>
              <button style={{ background:"#fff", color:BRAND, border:"none", padding:".75rem 2.2rem", borderRadius:50, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:".9rem", cursor:"pointer", letterSpacing:".05em", boxShadow:"0 8px 28px rgba(0,0,0,.2)", transition:"all .3s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,.3)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.2)"}}>
                Discover Our Story ✦
              </button>
            </div>
          </section>

          <Footer ref={footerRef} />
        </main>
      )}
    </>
  );
}
