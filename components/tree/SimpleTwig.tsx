// Lightweight twig — single curved stem + 1 leaf + 2-3 buds. ~10
// SVG elements per twig. Designed to scatter densely along year
// branches (above + below) without the cost of a full Canopy.

import { paletteForYear, r1 } from "./utils";

interface SimpleTwigProps {
  rootX: number;
  rootY: number;
  /** Direction in radians. PI/2 = up. */
  angle: number;
  length: number;
  year: number;
  /** Stable hash for deterministic jitter. */
  seed: number;
  stemColor?: string;
}

export function SimpleTwig({
  rootX,
  rootY,
  angle,
  length,
  year,
  seed,
  stemColor = "#3A2E22",
}: SimpleTwigProps) {
  const palette = paletteForYear(year);
  const endX = r1(rootX + Math.cos(angle) * length);
  const endY = r1(rootY - Math.sin(angle) * length);
  const perpX = -Math.sin(angle);
  const perpY = -Math.cos(angle);
  // Hash-based bend so each twig has its own micro-curve
  const bendSign = ((seed * 7) % 2 === 0 ? 1 : -1);
  const bendAmt = 1 + (seed % 3);
  const ctrlX = r1((rootX + endX) / 2 + perpX * bendSign * bendAmt);
  const ctrlY = r1((rootY + endY) / 2 + perpY * bendSign * bendAmt);
  // Mid-twig leaf attachment point (along the bezier at t=0.5)
  const mLx = r1((rootX + 2 * ctrlX + endX) / 4);
  const mLy = r1((rootY + 2 * ctrlY + endY) / 4);
  const leafSide = bendSign;
  const lpx = -Math.sin(angle) * leafSide;
  const lpy = -Math.cos(angle) * leafSide;
  const lx = r1(mLx + lpx * 4);
  const ly = r1(mLy + lpy * 4);
  const c1 = palette[seed % palette.length];
  const c2 = palette[(seed + 2) % palette.length];
  return (
    <g pointerEvents="none">
      {/* Curved stem */}
      <path
        d={`M ${r1(rootX)} ${r1(rootY)} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
        stroke={stemColor}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.92"
      />
      {/* Single mid-twig leaf */}
      <line
        x1={mLx}
        y1={mLy}
        x2={lx}
        y2={ly}
        stroke={stemColor}
        strokeWidth="0.5"
        opacity="0.7"
      />
      <ellipse
        cx={lx}
        cy={ly}
        rx="1.8"
        ry="3.2"
        fill="#7FA847"
        opacity="0.9"
        transform={`rotate(${r1((angle * 180) / Math.PI - 90 + leafSide * 30)} ${lx} ${ly})`}
      />
      {/* Bud trio at tip */}
      <circle cx={endX} cy={endY} r="2" fill={c1} opacity="0.92" />
      <circle
        cx={r1(endX + 2.5)}
        cy={r1(endY - 1)}
        r="1.5"
        fill={c2}
        opacity="0.88"
      />
      <circle
        cx={r1(endX - 1.5)}
        cy={r1(endY + 1.5)}
        r="1.2"
        fill={c1}
        opacity="0.78"
      />
    </g>
  );
}
