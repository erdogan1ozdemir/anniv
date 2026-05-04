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
import { RootCapillaries } from "@/components/tree/RootCapillaries";
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
  // Show decorative leaf scatter only at "all" zoom, hide entirely once focused
  const showLeafMass = level === "all";
  // Hide creatures once user zooms in, they overlap event glyphs
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

      {/* Soft horizon line — anchors the tree visually */}
      {showLeafMass && (
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

      {/* Roots — chunky main trunks + side branches + capillaries */}
      <g opacity="0.95">
        {[
          { dx: -440, dy: 60, w: 14, branches: 2 },
          { dx: -320, dy: 78, w: 12, branches: 2 },
          { dx: -200, dy: 90, w: 10, branches: 1 },
          { dx: -90, dy: 96, w: 7, branches: 1 },
          { dx: 90, dy: 96, w: 7, branches: 1 },
          { dx: 200, dy: 90, w: 10, branches: 1 },
          { dx: 320, dy: 78, w: 12, branches: 2 },
          { dx: 440, dy: 60, w: 14, branches: 2 },
          { dx: 0, dy: 102, w: 5, branches: 1 },
        ].map((r, i) => {
          const startX = TRUNK_X;
          const startY = GROUND_Y - 30;
          const endX = TRUNK_X + r.dx;
          const endY = GROUND_Y + r.dy;
          const cp1x = TRUNK_X + r.dx * 0.3;
          const cp1y = GROUND_Y - 5;
          const cp2x = TRUNK_X + r.dx * 0.7;
          const cp2y = GROUND_Y + r.dy * 0.5;
          const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
          const sideRng = seedRand(i * 211 + 17);
          // Branch points along the root
          const branchOffshoots = Array.from({ length: r.branches }).map(
            (_, b) => {
              // Place branch at 45-78% along root
              const t = 0.5 + b * 0.22 + sideRng() * 0.12;
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
              const offDx = (40 + sideRng() * 50) * sign;
              const offDy = 26 + sideRng() * 18;
              const tx = r1(px + offDx);
              const ty = r1(py + offDy);
              const w = Math.max(1.5, r.w * 0.42);
              return { px, py, tx, ty, w };
            },
          );
          return (
            <g key={i}>
              {/* Outer shadow */}
              <path
                d={d}
                stroke="#0C0A08"
                strokeWidth={r.w + 2}
                fill="none"
                strokeLinecap="round"
                opacity="0.45"
              />
              {/* Main root */}
              <path
                d={d}
                stroke={trunkColor}
                strokeWidth={r.w}
                fill="none"
                strokeLinecap="round"
              />
              {/* Highlight */}
              <path
                d={d}
                stroke="rgba(255,235,200,0.18)"
                strokeWidth={Math.max(1, r.w * 0.3)}
                fill="none"
                strokeLinecap="round"
                transform={`translate(0, -${Math.max(1, r.w * 0.25)})`}
              />
              {/* Side branches */}
              {branchOffshoots.map((o, b) => {
                const cpx = (o.px + o.tx) / 2 + (r.dx >= 0 ? 6 : -6);
                const cpy = (o.py + o.ty) / 2 + 4;
                const branchD = `M ${o.px} ${o.py} Q ${cpx} ${cpy}, ${o.tx} ${o.ty}`;
                return (
                  <g key={b}>
                    <path
                      d={branchD}
                      stroke={trunkColor}
                      strokeWidth={o.w}
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.92"
                    />
                    {/* Tiny capillary off the branch */}
                    <path
                      d={`M ${o.tx} ${o.ty} Q ${o.tx + (r.dx >= 0 ? 8 : -8)} ${o.ty + 8}, ${o.tx + (r.dx >= 0 ? 16 : -16)} ${o.ty + 14}`}
                      stroke={trunkColor}
                      strokeWidth={Math.max(0.8, o.w * 0.55)}
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.78"
                    />
                  </g>
                );
              })}
              {showLeafMass &&
                Array.from({ length: 3 }).map((_, j) => {
                  const gx = TRUNK_X + r.dx + (j - 1) * 6;
                  const gy = GROUND_Y + r.dy + 18;
                  return (
                    <path
                      key={j}
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

      <OrganicTrunk />
      {showLeafMass && (
        <>
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
        // Slim, delicate stem — wax-flower aesthetic. Thicker for years
        // with more memories so they still read as "denser" plants.
        const branchWidth = 2.2 + Math.min(2, Math.sqrt(memCount) * 0.4);
        const stemColor = "#6B8054"; // sage olive — visible on bone-cream
        // Length the L-system plant grows from the year branch tip.
        // Older years (low on trunk) get shorter plants, recent years longer.
        const plantBaseLength = 38 + Math.min(28, memCount * 1.4);

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
            {/* Slim year stem — replaces the carved-Nordic thick branch */}
            <path
              d={path}
              stroke={stemColor}
              strokeWidth={branchWidth}
              fill="none"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Gnarly knot bulges along the branch */}
            {[0.25, 0.55, 0.8].map((t, ki) => {
              const pt = yearPointAt(year, t);
              const knotR = branchWidth * 0.7 + (ki === 1 ? 0.4 : 0);
              return (
                <ellipse
                  key={`knot-${ki}`}
                  cx={r1(pt.x)}
                  cy={r1(pt.y)}
                  rx={knotR * 1.3}
                  ry={knotR * 0.85}
                  fill={stemColor}
                  opacity="0.92"
                />
              );
            })}
            {/* Hover glow accent layer */}
            <path
              d={path}
              stroke="var(--accent)"
              strokeWidth={branchWidth + 6}
              fill="none"
              strokeLinecap="round"
              className="tree-year-glow"
              opacity={isFocused ? 0.32 : 0}
              style={{ transition: "opacity 240ms ease", filter: "blur(2px)" }}
            />

            {showLeafMass && (
              <>
                {/* Tip plant — biggest, anchored at the year-branch tip */}
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
                {/* Mid-branch plant 1 — at 65% along the year branch */}
                {(() => {
                  const mid = yearPointAt(year, 0.65);
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
                {/* Mid-branch plant 2 — at 35% along the year branch */}
                {(() => {
                  const mid = yearPointAt(year, 0.35);
                  return (
                    <Plant
                      year={year}
                      rootX={r1(mid.x)}
                      rootY={r1(mid.y)}
                      baseAngle={Math.PI / 2 + tip.side * 0.45}
                      baseLength={plantBaseLength * 0.45}
                      depth={2}
                      forkAngle={0.55}
                      lengthShrink={0.62}
                      widthShrink={0.75}
                      stemColor="#6B8054"
                      budScale={0.7}
                      seed={year * 419 + 11}
                    />
                  );
                })()}
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
