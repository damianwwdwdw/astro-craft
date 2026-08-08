const LONG_ARM = "M0,-40 Q6,-14 0,0 Q-6,-14 0,-40 Z";
const SHORT_ARM = "M0,-24 Q3.5,-9 0,0 Q-3.5,-9 0,-24 Z";

export function OrbitStar() {
  return (
    <svg
      viewBox="-50 -50 100 100"
      className="size-6 overflow-visible drop-shadow-[0_0_10px_rgba(201,191,255,0.85)]"
      aria-hidden
    >
      <defs>
        <radialGradient id="orbitStarGradient" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="var(--brand-paper)" />
          <stop offset="55%" stopColor="var(--brand-paper)" />
          <stop offset="100%" stopColor="var(--brand-lavender)" />
        </radialGradient>
      </defs>
      <g className="star-arms-long" fill="url(#orbitStarGradient)">
        <path d={LONG_ARM} />
        <path d={LONG_ARM} transform="rotate(90)" />
        <path d={LONG_ARM} transform="rotate(180)" />
        <path d={LONG_ARM} transform="rotate(270)" />
      </g>
      <g className="star-arms-short" fill="url(#orbitStarGradient)">
        <path d={SHORT_ARM} transform="rotate(45)" />
        <path d={SHORT_ARM} transform="rotate(135)" />
        <path d={SHORT_ARM} transform="rotate(225)" />
        <path d={SHORT_ARM} transform="rotate(315)" />
      </g>
      <circle r="5" fill="var(--brand-paper)" />
    </svg>
  );
}
