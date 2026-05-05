// Multi-segment tapered branch — base thick, tip thin, with junction
// knots that hide the width step between consecutive segments.
//
// Geometry rule (per the user's structural spec):
//   - branch is split into N segments end-to-end (N=3..6 for year,
//     N=1..3 for season, N=4..5 for root)
//   - segment[i] strokeWidth = baseWidth × taperRatio ^ i
//   - segment[i].endWidth == segment[i+1].startWidth so the chain
//     fits visually
//   - last segment ends rounded, like a real branch tip
//
// Each segment is one <line> with strokeLinecap="round" — the rounded
// caps merge cleanly with the next segment + a knot ellipse smooths
// the width step.

import { r1 } from "./utils";

export interface Point {
  x: number;
  y: number;
}

interface TaperedBranchProps {
  /** N+1 points → N tapered segments. */
  points: Point[];
  /** Width of the FIRST segment (at the base). */
  baseWidth: number;
  /** Each subsequent segment width × this ratio. ~0.7-0.85 typical. */
  taperRatio?: number;
  color?: string;
  /** Show knot ellipses at each interior junction. */
  showKnots?: boolean;
  /** Add a soft right-edge highlight stroke for depth. */
  highlight?: boolean;
  /** Add a bottom shadow stroke. */
  shadow?: boolean;
  opacity?: number;
}

export function TaperedBranch({
  points,
  baseWidth,
  taperRatio = 0.78,
  color = "#3A2E22",
  showKnots = true,
  highlight = true,
  shadow = false,
  opacity = 1,
}: TaperedBranchProps) {
  if (points.length < 2) return null;
  const N = points.length - 1;
  const widths = Array.from({ length: N }).map(
    (_, i) => baseWidth * Math.pow(taperRatio, i),
  );
  return (
    <g pointerEvents="none" opacity={opacity}>
      {/* Optional shadow stroke under each segment */}
      {shadow &&
        points.slice(0, -1).map((p1, i) => {
          const p2 = points[i + 1];
          return (
            <line
              key={`tb-sh-${i}`}
              x1={r1(p1.x)}
              y1={r1(p1.y)}
              x2={r1(p2.x)}
              y2={r1(p2.y)}
              stroke="#1F1612"
              strokeWidth={r1(widths[i] + 1.6)}
              strokeLinecap="round"
              opacity="0.45"
            />
          );
        })}
      {/* Main tapering segments */}
      {points.slice(0, -1).map((p1, i) => {
        const p2 = points[i + 1];
        return (
          <line
            key={`tb-seg-${i}`}
            x1={r1(p1.x)}
            y1={r1(p1.y)}
            x2={r1(p2.x)}
            y2={r1(p2.y)}
            stroke={color}
            strokeWidth={r1(widths[i])}
            strokeLinecap="round"
          />
        );
      })}
      {/* Junction knots — interior points only */}
      {showKnots &&
        points.slice(1, -1).map((p, i) => {
          const w = widths[i + 1]; // width of NEXT segment (smaller)
          return (
            <ellipse
              key={`tb-knot-${i}`}
              cx={r1(p.x)}
              cy={r1(p.y)}
              rx={r1(w * 0.7)}
              ry={r1(w * 0.45)}
              fill={color}
            />
          );
        })}
      {/* Highlight stripe — slight perpendicular offset toward "up" */}
      {highlight &&
        points.slice(0, -1).map((p1, i) => {
          const p2 = points[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.hypot(dx, dy) || 1;
          const offX = (-dy / len) * (widths[i] * 0.22);
          const offY = (dx / len) * (widths[i] * 0.22);
          return (
            <line
              key={`tb-hl-${i}`}
              x1={r1(p1.x + offX)}
              y1={r1(p1.y + offY)}
              x2={r1(p2.x + offX)}
              y2={r1(p2.y + offY)}
              stroke="rgba(255,235,200,0.22)"
              strokeWidth={r1(Math.max(0.6, widths[i] * 0.28))}
              strokeLinecap="round"
            />
          );
        })}
    </g>
  );
}
