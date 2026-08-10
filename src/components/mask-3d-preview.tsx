"use client";

import type { MaskType, Mounting } from "@/components/mask-configurator";

export type MaskPreviewProps = {
  maskType: MaskType;
  mounting: Mounting;
  diameterMM: number;
  secondDimensionMM: number;
  holeDiameterMM: number | null;
};

const VIEW_W = 400;
const VIEW_H = 340;
const CX = VIEW_W / 2;
const OUTER_R_PX = 130;
const TILT = 0.64;
const FLANGE_RADIUS_RATIO = 1.12;
const FLANGE_THICKNESS_MM = 2;
const MIN_WALL_PX = 3;
const MAX_WALL_PX = OUTER_R_PX * 1.3;

const COL_TOP = "#B5D4F4";
const COL_RIM = "#0C447C";
const COL_WALL = "#378ADD";
const COL_WALL_DARK = "#185FA5";
const COL_SLOT = "#042C53";
const COL_COLLAR = "#94A3B8";
const COL_COLLAR_RIM = "#475569";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function pt(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [r * Math.cos(rad), r * Math.sin(rad)];
}

function wallPath(r: number, ry: number, yTop: number, yBottom: number): string {
  return `M ${-r},${yTop} A ${r},${ry} 0 0 0 ${r},${yTop} L ${r},${yBottom} A ${r},${ry} 0 0 1 ${-r},${yBottom} Z`;
}

function wedgePath(r: number, startDeg: number, endDeg: number): string {
  const [x1, y1] = pt(r, startDeg);
  const [x2, y2] = pt(r, endDeg);
  return `M 0,0 L ${x1.toFixed(1)},${y1.toFixed(1)} A ${r},${r} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
}

function lineGrid(r: number, period: number) {
  const span = r * 1.6;
  const lines = [];
  for (let x = -span; x <= span; x += period) {
    lines.push(
      <line
        key={x}
        x1={x.toFixed(1)}
        y1={(-span).toFixed(1)}
        x2={x.toFixed(1)}
        y2={span.toFixed(1)}
        stroke={COL_SLOT}
        strokeWidth={2}
      />
    );
  }
  return lines;
}

function WedgeGrating({
  r,
  period,
  rotations,
  idPrefix,
}: {
  r: number;
  period: number;
  rotations: number[];
  idPrefix: string;
}) {
  const clipIds = rotations.map((_, k) => `${idPrefix}-${k}`);
  return (
    <>
      <defs>
        {clipIds.map((id, k) => {
          const start = -90 + k * 120;
          return (
            <clipPath id={id} key={id}>
              <path d={wedgePath(r, start, start + 120)} />
            </clipPath>
          );
        })}
      </defs>
      {rotations.map((angle, k) => (
        <g key={clipIds[k]} clipPath={`url(#${clipIds[k]})`}>
          <g transform={`rotate(${angle})`}>{lineGrid(r, period)}</g>
        </g>
      ))}
    </>
  );
}

function MaskFace({
  r,
  maskType,
  holeRadiusPx,
  idPrefix,
}: {
  r: number;
  maskType: MaskType;
  holeRadiusPx: number;
  idPrefix: string;
}) {
  return (
    <>
      <circle cx={0} cy={0} r={r} fill={COL_TOP} />
      <WedgeGrating r={r} period={12} rotations={[8, 68, -52]} idPrefix={`${idPrefix}-outer`} />
      {maskType === "tri-bahtinov" && (
        <>
          <circle cx={0} cy={0} r={r * 0.42} fill={COL_TOP} stroke={COL_RIM} strokeWidth={1.2} />
          <WedgeGrating
            r={r * 0.42}
            period={6}
            rotations={[48, 108, -12]}
            idPrefix={`${idPrefix}-inner`}
          />
        </>
      )}
      {holeRadiusPx > 0 && <circle cx={0} cy={0} r={holeRadiusPx} fill={COL_SLOT} />}
      <circle cx={0} cy={0} r={r} fill="none" stroke={COL_RIM} strokeWidth={1.5} />
    </>
  );
}

export function MaskPreview({
  maskType,
  mounting,
  diameterMM,
  secondDimensionMM,
  holeDiameterMM,
}: MaskPreviewProps) {
  const scale = OUTER_R_PX / (diameterMM / 2);
  const rx = OUTER_R_PX;
  const ry = rx * TILT;
  const extrusionPx = clamp(secondDimensionMM * scale, MIN_WALL_PX, MAX_WALL_PX);
  const holeRadiusPx = holeDiameterMM ? (holeDiameterMM / 2) * scale : 0;

  const label =
    mounting === "na-tube"
      ? `Maska ${maskType === "tri-bahtinov" ? "Tri-Bahtinov" : "Bahtinov"}, montaż na tubę, kołnierz ${secondDimensionMM} mm`
      : `Maska ${maskType === "tri-bahtinov" ? "Tri-Bahtinov" : "Bahtinov"}, montaż w tubę, głębokość wsunięcia ${secondDimensionMM} mm`;

  let baseY: number;
  let extrusion: React.ReactNode;

  if (mounting === "na-tube") {
    baseY = 190;
    const rimY = baseY - extrusionPx;
    extrusion = (
      <>
        <path
          d={wallPath(rx, ry, rimY, baseY)}
          transform={`translate(${CX} 0)`}
          fill={COL_COLLAR}
          stroke={COL_COLLAR_RIM}
          strokeWidth={1}
        />
        <g transform={`translate(${CX} ${baseY}) scale(1 ${TILT})`}>
          <MaskFace r={rx} maskType={maskType} holeRadiusPx={holeRadiusPx} idPrefix="face" />
        </g>
        <ellipse
          cx={CX}
          cy={rimY}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={COL_COLLAR_RIM}
          strokeWidth={2}
        />
      </>
    );
  } else {
    baseY = 150;
    const flangeRx = rx * FLANGE_RADIUS_RATIO;
    const flangeRy = flangeRx * TILT;
    const flangeThicknessPx = clamp(FLANGE_THICKNESS_MM * scale, MIN_WALL_PX, MAX_WALL_PX);
    const flangeBottomY = baseY + flangeThicknessPx;
    const topY = baseY - extrusionPx;
    extrusion = (
      <>
        <ellipse
          cx={CX}
          cy={flangeBottomY}
          rx={flangeRx}
          ry={flangeRy}
          fill={COL_WALL_DARK}
          stroke={COL_RIM}
          strokeWidth={1}
        />
        <path
          d={wallPath(flangeRx, flangeRy, baseY, flangeBottomY)}
          transform={`translate(${CX} 0)`}
          fill={COL_WALL}
          stroke={COL_RIM}
          strokeWidth={1}
        />
        <ellipse
          cx={CX}
          cy={baseY}
          rx={flangeRx}
          ry={flangeRy}
          fill={COL_WALL}
          stroke={COL_RIM}
          strokeWidth={1.5}
        />
        <ellipse
          cx={CX}
          cy={baseY}
          rx={rx}
          ry={ry}
          fill={COL_WALL_DARK}
          stroke={COL_RIM}
          strokeWidth={1}
        />
        <path
          d={wallPath(rx, ry, topY, baseY)}
          transform={`translate(${CX} 0)`}
          fill={COL_WALL}
          stroke={COL_RIM}
          strokeWidth={1}
        />
        <g transform={`translate(${CX} ${topY}) scale(1 ${TILT})`}>
          <MaskFace r={rx} maskType={maskType} holeRadiusPx={holeRadiusPx} idPrefix="face" />
        </g>
      </>
    );
  }

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-auto w-full" role="img" aria-label={label}>
      {extrusion}
    </svg>
  );
}
