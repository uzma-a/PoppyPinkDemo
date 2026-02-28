// src/components/ProductModal.js
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const BRAND = "#E8391D";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [activeImg, setActiveImg]   = useState(0);
  const [selSize, setSelSize]       = useState(product.sizes[2] || product.sizes[0]);
  const [selColor, setSelColor]     = useState(product.colorOptions?.[0] || null);
  const [qty, setQty]               = useState(1);
  const [added, setAdded]           = useState(false);
  const [orderForm, setOrderForm]   = useState(false);
  const [sending, setSending]       = useState(false);
  const [sent, setSent]             = useState(false);

  // Order form state
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "", city: "", state: "" });
  const [formErr, setFormErr] = useState({});

  const imgs = product.images || [product.image];
  const discount = Math.round((1 - product.offerPrice / product.price) * 100);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAdd = () => {
    addToCart({ ...product, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim())    err.name    = "Name required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) err.phone = "Valid 10-digit phone required";
    if (!form.address.trim()) err.address = "Address required";
    if (!form.pincode.trim()) err.pincode = "Pincode required";
    if (!form.city.trim())    err.city    = "City required";
    if (!form.state.trim())   err.state   = "State required";
    return err;
  };

  const handleOrder = async () => {
    const err = validate();
    if (Object.keys(err).length) { setFormErr(err); return; }
    setSending(true);
    try {
      // 1️⃣ Save order to MongoDB via API
      const apiRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  form.name,
          customerPhone: form.phone,
          customerEmail: form.email || "",
          address: { line1: form.address, city: form.city, state: form.state, pincode: form.pincode },
          product: {
            id:       product.id,
            name:     product.name,
            category: product.category,
            size:     selSize,
            color:    selColor?.name || "",
            qty,
            price:    product.offerPrice,
            image:    product.images?.[0] || product.image || "",
          },
          totalAmount: product.offerPrice * qty,
        }),
      });
      const apiData = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiData.error || "Order failed");

      const placedOrderId = apiData.orderId;

      // 2️⃣ Also send email notification via Web3Forms
      try {
        const w3fKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
        if (w3fKey && w3fKey !== "REPLACE_ME") {
          const payload = new FormData();
          payload.append("access_key", w3fKey);
          payload.append("subject", `🛍️ New Order ${placedOrderId}: ${product.name} — POPPYPINK`);
          payload.append("from_name", "POPPYPINK Store");
          payload.append("message",
            `ORDER ID : ${placedOrderId}\nProduct  : ${product.name}\nSize     : ${selSize}\nQty      : ${qty}\nTotal    : ₹${(product.offerPrice * qty).toLocaleString()}\n\nCustomer : ${form.name}\nPhone    : ${form.phone}\nAddress  : ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`
          );
          await fetch("https://api.web3forms.com/submit", { method: "POST", body: payload });
        }
      } catch (_) { /* email failure shouldn't block order confirmation */ }

      // 3️⃣ Success
      setPlacedOrderId(placedOrderId);
      setSent(true);
      addToCart({ ...product, qty });

    } catch (e) {
      alert("Order failed: " + e.message);
    }
    setSending(false);
  };

  return (
    <>
      <style>{`
        .modal-overlay { position:fixed;inset:0;background:rgba(26,5,0,.65);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .3s ease; }
        .modal-box { background:#fff;border-radius:20px;width:100%;max-width:960px;max-height:92vh;overflow-y:auto;position:relative;animation:fadeUp .4s ease; box-shadow:0 30px 80px rgba(0,0,0,.3); }
        .modal-box::-webkit-scrollbar{width:4px} .modal-box::-webkit-scrollbar-thumb{background:#E8391D;border-radius:2px}
        .img-thumb { width:68px;height:68px;object-fit:cover;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all .2s;flex-shrink:0; }
        .img-thumb.active { border-color:#E8391D; }
        .img-thumb:hover { border-color:rgba(232,57,29,.5); }
        .size-btn { min-width:44px;padding:.4rem .6rem;border-radius:8px;border:1.5px solid rgba(232,57,29,.3);background:transparent;color:#1A0500;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s; }
        .size-btn:hover { border-color:#E8391D;background:rgba(232,57,29,.06); }
        .size-btn.active { background:#E8391D;border-color:#E8391D;color:#fff; }
        .color-dot { width:30px;height:30px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .2s;flex-shrink:0; }
        .color-dot.active { border-color:#1A0500;transform:scale(1.15); }
        .color-dot:hover { transform:scale(1.1); }
        .qty-btn { width:34px;height:34px;border-radius:8px;border:1.5px solid rgba(232,57,29,.3);background:transparent;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s; }
        .qty-btn:hover { background:rgba(232,57,29,.08);border-color:#E8391D; }
        .form-input { width:100%;padding:.65rem .9rem;border:1.5px solid rgba(232,57,29,.25);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.88rem;color:#1A0500;outline:none;transition:border-color .2s; background:#fff; }
        .form-input:focus { border-color:#E8391D; }
        .form-input.err { border-color:#dc2626; }
        .field-err { color:#dc2626;font-size:.7rem;margin-top:.2rem; }
        @keyframes successPop { 0%{transform:scale(0);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        .success-icon { animation:successPop .5s ease forwards; }
        .close-btn { position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:rgba(232,57,29,.1);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#E8391D;font-size:1.2rem;transition:all .2s;z-index:10; }
        .close-btn:hover { background:#E8391D;color:#fff; }
        .star { color:#f59e0b;font-size:.9rem; }
        .review-bar-fill { height:100%;border-radius:2px;background:linear-gradient(90deg,#E8391D,#C42E15); }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>

          {sent ? (
            /* ── ORDER SUCCESS ── */
            <div style={{ padding:"4rem 2rem", textAlign:"center" }}>
              <div className="success-icon" style={{ fontSize:"4rem", marginBottom:"1rem" }}>✅</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:"#1A0500", marginBottom:".75rem" }}>
                Order Placed Successfully!
              </h2>
              <p style={{ color:"#7A3020", marginBottom:".5rem" }}>
                Thank you <strong>{form.name}</strong>! Your order for <strong>{product.name}</strong> has been received.
              </p>
              {placedOrderId && (
                <div style={{ margin:"1rem 0", padding:".75rem 1.25rem", background:"rgba(232,57,29,.08)", borderRadius:12, border:"1.5px solid rgba(232,57,29,.25)", display:"inline-block" }}>
                  <span style={{ color:"#B07060", fontSize:".8rem" }}>Your Order ID: </span>
                  <strong style={{ color:"#E8391D", fontFamily:"monospace", fontSize:"1.1rem", letterSpacing:".08em" }}>{placedOrderId}</strong>
                </div>
              )}
              <p style={{ color:"#7A3020", marginBottom:"2rem" }}>
                We'll contact you at <strong>{form.phone}</strong> to confirm delivery.<br/>
                <span style={{ fontSize:".85rem" }}>Save your Order ID to track delivery status.</span>
              </p>
              <div style={{ background:"rgba(232,57,29,.06)", border:"1.5px solid rgba(232,57,29,.2)", borderRadius:16, padding:"1.5rem", maxWidth:380, margin:"0 auto 2rem", textAlign:"left" }}>
                <div style={{ fontWeight:700, color:"#1A0500", marginBottom:".75rem", fontSize:".9rem" }}>Order Summary</div>
                {[["Product", product.name],["Size", selSize],["Color", selColor?.name||"Default"],["Qty", qty],["Total", `₹${(product.offerPrice*qty).toLocaleString()}`]].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", color:"#7A3020", marginBottom:".4rem" }}>
                    <span>{k}</span><strong style={{ color:"#1A0500" }}>{v}</strong>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : orderForm ? (
            /* ── ORDER FORM ── */
            <div style={{ padding:"2rem" }}>
              <button onClick={() => setOrderForm(false)} style={{ background:"none",border:"none",cursor:"pointer",color:"#7A3020",fontSize:".85rem",fontWeight:600,marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:".4rem" }}>
                ← Back
              </button>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"1.5rem" }}>
                {/* Left: order summary */}
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"#1A0500", marginBottom:"1.25rem" }}>Delivery Details</h2>
                  <div style={{ background:"rgba(232,57,29,.05)", border:"1.5px solid rgba(232,57,29,.18)", borderRadius:14, padding:"1.2rem", marginBottom:"1.5rem" }}>
                    <div style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgs[0]} alt={product.name} style={{ width:70, height:70, objectFit:"cover", borderRadius:10 }}/>
                      <div>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#1A0500", fontSize:".95rem" }}>{product.name}</div>
                        <div style={{ color:"#E8391D", fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", margin:".2rem 0" }}>{product.category}</div>
                        <div style={{ fontSize:".8rem", color:"#7A3020" }}>Size: <strong>{selSize}</strong> | Qty: <strong>{qty}</strong></div>
                        <div style={{ fontWeight:800, color:"#E8391D", marginTop:".3rem" }}>₹{(product.offerPrice*qty).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  {/* Why POPPYPINK */}
                  <div style={{ display:"flex", flexDirection:"column", gap:".6rem" }}>
                    {["🚚 Free delivery to your door","📦 Shipped within 24 hours","↩️ 7-day easy returns","🔒 100% secure order"].map(t => (
                      <div key={t} style={{ display:"flex", alignItems:"center", gap:".5rem", color:"#7A3020", fontSize:".82rem", fontWeight:500 }}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Right: form */}
                <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                  {[
                    { key:"name",    label:"Full Name",       placeholder:"Your full name",       type:"text" },
                    { key:"phone",   label:"Phone Number",    placeholder:"10-digit mobile number",type:"tel"  },
                    { key:"address", label:"Delivery Address",placeholder:"House no, street, area",type:"text" },
                    { key:"city",    label:"City",            placeholder:"City",                  type:"text" },
                    { key:"state",   label:"State",           placeholder:"State",                 type:"text" },
                    { key:"pincode", label:"Pincode",         placeholder:"6-digit pincode",       type:"text" },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ fontSize:".8rem", fontWeight:700, color:"#1A0500", display:"block", marginBottom:".35rem" }}>{label}</label>
                      <input
                        className={`form-input ${formErr[key] ? "err" : ""}`}
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => { setForm(p => ({...p,[key]:e.target.value})); setFormErr(p => ({...p,[key]:""})); }}
                      />
                      {formErr[key] && <div className="field-err">{formErr[key]}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width:"100%", padding:"1rem", fontSize:"1rem", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem" }}
                onClick={handleOrder}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <div style={{ width:18,height:18,borderRadius:"50%",border:"2px solid transparent",borderTop:"2px solid #fff",animation:"spin 1s linear infinite" }}/>
                    Placing Order...
                  </>
                ) : (
                  "🛍️ Place Order — ₹" + (product.offerPrice * qty).toLocaleString()
                )}
              </button>
              <p style={{ textAlign:"center", color:"#B07060", fontSize:".72rem", marginTop:".75rem" }}>
                By placing order you agree to our terms. We'll send confirmation to your phone.
              </p>
            </div>
          ) : (
            /* ── PRODUCT DETAIL VIEW ── */
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0" }}>

              {/* Left: Image Gallery */}
              <div style={{ padding:"1.5rem", background:"#FFF5F0", borderRadius:"20px 0 0 20px", position:"relative" }}>
                {/* Main image */}
                <div style={{ borderRadius:14, overflow:"hidden", background:"#FFE8D8", marginBottom:".75rem", aspectRatio:"1", position:"relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgs[activeImg]}
                    alt={product.name}
                    key={activeImg}
                    style={{ width:"100%",height:"100%",objectFit:"cover",animation:"fadeIn .35s ease" }}
                  />
                  <span style={{ position:"absolute",top:12,left:12,background:"linear-gradient(135deg,#E8391D,#C42E15)",color:"#fff",fontSize:".65rem",fontWeight:800,padding:".2rem .55rem",borderRadius:20 }}>
                    {discount}% OFF
                  </span>
                </div>
                {/* Thumbnails */}
                <div style={{ display:"flex", gap:".5rem", overflowX:"auto", paddingBottom:".25rem" }}>
                  {imgs.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img}
                      alt={`view ${i+1}`}
                      className={`img-thumb ${i===activeImg?"active":""}`}
                      onClick={() => setActiveImg(i)}
                    />
                  ))}
                </div>
                {/* Angle label */}
                <div style={{ textAlign:"center", marginTop:".75rem" }}>
                  <span style={{ fontSize:".7rem", color:"#B07060", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase" }}>
                    View {activeImg+1} of {imgs.length} • Multiple Angles
                  </span>
                </div>
              </div>

              {/* Right: Product Info */}
              <div style={{ padding:"2rem 1.75rem", overflowY:"auto" }}>
                {/* Breadcrumb */}
                <div style={{ fontSize:".7rem", color:"#B07060", marginBottom:".75rem" }}>
                  Home / {product.category} / <span style={{ color:"#E8391D" }}>{product.name}</span>
                </div>

                <span style={{ fontSize:".68rem",color:"#E8391D",fontWeight:800,letterSpacing:".12em",textTransform:"uppercase" }}>{product.category}</span>

                <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:900,color:"#1A0500",lineHeight:1.25,margin:".4rem 0 .6rem" }}>
                  {product.name}
                </h1>

                {/* Rating */}
                <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1rem" }}>
                  <div>{"★★★★★".split("").map((s,i)=><span key={i} className="star">{s}</span>)}</div>
                  <span style={{ fontSize:".8rem",color:"#7A3020",fontWeight:600 }}>4.8 (124 reviews)</span>
                  <span style={{ fontSize:".72rem",color:"#16a34a",fontWeight:700,background:"rgba(22,163,74,.1)",padding:".15rem .5rem",borderRadius:20 }}>✓ In Stock</span>
                </div>

                {/* Price */}
                <div style={{ display:"flex", alignItems:"baseline", gap:".75rem", marginBottom:"1.25rem", padding:"1rem", background:"rgba(232,57,29,.05)", borderRadius:12, border:"1px solid rgba(232,57,29,.15)" }}>
                  <span style={{ fontSize:"2rem",fontWeight:900,color:"#E8391D" }}>₹{product.offerPrice.toLocaleString()}</span>
                  <span style={{ fontSize:"1rem",color:"rgba(26,5,0,.4)",textDecoration:"line-through" }}>₹{product.price.toLocaleString()}</span>
                  <span style={{ fontSize:".8rem",color:"#16a34a",fontWeight:800,background:"rgba(22,163,74,.12)",padding:".2rem .6rem",borderRadius:20 }}>
                    Save ₹{(product.price-product.offerPrice).toLocaleString()} ({discount}%)
                  </span>
                </div>

                {/* Color */}
                {product.colorOptions && (
                  <div style={{ marginBottom:"1rem" }}>
                    <div style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",marginBottom:".55rem" }}>
                      Color: <span style={{ color:"#E8391D",fontWeight:800 }}>{selColor?.name}</span>
                    </div>
                    <div style={{ display:"flex", gap:".6rem" }}>
                      {product.colorOptions.map(c => (
                        <button key={c.hex} className={`color-dot ${selColor?.hex===c.hex?"active":""}`}
                          style={{ background:c.hex }} title={c.name}
                          onClick={() => setSelColor(c)}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                <div style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".55rem" }}>
                    <span style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500" }}>Size: <span style={{ color:"#E8391D" }}>UK {selSize}</span></span>
                    <button style={{ background:"none",border:"none",cursor:"pointer",color:"#E8391D",fontSize:".75rem",fontWeight:700 }}>Size Guide →</button>
                  </div>
                  <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
                    {product.sizes.map(s => (
                      <button key={s} className={`size-btn ${selSize===s?"active":""}`} onClick={() => setSelSize(s)}>UK {s}</button>
                    ))}
                  </div>
                </div>

                {/* Qty */}
                <div style={{ marginBottom:"1.25rem" }}>
                  <div style={{ fontSize:".8rem",fontWeight:700,color:"#1A0500",marginBottom:".55rem" }}>Quantity</div>
                  <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                    <span style={{ fontWeight:800,fontSize:"1.1rem",color:"#1A0500",minWidth:"1.5rem",textAlign:"center" }}>{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
                    <span style={{ fontSize:".78rem",color:"#7A3020",marginLeft:".25rem" }}>
                      Total: <strong style={{ color:"#E8391D" }}>₹{(product.offerPrice*qty).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex", flexDirection:"column", gap:".7rem", marginBottom:"1.25rem" }}>
                  <button
                    className="btn-primary"
                    style={{ width:"100%",padding:".85rem",fontSize:".95rem",borderRadius:12,background:added?"linear-gradient(135deg,#22c55e,#16a34a)":"linear-gradient(135deg,#E8391D,#C42E15)" }}
                    onClick={handleAdd}
                  >
                    {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                  </button>
                  <button
                    style={{ width:"100%",padding:".85rem",fontSize:".95rem",borderRadius:12,background:"linear-gradient(135deg,#ff9a3c,#e8681d)",border:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:".05em",boxShadow:"0 6px 20px rgba(232,104,29,.35)",transition:"all .3s" }}
                    onClick={() => setOrderForm(true)}
                  >
                    ⚡ Buy Now — Place Order
                  </button>
                </div>

                {/* Delivery info */}
                <div style={{ background:"rgba(232,57,29,.04)", border:"1px solid rgba(232,57,29,.15)", borderRadius:12, padding:"1rem", marginBottom:"1rem" }}>
                  <div style={{ fontSize:".78rem",fontWeight:700,color:"#1A0500",marginBottom:".55rem" }}>Delivery & Returns</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:".4rem" }}>
                    {["🚚 Free delivery • Ships in 24hrs","↩️ 7-day hassle-free returns","💳 Cash on delivery available","📦 Premium packaging included"].map(t => (
                      <div key={t} style={{ fontSize:".78rem",color:"#7A3020",display:"flex",alignItems:"center",gap:".4rem" }}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={{ fontSize:".83rem",color:"#7A3020",lineHeight:1.75 }}>
                  <strong style={{ color:"#1A0500",display:"block",marginBottom:".4rem" }}>About this product</strong>
                  Crafted with premium materials for all-day comfort. Elegant design meets practical functionality. 
                  Perfect for {product.category.toLowerCase()} — from morning meetings to evening outings. 
                  The adjustable strap ensures a perfect fit for every foot shape.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
