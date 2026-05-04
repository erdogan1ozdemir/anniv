// Fine secondary roots interleaved BETWEEN the main root strokes.
// The main RootSystem stays inline in TreeOfLife (it owns layout
// constants) — this layer just adds visual density for the
// "köklü, dolu dolu" feel.

import { r1 } from "./utils";
import { GROUND_Y, TRUNK_X, seedRand } from "@/lib/tree-data";

const TRUNK_COLOR = "#2C2620";

// Positions interleaved between the main 9 roots
const CAPILLARY_SLOTS: Array<{ dx: number; dy: number; w: number }> = [
  { dx: -380, dy: 70, w: 5 },
  { dx: -260, dy: 84, w: 5 },
  { dx: -140, dy: 92, w: 4 },
  { dx: -40, dy: 100, w: 3 },
  { dx: 40, dy: 100, w: 3 },
  { dx: 140, dy: 92, w: 4 },
  { dx: 260, dy: 84, w: 5 },
  { dx: 380, dy: 70, w: 5 },
];

export function RootCapillaries() {
  return (
    <g opacity="0.85" pointerEvents="none">
      {CAPILLARY_SLOTS.map((r, i) => {
        const startX = TRUNK_X;
        const startY = GROUND_Y - 18;
        const endX = TRUNK_X + r.dx;
        const endY = GROUND_Y + r.dy;
        const cp1x = TRUNK_X + r.dx * 0.35;
        const cp1y = GROUND_Y + 4;
        const cp2x = TRUNK_X + r.dx * 0.75;
        const cp2y = GROUND_Y + r.dy * 0.55;
        const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        const rng = seedRand(i * 137 + 9);
        // 2-3 hair-like rootlets fanning off the main capillary
        const hairs = Array.from({ length: 3 }).map((_, h) => {
          const t = 0.5 + h * 0.18;
          const u = 1 - t;
          const px = r1(
            u * u * u * startX +
              3 * u * u * t * cp1x +
              3 * u * t * t * cp2x +
              t * t * t * endX,
          );
          const py = r1(
            u * u * u * startY +
              3 * u * u * t * cp1y +
              3 * u * t * t * cp2y +
              t * t * t * endY,
          );
          const sign = r.dx >= 0 ? 1 : -1;
          const tipX = r1(px + (12 + rng() * 18) * sign);
          const tipY = r1(py + 10 + rng() * 8);
          return { px, py, tipX, tipY };
        });
        return (
          <g key={i}>
            {/* Main capillary */}
            <path
              d={d}
              stroke={TRUNK_COLOR}
              strokeWidth={r.w}
              fill="none"
              strokeLinecap="round"
              opacity="0.78"
            />
            {/* Hair rootlets */}
            {hairs.map((h, hi) => (
              <path
                key={hi}
                d={`M ${h.px} ${h.py} Q ${(h.px + h.tipX) / 2} ${(h.py + h.tipY) / 2 + 2}, ${h.tipX} ${h.tipY}`}
                stroke={TRUNK_COLOR}
                strokeWidth={Math.max(0.6, r.w * 0.4)}
                fill="none"
                strokeLinecap="round"
                opacity="0.65"
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}
