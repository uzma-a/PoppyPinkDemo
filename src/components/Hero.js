// src/components/Hero.js
import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    img: "/assets/Rose Gold-12113/1.JPG",
    angle: "Side Profile",
    title: "Step Into",
    highlight: "Elegance",
    sub: "Premium sandals crafted for confidence, comfort & timeless style.",
    tag: "New Arrival",
  },
  {
    img: "/assets/Silver-12113/1.JPG",
    angle: "Top View",
    title: "Walk With",
    highlight: "Grace",
    sub: "Every detail perfected — from sole to strap, season to season.",
    tag: "Best Seller",
  },
  {
    img: "/assets/Rose Gold-12113/6.JPG",
    angle: "Front Angle",
    title: "Feel The",
    highlight: "Difference",
    sub: "Designed for the modern woman who commands every room she enters.",
    tag: "Trending",
  },
  {
    img: "/assets/Silver-12113/6.JPG",
    angle: "3/4 View",
    title: "Born For",
    highlight: "You",
    sub: "New arrivals every season. Timeless elegance, always in fashion.",
    tag: "Limited Edition",
  },
  {
    img: "/assets/Silver-12113/7.JPG",
    angle: "Close-up Detail",
    title: "Crafted With",
    highlight: "Love",
    sub: "Premium materials, exceptional craftsmanship — made just for you.",
    tag: "Premium",
  },
];

const BRAND      = "#E8391D";
const BRAND_DARK = "#C42E15";
const DURATION   = 4500;

export default function Hero({ shopRef }) {
  const [current,  setCurrent]  = useState(0);
  const [imgAnim,  setImgAnim]  = useState("enter");
  const [txtAnim,  setTxtAnim]  = useState("in");
  const [progress, setProgress] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(Date.now());

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
      display: "flex", alignItems: "center",
      background: "linear-gradient(145deg, #FFF8F5 0%, #FFF0E8 45%, #FFF5F2 100%)",
      position: "relative", overflow: "hidden",
    }}>

      <style>{`
        /* ── Keyframes ── */
        @keyframes txtIn    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes txtOut   { from{opacity:1;transform:translateY(0)}    to{opacity:0;transform:translateY(-20px)} }
        @keyframes imgIn    { from{opacity:0;transform:scale(1.1) translateY(30px) rotate(3deg)} to{opacity:1;transform:scale(1) translateY(0) rotate(0deg)} }
        @keyframes imgOut   { from{opacity:1;transform:scale(1) translateY(0)}                   to{opacity:0;transform:scale(.92) translateY(-25px)} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-20px) rotate(1deg)} }
        @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(14px,-18px) scale(1.07)} }
        @keyframes badgeUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sparkle  { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 40%,60%{opacity:1;transform:scale(1) rotate(180deg)} }
        @keyframes tagIn    { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }

        .txt-in    { animation: txtIn .6s ease forwards; opacity:0; }
        .txt-out   { animation: txtOut .4s ease forwards; }
        .img-enter { animation: imgIn .65s cubic-bezier(.22,.68,0,1.15) forwards; opacity:0; }
        .img-exit  { animation: imgOut .42s ease forwards; }
        .float-img    { animation: floatUp 5.5s ease-in-out infinite; }
        .float-badge  { animation: badgeUp 3.8s ease-in-out infinite; }
        .float-orb    { animation: orbDrift 7s ease-in-out infinite; }
        .tag-anim     { animation: tagIn .5s .1s ease forwards; opacity:0; }
        .spin-ring    { animation: spin 22s linear infinite; }
        .spin-ring-r  { animation: spin 16s linear infinite reverse; }

        .hero-btn-primary {
          background: linear-gradient(135deg, ${BRAND}, ${BRAND_DARK});
          border: none; color: #fff; padding: .82rem 2.2rem; border-radius: 50px;
          font-family: 'DM Sans',sans-serif; font-weight:700; font-size:.92rem;
          cursor:pointer; letter-spacing:.05em;
          box-shadow: 0 10px 32px rgba(232,57,29,.42);
          transition: all .3s; position:relative; overflow:hidden;
        }
        .hero-btn-primary:hover  { transform:translateY(-4px); box-shadow:0 18px 44px rgba(232,57,29,.58); }

        .hero-btn-outline {
          background: rgba(232,57,29,.06); border: 2px solid rgba(232,57,29,.45); color:${BRAND};
          padding: .82rem 2.2rem; border-radius:50px;
          font-family:'DM Sans',sans-serif; font-weight:700; font-size:.92rem;
          cursor:pointer; letter-spacing:.05em; transition:all .3s;
        }
        .hero-btn-outline:hover { background:rgba(232,57,29,.12); border-color:${BRAND}; transform:translateY(-4px); }

        .stat-pill {
          background:rgba(255,255,255,.88); backdrop-filter:blur(10px);
          border:1px solid rgba(232,57,29,.14); border-radius:14px;
          padding:.65rem 1rem; display:flex; align-items:center; gap:.55rem;
          box-shadow:0 4px 16px rgba(232,57,29,.09);
        }

        .thumb-dot { width:46px; height:46px; border-radius:10px; overflow:hidden; cursor:pointer; border:2.5px solid transparent; transition:all .3s; opacity:.48; flex-shrink:0; }
        .thumb-dot img { width:100%;height:100%;object-fit:cover;display:block; }
        .thumb-dot.on  { border-color:${BRAND}; opacity:1; transform:scale(1.1); box-shadow:0 4px 14px rgba(232,57,29,.35); }
        .thumb-dot:hover { opacity:.82; }

        .float-card {
          position:absolute; background:#fff; border-radius:16px;
          box-shadow:0 12px 36px rgba(232,57,29,.2), 0 2px 8px rgba(0,0,0,.07);
          border:1.5px solid rgba(232,57,29,.13);
        }

        @media (max-width:800px) {
          .hero-wrap  { flex-direction:column!important; padding-top:90px!important; padding-bottom:100px!important; }
          .hero-right { display:none!important; }
          .hero-left  { padding-right:0!important; text-align:center; }
          .hero-left .tag-anim { justify-content:center; }
          .hero-cta-row, .hero-stat-row, .hero-thumb-row { justify-content:center!important; }
        }
      `}</style>

      {/* ── Background decorations ── */}
      <div style={{ position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,rgba(232,57,29,.13) 1.5px,transparent 1.5px)`,backgroundSize:"40px 40px",opacity:.65,pointerEvents:"none" }}/>
      <div className="float-orb" style={{ position:"absolute",top:"-12%",right:"-8%",width:640,height:640,borderRadius:"50%",background:"radial-gradient(circle,rgba(232,57,29,.14),transparent 70%)",filter:"blur(55px)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"-10%",left:"0",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,130,60,.1),transparent 70%)",filter:"blur(45px)",animation:"orbDrift 9s 1s ease-in-out infinite",pointerEvents:"none" }}/>

      {/* Spinning dashed rings */}
      <div className="spin-ring"  style={{ position:"absolute",right:"8%",top:"50%",transform:"translateY(-50%)",width:540,height:540,borderRadius:"50%",border:"1.5px dashed rgba(232,57,29,.16)",pointerEvents:"none" }}/>
      <div className="spin-ring-r" style={{ position:"absolute",right:"11%",top:"50%",transform:"translateY(-50%)",width:430,height:430,borderRadius:"50%",border:"1px solid rgba(232,57,29,.09)",pointerEvents:"none" }}/>

      {/* ══════════════════════════════════
          MAIN CONTENT GRID
      ══════════════════════════════════ */}
      <div className="hero-wrap" style={{
        width:"100%",maxWidth:1300,margin:"0 auto",
        display:"flex",alignItems:"center",
        padding:"0 4vw 80px",gap:"3rem",
        position:"relative",zIndex:5,
      }}>

        {/* ════════ LEFT: TEXT ════════ */}
        <div className="hero-left" style={{ flex:"0 0 50%",maxWidth:530,paddingRight:"2rem" }}>

          {/* Tag badge */}
          <div className="tag-anim" key={`tag-${current}`} style={{
            display:"inline-flex",alignItems:"center",gap:".5rem",
            padding:".3rem .9rem",borderRadius:50,marginBottom:"1.4rem",
            background:`rgba(232,57,29,.1)`,border:`1.5px solid rgba(232,57,29,.28)`,
            color:BRAND,fontSize:".71rem",fontWeight:800,letterSpacing:".18em",textTransform:"uppercase",
          }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:BRAND,display:"inline-block",boxShadow:`0 0 6px ${BRAND}` }}/>
            {slide.tag} · {slide.angle}
          </div>

          {/* Headline */}
          <div key={`h-${current}`} className={txtAnim==="in"?"txt-in":"txt-out"} style={{ animationDelay:".04s" }}>
            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(2.6rem,5.2vw,5rem)",
              fontWeight:900,lineHeight:1.09,color:"#1A0500",
              letterSpacing:"-.02em",marginBottom:"1.2rem",
            }}>
              {slide.title}<br/>
              <em style={{
                fontStyle:"italic",
                background:`linear-gradient(135deg,#FF6040,${BRAND},${BRAND_DARK})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                filter:`drop-shadow(0 2px 12px rgba(232,57,29,.3))`,
              }}>{slide.highlight}</em>
            </h1>
          </div>

          {/* Sub */}
          <div key={`s-${current}`} className={txtAnim==="in"?"txt-in":"txt-out"} style={{ animationDelay:".14s" }}>
            <p style={{ color:"#7A3020",fontSize:"clamp(.9rem,1.5vw,1.06rem)",lineHeight:1.82,maxWidth:440,marginBottom:"2rem",fontWeight:400 }}>
              {slide.sub}
            </p>
          </div>

          {/* CTA Buttons */}
          <div key={`b-${current}`} className={txtAnim==="in"?"txt-in":"txt-out"} style={{ animationDelay:".24s" }}>
            <div className="hero-cta-row" style={{ display:"flex",gap:".9rem",flexWrap:"wrap",marginBottom:"2.2rem" }}>
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
            <div className="hero-stat-row" style={{ display:"flex",gap:".8rem",flexWrap:"wrap",marginBottom:"2rem" }}>
              {[{ icon:"👟",num:"100+",lbl:"Styles" },{ icon:"⭐",num:"4.9",lbl:"Rating" },{ icon:"🚚",num:"Free",lbl:"Shipping" }].map(s=>(
                <div key={s.lbl} className="stat-pill">
                  <span style={{ fontSize:"1.25rem" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight:800,color:"#1A0500",fontSize:".9rem",lineHeight:1.1 }}>{s.num}</div>
                    <div style={{ color:"#B07060",fontSize:".64rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase" }}>{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="hero-thumb-row" style={{ display:"flex",alignItems:"center",gap:"1rem" }}>
            <div style={{ display:"flex",gap:".45rem" }}>
              {SLIDES.map((s,i)=>(
                <div key={i} className={`thumb-dot ${i===current?"on":""}`} onClick={()=>transition(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.angle}/>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:".25rem" }}>
              <span style={{ fontSize:".68rem",color:"#B07060",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase" }}>
                {String(current+1).padStart(2,"0")} / {String(SLIDES.length).padStart(2,"0")}
              </span>
              <div style={{ width:72,height:3,background:"rgba(232,57,29,.18)",borderRadius:2 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:BRAND,borderRadius:2,transition:"width .1s linear" }}/>
              </div>
            </div>
          </div>
        </div>

        {/* ════════ RIGHT: IMAGE ════════ */}
        <div className="hero-right" style={{ flex:1,position:"relative",height:"78vh",minHeight:460,display:"flex",alignItems:"center",justifyContent:"center" }}>

          {/* Blob behind image */}
          <div style={{
            position:"absolute",top:"50%",left:"50%",
            transform:"translate(-50%,-50%)",
            width:"72%",height:"82%",
            borderRadius:"60% 40% 55% 45% / 48% 52% 48% 52%",
            background:`linear-gradient(145deg,rgba(232,57,29,.11),rgba(255,140,70,.07))`,
            border:`1.5px solid rgba(232,57,29,.14)`,
          }}/>

          {/* Main floating image */}
          <div className="float-img" style={{ position:"relative",zIndex:4,width:"70%",maxWidth:400 }}>
            {/* Glow shadow */}
            <div style={{
              position:"absolute",bottom:"-4%",left:"8%",right:"8%",height:35,
              background:`radial-gradient(ellipse,rgba(232,57,29,.4),transparent 70%)`,
              filter:"blur(16px)",transform:"scaleX(1.15)",
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
                boxShadow:`0 32px 72px rgba(232,57,29,.3),0 8px 24px rgba(0,0,0,.1)`,
                display:"block",
              }}
            />
          </div>

          {/* ── Floating card: Price ── */}
          <div className="float-card float-badge" style={{ bottom:"20%",left:"2%",padding:".78rem 1.1rem",minWidth:130,zIndex:8 }}>
            <div style={{ fontSize:".62rem",color:"#B07060",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".18rem" }}>Starting from</div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:900,color:BRAND,lineHeight:1 }}>₹999</div>
            <div style={{ fontSize:".62rem",color:"#16a34a",fontWeight:700,marginTop:".18rem" }}>🟢 Free Delivery</div>
          </div>

          {/* ── Floating card: Rating ── */}
          <div className="float-card float-badge" style={{ top:"16%",right:"1%",padding:".65rem .9rem",zIndex:8,display:"flex",alignItems:"center",gap:".5rem",animationDelay:"1.1s" }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${BRAND},${BRAND_DARK})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",flexShrink:0 }}>⭐</div>
            <div>
              <div style={{ fontWeight:800,color:"#1A0500",fontSize:".88rem",lineHeight:1 }}>4.9 / 5</div>
              <div style={{ color:"#B07060",fontSize:".6rem",fontWeight:600 }}>1000+ Reviews</div>
            </div>
          </div>

          {/* ── Floating card: New styles ── */}
          <div className="float-badge" style={{ position:"absolute",top:"40%",right:"-1%",zIndex:8,background:`linear-gradient(135deg,${BRAND},${BRAND_DARK})`,borderRadius:14,padding:".6rem 1rem",boxShadow:`0 12px 30px rgba(232,57,29,.48)`,animationDelay:".65s" }}>
            <div style={{ color:"rgba(255,255,255,.75)",fontSize:".58rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase" }}>This Week</div>
            <div style={{ color:"#fff",fontSize:".86rem",fontWeight:800 }}>✨ 12 New Styles</div>
          </div>

          {/* ── Next-up previews ── */}
          <div style={{ position:"absolute",bottom:"12%",right:"3%",zIndex:8,display:"flex",gap:".4rem",alignItems:"flex-end" }}>
            {[(current+1)%SLIDES.length,(current+2)%SLIDES.length].map((idx,i)=>(
              <div key={idx} onClick={()=>transition(idx)} style={{
                width:50,height:50,borderRadius:12,overflow:"hidden",
                border:`2px solid ${i===0?BRAND:"rgba(232,57,29,.3)"}`,
                cursor:"pointer",opacity:i===0?.85:.55,
                transform:`translateY(${i*8}px)`,transition:"all .3s",
                boxShadow:"0 4px 14px rgba(0,0,0,.1)",flexShrink:0,
              }}
              onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.borderColor=BRAND;}}
              onMouseLeave={e=>{e.currentTarget.style.opacity=i===0?".85":".55";e.currentTarget.style.borderColor=i===0?BRAND:"rgba(232,57,29,.3)";}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SLIDES[idx].img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
              </div>
            ))}
          </div>

          {/* Sparkle dots */}
          {[
            {top:"10%",left:"20%",s:9, d:"0s"  },
            {top:"26%",left:"7%", s:6, d:".9s" },
            {top:"68%",right:"20%",s:7,d:"1.5s"},
            {top:"80%",left:"28%",s:5, d:".4s" },
            {top:"50%",left:"4%", s:8, d:"2s"  },
          ].map((sp,i)=>(
            <div key={i} style={{
              position:"absolute",top:sp.top,left:sp.left,right:sp.right,
              width:sp.s,height:sp.s,background:BRAND,borderRadius:"50%",
              animation:`sparkle 2.8s ${sp.d} ease-in-out infinite`,
              boxShadow:`0 0 ${sp.s*2}px rgba(232,57,29,.7)`,
            }}/>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:3,background:"rgba(232,57,29,.12)",zIndex:20 }}>
        <div style={{ height:"100%",width:`${progress}%`,background:BRAND,transition:"width .1s linear",borderRadius:"0 2px 2px 0" }}/>
      </div>

      {/* ── Trust strip ── */}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,zIndex:15,
        background:"rgba(255,255,255,.82)",backdropFilter:"blur(14px)",
        borderTop:"1px solid rgba(232,57,29,.1)",
        padding:".65rem 4vw",
        display:"flex",alignItems:"center",justifyContent:"center",gap:"2.5rem",flexWrap:"wrap",
      }}>
        {["🚚 Free Delivery","💎 Premium Quality","🔒 Secure Payment","⭐ 4.9 Rated"].map(t=>(
          <span key={t} style={{ fontSize:".73rem",color:"#7A3020",fontWeight:600 }}>{t}</span>
        ))}
      </div>
    </section>
  );
}
