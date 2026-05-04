# Tree zoom + Sayaç screen + memory banners — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix tree zoom semantics so tokens shrink as user zooms in (currently inverted), add long-press detail preview, replace the temporary `/harita` placeholder with a "Sayaç" screen counting how many anniversaries/birthdays/V-day's were spent together, anchor the ZQWQZ meeting (23.09.2017) into memory data, and replace numeric WhatsApp stats with a "since" banner + named badges.

**Architecture:**
- Pure client-side: data already lives in `public/data/memories.json`; new "Sayaç" screen computes counts at render time from a static anchors array + `Date.now()` (browser local clock).
- Tree zoom fix is a single constant table flip plus a viewBox-aware label sizing pass — no API change.
- Long-press popover uses pointer events on `<g>` + a portal-style absolute-positioned `<foreignObject>` inside the SVG — no new dependency.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, inline `style={{}}` (NOT Tailwind classes), Framer Motion 12 (already imported in repo). No test framework — verification is `mcp__Claude_Preview__preview_*` against the running dev server (`bahcemiz` server on port 3030).

---

## Pre-flight

Working directory: `/Users/Erdo/Desktop/Claude Projects/anniversary app/app/`. Dev server already running (`b20dc483-...`).

Each task ends with a **verify-in-preview** step (substitute for TDD red/green). If you see a regression, fix and re-verify before committing.

---

## Phase 0 — Shared helpers (foundation)

### Task 0.1: Add date-arithmetic helpers

**Files:**
- Create: `lib/anchors.ts`
- Modify: `lib/categories.ts:end-of-file` (export `formatRelativeSince`)

- [ ] **Step 1: Create `lib/anchors.ts` with the master anchor table**

```ts
// lib/anchors.ts
// Important "anchor" dates the Sayaç screen counts and that the
// memory-detail banner uses for relative phrasing.

export interface AnchorDate {
  id: string;
  label: string;       // e.g. "Tanışma (ZQWQZ)"
  emoji: string;       // single emoji shown in the disc
  hue: { from: string; to: string }; // gradient for the card
  /** ISO yyyy-mm-dd of the original event. */
  date: string;
  /** "yearly" repeats every year on the same month/day. "once" only counts elapsed time. */
  recurrence: "yearly" | "once";
  /** Optional override for genitive Turkish phrasing in the count line. */
  countNoun?: string;  // default "yıldönümü"
}

export const ANCHORS: AnchorDate[] = [
  {
    id: "zqwqz-tanisma",
    label: "Tanışma",
    emoji: "💬",
    hue: { from: "#9FC5BD", to: "#5A8B7E" },
    date: "2017-09-23",
    recurrence: "yearly",
    countNoun: "yıl",
  },
  {
    id: "iliski-baslangici",
    label: "İlişki başlangıcı",
    emoji: "🌱",
    hue: { from: "#F2C5D1", to: "#D17A95" },
    date: "2017-11-05",
    recurrence: "yearly",
    countNoun: "yıldönümü",
  },
  {
    id: "merve-dogum",
    label: "Merve'nin doğum günü",
    emoji: "🎂",
    hue: { from: "#E8D9B0", to: "#E8826B" },
    date: "1995-04-14", // year ignored for yearly count
    recurrence: "yearly",
    countNoun: "doğum günü",
  },
  {
    id: "erdogan-dogum",
    label: "Erdoğan'ın doğum günü",
    emoji: "🎂",
    hue: { from: "#C8E07A", to: "#7A9F4A" },
    date: "1994-10-14",
    recurrence: "yearly",
    countNoun: "doğum günü",
  },
  {
    id: "sevgililer",
    label: "Sevgililer Günü",
    emoji: "💝",
    hue: { from: "#F2C5D1", to: "#E8826B" },
    date: "2018-02-14", // first one we shared
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
];

export interface AnchorCount {
  /** How many times this date has come around since the original. */
  occurrences: number;
  /** Days until the next occurrence (0 if today). */
  daysUntilNext: number;
  /** ISO yyyy-mm-dd of the next occurrence. */
  nextDate: string;
}

/**
 * Counts how many times a "yearly" anchor has been observed up to and including `today`.
 * For "once" anchors, returns occurrences=1 if today >= date, else 0.
 */
export function countAnchor(anchor: AnchorDate, today: Date): AnchorCount {
  const start = new Date(anchor.date + "T00:00:00");
  if (anchor.recurrence === "once") {
    const happened = today.getTime() >= start.getTime();
    return {
      occurrences: happened ? 1 : 0,
      daysUntilNext: happened ? 0 : Math.ceil((start.getTime() - today.getTime()) / 86_400_000),
      nextDate: anchor.date,
    };
  }
  // Yearly: count years where (start.month, start.day) <= (today on that year)
  const m = start.getMonth();
  const d = start.getDate();
  const startYear = start.getFullYear();
  const todayYear = today.getFullYear();
  let occurrences = 0;
  for (let y = startYear; y <= todayYear; y++) {
    const occ = new Date(y, m, d);
    if (occ.getTime() <= today.getTime()) occurrences++;
  }
  // Find next occurrence (this year's if not yet passed, else next year's)
  const thisYearOcc = new Date(todayYear, m, d);
  const next = thisYearOcc.getTime() >= today.getTime() ? thisYearOcc : new Date(todayYear + 1, m, d);
  const daysUntilNext = Math.max(0, Math.ceil((next.getTime() - today.getTime()) / 86_400_000));
  const pad = (n: number) => String(n).padStart(2, "0");
  const nextDate = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
  return { occurrences, daysUntilNext, nextDate };
}

/** Turkish ordinal suffix for ordinals like "5." → "5.". (Always just "."). */
export function ordinalTr(n: number): string {
  return `${n}.`;
}
```

- [ ] **Step 2: Add `formatRelativeSince` to `lib/categories.ts`**

Append to the bottom of `lib/categories.ts`:

```ts
/**
 * Returns a Turkish phrase like "5 yıl 3 ay sonra" / "8 ay sonra" / "12 gün sonra"
 * describing how much later `target` happened relative to `from`.
 * Used for the "since-relationship-started" banner above each memory.
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
  if (days < 0) { months -= 1; days += 30; }
  if (months < 0) { years -= 1; months += 12; }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yıl`);
  if (months > 0) parts.push(`${months} ay`);
  if (years === 0 && months === 0) parts.push(`${days} gün`);
  if (parts.length === 0) parts.push("aynı gün");
  const joined = parts.join(" ");
  if (sign === -1) return `${joined} önce`;
  return `${joined} sonra`;
}
```

- [ ] **Step 3: Verify the helpers compile**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | head -30`
Expected: no errors mentioning `lib/anchors.ts` or `lib/categories.ts`. (Pre-existing errors in other files are tolerable for this step — only the new files must be clean.)

- [ ] **Step 4: Commit**

```bash
git add lib/anchors.ts lib/categories.ts
git commit -m "feat(lib): anchors table + relative-since helper"
```

---

## Phase 1 — Tree zoom: shrink-on-zoom + long-press popover

### Task 1.1: Invert the eventScale ramp

**Files:**
- Modify: `components/screens/TreeOfLife.tsx:518-527` (the `eventScale` ternary)

Current behavior: tokens grow as user zooms in. ViewBox shrinks faster than tokens grow — so tokens look enormous at month/week zoom and overlap each other.

Target behavior: at zoomed-in levels the **viewBox** does the magnification; tokens themselves render at *roughly the same on-screen radius* so they read as discrete glyphs. Slight scale-up at "all" because the viewBox is huge there, slight scale-down at week/moment because viewBox is tiny.

- [ ] **Step 1: Replace the eventScale ramp**

Find lines 518-527 (the existing ternary that goes 0.95 → 4.2). Replace with:

```tsx
  // Apparent on-screen size stays roughly constant: the viewBox does the
  // zoom, the token scales mildly to compensate. Token-to-viewBox ratio
  // grows just enough to keep tap targets ≥ 36px without overpowering
  // the branch they sit on.
  const eventScale =
    level === "all"
      ? 1.4
      : level === "year"
        ? 1.1
        : level === "season"
          ? 0.85
          : level === "month"
            ? 0.7
            : 0.6; // week / moment
```

- [ ] **Step 2: Verify in preview**

```js
// preview_eval, serverId b20dc483-8e42-4156-8fec-92be6637fe9f
window.location.assign('/'); 'navigating'
```

Then `preview_screenshot` and confirm:
- "all" view: tokens visible but not larger than at year view
- Click a year pill (e.g. 2024) → screenshot — tokens noticeably smaller than at "all" relative to the surrounding branch
- Click into season → smaller still, no overlap

If overlap remains at year-level, increase the perpendicular row offset (search for `rowDist` near line 992) by +12 — but try not to touch row geometry first.

- [ ] **Step 3: Commit**

```bash
git add components/screens/TreeOfLife.tsx
git commit -m "fix(tree): invert zoom→scale so tokens shrink as you zoom in"
```

### Task 1.2: Add long-press preview popover

**Files:**
- Modify: `components/screens/TreeOfLife.tsx` — `EventGlyph` (lines 128-214) gets new prop `onPreview?: (ev) => void`; `Timeline.tsx` wires the handler and renders an overlay.
- Modify: `components/screens/Timeline.tsx` — add preview state + popover overlay component.

- [ ] **Step 1: Add `onPreview` prop and pointer-event handlers to `EventGlyph`**

Replace the `EventGlyph` signature and click handler (around lines 128-155). The handler must distinguish a tap (≤300ms) from a hold (>300ms): tap fires `onClick`, hold fires `onPreview`.

```tsx
interface EventGlyphProps {
  ev: LifeEvent;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  onClick?: (ev: LifeEvent) => void;
  onPreview?: (ev: LifeEvent, anchor: { x: number; y: number }) => void;
}

function EventGlyph({ ev, x, y, scale = 1, opacity = 1, onClick, onPreview }: EventGlyphProps) {
  const style = KIND_STYLE[ev.kind];
  const radius = (ev.pinned ? 14 : 11) * scale;
  const ringColor = ev.pinned ? "#C66E3D" : style.color;
  const holdTimer = React.useRef<number | null>(null);
  const heldRef = React.useRef(false);

  const startHold = (e: React.PointerEvent) => {
    e.stopPropagation();
    heldRef.current = false;
    holdTimer.current = window.setTimeout(() => {
      heldRef.current = true;
      onPreview?.(ev, { x, y });
    }, 320);
  };
  const cancelHold = () => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };
  const endHold = (e: React.PointerEvent) => {
    e.stopPropagation();
    cancelHold();
    if (!heldRef.current) onClick?.(ev);
  };

  // ... existing JSX, but on the outer <g> replace `onClick` with:
  //   onPointerDown={startHold}
  //   onPointerUp={endHold}
  //   onPointerLeave={cancelHold}
  //   onPointerCancel={cancelHold}
  // ... and at the top of the file add: import * as React from "react";
  //     (or augment existing React import to also include `useRef`)
}
```

Make sure `React` is imported at the top of the file. The current file imports types from `@/lib/tree-data` but does not appear to import React explicitly — add `import * as React from "react";` if missing.

- [ ] **Step 2: Add preview state + popover to `Timeline.tsx`**

In `Timeline.tsx`, in the same component that renders `<TreeOfLife>`, add:

```tsx
const [preview, setPreview] = React.useState<{ ev: LifeEvent; x: number; y: number } | null>(null);
```

Pass to TreeOfLife: `onPreviewEvent={(ev, anchor) => setPreview({ ev, x: anchor.x, y: anchor.y })}`. (You'll have to thread this through TreeOfLife's props — add `onPreviewEvent?: (ev, anchor) => void` and pass it down to every `<EventGlyph onPreview={onPreviewEvent} />`.)

Render the popover ABSOLUTELY positioned over the tree wrapper (NOT inside the SVG — we want CSS layout):

```tsx
{preview && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 60,
      background: "rgba(15, 17, 13, 0.34)",
      backdropFilter: "blur(2px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}
    onClick={() => setPreview(null)}
  >
    <div
      role="dialog"
      aria-label={`${preview.ev.t} önizleme`}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "rgba(255, 253, 246, 0.97)",
        borderRadius: 18,
        padding: 18,
        maxWidth: 320,
        width: "100%",
        boxShadow: "0 20px 60px -20px rgba(15,17,13,0.45)",
        border: "1px solid rgba(31,27,22,0.08)",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{preview.ev.cat}</div>
      <div style={{
        fontFamily: "var(--font-heading)",
        fontStyle: "italic",
        fontSize: 22,
        lineHeight: 1.15,
        color: "#1F1B16",
        marginBottom: 6,
      }}>{preview.ev.t}</div>
      <div style={{
        fontSize: 11,
        letterSpacing: 1.6,
        textTransform: "uppercase",
        color: "#A38B5F",
        marginBottom: 12,
        fontWeight: 600,
      }}>{preview.ev.d}</div>
      <button
        onClick={() => { router.push(`/ani/${preview.ev.id}`); setPreview(null); }}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 999,
          border: "1px solid rgba(31,27,22,0.12)",
          background: "#1F1B16",
          color: "#FBF6EA",
          fontSize: 13,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        anıyı aç
      </button>
    </div>
  </div>
)}
```

- [ ] **Step 3: Verify in preview**

In the dev preview:
1. Open `/`
2. Tap into year `2024` (so tokens are visible)
3. Press and HOLD on a token for ~0.5s
4. Confirm: full-screen darkened overlay appears with title, emoji, date, and "anıyı aç" button
5. Tap "anıyı aç" → routes to memory detail
6. Tap-and-release (no hold) on a token → still navigates as before (tap behavior preserved)
7. Tap on the overlay backdrop → closes preview

- [ ] **Step 4: Commit**

```bash
git add components/screens/TreeOfLife.tsx components/screens/Timeline.tsx
git commit -m "feat(tree): long-press preview popover with quick-open action"
```

---

## Phase 2 — Sayaç screen (replaces Map)

### Task 2.1: New route `/sayac` and screen component

**Files:**
- Create: `components/screens/CounterScreen.tsx`
- Create: `app/sayac/page.tsx`
- Modify: `components/ui/BottomNav.tsx` — replace the `harita` entry with `sayac`.

- [ ] **Step 1: Create `components/screens/CounterScreen.tsx`**

```tsx
"use client";

import Link from "next/link";
import { ANCHORS, countAnchor, ordinalTr } from "@/lib/anchors";

const TODAY_ISO = (() => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
})();

export function CounterScreen() {
  const today = new Date(TODAY_ISO + "T00:00:00");
  const cards = ANCHORS.map((a) => ({ anchor: a, count: countAnchor(a, today) }));
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "0 0 96px",
        background: "linear-gradient(180deg, #F4F0E1 0%, #ECE5D2 50%, #DBD3BD 100%)",
      }}
    >
      <header style={{ padding: "20px 22px 0", display: "flex", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "#1F1B16", fontSize: 14, opacity: 0.8 }}>‹ bahçe</Link>
      </header>

      <section style={{ padding: "20px 22px 8px" }}>
        <div style={{
          fontSize: 11, letterSpacing: 2.4, textTransform: "uppercase",
          color: "#A38B5F", fontWeight: 600, marginBottom: 6,
        }}>sayaç</div>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontStyle: "italic",
          fontSize: 36, lineHeight: 1.05, color: "#1F1B16",
          fontWeight: 500, letterSpacing: -0.5, margin: 0,
        }}>kaç kez beraber?</h1>
        <p style={{
          fontFamily: "var(--font-accent)", fontSize: 18, color: "#5A4F3E",
          opacity: 0.85, marginTop: 8, marginBottom: 0, lineHeight: 1.35,
        }}>
          her özel günün, birlikte geçirdiğimiz sayımı.
        </p>
      </section>

      <div style={{ padding: "16px 16px 0", display: "grid", gap: 12 }}>
        {cards.map(({ anchor, count }) => (
          <article
            key={anchor.id}
            style={{
              position: "relative",
              padding: "18px 18px 16px",
              borderRadius: 18,
              background: `linear-gradient(135deg, ${anchor.hue.from} 0%, ${anchor.hue.to} 100%)`,
              color: "#FBF6EA",
              boxShadow: "0 6px 22px -10px rgba(15,17,13,0.28)",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "grid", placeItems: "center",
                fontSize: 28, flexShrink: 0,
                border: "1.5px solid rgba(255,255,255,0.35)",
              }}>{anchor.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase",
                  opacity: 0.82, fontWeight: 600, marginBottom: 4,
                }}>{anchor.label}</div>
                <div style={{
                  fontFamily: "var(--font-heading)", fontStyle: "italic",
                  fontSize: 30, lineHeight: 1.05, fontWeight: 500,
                  letterSpacing: -0.4,
                }}>
                  {ordinalTr(count.occurrences)} {anchor.countNoun ?? "yıldönümü"}
                </div>
                <div style={{
                  marginTop: 6, fontFamily: "var(--font-accent)",
                  fontSize: 15, opacity: 0.92, lineHeight: 1.3,
                }}>
                  {count.daysUntilNext === 0
                    ? "bugün!"
                    : `bir sonrakine ${count.daysUntilNext} gün`}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create the route**

Create `app/sayac/page.tsx`:

```tsx
import { CounterScreen } from "@/components/screens/CounterScreen";
import { BottomNav } from "@/components/ui/BottomNav";

export default function SayacPage() {
  return (
    <>
      <CounterScreen />
      <BottomNav />
    </>
  );
}
```

- [ ] **Step 3: Replace `/harita` with `/sayac` in BottomNav**

In `components/ui/BottomNav.tsx`, replace:

```tsx
{ href: "/harita", icon: "🗺", label: "harita", id: "map" },
```

with:

```tsx
{ href: "/sayac", icon: "⏳", label: "sayaç", id: "counter" },
```

And update `activeFor`:

```tsx
if (pathname.startsWith("/sayac")) return "counter";
// keep the harita branch so old bookmarks don't 404 (the placeholder still ships):
if (pathname.startsWith("/harita")) return "counter";
```

- [ ] **Step 4: Verify in preview**

```js
window.location.assign('/sayac'); 'navigating'
```

Then `preview_screenshot` + `preview_snapshot`. Confirm:
- Header reads "sayaç / kaç kez beraber?"
- Each anchor card shows the emoji disc + ordinal label (e.g. "9. yıl" for ZQWQZ tanışma if today is 2026-05-04)
- "bir sonrakine N gün" line is present and non-negative
- Bottom nav shows ⏳ "sayaç" highlighted on this route

Manually sanity-check ZQWQZ: today is 2026-05-04, anchor is 2017-09-23. Yearly anchor has occurred 9 times (2017, 18, 19, 20, 21, 22, 23, 24, 25 → 9). Ordinal label should be "9. yıl". Days until next: 23 Sep 2026 - 4 May 2026 = 142 days.

- [ ] **Step 5: Commit**

```bash
git add components/screens/CounterScreen.tsx app/sayac/page.tsx components/ui/BottomNav.tsx
git commit -m "feat(sayac): new counter screen replaces harita in bottom nav"
```

### Task 2.2: Keep `/harita` reachable as legacy redirect (optional polish)

**Files:**
- Modify: `app/harita/page.tsx`

- [ ] **Step 1: Make /harita render the same CounterScreen so old links still work**

```tsx
import { CounterScreen } from "@/components/screens/CounterScreen";
import { BottomNav } from "@/components/ui/BottomNav";

export default function MapPage() {
  return (
    <>
      <CounterScreen />
      <BottomNav />
    </>
  );
}
```

(Drop the `loadLocations` import — no longer needed.) The `MapScreen` component file stays in the repo for the eventual real map; nothing else imports it anymore but TypeScript will still type-check it.

- [ ] **Step 2: Verify**

`preview_eval`: navigate to `/harita`, screenshot, confirm same Sayaç content.

- [ ] **Step 3: Commit**

```bash
git add app/harita/page.tsx
git commit -m "chore(harita): redirect legacy route to sayaç screen"
```

---

## Phase 3 — Memory data: ZQWQZ anchor + sanitize metadata

### Task 3.1: Add ZQWQZ tanışma memory + sanitize metadata description

**Files:**
- Modify: `public/data/memories.json` — add a new memory at the top (chronologically before 2017-11-05) and rewrite `metadata.description`.

- [ ] **Step 1: Add the new memory to the `memories` array**

Open `public/data/memories.json`. Find the entry with `id: "2017-11-05-iliski-baslangici"` and insert this BEFORE it (so the array stays chronological):

```json
{
  "id": "2017-09-23-zqwqz-tanisma",
  "date": "2017-09-23",
  "title": "ZQWQZ'de duvarına ilk yazım",
  "subtitle": "her şeyin başladığı an",
  "category": "kilometre_tasi",
  "tags": ["zqwqz", "tanışma", "ilk"],
  "story": "Bir sosyal dizi izleme platformuydu ZQWQZ. Ben senin duvarına ilk yazdığımda 23 Eylül 2017'ydi — \"hoşgeldin\" dedim. O kelimenin nereye varacağını ikimiz de bilmiyorduk.",
  "quote": null,
  "whatsapp_excerpt": [],
  "location": null,
  "song_ref": null,
  "mood": "nostalgic",
  "is_pinned": true,
  "media_count_estimate": 0,
  "ai_confidence": 1.0,
  "anchor_type": "tanisma",
  "_batch": "manual"
}
```

- [ ] **Step 2: Rewrite `metadata.description`**

Replace the current description (which mentions "8 yıl 3 ay 16 günlük WhatsApp arşivi") with the gentler:

```json
"description": "Bahçemiz — birlikte büyüttüğümüz anılar, ZQWQZ'den bugüne."
```

Also remove or update the `data_source: "_chat.txt (168,678 mesaj)"` field — replace with:

```json
"data_source": "kendi anılarımız"
```

- [ ] **Step 3: Verify**

```bash
python3 -c "import json; d=json.load(open('public/data/memories.json')); print('total:', len(d['memories'])); print('first:', d['memories'][0]['id']); print('desc:', d['metadata']['description'])"
```

Expected: total=113, first=2017-09-23-zqwqz-tanisma, description without "168,678" or "arşiv".

Then `preview_eval`: navigate to `/ani/2017-09-23-zqwqz-tanisma`, screenshot, confirm the page renders with the new title and is_pinned styling.

- [ ] **Step 4: Commit**

```bash
git add public/data/memories.json
git commit -m "feat(data): add ZQWQZ tanışma anchor + soften metadata copy"
```

---

## Phase 4 — Memory detail: "since" banner + remove numeric stats

### Task 4.1: Add "ilişki başlayalı X yıl Y ay" banner to MemoryDetail

**Files:**
- Modify: `components/screens/MemoryDetail.tsx` — add a banner just under the date/dayName line.

- [ ] **Step 1: Compute the relative phrasing inline in `MemoryDetail`**

Near the top of the component (after `dayName`), add:

```tsx
import { formatRelativeSince } from "@/lib/categories";
const RELATIONSHIP_START = "2017-11-05";
const MEETING_DATE = "2017-09-23";
const sinceRelationship = formatRelativeSince(RELATIONSHIP_START, memory.date);
const sinceMeeting = formatRelativeSince(MEETING_DATE, memory.date);
```

(Imports go at the top of the file, the consts can stay file-scope or component-scope.)

- [ ] **Step 2: Render the banner**

Place this JSX directly above the existing `<h1>` title in the hero section (find the `formatTurkishDate(memory.date)` line and insert the banner immediately above the heading). Style:

```tsx
<div
  style={{
    display: "inline-flex",
    flexDirection: "column",
    gap: 2,
    padding: "8px 12px",
    background: "rgba(255, 253, 246, 0.55)",
    borderRadius: 12,
    border: "1px solid rgba(31, 27, 22, 0.08)",
    fontFamily: "var(--font-accent)",
    fontSize: 13,
    color: "#5A4F3E",
    marginBottom: 12,
    backdropFilter: "blur(8px)",
  }}
>
  <span>tanışmamızdan <em style={{ color: "#1F1B16", fontStyle: "italic" }}>{sinceMeeting}</em></span>
  <span>ilişkimizden <em style={{ color: "#1F1B16", fontStyle: "italic" }}>{sinceRelationship}</em></span>
</div>
```

(Skip rendering one of the lines if it returns "aynı gün önce" — i.e. the memory IS the anchor.)

- [ ] **Step 3: Verify**

`preview_eval`: navigate to `/ani/2024-01-30-jedi-3-yil`, screenshot, confirm two-line banner above the title with phrasing like "tanışmamızdan 6 yıl 4 ay sonra" / "ilişkimizden 6 yıl 2 ay sonra". Edge case: open `/ani/2017-09-23-zqwqz-tanisma` — the "tanışmamızdan" line should be hidden because the memory IS the anchor.

- [ ] **Step 4: Commit**

```bash
git add components/screens/MemoryDetail.tsx
git commit -m "feat(detail): relative-since banner above memory title"
```

### Task 4.2: Replace numeric "rekor" / "1247 mesaj" badges with named badges

**Files:**
- Search: any file with `media_count_estimate` rendered prominently
- Likely: nowhere (we already verified `grep -rn rekor|aylık|arşiv|168,678` returned nothing in components/lib/app), but double-check by scanning `whatsapp_excerpt` rendering and Jedi page

- [ ] **Step 1: Re-confirm there's nothing left to remove**

```bash
grep -rn "media_count\|messageCount\|mesajCount\|toplam mesaj\|rekor" components lib app
```

If nothing found, this task is a no-op. If found, replace each numeric stat with a named badge of the form:

```tsx
<span style={{
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "3px 8px", borderRadius: 999,
  background: "rgba(255, 253, 246, 0.85)",
  border: "1px solid rgba(31, 27, 22, 0.08)",
  fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase",
  color: "#5A4F3E", fontWeight: 600,
}}>⭐ en çok mesajlaştığımız gün</span>
```

(no number — just the badge.)

- [ ] **Step 2: If anything was changed, verify in preview, then commit**

```bash
git add <changed-files>
git commit -m "fix(copy): replace numeric stats with named badges"
```

If nothing changed, skip.

---

## Phase 5 — Jedi page: live age computation

### Task 5.1: Compute Jedi's age from a birth date instead of hardcoded "5"

**Files:**
- Modify: `components/screens/JediScreen.tsx:140-144` (the stat array)

- [ ] **Step 1: Define Jedi's birth date and compute age**

Near the top of `JediScreen` (after the props destructuring), add:

```tsx
const JEDI_BIRTH_ISO = "2020-08-01"; // adjust to actual birthday if user provides one
const today = new Date();
const birth = new Date(JEDI_BIRTH_ISO + "T00:00:00");
let yearsOld = today.getFullYear() - birth.getFullYear();
const beforeBday =
  today.getMonth() < birth.getMonth() ||
  (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
if (beforeBday) yearsOld -= 1;
```

> **Note for the user:** If Jedi's actual birth date differs, update `JEDI_BIRTH_ISO`. The constant is a single source of truth.

- [ ] **Step 2: Use `yearsOld` in the stat array**

Find the `[{ n: "5", l: "yaş" }, ...]` array (~line 140) and replace the first entry's `n` with `String(yearsOld)`. Leave kg, anı count, miyav as-is (or remove kg if user later asks).

- [ ] **Step 3: Verify**

`preview_eval`: navigate to `/jedi`, screenshot, confirm yaş tile shows correct age based on today (2026-05-04 minus 2020-08-01 → "5"). Pre-2026-08 the age should be 5; post-2026-08 it would be 6.

- [ ] **Step 4: Commit**

```bash
git add components/screens/JediScreen.tsx
git commit -m "feat(jedi): compute age from birth date instead of hardcoded value"
```

---

## Phase 6 — Tree visual upgrade (detailed trunk + canopy)

### Task 6.1: Richer trunk geometry

**Files:**
- Modify: `components/screens/TreeOfLife.tsx` — find the trunk `<path>` (search for `trunkColor` and the path with `d=` describing the trunk shape).

- [ ] **Step 1: Locate the trunk path**

```bash
grep -n "trunkColor\|trunk\|d=\".*M ${TRUNK_X}" components/screens/TreeOfLife.tsx | head
```

- [ ] **Step 2: Replace single-stroke trunk with layered trunk**

Replace the single trunk `<path>` with a **group of 3 elements**:
1. Outer shadow path: same `d`, `stroke-width` +6, color `#1F1B16`, opacity 0.18, blur via `<filter>` or CSS `filter: blur(4px)`.
2. Main trunk: existing `d`, `stroke="url(#trunkGradient)"`, `stroke-width` increased ~30% (current ~80 → 110 at base, taper to ~30 at top — use `<linearGradient>` for vertical tone variance).
3. Highlight: same `d`, `stroke="#FFF8E7"`, `stroke-width` 8, `opacity` 0.12, offset slightly to the side via `transform: translate(-3px, 0)` to suggest light from one direction.

Add this to the `<defs>` section near the top of the SVG render:

```tsx
<defs>
  <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stopColor="#3A332C" />
    <stop offset="55%" stopColor="#2C2620" />
    <stop offset="100%" stopColor="#1F1B16" />
  </linearGradient>
  <filter id="trunkShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="4" />
  </filter>
</defs>
```

- [ ] **Step 3: Add subtle bark texture (sparse, deterministic)**

Inside the trunk render, add small dark lines along the trunk axis (use the existing `seedRand(42)` pattern):

```tsx
{[...Array(14)].map((_, i) => {
  const t = i / 14;
  const y = GROUND_Y - t * (GROUND_Y - 200);
  const dx = (seedRand(900 + i)() - 0.5) * 12;
  const len = 18 + seedRand(700 + i)() * 14;
  return (
    <line
      key={`bark-${i}`}
      x1={TRUNK_X + dx - len / 2}
      x2={TRUNK_X + dx + len / 2}
      y1={y}
      y2={y - 3}
      stroke="#1F1B16"
      strokeWidth={1.2}
      strokeLinecap="round"
      opacity={0.28}
    />
  );
})}
```

- [ ] **Step 4: Verify**

`preview_screenshot` of `/`. Confirm the trunk has visible vertical tone variation (lighter top, darker base), a faint inset shadow on the right side, and bark hairlines. No abrupt edges. The branches still attach cleanly.

- [ ] **Step 5: Commit**

```bash
git add components/screens/TreeOfLife.tsx
git commit -m "feat(tree): layered trunk with gradient + bark hairlines"
```

### Task 6.2: Root system at the base

**Files:**
- Modify: `components/screens/TreeOfLife.tsx` — add 3-5 root tendrils flowing outward from the base.

- [ ] **Step 1: Insert root paths inside the same `<g>` as the trunk**

Before the trunk path, add:

```tsx
{[
  { dir: -1, len: 180, drop: 60 },
  { dir: 1, len: 200, drop: 70 },
  { dir: -1, len: 120, drop: 90 },
  { dir: 1, len: 140, drop: 100 },
  { dir: -1, len: 80, drop: 30 },
].map((r, i) => {
  const startX = TRUNK_X + r.dir * 20;
  const startY = GROUND_Y - 10;
  const endX = TRUNK_X + r.dir * r.len;
  const endY = GROUND_Y + r.drop;
  const cpX = TRUNK_X + r.dir * (r.len * 0.55);
  const cpY = GROUND_Y + 15;
  return (
    <path
      key={`root-${i}`}
      d={`M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`}
      stroke="url(#trunkGradient)"
      strokeWidth={Math.max(3, 8 - i)}
      fill="none"
      strokeLinecap="round"
      opacity={0.85 - i * 0.08}
    />
  );
})}
```

- [ ] **Step 2: Verify**

Screenshot `/`. Roots fan out at the base, thicker near trunk, taper at tips. They should not interfere with year branches (those start much higher up).

- [ ] **Step 3: Commit**

```bash
git add components/screens/TreeOfLife.tsx
git commit -m "feat(tree): root system at base"
```

---

## Phase 7 — Quality gates

### Task 7.1: `/frontend-design` review

- [ ] **Step 1:** Invoke skill `frontend-design` with focus area = "tree visual upgrade + new Sayaç screen + memory detail since-banner". Apply each suggestion as a follow-up commit. Do not change scope beyond the existing screens.

### Task 7.2: `/design-critique` pass

- [ ] **Step 1:** Invoke skill `design-critique` against the Sayaç screen at `/sayac` and the updated tree at `/`. Capture screenshots first; share them with the skill. Apply critique items as small commits.

### Task 7.3: `/accessibility-review`

- [ ] **Step 1:** Invoke skill `accessibility-review` against the same routes. Specific items to verify:
  - Long-press popover has `role="dialog"`, `aria-label`, focus trap, and Escape closes it.
  - Sayaç cards: gradient background contrast against bone-cream foreground text passes WCAG AA (4.5:1 for body, 3:1 for large heading).
  - Tap targets ≥ 44px at default zoom.
  - All emoji icons in nav have a textual label sibling (already true).

Apply fixes as commits.

---

## Phase 8 — Final verify + push

### Task 8.1: Smoke-test all routes

- [ ] **Step 1:** Run a fresh fetch against every route and confirm 200:

```js
(async () => {
  const routes = ['/', '/sayac', '/harita', '/jedi', '/koleksiyonlar', '/ani/2017-09-23-zqwqz-tanisma'];
  return Promise.all(routes.map(async r => ({ r, status: (await fetch(r)).status })));
})()
```

Expected: all 200.

- [ ] **Step 2:** Visual check on tree zoom: from `/` → click 2024 pill → click any season chip → click any month → confirm tokens shrink at each step (not grow).

### Task 8.2: Push to GitHub

- [ ] **Step 1:**

```bash
git log --oneline -15
git push origin main
```

Expected: clean push, all commits land.

---

## Self-Review checklist

After implementation, before pushing:

1. **Spec coverage**:
   - Tree zoom semantics flipped → Phase 1 ✓
   - Long-press popover → Phase 1 ✓
   - Sayaç screen + ZQWQZ + relationship + birthdays + V-day + yılbaşı + Jedi → Phase 2 + Phase 0 ANCHORS ✓
   - ZQWQZ in memories.json → Phase 3 ✓
   - "X yıl Y ay sonra" banner → Phase 4 ✓
   - Numeric stats sweep (was already empty) → Phase 4.2 ✓
   - Jedi age computed → Phase 5 ✓
   - Tree visual upgrade → Phase 6 ✓
   - frontend-design / design-critique / a11y → Phase 7 ✓

2. **Placeholder scan**: No "TBD" / "implement later" — every code block is complete.

3. **Type consistency**:
   - `AnchorDate.recurrence` is "yearly" | "once" everywhere.
   - `countAnchor` returns the same `AnchorCount` shape everywhere it's used.
   - `formatRelativeSince` parameters are `(from: string, target: string)`.
   - `EventGlyphProps.onPreview` signature matches between TreeOfLife and Timeline call sites.

If any of those drift, fix and re-verify before moving on.

---

## Execution Handoff

Plan complete and saved to `app/docs/superpowers/plans/2026-05-04-zoom-counter-banner.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task (using `superpowers:subagent-driven-development`), review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Which approach?
