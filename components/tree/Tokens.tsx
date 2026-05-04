// Two ways a memory becomes visible on the tree:
//   - EventGlyph: emoji disc (year-zoom and deeper)
//   - FoliageBurst: colored dot/sparkle (all-zoom only, like blossoms)

import { useRef } from "react";
import type React from "react";
import {
  KIND_STYLE,
  type LifeEvent,
} from "@/lib/tree-data";

// ─── EventGlyph ─────────────────────────────────────────────────────

interface EventGlyphProps {
  ev: LifeEvent;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  onClick?: (ev: LifeEvent) => void;
  onPreview?: (ev: LifeEvent, anchor: { x: number; y: number }) => void;
}

export function EventGlyph({
  ev,
  x,
  y,
  scale = 1,
  opacity = 1,
  onClick,
  onPreview,
}: EventGlyphProps) {
  const style = KIND_STYLE[ev.kind];
  const radius = (ev.pinned ? 14 : 11) * scale;
  const ringColor = ev.pinned ? "#C66E3D" : style.color;
  const holdTimer = useRef<number | null>(null);
  const heldRef = useRef(false);

  const cancelHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };
  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    heldRef.current = false;
    if (onPreview) {
      holdTimer.current = window.setTimeout(() => {
        heldRef.current = true;
        onPreview(ev, { x, y });
      }, 320);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    cancelHold();
    if (!heldRef.current) onClick?.(ev);
  };

  return (
    <g
      style={{
        cursor: onClick ? "pointer" : "default",
        opacity,
        transition: "opacity 240ms, transform 240ms",
        touchAction: "manipulation",
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
    >
      {ev.pinned && (
        <>
          <circle cx={x} cy={y} r={radius + 10} fill="#C66E3D" opacity="0.14">
            <animate
              attributeName="r"
              values={`${radius + 8};${radius + 18};${radius + 8}`}
              dur="2.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.22;0;0.22"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </circle>
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
      <circle cx={x} cy={y + radius * 0.18} r={radius} fill="#1F1B16" opacity="0.18" />
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={ev.pinned ? "#FFF8E7" : "#FBF6EA"}
        stroke={ringColor}
        strokeWidth={(ev.pinned ? 2.2 : 1.6) * scale}
      />
      <circle
        cx={x + radius * 0.72}
        cy={y + radius * 0.72}
        r={radius * 0.28}
        fill={ringColor}
      />
      <text
        x={x}
        y={y + radius * 0.4}
        textAnchor="middle"
        fontSize={radius * 1.25}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {ev.cat || "·"}
      </text>
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

// ─── FoliageBurst ───────────────────────────────────────────────────

interface FoliageBurstProps {
  ev: LifeEvent;
  x: number;
  y: number;
  scale?: number;
}

export function FoliageBurst({ ev, x, y, scale = 1 }: FoliageBurstProps) {
  const color = ev.color ?? KIND_STYLE[ev.kind].color;
  const r = (ev.pinned ? 8 : 5) * scale;
  if (ev.pinned) {
    const inner = r * 0.42;
    const pts = Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      const rr = i % 2 === 0 ? r : inner;
      return `${(x + Math.cos(a) * rr).toFixed(2)},${(y + Math.sin(a) * rr).toFixed(2)}`;
    });
    return (
      <g pointerEvents="none">
        <circle cx={x} cy={y} r={r * 1.6} fill={color} opacity="0.18" />
        <polygon points={pts.join(" ")} fill={color} opacity="0.95" />
        <circle cx={x} cy={y} r={r * 0.35} fill="#FFF8E7" opacity="0.85" />
      </g>
    );
  }
  return (
    <g pointerEvents="none">
      <circle cx={x} cy={y} r={r * 1.5} fill={color} opacity="0.18" />
      <circle cx={x} cy={y} r={r} fill={color} opacity="0.92" />
      <circle
        cx={x - r * 0.32}
        cy={y - r * 0.32}
        r={r * 0.32}
        fill="#FFF8E7"
        opacity="0.6"
      />
    </g>
  );
}
