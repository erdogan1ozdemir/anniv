// Renders one L-system plant (stems + bud cluster). One Plant per
// year on the Tree of Life, rooted at the trunk side, growing outward.

import type React from "react";
import { generateLSystemPlant, type LSystemPlantOptions } from "./LSystem";
import { paletteForYear } from "./utils";

interface PlantProps extends LSystemPlantOptions {
  /** Year, used to pick the palette. */
  year: number;
  /** Stem stroke colour — defaults to palette green. */
  stemColor?: string;
  /** Multiplier on bud radius (overall canopy size). */
  budScale?: number;
  /** Stem opacity. */
  stemOpacity?: number;
}

export function Plant({
  year,
  stemColor = "#8FA661",
  budScale = 1,
  stemOpacity = 0.92,
  ...lsysOptions
}: PlantProps) {
  const { segments, buds } = generateLSystemPlant({
    ...lsysOptions,
    seed: lsysOptions.seed ?? year * 911 + 13,
  });
  const palette = paletteForYear(year);

  // Find the maximum depth so we can stagger the growth animation:
  // depth-N stems (main stalk) draw first, then deeper levels follow.
  const maxDepth = segments.reduce((m, s) => Math.max(m, s.depth), 0);
  return (
    <g pointerEvents="none">
      {/* Stems first — under the buds */}
      {segments.map((s, i) => {
        const len = Math.round(
          Math.hypot(s.x2 - s.x1, s.y2 - s.y1) * 10,
        ) / 10;
        // Main stalk (high depth) draws first; thin terminals last.
        const generation = maxDepth - s.depth;
        const delay = generation * 220 + i * 6;
        return (
          <line
            key={`s${i}`}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={stemColor}
            strokeWidth={Math.max(0.7, s.width)}
            strokeLinecap="round"
            opacity={stemOpacity}
            className="lsys-stem"
            style={
              {
                "--len": `${len}`,
                "--delay": `${delay}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}
      {/* Buds — round terminals in alternating palette colors */}
      {buds.map((b, i) => {
        const r = (3.2 * b.scale) * budScale;
        const fillIdx = b.hue < 0.55 ? 0 : 1;
        const fill = palette[fillIdx];
        // Pop after all stems have drawn (~maxDepth*220 + 700)
        const delay = maxDepth * 220 + 700 + i * 12;
        const style = {
          "--delay": `${delay}ms`,
        } as React.CSSProperties;
        return (
          <g key={`b${i}`} className="lsys-bud" style={style}>
            <circle cx={b.x} cy={b.y} r={r * 1.6} fill={fill} opacity="0.18" />
            <circle cx={b.x} cy={b.y} r={r} fill={fill} />
            <circle
              cx={b.x - r * 0.32}
              cy={b.y - r * 0.32}
              r={r * 0.32}
              fill="#FBF6EA"
              opacity="0.7"
            />
          </g>
        );
      })}
    </g>
  );
}
