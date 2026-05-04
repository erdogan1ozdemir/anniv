// Recursive fractal branch generator — each call produces a single
// stroke, then spawns 2-3 thinner children at fork angles. After N
// levels the tree fills out a canopy-like silhouette.
//
// The geometry is precomputed in a flat array so we can rotate the
// rendering through GnarledBranch / plain lines / leafy tips depending
// on the call site.

import { GnarledBranch } from "./GnarledBranch";
import { r1 } from "./utils";
import { seedRand } from "@/lib/tree-data";

export interface FractalSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
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
  /** Fork angle in radians (typical 0.35-0.55). */
  forkAngle?: number;
  /** Each generation length × this. Lower = compact, higher = spread. */
  lengthShrink?: number;
  /** Each generation width × this. */
  widthShrink?: number;
  /** Random seed — same seed = same fractal. */
  seed?: number;
  /** How many forks per junction (2 = binary, 3 = ternary). */
  branchFactor?: 2 | 3;
}

export function generateFractal({
  rootX,
  rootY,
  baseAngle,
  baseLength,
  baseWidth,
  depth,
  forkAngle = 0.45,
  lengthShrink = 0.7,
  widthShrink = 0.62,
  seed = 1,
  branchFactor = 3,
}: FractalBranchOptions): FractalSegment[] {
  const segments: FractalSegment[] = [];
  const rng = seedRand(seed);

  function recurse(
    x: number,
    y: number,
    angle: number,
    length: number,
    width: number,
    d: number,
  ): void {
    if (d <= 0 || length < 2) return;
    const ex = r1(x + Math.cos(angle) * length);
    const ey = r1(y - Math.sin(angle) * length);
    segments.push({
      x1: r1(x),
      y1: r1(y),
      x2: ex,
      y2: ey,
      width: r1(width),
      depth: d,
      terminal: d === 1,
    });
    if (d === 1) return; // do not subdivide further
    // Continue main axis with subtle bias so the tree is not perfectly
    // symmetric.
    const mainBias = (rng() - 0.5) * 0.18;
    recurse(
      ex,
      ey,
      angle + mainBias,
      length * (lengthShrink + 0.05),
      width * widthShrink * 1.05,
      d - 1,
    );
    // Fork into 2 (or 3) children
    const turnL = forkAngle + (rng() - 0.5) * 0.18;
    const turnR = forkAngle + (rng() - 0.5) * 0.18;
    recurse(
      ex,
      ey,
      angle + turnL,
      length * lengthShrink,
      width * widthShrink,
      d - 1,
    );
    recurse(
      ex,
      ey,
      angle - turnR,
      length * lengthShrink,
      width * widthShrink,
      d - 1,
    );
    if (branchFactor === 3) {
      // A subtler middle-bias side fork for thicker canopy
      const turnM = forkAngle * 0.45 * (rng() < 0.5 ? -1 : 1);
      recurse(
        ex,
        ey,
        angle + turnM,
        length * lengthShrink * 0.85,
        width * widthShrink * 0.85,
        d - 1,
      );
    }
  }

  recurse(rootX, rootY, baseAngle, baseLength, baseWidth, depth);
  return segments;
}

// ─────────────────────────────────────────────────────────────────────
// FractalBranch — render the precomputed segments as gnarled bark with
// per-segment width tapering. Optionally drop a 2-bud cluster at each
// terminal so the tips read as having a tiny growth point.
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
      {/* Render each segment as a tiny GnarledBranch (2 points so just
          the main + highlight + shadow strokes — no junction knots) */}
      {segments.map((s, i) => (
        <GnarledBranch
          key={`fr-${i}`}
          points={[
            { x: s.x1, y: s.y1 },
            { x: s.x2, y: s.y2 },
          ]}
          baseWidth={s.width}
          tipFraction={0.78}
          color={color}
          showKnots={false}
          detailOpacity={Math.min(1, 0.35 + (s.depth / opts.depth) * 0.6)}
        />
      ))}
      {/* Terminal buds — tiny berries at the very tip of each leaf-end */}
      {budTips &&
        segments
          .filter((s) => s.terminal)
          .map((s, i) => {
            const c = budPalette[i % 2];
            return (
              <g key={`fr-bud-${i}`}>
                <circle cx={s.x2} cy={s.y2} r="2.2" fill={c} opacity="0.92" />
                <circle
                  cx={r1(s.x2 - 0.6)}
                  cy={r1(s.y2 - 0.6)}
                  r="0.7"
                  fill="#FBF6EA"
                  opacity="0.7"
                />
              </g>
            );
          })}
    </g>
  );
}
