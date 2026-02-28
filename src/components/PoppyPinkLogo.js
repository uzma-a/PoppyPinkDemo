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
  const fill = "rgba(255,255,255,0.93)";
  const W = size;
  const H = size;
  const gap = W * 0.08;

  // Large bottom square: full width, bottom half
  const largeW = W;
  const largeH = H * 0.52;
  const largeX = 0;
  const largeY = H - largeH;

  // Top row: two squares side by side
  const topH   = H - largeH - gap;  // height available for top
  const smW    = W * 0.42;
  const smH    = topH;
  const smX    = 0;
  const smY    = 0;

  const mdW    = W - smW - gap;
  const mdH    = topH * 0.75; // slightly shorter — matches box
  const mdX    = smW + gap;
  const mdY    = 0;

  const rx = size * 0.06;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", userSelect: "none" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bottom large square */}
        <rect x={largeX} y={largeY} width={largeW} height={largeH} rx={rx} fill={fill} />
        {/* Top-left small square */}
        <rect x={smX} y={smY} width={smW} height={smH} rx={rx} fill={fill} />
        {/* Top-right medium square (shorter height) */}
        <rect x={mdX} y={mdY} width={mdW} height={mdH} rx={rx} fill={fill} />
      </svg>

      {showText && (
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: textSize,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: "#ffffff",
          lineHeight: 1,
        }}>
          POPPY<span style={{ fontWeight: 400, opacity: 0.82 }}>PINK</span>
        </span>
      )}
    </div>
  );
}
