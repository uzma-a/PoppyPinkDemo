// src/components/ProductModal.js
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const BRAND = "#e55d6a";

// Size guide data: EURO -> UK -> foot length
const SIZE_GUIDE = [
  { euro: 36, uk: 3,   cm: 22.7, inch: 8.9 },
  { euro: 37, uk: 4,   cm: 23.3, inch: 9.2 },
  { euro: 38, uk: 5,   cm: 24.0, inch: 9.4 },
  { euro: 39, uk: 6,   cm: 24.7, inch: 9.7 },
  { euro: 40, uk: 7,   cm: 25.3, inch: 10.0 },
  { euro: 41, uk: 8,   cm: 26.0, inch: 10.2 },
];

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [activeImg, setActiveImg]       = useState(0);
  const [selSize, setSelSize]           = useState(product.sizes[2] || product.sizes[0]);
  const [selColor, setSelColor]         = useState(product.colorOptions?.[0] || null);
  const [qty, setQty]                   = useState(1);
  const [added, setAdded]               = useState(false);
  const [orderForm, setOrderForm]       = useState(false);
  const [sending, setSending]           = useState(false);
  const [sent, setSent]                 = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null); // ✅ FIXED: was missing
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit]           = useState("cm"); // "cm" or "in"

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

      const newOrderId = apiData.orderId;
      setPlacedOrderId(newOrderId); // ✅ FIXED: now properly sets state

      // 2️⃣ Also send email notification via Web3Forms
      try {
        const w3fKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
        if (w3fKey && w3fKey !== "REPLACE_ME") {
          const payload = new FormData();
          payload.append("access_key", w3fKey);
          payload.append("subject", `🛍️ New Order ${newOrderId}: ${product.name} — POPPYPINK`);
          payload.append("from_name", "POPPYPINK Store");
          payload.append("message",
            `ORDER ID : ${newOrderId}\nProduct  : ${product.name}\nSize     : ${selSize}\nQty      : ${qty}\nTotal    : ₹${(product.offerPrice * qty).toLocaleString()}\n\nCustomer : ${form.name}\nPhone    : ${form.phone}\nAddress  : ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`
          );
          await fetch("https://api.web3forms.com/submit", { method: "POST", body: payload });
        }
      } catch (_) { /* email failure shouldn't block order confirmation */ }

      // 3️⃣ Success
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
        .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .3s ease; }
        .modal-box { background:#fff;border-radius:20px;width:100%;max-width:960px;max-height:92vh;overflow-y:auto;position:relative;animation:fadeUp .4s ease;box-shadow:0 30px 80px rgba(0,0,0,.18); }
        .modal-box::-webkit-scrollbar{width:4px} .modal-box::-webkit-scrollbar-thumb{background:${BRAND};border-radius:2px}
        .img-thumb { width:68px;height:68px;object-fit:cover;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all .2s;flex-shrink:0; }
        .img-thumb.active { border-color:${BRAND}; }
        .img-thumb:hover { border-color:rgba(229,93,106,.5); }
        .size-btn { min-width:44px;padding:.4rem .6rem;border-radius:8px;border:1.5px solid rgba(229,93,106,.3);background:transparent;color:#1a1a1a;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s; }
        .size-btn:hover { border-color:${BRAND};background:rgba(229,93,106,.06); }
        .size-btn.active { background:${BRAND};border-color:${BRAND};color:#fff; }
        .color-dot { width:30px;height:30px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .2s;flex-shrink:0; }
        .color-dot.active { border-color:#1a1a1a;transform:scale(1.15); }
        .color-dot:hover { transform:scale(1.1); }
        .qty-btn { width:34px;height:34px;border-radius:8px;border:1.5px solid rgba(229,93,106,.3);background:transparent;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s; }
        .qty-btn:hover { background:rgba(229,93,106,.08);border-color:${BRAND}; }
        .form-input { width:100%;padding:.65rem .9rem;border:1.5px solid rgba(229,93,106,.25);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.88rem;color:#1a1a1a;outline:none;transition:border-color .2s,box-shadow .2s;background:#fff; }
        .form-input:focus { border-color:${BRAND};box-shadow:0 0 0 3px rgba(229,93,106,.1); }
        .form-input.err { border-color:#dc2626; }
        .field-err { color:#dc2626;font-size:.7rem;margin-top:.2rem; }
        .close-btn { position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:rgba(229,93,106,.1);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${BRAND};font-size:1.2rem;transition:all .2s;z-index:10; }
        .close-btn:hover { background:${BRAND};color:#fff; }
        .star { color:#f59e0b;font-size:.9rem; }
        .btn-primary { background:${BRAND};border:none;color:#fff;padding:.82rem 2.2rem;border-radius:50px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.92rem;cursor:pointer;letter-spacing:.05em;box-shadow:0 10px 28px rgba(229,93,106,.35);transition:all .3s; }
        .btn-primary:hover { transform:translateY(-2px);box-shadow:0 16px 36px rgba(229,93,106,.45); }
        @keyframes successPop { 0%{transform:scale(0);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        .success-icon { animation:successPop .5s ease forwards; }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }

        /* ── Size Guide ── */
        .sg-overlay { position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .25s ease; }
        .sg-box { background:#fff;border-radius:20px;width:100%;max-width:520px;max-height:88vh;overflow-y:auto;position:relative;animation:fadeUp .3s ease;box-shadow:0 24px 64px rgba(0,0,0,.18); }
        .sg-tab { padding:.55rem 1.2rem;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:700;cursor:pointer;border:none;transition:all .25s; }
        .sg-tab.active { background:${BRAND};color:#fff;box-shadow:0 4px 14px rgba(229,93,106,.35); }
        .sg-tab:not(.active) { background:transparent;color:#888; }
        .unit-toggle { display:flex;border-radius:50px;overflow:hidden;border:1.5px solid rgba(229,93,106,.25);background:#f9f9f9; }
        .unit-btn { padding:.35rem .9rem;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:700;cursor:pointer;border:none;background:transparent;color:#999;transition:all .2s; }
        .unit-btn.active { background:${BRAND};color:#fff; }
        .sg-row { display:grid;grid-template-columns:40px 1fr 1fr 1fr;gap:.5rem;align-items:center;padding:.65rem 1.2rem;border-bottom:1px solid rgba(229,93,106,.07);transition:background .15s; }
        .sg-row:hover { background:rgba(229,93,106,.04); }
        .sg-row.header { background:rgba(229,93,106,.06);font-weight:700;color:#666;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase; }
        .sg-row.highlighted { background:rgba(229,93,106,.08);border-left:3px solid ${BRAND}; }
      `}</style>

      {/* ══════ SIZE GUIDE MODAL ══════ */}
      {showSizeGuide && (
        <div className="sg-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="sg-box" onClick={e => e.stopPropagation()}>
            <button className="close-btn" style={{ position:"absolute",top:12,right:12 }} onClick={() => setShowSizeGuide(false)}>✕</button>

            {/* Header */}
            <div style={{ padding:"1.5rem 1.5rem 1rem", borderBottom:"1px solid rgba(229,93,106,.1)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgs[0]} alt={product.name} style={{ width:56, height:56, objectFit:"cover", borderRadius:10, border:"1.5px solid rgba(229,93,106,.15)" }}/>
                <div>
                  <div style={{ fontWeight:800, color:"#1a1a1a", fontSize:".9rem" }}>POPPYPINK</div>
                  <div style={{ color:"#666", fontSize:".8rem", lineHeight:1.4 }}>{product.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginTop:".25rem" }}>
                    <span style={{ fontWeight:800, color:"#1a1a1a", fontSize:".88rem" }}>₹{product.offerPrice.toLocaleString()}</span>
                    <span style={{ color:"#aaa", textDecoration:"line-through", fontSize:".78rem" }}>₹{product.price.toLocaleString()}</span>
                    <span style={{ color:BRAND, fontWeight:700, fontSize:".75rem" }}>({discount}% OFF)</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display:"flex", gap:".25rem", background:"#f9f9f9", borderRadius:50, padding:".25rem", width:"fit-content" }}>
                <button className="sg-tab active">Size Chart</button>
                <button className="sg-tab" style={{ color:"#888", background:"transparent" }}>How to measure</button>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".85rem 1.2rem", borderBottom:"1px solid rgba(229,93,106,.07)" }}>
              <div style={{ display:"flex", gap:".5rem", fontSize:".8rem", color:"#888", fontWeight:600 }}>
                <span>EURO</span>
              </div>
              <div className="unit-toggle">
                <button className={`unit-btn ${sizeUnit==="in"?"active":""}`} onClick={() => setSizeUnit("in")}>in</button>
                <button className={`unit-btn ${sizeUnit==="cm"?"active":""}`} onClick={() => setSizeUnit("cm")}>cm</button>
              </div>
            </div>

            {/* Table header */}
            <div className="sg-row header">
              <div/>
              <div>EURO</div>
              <div>UK</div>
              <div>Foot Length ({sizeUnit})</div>
            </div>

            {/* Table rows */}
            {SIZE_GUIDE.map((row) => {
              const isSelected = String(row.uk) === String(selSize) || String(row.euro) === String(selSize);
              return (
                <div
                  key={row.euro}
                  className={`sg-row ${isSelected ? "highlighted" : ""}`}
                  style={{ cursor:"pointer" }}
                  onClick={() => { setSelSize(row.uk); setShowSizeGuide(false); }}
                >
                  <div>
                    {isSelected && (
                      <span style={{ width:10, height:10, borderRadius:"50%", background:BRAND, display:"inline-block", boxShadow:`0 0 6px ${BRAND}` }}/>
                    )}
                  </div>
                  <div style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? BRAND : "#333", fontSize:".9rem" }}>{row.euro}</div>
                  <div style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? BRAND : "#333", fontSize:".9rem" }}>{row.uk}</div>
                  <div style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? BRAND : "#333", fontSize:".9rem" }}>
                    {sizeUnit === "cm" ? row.cm : row.inch}
                  </div>
                </div>
              );
            })}

            {/* How to measure tip */}
            <div style={{ margin:"1rem 1.2rem", padding:"1rem", background:"rgba(229,93,106,.05)", borderRadius:12, border:"1px solid rgba(229,93,106,.12)" }}>
              <div style={{ fontSize:".78rem", fontWeight:700, color:"#1a1a1a", marginBottom:".35rem" }}>💡 How to measure</div>
              <div style={{ fontSize:".76rem", color:"#888", lineHeight:1.65 }}>
                Stand on a flat surface and measure from the heel to the longest toe. Use the measurement to find your size above.
                If between sizes, we recommend going up.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ MAIN MODAL ══════ */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>

          {sent ? (
            /* ── ORDER SUCCESS ── */
            <div style={{ padding:"4rem 2rem", textAlign:"center" }}>
              <div className="success-icon" style={{ fontSize:"4rem", marginBottom:"1rem" }}>✅</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:"#1a1a1a", marginBottom:".75rem" }}>
                Order Placed Successfully!
              </h2>
              <p style={{ color:"#666", marginBottom:".5rem" }}>
                Thank you <strong>{form.name}</strong>! Your order for <strong>{product.name}</strong> has been received.
              </p>
              {placedOrderId && (
                <div style={{ margin:"1rem 0", padding:".75rem 1.25rem", background:"rgba(229,93,106,.07)", borderRadius:12, border:`1.5px solid rgba(229,93,106,.2)`, display:"inline-block" }}>
                  <span style={{ color:"#aaa", fontSize:".8rem" }}>Your Order ID: </span>
                  <strong style={{ color:BRAND, fontFamily:"monospace", fontSize:"1.1rem", letterSpacing:".08em" }}>{placedOrderId}</strong>
                </div>
              )}
              <p style={{ color:"#666", marginBottom:"2rem" }}>
                We'll contact you at <strong>{form.phone}</strong> to confirm delivery.<br/>
                <span style={{ fontSize:".85rem" }}>Save your Order ID to track delivery status.</span>
              </p>
              <div style={{ background:"rgba(229,93,106,.05)", border:`1.5px solid rgba(229,93,106,.15)`, borderRadius:16, padding:"1.5rem", maxWidth:380, margin:"0 auto 2rem", textAlign:"left" }}>
                <div style={{ fontWeight:700, color:"#1a1a1a", marginBottom:".75rem", fontSize:".9rem" }}>Order Summary</div>
                {[
                  ["Product", product.name],
                  ["Size",    selSize],
                  ["Color",   selColor?.name || "Default"],
                  ["Qty",     qty],
                  ["Total",   `₹${(product.offerPrice*qty).toLocaleString()}`],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", color:"#888", marginBottom:".4rem" }}>
                    <span>{k}</span><strong style={{ color:"#1a1a1a" }}>{v}</strong>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
            </div>

          ) : orderForm ? (
            /* ── ORDER FORM ── */
            <div style={{ padding:"2rem" }}>
              <button onClick={() => setOrderForm(false)} style={{ background:"none",border:"none",cursor:"pointer",color:"#888",fontSize:".85rem",fontWeight:600,marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:".4rem",transition:"color .2s" }}
                onMouseOver={e=>e.currentTarget.style.color=BRAND} onMouseOut={e=>e.currentTarget.style.color="#888"}>
                ← Back
              </button>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"1.5rem" }}>
                {/* Left: order summary */}
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"#1a1a1a", marginBottom:"1.25rem" }}>Delivery Details</h2>
                  <div style={{ background:"rgba(229,93,106,.05)", border:`1.5px solid rgba(229,93,106,.15)`, borderRadius:14, padding:"1.2rem", marginBottom:"1.5rem" }}>
                    <div style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgs[0]} alt={product.name} style={{ width:70, height:70, objectFit:"cover", borderRadius:10 }}/>
                      <div>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#1a1a1a", fontSize:".95rem" }}>{product.name}</div>
                        <div style={{ color:BRAND, fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", margin:".2rem 0" }}>{product.category}</div>
                        <div style={{ fontSize:".8rem", color:"#666" }}>Size: <strong>{selSize}</strong> | Qty: <strong>{qty}</strong></div>
                        <div style={{ fontWeight:800, color:BRAND, marginTop:".3rem" }}>₹{(product.offerPrice*qty).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:".6rem" }}>
                    {["🚚 Free delivery to your door","📦 Shipped within 24 hours","↩️ 7-day easy returns","🔒 100% secure order"].map(t => (
                      <div key={t} style={{ display:"flex", alignItems:"center", gap:".5rem", color:"#888", fontSize:".82rem", fontWeight:500 }}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Right: form */}
                <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                  {[
                    { key:"name",    label:"Full Name",        placeholder:"Your full name",        type:"text" },
                    { key:"phone",   label:"Phone Number",     placeholder:"10-digit mobile number", type:"tel"  },
                    { key:"address", label:"Delivery Address", placeholder:"House no, street, area", type:"text" },
                    { key:"city",    label:"City",             placeholder:"City",                   type:"text" },
                    { key:"state",   label:"State",            placeholder:"State",                  type:"text" },
                    { key:"pincode", label:"Pincode",          placeholder:"6-digit pincode",        type:"text" },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ fontSize:".8rem", fontWeight:700, color:"#1a1a1a", display:"block", marginBottom:".35rem" }}>{label}</label>
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
                style={{ width:"100%", padding:"1rem", fontSize:"1rem", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem", borderRadius:12 }}
                onClick={handleOrder}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <div style={{ width:18,height:18,borderRadius:"50%",border:"2px solid rgba(255,255,255,.35)",borderTop:"2px solid #fff",animation:"spin 1s linear infinite" }}/>
                    Placing Order...
                  </>
                ) : (
                  "🛍️ Place Order — ₹" + (product.offerPrice * qty).toLocaleString()
                )}
              </button>
              <p style={{ textAlign:"center", color:"#aaa", fontSize:".72rem", marginTop:".75rem" }}>
                By placing order you agree to our terms. We'll send confirmation to your phone.
              </p>
            </div>

          ) : (
            /* ── PRODUCT DETAIL VIEW ── */
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0" }}>

              {/* Left: Image Gallery */}
              <div style={{ padding:"1.5rem", background:"#fdf5f6", borderRadius:"20px 0 0 20px", position:"relative" }}>
                <div style={{ borderRadius:14, overflow:"hidden", background:"#fce8eb", marginBottom:".75rem", aspectRatio:"1", position:"relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgs[activeImg]}
                    alt={product.name}
                    key={activeImg}
                    style={{ width:"100%",height:"100%",objectFit:"cover",animation:"fadeIn .35s ease" }}
                  />
                  <span style={{ position:"absolute",top:12,left:12,background:BRAND,color:"#fff",fontSize:".65rem",fontWeight:800,padding:".2rem .55rem",borderRadius:20 }}>
                    {discount}% OFF
                  </span>
                </div>
                <div style={{ display:"flex", gap:".5rem", overflowX:"auto", paddingBottom:".25rem" }}>
                  {imgs.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt={`view ${i+1}`} className={`img-thumb ${i===activeImg?"active":""}`} onClick={() => setActiveImg(i)}/>
                  ))}
                </div>
                <div style={{ textAlign:"center", marginTop:".75rem" }}>
                  <span style={{ fontSize:".7rem", color:"#aaa", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase" }}>
                    View {activeImg+1} of {imgs.length} • Multiple Angles
                  </span>
                </div>
              </div>

              {/* Right: Product Info */}
              <div style={{ padding:"2rem 1.75rem", overflowY:"auto" }}>
                <div style={{ fontSize:".7rem", color:"#aaa", marginBottom:".75rem" }}>
                  Home / {product.category} / <span style={{ color:BRAND }}>{product.name}</span>
                </div>

                <span style={{ fontSize:".68rem",color:BRAND,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase" }}>{product.category}</span>

                <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:900,color:"#1a1a1a",lineHeight:1.25,margin:".4rem 0 .6rem" }}>
                  {product.name}
                </h1>

                <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1rem" }}>
                  <div>{"★★★★★".split("").map((s,i)=><span key={i} className="star">{s}</span>)}</div>
                  <span style={{ fontSize:".8rem",color:"#666",fontWeight:600 }}>4.8 (124 reviews)</span>
                  <span style={{ fontSize:".72rem",color:"#16a34a",fontWeight:700,background:"rgba(22,163,74,.1)",padding:".15rem .5rem",borderRadius:20 }}>✓ In Stock</span>
                </div>

                {/* Price */}
                <div style={{ display:"flex", alignItems:"baseline", gap:".75rem", marginBottom:"1.25rem", padding:"1rem", background:"rgba(229,93,106,.05)", borderRadius:12, border:`1px solid rgba(229,93,106,.12)` }}>
                  <span style={{ fontSize:"2rem",fontWeight:900,color:BRAND }}>₹{product.offerPrice.toLocaleString()}</span>
                  <span style={{ fontSize:"1rem",color:"#ccc",textDecoration:"line-through" }}>₹{product.price.toLocaleString()}</span>
                  <span style={{ fontSize:".8rem",color:"#16a34a",fontWeight:800,background:"rgba(22,163,74,.12)",padding:".2rem .6rem",borderRadius:20 }}>
                    Save ₹{(product.price-product.offerPrice).toLocaleString()} ({discount}%)
                  </span>
                </div>

                {/* Color */}
                {product.colorOptions && (
                  <div style={{ marginBottom:"1rem" }}>
                    <div style={{ fontSize:".8rem",fontWeight:700,color:"#1a1a1a",marginBottom:".55rem" }}>
                      Color: <span style={{ color:BRAND,fontWeight:800 }}>{selColor?.name}</span>
                    </div>
                    <div style={{ display:"flex", gap:".6rem" }}>
                      {product.colorOptions.map(c => (
                        <button key={c.hex} className={`color-dot ${selColor?.hex===c.hex?"active":""}`}
                          style={{ background:c.hex }} title={c.name} onClick={() => setSelColor(c)}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                <div style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".55rem" }}>
                    <span style={{ fontSize:".8rem",fontWeight:700,color:"#1a1a1a" }}>Size: <span style={{ color:BRAND }}>UK {selSize}</span></span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      style={{ background:"none",border:"none",cursor:"pointer",color:BRAND,fontSize:".75rem",fontWeight:700,display:"flex",alignItems:"center",gap:".3rem",transition:"opacity .2s",padding:0 }}
                      onMouseOver={e=>e.currentTarget.style.opacity=".7"} onMouseOut={e=>e.currentTarget.style.opacity="1"}
                    >
                      📏 Size Guide →
                    </button>
                  </div>
                  <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
                    {product.sizes.map(s => (
                      <button key={s} className={`size-btn ${selSize===s?"active":""}`} onClick={() => setSelSize(s)}>UK {s}</button>
                    ))}
                  </div>
                </div>

                {/* Qty */}
                <div style={{ marginBottom:"1.25rem" }}>
                  <div style={{ fontSize:".8rem",fontWeight:700,color:"#1a1a1a",marginBottom:".55rem" }}>Quantity</div>
                  <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                    <span style={{ fontWeight:800,fontSize:"1.1rem",color:"#1a1a1a",minWidth:"1.5rem",textAlign:"center" }}>{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
                    <span style={{ fontSize:".78rem",color:"#888",marginLeft:".25rem" }}>
                      Total: <strong style={{ color:BRAND }}>₹{(product.offerPrice*qty).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex", flexDirection:"column", gap:".7rem", marginBottom:"1.25rem" }}>
                  <button
                    className="btn-primary"
                    style={{ width:"100%",padding:".85rem",fontSize:".95rem",borderRadius:12,background:added?"#22c55e":BRAND,boxShadow:added?"0 6px 20px rgba(34,197,94,.35)":"0 6px 20px rgba(229,93,106,.35)" }}
                    onClick={handleAdd}
                  >
                    {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                  </button>
                  <button
                    style={{ width:"100%",padding:".85rem",fontSize:".95rem",borderRadius:12,background:"#ff8c42",border:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:".05em",boxShadow:"0 6px 20px rgba(255,140,66,.35)",transition:"all .3s" }}
                    onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform="none"}
                    onClick={() => setOrderForm(true)}
                  >
                    ⚡ Buy Now — Place Order
                  </button>
                </div>

                {/* Delivery info */}
                <div style={{ background:"rgba(229,93,106,.04)", border:`1px solid rgba(229,93,106,.12)`, borderRadius:12, padding:"1rem", marginBottom:"1rem" }}>
                  <div style={{ fontSize:".78rem",fontWeight:700,color:"#1a1a1a",marginBottom:".55rem" }}>Delivery & Returns</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:".4rem" }}>
                    {["🚚 Free delivery • Ships in 24hrs","↩️ 7-day hassle-free returns","💳 Cash on delivery available","📦 Premium packaging included"].map(t => (
                      <div key={t} style={{ fontSize:".78rem",color:"#888",display:"flex",alignItems:"center",gap:".4rem" }}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={{ fontSize:".83rem",color:"#888",lineHeight:1.75 }}>
                  <strong style={{ color:"#1a1a1a",display:"block",marginBottom:".4rem" }}>About this product</strong>
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