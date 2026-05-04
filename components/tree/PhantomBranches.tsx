// Decorative side branches sticking out from the trunk at vertical
// positions BETWEEN year branches. They have no year label, no
// memories — pure visual fill so the trunk doesn't feel sparse
// between year markers.

import { GnarledBranch } from "./GnarledBranch";
import { LeafyTwig } from "./LeafyTwig";
import { r1 } from "./utils";
import {
  GROUND_Y,
  TRUNK_X,
  YEARS,
  seedRand,
  yearBaseY,
} from "@/lib/tree-data";

export function PhantomBranches() {
  // For each gap between consecutive year branches, drop 2 phantom
  // branches (one each side, at slightly different vertical offsets).
  const phantoms: Array<{
    startX: number;
    startY: number;
    side: 1 | -1;
    length: number;
    width: number;
    seed: number;
  }> = [];
  for (let i = 0; i < YEARS.length - 1; i++) {
    const yA = yearBaseY(YEARS[i]);
    const yB = yearBaseY(YEARS[i + 1]);
    const span = yA - yB; // positive — yA is below yB
    // Two phantoms per gap, vertically distributed
    [0.35, 0.7].forEach((frac, idx) => {
      const startY = yB + span * frac;
      const sideRaw = (i + idx) % 2 === 0 ? -1 : 1;
      phantoms.push({
        startX: TRUNK_X + sideRaw * 18,
        startY,
        side: sideRaw as 1 | -1,
        length: 90 + ((i + idx) % 4) * 30,
        width: 5.2 + ((i + idx) % 3) * 0.8,
        seed: i * 73 + idx * 11 + 5,
      });
    });
  }

  // Also a couple of phantoms on the lower trunk where there's just
  // ground and no year branches
  const lowerY = GROUND_Y - 200;
  phantoms.push({
    startX: TRUNK_X - 18,
    startY: lowerY,
    side: -1,
    length: 110,
    width: 7,
    seed: 901,
  });
  phantoms.push({
    startX: TRUNK_X + 18,
    startY: lowerY + 80,
    side: 1,
    length: 100,
    width: 6.5,
    seed: 911,
  });

  return (
    <g pointerEvents="none">
      {phantoms.map((p, i) => {
        // Build a 4-segment gnarled branch arching outward + slightly
        // up. Each segment introduces a kink for the gnarled feel.
        const rng = seedRand(p.seed);
        const points: Array<{ x: number; y: number }> = [];
        let cx = p.startX;
        let cy = p.startY;
        let angle = p.side === 1 ? 0.05 : Math.PI - 0.05; // mostly horizontal
        const N = 4;
        const segLen = p.length / N;
        points.push({ x: cx, y: cy });
        for (let s = 0; s < N; s++) {
          // Slight upward bias + random kink
          angle += (rng() - 0.4) * 0.55;
          cx = cx + Math.cos(angle) * segLen;
          cy = cy - Math.abs(Math.sin(angle)) * segLen * 0.55;
          points.push({ x: cx, y: cy });
        }
        const tipX = points[points.length - 1].x;
        const tipY = points[points.length - 1].y;
        // Two leafy twigs at tip + one mid-branch
        const midPt = points[Math.floor(N / 2)];
        return (
          <g key={`ph-${i}`}>
            <GnarledBranch
              points={points}
              baseWidth={p.width}
              tipFraction={0.4}
              color="#3A2E22"
            />
            {/* Mid-branch leafy twig */}
            <LeafyTwig
              x={midPt.x}
              y={midPt.y}
              angle={Math.PI / 2 + p.side * 0.18}
              length={28}
              seed={p.seed + 17}
              nLeaves={4}
              berryColor="#E8826B"
            />
            {/* Tip leafy twig */}
            <LeafyTwig
              x={tipX}
              y={tipY}
              angle={Math.PI / 2 + p.side * 0.32}
              length={36}
              seed={p.seed + 41}
              nLeaves={5}
              berryColor="#F2C5D1"
            />
            {/* Down-tip leafy twig (drooping) */}
            <LeafyTwig
              x={r1(tipX - p.side * 6)}
              y={r1(tipY + 4)}
              angle={-Math.PI / 2 + p.side * 0.18}
              length={r1(22)}
              seed={p.seed + 67}
              nLeaves={3}
              berryColor="#C8E07A"
            />
          </g>
        );
      })}
    </g>
  );
}
