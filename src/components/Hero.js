import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const SLIDES = [
  { img: "/assets/hero-partywear.png", ctaLink: "/products?categories=Party Block Heel Sandals,Wedges Sandal,Wedge Heel Sandals" },
  { img: "/assets/hero-casual.png", ctaLink: "/products?categories=Block Heel Mules,Slim Heeled Pumps" },
];

const DURATION = 5000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const router = useRouter();
  const timerRef = useRef(null);

  const startAutoRotate = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length);
        setFade(true);
      }, 300);
    }, DURATION);
  };

  useEffect(() => {
    startAutoRotate();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    if (i === current) return;
    clearInterval(timerRef.current);
    setFade(false);
    setTimeout(() => {
      setCurrent(i);
      setFade(true);
      startAutoRotate();
    }, 300);
  };

  const slide = SLIDES[current];

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        // aspectRatio: "2400 / 1000",
        overflow: "hidden",
        background: "#f0e5da",
      }}
    >
      <style>{`
    .hero-img { transition: opacity .5s ease; }
    .hero-fade-in  { opacity: 1; }
    .hero-fade-out { opacity: 0; }
    .hero-dot {
      width: 34px; height: 4px; border-radius: 2px;
      background: rgba(255,255,255,.5); cursor: pointer;
      transition: background .3s ease; border: none; padding: 0;
    }
    .hero-dot.active { background: #fff; }
  `}</style>

      <img
        key={current}
        src={slide.img}
        alt="Hero banner"
        className={`hero-img ${fade ? "hero-fade-in" : "hero-fade-out"}`}
        onClick={() => router.push(slide.ctaLink)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          cursor: "pointer",
        }}
      />

      <div style={{ position: "absolute", bottom: "1.5rem", left: "6vw", zIndex: 6, display: "flex", gap: ".5rem" }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); goTo(i); }}
          />
        ))}
      </div>
    </section>
  );
}