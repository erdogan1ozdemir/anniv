// Decorative mini-plants attached to the trunk at vertical positions
// BETWEEN year branches. Pure visual fill — no memory data.
// User asked to fill the empty vertical gaps so each year-zone reads
// as a lush, continuous canopy rather than 10 isolated branches.

import { Plant } from "./Plant";
import { TRUNK_X, YEARS, yearBaseY } from "@/lib/tree-data";

const PALETTE_YEARS = YEARS;

export function InterYearFillers() {
  // For each gap between consecutive year branches, drop 2 mini plants
  // — one drooping left, one drooping right.
  const fillers: Array<{
    rootX: number;
    rootY: number;
    angle: number;
    length: number;
    seed: number;
    palette: number;
  }> = [];

  for (let i = 0; i < PALETTE_YEARS.length - 1; i++) {
    const yA = yearBaseY(PALETTE_YEARS[i]);
    const yB = yearBaseY(PALETTE_YEARS[i + 1]);
    const midY = (yA + yB) / 2;
    // Left filler — drooping outward and slightly down
    fillers.push({
      rootX: TRUNK_X - 18,
      rootY: midY,
      angle: Math.PI * 0.95, // mostly leftward, very slight downward
      length: 28 + (i % 3) * 6,
      seed: i * 173 + 41,
      palette: PALETTE_YEARS[i],
    });
    // Right filler
    fillers.push({
      rootX: TRUNK_X + 18,
      rootY: midY + 14,
      angle: Math.PI * 0.05, // mostly rightward
      length: 24 + ((i + 1) % 3) * 6,
      seed: i * 173 + 91,
      palette: PALETTE_YEARS[i + 1],
    });
  }

  return (
    <g pointerEvents="none">
      {fillers.map((f, idx) => (
        <Plant
          key={`fill-${idx}`}
          year={f.palette}
          rootX={f.rootX}
          rootY={f.rootY}
          baseAngle={f.angle}
          baseLength={f.length}
          depth={2}
          forkAngle={0.5}
          lengthShrink={0.6}
          widthShrink={0.75}
          stemColor="#6B8054"
          budScale={0.55}
          stemOpacity={0.78}
          seed={f.seed}
        />
      ))}
    </g>
  );
}
