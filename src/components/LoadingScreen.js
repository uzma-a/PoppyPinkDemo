// src/components/LoadingScreen.js
import { useState, useEffect } from "react";
import PoppyPinkLogo from "./PoppyPinkLogo";

const BRAND = "#e55d6a";

export default function LoadingScreen({ onDone }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2000);
    const t2 = setTimeout(onDone, 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:`linear-gradient(150deg, #FFF8F5 0%, #FFE8D8 50%, #FFF5F0 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
      transition:"opacity .7s ease", opacity:fade?0:1, pointerEvents:fade?"none":"all",
    }}>
      <style>{`
        @keyframes lSpin   { to { transform: rotate(360deg); } }
        @keyframes lLogoIn { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes lBlob   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.06)} }
        @keyframes lDot    { 0%,100%{opacity:.2} 50%{opacity:1} }
        @keyframes lPulse  { 0%,100%{filter:drop-shadow(0 0 12px ${BRAND}) drop-shadow(0 0 30px rgba(232,57,29,.4))} 50%{filter:drop-shadow(0 0 28px ${BRAND}) drop-shadow(0 0 60px rgba(232,57,29,.6))} }
        .l-blob { animation: lBlob var(--d,4s) ease-in-out infinite; animation-delay:var(--dl,0s); }
        .l-spin { animation: lSpin 1.3s linear infinite; }
        .l-in   { animation: lLogoIn .9s ease forwards; }
        .l-sub  { animation: lLogoIn .9s .5s ease forwards; opacity:0; }
        .l-d1   { animation: lDot 1.2s 0s ease-in-out infinite; }
        .l-d2   { animation: lDot 1.2s .22s ease-in-out infinite; }
        .l-d3   { animation: lDot 1.2s .44s ease-in-out infinite; }
        .l-pulse{ animation: lPulse 2s ease-in-out infinite; }
      `}</style>

      {/* Blobs */}
      {[{w:360,top:"-5%",left:"-8%",c:"rgba(232,57,29,.14)",d:"4.2s",dl:"0s"},{w:300,bottom:"0",right:"-6%",c:"rgba(255,85,51,.12)",d:"5s",dl:"1s"},{w:220,top:"40%",left:"60%",c:"rgba(196,46,21,.1)",d:"3.8s",dl:".5s"}]
        .map((b,i)=>(
          <div key={i} className="l-blob" style={{position:"absolute",top:b.top,left:b.left,right:b.right,bottom:b.bottom,width:b.w,height:b.w,borderRadius:"50%",background:`radial-gradient(circle,${b.c},transparent 70%)`,filter:"blur(40px)","--d":b.d,"--dl":b.dl}}/>
        ))}

      {/* Spinner ring */}
      <div style={{position:"relative",width:140,height:140,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.5rem"}}>
        <div className="l-spin" style={{position:"absolute",width:140,height:140,borderRadius:"50%",border:"2.5px solid transparent",borderTop:`2.5px solid ${BRAND}`,borderRight:"2.5px solid rgba(232,57,29,.4)"}}/>
        <div className="l-pulse">
          <PoppyPinkLogo size={54} showText={false} onDark={false} />
        </div>
      </div>

      {/* Brand name */}
      <div className="l-in" style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(2.2rem,6vw,4rem)",fontWeight:700,letterSpacing:".08em",color:"#1A0500"}}>
        POPPY<span style={{color:BRAND}}>PINK</span>
      </div>
      <p className="l-sub" style={{color:"#B07060",fontSize:".75rem",letterSpacing:".22em",textTransform:"uppercase",fontWeight:600,marginTop:".4rem"}}>
        Premium Women's Sandals
      </p>

      {/* Dots */}
      <div style={{marginTop:"2rem",display:"flex",gap:".6rem"}}>
        {["l-d1","l-d2","l-d3"].map((cls,i)=>(
          <div key={i} className={cls} style={{width:8,height:8,borderRadius:"50%",background:i===1?BRAND:"rgba(232,57,29,.35)"}}/>
        ))}
      </div>
    </div>
  );
}
