// src/pages/track.js
import { useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BRAND = "#e55d6a";

const STATUS_STEPS = [
  { key:"Processing",       icon:"🛒", label:"Order Placed",      desc:"Your order has been received"  },
  { key:"Confirmed",        icon:"✅", label:"Order Confirmed",   desc:"We've confirmed your order"    },
  { key:"Shipped",          icon:"📦", label:"Shipped",           desc:"Your order is on its way"      },
  { key:"Out for Delivery", icon:"🚚", label:"Out for Delivery",  desc:"Arriving at your door today"   },
  { key:"Delivered",        icon:"🎉", label:"Delivered",         desc:"Enjoy your POPPYPINK sandals!" },
];

const STATUS_ORDER = STATUS_STEPS.map(s => s.key);

function getStepIndex(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 ? idx : 0;
}

export default function TrackPage() {
  const footerRef = useRef(null);
  const router    = useRouter();
  const [orderId, setOrderId] = useState(router.query.id || "");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleTrack = async (e) => {
    e?.preventDefault();
    const id = orderId.trim().toUpperCase();
    if (!id) { setError("Please enter your Order ID"); return; }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res  = await fetch(`/api/track/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setResult(data.order);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const stepIndex   = result ? getStepIndex(result.status) : -1;
  const isCancelled = result?.status === "Cancelled";

  return (
    <>
      <Head>
        <title>Track Order — POPPYPINK</title>
        <meta name="description" content="Track your POPPYPINK sandal order status in real time." />
      </Head>

      {/* ✅ FIX: suppressHydrationWarning prevents Next.js hydration mismatch */}
      <style suppressHydrationWarning>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes spinLoad { to{transform:rotate(360deg)} }
        @keyframes lineFill { from{width:0} to{width:100%} }

        .track-inp {
          width:100%; padding:.9rem 1.2rem; border-radius:14px;
          border:2px solid rgba(229,93,106,.25); background:#fff;
          color:#1a1a1a; font-family:'DM Sans',sans-serif; font-size:1rem;
          font-weight:600; letter-spacing:.08em; text-transform:uppercase;
          outline:none; transition:all .25s;
        }
        .track-inp:focus { border-color:${BRAND}; box-shadow:0 0 0 4px rgba(229,93,106,.12); }
        .track-inp::placeholder { color:#bbb; font-weight:400; text-transform:none; letter-spacing:0; }

        .step-line-fill { animation: lineFill .8s ease forwards; }

        .order-card {
          background:#fff; border:1.5px solid rgba(229,93,106,.15);
          border-radius:22px; padding:2rem;
          box-shadow:0 20px 60px rgba(229,93,106,.1);
          animation:fadeUp .5s ease;
        }
      `}</style>

      <Navbar footerRef={footerRef} />

      <main style={{ minHeight:"100vh", background:"#f9f9f9", paddingTop:"90px" }}>

        {/* ── Hero Section ── */}
        <section style={{ padding:"4rem 2rem 2rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
          {/* Bg blobs */}
          <div style={{ position:"absolute",top:"-10%",right:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(229,93,106,.08),transparent 70%)",filter:"blur(50px)",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",bottom:"0",left:"-5%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(229,93,106,.05),transparent 70%)",filter:"blur(40px)",pointerEvents:"none" }}/>

          {/* Dot grid */}
          <div style={{ position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,rgba(229,93,106,.1) 1.5px,transparent 1.5px)`,backgroundSize:"36px 36px",opacity:.6,pointerEvents:"none" }}/>

          <div style={{ maxWidth:600, margin:"0 auto", position:"relative" }}>
            <p style={{ color:BRAND,fontSize:".75rem",fontWeight:800,letterSpacing:".22em",textTransform:"uppercase",marginBottom:".7rem",animation:"fadeUp .5s ease" }}>
              ✦ ORDER TRACKING ✦
            </p>
            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(2.2rem,5vw,3.8rem)", fontWeight:900,
              color:"#1a1a1a", letterSpacing:"-.01em", lineHeight:1.1,
              marginBottom:"1rem", animation:"fadeUp .55s .1s ease both",
            }}>
              Track Your{" "}
              <em style={{ fontStyle:"italic", color:BRAND }}>Order</em>
            </h1>
            <p style={{ color:"#888",fontSize:"1rem",marginBottom:"2.5rem",lineHeight:1.7,animation:"fadeUp .6s .2s ease both" }}>
              Enter your Order ID (e.g. <strong style={{ color:"#1a1a1a" }}>PP-A3K9X</strong>) to see live status updates.
            </p>

            {/* Search form */}
            <form onSubmit={handleTrack} style={{ display:"flex",gap:".75rem",maxWidth:480,margin:"0 auto",animation:"fadeUp .65s .3s ease both" }}>
              <div style={{ flex:1,position:"relative" }}>
                <input
                  className="track-inp"
                  placeholder="Enter Order ID (PP-XXXXXX)"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value.toUpperCase())}
                  maxLength={12}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding:".9rem 1.75rem", borderRadius:14,
                  background: loading ? "rgba(229,93,106,.5)" : BRAND,
                  border:"none", color:"#fff", fontFamily:"'DM Sans',sans-serif",
                  fontWeight:700, fontSize:".9rem", cursor:loading?"not-allowed":"pointer",
                  boxShadow:loading?"none":`0 8px 24px rgba(229,93,106,.32)`,
                  transition:"all .3s", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:".5rem",
                }}
              >
                {loading ? (
                  <div style={{ width:18,height:18,borderRadius:"50%",border:"2.5px solid rgba(255,255,255,.3)",borderTop:"2.5px solid #fff",animation:"spinLoad 1s linear infinite" }}/>
                ) : "Track →"}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div style={{
                marginTop:"1.5rem",padding:"1rem 1.5rem",borderRadius:14,
                background:"rgba(239,68,68,.07)",border:"1.5px solid rgba(239,68,68,.2)",
                color:"#dc2626",fontSize:".9rem",fontWeight:600,
                animation:"fadeUp .4s ease",
              }}>
                📭 {error}
              </div>
            )}
          </div>
        </section>

        {/* ── Result ── */}
        {result && (
          <section style={{ padding:"2rem 2rem 5rem",maxWidth:840,margin:"0 auto" }}>
            <div className="order-card">

              {/* Order header */}
              <div style={{
                display:"flex",justifyContent:"space-between",alignItems:"flex-start",
                flexWrap:"wrap",gap:"1rem",
                paddingBottom:"1.5rem",marginBottom:"2rem",
                borderBottom:`1.5px solid rgba(229,93,106,.12)`,
              }}>
                <div>
                  <div style={{ fontSize:".7rem",color:"#aaa",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".35rem" }}>Order ID</div>
                  <div style={{ fontFamily:"monospace",fontWeight:900,fontSize:"1.4rem",color:BRAND,letterSpacing:".06em" }}>{result.orderId}</div>
                  <div style={{ fontSize:".78rem",color:"#aaa",marginTop:".3rem" }}>
                    Placed {new Date(result.createdAt).toLocaleDateString("en-IN",{ day:"numeric",month:"long",year:"numeric" })} at {new Date(result.createdAt).toLocaleTimeString("en-IN",{ hour:"2-digit",minute:"2-digit" })}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:".7rem",color:"#aaa",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".35rem" }}>Customer</div>
                  <div style={{ fontWeight:700,color:"#1a1a1a",fontSize:".95rem" }}>{result.customerName}</div>
                  {result.address?.city && (
                    <div style={{ fontSize:".78rem",color:"#aaa" }}>{result.address.city}{result.address.state ? `, ${result.address.state}` : ""}</div>
                  )}
                </div>
              </div>

              {/* Cancelled state */}
              {isCancelled ? (
                <div style={{ textAlign:"center",padding:"2rem",background:"rgba(239,68,68,.06)",border:"1.5px solid rgba(239,68,68,.18)",borderRadius:16,marginBottom:"2rem" }}>
                  <div style={{ fontSize:"3rem",marginBottom:".75rem" }}>❌</div>
                  <div style={{ fontWeight:800,color:"#dc2626",fontSize:"1.2rem",marginBottom:".5rem" }}>Order Cancelled</div>
                  <p style={{ color:"#888",fontSize:".88rem" }}>This order has been cancelled. Contact us if you need help.</p>
                </div>
              ) : (
                <>
                  {/* ── Progress tracker ── */}
                  <div style={{ marginBottom:"2.5rem" }}>
                    <div style={{ fontSize:".75rem",color:"#aaa",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1.5rem" }}>
                      Delivery Status
                    </div>

                    <div style={{ display:"flex",alignItems:"flex-start",gap:0,position:"relative" }}>
                      {STATUS_STEPS.map((step, i) => {
                        const isCompleted = i <= stepIndex;
                        const isCurrent   = i === stepIndex;
                        return (
                          <div key={step.key} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative" }}>
                            {/* Connector line */}
                            {i > 0 && (
                              <div style={{
                                position:"absolute",top:20,right:"50%",left:"-50%",
                                height:3,
                                background: isCompleted ? BRAND : "rgba(229,93,106,.12)",
                                zIndex:0,transition:"background .5s",
                                borderRadius:2,
                              }}/>
                            )}
                            {/* Icon circle */}
                            <div style={{
                              width:40,height:40,borderRadius:"50%",zIndex:1,position:"relative",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:"1.1rem",
                              background: isCompleted ? BRAND : "rgba(229,93,106,.07)",
                              border: isCompleted ? `2px solid ${BRAND}` : "2px solid rgba(229,93,106,.15)",
                              boxShadow: isCurrent ? `0 0 0 5px rgba(229,93,106,.18), 0 0 18px rgba(229,93,106,.25)` : "none",
                              animation: isCurrent ? "pulse 2s ease-in-out infinite" : "none",
                              transition:"all .4s",
                            }}>
                              {isCompleted ? step.icon : <span style={{ opacity:.35,fontSize:".9rem" }}>{step.icon}</span>}
                            </div>
                            {/* Label */}
                            <div style={{ marginTop:".6rem",textAlign:"center" }}>
                              <div style={{ fontSize:".72rem",fontWeight:isCurrent?800:600,color:isCompleted?"#1a1a1a":"#aaa",lineHeight:1.2 }}>
                                {step.label}
                              </div>
                              {isCurrent && (
                                <div style={{ fontSize:".65rem",color:BRAND,fontWeight:700,marginTop:".15rem" }}>{step.desc}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current status pill */}
                  <div style={{
                    display:"inline-flex",alignItems:"center",gap:".6rem",
                    padding:".6rem 1.2rem",borderRadius:50,
                    background:`rgba(229,93,106,.08)`,border:`1.5px solid rgba(229,93,106,.22)`,
                    marginBottom:"2rem",
                  }}>
                    <span style={{ fontSize:"1.1rem" }}>{STATUS_STEPS[stepIndex]?.icon}</span>
                    <span style={{ fontWeight:800,color:BRAND,fontSize:".9rem" }}>{result.status}</span>
                    <span style={{ color:"#888",fontSize:".8rem" }}>— {STATUS_STEPS[stepIndex]?.desc}</span>
                  </div>
                </>
              )}

              {/* Product & amount */}
              <div style={{
                display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",
                background:"rgba(229,93,106,.04)",border:`1px solid rgba(229,93,106,.1)`,
                borderRadius:16,padding:"1.25rem",
              }}>
                <div>
                  <div style={{ fontSize:".68rem",color:"#aaa",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".4rem" }}>Product Ordered</div>
                  {result.product?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={result.product.image} alt={result.product.name} style={{ width:60,height:60,borderRadius:10,objectFit:"cover",border:`2px solid rgba(229,93,106,.15)`,marginBottom:".4rem",display:"block" }}/>
                  )}
                  <div style={{ fontWeight:700,color:"#1a1a1a",fontSize:".9rem" }}>{result.product?.name}</div>
                  <div style={{ color:"#aaa",fontSize:".78rem",marginTop:".2rem" }}>
                    {result.product?.size && `Size: ${result.product.size}`}
                    {result.product?.color && ` · ${result.product.color}`}
                    {result.product?.qty > 1 && ` · Qty: ${result.product.qty}`}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:".68rem",color:"#aaa",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".4rem" }}>Order Total</div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:900,color:BRAND }}>
                    ₹{result.totalAmount?.toLocaleString()}
                  </div>
                  <div style={{ fontSize:".72rem",color:"#16a34a",fontWeight:700,marginTop:".25rem" }}>🚚 Free Delivery</div>
                </div>
              </div>

              {/* Help note */}
              <p style={{ marginTop:"1.5rem",color:"#aaa",fontSize:".78rem",textAlign:"center" }}>
                Need help? Contact us at{" "}
                <a href="mailto:Poppypink001@gmail.com" style={{ color:BRAND,fontWeight:700 }}>Poppypink001@gmail.com</a>
                {" "}or call <strong style={{ color:"#1a1a1a" }}>+91-9773948133</strong>
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer ref={footerRef} />
    </>
  );
}