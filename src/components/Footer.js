// src/components/Footer.js
import { forwardRef } from "react";
import PoppyPinkLogo from "./PoppyPinkLogo";

const BRAND      = "#E8391D";
const BRAND_DARK = "#C42E15";

const Footer = forwardRef(function Footer(_, ref) {
  return (
    <footer ref={ref} style={{
      background: BRAND_DARK,
      padding: "4.5rem 2rem 2.5rem",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        .flink { color:rgba(255,255,255,.55); font-size:.86rem; cursor:pointer; transition:color .2s; display:flex; align-items:center; gap:.45rem; background:none; border:none; font-family:'DM Sans',sans-serif; text-decoration:none; padding:.2rem 0; }
        .flink:hover { color:#fff; }
        .social-pill { padding:.42rem .85rem; border-radius:8px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); color:rgba(255,255,255,.85); font-size:.7rem; cursor:pointer; font-weight:600; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .social-pill:hover { background:rgba(255,255,255,.25); color:#fff; }
        .news-input { width:100%; padding:.7rem 1rem; border-radius:50px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.25); color:#fff; font-size:.85rem; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .2s; }
        .news-input::placeholder { color:rgba(255,255,255,.45); }
        .news-input:focus { border-color:rgba(255,255,255,.6); background:rgba(255,255,255,.18); }
      `}</style>

      {/* Top highlight line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.5),rgba(255,255,255,.8),rgba(255,255,255,.5),transparent)" }}/>

      {/* Subtle dot grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize:"36px 36px" }}/>

      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:"3rem", marginBottom:"3.5rem" }}>

          {/* Brand column */}
          <div>
            <PoppyPinkLogo size={40} textSize="1.7rem" onDark />
            <p style={{ color:"rgba(255,255,255,.5)", lineHeight:1.8, fontSize:".86rem", maxWidth:265, marginTop:"1rem" }}>
              Premium women's sandals crafted for elegance, confidence and everyday grace.
            </p>
            <div style={{ marginTop:"1.5rem", display:"flex", gap:".65rem", flexWrap:"wrap" }}>
              {["♥ Instagram","✿ Pinterest","✦ Facebook"].map(s=>(
                <button key={s} className="social-pill">{s}</button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color:"rgba(255,255,255,.9)", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", fontSize:".75rem", marginBottom:"1.4rem" }}>
              ✦ Contact Us
            </h4>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {[["📞","Phone","+91-9773948133"],["✉️","Email","Poppypink001@gmail.com"],["📍","Address","New Delhi, India"]].map(([ic,lb,val])=>(
                <div key={val} style={{ display:"flex", gap:".8rem" }}>
                  <span style={{ fontSize:"1.05rem", flexShrink:0 }}>{ic}</span>
                  <div>
                    <div style={{ color:"rgba(255,255,255,.35)", fontSize:".65rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" }}>{lb}</div>
                    <div style={{ color:"rgba(255,255,255,.75)", fontSize:".86rem", marginTop:".1rem" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          

          
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.15)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
          <p style={{ color:"rgba(255,255,255,.28)", fontSize:".76rem" }}>© 2025 POPPYPINK. All rights reserved.</p>
          <p style={{ color:"rgba(255,255,255,.28)", fontSize:".76rem" }}>Made with ♥ for bold, beautiful women</p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
