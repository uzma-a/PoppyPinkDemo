// src/pages/cart.js
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const BRAND = "#E8391D";
const BRAND_DARK = "#C42E15";

export default function CartPage() {
  const footerRef = useRef(null);
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();

  // Checkout modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sending,      setSending]      = useState(false);
  const [sent,         setSent]         = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const [form, setForm] = useState({
    name:"", phone:"", address:"", city:"", state:"", pincode:"",
    paymentMethod:"COD",
  });
  const [formErr, setFormErr] = useState({});

  const validate = () => {
    const err = {};
    if (!form.name.trim())                    err.name    = "Name required";
    if (!/^\d{10}$/.test(form.phone.trim()))  err.phone   = "Valid 10-digit number required";
    if (!form.address.trim())                 err.address = "Address required";
    if (!form.city.trim())                    err.city    = "City required";
    if (!form.state.trim())                   err.state   = "State required";
    if (!/^\d{6}$/.test(form.pincode.trim())) err.pincode = "Valid 6-digit pincode required";
    return err;
  };

  const handleCheckoutOrder = async () => {
    const err = validate();
    if (Object.keys(err).length) { setFormErr(err); return; }
    setSending(true);

    try {
      // Build order items description
      const itemsText = cart.map(i =>
        `${i.name} (Size:${i.size||"N/A"}, Qty:${i.qty}) = ₹${(i.offerPrice*i.qty).toLocaleString()}`
      ).join("\n");

      // Use first cart item as primary product for DB (multi-item support)
      const firstItem = cart[0];

      const apiRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  form.name.trim(),
          customerPhone: form.phone.trim(),
          customerEmail: "",
          address: {
            line1:   form.address.trim(),
            city:    form.city.trim(),
            state:   form.state.trim(),
            pincode: form.pincode.trim(),
          },
          product: {
            id:       firstItem.id,
            name:     cart.length > 1 ? `${firstItem.name} + ${cart.length-1} more` : firstItem.name,
            category: firstItem.category || "",
            size:     firstItem.size || "",
            color:    firstItem.selColor || "",
            qty:      cart.reduce((s,i) => s + i.qty, 0),
            price:    firstItem.offerPrice,
            image:    firstItem.image || firstItem.images?.[0] || "",
          },
          totalAmount:   total,
          paymentMethod: form.paymentMethod,
        }),
      });

      // Safe JSON parse
      const contentType = apiRes.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(`Server error (${apiRes.status}). Check MongoDB connection.`);
      }
      const apiData = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiData.error || "Order failed");

      const newOrderId = apiData.orderId;
      setPlacedOrderId(newOrderId);

      // Email via Web3Forms
      const w3fKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (w3fKey && w3fKey !== "REPLACE_ME") {
        try {
          const fd = new FormData();
          fd.append("access_key", w3fKey);
          fd.append("subject",    `🛒 Cart Order ${newOrderId} — POPPYPINK`);
          fd.append("from_name",  "POPPYPINK Store");
          fd.append("message", [
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            "🛒  CART ORDER — POPPYPINK",
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            `Order ID : ${newOrderId}`,
            `Total    : ₹${total.toLocaleString()}`,
            `Payment  : ${form.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}`,
            `Items    : ${cart.length}`,
            "",
            "ITEMS:",
            itemsText,
            "",
            "📦 DELIVERY",
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            `Name    : ${form.name}`,
            `Phone   : ${form.phone}`,
            `Address : ${form.address}`,
            `City    : ${form.city}, ${form.state} - ${form.pincode}`,
            "",
            `Time    : ${new Date().toLocaleString("en-IN")}`,
          ].join("\n"));
          await fetch("https://api.web3forms.com/submit", { method:"POST", body:fd });
        } catch (_) {}
      }

      setSent(true);
      clearCart?.(); // clear cart after successful order

    } catch (e) {
      alert("Order failed: " + e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Head><title>Cart — POPPYPINK</title></Head>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { 0%{transform:scale(0);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }

        .qty-btn { width:32px;height:32px;border-radius:8px;background:rgba(232,57,29,.1);border:1.5px solid rgba(232,57,29,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#1A0500;font-weight:700;font-size:1.1rem;transition:all .2s; }
        .qty-btn:hover { background:rgba(232,57,29,.22); }
        .rm-btn { background:none;border:none;color:rgba(26,5,0,.22);cursor:pointer;font-size:1.2rem;transition:color .2s;padding:.25rem; }
        .rm-btn:hover { color:${BRAND}; }
        .cart-row { border-radius:18px;padding:1.25rem 1.5rem;display:flex;gap:1.25rem;align-items:center;flex-wrap:wrap;background:rgba(255,255,255,.82);backdrop-filter:blur(16px);border:1.5px solid rgba(232,57,29,.18);box-shadow:0 4px 20px rgba(232,57,29,.06);transition:all .2s; }
        .cart-row:hover { box-shadow:0 8px 32px rgba(232,57,29,.12);border-color:rgba(232,57,29,.35); }

        /* Checkout modal */
        .co-overlay { position:fixed;inset:0;background:rgba(26,5,0,.65);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .3s ease; }
        .co-box { background:#fff;border-radius:20px;width:100%;max-width:760px;max-height:92vh;overflow-y:auto;animation:fadeUp .4s ease;box-shadow:0 30px 80px rgba(0,0,0,.28);padding:2rem 2.5rem; }
        .co-box::-webkit-scrollbar{width:4px}.co-box::-webkit-scrollbar-thumb{background:${BRAND};border-radius:2px}

        .co-input { width:100%;padding:.65rem .9rem;border:1.5px solid rgba(232,57,29,.25);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.88rem;color:#1A0500;outline:none;transition:border-color .2s;background:#fff;box-sizing:border-box; }
        .co-input:focus { border-color:${BRAND}; }
        .co-input.err { border-color:#dc2626; }
        .co-err { color:#dc2626;font-size:.7rem;margin-top:.2rem; }

        .pay-card { flex:1;border:2px solid rgba(232,57,29,.25);border-radius:14px;padding:.8rem 1rem;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:.75rem; }
        .pay-card:hover { border-color:${BRAND};background:rgba(232,57,29,.04); }
        .pay-card.on { border-color:${BRAND};background:rgba(232,57,29,.07);box-shadow:0 0 0 3px rgba(232,57,29,.12); }
        .radio-c { width:20px;height:20px;border-radius:50%;border:2.5px solid ${BRAND};display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .radio-d { width:10px;height:10px;border-radius:50%;background:${BRAND}; }

        .co-btn { width:100%;padding:.9rem;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.96rem;border:none;border-radius:12px;cursor:pointer;transition:all .3s;letter-spacing:.04em; }
        .co-btn-primary { background:linear-gradient(135deg,${BRAND},${BRAND_DARK});color:#fff;box-shadow:0 8px 24px rgba(232,57,29,.35); }
        .co-btn-primary:hover { transform:translateY(-2px);box-shadow:0 12px 32px rgba(232,57,29,.5); }
        .co-btn-primary:disabled { opacity:.65;cursor:not-allowed;transform:none; }
        .co-btn-outline { background:rgba(232,57,29,.06);border:2px solid rgba(232,57,29,.3);color:${BRAND}; }
        .co-btn-outline:hover { background:rgba(232,57,29,.12); }

        @media(max-width:640px) { .co-2col { grid-template-columns:1fr!important; } }
      `}</style>

      <Navbar footerRef={footerRef} />

      {cart.length === 0 ? (
        <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#FFF8F5,#FFE5D0)",padding:"2rem",textAlign:"center" }}>
          <div style={{ fontSize:"5rem",marginBottom:"1.5rem" }}>🛍️</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"2.2rem",color:"#1A0500",marginBottom:".75rem" }}>Your cart is empty</h2>
          <p style={{ color:"#7A3020",marginBottom:"2.5rem" }}>Discover gorgeous sandals and add them to your cart!</p>
          <Link href="/" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ minHeight:"100vh",background:"linear-gradient(160deg,#FFF8F5,#FFE5D0 55%,#FFF5F0)",padding:"100px 2rem 5rem" }}>
          <div style={{ maxWidth:960,margin:"0 auto" }}>
            <div style={{ marginBottom:"2.5rem" }}>
              <p style={{ color:BRAND,fontSize:".75rem",fontWeight:800,letterSpacing:".22em",textTransform:"uppercase",marginBottom:".4rem" }}>✦ MY CART ✦</p>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:900,color:"#1A0500" }}>
                Your <em style={{ fontStyle:"italic",background:`linear-gradient(135deg,${BRAND},${BRAND_DARK})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Selection</em>
              </h1>
              <p style={{ color:"#7A3020",marginTop:".4rem",fontWeight:500 }}>{cart.length} item{cart.length>1?"s":""} in your cart</p>
            </div>

            {/* Cart items */}
            <div style={{ display:"flex",flexDirection:"column",gap:"1rem",marginBottom:"2.5rem" }}>
              {cart.map(item => (
                <div key={item.id} className="cart-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image || item.images?.[0]} alt={item.name}
                    style={{ width:78,height:78,borderRadius:14,objectFit:"cover",flexShrink:0,border:`2px solid rgba(232,57,29,.2)` }}/>
                  <div style={{ flex:1,minWidth:140 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#1A0500",fontSize:"1rem" }}>{item.name}</div>
                    <div style={{ color:BRAND,fontSize:".7rem",fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",marginTop:".15rem" }}>{item.category}</div>
                    {item.size && <div style={{ color:"#B07060",fontSize:".75rem",marginTop:".1rem" }}>Size: {item.size}</div>}
                    <div style={{ color:BRAND,fontWeight:800,fontSize:"1rem",marginTop:".3rem" }}>₹{item.offerPrice.toLocaleString()}</div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:".55rem" }}>
                    <div className="qty-btn" onClick={()=>updateQty(item.id,item.qty-1)}>−</div>
                    <span style={{ fontWeight:700,color:"#1A0500",minWidth:"1.5rem",textAlign:"center" }}>{item.qty}</span>
                    <div className="qty-btn" onClick={()=>updateQty(item.id,item.qty+1)}>+</div>
                  </div>
                  <div style={{ fontWeight:800,color:"#1A0500",minWidth:90,textAlign:"right" }}>₹{(item.offerPrice*item.qty).toLocaleString()}</div>
                  <button className="rm-btn" onClick={()=>removeFromCart(item.id)}>✕</button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
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

              {/* ✅ FIX: onClick now opens checkout form */}
              <button
                className="btn-primary"
                style={{ width:"100%",padding:".95rem",fontSize:".94rem",borderRadius:12 }}
                onClick={() => setCheckoutOpen(true)}
              >
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

      {/* ═══════════════════════════════════════════
          CHECKOUT MODAL
      ═══════════════════════════════════════════ */}
      {checkoutOpen && (
        <div className="co-overlay" onClick={() => { if (!sending) setCheckoutOpen(false); }}>
          <div className="co-box" onClick={e => e.stopPropagation()}>

            {sent ? (
              /* ── Checkout Success ── */
              <div style={{ textAlign:"center", padding:"1.5rem 0" }}>
                <div style={{ fontSize:"3.5rem",marginBottom:"1rem",animation:"popIn .5s ease" }}>✅</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",color:"#1A0500",marginBottom:".6rem" }}>Order Placed!</h2>
                <p style={{ color:"#7A3020",marginBottom:"1rem" }}>Thank you <strong>{form.name}</strong>!</p>

                <div style={{ display:"inline-block",margin:".4rem 0 1.2rem",padding:".85rem 1.5rem",background:"rgba(232,57,29,.07)",borderRadius:14,border:"1.5px solid rgba(232,57,29,.25)" }}>
                  <div style={{ fontSize:".68rem",color:"#B07060",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".18rem" }}>Order ID</div>
                  <div style={{ fontFamily:"monospace",fontWeight:900,fontSize:"1.4rem",color:BRAND,letterSpacing:".1em" }}>{placedOrderId}</div>
                  <div style={{ fontSize:".7rem",color:"#B07060",marginTop:".12rem" }}>Save to track your order</div>
                </div>

                {/* Items summary */}
                <div style={{ maxWidth:380,margin:"0 auto 1.2rem",background:"#FFF5F2",borderRadius:14,padding:"1rem 1.4rem",textAlign:"left",border:"1px solid rgba(232,57,29,.15)" }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex",justifyContent:"space-between",fontSize:".84rem",color:"#7A3020",marginBottom:".35rem" }}>
                      <span>{item.name} ×{item.qty}</span>
                      <strong style={{ color:"#1A0500" }}>₹{(item.offerPrice*item.qty).toLocaleString()}</strong>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid rgba(232,57,29,.15)",paddingTop:".4rem",marginTop:".4rem",display:"flex",justifyContent:"space-between",fontWeight:800 }}>
                    <span style={{ color:"#1A0500" }}>Total</span>
                    <span style={{ color:BRAND }}>₹{total.toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop:".5rem",fontSize:".8rem",color:"#7A3020" }}>
                    Payment: <strong>{form.paymentMethod === "COD" ? "💵 Cash on Delivery" : "💳 Online Payment"}</strong>
                  </div>
                </div>

                <p style={{ color:"#7A3020",fontSize:".83rem",marginBottom:"1.5rem" }}>
                  We'll call/WhatsApp <strong>{form.phone}</strong> to confirm.
                </p>

                <div style={{ display:"flex",gap:".75rem",justifyContent:"center",flexWrap:"wrap" }}>
                  <button className="co-btn co-btn-primary" style={{ maxWidth:200 }}
                    onClick={() => { setCheckoutOpen(false); setSent(false); }}>
                    Continue Shopping
                  </button>
                  <button className="co-btn co-btn-outline" style={{ maxWidth:200 }}
                    onClick={() => { setCheckoutOpen(false); window.location.href=`/track?id=${placedOrderId}`; }}>
                    📦 Track Order
                  </button>
                </div>
              </div>

            ) : (
              /* ── Checkout Form ── */
              <>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem" }}>
                  <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.7rem",color:"#1A0500",margin:0 }}>
                    Checkout
                  </h2>
                  <button onClick={() => setCheckoutOpen(false)}
                    style={{ background:"none",border:"none",cursor:"pointer",color:"#B07060",fontSize:"1.4rem",lineHeight:1 }}>✕</button>
                </div>

                {/* Cart summary */}
                <div style={{ background:"rgba(232,57,29,.05)",border:"1px solid rgba(232,57,29,.15)",borderRadius:14,padding:"1rem",marginBottom:"1.5rem" }}>
                  <div style={{ fontSize:".75rem",fontWeight:700,color:"#B07060",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".6rem" }}>
                    Your Items ({cart.length})
                  </div>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex",justifyContent:"space-between",fontSize:".84rem",color:"#7A3020",marginBottom:".3rem" }}>
                      <span>{item.name} ×{item.qty}</span>
                      <strong style={{ color:BRAND }}>₹{(item.offerPrice*item.qty).toLocaleString()}</strong>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid rgba(232,57,29,.15)",paddingTop:".5rem",marginTop:".5rem",display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:"1rem" }}>
                    <span style={{ color:"#1A0500" }}>Total</span>
                    <span style={{ color:BRAND }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Form grid */}
                <div className="co-2col" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:".85rem",marginBottom:"1.25rem" }}>

                  {/* Name */}
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",display:"block",marginBottom:".3rem" }}>Full Name *</label>
                    <input className={`co-input ${formErr.name?"err":""}`} placeholder="Your full name"
                      value={form.name} onChange={e=>{setForm(p=>({...p,name:e.target.value}));setFormErr(p=>({...p,name:""}))}}/>
                    {formErr.name && <div className="co-err">{formErr.name}</div>}
                  </div>

                  {/* Phone */}
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",display:"block",marginBottom:".3rem" }}>Phone Number *</label>
                    <input className={`co-input ${formErr.phone?"err":""}`} placeholder="10-digit mobile number" type="tel" maxLength={10}
                      value={form.phone} onChange={e=>{setForm(p=>({...p,phone:e.target.value.replace(/\D/g,"")}));setFormErr(p=>({...p,phone:""}))}}/>
                    {formErr.phone && <div className="co-err">{formErr.phone}</div>}
                  </div>

                  {/* Address */}
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",display:"block",marginBottom:".3rem" }}>Delivery Address *</label>
                    <input className={`co-input ${formErr.address?"err":""}`} placeholder="House no, street, area"
                      value={form.address} onChange={e=>{setForm(p=>({...p,address:e.target.value}));setFormErr(p=>({...p,address:""}))}}/>
                    {formErr.address && <div className="co-err">{formErr.address}</div>}
                  </div>

                  {/* City */}
                  <div>
                    <label style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",display:"block",marginBottom:".3rem" }}>City *</label>
                    <input className={`co-input ${formErr.city?"err":""}`} placeholder="City"
                      value={form.city} onChange={e=>{setForm(p=>({...p,city:e.target.value}));setFormErr(p=>({...p,city:""}))}}/>
                    {formErr.city && <div className="co-err">{formErr.city}</div>}
                  </div>

                  {/* State */}
                  <div>
                    <label style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",display:"block",marginBottom:".3rem" }}>State *</label>
                    <input className={`co-input ${formErr.state?"err":""}`} placeholder="State"
                      value={form.state} onChange={e=>{setForm(p=>({...p,state:e.target.value}));setFormErr(p=>({...p,state:""}))}}/>
                    {formErr.state && <div className="co-err">{formErr.state}</div>}
                  </div>

                  {/* Pincode */}
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",display:"block",marginBottom:".3rem" }}>Pincode *</label>
                    <input className={`co-input ${formErr.pincode?"err":""}`} placeholder="6-digit pincode" maxLength={6}
                      value={form.pincode} onChange={e=>{setForm(p=>({...p,pincode:e.target.value.replace(/\D/g,"")}));setFormErr(p=>({...p,pincode:""}))}}/>
                    {formErr.pincode && <div className="co-err">{formErr.pincode}</div>}
                  </div>

                  {/* Payment Method */}
                  <div style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",marginBottom:".6rem" }}>Payment Method *</div>
                    <div style={{ display:"flex",gap:".75rem" }}>
                      {[
                        { val:"COD",    icon:"💵", title:"Cash on Delivery",  sub:"Pay when order arrives" },
                        { val:"Online", icon:"💳", title:"Online Payment",    sub:"UPI / Card / Net Banking" },
                      ].map(opt => (
                        <div key={opt.val} className={`pay-card ${form.paymentMethod===opt.val?"on":""}`}
                          onClick={() => setForm(p=>({...p,paymentMethod:opt.val}))}>
                          <div className="radio-c">
                            {form.paymentMethod===opt.val && <div className="radio-d"/>}
                          </div>
                          <div>
                            <div style={{ fontWeight:700,color:"#1A0500",fontSize:".88rem" }}>{opt.icon} {opt.title}</div>
                            <div style={{ color:"#B07060",fontSize:".7rem" }}>{opt.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {form.paymentMethod === "Online" && (
                      <div style={{ marginTop:".65rem",padding:".65rem 1rem",background:"rgba(59,130,246,.07)",border:"1px solid rgba(59,130,246,.2)",borderRadius:10,color:"#1d4ed8",fontSize:".77rem" }}>
                        📱 We'll WhatsApp a payment link to <strong>{form.phone || "your number"}</strong> after order is placed.
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button className="co-btn co-btn-primary" onClick={handleCheckoutOrder} disabled={sending}>
                  {sending ? (
                    <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem" }}>
                      <span style={{ width:18,height:18,borderRadius:"50%",border:"2.5px solid transparent",borderTop:"2.5px solid #fff",animation:"spin 1s linear infinite",display:"inline-block" }}/>
                      Placing Order…
                    </span>
                  ) : (
                    `🛍️ Place Order — ₹${total.toLocaleString()}`
                  )}
                </button>
                <p style={{ textAlign:"center",color:"#B07060",fontSize:".7rem",marginTop:".5rem" }}>
                  By placing order you agree to our terms. We'll contact you to confirm.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
