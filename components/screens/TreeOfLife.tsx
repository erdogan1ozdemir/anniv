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

interface EventGlyphProps {
  ev: LifeEvent;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  onClick?: (ev: LifeEvent) => void;
}

// Nordic token: solid circular disk with category emoji, kind-color ring, pinned glow
function EventGlyph({ ev, x, y, scale = 1, opacity = 1, onClick }: EventGlyphProps) {
  const style = KIND_STYLE[ev.kind];
  // Pinned tokens are 25% larger to stand out at every zoom level
  const radius = (ev.pinned ? 16.5 : 13) * scale;
  const ringColor = ev.pinned ? "#C66E3D" : style.color;
  const handle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClick?.(ev);
  };
  return (
    <g
      style={{
        cursor: onClick ? "pointer" : "default",
        opacity,
        transition: "opacity 240ms, transform 240ms",
      }}
      onClick={handle as React.MouseEventHandler}
    >
      {ev.pinned && (
        <>
          {/* Outer pulsing halo for important events */}
          <circle cx={x} cy={y} r={radius + 10} fill="#C66E3D" opacity="0.14">
            <animate
              attributeName="r"
              values={`${radius + 8};${radius + 18};${radius + 8}`}
              dur="2.6s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.22;0;0.22" dur="2.6s" repeatCount="indefinite" />
          </circle>
          {/* Static ochre frame */}
          <circle
            cx={x}
            cy={y}
            r={radius + 4}
            fill="none"
            stroke="#C66E3D"
            strokeWidth={2 * scale}
            opacity="0.9"
          />
        </>
      )}
      {/* Drop shadow base */}
      <circle cx={x} cy={y + radius * 0.18} r={radius} fill="#1F1B16" opacity="0.18" />
      {/* Token disc */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={ev.pinned ? "#FFF8E7" : "#FBF6EA"}
        stroke={ringColor}
        strokeWidth={(ev.pinned ? 2.2 : 1.6) * scale}
      />
      {/* Kind dot bottom-right */}
      <circle cx={x + radius * 0.72} cy={y + radius * 0.72} r={radius * 0.28} fill={ringColor} />
      <text
        x={x}
        y={y + radius * 0.4}
        textAnchor="middle"
        fontSize={radius * 1.1}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {ev.cat || "·"}
      </text>
      {/* Tap-affordance dot top-right (cursor hint) */}
      {onClick && (
        <circle
          cx={x + radius * 0.72}
          cy={y - radius * 0.72}
          r={radius * 0.18}
          fill={ringColor}
          opacity="0.55"
        />
      )}
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
// TRUNK
// ===================================================================
function OrganicTrunk() {
  const trunkColor = "#2C2620";
  const trunkDark = "#15110D";
  const leftEdge = `M 405 ${GROUND_Y - 10} C 395 2050, 425 1900, 432 1750 C 442 1600, 418 1450, 446 1300 C 458 1150, 438 1000, 462 850 C 476 700, 460 550, 478 400 C 484 280, 488 180, 490 110`;
  const rightEdge = `L 510 110 C 514 180, 516 280, 524 400 C 540 550, 528 700, 542 850 C 558 1000, 544 1150, 556 1300 C 568 1450, 590 1600, 580 1750 C 588 1900, 605 2050, 595 ${GROUND_Y - 10} Z`;
  return (
    <g>
      <path d={leftEdge + rightEdge} fill="url(#trunkGradV3)" />
      <path d={leftEdge + rightEdge} fill="url(#trunkShadeV3)" opacity="0.85" />
      <g opacity="0.55" pointerEvents="none">
        <path
          d="M 460 2200 C 458 1800, 478 1400, 482 800 C 484 500, 486 250, 490 130"
          stroke={trunkDark}
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M 540 2180 C 542 1800, 524 1400, 520 800 C 516 500, 514 260, 510 140"
          stroke={trunkDark}
          strokeWidth="1.4"
          fill="none"
        />
        <ellipse cx="466" cy="1450" rx="9" ry="24" fill={trunkDark} opacity="0.7" />
        <ellipse cx="466" cy="1450" rx="3" ry="14" fill="#0a0a0a" opacity="0.6" />
        <ellipse cx="540" cy="950" rx="7" ry="16" fill={trunkDark} opacity="0.65" />
        <ellipse cx="488" cy="650" rx="6" ry="14" fill={trunkDark} opacity="0.55" />
        <ellipse cx="525" cy="1250" rx="8" ry="18" fill={trunkDark} opacity="0.55" />
        {Array.from({ length: 60 }).map((_, i) => {
          const rng = seedRand(i * 17 + 3);
          const cy = 200 + rng() * 2000;
          const cx = 470 + rng() * 60;
          return <circle key={i} cx={cx} cy={cy} r={0.5 + rng() * 0.9} fill={trunkDark} opacity={0.3 + rng() * 0.4} />;
        })}
      </g>
      <path
        d="M 540 2150 C 542 1800, 528 1400, 522 800 C 518 500, 516 260, 514 140"
        stroke="rgba(255,235,200,0.22)"
        strokeWidth="3.5"
        fill="none"
      />
    </g>
  );
}

function FillerBranches() {
  const trunkColor = "#2C2620";
  const fillers = Array.from({ length: 28 }).map((_, i) => {
    const rng = seedRand(i * 31 + 7);
    const y = 250 + rng() * 1900;
    const side = i % 2 === 0 ? -1 : 1;
    const startX = TRUNK_X + side * (10 + rng() * 4);
    const len = 30 + rng() * 80;
    const ang = (rng() - 0.5) * 1.4 - 0.4 * side;
    const tx = startX + Math.cos(ang) * len * side;
    const ty = y - Math.abs(Math.sin(ang)) * len - 10;
    return { y, side, startX, tx, ty, len, w: 1.5 + rng() * 2.5 };
  });
  return (
    <g opacity="0.7" pointerEvents="none">
      {fillers.map((f, i) => {
        const cpx = (f.startX + f.tx) / 2 + f.side * 8;
        const cpy = (f.y + f.ty) / 2 - 4;
        return (
          <g key={i}>
            <path
              d={`M ${f.startX} ${f.y} Q ${cpx} ${cpy}, ${f.tx} ${f.ty}`}
              stroke={trunkColor}
              strokeWidth={f.w}
              fill="none"
              strokeLinecap="round"
            />
            {f.len > 60 && (
              <path
                d={`M ${f.tx} ${f.ty} Q ${f.tx + f.side * 15} ${f.ty - 12}, ${f.tx + f.side * 30} ${f.ty - 25}`}
                stroke={trunkColor}
                strokeWidth={Math.max(0.6, f.w * 0.5)}
                fill="none"
                strokeLinecap="round"
              />
            )}
          </g>
        );
      })}
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
  season = "spring",
  width = "100%",
  height = "100%",
}: TreeOfLifeProps) {
  const seasonAlpha = level === "all" ? 0.55 : 1;
  const monthAlpha = level === "all" ? 0 : level === "year" ? 0.4 : 1;
  const eventScale =
    level === "all" ? 1.4 : level === "year" ? 1.7 : level === "season" ? 2.0 : 2.4;
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
  const trunkColor = "#2C2620";
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

      {/* Roots */}
      <g opacity="0.95">
        {[
          { dx: -420, dy: 60, w: 14 },
          { dx: -300, dy: 75, w: 12 },
          { dx: -180, dy: 85, w: 10 },
          { dx: -80, dy: 92, w: 7 },
          { dx: 80, dy: 92, w: 7 },
          { dx: 180, dy: 85, w: 10 },
          { dx: 300, dy: 75, w: 12 },
          { dx: 420, dy: 60, w: 14 },
          { dx: 0, dy: 98, w: 5 },
        ].map((r, i) => (
          <g key={i}>
            <path
              d={`M ${TRUNK_X} ${GROUND_Y - 30} C ${TRUNK_X + r.dx * 0.3} ${GROUND_Y - 5}, ${TRUNK_X + r.dx * 0.7} ${GROUND_Y + r.dy * 0.5}, ${TRUNK_X + r.dx} ${GROUND_Y + r.dy}`}
              stroke={trunkColor}
              strokeWidth={r.w}
              fill="none"
              strokeLinecap="round"
            />
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
        ))}
      </g>

      <OrganicTrunk />
      <FillerBranches />

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
        // Branch thickness scales with memory count
        const baseWidth = tip.len > 320 ? 20 : 16;
        const branchWidth = baseWidth + Math.min(12, Math.sqrt(memCount) * 2);

        const tipRng = seedRand(year);
        const nTwigs = 14;
        const tipTwigs = Array.from({ length: nTwigs }).map((_, i) => {
          const t = 0.4 + (i / nTwigs) * 0.6;
          const pt = yearPointAt(year, t);
          const rng = tipRng();
          const angOff = (rng - 0.5) * 1.8;
          const len = 50 + rng * 100;
          const upBias = -0.5;
          const ang = Math.atan2(pt.dy, pt.dx) + (Math.PI / 2) * tip.side + angOff;
          const tx = pt.x + Math.cos(ang) * len;
          const ty = pt.y + Math.sin(ang) * len + upBias * len;
          const subRng = tipRng();
          const subLen = len * 0.55;
          const subAng = ang + (subRng - 0.5) * 1.4;
          const sx = tx + Math.cos(subAng) * subLen;
          const sy = ty + Math.sin(subAng) * subLen + upBias * subLen * 0.5;
          return { px: pt.x, py: pt.y, tx, ty, sx, sy, w: 6 - i * 0.25 };
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
            <path d={path} stroke={trunkColor} strokeWidth={branchWidth} fill="none" strokeLinecap="round" />
            <path
              d={path}
              stroke="rgba(0,0,0,0.4)"
              strokeWidth={branchWidth * 0.8}
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: "url(#branchSoftV3)" }}
            />
            <path
              d={path}
              stroke="rgba(255,235,200,0.18)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Hover glow accent layer */}
            <path
              d={path}
              stroke="var(--accent)"
              strokeWidth={branchWidth + 4}
              fill="none"
              strokeLinecap="round"
              className="tree-year-glow"
              opacity={isFocused ? 0.35 : 0}
              style={{ transition: "opacity 240ms ease", filter: "blur(2px)" }}
            />

            {tipTwigs.map((t, i) => (
              <g key={i}>
                <path
                  d={`M ${t.px} ${t.py} Q ${(t.px + t.tx) / 2} ${(t.py + t.ty) / 2 - 10}, ${t.tx} ${t.ty}`}
                  stroke={trunkColor}
                  strokeWidth={t.w}
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${t.tx} ${t.ty} Q ${(t.tx + t.sx) / 2} ${(t.ty + t.sy) / 2 - 6}, ${t.sx} ${t.sy}`}
                  stroke={trunkColor}
                  strokeWidth={Math.max(1, t.w * 0.5)}
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}

            {showLeafMass &&
              Array.from({ length: Math.min(20, 6 + memCount) }).map((_, i) => {
                const rng = seedRand(year * 100 + i * 13);
                const r = rng();
                const tt = 0.35 + r * 0.55;
                const pt = yearPointAt(year, tt);
                const off = 22 + (rng() - 0.5) * 30;
                const upDx = Math.cos((rng() - 0.5) * Math.PI) * off;
                const upDy = -Math.abs(Math.sin((rng() - 0.5) * Math.PI)) * off - 10;
                const lx = pt.x + upDx + tip.side * (rng() * 12);
                const ly = pt.y + upDy;
                return (
                  <LeafGlyph
                    key={`fl${year}${i}`}
                    x={lx}
                    y={ly}
                    color={dominant[3] || dominant[0]}
                    fill={dominant[i % 3]}
                    size={7 + rng() * 4}
                    rot={rng() * 360 - 180}
                    opacity={0.55}
                  />
                );
              })}

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
                  // Spread along year branch in a wider arc
                  const t = (i + 0.5) / filtered.length;
                  const branchT = 0.32 + t * 0.62;
                  const pt = yearPointAt(year, branchT);
                  // Push perpendicular outward from branch
                  const len = Math.sqrt(pt.dx * pt.dx + pt.dy * pt.dy) || 1;
                  const nx = -pt.dy / len;
                  const ny = pt.dx / len;
                  // Stagger row to break linearity
                  const rowOffset = i % 2 === 0 ? 0 : 18;
                  const baseDist = level === "year" ? 38 : 46;
                  const dist = baseDist + rowOffset;
                  pos = {
                    x: pt.x + nx * dist * tip.side,
                    y: pt.y + ny * dist - 8,
                  };
                }
                return (
                  <g key={ev.id} style={{ transition: "opacity 400ms ease" }}>
                    <EventGlyph ev={ev} x={pos.x} y={pos.y} scale={eventScale} onClick={onSelectEvent} />
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
