"use client";

import type { CSSProperties } from "react";

type Props = {
  size?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
  flip?: boolean;
};

export function JediSit({
  size = 160,
  color = "currentColor",
  opacity = 1,
  style,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ overflow: "visible", opacity, ...style }}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M 100 28 C 86 28 76 36 72 48 C 70 38 64 22 58 12 C 56 8 52 8 52 14 C 52 26 56 42 62 54 C 54 58 46 66 42 78 C 38 90 38 104 42 116 C 36 126 32 138 30 152 C 28 162 28 172 32 180 C 36 186 44 188 52 184 C 56 188 64 192 74 192 C 84 192 92 188 96 184 C 102 186 116 186 124 184 C 132 188 144 192 154 188 C 162 186 168 178 168 168 C 174 162 178 152 178 140 C 178 128 174 116 168 108 C 172 96 174 84 174 76 C 174 64 170 56 164 50 C 168 42 172 28 174 14 C 174 8 168 8 166 12 C 158 22 152 38 150 50 C 144 36 132 28 118 28 C 114 26 108 26 100 28 Z M 158 92 C 168 96 174 110 174 122 C 174 134 168 144 158 148 C 154 134 154 110 158 92 Z"
      />
    </svg>
  );
}

export function JediWalk({
  size = 80,
  color = "currentColor",
  opacity = 1,
  flip = false,
  style,
}: Props) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 160 96"
      style={{
        overflow: "visible",
        opacity,
        transform: flip ? "scaleX(-1)" : "none",
        ...style,
      }}
    >
      <path
        fill={color}
        d="M 8 56 C 4 48 6 38 12 32 C 10 26 12 18 16 14 C 18 10 24 12 24 16 C 24 22 22 28 20 32 C 28 28 38 28 46 30 C 46 22 50 14 56 12 C 60 10 64 14 62 18 C 60 24 56 28 52 32 C 64 32 76 34 86 38 C 96 42 108 44 120 44 C 130 44 140 46 146 52 C 152 48 156 42 158 36 C 160 34 162 38 158 44 C 154 50 150 56 146 60 C 152 68 154 78 150 84 C 144 88 138 84 136 78 C 132 84 124 86 122 80 L 102 80 C 102 86 98 90 92 88 L 78 88 C 80 84 80 80 78 76 L 56 76 C 56 82 52 88 46 88 C 40 86 38 80 42 76 C 30 70 22 60 14 60 C 12 60 10 58 8 56 Z"
      />
    </svg>
  );
}

export function JediEyes({ color = "#9FC569" }: { color?: string }) {
  return (
    <g>
      <ellipse cx="84" cy="78" rx="3" ry="4.5" fill={color} />
      <ellipse cx="116" cy="78" rx="3" ry="4.5" fill={color} />
      <ellipse cx="84" cy="78" rx="0.8" ry="3.5" fill="#1a2410">
        <animate
          attributeName="ry"
          values="3.5;0.3;3.5;3.5;3.5"
          dur="6s"
          repeatCount="indefinite"
        />
      </ellipse>
      <ellipse cx="116" cy="78" rx="0.8" ry="3.5" fill="#1a2410">
        <animate
          attributeName="ry"
          values="3.5;0.3;3.5;3.5;3.5"
          dur="6s"
          repeatCount="indefinite"
        />
      </ellipse>
    </g>
  );
}

export function JediPortrait({ size = 200 }: { size?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, var(--surface-2), var(--surface-3))`,
        boxShadow:
          "var(--shadow-md), inset 0 -10px 28px rgba(0,0,0,0.06)",
        overflow: "hidden",
        border: "3px solid var(--surface-2)",
        outline: "1px solid var(--border)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <JediSit
        size={size * 0.85}
        color="var(--primary-deep)"
        opacity={0.92}
        style={{ marginBottom: -size * 0.05 }}
      />
      <svg
        viewBox="0 0 200 200"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <JediEyes />
      </svg>
    </div>
  );
}
