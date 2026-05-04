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
import { DriftParticles } from "@/components/tree/DriftParticles";
import { Plant } from "@/components/tree/Plant";
import { InterYearFillers } from "@/components/tree/InterYearFillers";
import { PhantomBranches } from "@/components/tree/PhantomBranches";
import { GnarledBranch } from "@/components/tree/GnarledBranch";
import { LeafyTwig } from "@/components/tree/LeafyTwig";
import { FractalBranch } from "@/components/tree/FractalBranch";
import { RootCapillaries } from "@/components/tree/RootCapillaries";
import { RootSystem } from "@/components/tree/RootSystem";
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
  const showLeafMass = level !== "moment";
  // At month/week the viewBox is small (~220x170 / 180x140) — the
  // dense offshoot foliage starts to overlap and clutter. Drop the
  // bulky decorative offshoots in favour of just tokens + the
  // focused month-tip leaves at deep zoom.
  const showOffshoots = level === "all" || level === "year" || level === "season";
  // Inter-year fillers + drift particles only at all-zoom — they
  // depend on absolute trunk coords that fall outside year+ viewBoxes.
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

      {/* Soft horizon line — anchors the tree visually (only at all-zoom) */}
      {showCanopyFill && (
        <g aria-hidden>
          <path
            d={`M 20 ${GROUND_Y + 6} Q 250 ${GROUND_Y + 2}, 500 ${GROUND_Y + 4} T 980 ${GROUND_Y + 6}`}
            stroke="#6B5740"
            strokeWidth="1.4"
            fill="none"
            opacity="0.32"
          />
          {/* Sparse grass tufts */}
          {Array.from({ length: 22 }).map((_, i) => {
            const rng = seedRand(i * 73 + 11);
            const cx = 30 + rng() * 940;
            // Skip the area immediately around the trunk + roots
            if (Math.abs(cx - TRUNK_X) < 60) return null;
            const y0 = GROUND_Y + 4 + (rng() - 0.5) * 4;
            const len = 5 + rng() * 6;
            const lean = (rng() - 0.5) * 3;
            return (
              <g key={`grass-${i}`} opacity={0.45 + rng() * 0.25}>
                <path
                  d={`M ${cx} ${y0} Q ${cx + lean * 0.5} ${y0 - len * 0.6}, ${cx + lean} ${y0 - len}`}
                  stroke="#5E8F4A"
                  strokeWidth="0.9"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${cx + 2} ${y0} Q ${cx + 2 + lean * 0.4} ${y0 - len * 0.5}, ${cx + 2 + lean * 0.8} ${y0 - len * 0.8}`}
                  stroke="#7A9F4A"
                  strokeWidth="0.7"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>
            );
          })}
        </g>
      )}

      {/* Fine capillary roots interleaved between the main strokes */}
      <RootCapillaries />

      {/* Multi-layer root system — main + side branches + capillaries */}
      <RootSystem showGrassTufts={showCanopyFill} />

      <OrganicTrunk />
      {showCanopyFill && (
        <>
          <PhantomBranches />
          <InterYearFillers />
          <DriftParticles />
        </>
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
        // Chunky brown gnarly year branch. Now rendered as 4 distinct
        // sub-branches end-to-end (büyükten küçüğe azalan yapı), each
        // a GnarledBranch with stepping width, joined by knots.
        const branchBaseWidth = 22 + Math.min(8, Math.sqrt(memCount) * 1.2);
        const branchColor = "#3A2E22"; // bark brown
        const plantBaseLength = 36 + Math.min(28, memCount * 1.4);
        // Sub-branches per year — 4 distinct chunks end-to-end.
        const N_SUB = 4;
        // Each sub-branch is a small multi-point gnarled segment.
        const subBranches = Array.from({ length: N_SUB }).map((_, s) => {
          const t0 = s / N_SUB;
          const tMid = (s + 0.5) / N_SUB;
          const t1 = (s + 1) / N_SUB;
          return {
            s,
            t0,
            t1,
            p0: yearPointAt(year, t0),
            pMid: yearPointAt(year, tMid),
            p1: yearPointAt(year, t1),
            // Width steps down ~28% each sub-branch
            width: branchBaseWidth * Math.pow(0.72, s),
          };
        });

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
            {/* Year branch — 4 sub-branches end-to-end, each with its
                 own gnarled multi-stroke and stepping width. Junctions
                 between sub-branches sprout small side-twigs. */}
            {subBranches.map((sub) => (
              <GnarledBranch
                key={`subY-${sub.s}`}
                points={[sub.p0, sub.pMid, sub.p1]}
                baseWidth={sub.width}
                tipFraction={0.82}
                color={branchColor}
              />
            ))}
            {/* Junction Y-forks — at each junction between year
                 sub-branches, spawn THREE side-branches diverging at
                 distinct angles (above + below + diagonal-forward).
                 Each fork is itself a recursive FractalBranch so the
                 silhouette reads as a tree, not a wand with feathers. */}
            {subBranches.slice(0, -1).map((sub) => {
              const j = sub.p1;
              // Outward direction along the year curve at this point
              const ahead = sub.p1.x - sub.p0.x;
              const aheadY = sub.p1.y - sub.p0.y;
              const baseAhead = Math.atan2(-aheadY, ahead);
              // Three siblings at -60° / +20° / +90° relative to baseAhead
              // (= up-and-back, slightly-forward, down-and-back). Wider
              // angles so they don't overlap.
              const forks = [
                {
                  k: "up",
                  angle: baseAhead + 0.95,
                  lenMul: 1.0,
                  widthMul: 0.88,
                },
                {
                  k: "fwd",
                  angle: baseAhead + 0.32 * tip.side,
                  lenMul: 0.85,
                  widthMul: 0.78,
                },
                {
                  k: "dn",
                  angle: baseAhead - 0.95,
                  lenMul: 0.92,
                  widthMul: 0.82,
                },
              ];
              const palette = ["#E8826B", "#F2C5D1", "#C8E07A", "#9FC5BD"];
              return (
                <g key={`jFork-${sub.s}`}>
                  {forks.map((f, fi) => {
                    const len = 56 * f.lenMul + (sub.s % 2) * 8;
                    const w = sub.width * f.widthMul;
                    const tx = r1(j.x + Math.cos(f.angle) * len);
                    const ty = r1(j.y - Math.sin(f.angle) * len);
                    // Slight midpoint kink for organic feel
                    const midX = r1(
                      j.x + Math.cos(f.angle) * len * 0.55 + (fi === 1 ? 0 : tip.side * 4),
                    );
                    const midY = r1(j.y - Math.sin(f.angle) * len * 0.55);
                    const berryC = palette[(year + sub.s + fi) % palette.length];
                    return (
                      <g key={`${f.k}-${fi}`}>
                        {/* Y-fork stem from junction outward */}
                        <GnarledBranch
                          points={[
                            { x: j.x, y: j.y },
                            { x: midX, y: midY },
                            { x: tx, y: ty },
                          ]}
                          baseWidth={w}
                          tipFraction={0.72}
                          color={branchColor}
                        />
                        {/* Recursive fractal canopy at this fork's tip */}
                        {showLeafMass && (
                          <FractalBranch
                            rootX={tx}
                            rootY={ty}
                            baseAngle={f.angle}
                            baseLength={28 * f.lenMul}
                            baseWidth={w * 0.72}
                            depth={3}
                            forkAngle={0.6}
                            lengthShrink={0.7}
                            widthShrink={0.72}
                            branchFactor={2}
                            seed={year * 47 + sub.s * 13 + fi * 7}
                            color={branchColor}
                            budTips
                            budPalette={[berryC, "#F2C5D1"]}
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {showLeafMass && (
              <>
                {showOffshoots && (
                  <>
                {/* ── Above-branch offshoots — multi-segment gnarled
                     twigs with realistic leafy stems at the tip ── */}
                {[0.18, 0.32, 0.46, 0.6, 0.74, 0.86].map((t, oi) => {
                  const pt = yearPointAt(year, t);
                  const angle = Math.PI / 2 + tip.side * 0.25;
                  const len = 30 + (oi % 2) * 10;
                  // Multi-segment: kink at midpoint for organic look
                  const midKink = (oi % 2 === 0 ? -1 : 1) * 4;
                  const midX = r1(pt.x + Math.cos(angle) * len * 0.55 + midKink);
                  const midY = r1(pt.y - Math.sin(angle) * len * 0.55);
                  const tx = r1(pt.x + Math.cos(angle) * len);
                  const ty = r1(pt.y - Math.sin(angle) * len);
                  const palette = ["#E8826B", "#F2C5D1", "#C8E07A", "#9FC5BD"];
                  const berryC = palette[(year + oi) % palette.length];
                  return (
                    <g key={`above-${oi}`}>
                      <GnarledBranch
                        points={[
                          { x: pt.x, y: pt.y },
                          { x: midX, y: midY },
                          { x: tx, y: ty },
                        ]}
                        baseWidth={4.5}
                        tipFraction={0.45}
                        color={branchColor}
                      />
                      <LeafyTwig
                        x={tx}
                        y={ty}
                        angle={angle}
                        length={20}
                        seed={year * 19 + oi * 7}
                        nLeaves={4}
                        berryColor={berryC}
                      />
                    </g>
                  );
                })}
                {/* ── Below-branch offshoots — drooping multi-segment ── */}
                {[0.25, 0.42, 0.58, 0.72, 0.84].map((t, oi) => {
                  const pt = yearPointAt(year, t);
                  const angle = -Math.PI / 2 + tip.side * 0.18;
                  const len = 24 + (oi % 2) * 12;
                  const midKink = (oi % 2 === 0 ? 1 : -1) * 5;
                  const midX = r1(pt.x + Math.cos(angle) * len * 0.5 + midKink);
                  const midY = r1(pt.y - Math.sin(angle) * len * 0.5);
                  const tx = r1(pt.x + Math.cos(angle) * len);
                  const ty = r1(pt.y - Math.sin(angle) * len);
                  const palette = ["#E8826B", "#F2C5D1", "#C8E07A", "#9FC5BD"];
                  const berryC = palette[(year + oi + 1) % palette.length];
                  return (
                    <g key={`below-${oi}`}>
                      <GnarledBranch
                        points={[
                          { x: pt.x, y: pt.y },
                          { x: midX, y: midY },
                          { x: tx, y: ty },
                        ]}
                        baseWidth={3.8}
                        tipFraction={0.45}
                        color={branchColor}
                      />
                      <LeafyTwig
                        x={tx}
                        y={ty}
                        angle={angle}
                        length={16}
                        seed={year * 23 + oi * 11 + 41}
                        nLeaves={3}
                        berryColor={berryC}
                      />
                    </g>
                  );
                })}
                  </>
                )}

                {/* ── Fractal canopy at year tip — recursive bark
                     subdivision (3 levels). Mirrors the reference
                     image's branchy silhouette. ── */}
                <FractalBranch
                  rootX={tip.x}
                  rootY={tip.y}
                  baseAngle={Math.PI / 2 + tip.side * 0.18}
                  baseLength={plantBaseLength * 0.85}
                  baseWidth={subBranches[N_SUB - 1].width * 0.7}
                  depth={3}
                  forkAngle={0.5}
                  lengthShrink={0.66}
                  widthShrink={0.6}
                  branchFactor={3}
                  seed={year * 7 + 19}
                  color={branchColor}
                  budTips
                />
                {/* ── Tip plant — delicate green stems + flowers
                     overlay the fractal canopy ── */}
                <Plant
                  year={year}
                  rootX={tip.x}
                  rootY={tip.y}
                  baseAngle={Math.PI / 2 + tip.side * 0.18}
                  baseLength={plantBaseLength}
                  depth={3}
                  forkAngle={0.45}
                  lengthShrink={0.68}
                  widthShrink={0.78}
                  stemColor="#6B8054"
                  budScale={1.1}
                />
                {/* ── Above mid-plants ── */}
                {(() => {
                  const mid = yearPointAt(year, 0.7);
                  return (
                    <Plant
                      year={year}
                      rootX={r1(mid.x)}
                      rootY={r1(mid.y)}
                      baseAngle={Math.PI / 2 + tip.side * 0.32}
                      baseLength={plantBaseLength * 0.6}
                      depth={3}
                      forkAngle={0.5}
                      lengthShrink={0.66}
                      widthShrink={0.78}
                      stemColor="#6B8054"
                      budScale={0.85}
                      seed={year * 211 + 5}
                    />
                  );
                })()}
                {(() => {
                  const mid = yearPointAt(year, 0.4);
                  return (
                    <Plant
                      year={year}
                      rootX={r1(mid.x)}
                      rootY={r1(mid.y)}
                      baseAngle={Math.PI / 2 + tip.side * 0.45}
                      baseLength={plantBaseLength * 0.5}
                      depth={3}
                      forkAngle={0.5}
                      lengthShrink={0.62}
                      widthShrink={0.75}
                      stemColor="#6B8054"
                      budScale={0.78}
                      seed={year * 419 + 11}
                    />
                  );
                })()}
                {/* ── Below mid-plants — hanging downward ── */}
                {(() => {
                  const mid = yearPointAt(year, 0.55);
                  return (
                    <Plant
                      year={year}
                      rootX={r1(mid.x)}
                      rootY={r1(mid.y)}
                      baseAngle={-Math.PI / 2 + tip.side * 0.22}
                      baseLength={plantBaseLength * 0.55}
                      depth={3}
                      forkAngle={0.48}
                      lengthShrink={0.65}
                      widthShrink={0.78}
                      stemColor="#6B8054"
                      budScale={0.78}
                      seed={year * 631 + 17}
                    />
                  );
                })()}
                {(() => {
                  const mid = yearPointAt(year, 0.3);
                  return (
                    <Plant
                      year={year}
                      rootX={r1(mid.x)}
                      rootY={r1(mid.y)}
                      baseAngle={-Math.PI / 2 + tip.side * 0.32}
                      baseLength={plantBaseLength * 0.42}
                      depth={2}
                      forkAngle={0.55}
                      lengthShrink={0.62}
                      widthShrink={0.75}
                      stemColor="#6B8054"
                      budScale={0.7}
                      seed={year * 829 + 23}
                    />
                  );
                })()}
              </>
            )}

            {/* ── Season + month sub-twigs — finer detail on focused
                 branch as the user zooms in. Each season gets its own
                 budak with a small Plant; at month/week zoom we add
                 even smaller leaves at sub-positions. ── */}
            {(level === "year" || level === "season" || level === "month" || level === "week") &&
              [0.22, 0.35, 0.48, 0.62, 0.76, 0.88].map((t, si) => {
                const pt = yearPointAt(year, t);
                const above = si % 2 === 0;
                const angle = (above ? Math.PI / 2 : -Math.PI / 2) + tip.side * (0.3 + (si % 3) * 0.04);
                const len = 18 + (si % 3) * 8;
                const tx = r1(pt.x + Math.cos(angle) * len);
                const ty = r1(pt.y - Math.sin(angle) * len);
                const palette = ["#E8826B", "#F2C5D1", "#C8E07A", "#9FC5BD", "#E8D9B0", "#D17A95"];
                const c1 = palette[(si + year) % palette.length];
                const c2 = palette[(si + year + 2) % palette.length];
                const c3 = palette[(si + year + 4) % palette.length];
                return (
                  <g key={`subtwig-${si}`}>
                    <line
                      x1={r1(pt.x)}
                      y1={r1(pt.y)}
                      x2={tx}
                      y2={ty}
                      stroke={branchColor}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    {/* Bud cluster at sub-twig tip */}
                    <circle cx={tx} cy={ty} r="2.8" fill={c1} opacity="0.85" />
                    <circle cx={tx + 3.5} cy={ty + 1} r="2.2" fill={c2} opacity="0.85" />
                    <circle cx={tx - 3} cy={ty - 1.5} r="2" fill={c3} opacity="0.75" />
                    {/* Small oval leaf along the twig */}
                    <ellipse
                      cx={r1((pt.x + tx) / 2)}
                      cy={r1((pt.y + ty) / 2)}
                      rx="2"
                      ry="3.6"
                      fill="#7FA847"
                      opacity="0.7"
                      transform={`rotate(${r1((angle * 180) / Math.PI - 90)} ${r1((pt.x + tx) / 2)} ${r1((pt.y + ty) / 2)})`}
                    />
                  </g>
                );
              })}

            {/* ── Month-twig leaves — extra fine foliage along each
                 month-tip when zoomed deep. ── */}
            {(level === "month" || level === "week") &&
              focus.month != null &&
              focus.year === year && (
                <g pointerEvents="none">
                  {Array.from({ length: 8 }).map((_, mi) => {
                    const mt = monthTip(year, focus.month!);
                    const ratio = 0.3 + (mi / 8) * 0.7;
                    const u = 1 - ratio;
                    const cpx = (mt.baseX + mt.tipX) / 2;
                    const cpy = (mt.baseY + mt.tipY) / 2 - 6;
                    const px = r1(
                      u * u * mt.baseX + 2 * u * ratio * cpx + ratio * ratio * mt.tipX,
                    );
                    const py = r1(
                      u * u * mt.baseY + 2 * u * ratio * cpy + ratio * ratio * mt.tipY,
                    );
                    const palette = ["#E8826B", "#F2C5D1", "#C8E07A", "#9FC5BD"];
                    const color = palette[(mi + year) % palette.length];
                    const offSide = mi % 2 === 0 ? -1 : 1;
                    return (
                      <g key={`mtw-${mi}`}>
                        <ellipse
                          cx={r1(px + offSide * 4)}
                          cy={r1(py - 3)}
                          rx="1.6"
                          ry="3"
                          fill="#7FA847"
                          opacity="0.7"
                          transform={`rotate(${offSide * 35} ${r1(px + offSide * 4)} ${r1(py - 3)})`}
                        />
                        <circle
                          cx={r1(px + offSide * 6)}
                          cy={r1(py - 5)}
                          r="1.6"
                          fill={color}
                          opacity="0.88"
                        />
                      </g>
                    );
                  })}
                </g>
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
