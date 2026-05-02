"use client";

import type { CSSProperties } from "react";

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

interface JediProps {
  size?: number;
  mood?: "sitting" | "walking";
  style?: CSSProperties;
}

export function JediSilhouette({ size = 140, mood = "sitting", style }: JediProps) {
  if (mood === "walking") {
    return (
      <svg width={size} height={size * 0.7} viewBox="0 0 120 84" style={style}>
        <ellipse cx="60" cy="55" rx="28" ry="18" fill="#C99466" stroke="#7A5535" strokeWidth="1.5" />
        <circle cx="38" cy="42" r="14" fill="#C99466" stroke="#7A5535" strokeWidth="1.5" />
        <path d="M28 30 L24 14 L36 32 Z M48 30 L52 14 L40 32 Z" fill="#C99466" stroke="#7A5535" strokeWidth="1.2" />
        <path d="M30 28 L28 18 L34 30 Z M46 28 L48 18 L42 30 Z" fill="#E8A89B" />
        <ellipse cx="34" cy="42" rx="2" ry="2.5" fill="#7FA847" />
        <ellipse cx="42" cy="42" rx="2" ry="2.5" fill="#7FA847" />
        <circle cx="34" cy="41" r="0.6" fill="#fff" />
        <circle cx="42" cy="41" r="0.6" fill="#fff" />
        <path
          d="M85 52 Q102 38 95 22"
          stroke="#C99466"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M85 52 Q102 38 95 22"
          stroke="#7A5535"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="50" cy="73" rx="3" ry="4" fill="#C99466" stroke="#7A5535" strokeWidth="1" />
        <ellipse cx="60" cy="73" rx="3" ry="4" fill="#C99466" stroke="#7A5535" strokeWidth="1" />
        <ellipse cx="70" cy="73" rx="3" ry="4" fill="#C99466" stroke="#7A5535" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 240 290"
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id="jediBase" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#B89678" />
          <stop offset="40%" stopColor="#9B7A56" />
          <stop offset="80%" stopColor="#6F5238" />
          <stop offset="100%" stopColor="#4A3424" />
        </linearGradient>
        <linearGradient id="jediDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2E1F12" />
          <stop offset="100%" stopColor="#1A1108" />
        </linearGradient>
        <linearGradient id="jediCream" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0DCB8" />
          <stop offset="100%" stopColor="#C9A87C" />
        </linearGradient>
        <radialGradient id="jediEar" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#E8B4A4" />
          <stop offset="100%" stopColor="#A06658" />
        </radialGradient>
        <radialGradient id="jediEye" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#D4E89C" />
          <stop offset="50%" stopColor="#88A858" />
          <stop offset="100%" stopColor="#3E5C2A" />
        </radialGradient>
        <radialGradient id="jediGroundShadow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.30)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="jediHighlight" cx="50%" cy="20%">
          <stop offset="0%" stopColor="rgba(255,235,200,0.45)" />
          <stop offset="60%" stopColor="rgba(255,235,200,0)" />
        </radialGradient>
        <clipPath id="jediFurClip">
          <path d="M 100 270 C 60 270, 40 260, 42 220 C 44 180, 50 150, 60 130 C 50 110, 48 90, 55 70 C 60 55, 70 45, 80 42 C 84 30, 88 20, 96 18 C 100 12, 110 12, 116 18 C 122 22, 124 30, 124 40 C 134 42, 144 50, 150 65 C 156 80, 156 100, 150 118 C 165 130, 178 150, 184 180 C 190 210, 195 240, 200 260 C 210 275, 200 280, 180 278 L 100 270 Z" />
        </clipPath>
      </defs>

      <ellipse cx="120" cy="278" rx="80" ry="8" fill="url(#jediGroundShadow)" />

      <g>
        <path
          d="M 192 240 C 220 220, 232 195, 228 165 C 224 130, 208 110, 188 110 C 178 112, 174 122, 178 130 C 184 138, 188 148, 188 160 C 188 180, 178 200, 168 215 Z"
          fill="url(#jediBase)"
          stroke="#3A2614"
          strokeWidth="1.3"
        />
        <g opacity="0.7" stroke="#1F1408" fill="none" strokeLinecap="round">
          <path d="M 215 160 Q 222 158 224 152" strokeWidth="3" />
          <path d="M 210 175 Q 220 173 222 167" strokeWidth="3" />
          <path d="M 200 190 Q 215 188 218 180" strokeWidth="3" />
          <path d="M 188 205 Q 205 202 208 195" strokeWidth="3" />
          <path d="M 185 130 Q 195 128 198 124" strokeWidth="2.5" />
        </g>
      </g>

      <path
        d="M 100 270 C 60 270, 40 260, 42 220 C 44 180, 50 150, 60 130 C 50 110, 48 90, 55 70 C 60 55, 70 45, 80 42 C 84 30, 88 20, 96 18 C 100 12, 110 12, 116 18 C 122 22, 124 30, 124 40 C 134 42, 144 50, 150 65 C 156 80, 156 100, 150 118 C 165 130, 178 150, 184 180 C 190 210, 195 240, 200 260 C 210 275, 200 280, 180 278 L 100 270 Z"
        fill="url(#jediBase)"
        stroke="#3A2614"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <g clipPath="url(#jediFurClip)">
        <g fill="url(#jediDark)" opacity="0.55">
          <path d="M 70 140 Q 80 138 88 142 Q 95 145 92 158 Q 86 162 76 158 Q 70 155 70 140 Z" />
          <path d="M 90 165 Q 100 163 108 167 Q 116 172 112 184 Q 102 187 92 183 Q 86 178 90 165 Z" />
          <path d="M 60 175 Q 68 173 76 178 Q 80 184 75 195 Q 65 198 58 192 Q 54 184 60 175 Z" />
          <path d="M 110 195 Q 124 193 136 200 Q 142 210 134 220 Q 120 222 110 215 Q 105 205 110 195 Z" />
          <path d="M 80 210 Q 92 208 100 215 Q 102 225 92 232 Q 78 232 74 224 Q 73 215 80 210 Z" />
          <path d="M 60 230 Q 70 228 76 235 Q 78 246 68 250 Q 56 248 54 240 Q 53 232 60 230 Z" />
          <path d="M 130 145 Q 140 143 148 150 Q 152 162 144 168 Q 134 168 128 162 Q 124 152 130 145 Z" />
          <path d="M 150 170 Q 162 168 170 178 Q 172 192 162 198 Q 150 196 144 188 Q 142 178 150 170 Z" />
        </g>
      </g>

      <path
        d="M 75 110 Q 78 130 82 150 Q 88 175 94 200 Q 100 230 110 255 Q 120 260 128 255 Q 132 230 130 200 Q 124 175 118 150 Q 116 130 118 110 Q 96 105 75 110 Z"
        fill="url(#jediCream)"
        opacity="0.85"
      />

      <g>
        <path
          d="M 80 270 Q 75 270 72 264 Q 70 258 74 252 Q 80 248 88 252 Q 92 258 90 266 Q 88 270 80 270 Z"
          fill="url(#jediBase)"
          stroke="#3A2614"
          strokeWidth="1.3"
        />
        <path
          d="M 110 272 Q 105 272 102 266 Q 100 260 104 254 Q 110 250 118 254 Q 122 260 120 268 Q 118 272 110 272 Z"
          fill="url(#jediBase)"
          stroke="#3A2614"
          strokeWidth="1.3"
        />
      </g>

      <path
        d="M 60 75 Q 58 50 75 38 Q 92 28 108 30 Q 128 32 138 50 Q 144 65 142 80 Q 138 100 128 108 Q 110 116 92 116 Q 75 114 65 102 Q 58 88 60 75 Z"
        fill="url(#jediBase)"
        stroke="#3A2614"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M 65 50 L 58 8 Q 56 0 64 4 L 92 38 Z"
        fill="url(#jediBase)"
        stroke="#3A2614"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M 70 38 L 65 14 L 84 36 Z" fill="url(#jediEar)" />
      <g stroke="#1F1408" strokeWidth="1.1" fill="none" strokeLinecap="round">
        <path d="M 60 8 L 56 -4 M 63 6 L 62 -6 M 66 8 L 68 -3 M 69 12 L 73 2" />
      </g>

      <path
        d="M 138 50 L 148 10 Q 152 2 144 4 L 122 40 Z"
        fill="url(#jediBase)"
        stroke="#3A2614"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M 134 40 L 140 18 L 124 40 Z" fill="url(#jediEar)" />
      <g stroke="#1F1408" strokeWidth="1.1" fill="none" strokeLinecap="round">
        <path d="M 148 10 L 152 -2 M 145 8 L 146 -4 M 142 10 L 140 -1 M 139 14 L 135 4" />
      </g>

      <g stroke="#3A2614" strokeWidth="0.5" fill="none" opacity="0.55" strokeLinecap="round">
        <path
          d="M 78 50 Q 84 56 88 50 Q 94 56 100 48 Q 106 56 112 50 Q 118 56 124 50"
          strokeWidth="1.6"
          opacity="0.85"
        />
        <path d="M 64 76 Q 70 78 76 78" />
        <path d="M 62 84 Q 70 86 76 84" />
        <path d="M 138 76 Q 132 78 126 78" />
        <path d="M 140 84 Q 132 86 126 84" />
      </g>

      <ellipse cx="100" cy="92" rx="22" ry="14" fill="url(#jediCream)" />
      <ellipse cx="100" cy="98" rx="14" ry="8" fill="#F0DCB8" />

      <g>
        <path
          d="M 70 72 Q 76 64 84 65 Q 92 66 92 76 Q 88 82 80 82 Q 72 80 70 72 Z"
          fill="#fff"
        />
        <path
          d="M 130 72 Q 124 64 116 65 Q 108 66 108 76 Q 112 82 120 82 Q 128 80 130 72 Z"
          fill="#fff"
        />
        <ellipse cx="81" cy="73" rx="7" ry="8" fill="url(#jediEye)" />
        <ellipse cx="119" cy="73" rx="7" ry="8" fill="url(#jediEye)" />
        <ellipse cx="81" cy="73" rx="1.6" ry="6.5" fill="#0F1A08" />
        <ellipse cx="119" cy="73" rx="1.6" ry="6.5" fill="#0F1A08" />
        <circle cx="79" cy="69" r="1.8" fill="#fff" />
        <circle cx="117" cy="69" r="1.8" fill="#fff" />
        <path
          d="M 70 72 Q 76 64 84 65 Q 92 66 92 76"
          stroke="#1F1408"
          strokeWidth="1.7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 92 76 Q 88 82 80 82 Q 72 80 70 72"
          stroke="#3A2614"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 130 72 Q 124 64 116 65 Q 108 66 108 76"
          stroke="#1F1408"
          strokeWidth="1.7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 108 76 Q 112 82 120 82 Q 128 80 130 72"
          stroke="#3A2614"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      <path
        d="M 95 88 Q 90 86 92 91 Q 95 96 100 98 Q 105 96 108 91 Q 110 86 105 88 Q 102 90 100 90 Q 98 90 95 88 Z"
        fill="#C97A6E"
        stroke="#7A3F36"
        strokeWidth="1"
      />
      <path d="M 100 98 L 100 103" stroke="#1F1408" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 100 103 Q 94 108 86 105" stroke="#1F1408" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 100 103 Q 106 108 114 105" stroke="#1F1408" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      <g stroke="#F0DCB8" strokeWidth="0.8" fill="none" opacity="0.85" strokeLinecap="round">
        <path d="M 88 96 Q 70 98 50 96" />
        <path d="M 88 100 Q 70 104 48 106" />
        <path d="M 86 104 Q 68 110 50 116" />
        <path d="M 112 96 Q 130 98 150 96" />
        <path d="M 112 100 Q 130 104 152 106" />
        <path d="M 114 104 Q 132 110 150 116" />
      </g>

      <ellipse cx="100" cy="50" rx="80" ry="40" fill="url(#jediHighlight)" pointerEvents="none" />
    </svg>
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
        background: "radial-gradient(circle at 35% 30%, var(--surface-2), var(--surface-3))",
        boxShadow: "var(--shadow-md), inset 0 -10px 28px rgba(0,0,0,0.06)",
        overflow: "hidden",
        border: "3px solid var(--surface-2)",
        outline: "1px solid var(--border)",
      }}
    >
      <picture>
        <img
          src="/img/jedi-mono.png"
          alt="Jedi"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "55% 45%",
            mixBlendMode: "multiply",
          }}
        />
      </picture>
    </div>
  );
}
