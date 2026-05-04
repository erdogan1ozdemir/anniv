// Important "anchor" dates the Sayaç screen counts and that the
// memory-detail banner uses for relative phrasing.

export interface AnchorDate {
  id: string;
  label: string;
  emoji: string;
  hue: { from: string; to: string };
  /** ISO yyyy-mm-dd of the original event. Year is ignored for "yearly" recurrence. */
  date: string;
  recurrence: "yearly" | "once";
  /** Genitive Turkish phrasing for the count line — defaults to "yıldönümü". */
  countNoun?: string;
  /** When set, clicking the card navigates to this memory id. */
  memoryId?: string;
}

export const ANCHORS: AnchorDate[] = [
  {
    id: "zqwqz-tanisma",
    label: "Tanışma (ZQWQZ)",
    emoji: "💬",
    hue: { from: "#9FC5BD", to: "#5A8B7E" },
    date: "2017-09-23",
    recurrence: "yearly",
    countNoun: "yıl",
    memoryId: "2017-09-23-zqwqz-tanisma",
  },
  {
    id: "iliski-baslangici",
    label: "İlişki başlangıcı",
    emoji: "🌱",
    hue: { from: "#F2C5D1", to: "#D17A95" },
    date: "2017-11-05",
    recurrence: "yearly",
    countNoun: "yıldönümü",
    memoryId: "2017-11-05-iliski-baslangici",
  },
  {
    id: "sevgililer",
    label: "Sevgililer Günü",
    emoji: "💝",
    hue: { from: "#F2C5D1", to: "#E8826B" },
    date: "2018-02-14",
    recurrence: "yearly",
    countNoun: "Sevgililer Günü",
  },
  {
    id: "yeni-yil",
    label: "Yılbaşı",
    emoji: "🎆",
    hue: { from: "#5A8B7E", to: "#2D3D3A" },
    date: "2017-12-31",
    recurrence: "yearly",
    countNoun: "yılbaşı",
  },
  {
    id: "jedi-katildi",
    label: "Jedi ailemize katıldı",
    emoji: "🐈",
    hue: { from: "#A89376", to: "#6B5740" },
    date: "2021-01-30",
    recurrence: "yearly",
    countNoun: "yıldönümü",
  },
  // Doğum günleri — kullanıcıdan tarih bekleniyor, geldiğinde aşağıya eklenecek.
  // {
  //   id: "merve-dogum",
  //   label: "Merve'nin doğum günü",
  //   emoji: "🎂",
  //   hue: { from: "#E8D9B0", to: "#E8826B" },
  //   date: "YYYY-MM-DD",
  //   recurrence: "yearly",
  //   countNoun: "doğum günü",
  // },
  // {
  //   id: "erdogan-dogum",
  //   label: "Erdoğan'ın doğum günü",
  //   emoji: "🎂",
  //   hue: { from: "#C8E07A", to: "#7A9F4A" },
  //   date: "YYYY-MM-DD",
  //   recurrence: "yearly",
  //   countNoun: "doğum günü",
  // },
];

export interface AnchorCount {
  /** How many times this date has come around since the original. */
  occurrences: number;
  /** Days until the next occurrence (0 if today). */
  daysUntilNext: number;
  /** ISO yyyy-mm-dd of the next occurrence. */
  nextDate: string;
}

/** Counts how many times a yearly anchor has been observed up to & including `today`. */
export function countAnchor(anchor: AnchorDate, today: Date): AnchorCount {
  const start = new Date(anchor.date + "T00:00:00");
  if (anchor.recurrence === "once") {
    const happened = today.getTime() >= start.getTime();
    return {
      occurrences: happened ? 1 : 0,
      daysUntilNext: happened
        ? 0
        : Math.ceil((start.getTime() - today.getTime()) / 86_400_000),
      nextDate: anchor.date,
    };
  }
  const m = start.getMonth();
  const d = start.getDate();
  const startYear = start.getFullYear();
  const todayYear = today.getFullYear();
  let occurrences = 0;
  for (let y = startYear; y <= todayYear; y++) {
    const occ = new Date(y, m, d);
    if (occ.getTime() <= today.getTime()) occurrences++;
  }
  const thisYearOcc = new Date(todayYear, m, d);
  const next =
    thisYearOcc.getTime() >= today.getTime()
      ? thisYearOcc
      : new Date(todayYear + 1, m, d);
  const daysUntilNext = Math.max(
    0,
    Math.ceil((next.getTime() - today.getTime()) / 86_400_000),
  );
  const pad = (n: number) => String(n).padStart(2, "0");
  const nextDate = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
  return { occurrences, daysUntilNext, nextDate };
}

/** Turkish ordinal — always trailing dot. */
export function ordinalTr(n: number): string {
  return `${n}.`;
}
