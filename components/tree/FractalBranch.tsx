// Curved fractal branch generator. Two structural rules pulled from
// the reference Tree-of-Life silhouettes the user shared:
//
//   1. EVERY BRANCH IS A QUADRATIC BEZIER, not a straight line. Each
//      stem is sampled at 7 points along the curve so the renderer
//      draws a smooth bow rather than a stick.
//   2. CHILD BRANCHES EMERGE AT MULTIPLE POINTS ALONG THE PARENT
//      CURVE (~42%, ~70%, ~95%) — not only at the parent's tip. This
//      is what 'aralardan da alt dal çıkacak' looks like in real
//      trees: side branches all along, not bunched at the end.
//   3. Children bias UPWARD via lerp toward PI/2 (phototropism)
//      regardless of parent direction, so the canopy reads as
//      gravity-defying like a real tree.

import { GnarledBranch } from "./GnarledBranch";
import { r1 } from "./utils";
import { seedRand } from "@/lib/tree-data";

export interface FractalSegment {
  /** 7 sample points along the Bezier — adjacent points form line
   * segments inside GnarledBranch, so dense sampling reads as a
   * smooth curve. */
  points: Array<{ x: number; y: number }>;
  width: number;
  depth: number;
  /** True if this is a TERMINAL — no children below it. */
  terminal: boolean;
}

export interface FractalBranchOptions {
  rootX: number;
  rootY: number;
  /** Direction of the trunk in radians. PI/2 = up. */
  baseAngle: number;
  /** Length of the FIRST segment. */
  baseLength: number;
  /** Width of the FIRST segment. */
  baseWidth: number;
  /** Recursion depth (3-5). */
  depth: number;
  /** Fork angle in radians (typical 0.4-0.6). */
  forkAngle?: number;
  /** Each generation length × this. */
  lengthShrink?: number;
  /** Each generation width × this. */
  widthShrink?: number;
  /** Random seed — same seed = same fractal. */
  seed?: number;
  /** Branch factor: 2 = binary, 3 = ternary forks at each emergence. */
  branchFactor?: 2 | 3;
  /** Strength of upward gravity bias on children (0..0.6). */
  upBias?: number;
  /** Curve amplitude — perpendicular bend as fraction of length. */
  curveAmount?: number;
}

const N_SAMPLES = 6;

function bezier(
  t: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
): { x: number; y: number } {
  const u = 1 - t;
  return {
    x: u * u * x1 + 2 * u * t * cx + t * t * x2,
    y: u * u * y1 + 2 * u * t * cy + t * t * y2,
  };
}

function bezierTangent(
  t: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
): number {
  const u = 1 - t;
  const dx = 2 * u * (cx - x1) + 2 * t * (x2 - cx);
  const dy = 2 * u * (cy - y1) + 2 * t * (y2 - cy);
  // SVG y grows downward; convert to math angle (y-up).
  return Math.atan2(-dy, dx);
}

export function generateFractal({
  rootX,
  rootY,
  baseAngle,
  baseLength,
  baseWidth,
  depth,
  forkAngle = 0.5,
  lengthShrink = 0.72,
  widthShrink = 0.7,
  seed = 1,
  branchFactor = 2,
  upBias = 0.32,
  curveAmount = 0.16,
}: FractalBranchOptions): FractalSegment[] {
  const segments: FractalSegment[] = [];
  const rng = seedRand(seed);
  const UP = Math.PI / 2;

  function recurse(
    x: number,
    y: number,
    angle: number,
    length: number,
    width: number,
    d: number,
  ): void {
    if (d <= 0 || length < 2) return;
    // Endpoint of the curve in the requested direction
    const endX = x + Math.cos(angle) * length;
    const endY = y - Math.sin(angle) * length;
    // Perpendicular vector (rotated 90° from forward)
    const perpX = -Math.sin(angle);
    const perpY = -Math.cos(angle);
    // Random bend left or right of forward
    const bend = (rng() - 0.5) * curveAmount * length * 2;
    const cx = (x + endX) / 2 + perpX * bend;
    const cy = (y + endY) / 2 + perpY * bend;
    // Sample N_SAMPLES + 1 points along the curve
    const points = Array.from({ length: N_SAMPLES + 1 }).map((_, i) => {
      const t = i / N_SAMPLES;
      const p = bezier(t, x, y, cx, cy, endX, endY);
      return { x: r1(p.x), y: r1(p.y) };
    });
    segments.push({
      points,
      width: r1(width),
      depth: d,
      terminal: d === 1,
    });
    if (d === 1) return;
    // Children emerge at multiple t-positions along the parent curve.
    // Earlier emergences (smaller t) get longer children — they have
    // more room to grow before reaching their natural bound.
    const emergeTs = d >= 3 ? [0.42, 0.7, 0.95] : [0.55, 0.95];
    for (let ei = 0; ei < emergeTs.length; ei++) {
      const t = emergeTs[ei];
      const ep = bezier(t, x, y, cx, cy, endX, endY);
      const tangent = bezierTangent(t, x, y, cx, cy, endX, endY);
      const lengthFactor = 0.85 + (1 - t) * 0.25;
      const childLen = length * lengthShrink * lengthFactor;
      const childW = width * widthShrink;
      // Phototropism: pull child angle toward UP regardless of parent
      // direction. Lerp tangent → UP by upBias.
      const targetAngle = (1 - upBias) * tangent + upBias * UP;
      const turn = forkAngle + (rng() - 0.5) * 0.18;
      // Primary child to one side
      const sideMul = ei % 2 === 0 ? 1 : -1;
      recurse(
        ep.x,
        ep.y,
        targetAngle + sideMul * turn,
        childLen,
        childW,
        d - 1,
      );
      // Secondary child for ternary fork — skip at the near-tip
      // emergence (~95%) to avoid crowding at the parent's end.
      if (branchFactor === 3 && t < 0.92 && d > 2) {
        recurse(
          ep.x,
          ep.y,
          targetAngle - sideMul * turn * 0.85,
          childLen * 0.88,
          childW * 0.92,
          d - 1,
        );
      }
    }
  }

  recurse(rootX, rootY, baseAngle, baseLength, baseWidth, depth);
  return segments;
}

// ─────────────────────────────────────────────────────────────────────
// FractalBranch — render the precomputed curved segments as gnarled
// bark with per-segment width tapering. Each segment is one curved
// stroke (7 points) drawn through GnarledBranch so it inherits the
// same multi-stroke + shadow + highlight rendering.
// ─────────────────────────────────────────────────────────────────────

interface FractalBranchProps extends FractalBranchOptions {
  color?: string;
  /** When true, paint a tiny berry/bud at each terminal tip. */
  budTips?: boolean;
  /** Two-colour palette used for terminal buds (alternating). */
  budPalette?: [string, string];
}

export function FractalBranch({
  color = "#3A2E22",
  budTips = false,
  budPalette = ["#E8826B", "#F2C5D1"],
  ...opts
}: FractalBranchProps) {
  const segments = generateFractal(opts);
  return (
    <g pointerEvents="none">
      {segments.map((s, i) => (
        <GnarledBranch
          key={`fr-${i}`}
          points={s.points}
          baseWidth={s.width}
          tipFraction={0.85}
          color={color}
          showKnots={false}
          detailOpacity={Math.min(1, 0.4 + (s.depth / opts.depth) * 0.55)}
        />
      ))}
      {budTips &&
        segments
          .filter((s) => s.terminal)
          .map((s, i) => {
            const tip = s.points[s.points.length - 1];
            const c = budPalette[i % 2];
            return (
              <g key={`fr-bud-${i}`}>
                <circle cx={tip.x} cy={tip.y} r="2.4" fill={c} opacity="0.92" />
                <circle
                  cx={r1(tip.x - 0.7)}
                  cy={r1(tip.y - 0.7)}
                  r="0.8"
                  fill="#FBF6EA"
                  opacity="0.7"
                />
              </g>
            );
          })}
    </g>
  );
}
