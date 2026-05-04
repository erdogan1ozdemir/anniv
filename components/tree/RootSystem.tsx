// Multi-layer root render: main thick roots + side branches +
// secondary capillaries fanning off the side branches. Pulled out of
// TreeOfLife.tsx so the orchestrator stays readable.

import { GnarledBranch } from "./GnarledBranch";
import { r1 } from "./utils";
import { GROUND_Y, TRUNK_X, seedRand } from "@/lib/tree-data";

const TRUNK_COLOR = "#3A2E22";
const HIGHLIGHT = "rgba(255,235,200,0.18)";

interface RootShape {
  dx: number;
  dy: number;
  w: number;
  /** How many side branches to grow off this root. */
  branches: number;
}

const ROOTS: RootShape[] = [
  { dx: -440, dy: 60, w: 14, branches: 3 },
  { dx: -320, dy: 78, w: 12, branches: 3 },
  { dx: -200, dy: 90, w: 10, branches: 2 },
  { dx: -90, dy: 96, w: 7, branches: 2 },
  { dx: 90, dy: 96, w: 7, branches: 2 },
  { dx: 200, dy: 90, w: 10, branches: 2 },
  { dx: 320, dy: 78, w: 12, branches: 3 },
  { dx: 440, dy: 60, w: 14, branches: 3 },
  { dx: 0, dy: 102, w: 5, branches: 1 },
];

interface RootSystemProps {
  /** Whether to render small grass-tuft hairs at root tips. */
  showGrassTufts?: boolean;
}

export function RootSystem({ showGrassTufts = false }: RootSystemProps) {
  const minorTint = "#5E8F4A";
  return (
    <g opacity="0.95" pointerEvents="none">
      {ROOTS.map((r, i) => {
        const startX = TRUNK_X;
        const startY = GROUND_Y - 30;
        const endX = TRUNK_X + r.dx;
        const endY = GROUND_Y + r.dy;
        // 3-segment gnarled main root with two interior bend points
        const cp1x = TRUNK_X + r.dx * 0.32;
        const cp1y = GROUND_Y - 4;
        const cp2x = TRUNK_X + r.dx * 0.7;
        const cp2y = GROUND_Y + r.dy * 0.5;
        const sideRng = seedRand(i * 211 + 17);
        // Sample 4 points along the cubic Bezier
        const samples = [0, 0.34, 0.68, 1].map((t) => {
          const u = 1 - t;
          return {
            x: r1(
              u * u * u * startX +
                3 * u * u * t * cp1x +
                3 * u * t * t * cp2x +
                t * t * t * endX,
            ),
            y: r1(
              u * u * u * startY +
                3 * u * u * t * cp1y +
                3 * u * t * t * cp2y +
                t * t * t * endY,
            ),
          };
        });
        // Side branches off the main root at varying t-values
        const branchOffshoots = Array.from({ length: r.branches }).map(
          (_, b) => {
            const t = 0.4 + b * 0.18 + sideRng() * 0.08;
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
            const offDx = (38 + sideRng() * 50) * sign;
            const offDy = 24 + sideRng() * 18;
            const tx = r1(px + offDx);
            const ty = r1(py + offDy);
            // Mid-point for a 3-point gnarled side branch
            const midX = r1(px + offDx * 0.5 + sign * (sideRng() * 6));
            const midY = r1(py + offDy * 0.45);
            // Two tertiary capillaries off the side branch tip
            const cap1X = r1(tx + sign * 18);
            const cap1Y = r1(ty + 14);
            const cap2X = r1(tx + sign * 8);
            const cap2Y = r1(ty + 22);
            return { px, py, midX, midY, tx, ty, cap1X, cap1Y, cap2X, cap2Y };
          },
        );
        const w = Math.max(2, r.w * 0.48);
        return (
          <g key={i}>
            {/* Main root — multi-segment gnarled */}
            <GnarledBranch
              points={samples}
              baseWidth={r.w}
              tipFraction={0.5}
              color={TRUNK_COLOR}
              highlightColor={HIGHLIGHT}
            />
            {/* Side branches with their own capillaries */}
            {branchOffshoots.map((o, b) => (
              <g key={b}>
                <GnarledBranch
                  points={[
                    { x: o.px, y: o.py },
                    { x: o.midX, y: o.midY },
                    { x: o.tx, y: o.ty },
                  ]}
                  baseWidth={w}
                  tipFraction={0.55}
                  color={TRUNK_COLOR}
                  showKnots={false}
                  highlightColor={HIGHLIGHT}
                />
                {/* Tertiary capillaries — thin hair rootlets */}
                <line
                  x1={o.tx}
                  y1={o.ty}
                  x2={o.cap1X}
                  y2={o.cap1Y}
                  stroke={TRUNK_COLOR}
                  strokeWidth={Math.max(0.8, w * 0.55)}
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.78"
                />
                <line
                  x1={o.tx}
                  y1={o.ty}
                  x2={o.cap2X}
                  y2={o.cap2Y}
                  stroke={TRUNK_COLOR}
                  strokeWidth={Math.max(0.6, w * 0.4)}
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </g>
            ))}
            {showGrassTufts &&
              Array.from({ length: 3 }).map((_, j) => {
                const gx = TRUNK_X + r.dx + (j - 1) * 6;
                const gy = GROUND_Y + r.dy + 18;
                return (
                  <path
                    key={`gr-${j}`}
                    d={`M ${gx} ${gy} Q ${gx - 1} ${gy - 5}, ${gx - 2} ${gy - 9}`}
                    stroke={minorTint}
                    strokeWidth="0.6"
                    fill="none"
                    opacity="0.7"
                  />
                );
              })}
          </g>
        );
      })}
    </g>
  );
}
