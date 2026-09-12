import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const SLIDES = [
  {
    imgDesktop: "/assets/hero-partywear.png",
    imgMobile: "/assets/hero-partywear-mb.png",
    ctaLink: "/products?categories=Party Block Heel Sandals,Wedges Sandal,Wedge Heel Sandals",
  },
  {
    imgDesktop: "/assets/hero-casual.png",
    imgMobile: "/assets/hero-casual-mb.png",
    ctaLink: "/products?categories=Block Heel Mules,Slim Heeled Pumps",
  },
];

const DURATION = 4000;

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
        marginTop: "50px",
        overflow: "hidden",
        background: "#f0e5da",
      }}
      className="hero-section"
    >
      <style>{`
    .hero-section { aspect-ratio: 2400 / 1080; }
    
    @media (max-width: 700px) {
      .hero-section { 
        aspect-ratio: 1080 / 1350;  
      }
    }
    
    .hero-img { transition: opacity .5s ease; }
    .hero-fade-in  { opacity: 1; }
    .hero-fade-out { opacity: 0; }
  `}</style>
    
{/* 
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
      /> */}

      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <picture>
          <source media="(max-width: 700px)" srcSet={slide.imgMobile} />
          <img
            key={current}
            src={slide.imgDesktop}
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
        </picture>
      </div>
    </section>
  );
}