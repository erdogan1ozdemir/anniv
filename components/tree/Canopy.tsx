// Territory-based fractal canopy — every fork gets an exclusive
// angular slice so siblings cannot overlap. Each main fork has 2
// sub-forks (depth 2) and each sub-fork has 1-2 sub-sub-twigs
// (depth 3). Leaves are scattered along each curve at alternating
// sides, and a 5-petal flower sits at every fork tip.
//
// Element budget per year ≈ 460 (depth-3 branching + leaves + flowers)
// Total at all-zoom for 10 years ≈ 4600 — about 3× the previous
// minimal canopy but still well under the original 6000+ heavy
// implementation, with strict angle-territory rules so nothing
// overlaps.

import { paletteForYear, r1 } from "./utils";

interface CanopyProps {
  year: number;
  rootX: number;
  rootY: number;
  baseAngle?: number;
  memCount?: number;
  stemColor?: string;
}

// Quadratic Bezier evaluation
function bezier(
  t: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
): { x: number; y: number } {
  const u = 1 - t;
  return {
    x: u * u * x1 + 2 * u * t * cx + t * t * x2,
    y: u * u * y1 + 2 * u * t * cy + t * t * y2,
  };
}

// Small oval leaf attached perpendicular to a stem
function Leaf({
  ax,
  ay,
  angle,
  side,
  color,
  stemColor,
}: {
  ax: number;
  ay: number;
  angle: number;
  side: 1 | -1;
  color: string;
  stemColor: string;
}) {
  // Perpendicular offset
  const perpX = -Math.sin(angle) * side;
  const perpY = -Math.cos(angle) * side;
  const off = 4.5;
  const lx = r1(ax + perpX * off);
  const ly = r1(ay + perpY * off);
  const rotDeg = r1((angle * 180) / Math.PI - 90 + side * 28);
  return (
    <g>
      <line
        x1={r1(ax)}
        y1={r1(ay)}
        x2={lx}
        y2={ly}
        stroke={stemColor}
        strokeWidth="0.6"
        opacity="0.7"
      />
      <ellipse
        cx={lx}
        cy={ly}
        rx="2.2"
        ry="3.8"
        fill={color}
        opacity="0.92"
        transform={`rotate(${rotDeg} ${lx} ${ly})`}
      />
    </g>
  );
}

// 5-petal flower at a fork tip
function Flower({ x, y, palette, idx }: { x: number; y: number; palette: string[]; idx: number }) {
  const c1 = palette[idx % palette.length];
  const c2 = palette[(idx + 2) % palette.length];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-2.4"
          rx="1.4"
          ry="2.4"
          fill={c1}
          transform={`rotate(${deg})`}
          opacity="0.92"
        />
      ))}
      <circle r="1.1" fill="#F4D060" />
      <circle r="0.5" fill={c2} />
    </g>
  );
}

// Tiny bud cluster (3 dots) at terminal twigs
function BudCluster({
  x,
  y,
  palette,
  idx,
}: {
  x: number;
  y: number;
  palette: string[];
  idx: number;
}) {
  const c1 = palette[idx % palette.length];
  const c2 = palette[(idx + 1) % palette.length];
  const c3 = palette[(idx + 3) % palette.length];
  return (
    <g>
      <circle cx={r1(x)} cy={r1(y)} r="2.2" fill={c1} opacity="0.92" />
      <circle cx={r1(x + 3)} cy={r1(y - 1)} r="1.7" fill={c2} opacity="0.88" />
      <circle cx={r1(x - 2)} cy={r1(y + 2)} r="1.4" fill={c3} opacity="0.78" />
    </g>
  );
}

export function Canopy({
  year,
  rootX,
  rootY,
  baseAngle = Math.PI / 2,
  memCount = 0,
  stemColor = "#3A2E22",
}: CanopyProps) {
  const palette = paletteForYear(year);
  // Number of main forks (kat 1): 5-8 based on memory load
  const nMain = Math.min(8, 5 + Math.floor(memCount / 6));
  const baseLen = 30 + Math.min(22, memCount * 0.95);
  // Fan width — 165° spread
  const fanWidth = Math.PI * 0.92;
  const startA = baseAngle - fanWidth / 2;
  const stepA = fanWidth / Math.max(1, nMain - 1);
  // Each main fork's territory width — slightly less than gap so subs
  // never spill into a sibling's slot.
  const territory = stepA * 0.78;

  return (
    <g pointerEvents="none">
      {Array.from({ length: nMain }).map((_, i) => {
        const angleI = startA + stepA * i;
        // Hash-based length jitter
        const lenJit = ((year * 13 + i * 7) % 5) / 10;
        const lenI = baseLen * (0.85 + lenJit);
        // Main fork curve endpoints
        const endX = rootX + Math.cos(angleI) * lenI;
        const endY = rootY - Math.sin(angleI) * lenI;
        const perpX = -Math.sin(angleI);
        const perpY = -Math.cos(angleI);
        const bend = ((i * 5 + year) % 3) - 1;
        const ctrlX = (rootX + endX) / 2 + perpX * bend * 3;
        const ctrlY = (rootY + endY) / 2 + perpY * bend * 3;
        // ── Sub-forks (kat 2) — 2 children at ±territory/3, mid-curve
        const subPositions = [0.5, 0.78];
        return (
          <g key={`main-${i}`}>
            {/* Main fork curve */}
            <path
              d={`M ${r1(rootX)} ${r1(rootY)} Q ${r1(ctrlX)} ${r1(ctrlY)} ${r1(endX)} ${r1(endY)}`}
              stroke={stemColor}
              strokeWidth={r1(2.4 + ((nMain - i) / nMain) * 1.4)}
              fill="none"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Leaves along main fork — 2 per main, alternating sides */}
            {[0.32, 0.6].map((t, li) => {
              const p = bezier(t, rootX, rootY, ctrlX, ctrlY, endX, endY);
              const leafColor = palette[(i + li * 2) % palette.length];
              return (
                <Leaf
                  key={`mleaf-${i}-${li}`}
                  ax={p.x}
                  ay={p.y}
                  angle={angleI}
                  side={li % 2 === 0 ? 1 : -1}
                  color={leafColor}
                  stemColor={stemColor}
                />
              );
            })}
            {/* Sub-forks (kat 2) — 2 children */}
            {subPositions.map((t, si) => {
              const subStart = bezier(t, rootX, rootY, ctrlX, ctrlY, endX, endY);
              // Sub-fork angle: stay within parent's territory
              const subOffset = (si === 0 ? -1 : 1) * territory * 0.34;
              const subAngle = angleI + subOffset;
              const subLen = lenI * (0.5 + ((si * 3 + year) % 3) * 0.07);
              const subEndX = subStart.x + Math.cos(subAngle) * subLen;
              const subEndY = subStart.y - Math.sin(subAngle) * subLen;
              const subPerpX = -Math.sin(subAngle);
              const subPerpY = -Math.cos(subAngle);
              const subBend = ((si * 7 + i + year) % 3) - 1;
              const subCtrlX = (subStart.x + subEndX) / 2 + subPerpX * subBend * 2;
              const subCtrlY = (subStart.y + subEndY) / 2 + subPerpY * subBend * 2;
              // Sub-sub-twig (kat 3) at t=0.6 of sub-fork
              const sstStart = bezier(
                0.6,
                subStart.x,
                subStart.y,
                subCtrlX,
                subCtrlY,
                subEndX,
                subEndY,
              );
              const sstAngle = subAngle + (si === 0 ? -1 : 1) * 0.4;
              const sstLen = subLen * 0.45;
              const sstEndX = sstStart.x + Math.cos(sstAngle) * sstLen;
              const sstEndY = sstStart.y - Math.sin(sstAngle) * sstLen;
              return (
                <g key={`sub-${i}-${si}`}>
                  {/* Sub-fork curve */}
                  <path
                    d={`M ${r1(subStart.x)} ${r1(subStart.y)} Q ${r1(subCtrlX)} ${r1(subCtrlY)} ${r1(subEndX)} ${r1(subEndY)}`}
                    stroke={stemColor}
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  {/* One leaf along sub-fork */}
                  <Leaf
                    ax={
                      bezier(0.5, subStart.x, subStart.y, subCtrlX, subCtrlY, subEndX, subEndY).x
                    }
                    ay={
                      bezier(0.5, subStart.x, subStart.y, subCtrlX, subCtrlY, subEndX, subEndY).y
                    }
                    angle={subAngle}
                    side={si === 0 ? -1 : 1}
                    color={palette[(i + si + 1) % palette.length]}
                    stemColor={stemColor}
                  />
                  {/* Sub-sub-twig (kat 3) — straight line, terminal bud */}
                  <line
                    x1={r1(sstStart.x)}
                    y1={r1(sstStart.y)}
                    x2={r1(sstEndX)}
                    y2={r1(sstEndY)}
                    stroke={stemColor}
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.78"
                  />
                  <circle
                    cx={r1(sstEndX)}
                    cy={r1(sstEndY)}
                    r="1.6"
                    fill={palette[(i + si) % palette.length]}
                    opacity="0.92"
                  />
                  {/* Bud cluster at sub-fork tip */}
                  <BudCluster
                    x={subEndX}
                    y={subEndY}
                    palette={palette}
                    idx={i + si + 2}
                  />
                </g>
              );
            })}
            {/* Flower at main fork tip */}
            <Flower x={endX} y={endY} palette={palette} idx={i} />
          </g>
        );
      })}
    </g>
  );
}
