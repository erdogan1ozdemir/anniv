// Realistic small twig with 3-5 oval leaves attached at points along
// the stem — for replacing bare-circle bud terminals at offshoot tips.

import { r1 } from "./utils";
import { seedRand } from "@/lib/tree-data";

interface LeafyTwigProps {
  /** Twig base. */
  x: number;
  y: number;
  /** Twig direction in radians. PI/2 = up. */
  angle: number;
  /** Twig length. */
  length: number;
  /** Leaf body colour. */
  leafColor?: string;
  /** Stem (twig) colour. */
  stemColor?: string;
  /** Berry / accent colour at the very tip. */
  berryColor?: string;
  /** Random seed for leaf placement. */
  seed?: number;
  /** Number of leaves on the twig. */
  nLeaves?: number;
}

export function LeafyTwig({
  x,
  y,
  angle,
  length,
  leafColor = "#7FA847",
  stemColor = "#3A2E22",
  berryColor,
  seed = 1,
  nLeaves = 4,
}: LeafyTwigProps) {
  const rng = seedRand(seed);
  const tx = r1(x + Math.cos(angle) * length);
  const ty = r1(y - Math.sin(angle) * length);
  // Perpendicular unit vector for leaf attachment offsets
  const dx = tx - x;
  const dy = ty - y;
  const llen = Math.hypot(dx, dy) || 1;
  const px = -dy / llen;
  const py = dx / llen;
  const leaves = Array.from({ length: nLeaves }).map((_, i) => {
    const t = 0.18 + (i / nLeaves) * 0.78;
    const cx = r1(x + (tx - x) * t);
    const cy = r1(y + (ty - y) * t);
    const side = i % 2 === 0 ? 1 : -1;
    const offset = 4 + rng() * 3;
    const lx = r1(cx + px * side * offset);
    const ly = r1(cy + py * side * offset);
    const rotDeg = r1(((angle * 180) / Math.PI - 90) + side * 30 + (rng() - 0.5) * 18);
    const sz = r1(2.2 + rng() * 1.6);
    return { lx, ly, rotDeg, sz, attachX: cx, attachY: cy };
  });
  return (
    <g pointerEvents="none">
      {/* Main twig */}
      <line
        x1={r1(x)}
        y1={r1(y)}
        x2={tx}
        y2={ty}
        stroke={stemColor}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Leaves */}
      {leaves.map((l, i) => (
        <g key={`l-${i}`}>
          {/* Tiny attachment hairline */}
          <line
            x1={l.attachX}
            y1={l.attachY}
            x2={l.lx}
            y2={l.ly}
            stroke={stemColor}
            strokeWidth="0.5"
            opacity="0.7"
          />
          {/* Leaf body */}
          <ellipse
            cx={l.lx}
            cy={l.ly}
            rx={r1(l.sz * 0.55)}
            ry={l.sz}
            fill={leafColor}
            opacity="0.88"
            transform={`rotate(${l.rotDeg} ${l.lx} ${l.ly})`}
          />
          {/* Center vein */}
          <line
            x1={l.lx}
            y1={r1(l.ly - l.sz * 0.85)}
            x2={l.lx}
            y2={r1(l.ly + l.sz * 0.85)}
            stroke={stemColor}
            strokeWidth="0.4"
            opacity="0.55"
            transform={`rotate(${l.rotDeg} ${l.lx} ${l.ly})`}
          />
        </g>
      ))}
      {/* Optional berry at tip */}
      {berryColor && (
        <>
          <circle cx={tx} cy={ty} r={r1(2.2 + rng() * 0.4)} fill={berryColor} opacity="0.92" />
          <circle cx={r1(tx - 0.7)} cy={r1(ty - 0.7)} r="0.7" fill="#FBF6EA" opacity="0.7" />
        </>
      )}
    </g>
  );
}
