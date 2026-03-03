// src/components/Hero.js
import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    img: "/assets/Gold-12151/1.JPG",
    angle: "Side Profile",
    title: "Step Into",
    highlight: "Elegance",
    sub: "Premium sandals crafted for confidence, comfort & timeless style.",
    tag: "New Arrival",
  },
  {
    img: "/assets/RoseGold-12133/0.JPG",
    angle: "Top View",
    title: "Walk With",
    highlight: "Grace",
    sub: "Every detail perfected — from sole to strap, season to season.",
    tag: "Best Seller",
  },
  {
    img: "/assets/Silver-12151/1.JPG",
    angle: "Front Angle",
    title: "Feel The",
    highlight: "Difference",
    sub: "Designed for the modern woman who commands every room she enters.",
    tag: "Trending",
  },
  {
    img: "/assets/RoseGold-12113/1.JPG",
    angle: "3/4 View",
    title: "Born For",
    highlight: "You",
    sub: "New arrivals every season. Timeless elegance, always in fashion.",
    tag: "Limited Edition",
  },
  {
    img: "/assets/Silver-12133/1.JPG",
    angle: "Close-up Detail",
    title: "Crafted With",
    highlight: "Love",
    sub: "Premium materials, exceptional craftsmanship — made just for you.",
    tag: "Premium",
  },
];

const BRAND      = "#e55d6a";
const BRAND_LIGHT = "#fde8ea";
const DURATION   = 4500;

export default function Hero({ shopRef }) {
  const [current,  setCurrent]  = useState(0);
  const [imgAnim,  setImgAnim]  = useState("enter");
  const [txtAnim,  setTxtAnim]  = useState("in");
  const [progress, setProgress] = useState(0);
  const [mounted,  setMounted]  = useState(false);
  const rafRef   = useRef(null);
  const startRef = useRef(Date.now());

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct     = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        transition((current + 1) % SLIDES.length);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current]); // eslint-disable-line

  const transition = (next) => {
    if (next === current) return;
    cancelAnimationFrame(rafRef.current);
    setTxtAnim("out");
    setImgAnim("exit");
    setTimeout(() => {
      setCurrent(next);
      setProgress(0);
      setImgAnim("enter");
      setTxtAnim("in");
    }, 480);
  };

  const slide = SLIDES[current];

  return (
    <section style={{
      minHeight: "100vh", height: "100vh",
      display: "flex", alignItems: "center", marginTop: "50px",
      background: "#f9f9f9",
      position: "relative", overflow: "hidden",
    }}>

      <style>{`
        /* ── Keyframes ── */
        @keyframes txtIn    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes txtOut   { from{opacity:1;transform:translateY(0)}    to{opacity:0;transform:translateY(-20px)} }
        @keyframes imgIn    { from{opacity:0;transform:scale(1.1) translateY(30px) rotate(3deg)} to{opacity:1;transform:scale(1) translateY(0) rotate(0deg)} }
        @keyframes imgOut   { from{opacity:1;transform:scale(1) translateY(0)}                   to{opacity:0;transform:scale(.92) translateY(-25px)} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-18px) rotate(1deg)} }
        @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(14px,-18px) scale(1.07)} }
        @keyframes badgeUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes sparkle  { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 40%,60%{opacity:1;transform:scale(1) rotate(180deg)} }
        @keyframes tagIn    { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin     { from{transform:translateY(-50%) rotate(0deg)} to{transform:translateY(-50%) rotate(360deg)} }
        @keyframes spinR    { from{transform:translateY(-50%) rotate(0deg)} to{transform:translateY(-50%) rotate(-360deg)} }
        @keyframes heroIn   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseRing { 0%{transform:translate(-50%,-50%) scale(.9);opacity:.7} 70%{transform:translate(-50%,-50%) scale(1.25);opacity:0} 100%{transform:translate(-50%,-50%) scale(1.25);opacity:0} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes dotBlink { 0%,100%{opacity:.4;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }

        .txt-in    { animation: txtIn .6s ease forwards; opacity:0; }
        .txt-out   { animation: txtOut .4s ease forwards; }
        .img-enter { animation: imgIn .65s cubic-bezier(.22,.68,0,1.15) forwards; opacity:0; }
        .img-exit  { animation: imgOut .42s ease forwards; }
        .float-img    { animation: floatUp 5.5s ease-in-out infinite; }
        .float-badge  { animation: badgeUp 3.8s ease-in-out infinite; }
        .tag-anim     { animation: tagIn .5s .1s ease forwards; opacity:0; }
        .hero-mounted { animation: heroIn .8s ease forwards; }

        .hero-btn-primary {
          background: ${BRAND};
          border: none; color: #fff; padding: .82rem 2.2rem; border-radius: 50px;
          font-family: 'DM Sans',sans-serif; font-weight:700; font-size:.92rem;
          cursor:pointer; letter-spacing:.05em;
          box-shadow: 0 10px 32px rgba(229,93,106,.35);
          transition: all .35s cubic-bezier(.22,.68,0,1.2);
          position:relative; overflow:hidden;
        }
        .hero-btn-primary::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 60%);
          opacity:0; transition:opacity .3s;
        }
        .hero-btn-primary:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 20px 48px rgba(229,93,106,.5); }
        .hero-btn-primary:hover::before { opacity:1; }

        .hero-btn-outline {
          background: transparent;
          border: 2px solid rgba(229,93,106,.35);
          color: ${BRAND};
          padding: .82rem 2.2rem; border-radius:50px;
          font-family:'DM Sans',sans-serif; font-weight:700; font-size:.92rem;
          cursor:pointer; letter-spacing:.05em;
          transition: all .35s cubic-bezier(.22,.68,0,1.2);
          position:relative; overflow:hidden;
        }
        .hero-btn-outline:hover {
          background: rgba(229,93,106,.07);
          border-color: ${BRAND};
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 10px 28px rgba(229,93,106,.15);
        }

        .stat-pill {
          background: #fff;
          border: 1px solid rgba(229,93,106,.12);
          border-radius: 14px;
          padding: .65rem 1rem;
          display: flex; align-items: center; gap: .55rem;
          box-shadow: 0 4px 16px rgba(229,93,106,.07);
          transition: all .3s ease;
        }
        .stat-pill:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(229,93,106,.15);
          border-color: rgba(229,93,106,.25);
        }

        .thumb-dot {
          width:46px; height:46px; border-radius:10px; overflow:hidden;
          cursor:pointer; border:2.5px solid transparent;
          transition:all .3s cubic-bezier(.22,.68,0,1.2); opacity:.4; flex-shrink:0;
        }
        .thumb-dot img { width:100%;height:100%;object-fit:cover;display:block; }
        .thumb-dot.on  {
          border-color: ${BRAND}; opacity:1;
          transform: scale(1.12);
          box-shadow: 0 6px 18px rgba(229,93,106,.3);
        }
        .thumb-dot:hover { opacity:.75; transform:scale(1.06); }

        .float-card {
          position:absolute; background:#fff; border-radius:16px;
          box-shadow: 0 12px 36px rgba(229,93,106,.15), 0 2px 8px rgba(0,0,0,.05);
          border: 1.5px solid rgba(229,93,106,.1);
          transition: all .3s ease;
        }
        .float-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 20px 48px rgba(229,93,106,.22), 0 4px 12px rgba(0,0,0,.07);
        }

        .pulse-ring {
          position:absolute; top:50%; left:50%;
          width:100%; height:100%; border-radius:50%;
          border: 2px solid rgba(229,93,106,.25);
          animation: pulseRing 2.8s ease-out infinite;
          pointer-events:none;
        }

        .spin-ring-1 {
          position:absolute; right:8%; top:50%;
          width:540px; height:540px; border-radius:50%;
          border: 1.5px dashed rgba(229,93,106,.14);
          pointer-events:none;
          animation: spin 22s linear infinite;
          transform-origin: center center;
        }
        .spin-ring-2 {
          position:absolute; right:11%; top:50%;
          width:430px; height:430px; border-radius:50%;
          border: 1px solid rgba(229,93,106,.07);
          pointer-events:none;
          animation: spinR 16s linear infinite;
          transform-origin: center center;
        }

        .live-dot {
          width:7px; height:7px; border-radius:50%;
          background: ${BRAND};
          animation: dotBlink 1.8s ease-in-out infinite;
          display:inline-block;
          box-shadow: 0 0 6px ${BRAND};
        }

        @media (max-width:800px) {
          .hero-wrap  { flex-direction:column!important; padding-top:90px!important; padding-bottom:100px!important; }
          .hero-right { display:none!important; }
          .hero-left  { padding-right:0!important; text-align:center; }
          .hero-left .tag-anim { justify-content:center; }
          .hero-cta-row, .hero-stat-row, .hero-thumb-row { justify-content:center!important; }
        }
      `}</style>

      {/* ── Background: subtle dot grid ── */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`radial-gradient(circle, rgba(229,93,106,.12) 1.5px, transparent 1.5px)`,
        backgroundSize:"38px 38px",
        opacity:.7, pointerEvents:"none",
      }}/>

      {/* ── Background: soft blobs ── */}
      <div style={{
        position:"absolute", top:"-15%", right:"-10%",
        width:600, height:600, borderRadius:"50%",
        background:`radial-gradient(circle, rgba(229,93,106,.09), transparent 70%)`,
        filter:"blur(60px)", pointerEvents:"none",
        animation:"orbDrift 10s ease-in-out infinite",
      }}/>
      <div style={{
        position:"absolute", bottom:"-12%", left:"-5%",
        width:500, height:500, borderRadius:"50%",
        background:`radial-gradient(circle, rgba(229,93,106,.06), transparent 70%)`,
        filter:"blur(50px)", pointerEvents:"none",
        animation:"orbDrift 12s 2s ease-in-out infinite",
      }}/>

      {/* Spinning rings */}
      <div className="spin-ring-1"/>
      <div className="spin-ring-2"/>

      {/* ══════════════════════════════════
          MAIN CONTENT GRID
      ══════════════════════════════════ */}
      <div
        className={mounted ? "hero-wrap hero-mounted" : "hero-wrap"}
        style={{
          width:"100%", maxWidth:1300, margin:"0 auto",
          display:"flex", alignItems:"center",
          padding:"0 4vw 80px", gap:"3rem",
          position:"relative", zIndex:5,
          opacity: mounted ? undefined : 0,
        }}
      >

        {/* ════════ LEFT: TEXT ════════ */}
        <div className="hero-left" style={{ flex:"0 0 50%", maxWidth:530, paddingRight:"2rem" }}>

          {/* Tag badge */}
          <div
            className="tag-anim"
            key={`tag-${current}`}
            style={{
              display:"inline-flex", alignItems:"center", gap:".5rem",
              padding:".3rem .9rem", borderRadius:50, marginBottom:"1.4rem",
              background: BRAND_LIGHT,
              border:`1.5px solid rgba(229,93,106,.25)`,
              color: BRAND, fontSize:".71rem", fontWeight:800,
              letterSpacing:".18em", textTransform:"uppercase",
            }}
          >
            <span className="live-dot"/>
            {slide.tag} · {slide.angle}
          </div>

          {/* Headline */}
          <div key={`h-${current}`} className={txtAnim==="in"?"txt-in":"txt-out"} style={{ animationDelay:".04s" }}>
            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(2.6rem,5.2vw,5rem)",
              fontWeight:900, lineHeight:1.09, color:"#1a1a1a",
              letterSpacing:"-.02em", marginBottom:"1.2rem",
            }}>
              {slide.title}<br/>
              <em style={{
                fontStyle:"italic",
                color: BRAND,
                position:"relative",
                display:"inline-block",
              }}>
                {slide.highlight}
                {/* Underline accent */}
                <span style={{
                  position:"absolute", bottom:2, left:0, right:0,
                  height:4, borderRadius:4,
                  background:`rgba(229,93,106,.2)`,
                  display:"block",
                }}/>
              </em>
            </h1>
          </div>

          {/* Sub */}
          <div key={`s-${current}`} className={txtAnim==="in"?"txt-in":"txt-out"} style={{ animationDelay:".14s" }}>
            <p style={{
              color:"#666", fontSize:"clamp(.9rem,1.5vw,1.06rem)",
              lineHeight:1.82, maxWidth:440, marginBottom:"2rem", fontWeight:400,
            }}>
              {slide.sub}
            </p>
          </div>

          {/* CTA Buttons */}
          <div key={`b-${current}`} className={txtAnim==="in"?"txt-in":"txt-out"} style={{ animationDelay:".24s" }}>
            <div className="hero-cta-row" style={{ display:"flex", gap:".9rem", flexWrap:"wrap", marginBottom:"2.2rem" }}>
              <button className="hero-btn-primary" onClick={()=>shopRef?.current?.scrollIntoView({behavior:"smooth"})}>
                Shop Now ✦
              </button>
              <button className="hero-btn-outline" onClick={()=>shopRef?.current?.scrollIntoView({behavior:"smooth"})}>
                Explore Collection
              </button>
            </div>
          </div>

          {/* Stats */}
          <div key={`st-${current}`} className={txtAnim==="in"?"txt-in":"txt-out"} style={{ animationDelay:".32s" }}>
            <div className="hero-stat-row" style={{ display:"flex", gap:".8rem", flexWrap:"wrap", marginBottom:"2rem" }}>
              {[
                { icon:"👟", num:"500+", lbl:"Styles" },
                { icon:"⭐", num:"4.9",  lbl:"Rating" },
                { icon:"🚚", num:"Free", lbl:"Shipping" },
              ].map(s => (
                <div key={s.lbl} className="stat-pill">
                  <span style={{ fontSize:"1.25rem" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight:800, color:"#1a1a1a", fontSize:".9rem", lineHeight:1.1 }}>{s.num}</div>
                    <div style={{ color:"#aaa", fontSize:".64rem", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase" }}>{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="hero-thumb-row" style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <div style={{ display:"flex", gap:".45rem" }}>
              {SLIDES.map((s,i) => (
                <div key={i} className={`thumb-dot ${i===current?"on":""}`} onClick={()=>transition(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.angle}/>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:".25rem" }}>
              <span style={{ fontSize:".68rem", color:"#aaa", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" }}>
                {String(current+1).padStart(2,"0")} / {String(SLIDES.length).padStart(2,"0")}
              </span>
              <div style={{ width:72, height:3, background:"rgba(229,93,106,.15)", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${progress}%`, background:BRAND, borderRadius:2, transition:"width .1s linear" }}/>
              </div>
            </div>
          </div>
        </div>

        {/* ════════ RIGHT: IMAGE ════════ */}
        <div className="hero-right" style={{
          flex:1, position:"relative", height:"78vh", minHeight:460,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>

          {/* Blob behind image */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:"72%", height:"82%",
            borderRadius:"60% 40% 55% 45% / 48% 52% 48% 52%",
            background:`rgba(229,93,106,.07)`,
            border:`1.5px solid rgba(229,93,106,.1)`,
          }}/>

          {/* Pulse ring behind image */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            width:"60%", height:"60%",
            borderRadius:"50%",
            transform:"translate(-50%,-50%)",
            pointerEvents:"none",
          }}>
            <div className="pulse-ring" style={{ animationDelay:"0s" }}/>
            <div className="pulse-ring" style={{ animationDelay:".9s" }}/>
          </div>

          {/* Main floating image */}
          <div className="float-img" style={{ position:"relative", zIndex:4, width:"70%", maxWidth:400 }}>
            {/* Glow shadow */}
            <div style={{
              position:"absolute", bottom:"-4%", left:"8%", right:"8%", height:35,
              background:`radial-gradient(ellipse, rgba(229,93,106,.3), transparent 70%)`,
              filter:"blur(16px)", transform:"scaleX(1.15)",
            }}/>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`img-${current}`}
              src={slide.img}
              alt={slide.highlight}
              className={imgAnim==="enter"?"img-enter":"img-exit"}
              style={{
                width:"100%",
                aspectRatio:"1 / 1",
                objectFit:"cover",
                borderRadius:"42% 58% 46% 54% / 44% 50% 50% 56%",
                boxShadow:`0 32px 72px rgba(229,93,106,.22), 0 8px 24px rgba(0,0,0,.07)`,
                display:"block",
              }}
            />
          </div>

          {/* ── Floating card: Price ── */}
          <div className="float-card float-badge" style={{ bottom:"20%", left:"2%", padding:".78rem 1.1rem", minWidth:130, zIndex:8 }}>
            <div style={{ fontSize:".62rem", color:"#aaa", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:".18rem" }}>Starting from</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:900, color:BRAND, lineHeight:1 }}>₹799</div>
            <div style={{ fontSize:".62rem", color:"#16a34a", fontWeight:700, marginTop:".18rem" }}>🟢 Free Delivery</div>
          </div>

          {/* ── Floating card: Rating ── */}
          <div className="float-card float-badge" style={{ top:"16%", right:"1%", padding:".65rem .9rem", zIndex:8, display:"flex", alignItems:"center", gap:".5rem", animationDelay:"1.1s" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:BRAND, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".9rem", flexShrink:0 }}>⭐</div>
            <div>
              <div style={{ fontWeight:800, color:"#1a1a1a", fontSize:".88rem", lineHeight:1 }}>4.9 / 5</div>
              <div style={{ color:"#aaa", fontSize:".6rem", fontWeight:600 }}>2,400+ Reviews</div>
            </div>
          </div>

          {/* ── Floating card: New styles ── */}
          <div className="float-badge" style={{
            position:"absolute", top:"40%", right:"-1%", zIndex:8,
            background: BRAND,
            borderRadius:14, padding:".6rem 1rem",
            boxShadow:`0 12px 30px rgba(229,93,106,.4)`,
            animationDelay:".65s",
          }}>
            <div style={{ color:"rgba(255,255,255,.75)", fontSize:".58rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>This Week</div>
            <div style={{ color:"#fff", fontSize:".86rem", fontWeight:800 }}>✨ 12 New Styles</div>
          </div>

          {/* Sparkle dots */}
          {[
            {top:"10%", left:"20%",  s:9, d:"0s"  },
            {top:"26%", left:"7%",   s:6, d:".9s" },
            {top:"68%", right:"20%", s:7, d:"1.5s"},
            {top:"80%", left:"28%",  s:5, d:".4s" },
            {top:"50%", left:"4%",   s:8, d:"2s"  },
          ].map((sp,i) => (
            <div key={i} style={{
              position:"absolute", top:sp.top, left:sp.left, right:sp.right,
              width:sp.s, height:sp.s, background:BRAND, borderRadius:"50%",
              animation:`sparkle 2.8s ${sp.d} ease-in-out infinite`,
              boxShadow:`0 0 ${sp.s*2}px rgba(229,93,106,.6)`,
            }}/>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"rgba(229,93,106,.1)", zIndex:20 }}>
        <div style={{ height:"100%", width:`${progress}%`, background:BRAND, transition:"width .1s linear", borderRadius:"0 2px 2px 0" }}/>
      </div>

      {/* ── Trust strip ── */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, zIndex:15,
        background:"rgba(255,255,255,.9)", backdropFilter:"blur(14px)",
        borderTop:`1px solid rgba(229,93,106,.1)`,
        padding:".65rem 4vw",
        display:"flex", alignItems:"center", justifyContent:"center", gap:"2.5rem", flexWrap:"wrap",
      }}>
        {["🚚 Free Delivery","💎 Premium Quality","↩️ 7-Day Returns","🔒 Secure Payment","⭐ 4.9 Rated"].map(t => (
          <span key={t} style={{ fontSize:".73rem", color:"#888", fontWeight:600 }}>{t}</span>
        ))}
      </div>
    </section>
  );
}