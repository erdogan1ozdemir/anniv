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
