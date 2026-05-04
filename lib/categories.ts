import type { MemoryCategory } from "@/types";

export const CATEGORY_META: Record<
  string,
  { label: string; emoji: string; tone: string }
> = {
  kilometre_tasi: { label: "Kilometre Taşı", emoji: "🪐", tone: "fruit" },
  ilkler: { label: "İlk'ler", emoji: "🌿", tone: "bud" },
  yildonumu: { label: "Yıldönümü", emoji: "💐", tone: "flower" },
  gezi: { label: "Geziler", emoji: "✈️", tone: "leaf" },
  ozelgun: { label: "Özel Gün", emoji: "🎂", tone: "flower" },
  jedi: { label: "Jedi", emoji: "🐈", tone: "sparkle" },
  donumnoktasi: { label: "Dönüm Noktası", emoji: "🪴", tone: "fruit" },
  kucuksey: { label: "Küçük Şeyler", emoji: "🤍", tone: "leaf" },
  mektup: { label: "Mektup / Sözler", emoji: "💌", tone: "flower" },
  kahve: { label: "Kahve", emoji: "☕", tone: "leaf" },
  maker: { label: "Maker Projeleri", emoji: "🎨", tone: "fruit" },
  sarki: { label: "Şarkılarımız", emoji: "🎵", tone: "leaf" },
  game: { label: "Game Night", emoji: "🎮", tone: "leaf" },
  hayat: { label: "Hayat", emoji: "🌳", tone: "fruit" },
};

export function getCategoryMeta(category: string) {
  return (
    CATEGORY_META[category] ?? {
      label: category,
      emoji: "·",
      tone: "leaf",
    }
  );
}

export function formatTurkishDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return iso;
  const months = [
    "ocak",
    "şubat",
    "mart",
    "nisan",
    "mayıs",
    "haziran",
    "temmuz",
    "ağustos",
    "eylül",
    "ekim",
    "kasım",
    "aralık",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function shortTurkishDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return iso;
  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Returns a Turkish phrase like "5 yıl 3 ay sonra" / "8 ay sonra" / "12 gün sonra"
 * describing how much later `target` happened relative to `from`.
 * Used for the "since" banner above each memory.
 */
export function formatRelativeSince(from: string, target: string): string {
  const a = new Date(from + "T00:00:00");
  const b = new Date(target + "T00:00:00");
  if (Number.isNaN(a.valueOf()) || Number.isNaN(b.valueOf())) return "";
  const sign = b.getTime() < a.getTime() ? -1 : 1;
  const earlier = sign === 1 ? a : b;
  const later = sign === 1 ? b : a;
  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();
  if (days < 0) {
    months -= 1;
    days += 30;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yıl`);
  if (months > 0) parts.push(`${months} ay`);
  if (years === 0 && months === 0) parts.push(`${days} gün`);
  if (parts.length === 0) parts.push("aynı gün");
  const joined = parts.join(" ");
  return sign === -1 ? `${joined} önce` : `${joined} sonra`;
}
