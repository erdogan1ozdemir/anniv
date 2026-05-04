// Sparse colored specks drifting across the canopy gaps.
// Rendering the rainbow-tree feel without tying decoration to data.

import { r1 } from "./utils";
import { seedRand } from "@/lib/tree-data";

const PALETTE = [
  "#E8826B",
  "#F2C5D1",
  "#9FC5BD",
  "#C8E07A",
  "#E8D9B0",
  "#D17A95",
  "#5A8B7E",
  "#7FA847",
];

export function DriftParticles() {
  const N = 130;
  return (
    <g pointerEvents="none">
      {Array.from({ length: N }).map((_, i) => {
        const rng = seedRand(i * 419 + 31);
        const x = r1(60 + rng() * 880);
        const verticalBias = rng();
        const y = r1(140 + verticalBias * verticalBias * 1980);
        const size = r1(2.2 + rng() * 4.5);
        const color = PALETTE[i % PALETTE.length];
        const op = r1(0.32 + rng() * 0.45);
        const variant = i % 5;
        if (variant === 0) {
          const s = size;
          return (
            <g key={`d${i}`} transform={`translate(${x} ${y})`} opacity={op}>
              <path
                d={`M 0 ${-s} L ${r1(s * 0.3)} 0 L 0 ${s} L ${r1(-s * 0.3)} 0 Z`}
                fill={color}
              />
              <path
                d={`M ${-s} 0 L 0 ${r1(s * 0.3)} L ${s} 0 L 0 ${r1(-s * 0.3)} Z`}
                fill={color}
                opacity="0.65"
              />
            </g>
          );
        }
        if (variant === 1) {
          return (
            <g key={`d${i}`} opacity={op}>
              <circle
                cx={x}
                cy={y}
                r={r1(size * 1.6)}
                fill={color}
                opacity="0.32"
              />
              <circle cx={x} cy={y} r={size} fill={color} />
            </g>
          );
        }
        return (
          <circle
            key={`d${i}`}
            cx={x}
            cy={y}
            r={size}
            fill={color}
            opacity={op}
          />
        );
      })}
    </g>
  );
}
