// Multi-stroke gnarled branch primitive. Renders a single conceptual
// branch as 3 parallel strokes (main + light top edge + dark bottom
// edge) to mimic real bark texture, optionally split into multiple
// SEGMENTS each with its own width taper + knot at the junction.
//
// Usage: <GnarledBranch points={[{x,y}, {x,y}, ...]} baseWidth={6} />

import { r1 } from "./utils";

export interface GnarledBranchProps {
  /** Sequential points along the branch path. Min 2 points. */
  points: Array<{ x: number; y: number }>;
  /** Width at the base; tapers toward the tip. */
  baseWidth: number;
  /** Width fraction at tip vs base (0..1). 0.3 = tip is 30% of base. */
  tipFraction?: number;
  /** Bark colour. */
  color?: string;
  /** Highlight colour (top stroke). */
  highlightColor?: string;
  /** Shadow colour (bottom stroke). */
  shadowColor?: string;
  /** Show knot ellipses at junctions (default true). */
  showKnots?: boolean;
  /** Multiplier on highlight + shadow opacity (turn off via 0). */
  detailOpacity?: number;
}

export function GnarledBranch({
  points,
  baseWidth,
  tipFraction = 0.45,
  color = "#3A2E22",
  highlightColor = "rgba(255,235,200,0.32)",
  shadowColor = "rgba(0,0,0,0.45)",
  showKnots = true,
  detailOpacity = 1,
}: GnarledBranchProps) {
  if (points.length < 2) return null;
  const N = points.length - 1;
  return (
    <g pointerEvents="none">
      {/* Main strokes — drawn first, widest at base */}
      {points.slice(0, -1).map((p1, i) => {
        const p2 = points[i + 1];
        const t = i / N;
        const w = baseWidth * (1 - t * (1 - tipFraction));
        return (
          <line
            key={`g-main-${i}`}
            x1={r1(p1.x)}
            y1={r1(p1.y)}
            x2={r1(p2.x)}
            y2={r1(p2.y)}
            stroke={color}
            strokeWidth={r1(w)}
            strokeLinecap="round"
          />
        );
      })}
      {/* Top highlight — slightly above the main stroke */}
      {points.slice(0, -1).map((p1, i) => {
        const p2 = points[i + 1];
        const t = i / N;
        const w = baseWidth * (1 - t * (1 - tipFraction));
        // Perpendicular offset toward the "up" side
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy) || 1;
        const offX = (-dy / len) * (w * 0.28);
        const offY = (dx / len) * (w * 0.28);
        return (
          <line
            key={`g-hl-${i}`}
            x1={r1(p1.x + offX)}
            y1={r1(p1.y + offY)}
            x2={r1(p2.x + offX)}
            y2={r1(p2.y + offY)}
            stroke={highlightColor}
            strokeWidth={r1(Math.max(0.6, w * 0.32))}
            strokeLinecap="round"
            opacity={detailOpacity}
          />
        );
      })}
      {/* Bottom shadow — opposite side */}
      {points.slice(0, -1).map((p1, i) => {
        const p2 = points[i + 1];
        const t = i / N;
        const w = baseWidth * (1 - t * (1 - tipFraction));
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy) || 1;
        const offX = (dy / len) * (w * 0.28);
        const offY = (-dx / len) * (w * 0.28);
        return (
          <line
            key={`g-sh-${i}`}
            x1={r1(p1.x + offX)}
            y1={r1(p1.y + offY)}
            x2={r1(p2.x + offX)}
            y2={r1(p2.y + offY)}
            stroke={shadowColor}
            strokeWidth={r1(Math.max(0.6, w * 0.28))}
            strokeLinecap="round"
            opacity={detailOpacity * 0.6}
          />
        );
      })}
      {/* Knot bulges at every interior junction */}
      {showKnots &&
        points.slice(1, -1).map((p, i) => {
          const t = (i + 1) / N;
          const w = baseWidth * (1 - t * (1 - tipFraction));
          return (
            <ellipse
              key={`g-knot-${i}`}
              cx={r1(p.x)}
              cy={r1(p.y)}
              rx={r1(w * 0.85)}
              ry={r1(w * 0.55)}
              fill={color}
            />
          );
        })}
    </g>
  );
}
