// SecondaryBranches — small organic offshoots from each year branch.
// Adds visual richness without the chaos of random filler scribbles:
// each offshoot grows from a deterministic point along the year
// branch, lifts upward, and tapers in width.

import { r1 } from "./utils";
import { seedRand, yearPointAt } from "@/lib/tree-data";

interface SecondaryBranchesProps {
  year: number;
  side: 1 | -1;
  trunkColor: string;
}

export function SecondaryBranches({ year, side, trunkColor }: SecondaryBranchesProps) {
  const rng = seedRand(year * 313 + 41);
  const offshoots = Array.from({ length: 5 }).map((_, i) => {
    const t = 0.45 + (i / 5) * 0.42; // 45% → 87% along year branch
    const pt = yearPointAt(year, t);
    const r = rng();
    const lift = -55 - r * 35;
    const horiz = (15 + rng() * 25) * side;
    const tx = r1(pt.x + horiz);
    const ty = r1(pt.y + lift);
    const sr = rng();
    const stx = r1(tx + (sr - 0.5) * 38);
    const sty = r1(ty - 22 - sr * 18);
    const w = r1(3 + (1 - i / 5) * 3);
    // NEW: tiny knot bulge at the offshoot base for gnarled feel
    const knotR = r1(w * 0.55);
    return { px: r1(pt.x), py: r1(pt.y), tx, ty, stx, sty, w, knotR };
  });
  return (
    <g pointerEvents="none">
      {offshoots.map((o, i) => (
        <g key={i}>
          {/* Knot at base where offshoot meets year branch */}
          <ellipse
            cx={o.px}
            cy={o.py}
            rx={o.knotR * 1.1}
            ry={o.knotR * 0.7}
            fill={trunkColor}
            opacity="0.85"
          />
          {/* Main offshoot */}
          <path
            d={`M ${o.px} ${o.py} Q ${(o.px + o.tx) / 2 + side * 4} ${(o.py + o.ty) / 2 - 8}, ${o.tx} ${o.ty}`}
            stroke={trunkColor}
            strokeWidth={o.w}
            fill="none"
            strokeLinecap="round"
            opacity="0.92"
          />
          {/* Sub-twig */}
          <path
            d={`M ${o.tx} ${o.ty} Q ${(o.tx + o.stx) / 2} ${(o.ty + o.sty) / 2 - 6}, ${o.stx} ${o.sty}`}
            stroke={trunkColor}
            strokeWidth={Math.max(1, o.w * 0.55)}
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      ))}
    </g>
  );
}
