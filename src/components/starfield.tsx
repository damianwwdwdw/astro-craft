import type { CSSProperties } from "react";

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
  { count: 70, size: 2, color: "rgba(255,255,255,0.9)", duration: 3.2, delay: 0, seedOffset: 0 },
  { count: 55, size: 2, color: "rgba(201,191,255,0.85)", duration: 4.4, delay: 0.9, seedOffset: 1000 },
  { count: 35, size: 3, color: "rgba(255,255,255,1)", duration: 5.1, delay: 1.7, seedOffset: 2000 },
  { count: 25, size: 3, color: "rgba(124,92,252,0.9)", duration: 3.8, delay: 2.4, seedOffset: 3000 },
];

export function Starfield() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
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
