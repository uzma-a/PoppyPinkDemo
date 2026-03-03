// src/components/Footer.js
import { forwardRef } from "react";
import PoppyPinkLogo from "./PoppyPinkLogo";

const BRAND = "#e55d6a";

const Footer = forwardRef(function Footer(_, ref) {
  return (
    <footer ref={ref} style={{
      background: "#f9f9f9",
      padding: "4rem 2rem 2.5rem", marginTop: "30px",
      position: "relative", overflow: "hidden",
      borderTop: `1px solid rgba(229,93,106,.12)`,
    }}>
      <style>{`
        .flink { color:#999; font-size:.86rem; cursor:pointer; transition:color .2s; display:flex; align-items:center; gap:.45rem; background:none; border:none; font-family:'DM Sans',sans-serif; text-decoration:none; padding:.2rem 0; }
        .flink:hover { color:${BRAND}; }
        .social-pill { padding:.42rem .85rem; border-radius:8px; background:rgba(229,93,106,.08); border:1px solid rgba(229,93,106,.2); color:${BRAND}; font-size:.7rem; cursor:pointer; font-weight:600; transition:all .25s; font-family:'DM Sans',sans-serif; }
        .social-pill:hover { background:${BRAND}; color:#fff; transform:translateY(-2px); box-shadow:0 6px 18px rgba(229,93,106,.3); }
        .news-input { width:100%; padding:.7rem 1rem; border-radius:50px; background:#fff; border:1.5px solid rgba(229,93,106,.2); color:#1a1a1a; font-size:.85rem; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .2s, box-shadow .2s; }
        .news-input::placeholder { color:#bbb; }
        .news-input:focus { border-color:${BRAND}; box-shadow:0 0 0 3px rgba(229,93,106,.1); }
        .contact-item { display:flex; gap:.8rem; padding:.7rem; border-radius:12px; transition:background .2s; }
        .contact-item:hover { background:rgba(229,93,106,.05); }
      `}</style>

      {/* Top accent line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg, transparent, rgba(229,93,106,.3), ${BRAND}, rgba(229,93,106,.3), transparent)`,
      }}/>

      {/* Subtle dot grid */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`radial-gradient(circle, rgba(229,93,106,.08) 1px, transparent 1px)`,
        backgroundSize:"36px 36px",
        pointerEvents:"none",
      }}/>

      {/* Soft background blob */}
      <div style={{
        position:"absolute", bottom:"-20%", right:"-5%",
        width:400, height:400, borderRadius:"50%",
        background:`radial-gradient(circle, rgba(229,93,106,.07), transparent 70%)`,
        filter:"blur(50px)", pointerEvents:"none",
      }}/>

      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:"3rem", marginBottom:"3.5rem", flexWrap:"wrap" }}>

          {/* Brand column */}
          <div style={{ maxWidth:280 }}>
            <PoppyPinkLogo size={40} textSize="1.7rem" />
            <p style={{ color:"#888", lineHeight:1.8, fontSize:".86rem", maxWidth:265, marginTop:"1rem" }}>
              Premium women's sandals crafted for elegance, confidence and everyday grace.
            </p>
            <div style={{ marginTop:"1.5rem", display:"flex", gap:".65rem", flexWrap:"wrap" }}>
              {["♥ Instagram"].map(s => (
                <button key={s} className="social-pill">{s}</button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              color: BRAND, fontWeight:800, letterSpacing:".12em",
              textTransform:"uppercase", fontSize:".75rem", marginBottom:"1.4rem",
              display:"flex", alignItems:"center", gap:".4rem",
            }}>
              <span style={{ width:16, height:2, background:BRAND, borderRadius:2, display:"inline-block" }}/>
              Contact Us
            </h4>
            <div style={{ display:"flex", flexDirection:"column", gap:".3rem" }}>
              {[
                ["📞","Phone",  "+91-9773948133"],
                ["✉️","Email",  "Poppypink001@gmail.com"],
                ["📍","Address","New Delhi, India"],
              ].map(([ic,lb,val]) => (
                <div key={val} className="contact-item">
                  <span style={{ fontSize:"1.05rem", flexShrink:0 }}>{ic}</span>
                  <div>
                    <div style={{ color:"#bbb", fontSize:".65rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" }}>{lb}</div>
                    <div style={{ color:"#444", fontSize:".86rem", marginTop:".1rem" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:`1px solid rgba(229,93,106,.12)`,
          paddingTop:"1.5rem",
          display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem",
        }}>
          <p style={{ color:"#adabab", fontSize:".76rem" }}>© 2025 POPPYPINK. All rights reserved.</p>
          <p style={{ color:"#adabab", fontSize:".76rem" }}>
            Made with <span style={{ color:BRAND }}>♥</span> for bold, beautiful women
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;