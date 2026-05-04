// Important "anchor" dates the Sayaç screen counts and that the
// memory-detail banner uses for relative phrasing.
//
// Dates here mark the FIRST time the event was shared together
// (or for one-shot events, the event itself). Yearly counts include
// the original — so e.g. Tanışma 2017-09-23 produces 9 occurrences
// by 2026-05-04 (one for each year 2017..2025).

export interface AnchorDate {
  id: string;
  label: string;
  emoji: string;
  hue: { from: string; to: string };
  /** ISO yyyy-mm-dd of the FIRST occurrence shared together. */
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
    id: "erdogan-dogum",
    label: "Erdoğan'ın doğum günü",
    emoji: "🎂",
    hue: { from: "#C8E07A", to: "#7A9F4A" },
    date: "2018-04-14", // first one shared together (born 1994-04-14, met Sep 2017)
    recurrence: "yearly",
    countNoun: "doğum günü",
  },
  {
    id: "merve-dogum",
    label: "Merve'nin doğum günü",
    emoji: "🎂",
    hue: { from: "#E8D9B0", to: "#E8826B" },
    date: "2017-10-14", // first one shared together (gerçek 14.10.1995, kimlik 01.11)
    recurrence: "yearly",
    countNoun: "doğum günü",
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
    id: "jedi-dogum",
    label: "Jedi'nin doğum günü",
    emoji: "🎂",
    hue: { from: "#A89376", to: "#6B5740" },
    date: "2019-02-14",
    recurrence: "yearly",
    countNoun: "doğum günü",
  },
  {
    id: "jedi-katildi",
    label: "Jedi ailemize katıldı",
    emoji: "🐈",
    hue: { from: "#C9A876", to: "#6B5740" },
    date: "2019-03-31",
    recurrence: "yearly",
    countNoun: "yıldönümü",
    memoryId: "2019-03-31-jedi-geliyor",
  },
  {
    id: "nisan",
    label: "Nişan",
    emoji: "💍",
    hue: { from: "#E8D9B0", to: "#C9A876" },
    date: "2022-01-30",
    recurrence: "yearly",
    countNoun: "nişan günü",
  },
  {
    id: "evlilik",
    label: "Evlilik",
    emoji: "👰‍♀️",
    hue: { from: "#E8826B", to: "#A82E2E" },
    date: "2022-05-03",
    recurrence: "yearly",
    countNoun: "evlilik yılı",
  },
];

export interface AnchorCount {
  /**
   * Anniversaries completed since the original event. The original event
   * itself is NOT counted — so for evlilik 2022-05-03 on 2026-05-04 we
   * report 4 (yesterday was the 4th anniversary; we are heading toward
   * the 5th).
   */
  completed: number;
  /**
   * Ordinal of the upcoming anniversary (= completed + 1).
   * Used in 'sonraki N. yıldönümüne X gün' style labels.
   */
  nextOrdinal: number;
  /** Days until the next anniversary (0 if today). */
  daysUntilNext: number;
  /** ISO yyyy-mm-dd of the next anniversary. */
  nextDate: string;
}

/**
 * Returns how many anniversaries of `anchor` have been completed up to
 * `today`. The first anniversary is one full year after the original
 * event — the original event itself is year 0.
 */
export function countAnchor(anchor: AnchorDate, today: Date): AnchorCount {
  const start = new Date(anchor.date + "T00:00:00");
  if (anchor.recurrence === "once") {
    const happened = today.getTime() >= start.getTime();
    return {
      completed: happened ? 1 : 0,
      nextOrdinal: happened ? 1 : 1,
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
  // raw years between today and the original event
  let completed = todayYear - startYear;
  const thisYearOcc = new Date(todayYear, m, d);
  // If this year's anniversary hasn't occurred yet, shave one year off.
  if (thisYearOcc.getTime() > today.getTime()) completed -= 1;
  if (completed < 0) completed = 0;
  const next =
    thisYearOcc.getTime() > today.getTime()
      ? thisYearOcc
      : new Date(todayYear + 1, m, d);
  const daysUntilNext = Math.max(
    0,
    Math.ceil((next.getTime() - today.getTime()) / 86_400_000),
  );
  const pad = (n: number) => String(n).padStart(2, "0");
  const nextDate = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
  return { completed, nextOrdinal: completed + 1, daysUntilNext, nextDate };
}

/** Turkish ordinal — always trailing dot. */
export function ordinalTr(n: number): string {
  return `${n}.`;
}
