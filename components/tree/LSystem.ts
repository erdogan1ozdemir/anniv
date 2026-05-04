// L-system fractal plant generator.
//
// Wiki primer: an axiom string is repeatedly rewritten by a set of
// production rules; the resulting string is interpreted by a "turtle"
// (forward, turn, branch). Here we skip the string step and recurse
// directly — the generator emits two flat arrays:
//   - segments: stem strokes (line endpoints + width hint)
//   - buds:     bud positions (terminal flowers)
//
// All output is rounded to 1 decimal so SSR and client agree on
// trig output (ECMAScript doesn't guarantee bit-identical Math.cos).

import { seedRand } from "@/lib/tree-data";

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  /** 0 = main stalk, increasing for thinner sub-branches. */
  depth: number;
}

export interface Bud {
  x: number;
  y: number;
  /** 0..1 — used to alternate two palette colors at the cluster. */
  hue: number;
  /** Visual size scalar relative to base bud radius. */
  scale: number;
}

export interface LSystemPlantOptions {
  /** Origin of the main stalk. */
  rootX: number;
  rootY: number;
  /** Direction of the main stalk in radians. PI/2 = up. */
  baseAngle?: number;
  /** Length of the main stalk's first segment. */
  baseLength?: number;
  /** How deeply to recurse (4 → ~80 segments, 5 → ~250). */
  depth?: number;
  /** Branch fork angle in radians (typical 0.35-0.55). */
  forkAngle?: number;
  /** Each generation's length is parent * lengthShrink (0.55-0.75). */
  lengthShrink?: number;
  /** Each generation's stem width multiplier (0.7-0.85). */
  widthShrink?: number;
  /** Random seed — same seed = same plant. */
  seed?: number;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Generate a deterministic fractal plant. Returns flat arrays so the
 * renderer can decide draw order (lines under buds, etc).
 */
export function generateLSystemPlant({
  rootX,
  rootY,
  baseAngle = Math.PI / 2,
  baseLength = 80,
  depth = 4,
  forkAngle = 0.45,
  lengthShrink = 0.68,
  widthShrink = 0.78,
  seed = 1,
}: LSystemPlantOptions): { segments: Segment[]; buds: Bud[] } {
  const segments: Segment[] = [];
  const buds: Bud[] = [];
  const rng = seedRand(seed);

  function recurse(
    x: number,
    y: number,
    angle: number,
    length: number,
    width: number,
    d: number,
  ): void {
    if (d <= 0 || length < 2.4) {
      // Terminal: drop a small bud cluster at the tip.
      const nBuds = 2 + Math.floor(rng() * 3); // 2-4 buds
      for (let i = 0; i < nBuds; i++) {
        const ba = angle + (rng() - 0.5) * 1.4;
        const bd = 1 + rng() * 6;
        buds.push({
          x: r1(x + Math.cos(ba) * bd),
          y: r1(y - Math.sin(ba) * bd),
          hue: rng(),
          scale: 0.7 + rng() * 0.7,
        });
      }
      return;
    }
    const endX = r1(x + Math.cos(angle) * length);
    const endY = r1(y - Math.sin(angle) * length);
    segments.push({ x1: r1(x), y1: r1(y), x2: endX, y2: endY, width: r1(width), depth: d });

    // Continue main axis with slight bias so the plant isn't perfectly straight
    const mainBias = (rng() - 0.5) * 0.18;
    recurse(
      endX,
      endY,
      angle + mainBias,
      length * (lengthShrink + 0.05),
      width * widthShrink,
      d - 1,
    );

    // Left + right forks at variable turn — gives the wax-flower geometry
    const turnL = forkAngle + (rng() - 0.5) * 0.2;
    const turnR = forkAngle + (rng() - 0.5) * 0.2;
    const childLen = length * lengthShrink;
    const childWidth = width * widthShrink;
    recurse(endX, endY, angle + turnL, childLen, childWidth, d - 1);
    recurse(endX, endY, angle - turnR, childLen, childWidth, d - 1);
  }

  recurse(rootX, rootY, baseAngle, baseLength, 1.6, depth);
  return { segments, buds };
}
