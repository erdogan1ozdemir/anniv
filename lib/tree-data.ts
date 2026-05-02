// Hierarchical tree-of-life data + deterministic geometry
// Trunk → Year branches → Season sub-branches → Month twigs → Event leaves

import type { Memory } from "@/types";

export type EventKind = "leaf" | "flower" | "fruit" | "dryleaf" | "bud" | "sparkle";

export interface LifeEvent {
  id: string;
  year: number;
  month: number; // 0-11
  day: number;
  t: string;
  kind: EventKind;
  cat: string;
  tags: string[];
  pinned?: boolean;
  d?: string;
  mood?: string;
  color?: string;
}

export type Season = "spring" | "summer" | "autumn" | "winter";
export type ZoomLevel = "all" | "year" | "season" | "month" | "week" | "moment";
export interface ZoomFocus {
  year?: number | null;
  season?: Season | null;
  month?: number | null;
  week?: number | null;
}

// === DETERMINISTIC RANDOM ===
export const seedRand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// === KIND INFERENCE FROM MEMORY ===
const KIND_BY_CATEGORY: Record<string, EventKind> = {
  kilometre_tasi: "sparkle",
  ilkler: "bud",
  yildonumu: "flower",
  gezi: "fruit",
  ozelgun: "flower",
  jedi: "sparkle",
  donumnoktasi: "sparkle",
  kucuksey: "leaf",
  mektup: "flower",
  kahve: "leaf",
  maker: "fruit",
  sarki: "flower",
  game: "leaf",
};

const KIND_BY_MOOD: Record<string, EventKind> = {
  romantic: "flower",
  happy: "leaf",
  funny: "leaf",
  nostalgic: "dryleaf",
  bittersweet: "dryleaf",
};

const EMOJI_BY_CATEGORY: Record<string, string> = {
  kilometre_tasi: "✨",
  ilkler: "🌱",
  yildonumu: "💐",
  gezi: "✈️",
  ozelgun: "🎂",
  jedi: "🐈",
  donumnoktasi: "🪴",
  kucuksey: "🤍",
  mektup: "💌",
  kahve: "☕",
  maker: "🎨",
  sarki: "🎵",
  game: "🎮",
};

export function inferEventKind(memory: Memory): EventKind {
  if (memory.is_pinned) return "sparkle";
  const byCat = KIND_BY_CATEGORY[memory.category];
  if (byCat) return byCat;
  const byMood = memory.mood ? KIND_BY_MOOD[memory.mood] : undefined;
  if (byMood) return byMood;
  return "leaf";
}

export function categoryEmoji(category: string): string {
  return EMOJI_BY_CATEGORY[category] ?? "🌿";
}

export function memoryToEvent(memory: Memory): LifeEvent {
  const [yearStr, monthStr, dayStr] = memory.date.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const day = Number(dayStr);
  const months = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  const kind = inferEventKind(memory);
  return {
    id: memory.id,
    year,
    month,
    day,
    t: memory.title,
    kind,
    cat: categoryEmoji(memory.category),
    tags: memory.tags ?? [],
    pinned: memory.is_pinned ?? false,
    d: `${String(day).padStart(2, "0")} ${months[month]}`,
    mood: memory.mood,
    color: KIND_TO_COLOR[kind],
  };
}

// === GEOMETRY CONFIG ===
export const TREE_VB = { w: 1000, h: 2400 };
export const GROUND_Y = 2300;
export const TRUNK_X = 500;
export const CROWN_Y = 100;

export const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

// Year branch base point on trunk (oldest at bottom, newest near top)
export function yearBaseY(year: number): number {
  const i = YEARS.indexOf(year);
  if (i === -1) return GROUND_Y - 50;
  const t = i / (YEARS.length - 1);
  return 2150 - t * (2150 - 400);
}

export interface YearTip {
  x: number;
  y: number;
  side: 1 | -1;
  baseY: number;
  len: number;
}

export function yearTip(year: number): YearTip {
  const i = YEARS.indexOf(year);
  const side: 1 | -1 = i % 2 === 0 ? -1 : 1;
  const baseY = yearBaseY(year);
  const t = i / (YEARS.length - 1);
  const len = 360 - t * 80;
  const tipX = TRUNK_X + side * len;
  const tipY = baseY - len * 0.55;
  return { x: tipX, y: tipY, side, baseY, len };
}

export function yearPath(year: number): string {
  const { x: tx, y: ty, side, baseY, len } = yearTip(year);
  const cp1x = TRUNK_X + side * len * 0.45;
  const cp1y = baseY - 8;
  const cp2x = TRUNK_X + side * len * 0.85;
  const cp2y = ty + 30;
  return `M ${TRUNK_X} ${baseY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
}

export function yearPointAt(
  year: number,
  t: number,
): { x: number; y: number; dx: number; dy: number; side: 1 | -1 } {
  const { x: tx, y: ty, side, baseY, len } = yearTip(year);
  const p0x = TRUNK_X;
  const p0y = baseY;
  const p1x = TRUNK_X + side * len * 0.45;
  const p1y = baseY - 8;
  const p2x = TRUNK_X + side * len * 0.85;
  const p2y = ty + 30;
  const p3x = tx;
  const p3y = ty;
  const u = 1 - t;
  const x =
    u * u * u * p0x +
    3 * u * u * t * p1x +
    3 * u * t * t * p2x +
    t * t * t * p3x;
  const y =
    u * u * u * p0y +
    3 * u * u * t * p1y +
    3 * u * t * t * p2y +
    t * t * t * p3y;
  const dx =
    3 * u * u * (p1x - p0x) +
    6 * u * t * (p2x - p1x) +
    3 * t * t * (p3x - p2x);
  const dy =
    3 * u * u * (p1y - p0y) +
    6 * u * t * (p2y - p1y) +
    3 * t * t * (p3y - p2y);
  return { x, y, dx, dy, side };
}

export const SEASON_MONTHS: Record<Season, number[]> = {
  spring: [2, 3, 4],
  summer: [5, 6, 7],
  autumn: [8, 9, 10],
  winter: [11, 0, 1],
};

export const SEASON_ORDER: Season[] = ["winter", "spring", "summer", "autumn"];

export function monthSeason(month: number): Season {
  for (const s of SEASON_ORDER) {
    if (SEASON_MONTHS[s].includes(month)) return s;
  }
  return "spring";
}

function seasonT(season: Season): number {
  const i = SEASON_ORDER.indexOf(season);
  return 0.3 + i * 0.18;
}

export interface SeasonTip {
  baseX: number;
  baseY: number;
  tipX: number;
  tipY: number;
  side: 1 | -1;
}

export function seasonTip(year: number, season: Season): SeasonTip {
  const t = seasonT(season);
  const base = yearPointAt(year, t);
  const len = Math.sqrt(base.dx * base.dx + base.dy * base.dy) || 1;
  const upBias = -0.7;
  const nx = (-base.dy / len) * 0.5 + base.side * 0.5;
  const ny = (base.dx / len) * 0.5 + upBias;
  const subLen = 80 + (Math.abs(nx) + Math.abs(ny)) * 10;
  const nl = Math.sqrt(nx * nx + ny * ny);
  const ux = nx / nl;
  const uy = ny / nl;
  return {
    baseX: base.x,
    baseY: base.y,
    tipX: base.x + ux * subLen,
    tipY: base.y + uy * subLen,
    side: base.side,
  };
}

export function seasonPath(year: number, season: Season): string {
  const s = seasonTip(year, season);
  const cpx = (s.baseX + s.tipX) / 2 + s.side * 8;
  const cpy = (s.baseY + s.tipY) / 2 - 12;
  return `M ${s.baseX} ${s.baseY} Q ${cpx} ${cpy}, ${s.tipX} ${s.tipY}`;
}

export function seasonPointAt(
  year: number,
  season: Season,
  t: number,
): { x: number; y: number; side: 1 | -1 } {
  const s = seasonTip(year, season);
  const cpx = (s.baseX + s.tipX) / 2 + s.side * 8;
  const cpy = (s.baseY + s.tipY) / 2 - 12;
  const u = 1 - t;
  const x = u * u * s.baseX + 2 * u * t * cpx + t * t * s.tipX;
  const y = u * u * s.baseY + 2 * u * t * cpy + t * t * s.tipY;
  return { x, y, side: s.side };
}

export interface MonthTip {
  baseX: number;
  baseY: number;
  tipX: number;
  tipY: number;
  side: 1 | -1;
}

export function monthTip(year: number, month: number): MonthTip {
  const season = monthSeason(month);
  const idx = SEASON_MONTHS[season].indexOf(month);
  const t = 0.45 + idx * 0.22;
  const base = seasonPointAt(year, season, t);
  const rng = seedRand((year * 100 + month) * 7);
  const angle = (rng() - 0.5) * 0.8 + (base.side > 0 ? -0.5 : 0.5);
  const len = 28 + rng() * 14;
  return {
    baseX: base.x,
    baseY: base.y,
    tipX: base.x + Math.cos(angle) * len * base.side,
    tipY: base.y - Math.sin(angle + Math.PI / 2) * len,
    side: base.side,
  };
}

export function monthPath(year: number, month: number): string {
  const m = monthTip(year, month);
  return `M ${m.baseX} ${m.baseY} Q ${(m.baseX + m.tipX) / 2} ${
    (m.baseY + m.tipY) / 2 - 6
  }, ${m.tipX} ${m.tipY}`;
}

export function monthPointAt(
  year: number,
  month: number,
  t: number,
): { x: number; y: number } {
  const m = monthTip(year, month);
  const u = 1 - t;
  const cpx = (m.baseX + m.tipX) / 2;
  const cpy = (m.baseY + m.tipY) / 2 - 6;
  return {
    x: u * u * m.baseX + 2 * u * t * cpx + t * t * m.tipX,
    y: u * u * m.baseY + 2 * u * t * cpy + t * t * m.tipY,
  };
}

export function eventPos(ev: LifeEvent): { x: number; y: number } {
  const t = 0.55 + (ev.day / 31) * 0.45;
  const p = monthPointAt(ev.year, ev.month, t);
  const rng = seedRand(
    (ev.id.charCodeAt(1) || 0) + ev.day * 13 + ev.month * 7,
  );
  return {
    x: p.x + (rng() - 0.5) * 14,
    y: p.y + (rng() - 0.5) * 14,
  };
}

// === ZOOM TARGETING ===
export function zoomViewBox(level: ZoomLevel, focus: ZoomFocus = {}): string {
  if (level === "all") {
    return `0 0 ${TREE_VB.w} ${TREE_VB.h}`;
  }
  if (level === "year" && focus.year) {
    const tip = yearTip(focus.year);
    const cx = (TRUNK_X + tip.x) / 2;
    const cy = (tip.baseY + tip.y) / 2;
    const w = 700;
    const h = 500;
    return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  }
  if (level === "season" && focus.year && focus.season) {
    const s = seasonTip(focus.year, focus.season);
    const cx = (s.baseX + s.tipX) / 2;
    const cy = (s.baseY + s.tipY) / 2;
    const w = 380;
    const h = 280;
    return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  }
  if (level === "month" && focus.year && focus.month != null) {
    const m = monthTip(focus.year, focus.month);
    const cx = (m.baseX + m.tipX) / 2;
    const cy = (m.baseY + m.tipY) / 2;
    const w = 220;
    const h = 170;
    return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  }
  if (level === "week" && focus.year && focus.month != null) {
    const m = monthTip(focus.year, focus.month);
    const wk = focus.week || 1;
    const t = 0.4 + (wk - 1) * 0.18;
    const u = 1 - t;
    const cx =
      u * u * m.baseX + 2 * u * t * ((m.baseX + m.tipX) / 2) + t * t * m.tipX;
    const cy =
      u * u * m.baseY +
      2 * u * t * ((m.baseY + m.tipY) / 2 - 6) +
      t * t * m.tipY;
    return `${cx - 90} ${cy - 70} 180 140`;
  }
  return `0 0 ${TREE_VB.w} ${TREE_VB.h}`;
}

// === LOOKUPS ===
export const KIND_TO_COLOR: Record<EventKind, string> = {
  leaf: "#7FA847",
  flower: "#E8A2B8",
  fruit: "#C13E3E",
  dryleaf: "#A8804A",
  bud: "#C8E07A",
  sparkle: "#E8826B",
};

export const KIND_STYLE: Record<EventKind, { color: string; fill: string }> = {
  leaf: { color: "#5E8F4A", fill: "#9FC580" },
  flower: { color: "#D17A95", fill: "#F2C5D1" },
  fruit: { color: "#A82E2E", fill: "#E25656" },
  dryleaf: { color: "#9C6F3D", fill: "#D9B280" },
  bud: { color: "#7A9F4A", fill: "#C8E07A" },
  sparkle: { color: "#D8624C", fill: "#F4B49E" },
};

export const NOW = { year: 2026, month: 4, day: 3 };

export const MONTHS_TR_LONG = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
];
export const MONTHS_TR_SHORT = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
];
export const SEASON_TR: Record<Season, string> = {
  spring: "İlkbahar",
  summer: "Yaz",
  autumn: "Sonbahar",
  winter: "Kış",
};
