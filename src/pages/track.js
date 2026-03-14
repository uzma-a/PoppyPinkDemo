// src/pages/track.js
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BRAND = "#e55d6a";

const STATUS_STEPS = [
  { key:"Processing",       icon:"🛒", label:"Order Placed",     desc:"Your order has been received"  },
  { key:"Confirmed",        icon:"✅", label:"Order Confirmed",  desc:"We've confirmed your order"    },
  { key:"Shipped",          icon:"📦", label:"Shipped",          desc:"Your order is on its way"      },
  { key:"Out for Delivery", icon:"🚚", label:"Out for Delivery", desc:"Arriving at your door today"   },
  { key:"Delivered",        icon:"🎉", label:"Delivered",        desc:"Enjoy your POPPYPINK sandals!" },
];

const STATUS_ORDER = STATUS_STEPS.map(s => s.key);

const STATUS_STYLES = {
  pending:          { bg:"#fff7ed", color:"#ea580c", label:"⏳ Pending"         },
  processing:       { bg:"#eff6ff", color:"#2563eb", label:"🔄 Processing"      },
  confirmed:        { bg:"#f0fdf4", color:"#16a34a", label:"✅ Confirmed"        },
  shipped:          { bg:"#faf5ff", color:"#7c3aed", label:"🚚 Shipped"          },
  out_for_delivery: { bg:"#fff7ed", color:"#d97706", label:"🛵 Out for Delivery" },
  delivered:        { bg:"#f0fdf4", color:"#15803d", label:"📦 Delivered"        },
  cancelled:        { bg:"#fef2f2", color:"#dc2626", label:"❌ Cancelled"        },
};

function getStepIndex(status) {
  const idx = STATUS_ORDER.findIndex(s => s.toLowerCase() === status?.toLowerCase());
  return idx >= 0 ? idx : 0;
}

// ── Single order tracking result card
function OrderResultCard({ result }) {
  const stepIndex   = getStepIndex(result.status);
  const isCancelled = result.status?.toLowerCase() === "cancelled";
  const st          = STATUS_STYLES[result.status?.toLowerCase()] || STATUS_STYLES.pending;

  return (
    <div style={{
      background:"#fff", border:"1.5px solid rgba(229,93,106,.15)",
      borderRadius:22, padding:"2rem",
      boxShadow:"0 20px 60px rgba(229,93,106,.1)",
      animation:"fadeUp .5s ease", marginBottom:"1.5rem",
    }}>
      {/* Order header */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        flexWrap:"wrap", gap:"1rem",
        paddingBottom:"1.5rem", marginBottom:"1.5rem",
        borderBottom:"1.5px solid rgba(229,93,106,.12)",
      }}>
        <div>
          <div style={{ fontSize:".7rem",color:"#aaa",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".35rem" }}>Order ID</div>
          <div style={{ fontFamily:"monospace",fontWeight:900,fontSize:"1.4rem",color:BRAND,letterSpacing:".06em" }}>{result.orderId}</div>
          <div style={{ fontSize:".78rem",color:"#aaa",marginTop:".3rem" }}>
            Placed {new Date(result.createdAt).toLocaleDateString("en-IN",{ day:"numeric",month:"long",year:"numeric" })}
            {" "}at {new Date(result.createdAt).toLocaleTimeString("en-IN",{ hour:"2-digit",minute:"2-digit" })}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:".5rem" }}>
          <div style={{ background:st.bg, color:st.color, fontWeight:700, fontSize:".78rem", padding:".35rem .85rem", borderRadius:20, whiteSpace:"nowrap" }}>
            {st.label}
          </div>
          <div style={{ fontSize:".78rem",color:"#aaa" }}>{result.customerName}</div>
          {result.address?.city && (
            <div style={{ fontSize:".75rem",color:"#aaa" }}>{result.address.city}{result.address.state ? `, ${result.address.state}` : ""}</div>
          )}
        </div>
      </div>

      {/* Cancelled */}
      {isCancelled ? (
        <div style={{ textAlign:"center",padding:"2rem",background:"rgba(239,68,68,.06)",border:"1.5px solid rgba(239,68,68,.18)",borderRadius:16,marginBottom:"1.5rem" }}>
          <div style={{ fontSize:"3rem",marginBottom:".75rem" }}>❌</div>
          <div style={{ fontWeight:800,color:"#dc2626",fontSize:"1.2rem",marginBottom:".5rem" }}>Order Cancelled</div>
          <p style={{ color:"#888",fontSize:".88rem" }}>This order has been cancelled. Contact us if you need help.</p>
        </div>
      ) : (
        <>
          {/* Progress tracker */}
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontSize:".72rem",color:"#aaa",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1.25rem" }}>Delivery Status</div>
            <div style={{ display:"flex",alignItems:"flex-start",gap:0,position:"relative" }}>
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= stepIndex;
                const isCurrent   = i === stepIndex;
                return (
                  <div key={step.key} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative" }}>
                    {i > 0 && (
                      <div style={{
                        position:"absolute",top:20,right:"50%",left:"-50%",
                        height:3,
                        background: isCompleted ? BRAND : "rgba(229,93,106,.12)",
                        zIndex:0,transition:"background .5s",borderRadius:2,
                      }}/>
                    )}
                    <div style={{
                      width:40,height:40,borderRadius:"50%",zIndex:1,position:"relative",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",
                      background: isCompleted ? BRAND : "rgba(229,93,106,.07)",
                      border: isCompleted ? `2px solid ${BRAND}` : "2px solid rgba(229,93,106,.15)",
                      boxShadow: isCurrent ? `0 0 0 5px rgba(229,93,106,.18),0 0 18px rgba(229,93,106,.25)` : "none",
                      animation: isCurrent ? "pulse 2s ease-in-out infinite" : "none",
                      transition:"all .4s",
                    }}>
                      {isCompleted ? step.icon : <span style={{ opacity:.35,fontSize:".9rem" }}>{step.icon}</span>}
                    </div>
                    <div style={{ marginTop:".6rem",textAlign:"center" }}>
                      <div style={{ fontSize:".68rem",fontWeight:isCurrent?800:600,color:isCompleted?"#1a1a1a":"#aaa",lineHeight:1.2 }}>{step.label}</div>
                      {isCurrent && <div style={{ fontSize:".62rem",color:BRAND,fontWeight:700,marginTop:".12rem" }}>{step.desc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Product + amount */}
      <div style={{
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",
        background:"rgba(229,93,106,.04)",border:"1px solid rgba(229,93,106,.1)",
        borderRadius:16,padding:"1.25rem",marginBottom:"1rem",
      }}>
        <div>
          <div style={{ fontSize:".68rem",color:"#aaa",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".4rem" }}>Product</div>
          {result.product?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.product.image} alt={result.product.name}
              style={{ width:60,height:60,borderRadius:10,objectFit:"cover",border:"2px solid rgba(229,93,106,.15)",marginBottom:".4rem",display:"block" }}/>
          )}
          <div style={{ fontWeight:700,color:"#1a1a1a",fontSize:".9rem" }}>{result.product?.name}</div>
          <div style={{ color:"#aaa",fontSize:".76rem",marginTop:".2rem" }}>
            {result.product?.article && <span>Article: {result.product.article} · </span>}
            {result.product?.size && <span>Size: {result.product.size} · </span>}
            {result.product?.color && <span>{result.product.color} · </span>}
            {result.product?.qty > 1 && <span>Qty: {result.product.qty}</span>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:".68rem",color:"#aaa",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".4rem" }}>Total</div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:900,color:BRAND }}>
            ₹{result.totalAmount?.toLocaleString()}
          </div>
          <div style={{ fontSize:".72rem",color:"#16a34a",fontWeight:700,marginTop:".25rem" }}>🚚 Free Delivery</div>
        </div>
      </div>

      <p style={{ color:"#aaa",fontSize:".76rem",textAlign:"center",marginTop:".5rem" }}>
        Need help?{" "}
        <a href="mailto:Poppypink001@gmail.com" style={{ color:BRAND,fontWeight:700 }}>Poppypink001@gmail.com</a>
        {" "}or <strong style={{ color:"#1a1a1a" }}>+91-9773948133</strong>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
export default function TrackPage() {
  const footerRef = useRef(null);
  const router    = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();

  const [orderId,     setOrderId]     = useState("");
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  // My orders (logged-in)
  const [myOrders,    setMyOrders]    = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedId,  setExpandedId]  = useState(null);
  const [activeTab,   setActiveTab]   = useState("my"); // "my" | "search"

  // Pre-fill orderId from query param
  useEffect(() => {
    if (router.query.orderId) {
      setOrderId(router.query.orderId);
      setActiveTab("search");
    }
  }, [router.query.orderId]);

  // Auto-fetch my orders when logged in
  useEffect(() => {
    if (isSignedIn && user?.id) fetchMyOrders();
  }, [isSignedIn, user?.id]);

  const fetchMyOrders = async () => {
    setOrdersLoading(true);
    try {
      const res  = await fetch(`/api/orders?userId=${user.id}`);
      const data = await res.json();
      setMyOrders(data.orders || []);
    } catch (_) {}
    setOrdersLoading(false);
  };

  const handleTrack = async (e) => {
    e?.preventDefault();
    const id = orderId.trim().toUpperCase();
    if (!id) { setError("Please enter your Order ID"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`/api/track/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setResult(data.order);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN",{ day:"numeric",month:"short",year:"numeric" });

  return (
    <>
      <Head>
        <title>Track Order — POPPYPINK</title>
        <meta name="description" content="Track your POPPYPINK sandal order status in real time." />
      </Head>

      <style suppressHydrationWarning>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        .track-inp {
          width:100%;padding:.9rem 1.2rem;border-radius:14px;
          border:2px solid rgba(229,93,106,.25);background:#fff;
          color:#1a1a1a;font-family:'DM Sans',sans-serif;font-size:1rem;
          font-weight:600;letter-spacing:.08em;text-transform:uppercase;
          outline:none;transition:all .25s;
        }
        .track-inp:focus { border-color:${BRAND};box-shadow:0 0 0 4px rgba(229,93,106,.12); }
        .track-inp::placeholder { color:#bbb;font-weight:400;text-transform:none;letter-spacing:0; }

        .tab-btn { padding:.6rem 1.4rem;border-radius:50px;border:none;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.86rem;cursor:pointer;transition:all .25s; }
        .tab-btn.active { background:${BRAND};color:#fff;box-shadow:0 6px 18px rgba(229,93,106,.35); }
        .tab-btn:not(.active) { background:rgba(229,93,106,.08);color:#888; }
        .tab-btn:not(.active):hover { background:rgba(229,93,106,.15);color:${BRAND}; }

        .order-card { background:#fff;border:1.5px solid rgba(229,93,106,.12);border-radius:18px;overflow:hidden;transition:all .25s;box-shadow:0 4px 16px rgba(229,93,106,.05); }
        .order-card:hover { border-color:rgba(229,93,106,.3);box-shadow:0 8px 28px rgba(229,93,106,.1); }
        .order-card-header { padding:1.1rem 1.4rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;cursor:pointer;user-select:none; }
        .order-card-body { padding:0 1.4rem 1.2rem;animation:slideDown .25s ease; }
        .order-img { width:54px;height:54px;border-radius:10px;object-fit:cover;border:1.5px solid rgba(229,93,106,.15);flex-shrink:0; }
        .order-grid { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
        @media(max-width:600px){ .order-grid{grid-template-columns:1fr!important} }
      `}</style>

      <Navbar footerRef={footerRef} />

      <main style={{ minHeight:"100vh",background:"#f9f9f9",paddingTop:"90px" }}>

        {/* ── Hero ── */}
        <section style={{ padding:"3rem 2rem 2rem",textAlign:"center",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:"-10%",right:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(229,93,106,.08),transparent 70%)",filter:"blur(50px)",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,rgba(229,93,106,.1) 1.5px,transparent 1.5px)`,backgroundSize:"36px 36px",opacity:.5,pointerEvents:"none" }}/>
          <div style={{ maxWidth:600,margin:"0 auto",position:"relative" }}>
            <p style={{ color:BRAND,fontSize:".75rem",fontWeight:800,letterSpacing:".22em",textTransform:"uppercase",marginBottom:".7rem" }}>✦ ORDER TRACKING ✦</p>
            <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:900,color:"#1a1a1a",lineHeight:1.1,marginBottom:".75rem" }}>
              Track Your <em style={{ fontStyle:"italic",color:BRAND }}>Order</em>
            </h1>
            <p style={{ color:"#888",fontSize:".95rem",marginBottom:"2rem",lineHeight:1.7 }}>
              {isSignedIn ? "Your orders are shown below, or search by Order ID." : "Sign in to see all your orders, or search by Order ID."}
            </p>
          </div>
        </section>

        <div style={{ maxWidth:860,margin:"0 auto",padding:"0 2rem 5rem" }}>

          {/* ── Tabs ── */}
          {isLoaded && (
            <div style={{ display:"flex",gap:".5rem",marginBottom:"2rem",flexWrap:"wrap" }}>
              {isSignedIn && (
                <button className={`tab-btn ${activeTab==="my"?"active":""}`} onClick={() => setActiveTab("my")}>
                  📦 My Orders
                  {myOrders.length > 0 && (
                    <span style={{ marginLeft:".4rem",background:activeTab==="my"?"rgba(255,255,255,.3)":"rgba(229,93,106,.15)",color:activeTab==="my"?"#fff":BRAND,borderRadius:20,padding:".05rem .45rem",fontSize:".7rem" }}>{myOrders.length}</span>
                  )}
                </button>
              )}
              <button className={`tab-btn ${activeTab==="search"?"active":""}`} onClick={() => setActiveTab("search")}>
                🔍 Search by Order ID
              </button>
            </div>
          )}

          {/* ══ TAB: MY ORDERS ══ */}
          {activeTab === "my" && isLoaded && (
            <>
              {!isSignedIn ? (
                <div style={{ background:"#fff",borderRadius:20,padding:"3rem 2rem",textAlign:"center",border:"1.5px solid rgba(229,93,106,.1)" }}>
                  <div style={{ fontSize:"3rem",marginBottom:"1rem" }}>🔒</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",color:"#1a1a1a",marginBottom:".5rem" }}>Sign in to see your orders</h3>
                  <p style={{ color:"#888",marginBottom:"1.5rem" }}>All your POPPYPINK orders will appear here after signing in.</p>
                  <Link href="/sign-in" style={{ background:BRAND,color:"#fff",padding:".7rem 2rem",borderRadius:50,fontWeight:700,textDecoration:"none",boxShadow:`0 6px 20px rgba(229,93,106,.3)` }}>
                    Sign In →
                  </Link>
                </div>
              ) : ordersLoading ? (
                <div style={{ display:"flex",justifyContent:"center",padding:"5rem" }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",border:`3px solid rgba(229,93,106,.15)`,borderTop:`3px solid ${BRAND}`,animation:"spin 1s linear infinite" }}/>
                </div>
              ) : myOrders.length === 0 ? (
                <div style={{ background:"#fff",borderRadius:20,padding:"4rem 2rem",textAlign:"center",border:"1.5px solid rgba(229,93,106,.1)" }}>
                  <div style={{ fontSize:"4rem",marginBottom:"1rem" }}>📭</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",color:"#1a1a1a",marginBottom:".5rem" }}>No orders yet</h3>
                  <p style={{ color:"#888",marginBottom:"1.5rem" }}>Your placed orders will appear here</p>
                  <Link href="/products" style={{ background:BRAND,color:"#fff",padding:".7rem 2rem",borderRadius:50,fontWeight:700,textDecoration:"none",boxShadow:`0 6px 20px rgba(229,93,106,.3)` }}>
                    Shop Now →
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
                    <p style={{ color:"#888",fontSize:".88rem" }}>{myOrders.length} order{myOrders.length!==1?"s":""} found</p>
                    <button onClick={fetchMyOrders}
                      style={{ background:"none",border:`1.5px solid rgba(229,93,106,.25)`,borderRadius:20,padding:".35rem .9rem",color:BRAND,fontWeight:700,fontSize:".78rem",cursor:"pointer" }}>
                      ↻ Refresh
                    </button>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
                    {myOrders.map(order => {
                      const st     = STATUS_STYLES[order.status?.toLowerCase()] || STATUS_STYLES.pending;
                      const isOpen = expandedId === order._id;
                      const stepIdx = getStepIndex(order.status);
                      const isCancelled = order.status?.toLowerCase() === "cancelled";
                      return (
                        <div key={order._id} className="order-card">
                          {/* Header */}
                          <div className="order-card-header" onClick={() => setExpandedId(isOpen ? null : order._id)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={order.product?.image || "/placeholder.png"} alt={order.product?.name} className="order-img"/>
                            <div style={{ flex:1,minWidth:0 }}>
                              <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#1a1a1a",fontSize:".95rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>
                                {order.product?.name}
                              </div>
                              <div style={{ display:"flex",gap:".5rem",alignItems:"center",marginTop:".25rem",flexWrap:"wrap" }}>
                                <code style={{ fontFamily:"monospace",fontSize:".72rem",fontWeight:800,color:BRAND,background:"rgba(229,93,106,.08)",padding:".1rem .45rem",borderRadius:6 }}>{order.orderId}</code>
                                <span style={{ fontSize:".72rem",color:"#aaa" }}>{fmtDate(order.createdAt)}</span>
                              </div>
                              {order.product?.article && (
                                <div style={{ fontSize:".7rem",color:"#aaa",marginTop:".15rem" }}>Article: {order.product.article}</div>
                              )}
                            </div>
                            <div style={{ textAlign:"right",flexShrink:0 }}>
                              <div style={{ fontWeight:800,color:"#1a1a1a",fontSize:"1rem" }}>₹{order.totalAmount?.toLocaleString()}</div>
                            </div>
                            <div style={{ background:st.bg,color:st.color,fontWeight:700,fontSize:".72rem",padding:".3rem .75rem",borderRadius:20,whiteSpace:"nowrap",flexShrink:0 }}>{st.label}</div>
                            <div style={{ color:"#ccc",fontSize:".9rem",transition:"transform .25s",transform:isOpen?"rotate(180deg)":"rotate(0deg)",flexShrink:0 }}>▼</div>
                          </div>

                          {/* Expanded body */}
                          {isOpen && (
                            <div className="order-card-body">
                              <div style={{ borderTop:"1px solid rgba(229,93,106,.1)",paddingTop:"1rem" }}>

                                {/* Progress bar */}
                                {!isCancelled && (
                                  <div style={{ marginBottom:"1.5rem" }}>
                                    <div style={{ display:"flex",alignItems:"flex-start",gap:0,position:"relative" }}>
                                      {STATUS_STEPS.map((step, i) => {
                                        const isCompleted = i <= stepIdx;
                                        const isCurrent   = i === stepIdx;
                                        return (
                                          <div key={step.key} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative" }}>
                                            {i > 0 && (
                                              <div style={{ position:"absolute",top:18,right:"50%",left:"-50%",height:3,background:isCompleted?BRAND:"rgba(229,93,106,.12)",zIndex:0,borderRadius:2 }}/>
                                            )}
                                            <div style={{ width:36,height:36,borderRadius:"50%",zIndex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",background:isCompleted?BRAND:"rgba(229,93,106,.07)",border:isCompleted?`2px solid ${BRAND}`:"2px solid rgba(229,93,106,.15)",boxShadow:isCurrent?`0 0 0 4px rgba(229,93,106,.18)`:  "none",animation:isCurrent?"pulse 2s ease-in-out infinite":"none",transition:"all .4s" }}>
                                              {isCompleted ? step.icon : <span style={{ opacity:.3,fontSize:".85rem" }}>{step.icon}</span>}
                                            </div>
                                            <div style={{ marginTop:".5rem",textAlign:"center" }}>
                                              <div style={{ fontSize:".62rem",fontWeight:isCurrent?800:600,color:isCompleted?"#1a1a1a":"#aaa",lineHeight:1.2 }}>{step.label}</div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                <div className="order-grid" style={{ marginBottom:"1rem" }}>
                                  {/* Product */}
                                  <div style={{ background:"rgba(229,93,106,.03)",borderRadius:12,padding:"1rem",border:"1px solid rgba(229,93,106,.09)" }}>
                                    <div style={{ fontSize:".7rem",fontWeight:800,color:"#aaa",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".7rem" }}>🛍️ Product</div>
                                    {[
                                      ["Name",    order.product?.name],
                                      ["Article", order.product?.article || "—"],
                                      ["Size",    order.product?.size    || "—"],
                                      ["Color",   order.product?.color   || "—"],
                                      ["Qty",     order.product?.qty],
                                      ["Total",   `₹${order.totalAmount?.toLocaleString()}`],
                                    ].map(([k,v]) => (
                                      <div key={k} style={{ display:"flex",justifyContent:"space-between",fontSize:".82rem",marginBottom:".35rem" }}>
                                        <span style={{ color:"#aaa" }}>{k}</span>
                                        <strong style={{ color:"#1a1a1a",textAlign:"right",maxWidth:"60%" }}>{v}</strong>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Delivery */}
                                  <div style={{ background:"rgba(229,93,106,.03)",borderRadius:12,padding:"1rem",border:"1px solid rgba(229,93,106,.09)" }}>
                                    <div style={{ fontSize:".7rem",fontWeight:800,color:"#aaa",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".7rem" }}>📦 Delivery</div>
                                    {[
                                      ["Name",    order.customerName],
                                      ["Phone",   order.customerPhone],
                                      ["Address", order.address?.line1],
                                      ["City",    order.address?.city],
                                      ["State",   order.address?.state],
                                      ["Pincode", order.address?.pincode],
                                      ["Payment", order.paymentMethod === "COD" ? "💵 Cash on Delivery" : "💳 Online"],
                                    ].map(([k,v]) => (
                                      <div key={k} style={{ display:"flex",justifyContent:"space-between",fontSize:".82rem",marginBottom:".35rem" }}>
                                        <span style={{ color:"#aaa" }}>{k}</span>
                                        <strong style={{ color:"#1a1a1a",textAlign:"right",maxWidth:"60%" }}>{v||"—"}</strong>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ padding:".85rem 1rem",background:"rgba(229,93,106,.04)",borderRadius:12,border:"1px solid rgba(229,93,106,.1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".75rem" }}>
                                  <code style={{ fontFamily:"monospace",fontWeight:900,fontSize:"1rem",color:BRAND }}>{order.orderId}</code>
                                  {order.adminNote && (
                                    <div style={{ fontSize:".8rem",color:"#92400e",background:"#fffbeb",padding:".4rem .8rem",borderRadius:8,border:"1px solid #fde68a" }}>
                                      📝 {order.adminNote}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* ══ TAB: SEARCH ══ */}
          {activeTab === "search" && (
            <div>
              <form onSubmit={handleTrack} style={{ display:"flex",gap:".75rem",maxWidth:520,margin:"0 auto 2rem",animation:"fadeUp .4s ease" }}>
                <div style={{ flex:1,position:"relative" }}>
                  <input
                    className="track-inp"
                    placeholder="Enter Order ID (PP-XXXXXX)"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value.toUpperCase())}
                    maxLength={12}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ padding:".9rem 1.75rem",borderRadius:14,background:loading?"rgba(229,93,106,.5)":BRAND,border:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:".9rem",cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":`0 8px 24px rgba(229,93,106,.32)`,transition:"all .3s",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:".5rem" }}>
                  {loading ? <div style={{ width:18,height:18,borderRadius:"50%",border:"2.5px solid rgba(255,255,255,.3)",borderTop:"2.5px solid #fff",animation:"spin 1s linear infinite" }}/> : "Track →"}
                </button>
              </form>

              {error && (
                <div style={{ maxWidth:520,margin:"0 auto 1.5rem",padding:"1rem 1.5rem",borderRadius:14,background:"rgba(239,68,68,.07)",border:"1.5px solid rgba(239,68,68,.2)",color:"#dc2626",fontSize:".9rem",fontWeight:600 }}>
                  📭 {error}
                </div>
              )}

              {result && <OrderResultCard result={result} />}
            </div>
          )}
        </div>
      </main>

      <Footer ref={footerRef} />
    </>
  );
}