"use client";

import type { CSSProperties } from "react";

type Props = {
  size?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
  className?: string;
};

export function Sprig({
  size = 80,
  color = "currentColor",
  opacity = 1,
  style,
  className,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity, ...style }}
      className={className}
    >
      <path
        d="M50 95 Q50 50 35 25 Q25 12 18 8"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M45 70 Q35 65 28 60 M50 60 Q40 56 32 50 M52 50 Q42 46 34 40 M50 38 Q42 32 38 24 M48 28 Q42 22 38 16"
        stroke={color}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <ellipse
        cx="32"
        cy="60"
        rx="6"
        ry="3"
        fill={color}
        opacity="0.55"
        transform="rotate(-30 32 60)"
      />
      <ellipse
        cx="36"
        cy="48"
        rx="5"
        ry="2.5"
        fill={color}
        opacity="0.55"
        transform="rotate(-25 36 48)"
      />
      <ellipse
        cx="38"
        cy="35"
        rx="5"
        ry="2.5"
        fill={color}
        opacity="0.55"
        transform="rotate(-20 38 35)"
      />
      <ellipse
        cx="40"
        cy="22"
        rx="4"
        ry="2"
        fill={color}
        opacity="0.55"
        transform="rotate(-15 40 22)"
      />
    </svg>
  );
}

export function LeafGroup({
  size = 120,
  color = "currentColor",
  opacity = 1,
  style,
  className,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ opacity, ...style }}
      className={className}
    >
      <path
        d="M100 20 Q60 40 50 90 Q40 140 100 180 Q160 140 150 90 Q140 40 100 20 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M100 20 L100 180" stroke={color} strokeWidth="1" fill="none" />
      <path
        d="M100 40 Q75 55 70 85"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M100 40 Q125 55 130 85"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M100 80 Q70 95 65 125"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M100 80 Q130 95 135 125"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M100 120 Q75 135 70 160"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M100 120 Q125 135 130 160"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function FloatingLeaves({
  count = 6,
  color = "var(--primary)",
}: {
  count?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 173) % 100;
        const top = (i * 211) % 100;
        const dur = 8 + (i % 4);
        const delay = i * 0.7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              opacity: 0.18,
              color,
              animation: `sway ${dur}s ease-in-out ${delay}s infinite`,
            }}
          >
            <Sprig size={48} opacity={0.6} />
          </div>
        );
      })}
    </div>
  );
}
