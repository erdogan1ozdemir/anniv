import { promises as fs } from "fs";
import path from "path";
import type {
  Memory,
  MemoriesPayload,
  GlossaryTerm,
  LocationEntry,
  MemoryCategory,
  MemoryKind,
} from "@/types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

let cachedMemories: Memory[] | null = null;

const KIND_BY_CATEGORY: Record<string, MemoryKind> = {
  kilometre_tasi: "fruit",
  yildonumu: "flower",
  ilkler: "bud",
  jedi: "sparkle",
  ozelgun: "flower",
  gezi: "leaf",
  donumnoktasi: "fruit",
  kucuksey: "leaf",
  mektup: "flower",
  kahve: "leaf",
  maker: "fruit",
  sarki: "leaf",
  game: "leaf",
  hayat: "fruit",
};

const KIND_BY_MOOD: Record<string, MemoryKind> = {
  romantic: "flower",
  happy: "leaf",
  funny: "leaf",
  nostalgic: "dryleaf",
  bittersweet: "dryleaf",
};

function inferKind(memory: Memory): MemoryKind {
  if (memory.kind) return memory.kind;
  if (memory.is_pinned) return "fruit";
  const byCategory = KIND_BY_CATEGORY[memory.category as string];
  if (byCategory) return byCategory;
  const byMood = KIND_BY_MOOD[memory.mood as string];
  if (byMood) return byMood;
  return "leaf";
}

export async function loadMemories(): Promise<Memory[]> {
  if (cachedMemories) return cachedMemories;
  const file = path.join(DATA_DIR, "memories.json");
  const raw = await fs.readFile(file, "utf-8");
  const payload = JSON.parse(raw) as MemoriesPayload;
  cachedMemories = payload.memories
    .map((memory) => ({ ...memory, kind: inferKind(memory) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return cachedMemories;
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  const memories = await loadMemories();
  return memories.find((m) => m.id === id) ?? null;
}

export async function getAdjacentMemories(
  id: string,
): Promise<{ prev: Memory | null; next: Memory | null }> {
  const memories = await loadMemories();
  const idx = memories.findIndex((m) => m.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? memories[idx - 1] : null,
    next: idx < memories.length - 1 ? memories[idx + 1] : null,
  };
}

export async function getRelatedMemories(
  current: Memory,
  limit = 2,
): Promise<Memory[]> {
  const memories = await loadMemories();
  return memories
    .filter((m) => m.id !== current.id)
    .filter(
      (m) =>
        m.category === current.category ||
        m.tags?.some((tag) => current.tags?.includes(tag)) ||
        m.location?.name === current.location?.name,
    )
    .slice(0, limit);
}

export async function getMemoriesByCategory(
  category: MemoryCategory | string,
): Promise<Memory[]> {
  const memories = await loadMemories();
  return memories.filter((m) => m.category === category);
}

export async function getMemoriesForDay(
  month: number,
  day: number,
): Promise<Memory[]> {
  const memories = await loadMemories();
  return memories.filter((m) => {
    const [, mm, dd] = m.date.split("-").map(Number);
    return mm === month && dd === day;
  });
}

export async function getYearGroups(): Promise<
  Array<{ year: number; memories: Memory[] }>
> {
  const memories = await loadMemories();
  const map = new Map<number, Memory[]>();
  for (const memory of memories) {
    const year = Number(memory.date.slice(0, 4));
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(memory);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, list]) => ({ year, memories: list }));
}

export async function loadGlossary(): Promise<GlossaryTerm[]> {
  try {
    const file = path.join(DATA_DIR, "glossary.json");
    const raw = await fs.readFile(file, "utf-8");
    const data = JSON.parse(raw);
    const list = Array.isArray(data)
      ? data
      : (data.vocabulary ?? data.terms ?? []);
    return list as GlossaryTerm[];
  } catch {
    return [];
  }
}

export async function loadLocations(): Promise<LocationEntry[]> {
  try {
    const file = path.join(DATA_DIR, "locations.json");
    const raw = await fs.readFile(file, "utf-8");
    const data = JSON.parse(raw);
    const list = Array.isArray(data) ? data : (data.locations ?? []);
    return list as LocationEntry[];
  } catch {
    return [];
  }
}
