import type { Memory } from "@/types";

export interface Cluster {
  id: string;
  label: string;
  subtitle: string;
  hero: string; // category for CategoryHero
  hue: { from: string; to: string };
  filter: (memory: Memory) => boolean;
}

const CLUSTERS_RAW: Cluster[] = [
  {
    id: "kilometre-taslari",
    label: "Kilometre Taşları",
    subtitle: "her şeyin başladığı, döndüğü, bağlandığı yerler",
    hero: "kilometre_tasi",
    hue: { from: "#1F1B16", to: "#3A332C" },
    filter: (m) =>
      m.is_pinned === true ||
      m.category === "kilometre_tasi" ||
      m.kind === "sparkle",
  },
  {
    id: "ilkler",
    label: "İlk'ler",
    subtitle: "ilk kez yaşadığımız her şey",
    hero: "ilkler",
    hue: { from: "#5A8B7E", to: "#9FC5BD" },
    filter: (m) => m.category === "ilkler",
  },
  {
    id: "yildonumleri",
    label: "Yıldönümleri",
    subtitle: "geri dönüp kutladığımız günler",
    hero: "yildonumu",
    hue: { from: "#E8826B", to: "#F2C5D1" },
    filter: (m) => m.category === "yildonumu",
  },
  {
    id: "jedi-anilari",
    label: "Jedi Anıları",
    subtitle: "canım kızımızla geçen anlar",
    hero: "jedi",
    hue: { from: "#A89376", to: "#6B5740" },
    filter: (m) =>
      m.category === "jedi" ||
      (m.tags ?? []).some((t) => t.toLowerCase().includes("jedi")) ||
      (m.title ?? "").toLowerCase().includes("jedi"),
  },
  {
    id: "geziler",
    label: "Geziler",
    subtitle: "birlikte gittiğimiz yerler",
    hero: "gezi",
    hue: { from: "#9FC5BD", to: "#E8D9B0" },
    filter: (m) => m.category === "gezi" || !!m.location?.name,
  },
  {
    id: "donum-noktalari",
    label: "Dönüm Noktaları",
    subtitle: "hayatın yön değiştirdiği günler",
    hero: "donumnoktasi",
    hue: { from: "#5A8B7E", to: "#2D3D3A" },
    filter: (m) => m.category === "donumnoktasi",
  },
  {
    id: "kucuk-seyler",
    label: "Küçük Şeyler",
    subtitle: "rutin ama anlamlı, sessiz, sıcak",
    hero: "kucuksey",
    hue: { from: "#E5EDE5", to: "#9FC5BD" },
    filter: (m) => m.category === "kucuksey",
  },
  {
    id: "mektuplar",
    label: "Mektuplar",
    subtitle: "uzun konuşmalar, derin sözler",
    hero: "mektup",
    hue: { from: "#F2C5D1", to: "#C9A876" },
    filter: (m) =>
      m.category === "mektup" ||
      (Array.isArray(m.whatsapp_excerpt) && m.whatsapp_excerpt.length >= 3),
  },
  {
    id: "atolye",
    label: "Atölye",
    subtitle: "3D printer, DIY, üretim anları",
    hero: "maker",
    hue: { from: "#5A8B7E", to: "#C9A876" },
    filter: (m) =>
      m.category === "maker" ||
      (m.tags ?? []).some((t) =>
        ["3d", "maker", "diy", "stl", "print"].some((k) => t.toLowerCase().includes(k)),
      ),
  },
  {
    id: "sarkilarimiz",
    label: "Şarkılarımız",
    subtitle: "her ana eşlik eden müzik",
    hero: "sarki",
    hue: { from: "#E8826B", to: "#5A8B7E" },
    filter: (m) => Boolean(m.song_ref),
  },
  {
    id: "kahve-anlari",
    label: "Kahve Anları",
    subtitle: "bir fincanın etrafında",
    hero: "kahve",
    hue: { from: "#C9A876", to: "#6B5740" },
    filter: (m) => m.category === "kahve" ||
      (m.title ?? "").toLowerCase().includes("kahve") ||
      (m.story ?? "").toLowerCase().includes("kahve"),
  },
  {
    id: "ozel-gunler",
    label: "Özel Günler",
    subtitle: "doğum günleri, sevgililer, yılbaşları",
    hero: "ozelgun",
    hue: { from: "#E8D9B0", to: "#E8826B" },
    filter: (m) => m.category === "ozelgun",
  },
];

export function buildClusters(memories: Memory[]) {
  return CLUSTERS_RAW.map((c) => {
    const items = memories.filter(c.filter);
    return { ...c, items, count: items.length };
  }).filter((c) => c.count > 0);
}

export function getCluster(id: string, memories: Memory[]) {
  const raw = CLUSTERS_RAW.find((c) => c.id === id);
  if (!raw) return null;
  const items = memories.filter(raw.filter);
  return { ...raw, items, count: items.length };
}

export function getAllClusters() {
  return CLUSTERS_RAW;
}
