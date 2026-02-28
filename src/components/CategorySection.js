// src/components/CategorySection.js
import { CATEGORIES, CAT_IMAGES } from "../data/products";

export default function CategorySection({ onSelectCategory, shopRef }) {
  return (
    <section ref={shopRef} style={{ padding: "6rem 2rem", background: "#FFF5F0" }}>
      <style>{`
        .cat-card { border-radius:18px; overflow:hidden; cursor:pointer; background:rgba(255,255,255,.9); border:1.5px solid rgba(232,57,29,.18); transition:all .35s; }
        .cat-card:hover { border-color:#E8391D; box-shadow:0 0 0 2px rgba(232,57,29,.2),0 18px 40px rgba(232,57,29,.18); transform:translateY(-6px); }
        .cat-img-wrap { height:130px; overflow:hidden; background:#FFE8D8; }
        .cat-img { width:100%; height:100%; object-fit:cover; transition:transform .5s; display:block; }
        .cat-card:hover .cat-img { transform:scale(1.1); }
      `}</style>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <p style={{ color:"#E8391D", fontSize:".75rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", marginBottom:".6rem" }}>✦ BROWSE ✦</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:900, color:"#1A0500" }}>
            Shop By <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#E8391D,#C42E15)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Style</em>
          </h2>
          <div style={{ width:56, height:3, background:"linear-gradient(90deg,#E8391D,#C42E15)", margin:"1rem auto 0", borderRadius:2 }}/>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((cat, i) => (
            <div key={cat} className="cat-card" onClick={() => onSelectCategory(cat)}
              style={{ animation:`fadeUp .6s ${i*.08}s ease forwards`, opacity:0 }}>
              <div className="cat-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CAT_IMAGES[cat]} alt={cat} className="cat-img"/>
              </div>
              <div style={{ padding:".85rem .75rem", textAlign:"center", background:"rgba(255,255,255,.92)" }}>
                <span style={{ fontSize:".78rem", fontWeight:800, color:"#1A0500", letterSpacing:".03em" }}>{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
