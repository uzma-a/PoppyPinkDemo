// src/components/PoppyPinkLogo.js

export default function PoppyPinkLogo({
  size = 40,
  showText = true,
  textSize = "1.5rem"
}) {
  const fill = "rgba(255,255,255,0.93)";
  const W = size;
  const H = size;

  const squareSize = W * 0.38; // size of each small square
  const gap = W * 0.08;        // spacing between squares
  const rotate = 20;           // slight tilt like image

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        cursor: "pointer",
        userSelect: "none"
      }}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Left */}
        <rect
          x={W * 0.15}
          y={H * 0.05}
          width={squareSize}
          height={squareSize}
          rx={size * 0.05}
          fill={fill}
          transform={`rotate(${rotate}, ${W * 0.15 + squareSize/2}, ${H * 0.05 + squareSize/2})`}
        />

        {/* Top Right */}
        <rect
          x={W * 0.55}
          y={H * 0.15}
          width={squareSize * 0.75}
          height={squareSize * 0.75}
          rx={size * 0.05}
          fill={fill}
          transform={`rotate(${rotate}, ${W * 0.55 + (squareSize*0.75)/2}, ${H * 0.15 + (squareSize*0.75)/2})`}
        />

        {/* Bottom Left */}
        <rect
          x={W * 0.1}
          y={H * 0.5}
          width={squareSize * 0.75}
          height={squareSize * 0.75}
          rx={size * 0.05}
          fill={fill}
          transform={`rotate(${rotate}, ${W * 0.1 + (squareSize*0.75)/2}, ${H * 0.5 + (squareSize*0.75)/2})`}
        />

        {/* Bottom Right (Largest) */}
        <rect
          x={W * 0.45}
          y={H * 0.45}
          width={squareSize}
          height={squareSize}
          rx={size * 0.05}
          fill={fill}
          transform={`rotate(${rotate}, ${W * 0.45 + squareSize/2}, ${H * 0.45 + squareSize/2})`}
        />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: textSize,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#ffffff",
            lineHeight: 1
          }}
        >
          POPPY<span style={{ fontWeight: 400, opacity: 0.82 }}>PINK</span>
        </span>
      )}
    </div>
  );
}