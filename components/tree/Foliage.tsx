// RainbowFoliage — the dense decorative cloud at each year's branch tip.
// Composes leaf-shape primitives from LeafShapes.tsx so adding new
// shapes there is automatic here.

import { paletteForYear, r1, r3 } from "./utils";
import { ShapeForIndex } from "./LeafShapes";
import { seedRand } from "@/lib/tree-data";

interface RainbowFoliageProps {
  year: number;
  tipX: number;
  tipY: number;
  side: 1 | -1;
}

export function RainbowFoliage({ year, tipX, tipY, side }: RainbowFoliageProps) {
  const palette = paletteForYear(year);
  const rng = seedRand(year * 911 + 13);
  // Cluster center sits past the branch tip, fanning further out
  const cx = tipX + side * 30;
  const cy = tipY - 26;
  const N_PETALS = 42;
  return (
    <g pointerEvents="none">
      {/* Soft watercolor blooms behind */}
      <circle cx={cx} cy={cy} r={88} fill={palette[0]} opacity="0.10" />
      <circle
        cx={cx + side * 26}
        cy={cy + 14}
        r={62}
        fill={palette[1]}
        opacity="0.10"
      />
      <circle
        cx={cx - side * 18}
        cy={cy - 22}
        r={48}
        fill={palette[2]}
        opacity="0.09"
      />
      {/* Foliage shapes */}
      {Array.from({ length: N_PETALS }).map((_, i) => {
        const a = rng() * Math.PI * 2;
        const dist = 10 + rng() * 78;
        const px = r1(cx + Math.cos(a) * dist + side * (rng() * 8));
        const py = r1(cy + Math.sin(a) * dist * 0.92 - rng() * 14);
        const sz = r1(4 + rng() * 7);
        const color = palette[i % palette.length];
        const accent = palette[(i + 2) % palette.length];
        const opacity = r3(0.5 + rng() * 0.4);
        const rot = r1((rng() - 0.5) * 110);
        return (
          <ShapeForIndex
            key={`p${i}`}
            index={i}
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
}
