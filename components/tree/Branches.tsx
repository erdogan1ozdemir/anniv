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

interface Offshoot {
  px: number;
  py: number;
  tx: number;
  ty: number;
  stx: number;
  sty: number;
  w: number;
  knotR: number;
  // Tertiary fork: 2 even thinner twigs from the offshoot tip
  t1x: number;
  t1y: number;
  t2x: number;
  t2y: number;
  // Mid-branch hair for further density
  midX: number;
  midY: number;
  midTipX: number;
  midTipY: number;
}

export function SecondaryBranches({ year, side, trunkColor }: SecondaryBranchesProps) {
  const rng = seedRand(year * 313 + 41);
  const N = 7; // up from 5 — denser branching
  const offshoots: Offshoot[] = Array.from({ length: N }).map((_, i) => {
    const t = 0.4 + (i / N) * 0.5; // 40% → 90% along year branch
    const pt = yearPointAt(year, t);
    const r = rng();
    const lift = -55 - r * 40;
    const horiz = (15 + rng() * 30) * side;
    const tx = r1(pt.x + horiz);
    const ty = r1(pt.y + lift);
    const sr = rng();
    const stx = r1(tx + (sr - 0.5) * 38);
    const sty = r1(ty - 22 - sr * 18);
    const w = r1(2.5 + (1 - i / N) * 3.5);
    const knotR = r1(w * 0.55);
    // Tertiary fork — two thinner twigs branching from the offshoot tip
    const fr1 = rng();
    const fr2 = rng();
    const t1x = r1(tx + (fr1 - 0.7) * 26);
    const t1y = r1(ty - 14 - fr1 * 14);
    const t2x = r1(tx + (fr2 + 0.1) * 22 * side);
    const t2y = r1(ty - 10 - fr2 * 16);
    // Mid-offshoot whisker — short hair midway along main offshoot
    const midT = 0.55;
    const midX = r1(pt.x + (tx - pt.x) * midT);
    const midY = r1(pt.y + (ty - pt.y) * midT - 4);
    const midR = rng();
    const midTipX = r1(midX + (midR - 0.5) * 22);
    const midTipY = r1(midY - 12 - midR * 8);
    return {
      px: r1(pt.x),
      py: r1(pt.y),
      tx,
      ty,
      stx,
      sty,
      w,
      knotR,
      t1x,
      t1y,
      t2x,
      t2y,
      midX,
      midY,
      midTipX,
      midTipY,
    };
  });
  return (
    <g pointerEvents="none">
      {offshoots.map((o, i) => (
        <g key={i}>
          {/* Knot at base */}
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
          {/* Mid-offshoot whisker */}
          <path
            d={`M ${o.midX} ${o.midY} Q ${(o.midX + o.midTipX) / 2} ${(o.midY + o.midTipY) / 2 - 4}, ${o.midTipX} ${o.midTipY}`}
            stroke={trunkColor}
            strokeWidth={Math.max(0.8, o.w * 0.4)}
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Original sub-twig from offshoot tip */}
          <path
            d={`M ${o.tx} ${o.ty} Q ${(o.tx + o.stx) / 2} ${(o.ty + o.sty) / 2 - 6}, ${o.stx} ${o.sty}`}
            stroke={trunkColor}
            strokeWidth={Math.max(1, o.w * 0.55)}
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Tertiary fork — 2 thinner twigs */}
          <path
            d={`M ${o.tx} ${o.ty} Q ${(o.tx + o.t1x) / 2} ${(o.ty + o.t1y) / 2 - 4}, ${o.t1x} ${o.t1y}`}
            stroke={trunkColor}
            strokeWidth={Math.max(0.7, o.w * 0.38)}
            fill="none"
            strokeLinecap="round"
            opacity="0.72"
          />
          <path
            d={`M ${o.tx} ${o.ty} Q ${(o.tx + o.t2x) / 2} ${(o.ty + o.t2y) / 2 - 4}, ${o.t2x} ${o.t2y}`}
            stroke={trunkColor}
            strokeWidth={Math.max(0.7, o.w * 0.38)}
            fill="none"
            strokeLinecap="round"
            opacity="0.72"
          />
        </g>
      ))}
    </g>
  );
}
