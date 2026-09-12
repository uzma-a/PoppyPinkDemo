// src/components/PoppyPinkLogo.js
// Exact replica of POPPYPINK box logo:
// Layout (proportional to box image):
//
//     [ sm ][ md ]
//     [  large   ]
//
// The large square is bottom, spanning ~full width
// sm is top-left (smaller), md is top-right (medium)
// gap between squares matches box

export default function PoppyPinkLogo({ size = 36, showText = true, textSize = "1.5rem", onDark = false }) {
  const fill = "#e55d6a";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", userSelect: "none" }}>

      {showText && (
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: textSize,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: "#e55d6a ",
          lineHeight: 1,
        }}>
          POPPY<span style={{ fontWeight: 400, opacity: 0.82 }}>PINK</span>
        </span>
      )}
    </div>
  );
}
