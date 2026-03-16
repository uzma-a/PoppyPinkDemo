// src/components/ProductModal.js
import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useCart } from "../context/CartContext";

const BRAND = "#e55d6a";

const SIZE_GUIDE = [
  { euro: 36, uk: 3, us: 5,  cm: 22.7, inch: 8.9  },
  { euro: 37, uk: 4, us: 6,  cm: 23.3, inch: 9.2  },
  { euro: 38, uk: 5, us: 7,  cm: 24.0, inch: 9.4  },
  { euro: 39, uk: 6, us: 8,  cm: 24.7, inch: 9.7  },
  { euro: 40, uk: 7, us: 9,  cm: 25.3, inch: 10.0 },
  { euro: 41, uk: 8, us: 10,  cm: 26.0, inch: 10.2 },
];

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { isSignedIn, user } = useUser();

  const [activeImg,     setActiveImg]     = useState(0);
  const [selSize,       setSelSize]       = useState(product.sizes[2] || product.sizes[0]);
  const [selColor,      setSelColor]      = useState(product.colorOptions?.[0] || null);
  const [qty,           setQty]           = useState(1);
  const [added,         setAdded]         = useState(false);
  const [orderForm,     setOrderForm]     = useState(false);
  const [sending,       setSending]       = useState(false);
  const [sent,          setSent]          = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit,      setSizeUnit]      = useState("cm");
  const [isMobile,      setIsMobile]      = useState(false);

  const [form,    setForm]    = useState({ name:"", phone:"", address:"", pincode:"", city:"", state:"" });
  const [formErr, setFormErr] = useState({});

  const imgs     = product.images || [product.image];
  const discount = Math.round((1 - product.offerPrice / product.price) * 100);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const check = () => setIsMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    if (!document.getElementById("razorpay-script")) {
      const s = document.createElement("script");
      s.id = "razorpay-script";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(s);
    }
    return () => { document.body.style.overflow = ""; window.removeEventListener("resize", check); };
  }, []);

  const handleOpenOrderForm = () => {
    setForm(prev => ({
      ...prev,
      name:  prev.name  || user?.fullName || "",
      phone: prev.phone || user?.primaryPhoneNumber?.phoneNumber || "",
    }));
    setOrderForm(true);
  };

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
      const customerEmail = user?.primaryEmailAddress?.emailAddress || "";
      const colorName     = selColor?.name || "—";
      const article       = product.article || "—";
      const orderTotal    = product.offerPrice * qty;
      const orderData = {
        customerName: form.name, customerPhone: form.phone, customerEmail,
        userId: user?.id || "",
        address: { line1: form.address, city: form.city, state: form.state, pincode: form.pincode },
        product: { id: product.id, name: product.name, article: product.article || "", category: product.category, size: selSize, color: colorName, qty, price: product.offerPrice, image: product.images?.[0] || product.image || "" },
        totalAmount: orderTotal,
      };
      const rzRes  = await fetch("/api/razorpay/create-order", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ amount: orderTotal, receipt: `modal_${Date.now()}` }) });
      const rzData = await rzRes.json();
      if (!rzRes.ok) throw new Error(rzData.error || "Could not initiate payment");
      setSending(false);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzData.amount, currency: rzData.currency,
        name: "POPPYPINK", description: product.name, image: "/logo.png", order_id: rzData.id,
        prefill: { name: form.name, email: customerEmail, contact: form.phone },
        theme: { color: "#e55d6a" },
        modal: { ondismiss: () => setSending(false) },
        handler: async (response) => {
          setSending(true);
          try {
            const verifyRes  = await fetch("/api/razorpay/verify", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, orderData }) });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            const newOrderId = verifyData.orderId;
            setPlacedOrderId(newOrderId);
            const w3fKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
            if (w3fKey && w3fKey !== "REPLACE_ME") {
              try {
                const payload = new FormData();
                payload.append("access_key", w3fKey);
                payload.append("subject", `🛍️ Paid Order ${newOrderId}: ${product.name} — POPPYPINK`);
                payload.append("from_name", "POPPYPINK Store");
                payload.append("message", [`━━━━━━━━━━━━━━━━━━━━━━━━━`,"💳  PAID ORDER — POPPYPINK",`━━━━━━━━━━━━━━━━━━━━━━━━━`,`Order ID : ${newOrderId}`,`Product  : ${product.name}`,`Article  : ${article}`,`Color    : ${colorName}`,`Size     : ${selSize}`,`Qty      : ${qty}`,`Total    : ₹${orderTotal.toLocaleString()}`,`Payment  : Online (Razorpay) ✅`,"",`📦 CUSTOMER`,`━━━━━━━━━━━━━━━━━━━━━━━━━`,`Name    : ${form.name}`,`Phone   : ${form.phone}`,`Address : ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,"",`Time    : ${new Date().toLocaleString("en-IN")}`].join("\n"));
                await fetch("https://api.web3forms.com/submit", { method:"POST", body:payload });
              } catch (_) {}
            }
            setSent(true);
          } catch (e) {
            alert("Payment succeeded but order save failed: " + e.message + "\nContact support with payment ID: " + response.razorpay_payment_id);
          } finally { setSending(false); }
        },
      };
      const rzPopup = new window.Razorpay(options);
      rzPopup.on("payment.failed", (r) => { setSending(false); alert("Payment failed: " + (r.error?.description || "Please try again.")); });
      rzPopup.open();
    } catch (e) { alert("Checkout error: " + e.message); setSending(false); }
  };

  return (
    <>
      <style>{`
        .m-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.55);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 0;
          animation: mFadeIn .25s ease;
        }
        /* ── MODAL BOX ── */
        .m-box {
          background: #fff;
          width: 100%; height: 100%;
          max-width: 960px;
          max-height: 100dvh;
          overflow-y: auto;
          position: relative;
          animation: mFadeUp .3s ease;
          box-shadow: 0 24px 80px rgba(0,0,0,.2);
          border-radius: 0;
        }
        @media (min-width: 700px) {
          .m-overlay { padding: 1rem; }
          .m-box {
            height: auto;
            max-height: 92vh;
            border-radius: 16px;
          }
        }
        .m-box::-webkit-scrollbar { width: 3px; }
        .m-box::-webkit-scrollbar-thumb { background: ${BRAND}; border-radius: 2px; }

        /* ── CLOSE BTN ── */
        .m-close {
          position: fixed;
          top: 10px; right: 10px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,.95);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #555; font-size: 1rem;
          box-shadow: 0 2px 10px rgba(0,0,0,.15);
          z-index: 10;
          transition: background .2s;
        }
        .m-close:hover { background: ${BRAND}; color: #fff; }

        /* ── LAYOUT: mobile = single col, desktop = 2 col ── */
        .m-layout {
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 700px) {
          .m-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ── GALLERY (left) ── */
        .m-gallery {
          background: #fdf5f6;
          padding: 1rem;
        }
        @media (min-width: 700px) {
          .m-gallery {
            border-radius: 16px 0 0 16px;
            padding: 1.5rem;
          }
        }
        .m-main-img {
          border-radius: 10px;
          overflow: hidden;
          background: #fce8eb;
          aspect-ratio: 1;
          position: relative;
          margin-bottom: .6rem;
        }
        .m-main-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          animation: mFadeIn .3s ease;
        }
        .m-thumbs {
          display: flex; gap: .4rem;
          overflow-x: auto; padding-bottom: .2rem;
        }
        .m-thumb {
          width: 54px; height: 54px;
          object-fit: cover;
          border-radius: 7px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color .2s;
          flex-shrink: 0;
        }
        .m-thumb.active { border-color: ${BRAND}; }

        /* ── INFO (right) ── */
        .m-info {
          padding: 1.25rem 1rem 1.5rem;
          overflow-y: auto;
        }
        @media (min-width: 700px) {
          .m-info { padding: 2rem 1.75rem; }
        }

        /* Size buttons */
        .sz-btn {
          padding: .38rem .65rem;
          border-radius: 6px;
          border: 1.5px solid rgba(229,93,106,.3);
          background: transparent;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          font-size: .78rem; font-weight: 600;
          cursor: pointer;
          transition: all .18s;
          min-width: 42px;
        }
        .sz-btn:hover { border-color: ${BRAND}; background: rgba(229,93,106,.06); }
        .sz-btn.active { background: ${BRAND}; border-color: ${BRAND}; color: #fff; }

        /* Color dots */
        .c-dot {
          width: 26px; height: 26px; border-radius: 50%;
          cursor: pointer; border: 3px solid transparent;
          transition: all .18s; flex-shrink: 0;
        }
        .c-dot.active { border-color: #1a1a1a; transform: scale(1.12); }

        /* Qty */
        .qty-btn {
          width: 32px; height: 32px; border-radius: 7px;
          border: 1.5px solid rgba(229,93,106,.3);
          background: transparent; font-size: 1rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all .18s;
        }
        .qty-btn:hover { background: rgba(229,93,106,.08); border-color: ${BRAND}; }

        /* Buttons */
        .btn-atc {
          width: 100%; padding: .85rem;
          background: ${BRAND}; border: none; color: #fff;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: .92rem; border-radius: 10px; cursor: pointer;
          box-shadow: 0 6px 20px rgba(229,93,106,.3);
          transition: all .2s;
        }
        .btn-atc:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(229,93,106,.4); }
        .btn-atc.added { background: #22c55e; box-shadow: 0 6px 20px rgba(34,197,94,.3); }

        .btn-buy {
          width: 100%; padding: .85rem;
          background: #ff8c42; border: none; color: #fff;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: .92rem; border-radius: 10px; cursor: pointer;
          box-shadow: 0 6px 20px rgba(255,140,66,.3);
          transition: all .2s;
        }
        .btn-buy:hover { transform: translateY(-1px); }

        .btn-signin {
          width: 100%; padding: .85rem;
          background: #ff8c42; border: none; color: #fff;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: .92rem; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
        }

        /* Form inputs */
        .f-input {
          width: 100%; padding: .6rem .85rem;
          border: 1.5px solid rgba(229,93,106,.25);
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: .85rem;
          color: #1a1a1a; outline: none; background: #fff;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .f-input:focus { border-color: ${BRAND}; box-shadow: 0 0 0 3px rgba(229,93,106,.1); }
        .f-input.err { border-color: #dc2626; }
        .f-err { color: #dc2626; font-size: .68rem; margin-top: .18rem; }

        /* Size guide */
        .sg-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.45); backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex; align-items: flex-end; justify-content: center;
          animation: mFadeIn .2s ease;
        }
        @media (min-width: 600px) {
          .sg-overlay { align-items: center; }
        }
        .sg-box {
          background: #fff;
          width: 100%; max-width: 480px;
          max-height: 85vh; overflow-y: auto;
          border-radius: 16px 16px 0 0;
          position: relative;
          animation: mSlideUp .3s ease;
          box-shadow: 0 -8px 40px rgba(0,0,0,.15);
          padding-bottom: 1.5rem;
        }
        @media (min-width: 600px) {
          .sg-box { border-radius: 16px; animation: mFadeUp .3s ease; }
        }
        .sg-row {
          display: grid;
          grid-template-columns: 32px 1fr 1fr 1fr 1fr;
          gap: .4rem; align-items: center;
          padding: .6rem 1.1rem;
          border-bottom: 1px solid rgba(229,93,106,.07);
          transition: background .15s; cursor: pointer;
        }
        .sg-row:hover { background: rgba(229,93,106,.04); }
        .sg-row.sg-header { background: rgba(229,93,106,.06); font-weight:700; color:#666; font-size:.7rem; letter-spacing:.08em; text-transform:uppercase; cursor:default; }
        .sg-row.sg-sel { background: rgba(229,93,106,.08); border-left: 3px solid ${BRAND}; }

        .star { color: #f59e0b; font-size: .85rem; }

        @keyframes mFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes mFadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes succPop  { 0%{transform:scale(0);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* ══ SIZE GUIDE SHEET ══ */}
      {showSizeGuide && (
        <div className="sg-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="sg-box" onClick={e => e.stopPropagation()}>
            <div style={{ padding:"1.2rem 1.1rem .8rem", borderBottom:"1px solid rgba(229,93,106,.1)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontWeight:800, fontSize:"1rem", color:"#1a1a1a" }}>Size Guide</span>
              <button onClick={() => setShowSizeGuide(false)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:"1.2rem",color:"#888",lineHeight:1 }}>✕</button>
            </div>
            {/* unit toggle */}
            <div style={{ display:"flex", justifyContent:"flex-end", padding:".7rem 1.1rem", borderBottom:"1px solid rgba(229,93,106,.07)" }}>
              <div style={{ display:"flex", borderRadius:50, overflow:"hidden", border:"1.5px solid rgba(229,93,106,.25)", background:"#f9f9f9" }}>
                {["cm","in"].map(u => (
                  <button key={u} onClick={() => setSizeUnit(u)}
                    style={{ padding:".3rem .85rem", border:"none", background: sizeUnit===u ? BRAND : "transparent", color: sizeUnit===u ? "#fff" : "#999", fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", fontWeight:700, cursor:"pointer" }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="sg-row sg-header"><div/><div>EURO</div><div>UK</div><div>US</div><div>Foot ({sizeUnit})</div></div>
            {SIZE_GUIDE.map(row => {
              const isSel = String(row.uk)===String(selSize) || String(row.euro)===String(selSize) || String(row.us)===String(selSize);
              return (
                <div key={row.euro} className={`sg-row${isSel?" sg-sel":""}`}
                  onClick={() => { setSelSize(row.uk); setShowSizeGuide(false); }}>
                  <div>{isSel && <span style={{ width:8,height:8,borderRadius:"50%",background:BRAND,display:"inline-block" }}/>}</div>
                  <div style={{ fontWeight:isSel?700:400, color:isSel?BRAND:"#333", fontSize:".88rem" }}>{row.euro}</div>
                  <div style={{ fontWeight:isSel?700:400, color:isSel?BRAND:"#333", fontSize:".88rem" }}>{row.uk}</div>
                  <div style={{ fontWeight:isSel?700:400, color:isSel?BRAND:"#333", fontSize:".88rem" }}>{row.us}</div>
                  <div style={{ fontWeight:isSel?700:400, color:isSel?BRAND:"#333", fontSize:".88rem" }}>{sizeUnit==="cm"?row.cm:row.inch}</div>
                </div>
              );
            })}
            <div style={{ margin:"1rem 1.1rem 0", padding:".85rem", background:"rgba(229,93,106,.05)", borderRadius:10, border:"1px solid rgba(229,93,106,.12)", fontSize:".76rem", color:"#888", lineHeight:1.6 }}>
              💡 Stand on flat surface, measure heel to longest toe. If between sizes, go up.
            </div>
          </div>
        </div>
      )}

      {/* ══ MAIN MODAL ══ */}
      <div className="m-overlay" onClick={onClose}>
        <div className="m-box" onClick={e => e.stopPropagation()}>
          <button className="m-close" onClick={onClose}>✕</button>

          {sent ? (
            /* ── SUCCESS ── */
            <div style={{ padding:"3rem 1.5rem", textAlign:"center" }}>
              <div style={{ fontSize:"3.5rem", marginBottom:".75rem", animation:"succPop .5s ease forwards" }}>✅</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.7rem", color:"#1a1a1a", marginBottom:".6rem" }}>Order Placed!</h2>
              <p style={{ color:"#666", marginBottom:".5rem" }}>
                Thank you <strong>{form.name}</strong>! Your order for <strong>{product.name}</strong> is confirmed.
              </p>
              {placedOrderId && (
                <div style={{ margin:"1rem auto", padding:".65rem 1rem", background:"rgba(229,93,106,.07)", borderRadius:10, border:`1.5px solid rgba(229,93,106,.2)`, display:"inline-block" }}>
                  <span style={{ color:"#aaa", fontSize:".75rem" }}>Order ID: </span>
                  <strong style={{ color:BRAND, fontFamily:"monospace", fontSize:"1rem" }}>{placedOrderId}</strong>
                </div>
              )}
              <p style={{ color:"#888", fontSize:".85rem", marginBottom:"1.5rem" }}>
                We'll contact you at <strong>{form.phone}</strong> for delivery.
              </p>
              <div style={{ background:"rgba(229,93,106,.05)", border:`1.5px solid rgba(229,93,106,.15)`, borderRadius:12, padding:"1.25rem", maxWidth:340, margin:"0 auto 1.5rem", textAlign:"left" }}>
                {[["Product",product.name],["Size",selSize],["Color",selColor?.name||"—"],["Qty",qty],["Payment","💳 Online"],["Total",`₹${(product.offerPrice*qty).toLocaleString()}`]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem", color:"#888", marginBottom:".35rem" }}>
                    <span>{k}</span><strong style={{ color:"#1a1a1a" }}>{v}</strong>
                  </div>
                ))}
              </div>
              <button className="btn-atc" onClick={onClose}>Continue Shopping</button>
            </div>

          ) : orderForm ? (
            /* ── ORDER FORM ── */
            <div style={{ padding:"1.25rem 1rem 2rem" }}>
              <button onClick={() => setOrderForm(false)}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#888", fontSize:".82rem", fontWeight:600, marginBottom:"1.25rem", display:"flex", alignItems:"center", gap:".35rem" }}>
                ← Back
              </button>
              {user && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:".45rem", background:"rgba(22,163,74,.08)", border:"1px solid rgba(22,163,74,.2)", borderRadius:20, padding:".25rem .85rem", marginBottom:"1.1rem", fontSize:".75rem" }}>
                  <span style={{ color:"#16a34a", fontWeight:700 }}>✓ Signed in</span>
                  <span style={{ color:"#555" }}>{user.primaryEmailAddress?.emailAddress}</span>
                </div>
              )}
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", color:"#1a1a1a", marginBottom:"1rem" }}>Delivery Details</h2>

              {/* Product summary */}
              <div style={{ background:"rgba(229,93,106,.05)", border:`1.5px solid rgba(229,93,106,.15)`, borderRadius:12, padding:"1rem", marginBottom:"1.25rem", display:"flex", gap:".85rem", alignItems:"center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgs[0]} alt={product.name} style={{ width:60, height:60, objectFit:"cover", borderRadius:8, flexShrink:0 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, color:"#1a1a1a", fontSize:".88rem", marginBottom:".2rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{product.name}</div>
                  <div style={{ fontSize:".75rem", color:"#888" }}>Size: <strong>{selSize}</strong> · Color: <strong>{selColor?.name||"—"}</strong> · Qty: <strong>{qty}</strong></div>
                  <div style={{ fontWeight:800, color:BRAND, marginTop:".2rem", fontSize:".9rem" }}>₹{(product.offerPrice*qty).toLocaleString()}</div>
                </div>
              </div>

              {/* Form fields */}
              <div style={{ display:"flex", flexDirection:"column", gap:".85rem" }}>
                {[
                  { key:"name",    label:"Full Name",        placeholder:"Your full name",         type:"text" },
                  { key:"phone",   label:"Phone Number",     placeholder:"10-digit mobile number", type:"tel"  },
                  { key:"address", label:"Delivery Address", placeholder:"House no, street, area", type:"text" },
                  { key:"city",    label:"City",             placeholder:"City",                   type:"text" },
                  { key:"state",   label:"State",            placeholder:"State",                  type:"text" },
                  { key:"pincode", label:"Pincode",          placeholder:"6-digit pincode",        type:"text" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ fontSize:".78rem", fontWeight:700, color:"#1a1a1a", display:"block", marginBottom:".3rem" }}>{label}</label>
                    <input
                      className={`f-input${formErr[key]?" err":""}`}
                      type={type} placeholder={placeholder} value={form[key]}
                      onChange={e => { setForm(p=>({...p,[key]:e.target.value})); setFormErr(p=>({...p,[key]:""})); }}
                    />
                    {formErr[key] && <div className="f-err">{formErr[key]}</div>}
                  </div>
                ))}
              </div>

              <button className="btn-atc" style={{ marginTop:"1.5rem", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", gap:".5rem" }}
                onClick={handleOrder} disabled={sending}>
                {sending ? (
                  <><div style={{ width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,.35)",borderTop:"2px solid #fff",animation:"spin 1s linear infinite" }}/>Processing…</>
                ) : `💳 Pay Now — ₹${(product.offerPrice*qty).toLocaleString()}`}
              </button>
              <p style={{ textAlign:"center", color:"#bbb", fontSize:".7rem", marginTop:".6rem" }}>
                Secure payment via Razorpay · UPI, Cards, Net Banking
              </p>
            </div>

          ) : (
            /* ── PRODUCT DETAIL ── */
            <div className="m-layout">

              {/* ── Gallery ── */}
              <div className="m-gallery">
                <div className="m-main-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgs[activeImg]} alt={product.name} key={activeImg}/>
                  <span style={{ position:"absolute",top:10,left:10,background:BRAND,color:"#fff",fontSize:".62rem",fontWeight:800,padding:".18rem .5rem",borderRadius:20 }}>
                    {discount}% OFF
                  </span>
                </div>
                <div className="m-thumbs">
                  {imgs.map((img,i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt={`view ${i+1}`}
                      className={`m-thumb${i===activeImg?" active":""}`}
                      onClick={() => setActiveImg(i)}/>
                  ))}
                </div>
                <div style={{ textAlign:"center", marginTop:".5rem", fontSize:".65rem", color:"#bbb", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" }}>
                  View {activeImg+1} of {imgs.length} · Multiple Angles
                </div>
              </div>

              {/* ── Info ── */}
              <div className="m-info">
                {/* breadcrumb */}
                <div style={{ fontSize:".65rem", color:"#bbb", marginBottom:".6rem" }}>
                  Home / {product.category} / <span style={{ color:BRAND }}>{product.name}</span>
                </div>

                <span style={{ fontSize:".65rem", color:BRAND, fontWeight:800, letterSpacing:".12em", textTransform:"uppercase" }}>{product.category}</span>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", fontWeight:900, color:"#1a1a1a", lineHeight:1.25, margin:".35rem 0 .5rem" }}>
                  {product.name}
                </h1>

                {/* Rating */}
                <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginBottom:".85rem" }}>
                  <div>{"★★★★★".split("").map((s,i) => <span key={i} className="star">{s}</span>)}</div>
                  <span style={{ fontSize:".75rem", color:"#666", fontWeight:600 }}>4.8 (124 reviews)</span>
                  <span style={{ fontSize:".68rem", color:"#16a34a", fontWeight:700, background:"rgba(22,163,74,.1)", padding:".12rem .45rem", borderRadius:20 }}>✓ In Stock</span>
                </div>

                {/* Price */}
                <div style={{ display:"flex", alignItems:"baseline", gap:".65rem", marginBottom:"1rem", padding:".85rem", background:"rgba(229,93,106,.05)", borderRadius:10, border:`1px solid rgba(229,93,106,.12)` }}>
                  <span style={{ fontSize:"1.7rem", fontWeight:900, color:BRAND }}>₹{product.offerPrice.toLocaleString()}</span>
                  <span style={{ fontSize:".9rem", color:"#ccc", textDecoration:"line-through" }}>₹{product.price.toLocaleString()}</span>
                  <span style={{ fontSize:".72rem", color:"#16a34a", fontWeight:800, background:"rgba(22,163,74,.12)", padding:".15rem .5rem", borderRadius:20 }}>
                    Save ₹{(product.price-product.offerPrice).toLocaleString()} ({discount}%)
                  </span>
                </div>

                {/* Colors */}
                {product.colorOptions && (
                  <div style={{ marginBottom:".85rem" }}>
                    <div style={{ fontSize:".76rem", fontWeight:700, color:"#1a1a1a", marginBottom:".45rem" }}>
                      Color: <span style={{ color:BRAND }}>{selColor?.name}</span>
                    </div>
                    <div style={{ display:"flex", gap:".5rem" }}>
                      {product.colorOptions.map(c => (
                        <button key={c.hex} className={`c-dot${selColor?.hex===c.hex?" active":""}`}
                          style={{ background:c.hex, border:"3px solid transparent" }} title={c.name}
                          onClick={() => setSelColor(c)}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                <div style={{ marginBottom:".85rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".45rem" }}>
                    <span style={{ fontSize:".76rem", fontWeight:700, color:"#1a1a1a" }}>
                      Select Size (UK Size): <span style={{ color:BRAND }}>{selSize}</span>
                      
                    </span>
                    <button onClick={() => setShowSizeGuide(true)}
                      style={{ background:"none", border:"none", cursor:"pointer", color:BRAND, fontSize:".72rem", fontWeight:700, padding:0, display:"flex", alignItems:"center", gap:".25rem" }}>
                      📏 Size Guide →
                    </button>
                  </div>
                  <div style={{ display:"flex", gap:".4rem", flexWrap:"wrap" }}>
                    {product.sizes.map(s => (
                      <button key={s} className={`sz-btn${selSize===s?" active":""}`} onClick={() => setSelSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Qty */}
                <div style={{ marginBottom:"1rem" }}>
                  <div style={{ fontSize:".76rem", fontWeight:700, color:"#1a1a1a", marginBottom:".45rem" }}>Quantity</div>
                  <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                    <span style={{ fontWeight:800, fontSize:"1rem", color:"#1a1a1a", minWidth:"1.25rem", textAlign:"center" }}>{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
                    <span style={{ fontSize:".74rem", color:"#888", marginLeft:".2rem" }}>
                      Total: <strong style={{ color:BRAND }}>₹{(product.offerPrice*qty).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex", flexDirection:"column", gap:".6rem", marginBottom:"1rem" }}>
                  <button className={`btn-atc${added?" added":""}`} onClick={handleAdd}>
                    {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                  </button>
                  {isSignedIn ? (
                    <button className="btn-buy" onClick={handleOpenOrderForm}>
                      ⚡ Buy Now — Pay Online
                    </button>
                  ) : (
                    <SignInButton mode="modal" afterSignInUrl={typeof window !== "undefined" ? window.location.pathname : "/"}>
                      <button className="btn-signin">🔒 Sign In to Buy Now</button>
                    </SignInButton>
                  )}
                </div>

                {/* Delivery */}
                <div style={{ background:"rgba(229,93,106,.04)", border:`1px solid rgba(229,93,106,.1)`, borderRadius:10, padding:".85rem", fontSize:".76rem", color:"#888" }}>
                  <div style={{ fontWeight:700, color:"#1a1a1a", marginBottom:".4rem" }}>Delivery & Returns</div>
                  {["🚚 Free delivery · Ships in 24hrs","↩️ 7-day hassle-free returns","💳 Online payment accepted","📦 Premium packaging included"].map(t => (
                    <div key={t} style={{ marginBottom:".28rem" }}>{t}</div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}