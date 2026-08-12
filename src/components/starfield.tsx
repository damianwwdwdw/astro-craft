"use client";

import { useEffect, useRef, type CSSProperties } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function generateShadows(count: number, seedOffset: number) {
  return Array.from({ length: count }, (_, i) => {
    const seed = i + seedOffset;
    const x = (seededRandom(seed) * 100).toFixed(1);
    const y = (seededRandom(seed + 0.5) * 300).toFixed(1);
    return `${x}vw ${y}vh 0 currentColor`;
  }).join(", ");
}

const LAYERS = [
  { count: 130, size: 2, color: "rgba(255,255,255,0.9)", duration: 3.2, delay: 0, seedOffset: 0 },
  { count: 100, size: 2, color: "rgba(201,191,255,0.85)", duration: 4.4, delay: 0.9, seedOffset: 1000 },
  { count: 60, size: 3, color: "rgba(255,255,255,1)", duration: 5.1, delay: 1.7, seedOffset: 2000 },
  { count: 45, size: 3, color: "rgba(255,238,214,0.9)", duration: 3.8, delay: 2.4, seedOffset: 3000 },
];

const MILKY_WAY_ROTATION_DEG = -18;
const PARALLAX_FACTOR = -0.15;

export function Starfield() {
  const milkyWayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = milkyWayRef.current;
        if (el) {
          el.style.transform = `rotate(${MILKY_WAY_ROTATION_DEG}deg) translateY(${window.scrollY * PARALLAX_FACTOR}px)`;
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden will-change-transform"
      style={{ transform: "translateZ(0)" }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(180, 140, 90, 0.14), transparent 60%)," +
            "radial-gradient(ellipse 55% 35% at 10% 0%, rgba(90, 100, 120, 0.1), transparent 60%)",
        }}
      />
      <div
        ref={milkyWayRef}
        className="absolute"
        style={{
          left: "-40%",
          top: "-20%",
          width: "180%",
          height: "160%",
          transform: `rotate(${MILKY_WAY_ROTATION_DEG}deg)`,
          background:
            "radial-gradient(ellipse 16% 55% at 50% 25%, rgba(232,220,200,0.1), transparent 70%)," +
            "radial-gradient(ellipse 22% 65% at 50% 55%, rgba(210,195,175,0.07), transparent 70%)," +
            "radial-gradient(ellipse 18% 50% at 50% 85%, rgba(180,140,90,0.06), transparent 70%)",
        }}
      />
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          className="animate-twinkle absolute top-0 left-0 rounded-full"
          style={
            {
              width: layer.size,
              height: layer.size,
              color: layer.color,
              boxShadow: generateShadows(layer.count, layer.seedOffset),
              "--twinkle-duration": `${layer.duration}s`,
              "--twinkle-delay": `${layer.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
