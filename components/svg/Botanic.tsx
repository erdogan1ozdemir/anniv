"use client";

import type { CSSProperties } from "react";

interface SvgProps {
  size?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}

export function Leaf({
  size = 40,
  color = "currentColor",
  opacity = 0.18,
  style,
}: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity, ...style }}>
      <path
        d="M20 4 Q8 12 8 24 Q8 34 20 36 Q32 34 32 24 Q32 12 20 4 Z M20 6 L20 36"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M20 12 L14 18 M20 18 L13 22 M20 24 L14 28 M20 14 L26 18 M20 20 L27 22 M20 26 L26 28"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function Sprig({
  size = 60,
  color = "currentColor",
  opacity = 0.22,
  style,
}: SvgProps) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 60 84"
      style={{ opacity, ...style }}
    >
      <path
        d="M30 80 Q28 60 30 40 Q32 20 30 4"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="22" cy="68" rx="6" ry="3" fill={color} transform="rotate(-30 22 68)" opacity="0.6" />
      <ellipse cx="38" cy="58" rx="6" ry="3" fill={color} transform="rotate(30 38 58)" opacity="0.6" />
      <ellipse cx="20" cy="46" rx="7" ry="3.5" fill={color} transform="rotate(-35 20 46)" opacity="0.7" />
      <ellipse cx="40" cy="36" rx="7" ry="3.5" fill={color} transform="rotate(35 40 36)" opacity="0.7" />
      <ellipse cx="24" cy="22" rx="5" ry="2.5" fill={color} transform="rotate(-25 24 22)" opacity="0.8" />
      <ellipse cx="36" cy="14" rx="5" ry="2.5" fill={color} transform="rotate(25 36 14)" opacity="0.8" />
    </svg>
  );
}

export function Vine({
  width = 200,
  height = 300,
  color = "currentColor",
  opacity = 0.25,
}: {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ opacity }}>
      <path
        d={`M${width / 2} 0 Q${width / 2 + 20} ${height * 0.2} ${width / 2 - 10} ${height * 0.4} Q${width / 2 - 30} ${height * 0.6} ${width / 2 + 5} ${height * 0.8} Q${width / 2 + 20} ${height * 0.95} ${width / 2} ${height}`}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {[0.15, 0.35, 0.55, 0.75].map((t, i) => (
        <g key={i} transform={`translate(${width / 2 + (i % 2 ? 15 : -15)} ${height * t})`}>
          <ellipse
            cx="0"
            cy="0"
            rx="8"
            ry="4"
            fill={color}
            opacity="0.5"
            transform={`rotate(${i % 2 ? 40 : -40})`}
          />
        </g>
      ))}
    </svg>
  );
}

export function PawPrint({
  size = 16,
  color = "currentColor",
  opacity = 0.4,
}: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ opacity }}>
      <ellipse cx="8" cy="11" rx="3.5" ry="3" fill={color} />
      <ellipse cx="3.5" cy="6" rx="1.6" ry="2" fill={color} />
      <ellipse cx="6.5" cy="3" rx="1.4" ry="1.8" fill={color} />
      <ellipse cx="9.5" cy="3" rx="1.4" ry="1.8" fill={color} />
      <ellipse cx="12.5" cy="6" rx="1.6" ry="2" fill={color} />
    </svg>
  );
}

export function Compass({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M30 8 L34 30 L30 26 L26 30 Z" fill="currentColor" opacity="0.7" />
      <path d="M30 52 L34 30 L30 34 L26 30 Z" fill="currentColor" opacity="0.3" />
      <text x="30" y="6" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="serif">
        N
      </text>
      <text x="30" y="58" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="serif" opacity="0.5">
        S
      </text>
      <text x="2" y="32" fontSize="6" fill="currentColor" fontFamily="serif" opacity="0.5">
        W
      </text>
      <text x="54" y="32" fontSize="6" fill="currentColor" fontFamily="serif" opacity="0.5">
        E
      </text>
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
