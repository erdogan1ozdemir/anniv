// Simple curved canopy at a year-branch tip. Renders 3-5 fork branches
// (count varies by memory load) as smooth Bezier curves fanning upward,
// each ending in a small 2-3 bud cluster. ~25 SVG elements per year.
//
// Replaces the previous L-system Plant + FractalBranch + LeafyTwig
// stack which produced thousands of elements per tree at all-zoom.

import { paletteForYear, r1 } from "./utils";

interface CanopyProps {
  year: number;
  /** Origin of the canopy — usually the year-branch tip. */
  rootX: number;
  rootY: number;
  /** Direction the canopy faces (radians). PI/2 = up. */
  baseAngle?: number;
  /** Number of memories in this year — drives fork count + length. */
  memCount?: number;
  /** Stem stroke colour. */
  stemColor?: string;
}

export function Canopy({
  year,
  rootX,
  rootY,
  baseAngle = Math.PI / 2,
  memCount = 0,
  stemColor = "#3A2E22",
}: CanopyProps) {
  // Number of forks scales mildly with memory count: 3 baseline,
  // up to 6 for the busiest year.
  const nForks = Math.min(6, 3 + Math.floor(memCount / 6));
  // Length scales similarly.
  const baseLen = 28 + Math.min(18, memCount * 0.9);
  const palette = paletteForYear(year);

  // Distribute forks evenly across a ~180° fan centred on baseAngle,
  // tilted slightly away from straight-up so siblings don't pile.
  const fanWidth = Math.PI * 0.78; // ~140° spread
  const startA = baseAngle - fanWidth / 2;
  const stepA = fanWidth / Math.max(1, nForks - 1);

  return (
    <g pointerEvents="none">
      {Array.from({ length: nForks }).map((_, i) => {
        const angle = startA + stepA * i;
        // Each fork length jittered slightly via deterministic hash
        const lenJit = ((year * 13 + i * 7) % 5) / 10; // 0..0.4
        const len = baseLen * (0.85 + lenJit);
        const tx = r1(rootX + Math.cos(angle) * len);
        const ty = r1(rootY - Math.sin(angle) * len);
        // Bezier control point — gentle outward curve
        const perpX = -Math.sin(angle);
        const perpY = -Math.cos(angle);
        const bend = (i % 2 === 0 ? 1 : -1) * 4;
        const ctrlX = r1((rootX + tx) / 2 + perpX * bend);
        const ctrlY = r1((rootY + ty) / 2 + perpY * bend);
        const c1 = palette[i % palette.length];
        const c2 = palette[(i + 2) % palette.length];
        const stemWidth = 2.6 + ((nForks - i) / nForks) * 1.2; // taper
        return (
          <g key={`fork-${i}`}>
            {/* Curved stem */}
            <path
              d={`M ${r1(rootX)} ${r1(rootY)} Q ${ctrlX} ${ctrlY} ${tx} ${ty}`}
              stroke={stemColor}
              strokeWidth={r1(stemWidth)}
              fill="none"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Bud cluster at fork tip */}
            <circle cx={tx} cy={ty} r="2.6" fill={c1} opacity="0.92" />
            <circle
              cx={r1(tx + 3)}
              cy={r1(ty - 1)}
              r="2"
              fill={c2}
              opacity="0.88"
            />
            <circle
              cx={r1(tx - 2)}
              cy={r1(ty + 2)}
              r="1.6"
              fill={c1}
              opacity="0.78"
            />
          </g>
        );
      })}
    </g>
  );
}
