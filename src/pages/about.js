// src/pages/about.js
import Head from "next/head";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BRAND       = "#e55d6a";
const BRAND_LIGHT = "#fde8ea";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease`,
      ...style,
    }}>
      {children}
    </div>
  );
}

const MISSION_ITEMS = [
  { icon: "✦", text: "Trendy and elegant designs" },
  { icon: "✦", text: "High-quality materials" },
  { icon: "✦", text: "Comfortable fit for long wear" },
  { icon: "✦", text: "Affordable pricing" },
  { icon: "✦", text: "Fast and reliable delivery across India" },
];

const DIFF_ITEMS = [
  { icon: "🌸", title: "Premium Yet Affordable",  desc: "We bring high-end designs without high-end prices — luxury that fits every budget." },
  { icon: "👟", title: "Comfort First",            desc: "Crafted keeping the Indian lifestyle and daily wear in mind, every step feels effortless." },
  { icon: "✨", title: "Modern & Trendy Styles",   desc: "From party wear to everyday essentials — designs that match every occasion." },
  { icon: "🎀", title: "Attention to Detail",      desc: "Every pair reflects careful craftsmanship and a refined modern aesthetic." },
];

const STATS = [
  { num: "100+",  label: "Styles Available" },
  { num: "4.9★", label: "Customer Rating"  },
  { num: "10K+", label: "Happy Customers"  },
];

export default function AboutPage() {
  const footerRef = useRef(null);
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Head>
        <title>About Us — POPPYPINK</title>
        <meta name="description" content="Learn about Poppypink Shoes — India's premium women's footwear brand focused on style, comfort, and confidence." />
      </Head>

      <style suppressHydrationWarning>{`
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes orbDrift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12px,-16px)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes spinR    { to{transform:rotate(-360deg)} }
        @keyframes pulseRing{ 0%{transform:scale(.9);opacity:.6} 70%{transform:scale(1.3);opacity:0} 100%{opacity:0} }
        @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .diff-card { background:#fff; border:1.5px solid rgba(229,93,106,.12); border-radius:20px; padding:2rem 1.75rem; transition:all .35s cubic-bezier(.22,.68,0,1.2); position:relative; overflow:hidden; }
        .diff-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:${BRAND}; transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
        .diff-card:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(229,93,106,.14); border-color:rgba(229,93,106,.28); }
        .diff-card:hover::before { transform:scaleX(1); }

        .stat-block { text-align:center; padding:2rem 1.5rem; background:#fff; border-radius:18px; border:1.5px solid rgba(229,93,106,.1); transition:all .3s ease; }
        .stat-block:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(229,93,106,.12); border-color:rgba(229,93,106,.25); }

        .mission-item { display:flex; align-items:center; gap:1rem; padding:.85rem 1.2rem; border-radius:12px; border:1px solid rgba(229,93,106,.1); background:#fff; transition:all .25s ease; }
        .mission-item:hover { background:${BRAND_LIGHT}; border-color:rgba(229,93,106,.3); transform:translateX(6px); }

        .cta-btn { display:inline-flex; align-items:center; gap:.5rem; background:${BRAND}; color:#fff; padding:.9rem 2.2rem; border-radius:50px; font-family:'DM Sans',sans-serif; font-weight:700; font-size:.95rem; text-decoration:none; letter-spacing:.05em; box-shadow:0 10px 28px rgba(229,93,106,.35); transition:all .35s cubic-bezier(.22,.68,0,1.2); border:none; cursor:pointer; }
        .cta-btn:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 20px 44px rgba(229,93,106,.48); }

        .outline-btn { display:inline-flex; align-items:center; gap:.5rem; color:${BRAND}; padding:.9rem 2.2rem; border-radius:50px; font-family:'DM Sans',sans-serif; font-weight:700; font-size:.95rem; text-decoration:none; letter-spacing:.05em; border:2px solid rgba(229,93,106,.3); background:transparent; transition:all .35s ease; cursor:pointer; }
        .outline-btn:hover { background:rgba(229,93,106,.07); border-color:${BRAND}; transform:translateY(-4px); }

        .marquee-track { display:flex; width:max-content; animation:marquee 18s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }

        .spin-ring-1 { position:absolute; border-radius:50%; border:1.5px dashed rgba(229,93,106,.15); animation:spin 28s linear infinite; pointer-events:none; }
        .spin-ring-2 { position:absolute; border-radius:50%; border:1px solid rgba(229,93,106,.08); animation:spinR 20s linear infinite; pointer-events:none; }

        @media(max-width:768px) {
          .hero-grid, .two-col, .diff-grid { grid-template-columns:1fr!important; }
          .hero-right { display:none!important; }
          .stats-grid { grid-template-columns:1fr 1fr!important; }
        }
      `}</style>

      <Navbar footerRef={footerRef} />

      <main style={{ background:"#f9f9f9", overflow:"hidden" }}>

        {/* ══ HERO ══ */}
        <section style={{ position:"relative",minHeight:"92vh",display:"flex",alignItems:"center",overflow:"hidden",paddingTop:68 }}>
          <div style={{ position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,rgba(229,93,106,.11) 1.5px,transparent 1.5px)`,backgroundSize:"38px 38px",opacity:.7,pointerEvents:"none" }}/>
          <div style={{ position:"absolute",top:"-18%",right:"-8%",width:680,height:680,borderRadius:"50%",background:`radial-gradient(circle,rgba(229,93,106,.1),transparent 70%)`,filter:"blur(70px)",animation:"orbDrift 12s ease-in-out infinite",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",bottom:"-10%",left:"-5%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,rgba(229,93,106,.06),transparent 70%)`,filter:"blur(60px)",animation:"orbDrift 15s 2s ease-in-out infinite",pointerEvents:"none" }}/>
          <div className="spin-ring-1" style={{ width:560,height:560,top:"50%",right:"5%",marginTop:-280 }}/>
          <div className="spin-ring-2" style={{ width:420,height:420,top:"50%",right:"9%",marginTop:-210 }}/>

          <div className="hero-grid" style={{ maxWidth:1200,margin:"0 auto",padding:"4rem 4vw",width:"100%",position:"relative",zIndex:5,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center" }}>
            {/* Left */}
            <div style={{ opacity:heroMounted?1:0,transform:heroMounted?"translateY(0)":"translateY(40px)",transition:"opacity .8s ease, transform .8s ease" }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:".6rem",padding:".35rem 1rem",borderRadius:50,background:BRAND_LIGHT,border:`1.5px solid rgba(229,93,106,.25)`,marginBottom:"1.8rem" }}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:BRAND,boxShadow:`0 0 8px ${BRAND}`,display:"inline-block",animation:"pulseRing 2s ease-out infinite" }}/>
                <span style={{ color:BRAND,fontSize:".72rem",fontWeight:800,letterSpacing:".18em",textTransform:"uppercase" }}>India's Premium Women's Footwear</span>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(3rem,5.5vw,5.2rem)",fontWeight:900,lineHeight:1.06,color:"#1a1a1a",letterSpacing:"-.02em",marginBottom:"1.5rem" }}>
                Where Style<br/>Meets{" "}
                <em style={{ fontStyle:"italic",color:BRAND,position:"relative" }}>
                  Comfort
                  <span style={{ position:"absolute",bottom:2,left:0,right:0,height:5,background:`rgba(229,93,106,.2)`,borderRadius:4,display:"block" }}/>
                </em>
              </h1>
              <p style={{ color:"#666",fontSize:"1.05rem",lineHeight:1.85,maxWidth:480,marginBottom:"2.5rem" }}>
                Welcome to <strong style={{ color:"#1a1a1a" }}>Poppypink Shoes</strong> — a modern women's footwear brand dedicated to bringing style, comfort, and confidence together. We specialize in premium sandals designed for today's fashion-forward women in India.
              </p>
              <div style={{ display:"flex",gap:"1rem",flexWrap:"wrap" }}>
                <Link href="/" className="cta-btn">Shop Collection ✦</Link>
                <a href="#mission" className="outline-btn">Our Story →</a>
              </div>
            </div>

            {/* Right */}
            <div className="hero-right" style={{ position:"relative",height:520,display:"flex",alignItems:"center",justifyContent:"center",opacity:heroMounted?1:0,transition:"opacity 1s .3s ease" }}>
              <div style={{ position:"absolute",width:"65%",height:"75%",borderRadius:"55% 45% 60% 40% / 48% 52% 48% 52%",background:`rgba(229,93,106,.07)`,border:`1.5px solid rgba(229,93,106,.12)` }}/>
              <div style={{ animation:"floatY 6s ease-in-out infinite",position:"relative",zIndex:3,textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(7rem,14vw,12rem)",fontWeight:900,color:BRAND,opacity:.09,lineHeight:1,userSelect:"none",letterSpacing:"-.04em" }}>PP</div>
                <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem" }}>
                  <div style={{ fontSize:"4rem" }}>🌸</div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:900,color:"#1a1a1a",letterSpacing:"-.01em",textAlign:"center" }}>
                    Poppypink<br/><em style={{ color:BRAND,fontStyle:"italic",fontSize:"1.1rem",fontWeight:700 }}>Shoes</em>
                  </div>
                </div>
              </div>
              {[
                { pos:{top:"8%",left:"4%"},   label:"Happy Customers", val:"10K+", emoji:"👠", delay:"0s"   },
                { pos:{top:"10%",right:"2%"},  label:"Avg Rating",      val:"4.9★", emoji:"⭐", delay:"1s"   },
                { pos:{bottom:"15%",left:"0%"},label:"Styles",          val:"100+", emoji:"✨", delay:".5s"  },
                { pos:{bottom:"18%",right:"3%"},label:"Dispatch",       val:"24hr", emoji:"🚚", delay:"1.5s" },
              ].map((c,i) => (
                <div key={i} style={{ position:"absolute",...c.pos,zIndex:5,background:"#fff",borderRadius:16,padding:".8rem 1.1rem",boxShadow:"0 12px 32px rgba(229,93,106,.15)",border:`1.5px solid rgba(229,93,106,.12)`,animation:`floatY 5s ${c.delay} ease-in-out infinite`,minWidth:120 }}>
                  <div style={{ fontSize:"1.3rem",marginBottom:".2rem" }}>{c.emoji}</div>
                  <div style={{ fontWeight:900,color:BRAND,fontSize:"1.2rem",fontFamily:"'Playfair Display',serif",lineHeight:1 }}>{c.val}</div>
                  <div style={{ fontSize:".68rem",color:"#aaa",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",marginTop:".15rem" }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MARQUEE ══ */}
        <div style={{ background:BRAND,padding:".85rem 0",overflow:"hidden" }}>
          <div className="marquee-track">
            {[...Array(2)].map((_,j) =>
              ["🌸 Premium Quality","✦ Made for India","👟 Trendy Designs","🚚 Free Delivery","⭐ 4.9 Rated","🎀 Comfort First"].map((t,i) => (
                <span key={`${j}-${i}`} style={{ color:"rgba(255,255,255,.9)",fontSize:".82rem",fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",padding:"0 2.5rem",whiteSpace:"nowrap" }}>{t}</span>
              ))
            )}
          </div>
        </div>

        {/* ══ STATS ══ */}
        <section style={{ padding:"5rem 4vw",maxWidth:1200,margin:"0 auto" }}>
          <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem" }}>
            {STATS.map((s,i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div className="stat-block">
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"2.8rem",fontWeight:900,color:BRAND,lineHeight:1,marginBottom:".4rem" }}>{s.num}</div>
                  <div style={{ color:"#888",fontSize:".82rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase" }}>{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══ WHO WE ARE ══ */}
        <section style={{ padding:"3rem 4vw 5rem",maxWidth:1200,margin:"0 auto" }}>
          <div style={{ maxWidth:640 }}>
            <div>
              <FadeIn delay={0.1}>
                <div style={{ display:"inline-flex",alignItems:"center",gap:".5rem",marginBottom:"1rem" }}>
                  <span style={{ width:32,height:2,background:BRAND,borderRadius:2,display:"inline-block" }}/>
                  <span style={{ color:BRAND,fontSize:".72rem",fontWeight:800,letterSpacing:".18em",textTransform:"uppercase" }}>Who We Are</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.18}>
                <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,3.5vw,3rem)",fontWeight:900,color:"#1a1a1a",lineHeight:1.15,marginBottom:"1.5rem" }}>
                  A Brand Built<br/>for <em style={{ color:BRAND,fontStyle:"italic" }}>You</em>
                </h2>
              </FadeIn>
              <FadeIn delay={0.25}>
                <p style={{ color:"#666",fontSize:"1rem",lineHeight:1.9,marginBottom:"1.25rem" }}>
                  Poppypink Shoes is a modern women's footwear brand dedicated to bringing style, comfort, and confidence together. We specialize in premium and trendy women sandals designed for today's fashion-forward women in India.
                </p>
                <p style={{ color:"#666",fontSize:"1rem",lineHeight:1.9,marginBottom:"2rem" }}>
                  At Poppypink, we believe that the right pair of sandals doesn't just complete an outfit — it elevates your entire look, your mood, and your confidence.
                </p>
              </FadeIn>
              <FadeIn delay={0.32}>
                <div style={{ display:"flex",gap:"1.5rem",flexWrap:"wrap" }}>
                  {[["🇮🇳","Made for India"],["💎","Premium Quality"],["💸","Affordable"]].map(([icon,label]) => (
                    <div key={label} style={{ display:"flex",alignItems:"center",gap:".5rem" }}>
                      <span style={{ fontSize:"1.3rem" }}>{icon}</span>
                      <span style={{ color:"#1a1a1a",fontWeight:700,fontSize:".88rem" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ══ MISSION ══ */}
        <section id="mission" style={{ background:"#fff",padding:"6rem 4vw",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:"-10%",left:"-5%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,rgba(229,93,106,.07),transparent 70%)`,filter:"blur(60px)",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",bottom:"-10%",right:"-5%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,rgba(229,93,106,.05),transparent 70%)`,filter:"blur(50px)",pointerEvents:"none" }}/>
          <div style={{ maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2 }}>
            <div style={{ textAlign:"center",marginBottom:"4rem" }}>
              <FadeIn>
                <div style={{ display:"inline-flex",alignItems:"center",gap:".5rem",marginBottom:"1rem" }}>
                  <span style={{ width:32,height:2,background:BRAND,borderRadius:2,display:"inline-block" }}/>
                  <span style={{ color:BRAND,fontSize:".72rem",fontWeight:800,letterSpacing:".18em",textTransform:"uppercase" }}>Our Mission</span>
                  <span style={{ width:32,height:2,background:BRAND,borderRadius:2,display:"inline-block" }}/>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:900,color:"#1a1a1a",lineHeight:1.2,marginBottom:"1rem" }}>
                  Style. Comfort.<br/><em style={{ color:BRAND,fontStyle:"italic" }}>Affordability.</em>
                </h2>
              </FadeIn>
              <FadeIn delay={0.18}>
                <p style={{ color:"#888",fontSize:"1rem",maxWidth:520,margin:"0 auto",lineHeight:1.8 }}>
                  To provide stylish, comfortable, and affordable women sandals that blend fashion with everyday practicality.
                </p>
              </FadeIn>
            </div>
            <div className="two-col" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center" }}>
              <div style={{ display:"flex",flexDirection:"column",gap:".85rem" }}>
                {MISSION_ITEMS.map((item,i) => (
                  <FadeIn key={i} delay={i * 0.08}>
                    <div className="mission-item">
                      <span style={{ color:BRAND,fontSize:".9rem",fontWeight:800,flexShrink:0 }}>{item.icon}</span>
                      <span style={{ color:"#333",fontSize:".95rem",fontWeight:500 }}>{item.text}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
              <FadeIn delay={0.2}>
                <div style={{ background:BRAND_LIGHT,borderRadius:24,padding:"3rem 2.5rem",border:`1.5px solid rgba(229,93,106,.15)`,textAlign:"center",position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:`rgba(229,93,106,.12)` }}/>
                  <div style={{ position:"absolute",bottom:-20,left:-20,width:80,height:80,borderRadius:"50%",background:`rgba(229,93,106,.1)` }}/>
                  <div style={{ position:"relative",zIndex:2 }}>
                    <div style={{ fontSize:"3.5rem",marginBottom:"1.25rem" }}>🎯</div>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:900,color:"#1a1a1a",marginBottom:".75rem" }}>Our Promise</div>
                    <p style={{ color:"#666",fontSize:".92rem",lineHeight:1.8,marginBottom:"1.5rem" }}>
                      Every single pair we design goes through careful quality checks so you get nothing but the best — delivered fast, at a price that feels right.
                    </p>
                    <div style={{ display:"flex",justifyContent:"center",gap:"1.5rem" }}>
                      {[["🏅","Quality"],["💝","Care"],["⚡","Speed"]].map(([icon,label]) => (
                        <div key={label} style={{ textAlign:"center" }}>
                          <div style={{ fontSize:"1.6rem" }}>{icon}</div>
                          <div style={{ color:BRAND,fontSize:".7rem",fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",marginTop:".3rem" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ══ WHAT MAKES US DIFFERENT ══ */}
        <section style={{ padding:"6rem 4vw",maxWidth:1200,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"4rem" }}>
            <FadeIn>
              <div style={{ display:"inline-flex",alignItems:"center",gap:".5rem",marginBottom:"1rem" }}>
                <span style={{ width:32,height:2,background:BRAND,borderRadius:2,display:"inline-block" }}/>
                <span style={{ color:BRAND,fontSize:".72rem",fontWeight:800,letterSpacing:".18em",textTransform:"uppercase" }}>What Makes Us Different</span>
                <span style={{ width:32,height:2,background:BRAND,borderRadius:2,display:"inline-block" }}/>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:900,color:"#1a1a1a",lineHeight:1.2 }}>
                The Poppypink <em style={{ color:BRAND,fontStyle:"italic" }}>Difference</em>
              </h2>
            </FadeIn>
          </div>
          <div className="diff-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.5rem" }}>
            {DIFF_ITEMS.map((item,i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="diff-card">
                  <div style={{ display:"flex",alignItems:"flex-start",gap:"1.25rem" }}>
                    <div style={{ width:52,height:52,borderRadius:14,background:BRAND_LIGHT,border:`1.5px solid rgba(229,93,106,.2)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",flexShrink:0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:800,color:"#1a1a1a",fontSize:"1.15rem",marginBottom:".45rem" }}>{item.title}</div>
                      <div style={{ color:"#888",fontSize:".9rem",lineHeight:1.75 }}>{item.desc}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section style={{ padding:"7rem 4vw",maxWidth:860,margin:"0 auto",textAlign:"center" }}>
          <FadeIn>
            <div style={{ fontSize:"3rem",marginBottom:"1.5rem" }}>🌸</div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.2rem,4.5vw,3.8rem)",fontWeight:900,color:"#1a1a1a",lineHeight:1.15,marginBottom:"1.5rem" }}>
              Join the Poppypink<br/><em style={{ color:BRAND,fontStyle:"italic" }}>Community</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p style={{ color:"#888",fontSize:"1.05rem",lineHeight:1.85,maxWidth:580,margin:"0 auto 3rem" }}>
              Step into elegance. Step into comfort. Step into confidence with Poppypink Shoes — because every woman deserves to feel beautiful in every step.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <Link href="/" className="cta-btn" style={{ fontSize:"1rem",padding:"1rem 2.5rem" }}>
              Shop Now ✦
            </Link>
          </FadeIn>
          <FadeIn delay={0.35}>
            <div style={{ display:"flex",gap:"2rem",justifyContent:"center",flexWrap:"wrap",marginTop:"3rem",paddingTop:"2.5rem",borderTop:`1px solid rgba(229,93,106,.12)` }}>
              {["🚚 Free Delivery","💎 Premium Quality","↩️ 7-Day Returns","🔒 Secure Payment","⭐ 4.9 Rated"].map(t => (
                <span key={t} style={{ fontSize:".8rem",color:"#888",fontWeight:600 }}>{t}</span>
              ))}
            </div>
          </FadeIn>
        </section>

      </main>

      <Footer ref={footerRef} />
    </>
  );
}