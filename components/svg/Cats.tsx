"use client";

import { useEffect, useState, type CSSProperties } from "react";

interface CatProps {
  size?: number;
  color?: string;
  opacity?: number;
  flip?: boolean;
  style?: CSSProperties;
}

export function CatSilSit({
  size = 120,
  color = "currentColor",
  opacity = 1,
  style,
}: CatProps) {
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
      <ellipse cx="172" cy="120" rx="6" ry="8" fill={color} transform="rotate(-15 172 120)" />
    </svg>
  );
}

export function CatSilStand({
  size = 140,
  color = "currentColor",
  opacity = 1,
  flip = false,
}: CatProps) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 240 200"
      style={{
        overflow: "visible",
        opacity,
        transform: flip ? "scaleX(-1)" : "none",
      }}
    >
      <path
        fill={color}
        d="M 30 90 C 24 78 22 66 28 56 C 30 50 32 36 28 24 C 26 18 32 16 36 22 C 42 32 48 44 50 54 C 56 48 64 44 72 42 C 70 32 70 22 74 14 C 76 10 82 12 82 16 C 84 24 84 34 82 42 C 92 42 102 46 110 52 C 116 58 122 62 130 64 C 142 66 156 68 168 74 C 180 80 188 90 192 102 C 196 96 200 88 206 80 C 212 70 220 60 226 56 C 230 52 236 56 232 62 C 226 70 220 80 216 92 C 224 102 230 114 230 128 C 230 138 226 144 220 144 C 218 146 218 152 220 158 C 222 166 220 172 214 170 C 208 168 204 162 202 154 C 200 158 196 162 190 162 C 188 168 188 174 184 178 C 180 184 172 184 170 178 C 166 170 164 162 164 154 L 134 154 C 134 162 132 170 128 178 C 124 184 116 184 114 178 C 110 170 110 162 112 154 L 84 154 C 82 164 78 174 72 178 C 66 184 56 184 54 178 C 50 170 50 160 54 152 C 44 146 36 134 32 122 C 28 110 28 100 30 90 Z"
      />
    </svg>
  );
}

export function CatSilWalkSimple({
  size = 80,
  color = "currentColor",
  opacity = 1,
  flip = false,
}: CatProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 160 96"
      style={{
        overflow: "visible",
        opacity,
        transform: flip ? "scaleX(-1)" : "none",
      }}
    >
      <path
        fill={color}
        d="M 8 56 C 4 48 6 38 12 32 C 10 26 12 18 16 14 C 18 10 24 12 24 16 C 24 22 22 28 20 32 C 28 28 38 28 46 30 C 46 22 50 14 56 12 C 60 10 64 14 62 18 C 60 24 56 28 52 32 C 64 32 76 34 86 38 C 96 42 108 44 120 44 C 130 44 140 46 146 52 C 152 48 156 42 158 36 C 160 34 162 38 158 44 C 154 50 150 56 146 60 C 152 68 154 78 150 84 C 144 88 138 84 136 78 C 132 84 124 86 122 80 L 102 80 C 102 86 98 90 92 88 L 78 88 C 80 84 80 80 78 76 L 56 76 C 56 82 52 88 46 88 C 40 86 38 80 42 76 C 30 70 22 60 14 60 C 12 60 10 58 8 56 Z"
      />
    </svg>
  );
}

export function WalkingCat({
  duration = 14,
  size = 80,
  color = "currentColor",
  opacity = 0.4,
  delay = 0,
  bottom = 12,
  reverse = false,
}: {
  duration?: number;
  size?: number;
  color?: string;
  opacity?: number;
  delay?: number;
  bottom?: number;
  reverse?: boolean;
}) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 280);
    return () => window.clearInterval(id);
  }, []);
  const bob = step % 2 === 0 ? 0 : -1.5;
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 0,
        width: "100%",
        pointerEvents: "none",
        zIndex: 1,
        animation: `${reverse ? "catWalkReverse" : "catWalk"} ${duration}s linear ${delay}s infinite`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          transform: `translateY(${bob}px)`,
          transition: "transform 280ms",
        }}
      >
        <CatSilWalkSimple
          size={size}
          color={color}
          opacity={opacity}
          flip={reverse}
        />
      </div>
    </div>
  );
}
