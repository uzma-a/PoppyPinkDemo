// src/pages/cart.js
import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const BRAND = "#E8391D";

export default function CartPage() {
  const footerRef = useRef(null);
  const { cart, removeFromCart, updateQty, total } = useCart();

  return (
    <>
      <Head>
        <title>Cart — POPPYPINK</title>
      </Head>
      <style>{`
        .qty-btn { width:32px;height:32px;border-radius:8px;background:rgba(232,57,29,.1);border:1.5px solid rgba(232,57,29,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#1A0500;font-weight:700;font-size:1.1rem;transition:all .2s; }
        .qty-btn:hover { background:rgba(232,57,29,.22); }
        .rm-btn { background:none;border:none;color:rgba(26,5,0,.22);cursor:pointer;font-size:1.2rem;transition:color .2s;padding:.25rem; }
        .rm-btn:hover { color:${BRAND}; }
        .cart-row { border-radius:18px;padding:1.25rem 1.5rem;display:flex;gap:1.25rem;align-items:center;flex-wrap:wrap;background:rgba(255,255,255,.82);backdrop-filter:blur(16px);border:1.5px solid rgba(232,57,29,.18);box-shadow:0 4px 20px rgba(232,57,29,.06);transition:all .2s; }
        .cart-row:hover { box-shadow:0 8px 32px rgba(232,57,29,.12);border-color:rgba(232,57,29,.35); }
      `}</style>

      <Navbar footerRef={footerRef} />

      {cart.length === 0 ? (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#FFF8F5,#FFE5D0)", padding:"2rem", textAlign:"center" }}>
          <div style={{ fontSize:"5rem", marginBottom:"1.5rem" }}>🛍️</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.2rem", color:"#1A0500", marginBottom:".75rem" }}>Your cart is empty</h2>
          <p style={{ color:"#7A3020", marginBottom:"2.5rem" }}>Discover gorgeous sandals and add them to your cart!</p>
          <Link href="/" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#FFF8F5,#FFE5D0 55%,#FFF5F0)", padding:"100px 2rem 5rem" }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            <div style={{ marginBottom:"2.5rem" }}>
              <p style={{ color:BRAND, fontSize:".75rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", marginBottom:".4rem" }}>✦ MY CART ✦</p>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:900, color:"#1A0500" }}>
                Your <em style={{ fontStyle:"italic", background:`linear-gradient(135deg,${BRAND},#C42E15)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Selection</em>
              </h1>
              <p style={{ color:"#7A3020", marginTop:".4rem", fontWeight:500 }}>{cart.length} item{cart.length>1?"s":""} in your cart</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2.5rem" }}>
              {cart.map(item => (
                <div key={item.id} className="cart-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} style={{ width:78,height:78,borderRadius:14,objectFit:"cover",flexShrink:0,border:`2px solid rgba(232,57,29,.2)` }}/>
                  <div style={{ flex:1, minWidth:140 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#1A0500", fontSize:"1rem" }}>{item.name}</div>
                    <div style={{ color:BRAND, fontSize:".7rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", marginTop:".15rem" }}>{item.category}</div>
                    <div style={{ color:BRAND, fontWeight:800, fontSize:"1rem", marginTop:".3rem" }}>₹{item.offerPrice.toLocaleString()}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:".55rem" }}>
                    <div className="qty-btn" onClick={()=>updateQty(item.id,item.qty-1)}>−</div>
                    <span style={{ fontWeight:700,color:"#1A0500",minWidth:"1.5rem",textAlign:"center" }}>{item.qty}</span>
                    <div className="qty-btn" onClick={()=>updateQty(item.id,item.qty+1)}>+</div>
                  </div>
                  <div style={{ fontWeight:800,color:"#1A0500",minWidth:90,textAlign:"right" }}>₹{(item.offerPrice*item.qty).toLocaleString()}</div>
                  <button className="rm-btn" onClick={()=>removeFromCart(item.id)}>✕</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ maxWidth:440,marginLeft:"auto",borderRadius:22,padding:"2rem",background:"rgba(255,255,255,.88)",backdropFilter:"blur(20px)",border:`1.5px solid rgba(232,57,29,.2)`,boxShadow:"0 12px 40px rgba(232,57,29,.1)" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",color:"#1A0500",marginBottom:"1.25rem",fontWeight:700 }}>Order Summary</h3>
              {[["Subtotal",`₹${total.toLocaleString()}`,"#7A3020"],["Shipping","Free ✓","#16a34a"],["Discount","Applied 🏷️",BRAND]].map(([k,v,col])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:".75rem",fontSize:".88rem" }}>
                  <span style={{ color:"#7A3020" }}>{k}</span>
                  <span style={{ fontWeight:700,color:col }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop:`1.5px solid rgba(232,57,29,.2)`,paddingTop:"1rem",display:"flex",justifyContent:"space-between",marginBottom:"1.4rem" }}>
                <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:"1.1rem",color:"#1A0500" }}>Total</span>
                <span style={{ fontWeight:800,fontSize:"1.2rem",color:BRAND }}>₹{total.toLocaleString()}</span>
              </div>
              <button className="btn-primary" style={{ width:"100%",padding:".95rem",fontSize:".94rem",borderRadius:12 }}>
                Proceed to Checkout →
              </button>
              <div style={{ display:"flex",gap:".5rem",justifyContent:"center",marginTop:".75rem" }}>
                {["🔒 Secure","💳 All Cards","🚚 Free Ship"].map(t=>(
                  <span key={t} style={{ fontSize:".68rem",color:"#B07060",fontWeight:600 }}>{t}</span>
                ))}
              </div>
            </div>

            <Link href="/" className="btn-outline-dark" style={{ display:"inline-block",marginTop:"2rem" }}>← Continue Shopping</Link>
          </div>
        </div>
      )}

      <Footer ref={footerRef} />
    </>
  );
}
