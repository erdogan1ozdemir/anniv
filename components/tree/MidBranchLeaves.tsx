// Sparse foliage clusters distributed ALONG a year branch (not at the
// tip). Adds the "branch covered in leaves" feel from the rainbow-tree
// reference without overlapping the per-event tokens.

import { paletteForYear, r1, r3 } from "./utils";
import { ShapeForIndex } from "./LeafShapes";
import { seedRand, yearPointAt } from "@/lib/tree-data";

interface MidBranchLeavesProps {
  year: number;
  side: 1 | -1;
}

export function MidBranchLeaves({ year, side }: MidBranchLeavesProps) {
  const palette = paletteForYear(year);
  const rng = seedRand(year * 547 + 23);
  const N_CLUSTERS = 6;
  return (
    <g pointerEvents="none">
      {Array.from({ length: N_CLUSTERS }).map((_, c) => {
        // Spread clusters from ~25% to ~88% along the branch
        const t = 0.25 + (c / N_CLUSTERS) * 0.63;
        const pt = yearPointAt(year, t);
        // Center the cluster slightly above the branch (toward canopy)
        const cx = r1(pt.x + side * (rng() * 14 + 4));
        const cy = r1(pt.y - 18 - rng() * 12);
        const N_PETALS = 7 + Math.floor(rng() * 4); // 7-10 per cluster
        return (
          <g key={`mc${c}`}>
            {/* Soft halo */}
            <circle
              cx={cx}
              cy={cy}
              r={26}
              fill={palette[c % palette.length]}
              opacity="0.07"
            />
            {Array.from({ length: N_PETALS }).map((_, i) => {
              const a = rng() * Math.PI * 2;
              const dist = 4 + rng() * 18;
              const px = r1(cx + Math.cos(a) * dist);
              const py = r1(cy + Math.sin(a) * dist * 0.85);
              const sz = r1(3 + rng() * 4);
              const color = palette[(c + i) % palette.length];
              const accent = palette[(c + i + 2) % palette.length];
              const opacity = r3(0.55 + rng() * 0.35);
              const rot = r1((rng() - 0.5) * 100);
              const shapeIndex = (c * 5 + i + year) % 17; // cycles through all 17 shapes
              return (
                <ShapeForIndex
                  key={`mc${c}-${i}`}
                  index={shapeIndex}
                  px={px}
                  py={py}
                  sz={sz}
                  rot={rot}
                  color={color}
                  accent={accent}
                  opacity={opacity}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
