"use client";

import { motion } from "framer-motion";

// ===================================================================
// ANIMATED CATEGORY HERO ILLUSTRATIONS
// Each represents a memory category with category-specific motion.
// Used in Memory Detail page hero card.
// ===================================================================

interface HeroProps {
  size?: number;
  primary?: string;
  accent?: string;
  surface?: string;
}

// Sparkle / star with pulsing rays — for kilometre_tasi (milestones)
export function HeroSparkle({ size = 140, primary = "#E8826B" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="20"
            x2="50"
            y2="36"
            stroke={primary}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.55"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </motion.g>
      <motion.path
        d="M 50 22 L 53 42 L 73 45 L 56 56 L 60 76 L 50 64 L 40 76 L 44 56 L 27 45 L 47 42 Z"
        fill={primary}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="#fff"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </svg>
  );
}

// Pulsing heart — for yildonumu (anniversaries)
export function HeroHearts({ size = 140, primary = "#E8826B" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.path
        d="M50 78 C 50 78, 18 60, 18 38 C 18 26, 28 18, 38 18 C 44 18, 48 22, 50 26 C 52 22, 56 18, 62 18 C 72 18, 82 26, 82 38 C 82 60, 50 78, 50 78 Z"
        fill={primary}
        animate={{ scale: [1, 1.08, 1, 1.04, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />
      <motion.circle
        cx="35"
        cy="32"
        r="3"
        fill="#fff"
        animate={{ y: [0, -10, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.3 }}
      />
      <motion.circle
        cx="78"
        cy="40"
        r="2"
        fill="#fff"
        animate={{ y: [0, -14, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
      />
    </svg>
  );
}

// Seedling growing — for ilkler (firsts)
export function HeroSeedling({ size = 140, primary = "#5A8B7E", accent = "#E8826B" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="82" rx="22" ry="3" fill={primary} opacity="0.18" />
      <motion.g
        initial={{ scaleY: 0.7 }}
        animate={{ scaleY: [0.85, 1, 0.95, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: "50px 80px" }}
      >
        <path
          d="M50 82 Q 49 60 50 38"
          stroke={primary}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <motion.path
          d="M50 56 Q 38 50 32 40 Q 36 36 44 38 Q 50 44 50 56"
          fill={primary}
          opacity="0.85"
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ transformOrigin: "50px 56px" }}
        />
        <motion.path
          d="M50 46 Q 62 40 68 30 Q 64 26 56 28 Q 50 34 50 46"
          fill={primary}
          opacity="0.85"
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.6 }}
          style={{ transformOrigin: "50px 46px" }}
        />
      </motion.g>
      <motion.circle
        cx="50"
        cy="36"
        r="3"
        fill={accent}
        animate={{ scale: [0, 1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
}

// Plane flying — for gezi (travels)
export function HeroPlane({ size = 140, primary = "#5A8B7E", accent = "#E8826B" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.path
        d="M 10 70 Q 35 40 60 35 Q 80 30 92 20"
        stroke={accent}
        strokeWidth="1.5"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.45"
      />
      <motion.g
        animate={{ x: [0, 6, 0, -3, 0], y: [0, -3, 0, 3, 0], rotate: [-12, -8, -12] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <g transform="translate(50 40)">
          <path
            d="M 0 0 L 26 -4 L 30 -7 L 33 -3 L 30 0 L 33 3 L 30 7 L 26 4 L 0 0 L -8 -8 L -4 -8 L 4 -2 L 8 -2 L -4 -10 L -8 -10 L -4 -10 Z"
            fill={primary}
          />
          <circle cx="22" cy="-1" r="1" fill="#fff" opacity="0.7" />
          <circle cx="18" cy="-1" r="1" fill="#fff" opacity="0.7" />
        </g>
      </motion.g>
      <motion.circle
        cx="20"
        cy="65"
        r="6"
        fill={primary}
        opacity="0.18"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        cx="80"
        cy="25"
        r="4"
        fill={accent}
        opacity="0.5"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

// Cake with candles — for ozelgun (birthdays)
export function HeroCake({ size = 140, primary = "#E8826B", accent = "#5A8B7E" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="22" y="50" width="56" height="32" rx="3" fill={primary} opacity="0.85" />
      <rect x="22" y="50" width="56" height="6" fill="#fff" opacity="0.4" />
      <path d="M22 56 Q 30 60 38 56 Q 46 60 54 56 Q 62 60 70 56 Q 76 60 78 56" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5" />
      <ellipse cx="35" cy="50" rx="3" ry="2" fill={accent} />
      <ellipse cx="50" cy="50" rx="3" ry="2" fill={accent} />
      <ellipse cx="65" cy="50" rx="3" ry="2" fill={accent} />
      {[35, 50, 65].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 1} y="36" width="2" height="14" fill="#fff" />
          <motion.path
            d={`M ${cx} 28 Q ${cx + 2} 32 ${cx} 38 Q ${cx - 2} 32 ${cx} 28`}
            fill="#FFD93D"
            animate={{ scaleY: [1, 1.15, 0.95, 1.05, 1], rotate: [0, 3, -2, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{ transformOrigin: `${cx}px 38px` }}
          />
        </g>
      ))}
      <motion.circle
        cx="20"
        cy="20"
        r="2"
        fill="#FFD93D"
        animate={{ y: [0, -6, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <motion.circle
        cx="80"
        cy="15"
        r="2.5"
        fill="#FFD93D"
        animate={{ y: [0, -10, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 0.4 }}
      />
    </svg>
  );
}

// Cat curled — for jedi
export function HeroCat({ size = 140, primary = "#A89376" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.g
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="50" cy="68" rx="32" ry="14" fill={primary} />
        <path d="M 22 60 Q 18 48 25 42 L 30 56 Z" fill={primary} />
        <path d="M 78 60 Q 82 48 75 42 L 70 56 Z" fill={primary} />
        <ellipse cx="48" cy="70" rx="18" ry="6" fill="#D8C8AB" />
        <circle cx="38" cy="60" r="1.5" fill="#1F1408" />
        <circle cx="58" cy="60" r="1.5" fill="#1F1408" />
        <path d="M 46 64 Q 48 67 50 64" stroke="#1F1408" strokeWidth="0.8" fill="none" />
        <path d="M 18 64 L 28 60 M 18 67 L 28 65" stroke="#fff" strokeWidth="0.4" opacity="0.7" />
        <path d="M 82 64 L 72 60 M 82 67 L 72 65" stroke="#fff" strokeWidth="0.4" opacity="0.7" />
      </motion.g>
      <motion.circle
        cx="78"
        cy="40"
        r="3"
        fill="#E8826B"
        opacity="0.5"
        animate={{ y: [0, -8, 0], opacity: [0, 0.7, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
}

// Envelope opening — for mektup (letters)
export function HeroEnvelope({ size = 140, primary = "#E8826B", accent = "#5A8B7E" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="22" y="38" width="56" height="36" rx="2" fill="#fff" stroke={primary} strokeWidth="1.5" />
      <motion.path
        d="M22 38 L50 58 L78 38 L78 36 L22 36 Z"
        fill={primary}
        animate={{ rotateX: [0, -30, -30, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
        style={{ transformOrigin: "50px 36px" }}
      />
      <motion.path
        d="M50 56 Q 50 42 50 30"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.path
        d="M 38 28 L 50 22 L 62 28"
        stroke={primary}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="50"
        cy="22"
        r="3"
        fill={primary}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

// Coffee cup with steam — for kahve
export function HeroCoffee({ size = 140, primary = "#A89376", accent = "#5A8B7E" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M 30 50 L 30 78 Q 30 84 36 84 L 60 84 Q 66 84 66 78 L 66 50 Z" fill={primary} />
      <ellipse cx="48" cy="50" rx="18" ry="3" fill="#1F1408" opacity="0.7" />
      <path d="M 66 56 Q 78 56 78 66 Q 78 76 66 76" fill="none" stroke={primary} strokeWidth="3" />
      {[30, 42, 54].map((cx, i) => (
        <motion.path
          key={cx}
          d={`M ${cx} 38 Q ${cx + 4} 30 ${cx - 2} 22 Q ${cx + 2} 14 ${cx} 8`}
          stroke={accent}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
          animate={{ y: [0, -8, -16], opacity: [0.5, 0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
        />
      ))}
      <ellipse cx="48" cy="84" rx="22" ry="3" fill={primary} opacity="0.25" />
    </svg>
  );
}

// Music note floating — for sarki (songs)
export function HeroMusic({ size = 140, primary = "#E8826B", accent = "#5A8B7E" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M 40 26 L 40 66 Q 40 72 34 72 Q 28 72 28 66 Q 28 60 34 60 Q 38 60 40 62 L 40 30 L 64 24 L 64 60 Q 64 66 58 66 Q 52 66 52 60 Q 52 54 58 54 Q 62 54 64 56" fill={primary} />
      </motion.g>
      <motion.circle
        cx="20"
        cy="44"
        r="3"
        fill={accent}
        opacity="0.6"
        animate={{ y: [0, -10, 0], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
      <motion.circle
        cx="76"
        cy="36"
        r="2.5"
        fill={accent}
        opacity="0.5"
        animate={{ y: [0, -8, 0], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: 0.6 }}
      />
      <motion.circle
        cx="84"
        cy="60"
        r="2"
        fill={primary}
        opacity="0.5"
        animate={{ y: [0, -12, 0], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 1.1 }}
      />
    </svg>
  );
}

// Spinning gear — for maker (3D printer / DIY)
export function HeroGear({ size = 140, primary = "#5A8B7E", accent = "#E8826B" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <path
          d="M 50 18 L 56 18 L 58 28 Q 64 30 68 34 L 78 30 L 82 36 L 76 44 Q 78 48 78 52 L 86 56 L 84 64 L 74 64 Q 72 70 68 74 L 72 84 L 64 86 L 58 78 Q 54 80 50 80 Q 46 80 42 78 L 36 86 L 28 84 L 32 74 Q 28 70 26 64 L 16 64 L 14 56 L 22 52 Q 22 48 24 44 L 18 36 L 22 30 L 32 34 Q 36 30 42 28 L 44 18 Z"
          fill={primary}
        />
        <circle cx="50" cy="50" r="14" fill="#fff" />
        <circle cx="50" cy="50" r="8" fill={accent} />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "78px 78px" }}
      >
        <circle cx="78" cy="78" r="8" fill={accent} opacity="0.6" />
        {[0, 90, 180, 270].map((deg) => (
          <rect
            key={deg}
            x="76"
            y="68"
            width="4"
            height="6"
            fill={accent}
            opacity="0.6"
            transform={`rotate(${deg} 78 78)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}

// Game controller — for game
export function HeroGame({ size = 140, primary = "#5A8B7E", accent = "#E8826B" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <path d="M 24 50 Q 24 36 38 36 L 62 36 Q 76 36 76 50 L 76 62 Q 76 72 68 72 L 60 72 L 54 64 L 46 64 L 40 72 L 32 72 Q 24 72 24 62 Z" fill={primary} />
        <rect x="32" y="48" width="3" height="9" fill="#fff" />
        <rect x="29" y="51" width="9" height="3" fill="#fff" />
        <motion.circle cx="62" cy="48" r="3" fill={accent} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
        <motion.circle cx="68" cy="54" r="3" fill="#FFD93D" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
      </motion.g>
    </svg>
  );
}

// Key turning — for donumnoktasi (turning points)
export function HeroKey({ size = 140, primary = "#E8826B", accent = "#5A8B7E" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.g
        animate={{ rotate: [0, 30, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "32px 50px" }}
      >
        <circle cx="32" cy="50" r="14" fill="none" stroke={primary} strokeWidth="3" />
        <circle cx="32" cy="50" r="5" fill="none" stroke={primary} strokeWidth="2" />
        <rect x="44" y="48" width="36" height="4" fill={primary} />
        <rect x="64" y="44" width="3" height="12" fill={primary} />
        <rect x="72" y="44" width="3" height="8" fill={primary} />
      </motion.g>
      <motion.circle
        cx="50"
        cy="20"
        r="2"
        fill={accent}
        opacity="0.5"
        animate={{ y: [0, -6, 0], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

// Flower opening — for kucuksey (small things)
export function HeroFlower({ size = 140, primary = "#E8A2B8", accent = "#5A8B7E" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <line x1="50" y1="56" x2="50" y2="86" stroke={accent} strokeWidth="1.5" />
      <path d="M 50 70 Q 42 66 38 60" stroke={accent} strokeWidth="1.5" fill="none" />
      <path d="M 50 78 Q 58 72 64 70" stroke={accent} strokeWidth="1.5" fill="none" />
      <ellipse cx="42" cy="64" rx="4" ry="2" fill={accent} transform="rotate(-30 42 64)" />
      <ellipse cx="60" cy="72" rx="4" ry="2" fill={accent} transform="rotate(30 60 72)" />
      <motion.g
        animate={{ rotate: [0, 6, 0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ transformOrigin: "50px 50px" }}
      >
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <motion.ellipse
            key={deg}
            cx="50"
            cy="36"
            rx="6"
            ry="12"
            fill={primary}
            transform={`rotate(${deg} 50 50)`}
            animate={{ scale: [0.85, 1, 0.95, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
            style={{ transformOrigin: "50px 50px" }}
          />
        ))}
      </motion.g>
      <motion.circle
        cx="50"
        cy="50"
        r="5"
        fill="#FFD93D"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

// Default leaf for unknown
export function HeroLeaf({ size = 140, primary = "#5A8B7E" }: HeroProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.path
        d="M 50 80 Q 30 70 26 50 Q 24 30 50 16 Q 76 30 74 50 Q 70 70 50 80 Z"
        fill={primary}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ transformOrigin: "50px 80px" }}
      />
      <path d="M 50 80 L 50 18" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
      <path d="M 50 60 Q 38 56 32 48" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M 50 40 Q 62 36 68 30" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.4" />
    </svg>
  );
}

// ===================================================================
// CATEGORY ICON MAP
// ===================================================================

import {
  Sparkles, Sprout, Heart, Plane, Cake, Cat,
  Mail, Coffee, Music, Wrench, Gamepad2, Key, Flower2,
  Leaf,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export const CATEGORY_ICON: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  kilometre_tasi: Sparkles,
  ilkler: Sprout,
  yildonumu: Heart,
  gezi: Plane,
  ozelgun: Cake,
  jedi: Cat,
  mektup: Mail,
  kahve: Coffee,
  sarki: Music,
  maker: Wrench,
  game: Gamepad2,
  donumnoktasi: Key,
  kucuksey: Flower2,
  hayat: Leaf,
};

export const CATEGORY_HERO: Record<string, ComponentType<HeroProps>> = {
  kilometre_tasi: HeroSparkle,
  ilkler: HeroSeedling,
  yildonumu: HeroHearts,
  gezi: HeroPlane,
  ozelgun: HeroCake,
  jedi: HeroCat,
  mektup: HeroEnvelope,
  kahve: HeroCoffee,
  sarki: HeroMusic,
  maker: HeroGear,
  game: HeroGame,
  donumnoktasi: HeroKey,
  kucuksey: HeroFlower,
  hayat: HeroLeaf,
};

export function CategoryHero({
  category,
  size = 140,
  primary,
  accent,
}: {
  category: string;
  size?: number;
  primary?: string;
  accent?: string;
}) {
  const Hero = CATEGORY_HERO[category] ?? HeroLeaf;
  return <Hero size={size} primary={primary} accent={accent} />;
}

export function CategoryLucideIcon({
  category,
  size = 18,
  className,
}: {
  category: string;
  size?: number;
  className?: string;
}) {
  const Icon = CATEGORY_ICON[category] ?? Leaf;
  return <Icon width={size} height={size} className={className} />;
}
