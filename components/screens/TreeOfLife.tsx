"use client";

import {
  GROUND_Y,
  KIND_STYLE,
  SEASON_MONTHS,
  SEASON_ORDER,
  TREE_VB,
  TRUNK_X,
  YEARS,
  eventPos,
  monthPath,
  monthSeason,
  monthTip,
  seasonPath,
  seasonTip,
  seedRand,
  yearPath,
  yearPointAt,
  yearTip,
  type EventKind,
  type LifeEvent,
  type Season,
  type ZoomFocus,
  type ZoomLevel,
} from "@/lib/tree-data";
import { OrganicTrunk } from "@/components/tree/Trunk";
import { Canopy } from "@/components/tree/Canopy";
import { TaperedBranch } from "@/components/tree/TaperedBranch";
import { EventGlyph, FoliageBurst } from "@/components/tree/Tokens";
import { r1 } from "@/components/tree/utils";

// ===================================================================
// GLYPHS
// ===================================================================
interface GlyphBase {
  x: number;
  y: number;
  color: string;
  fill: string;
  size?: number;
  rot?: number;
  opacity?: number;
}

function LeafGlyph({ x, y, color, fill, size = 12, rot = 0, opacity = 1 }: GlyphBase) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size / 12})`} opacity={opacity}>
      <path
        d="M 0 0 C -5 -3 -8 -8 -6 -13 C -2 -16 4 -14 6 -10 C 8 -5 5 -1 0 0 Z"
        fill={fill}
        stroke={color}
        strokeWidth="0.6"
      />
      <path d="M -1 -1 L -3 -10" stroke={color} strokeWidth="0.5" fill="none" opacity="0.7" />
    </g>
  );
}

function FlowerGlyph({ x, y, color, fill, size = 10, opacity = 1 }: GlyphBase) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 10})`} opacity={opacity}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-4"
          rx="2.5"
          ry="4"
          fill={fill}
          transform={`rotate(${a})`}
          stroke={color}
          strokeWidth="0.4"
        />
      ))}
      <circle r="2" fill="#F4D060" />
    </g>
  );
}

function FruitGlyph({ x, y, color, fill, size = 10, opacity = 1 }: GlyphBase) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 10})`} opacity={opacity}>
      <path d="M -1 -8 Q 1 -8 1 -6" stroke="#3F2D1E" strokeWidth="0.8" fill="none" />
      <path d="M 1 -6 L 3 -8" stroke="#5E8F4A" strokeWidth="0.8" fill="none" />
      <ellipse cx="0" cy="-1" rx="5" ry="6" fill={fill} stroke={color} strokeWidth="0.5" />
      <ellipse cx="-1.5" cy="-3" rx="1.5" ry="2" fill="#fff" opacity="0.5" />
    </g>
  );
}

function DryLeafGlyph({ x, y, color, fill, size = 11, rot = 0, opacity = 1 }: GlyphBase) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size / 11})`} opacity={opacity}>
      <path
        d="M 0 0 C -4 -2 -7 -7 -5 -12 C -1 -14 4 -12 6 -9 C 7 -4 4 -1 0 0 Z"
        fill={fill}
        stroke={color}
        strokeWidth="0.6"
      />
      <path d="M 0 -1 L -2 -9" stroke={color} strokeWidth="0.5" fill="none" opacity="0.8" />
    </g>
  );
}

function BudGlyph({ x, y, color, fill, size = 8, opacity = 1 }: GlyphBase) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 8})`} opacity={opacity}>
      <ellipse cx="0" cy="0" rx="3" ry="5" fill={fill} stroke={color} strokeWidth="0.5" />
      <path
        d="M 0 -5 Q -1 -7 -2 -8 M 0 -5 Q 1 -7 2 -8"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
      />
    </g>
  );
}

function SparkleGlyph({ x, y, color, fill, size = 14, opacity = 1 }: GlyphBase) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 14})`} opacity={opacity}>
      <circle r="6" fill={fill} opacity="0.4" />
      <path
        d="M 0 -8 L 1.5 -1.5 L 8 0 L 1.5 1.5 L 0 8 L -1.5 1.5 L -8 0 L -1.5 -1.5 Z"
        fill={color}
      />
      <circle r="2" fill="#fff" />
    </g>
  );
}

// ===================================================================
// CREATURES
// ===================================================================
function Bird({
  x,
  y,
  scale = 1,
  color = "#3F2D1E",
  flip = false,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  flip?: boolean;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}
      opacity={opacity}
    >
      <ellipse cx="0" cy="0" rx="9" ry="6" fill={color} />
      <circle cx="7" cy="-3" r="4.5" fill={color} />
      <path d="M 11 -3 L 14 -2 L 11 -1 Z" fill="#D8624C" />
      <circle cx="8" cy="-4" r="0.7" fill="#FFF8E7" />
      <path d="M -8 0 L -14 -2 L -13 0 L -14 2 Z" fill={color} />
      <path d="M -2 -3 Q 0 -8 4 -5 Q 2 -1 -2 -3 Z" fill="rgba(0,0,0,0.3)" />
    </g>
  );
}

function Butterfly({
  x,
  y,
  scale = 1,
  color1 = "#D17A95",
  color2 = "#F2C5D1",
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  color1?: string;
  color2?: string;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <ellipse
        cx="-5"
        cy="-3"
        rx="6"
        ry="8"
        fill={color2}
        stroke={color1}
        strokeWidth="0.5"
        transform="rotate(-20 -5 -3)"
      />
      <ellipse
        cx="5"
        cy="-3"
        rx="6"
        ry="8"
        fill={color2}
        stroke={color1}
        strokeWidth="0.5"
        transform="rotate(20 5 -3)"
      />
      <ellipse
        cx="-4"
        cy="4"
        rx="4"
        ry="5"
        fill={color1}
        opacity="0.85"
        transform="rotate(-25 -4 4)"
      />
      <ellipse
        cx="4"
        cy="4"
        rx="4"
        ry="5"
        fill={color1}
        opacity="0.85"
        transform="rotate(25 4 4)"
      />
      <ellipse cx="0" cy="0" rx="0.8" ry="6" fill="#3F2D1E" />
    </g>
  );
}

function Ladybug({ x, y, scale = 1, opacity = 1 }: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <ellipse cx="0" cy="0" rx="4" ry="5" fill="#A82E2E" />
      <path d="M 0 -5 L 0 5" stroke="#241710" strokeWidth="0.6" />
      <circle cx="-1.5" cy="-1" r="0.7" fill="#241710" />
      <circle cx="1.5" cy="-1" r="0.7" fill="#241710" />
      <ellipse cx="0" cy="-5" rx="2" ry="1.5" fill="#241710" />
    </g>
  );
}

function Bee({ x, y, scale = 1, opacity = 1 }: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <ellipse cx="0" cy="0" rx="4" ry="3" fill="#F4D060" />
      <path d="M -2 -2.5 L -2 2.5" stroke="#241710" strokeWidth="1" />
      <path d="M 1 -2.7 L 1 2.7" stroke="#241710" strokeWidth="1" />
      <ellipse cx="-1" cy="-3" rx="3" ry="2" fill="rgba(255,255,255,0.7)" stroke="#9C6F3D" strokeWidth="0.3" />
      <circle cx="4" cy="0" r="1.8" fill="#241710" />
    </g>
  );
}

function TreeCat({
  x,
  y,
  scale = 1,
  flip = false,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}
      opacity={opacity}
    >
      <ellipse cx="0" cy="0" rx="14" ry="6" fill="#8B6F4E" />
      <ellipse cx="0" cy="-2" rx="13" ry="5" fill="#A8845A" />
      <ellipse cx="-8" cy="2" rx="4" ry="3" fill="#E8DFC8" />
      <circle cx="-11" cy="-4" r="5" fill="#A8845A" />
      <path d="M -14 -7 L -15 -11 L -12 -8 Z" fill="#8B6F4E" />
      <path d="M -10 -7 L -8 -11 L -7 -8 Z" fill="#8B6F4E" />
      <circle cx="-13" cy="-4" r="0.8" fill="#241710" />
      <circle cx="-9" cy="-4" r="0.8" fill="#241710" />
      <path
        d="M 12 -1 Q 18 5 22 12 Q 24 16 22 18"
        stroke="#A8845A"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Owl({ x, y, scale = 1, opacity = 1 }: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <ellipse cx="0" cy="2" rx="8" ry="11" fill="#5E4525" />
      <ellipse cx="0" cy="2" rx="6" ry="9" fill="#8B6F4E" />
      <circle cx="-3" cy="-2" r="3" fill="#FFF8E7" />
      <circle cx="3" cy="-2" r="3" fill="#FFF8E7" />
      <circle cx="-3" cy="-2" r="1.5" fill="#241710" />
      <circle cx="3" cy="-2" r="1.5" fill="#241710" />
      <path d="M 0 0 L -1.5 2 L 1.5 2 Z" fill="#D8624C" />
      <path d="M -6 -5 L -7 -9 L -4 -7 Z" fill="#5E4525" />
      <path d="M 6 -5 L 7 -9 L 4 -7 Z" fill="#5E4525" />
    </g>
  );
}


// ===================================================================
// MAIN TREE
// ===================================================================
const ALL_SEASON_TINTS: Record<Season, string[]> = {
  spring: ["#9FC580", "#B8D69A", "#E8C5D6", "#7FA847"],
  summer: ["#5E8F4A", "#7FA847", "#3F6B2A", "#9FC580"],
  autumn: ["#C56B3F", "#E8826B", "#D9B68C", "#9C5B2F"],
  winter: ["#A8B5C5", "#C8D0DC", "#9FA8B5", "#7B7969"],
};

interface TreeOfLifeProps {
  events: LifeEvent[];
  viewBox: string;
  level: ZoomLevel;
  focus: ZoomFocus;
  onSelectYear?: (year: number) => void;
  onSelectSeason?: (year: number, season: Season) => void;
  onSelectMonth?: (year: number, month: number) => void;
  onSelectEvent?: (ev: LifeEvent) => void;
  onPreviewEvent?: (
    ev: LifeEvent,
    anchor: { x: number; y: number },
  ) => void;
  season?: Season;
  width?: string;
  height?: string;
}

export function TreeOfLife({
  events,
  viewBox,
  level,
  focus,
  onSelectYear,
  onSelectSeason,
  onSelectMonth,
  onSelectEvent,
  onPreviewEvent,
  season = "spring",
  width = "100%",
  height = "100%",
}: TreeOfLifeProps) {
  const seasonAlpha = level === "all" ? 0.55 : 1;
  const monthAlpha = level === "all" ? 0 : level === "year" ? 0.4 : 1;
  // Tokens shrink as you zoom in. Deeper zooms have a small viewBox AND
  // few tokens, so a small token still has plenty of tap area. Going
  // aggressively small at month/week prevents the previous "emoji
  // overflowing the branch" problem the user flagged.
  const eventScale =
    level === "all"
      ? 1.2
      : level === "year"
        ? 1.1
        : level === "season"
          ? 0.75
          : level === "month"
            ? 0.55
            : 0.45; // week / moment
  const eventLabelShow = level === "month" || level === "week";
  // Render full foliage decoration at every zoom level (except the
  // moment list view which has its own UI). Each zoom keeps the visual
  // density of the all-zoom view, just framed on a smaller area.
  // Decorative canopy at year tips renders at every zoom except moment
  // (moment is the list view). Keeps the visual density consistent
  // across all/year/season/month/week.
  const showLeafMass = level !== "moment";
  // Horizon line + soft ground only at all-zoom (absolute coords
  // fall outside the year+ viewBoxes).
  const showCanopyFill = level === "all";
  // Creatures (owl, cat, etc) only at all-zoom — they'd overlap tokens
  // when the user has zoomed in to read.
  const showCreatures = level === "all";
  // Year labels show category emoji is no longer needed (now in token)
  const showCatEmojiAbove = false;

  // Count memories per year for visual differentiation
  const yearCounts = new Map<number, number>();
  for (const ev of events) yearCounts.set(ev.year, (yearCounts.get(ev.year) ?? 0) + 1);
  const trunkColor = "#3A2E22";
  const trunkDark = "#15110D";
  const dominant = ALL_SEASON_TINTS[season] || ALL_SEASON_TINTS.spring;
  const minorTint = season === "winter" ? "#7B7969" : season === "autumn" ? "#9C5B2F" : "#5E8F4A";

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", transition: "all 950ms cubic-bezier(0.65, 0, 0.35, 1)" }}
    >
      <defs>
        <linearGradient id="trunkGradV3" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#0C0A08" />
          <stop offset="22%" stopColor="#1A1612" />
          <stop offset="60%" stopColor="#2C2620" />
          <stop offset="100%" stopColor="#3A332C" />
        </linearGradient>
        <linearGradient id="trunkShadeV3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="35%" stopColor="rgba(0,0,0,0.05)" />
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="80%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="rgba(255,235,200,0.15)" />
        </linearGradient>
        <radialGradient id="groundShadowV3" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(15,10,5,0.5)" />
          <stop offset="100%" stopColor="rgba(15,10,5,0)" />
        </radialGradient>
        <radialGradient id="canopyHaloV3" cx="50%" cy="40%">
          <stop offset="0%" stopColor={dominant[0]} stopOpacity="0.4" />
          <stop offset="60%" stopColor={dominant[0]} stopOpacity="0.06" />
          <stop offset="100%" stopColor={dominant[0]} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="leafCloudV3a" cx="50%" cy="50%">
          <stop offset="0%" stopColor={dominant[0]} stopOpacity="0.85" />
          <stop offset="60%" stopColor={dominant[1]} stopOpacity="0.55" />
          <stop offset="100%" stopColor={dominant[1]} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="leafCloudV3b" cx="50%" cy="50%">
          <stop offset="0%" stopColor={dominant[2]} stopOpacity="0.7" />
          <stop offset="100%" stopColor={dominant[2]} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="leafCloudMix" cx="50%" cy="50%">
          <stop offset="0%" stopColor={dominant[1]} stopOpacity="0.7" />
          <stop offset="60%" stopColor={dominant[3] || dominant[0]} stopOpacity="0.4" />
          <stop offset="100%" stopColor={dominant[1]} stopOpacity="0" />
        </radialGradient>
        <filter id="branchSoftV3">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <filter id="leafBlurV3">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <ellipse cx={TRUNK_X} cy={GROUND_Y + 40} rx="500" ry="60" fill="url(#groundShadowV3)" />

      {/* Simple horizon line at ground */}
      {showCanopyFill && (
        <path
          d={`M 60 ${GROUND_Y + 6} Q 500 ${GROUND_Y + 2}, 940 ${GROUND_Y + 6}`}
          stroke="#6B5740"
          strokeWidth="1.2"
          fill="none"
          opacity="0.28"
        />
      )}

      {/* Roots — 12 epic-scale tapered roots emerging from the
           flared trunk base. Base widths 35-70 (5× the previous
           7-14) so the trunk-to-root transition reads as a settled
           ancient tree, tapering aggressively to thin tips via
           strong taperRatio (0.65) and 5-7 segments. */}
      <g pointerEvents="none">
        {(() => {
          // 12 roots — base widths 5× the prior implementation
          // (was 7-14, now 36-72). Asymmetric horizontal distribution.
          const ROOTS = [
            { dx: -500, dy: 80, w: 70, segs: 7 },
            { dx: -400, dy: 100, w: 60, segs: 6 },
            { dx: -300, dy: 120, w: 52, segs: 6 },
            { dx: -200, dy: 138, w: 44, segs: 6 },
            { dx: -110, dy: 152, w: 38, segs: 5 },
            { dx: -45, dy: 168, w: 36, segs: 5 },
            { dx: 45, dy: 168, w: 36, segs: 5 },
            { dx: 110, dy: 152, w: 38, segs: 5 },
            { dx: 200, dy: 138, w: 44, segs: 6 },
            { dx: 300, dy: 120, w: 52, segs: 6 },
            { dx: 400, dy: 100, w: 60, segs: 6 },
            { dx: 500, dy: 80, w: 70, segs: 7 },
          ];
          return ROOTS.map((r, i) => {
            // Roots now START from inside the flared trunk base
            const startX = TRUNK_X;
            const startY = GROUND_Y - 8;
            const endX = TRUNK_X + r.dx;
            const endY = GROUND_Y + r.dy;
            // Asymmetric control points — different curvature per root
            const sideMul = r.dx >= 0 ? 1 : -1;
            const cp1x = TRUNK_X + r.dx * (0.25 + (i % 3) * 0.06);
            const cp1y = GROUND_Y - 4 + (i % 4) * 3;
            const cp2x = TRUNK_X + r.dx * (0.65 + (i % 3) * 0.05);
            const cp2y = GROUND_Y + r.dy * (0.4 + (i % 3) * 0.06);
            const rng = seedRand(i * 919 + 13);
            // Sample (segs+1) points along the cubic Bezier
            const rawPoints = Array.from({ length: r.segs + 1 }).map((_, k) => {
              const t = k / r.segs;
              const u = 1 - t;
              return {
                x:
                  u * u * u * startX +
                  3 * u * u * t * cp1x +
                  3 * u * t * t * cp2x +
                  t * t * t * endX,
                y:
                  u * u * u * startY +
                  3 * u * u * t * cp1y +
                  3 * u * t * t * cp2y +
                  t * t * t * endY,
              };
            });
            // Perpendicular jitter at interior points → organic wander
            const points = rawPoints.map((pt, k) => {
              if (k === 0 || k === rawPoints.length - 1) return pt;
              const prev = rawPoints[k - 1];
              const next = rawPoints[k + 1];
              const dx = next.x - prev.x;
              const dy = next.y - prev.y;
              const len = Math.hypot(dx, dy) || 1;
              const perpX = -dy / len;
              const perpY = dx / len;
              const offset = (rng() - 0.5) * 14;
              return { x: r1(pt.x + perpX * offset), y: r1(pt.y + perpY * offset) };
            });
            // Bifurcation — 1 random interior junction spawns an extra
            // smaller root branching off
            const bifurcK = 1 + Math.floor(rng() * (r.segs - 1));
            const bifurcChance = rng();
            const j = points[bifurcK];
            // Direction for bifurcation: down-and-out
            const bAngle = sideMul * 0.25 + (rng() - 0.5) * 0.4;
            const bSegs = 2 + Math.floor(rng() * 2);
            const bSegLen = 22 + rng() * 12;
            const bPoints = Array.from({ length: bSegs + 1 }).map((_, kk) => {
              const cum = Array.from({ length: kk }).reduce<number>(
                (acc, _, ji) => acc + bSegLen * Math.pow(0.8, ji),
                0,
              );
              const a = bAngle + (kk > 0 ? (rng() - 0.5) * 0.3 : 0);
              return {
                x: r1(j.x + Math.cos(a) * cum * sideMul),
                y: r1(j.y + Math.abs(Math.sin(a)) * cum + Math.abs(cum * 0.3)),
              };
            });
            return (
              <g key={`root-${i}`}>
                <TaperedBranch
                  points={points}
                  baseWidth={r.w}
                  taperRatio={0.65}
                  color="#3A2E22"
                  shadow
                  highlight
                />
                {bifurcChance > 0.2 && (
                  <TaperedBranch
                    points={bPoints}
                    baseWidth={r.w * 0.5}
                    taperRatio={0.65}
                    color="#3A2E22"
                    shadow={false}
                    highlight={false}
                  />
                )}
              </g>
            );
          });
        })()}
      </g>

      <OrganicTrunk />

      {/* Decorative Y-branches — 18 extra year-style branches
           sprouting from the trunk between actual year branches.
           Each branch matches year-branch SIZE (not smaller filler).
           No year pill — pure visual filler so the trunk feels like
           a real tree with branches everywhere. Interleave LEFT and
           RIGHT so neither side feels empty. */}
      {showCanopyFill && (
        <g pointerEvents="none">
          {Array.from({ length: 18 }).map((_, di) => {
            const rng = seedRand(di * 727 + 31);
            // Distribute decorative branches along the trunk vertically:
            // 9 per side, alternating L/R, spanning roughly y=200..2150.
            const sideMul: 1 | -1 = di % 2 === 0 ? -1 : 1;
            const slot = Math.floor(di / 2); // 0..8
            const yPos = 220 + slot * 215 + (di % 2) * 105 + rng() * 35;
            const startX = TRUNK_X + sideMul * 14;
            // Polar angle convention: 0 = right, π/2 = up, π = left.
            // Tilt above horizontal: 45–75°.
            const tilt = Math.PI / 4 + rng() * 0.55;
            const angle = sideMul === 1 ? tilt : Math.PI - tilt;
            const segs = 5 + Math.floor(rng() * 2); // 5-6 segments
            const baseSegLen = 50 + rng() * 28;
            // Walk segment-by-segment with kink at each junction.
            // FIRST kink bends UPWARD (toward π/2) per design rule;
            // subsequent kinks alternate sign for zigzag.
            const points: Array<{ x: number; y: number }> = [
              { x: r1(startX), y: r1(yPos) },
            ];
            let dx = startX;
            let dy = yPos;
            let dAng = angle;
            let lastSign = 0;
            for (let k = 0; k < segs; k++) {
              const segLen = baseSegLen * Math.pow(0.84, k);
              let sign: 1 | -1;
              if (k === 0) {
                // First kink: rotate toward up (π/2).
                sign = dAng < Math.PI / 2 ? 1 : -1;
              } else {
                // Zigzag: usually flip sign, sometimes hold.
                const flip = rng() > 0.25;
                sign = (flip ? -lastSign : lastSign) as 1 | -1;
              }
              const kinkMag = 0.35 + rng() * 0.4;
              dAng += sign * kinkMag;
              lastSign = sign;
              dx += Math.cos(dAng) * segLen;
              dy -= Math.sin(dAng) * segLen;
              points.push({ x: r1(dx), y: r1(dy) });
            }
            // 2 leaves per segment + 1 flower per segment for fullness
            const leaves: Array<{ x: number; y: number; rot: number }> = [];
            const flowers: Array<{ x: number; y: number }> = [];
            for (let k = 0; k < points.length - 1; k++) {
              const p1 = points[k];
              const p2 = points[k + 1];
              const lx = r1((p1.x + p2.x) / 2);
              const ly = r1((p1.y + p2.y) / 2);
              const sdy = p2.y - p1.y;
              const sdx = p2.x - p1.x;
              const len = Math.hypot(sdx, sdy) || 1;
              // Two leaves per segment, opposite sides
              for (const sf of [1, -1] as const) {
                leaves.push({
                  x: r1(lx + (-sdy / len) * sf * 8),
                  y: r1(ly + (sdx / len) * sf * 8),
                  rot: r1(((Math.atan2(-sdy, sdx) + sf * 0.5) * 180) / Math.PI - 90),
                });
              }
              // One flower at end of every other segment
              if (k % 2 === 0) {
                flowers.push({ x: r1(p2.x), y: r1(p2.y) });
              }
            }
            const palette = ["#E8826B", "#F2C5D1", "#9FC5BD", "#C8E07A"];
            return (
              <g key={`deco-${di}`}>
                <TaperedBranch
                  points={points}
                  baseWidth={22 + rng() * 6}
                  taperRatio={0.76}
                  color="#3A2E22"
                  shadow
                  highlight
                />
                {leaves.map((l, li) => (
                  <ellipse
                    key={`d-leaf-${di}-${li}`}
                    cx={l.x}
                    cy={l.y}
                    rx="3.6"
                    ry="6.2"
                    fill={li % 2 === 0 ? "#7FA847" : "#9FC580"}
                    opacity="0.92"
                    transform={`rotate(${l.rot} ${l.x} ${l.y})`}
                  />
                ))}
                {/* 5-petal flowers at every other segment end */}
                {flowers.map((f, fi) => {
                  const c1 = palette[(di + fi) % palette.length];
                  return (
                    <g key={`d-flw-${di}-${fi}`} transform={`translate(${f.x} ${f.y})`}>
                      {[0, 72, 144, 216, 288].map((deg) => (
                        <ellipse
                          key={deg}
                          cx="0"
                          cy="-3.2"
                          rx="2"
                          ry="3.2"
                          fill={c1}
                          opacity="0.92"
                          transform={`rotate(${deg})`}
                        />
                      ))}
                      <circle r="1.5" fill="#F4D060" />
                    </g>
                  );
                })}
                {/* Bud at tip */}
                <circle
                  cx={r1(points[points.length - 1].x)}
                  cy={r1(points[points.length - 1].y)}
                  r="3.2"
                  fill={di % 2 === 0 ? "#E8826B" : "#F2C5D1"}
                  opacity="0.92"
                />
              </g>
            );
          })}
        </g>
      )}

      <g>
        <path
          d="M 500 110 C 498 90, 502 70, 500 40"
          stroke={trunkColor}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 500 110 C 460 90, 380 50, 280 25"
          stroke={trunkColor}
          strokeWidth="11"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 500 110 C 540 90, 620 50, 720 25"
          stroke={trunkColor}
          strokeWidth="11"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 500 110 C 470 95, 420 80, 350 80"
          stroke={trunkColor}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 500 110 C 530 95, 580 80, 650 80"
          stroke={trunkColor}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Removed canopy halo + leaf-mass clouds for cleaner Nordic backdrop */}

      {YEARS.map((year) => {
        const tip = yearTip(year);
        const path = yearPath(year);
        const isFocused = focus.year === year;
        const dimmed = focus.year && focus.year !== year && level !== "all";
        // At year+ zoom levels, completely skip rendering non-focus years
        // to prevent ghosting / overlap with focused branch
        if (dimmed && (level === "season" || level === "month" || level === "week")) {
          return null;
        }
        const yearOpacity = dimmed ? 0.16 : 1;
        const memCount = yearCounts.get(year) ?? 0;
        // Older years (lower on trunk) thicker, newer years thinner.
        const ageBoost = (2026 - year) * 0.7;
        const branchBaseWidth =
          16 + ageBoost + Math.min(8, Math.sqrt(memCount) * 1.2);
        const branchColor = "#3A2E22";

        return (
          <g
            key={year}
            opacity={yearOpacity}
            className="tree-year-branch"
            style={{
              transition: "opacity 600ms ease",
              cursor: onSelectYear ? "pointer" : "default",
            }}
            onClick={() => onSelectYear?.(year)}
          >
            {/* Hover glow accent layer (drawn first, behind branch) */}
            <path
              d={path}
              stroke="var(--accent)"
              strokeWidth={branchBaseWidth + 8}
              fill="none"
              strokeLinecap="round"
              className="tree-year-glow"
              opacity={isFocused ? 0.32 : 0}
              style={{ transition: "opacity 240ms ease", filter: "blur(2px)" }}
            />
            {/* Year branch — 5-7 tapered segments with organic
                 per-point jitter (not a straight chain) + 1-2 knot
                 bifurcations spawning small sub-branches at random
                 directions. */}
            {(() => {
              const N_SEG = 5 + (memCount % 3); // 5-7 segments
              const baseRng = seedRand(year * 419 + 11);
              const rawPoints = Array.from({ length: N_SEG + 1 }).map((_, i) =>
                yearPointAt(year, i / N_SEG),
              );
              // Apply perpendicular jitter to interior points so each
              // segment has its own kink direction.
              const yearPoints = rawPoints.map((pt, i) => {
                if (i === 0 || i === rawPoints.length - 1) return pt;
                const prev = rawPoints[i - 1];
                const next = rawPoints[i + 1];
                const dx = next.x - prev.x;
                const dy = next.y - prev.y;
                const len = Math.hypot(dx, dy) || 1;
                const perpX = -dy / len;
                const perpY = dx / len;
                const offset = (baseRng() - 0.5) * 18;
                return { x: r1(pt.x + perpX * offset), y: r1(pt.y + perpY * offset) };
              });
              // Bifurcation indices — 1-2 random interior junctions
              // get an extra sub-branch perpendicular.
              const bifurc: number[] = [];
              for (let k = 1; k < N_SEG; k++) {
                if (baseRng() < 0.8) bifurc.push(k);
              }
              return (
                <>
                  <TaperedBranch
                    points={yearPoints}
                    baseWidth={branchBaseWidth}
                    taperRatio={0.78}
                    color={branchColor}
                    shadow
                    highlight
                  />
                  {/* Knot bifurcations — extra branches off junctions */}
                  {bifurc.map((idx) => {
                    const j = yearPoints[idx];
                    const prev = yearPoints[idx - 1];
                    const dx = j.x - prev.x;
                    const dy = j.y - prev.y;
                    const parentAngle = Math.atan2(-dy, dx);
                    // 2-3 segments perpendicular to parent at this junction
                    const sideMul = baseRng() < 0.5 ? 1 : -1;
                    const angle = parentAngle + sideMul * (Math.PI / 2 + (baseRng() - 0.5) * 0.6);
                    const segs = 2 + Math.floor(baseRng() * 2); // 2-3
                    const baseSegLen = 14 + baseRng() * 10;
                    // Segment-by-segment walk with per-junction kink.
                    // FIRST kink bends UPWARD (toward π/2); subsequent
                    // kinks zigzag with alternating sign.
                    const subPoints: Array<{ x: number; y: number }> = [
                      { x: r1(j.x), y: r1(j.y) },
                    ];
                    let bx = j.x;
                    let by = j.y;
                    let bAng = angle;
                    let bLastSign: 1 | -1 = 1;
                    for (let k = 0; k < segs; k++) {
                      const segLen = baseSegLen * Math.pow(0.82, k);
                      let sign: 1 | -1;
                      if (k === 0) {
                        sign = bAng < Math.PI / 2 ? 1 : -1;
                      } else {
                        const flip = baseRng() > 0.3;
                        sign = (flip ? -bLastSign : bLastSign) as 1 | -1;
                      }
                      const kinkMag = 0.35 + baseRng() * 0.4;
                      bAng += sign * kinkMag;
                      bLastSign = sign;
                      bx += Math.cos(bAng) * segLen;
                      by -= Math.sin(bAng) * segLen;
                      subPoints.push({ x: r1(bx), y: r1(by) });
                    }
                    const subWidth =
                      branchBaseWidth * Math.pow(0.78, idx) * 0.6;
                    // Leaves on every segment of this bifurcation
                    const subLeaves: Array<{ x: number; y: number; rot: number; color: string }> = [];
                    for (let k = 0; k < subPoints.length - 1; k++) {
                      const p1 = subPoints[k];
                      const p2 = subPoints[k + 1];
                      const lx = r1((p1.x + p2.x) / 2);
                      const ly = r1((p1.y + p2.y) / 2);
                      const sdx = p2.x - p1.x;
                      const sdy = p2.y - p1.y;
                      const slen = Math.hypot(sdx, sdy) || 1;
                      const sf = k % 2 === 0 ? 1 : -1;
                      subLeaves.push({
                        x: r1(lx + (-sdy / slen) * sf * 4),
                        y: r1(ly + (sdx / slen) * sf * 4),
                        rot: r1(((Math.atan2(-sdy, sdx) + sf * 0.5) * 180) / Math.PI - 90),
                        color: k % 2 === 0 ? "#7FA847" : "#9FC580",
                      });
                    }
                    return (
                      <g key={`bif-${idx}`}>
                        <TaperedBranch
                          points={subPoints}
                          baseWidth={subWidth}
                          taperRatio={0.74}
                          color={branchColor}
                          shadow={false}
                          highlight={false}
                        />
                        {subLeaves.map((l, li) => (
                          <ellipse
                            key={`bif-leaf-${idx}-${li}`}
                            cx={l.x}
                            cy={l.y}
                            rx="1.8"
                            ry="3.2"
                            fill={l.color}
                            opacity="0.9"
                            transform={`rotate(${l.rot} ${l.x} ${l.y})`}
                          />
                        ))}
                        <circle
                          cx={r1(subPoints[subPoints.length - 1].x)}
                          cy={r1(subPoints[subPoints.length - 1].y)}
                          r="1.8"
                          fill={idx % 2 === 0 ? "#E8826B" : "#F2C5D1"}
                          opacity="0.9"
                        />
                      </g>
                    );
                  })}
                </>
              );
            })()}

            {showLeafMass && (
              <>
                {/* ── M (Mevsim) branches — multi-segment tapered
                     twigs with RANDOM directions (not all parallel)
                     and leaves attached on every segment. Each twig
                     fans away from the year curve at its own angle. */}
                {(() => {
                  // 4-5 segments per twig (was 2-3) so the chain reads
                  // as a real branch with proper kinks.
                  const seasons = [
                    { t: 0.18, side: 1, segs: 5 },
                    { t: 0.32, side: -1, segs: 4 },
                    { t: 0.46, side: 1, segs: 5 },
                    { t: 0.6, side: -1, segs: 4 },
                    { t: 0.74, side: 1, segs: 4 },
                    { t: 0.88, side: -1, segs: 4 },
                  ];
                  const yearRng = seedRand(year * 211 + 7);
                  return seasons.map((s, si) => {
                    const pt = yearPointAt(year, s.t);
                    // Mevsim twigs always start aimed UPWARD (sky-bias).
                    // s.side determines whether the twig sits slightly
                    // left or right of straight-up so the year curve
                    // sprouts in both directions.
                    const angle =
                      Math.PI / 2 +
                      s.side * (0.25 + (yearRng() - 0.5) * 0.4) +
                      (yearRng() - 0.5) * 0.3;
                    const baseSegLen = 14 + yearRng() * 10;
                    // FIRST kink bends UPWARD (toward π/2); subsequent
                    // kinks zigzag with alternating sign.
                    const points: Array<{ x: number; y: number }> = [
                      { x: r1(pt.x), y: r1(pt.y) },
                    ];
                    let cx = pt.x;
                    let cy = pt.y;
                    let cAng = angle;
                    let lastSign: 1 | -1 = 1;
                    for (let i = 0; i < s.segs; i++) {
                      const segLen = baseSegLen * Math.pow(0.82, i);
                      let sign: 1 | -1;
                      if (i === 0) {
                        // First kink → rotate toward up.
                        sign = cAng < Math.PI / 2 ? 1 : -1;
                      } else {
                        const flip = yearRng() > 0.25;
                        sign = (flip ? -lastSign : lastSign) as 1 | -1;
                      }
                      const kinkMag = 0.45 + yearRng() * 0.45;
                      cAng = cAng + sign * kinkMag;
                      lastSign = sign;
                      cx += Math.cos(cAng) * segLen;
                      cy -= Math.sin(cAng) * segLen;
                      points.push({ x: r1(cx), y: r1(cy) });
                    }
                    const baseW =
                      branchBaseWidth * (s.side > 0 ? 0.32 : 0.28);
                    // Leaves along each segment
                    const leaves: Array<{ ax: number; ay: number; rot: number; color: string }> = [];
                    for (let i = 0; i < points.length - 1; i++) {
                      const p1 = points[i];
                      const p2 = points[i + 1];
                      const lt = 0.5;
                      const lx = r1(p1.x + (p2.x - p1.x) * lt);
                      const ly = r1(p1.y + (p2.y - p1.y) * lt);
                      const dx = p2.x - p1.x;
                      const dy = p2.y - p1.y;
                      const len = Math.hypot(dx, dy) || 1;
                      const sideFlip = i % 2 === 0 ? 1 : -1;
                      const perpX = (-dy / len) * sideFlip;
                      const perpY = (dx / len) * sideFlip;
                      const ax = r1(lx + perpX * 4.5);
                      const ay = r1(ly + perpY * 4.5);
                      const segAngle = Math.atan2(-dy, dx);
                      leaves.push({
                        ax,
                        ay,
                        rot: r1(((segAngle + sideFlip * 0.5) * 180) / Math.PI - 90),
                        color: si % 2 === 0 ? "#7FA847" : "#9FC580",
                      });
                    }
                    return (
                      <g key={`m-${si}`}>
                        <TaperedBranch
                          points={points}
                          baseWidth={baseW}
                          taperRatio={0.74}
                          color={branchColor}
                          shadow={false}
                          highlight={false}
                        />
                        {/* Leaves on every segment */}
                        {leaves.map((l, li) => (
                          <ellipse
                            key={`m-leaf-${si}-${li}`}
                            cx={l.ax}
                            cy={l.ay}
                            rx="2"
                            ry="3.4"
                            fill={l.color}
                            opacity="0.9"
                            transform={`rotate(${l.rot} ${l.ax} ${l.ay})`}
                          />
                        ))}
                        {/* Bud at tip */}
                        <circle
                          cx={r1(points[points.length - 1].x)}
                          cy={r1(points[points.length - 1].y)}
                          r="2"
                          fill={si % 2 === 0 ? "#E8826B" : "#F2C5D1"}
                          opacity="0.9"
                        />
                      </g>
                    );
                  });
                })()}
                {/* ── Mid-canopy bursts (kat 3): 2 deeper canopies at
                     prominent points along year curve. ── */}
                {[0.4, 0.7].map((t, mi) => {
                  const pt = yearPointAt(year, t);
                  const angle =
                    Math.PI / 2 + tip.side * (0.14 + mi * 0.06);
                  return (
                    <Canopy
                      key={`mid-${mi}`}
                      year={year + mi * 17}
                      rootX={r1(pt.x)}
                      rootY={r1(pt.y)}
                      baseAngle={angle}
                      memCount={Math.max(2, memCount - 4)}
                      stemColor={branchColor}
                      depth={1}
                      scale={0.55 + mi * 0.08}
                    />
                  );
                })}
                {/* ── Tip canopy: full depth, the biggest cluster ── */}
                <Canopy
                  year={year}
                  rootX={tip.x}
                  rootY={tip.y}
                  baseAngle={Math.PI / 2 + tip.side * 0.18}
                  memCount={memCount}
                  stemColor={branchColor}
                  depth={2}
                />
              </>
            )}

            {(level === "all" || level === "year") && (
              <g
                transform={`translate(${tip.x + tip.side * 24} ${tip.y - 70})`}
                style={{ cursor: onSelectYear ? "pointer" : "default" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectYear?.(year);
                }}
              >
                {/* Tap-target pill background — visible affordance */}
                <rect
                  x={tip.side > 0 ? -8 : -148}
                  y="-44"
                  width="156"
                  height="56"
                  rx="28"
                  fill={isFocused ? "#1F1B16" : "rgba(251,246,234,0.92)"}
                  stroke={isFocused ? "#C66E3D" : "#2C2620"}
                  strokeWidth={isFocused ? 1.8 : 1.2}
                  opacity={isFocused ? 1 : 0.96}
                  style={{ filter: "drop-shadow(0 2px 6px rgba(15,17,13,0.12))" }}
                />
                <text
                  x={tip.side > 0 ? 16 : -136}
                  y="-2"
                  fontFamily="Cormorant Garamond, Georgia, serif"
                  fontSize="38"
                  fill={isFocused ? "#FBF6EA" : "#1F1B16"}
                  textAnchor="start"
                  fontWeight="500"
                  letterSpacing="-1"
                >
                  {year}
                </text>
                {memCount > 0 && (
                  <g transform={`translate(${tip.side > 0 ? 110 : -30} -16)`}>
                    <circle
                      r="14"
                      fill={isFocused ? "#C66E3D" : "#1F1B16"}
                    />
                    <text
                      y="4"
                      textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                      fontSize="11"
                      fontWeight="600"
                      fill="#FBF6EA"
                      letterSpacing="0.4"
                    >
                      {memCount}
                    </text>
                  </g>
                )}
                {/* Tap arrow hint */}
                {onSelectYear && !isFocused && (
                  <text
                    x={tip.side > 0 ? 138 : -10}
                    y="-2"
                    textAnchor="middle"
                    fontFamily="Inter, sans-serif"
                    fontSize="14"
                    fontWeight="600"
                    fill="#2C2620"
                    opacity="0.55"
                  >
                    ›
                  </text>
                )}
              </g>
            )}

            {SEASON_ORDER.map((seasonId) => {
              const sPath = seasonPath(year, seasonId);
              const sFocused = focus.year === year && focus.season === seasonId;
              const sDimmed =
                focus.season &&
                focus.season !== seasonId &&
                level !== "all" &&
                level !== "year";
              const sOpacity = (sDimmed ? 0.2 : 1) * seasonAlpha;
              return (
                <g
                  key={seasonId}
                  opacity={sOpacity}
                  style={{
                    transition: "opacity 500ms ease",
                    cursor: onSelectSeason ? "pointer" : "default",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSeason?.(year, seasonId);
                  }}
                >
                  <path
                    d={sPath}
                    stroke={trunkColor}
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={sPath}
                    stroke="rgba(255,235,200,0.15)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {SEASON_MONTHS[seasonId].map((month) => {
                    const m = monthTip(year, month);
                    const mPath = monthPath(year, month);
                    const mDimmed = focus.month != null && focus.month !== month && level === "month";
                    const mOpacity = (mDimmed ? 0.2 : 1) * monthAlpha;
                    return (
                      <g
                        key={month}
                        opacity={mOpacity}
                        style={{
                          transition: "opacity 400ms ease",
                          cursor: onSelectMonth ? "pointer" : "default",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMonth?.(year, month);
                        }}
                      >
                        <path
                          d={mPath}
                          stroke={trunkColor}
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          opacity="0.95"
                        />
                        <circle cx={m.tipX} cy={m.tipY} r="2" fill={trunkColor} />
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {(() => {
              // Filter events by current focus to avoid overlap and clutter.
              const filtered = events.filter((ev) => {
                if (ev.year !== year) return false;
                if (
                  focus.season &&
                  monthSeason(ev.month) !== focus.season &&
                  (level === "season" || level === "month" || level === "week")
                ) {
                  return false;
                }
                if (
                  focus.month != null &&
                  ev.month !== focus.month &&
                  (level === "month" || level === "week")
                ) {
                  return false;
                }
                return true;
              });

              // Spread events deterministically along an arc above the year branch
              // to prevent overlap when zoomed in. At "all" zoom keep eventPos jitter.
              const useSpread = level !== "all";
              return filtered.map((ev, i) => {
                let pos = eventPos(ev);
                if (useSpread && filtered.length > 0) {
                  // Spread along year branch in a wider arc with multi-row stagger
                  const total = filtered.length;
                  // Row config: 6 events per row max, then push perpendicular further
                  const eventsPerRow = level === "year" ? 6 : 4;
                  const row = Math.floor(i / eventsPerRow);
                  const inRow = i % eventsPerRow;
                  const rowSize = Math.min(eventsPerRow, total - row * eventsPerRow);
                  // Distribute evenly within this row
                  const t = (inRow + 0.5) / rowSize;
                  const branchT = 0.18 + t * 0.78;
                  const pt = yearPointAt(year, branchT);
                  const len = Math.sqrt(pt.dx * pt.dx + pt.dy * pt.dy) || 1;
                  const nx = -pt.dy / len;
                  const ny = pt.dx / len;
                  const baseDist =
                    level === "year"
                      ? 44
                      : level === "season"
                        ? 56
                        : 70;
                  // Each subsequent row pushes further perpendicular
                  const rowDist = baseDist + row * (level === "year" ? 36 : 48);
                  // Vertical jitter within row to break linear feel
                  const jitter = inRow % 2 === 0 ? -6 : 8;
                  pos = {
                    x: pt.x + nx * rowDist * tip.side,
                    y: pt.y + ny * rowDist + jitter,
                  };
                }
                return (
                  <g key={ev.id} style={{ transition: "opacity 400ms ease" }}>
                    {level === "all" ? (
                      <FoliageBurst ev={ev} x={pos.x} y={pos.y} scale={eventScale} />
                    ) : (
                      <EventGlyph
                        ev={ev}
                        x={pos.x}
                        y={pos.y}
                        scale={eventScale}
                        onClick={onSelectEvent}
                        onPreview={onPreviewEvent}
                      />
                    )}
                    {showCatEmojiAbove && ev.cat && (
                      <text
                        x={pos.x}
                        y={pos.y - 18 * eventScale}
                        textAnchor="middle"
                        fontSize={14 * Math.min(eventScale, 1.4)}
                        style={{ pointerEvents: "none" }}
                      >
                        {ev.cat}
                      </text>
                    )}
                    {eventLabelShow && (
                      <g transform={`translate(${pos.x + tip.side * 22} ${pos.y - 6})`}>
                        <rect
                          x={tip.side > 0 ? 0 : -100}
                          y="-10"
                          width="100"
                          height="22"
                          fill="rgba(255,255,255,0.85)"
                          rx="3"
                        />
                        <text
                          fontFamily="Inter, sans-serif"
                          fontSize="9"
                          fill="#3F2D1E"
                          textAnchor={tip.side > 0 ? "start" : "end"}
                          fontWeight="500"
                          x={tip.side > 0 ? 4 : -4}
                          y="2"
                        >
                          {ev.t.length > 20 ? `${ev.t.slice(0, 18)}...` : ev.t}
                        </text>
                      </g>
                    )}
                  </g>
                );
              });
            })()}
          </g>
        );
      })}

      {showCreatures && (
        <g style={{ pointerEvents: "none", opacity: 0.7 }}>
          <Owl x={yearTip(2019).x + 20} y={yearTip(2019).y - 22} scale={1.6} />
          <TreeCat x={yearTip(2022).x + 20} y={yearTip(2022).y - 15} scale={1.5} />
          <Bird x={650} y={55} scale={1} />
          <Butterfly x={200} y={1200} scale={1.2} />
        </g>
      )}

      <g transform={`translate(${TRUNK_X} 25)`}>
        <circle r="20" fill="#D8624C" opacity="0.18">
          <animate attributeName="r" values="20;32;20" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="12" fill="#D8624C" />
        <circle r="6" fill="#fff" />
        <text
          y="-26"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          fontStyle="italic"
          fill="#3F2D1E"
          textAnchor="middle"
          opacity="0.9"
        >
          bugün
        </text>
      </g>
    </svg>
  );
}

export const TreeOfLifeKindStyle = KIND_STYLE;
export type { EventKind };
