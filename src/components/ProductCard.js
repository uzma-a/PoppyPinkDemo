// src/components/ProductCard.js
import { useState } from "react";
import { useCart } from "../context/CartContext";
import ProductModal from "./ProductModal";

export default function ProductCard({ product, index }) {
  const { addToCart } = useCart();
  const [added, setAdded]     = useState(false);
  const [wished, setWished]   = useState(false);
  const [modal, setModal]     = useState(false);

  const discount = Math.round((1 - product.offerPrice / product.price) * 100);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <div
        className="glass-card"
        onClick={() => setModal(true)}
        style={{
          borderRadius: 22, overflow: "hidden",
          display: "flex", flexDirection: "column", cursor: "pointer",
          animation: `fadeUp .65s ${(index % 8) * .07}s ease forwards`, opacity: 0,
        }}
      >
        <style>{`
          .card-img-wrap { overflow:hidden; height:240px; background:#FFE8D8; position:relative; }
          .card-img { width:100%; height:100%; object-fit:cover; transition:transform .55s ease; display:block; }
          .glass-card:hover .card-img { transform:scale(1.09); }
          .wish-btn { position:absolute; top:10px; right:10px; width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,.9); border:1px solid rgba(232,57,29,.2); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1rem; transition:all .2s; z-index:2; }
          .wish-btn:hover, .wish-btn.wished { background:#E8391D; border-color:#E8391D; color:#fff; }
          .add-cart-btn { width:100%; padding:.72rem; font-family:'DM Sans',sans-serif; font-weight:700; font-size:.84rem; border:none; border-radius:50px; cursor:pointer; transition:all .3s; letter-spacing:.05em; margin-top:.75rem; }
          .add-cart-btn.normal { background:linear-gradient(135deg,#E8391D,#C42E15); color:#fff; box-shadow:0 6px 20px rgba(232,57,29,.3); }
          .add-cart-btn.normal:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(232,57,29,.5); }
          .add-cart-btn.done { background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; }
          .view-detail-hint { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(to top, rgba(232,57,29,.8), transparent); color:#fff; font-size:.72rem; font-weight:700; letter-spacing:.1em; text-align:center; padding:.6rem; opacity:0; transition:opacity .3s; text-transform:uppercase; }
          .glass-card:hover .view-detail-hint { opacity:1; }
        `}</style>

        {/* Image */}
        <div className="card-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images ? product.images[0] : product.image} alt={product.name} className="card-img"/>

          <span style={{
            position:"absolute",top:10,left:10,
            background:"#e55d6a",
            color:"#fff",fontSize:".65rem",fontWeight:800,
            padding:".2rem .55rem",borderRadius:20,
          }}>{discount}% OFF</span>

          <button className={`wish-btn ${wished ? "wished" : ""}`}
            onClick={e => { e.stopPropagation(); setWished(!wished); }}>
            {wished ? "♥" : "♡"}
          </button>

          <div className="view-detail-hint">Tap to view details</div>
        </div>

        {/* Info */}
        <div style={{ padding:"1.1rem 1rem", flex:1, display:"flex", flexDirection:"column", gap:".4rem", background:"rgba(255,255,255,.88)" }}>
          <div style={{ display:"flex", gap:".35rem" }}>
            {product.colorOptions?.map(c => (
              <div key={c.hex} style={{ width:13,height:13,borderRadius:"50%",background:c.hex,border:"1.5px solid rgba(44,10,0,.15)" }}/>
            ))}
          </div>
          <span style={{ fontSize:".67rem",color:"#e55d6a",fontWeight:800,letterSpacing:".1em",textTransform:"uppercase" }}>{product.category}</span>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:".96rem",fontWeight:700,color:"#1A0500",lineHeight:1.3,flex:1 }}>{product.name}</h3>
          <div style={{ display:"flex",gap:".3rem",flexWrap:"wrap" }}>
            {product.sizes.slice(0,4).map(s => (
              <span key={s} style={{ fontSize:".6rem",padding:".15rem .4rem",borderRadius:4,background:"rgba(232,57,29,.08)",color:"#7A3020",fontWeight:600,border:"1px solid rgba(232,57,29,.15)" }}>{s}</span>
            ))}
            {product.sizes.length > 4 && <span style={{ fontSize:".6rem",color:"#B07060",fontWeight:600,alignSelf:"center" }}>+{product.sizes.length-4}</span>}
          </div>
          <div style={{ display:"flex",alignItems:"baseline",gap:".55rem",paddingTop:".3rem" }}>
            <span style={{ fontSize:"1.1rem",fontWeight:800,color:"#e55d6a" }}>₹{product.offerPrice.toLocaleString()}</span>
            <span style={{ fontSize:".78rem",color:"rgba(44,10,0,.35)",textDecoration:"line-through" }}>₹{product.price.toLocaleString()}</span>
            <span style={{ fontSize:".68rem",color:"#16a34a",fontWeight:700,marginLeft:"auto" }}>Save ₹{(product.price-product.offerPrice).toLocaleString()}</span>
          </div>
          <button style={{ fontSize:"1.1rem",fontWeight:800,background:"#e55d6a" }} className={`add-cart-btn ${added?"done":"normal"}`} onClick={handleAdd}>
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {modal && <ProductModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}