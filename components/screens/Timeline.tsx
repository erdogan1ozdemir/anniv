"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TreeOfLife } from "./TreeOfLife";
import {
  KIND_STYLE,
  MONTHS_TR_LONG,
  MONTHS_TR_SHORT,
  NOW,
  SEASON_MONTHS,
  SEASON_ORDER,
  SEASON_TR,
  YEARS,
  monthSeason,
  zoomViewBox,
  type EventKind,
  type LifeEvent,
  type Season,
  type ZoomFocus,
  type ZoomLevel,
} from "@/lib/tree-data";

const ZOOM_LEVELS: ZoomLevel[] = ["all", "year", "season", "month", "week", "moment"];
const ZOOM_LABEL: Record<ZoomLevel, string> = {
  all: "Tüm Hayat",
  year: "Yıl",
  season: "Mevsim",
  month: "Ay",
  week: "Hafta",
  moment: "An",
};

interface TimelineProps {
  events: LifeEvent[];
  season?: Season;
  isDark?: boolean;
  onToggleDark?: () => void;
}

export function Timeline({
  events,
  season = "spring",
  isDark = false,
  onToggleDark,
}: TimelineProps) {
  const router = useRouter();
  const [level, setLevel] = useState<ZoomLevel>("all");
  const [focus, setFocus] = useState<ZoomFocus>({});
  const [preview, setPreview] = useState<LifeEvent | null>(null);

  const goLevel = (newLevel: ZoomLevel) => {
    let f: ZoomFocus = { ...focus };
    const idx = ZOOM_LEVELS.indexOf(newLevel);
    if (idx >= 1 && !f.year) f.year = NOW.year;
    if (idx >= 2 && !f.season) f.season = monthSeason(NOW.month);
    if (idx >= 3 && f.month == null) f.month = NOW.month;
    if (idx >= 4 && !f.week) f.week = Math.ceil(NOW.day / 7);
    setFocus(f);
    setLevel(newLevel);
  };

  // Pinch / ctrl+wheel zoom on tree container - cycle through zoom levels
  const treeRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef<number>(0);
  const swipeStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  useEffect(() => {
    const node = treeRef.current;
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      // Only react to pinch (ctrl+wheel). Regular scroll still scrolls the page.
      if (!e.ctrlKey) return;
      e.preventDefault();
      const now = Date.now();
      if (now - wheelLockRef.current < 350) return; // throttle
      wheelLockRef.current = now;
      const idx = ZOOM_LEVELS.indexOf(level);
      if (e.deltaY > 0) {
        // pinch out → broaden scope (in moment, stay; otherwise step level)
        if (level === "moment") {
          // Moment: progressively clear focus, stay in list view
          if (focus.week) setFocus({ year: focus.year, season: focus.season, month: focus.month });
          else if (focus.month != null) setFocus({ year: focus.year, season: focus.season });
          else if (focus.season) setFocus({ year: focus.year });
          else if (focus.year) setFocus({});
          // else: at "all anlar", stay
          return;
        }
        const next = ZOOM_LEVELS[Math.max(0, idx - 1)];
        if (next !== level) goLevel(next);
      } else {
        const next = ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, idx + 1)];
        if (next !== level) goLevel(next);
      }
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [level, focus]); // eslint-disable-line react-hooks/exhaustive-deps

  const setYear = (year: number) => {
    setFocus((f) => ({ ...f, year, season: f.season ?? monthSeason(NOW.month) }));
    setLevel("year");
  };
  const setSeason = (year: number, s: Season) => {
    setFocus((f) => ({
      ...f,
      year,
      season: s,
      month:
        f.month != null && SEASON_MONTHS[s].includes(f.month)
          ? f.month
          : SEASON_MONTHS[s][1],
    }));
    setLevel("season");
  };
  const setMonth = (year: number, month: number) => {
    setFocus((f) => ({ ...f, year, season: monthSeason(month), month }));
    setLevel("month");
  };

  const onOpen = (ev: LifeEvent) => router.push(`/ani/${ev.id}`);

  // Swipe left/right shifts focus along the current zoom level.
  const SWIPE_THRESHOLD = 70;
  const shiftFocus = (dir: 1 | -1) => {
    if (level === "year" && focus.year != null) {
      const idx = YEARS.indexOf(focus.year);
      const newIdx = idx + dir;
      if (newIdx >= 0 && newIdx < YEARS.length) setYear(YEARS[newIdx]);
      return;
    }
    if (level === "season" && focus.year != null && focus.season) {
      const sIdx = SEASON_ORDER.indexOf(focus.season);
      const newSIdx = sIdx + dir;
      if (newSIdx >= 0 && newSIdx < SEASON_ORDER.length) {
        setSeason(focus.year, SEASON_ORDER[newSIdx]);
      } else {
        const yIdx = YEARS.indexOf(focus.year);
        const newYIdx = yIdx + dir;
        if (newYIdx < 0 || newYIdx >= YEARS.length) return;
        const wrapSeason =
          dir === 1
            ? SEASON_ORDER[0]
            : SEASON_ORDER[SEASON_ORDER.length - 1];
        setSeason(YEARS[newYIdx], wrapSeason);
      }
      return;
    }
    if (level === "month" && focus.year != null && focus.month != null) {
      let newY = focus.year;
      let newM = focus.month + dir;
      if (newM < 0) {
        newM = 11;
        newY -= 1;
      } else if (newM > 11) {
        newM = 0;
        newY += 1;
      }
      if (YEARS.includes(newY)) setMonth(newY, newM);
      return;
    }
    if (level === "week" && focus.year != null && focus.month != null) {
      const w = focus.week ?? 1;
      let newW = w + dir;
      if (newW >= 1 && newW <= 5) {
        setFocus((f) => ({ ...f, week: newW }));
        return;
      }
      // Roll over to neighbouring month, snap week to 1 or 4
      let newY = focus.year;
      let newM = focus.month + dir;
      if (newM < 0) {
        newM = 11;
        newY -= 1;
      } else if (newM > 11) {
        newM = 0;
        newY += 1;
      }
      if (!YEARS.includes(newY)) return;
      setFocus((f) => ({
        ...f,
        year: newY,
        season: monthSeason(newM),
        month: newM,
        week: dir === 1 ? 1 : 4,
      }));
    }
  };
  const swipeEnabled =
    level === "year" ||
    level === "season" ||
    level === "month" ||
    level === "week";

  // Native pointer-based swipe detector. Belt & suspenders alongside the
  // framer-motion drag — guarantees the gesture works on platforms where
  // framer's pan recogniser doesn't activate.
  useEffect(() => {
    const node = treeRef.current;
    if (!node || !swipeEnabled) return;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      swipeStartRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    };
    const onPointerUp = (e: PointerEvent) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const dt = Date.now() - start.t;
      // Reject long holds (likely a long-press, not a swipe)
      if (dt > 1200) return;
      // Reject vertical-dominant motion (let page scroll)
      if (Math.abs(dy) > Math.abs(dx) * 0.7) return;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      shiftFocus(dx < 0 ? 1 : -1);
    };
    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointerup", onPointerUp);
    node.addEventListener("pointercancel", () => {
      swipeStartRef.current = null;
    });
    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointerup", onPointerUp);
    };
  }, [level, focus, swipeEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // In moment view, breadcrumb / scope-broaden adjusts focus only - stays in list view
  const broadenScope = (target: ZoomLevel) => {
    if (target === "all") setFocus({});
    else if (target === "year") setFocus({ year: focus.year });
    else if (target === "season")
      setFocus({ year: focus.year, season: focus.season });
    else if (target === "month")
      setFocus({ year: focus.year, season: focus.season, month: focus.month });
    else if (target === "week") setFocus({ ...focus });
  };

  const onCrumbSet = (target: ZoomLevel) => {
    if (level === "moment") {
      broadenScope(target);
    } else {
      goLevel(target);
    }
  };

  const vb = zoomViewBox(level === "moment" ? "week" : level, focus);

  const focusedEvents = events.filter((ev) => {
    if (focus.year && ev.year !== focus.year) return false;
    if (focus.season && monthSeason(ev.month) !== focus.season) return false;
    if (focus.month != null && ev.month !== focus.month) return false;
    if (focus.week) {
      const evWeek = Math.ceil(ev.day / 7);
      if (evWeek !== focus.week) return false;
    }
    return true;
  });

  // Smooth top-to-bottom gradient backgrounds — no radial halos
  const bgs: Record<ZoomLevel, string> = {
    all: "linear-gradient(180deg, #F4F0E1 0%, #ECE5D2 38%, #DBD3BD 100%)",
    year: "linear-gradient(180deg, #F4F0E1 0%, #E8E1CC 100%)",
    season: "linear-gradient(180deg, #F2EDDE 0%, #E5DCC5 100%)",
    month: "linear-gradient(180deg, #F4F0E1 0%, #E0D7BE 100%)",
    week: "linear-gradient(180deg, #F4F0E1 0%, #DBD3BD 100%)",
    moment: "linear-gradient(180deg, #F4F0E1 0%, #E8E1CC 60%, #DBD3BD 100%)",
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: bgs[level],
        transition: "background 700ms ease",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        paddingBottom: 88,
      }}
    >
      <TopBar isDark={isDark} onToggleDark={onToggleDark} />
      <Breadcrumbs level={level} focus={focus} onSet={onCrumbSet} />
      <FocusCount count={focusedEvents.length} level={level} />

      {level !== "moment" ? (
        <div
          ref={treeRef}
          style={{
            flex: 1,
            position: "relative",
            minHeight: 0,
            touchAction: swipeEnabled ? "pan-y" : "auto",
          }}
        >
          <ZoomSlider level={level} onSet={goLevel} />
          {level === "week" && (
            <button
              onClick={() => setLevel("moment")}
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                zIndex: 5,
                padding: "8px 14px",
                borderRadius: 999,
                background: "var(--accent)",
                color: "var(--surface-2)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 500,
                boxShadow: "var(--shadow-md)",
                letterSpacing: 0.5,
              }}
            >
              ✦ Anları aç →
            </button>
          )}
          <div style={{ height: "calc(100vh - 200px)", minHeight: 600 }}>
            <TreeOfLife
              events={events}
              viewBox={vb}
              level={level}
              focus={focus}
              onSelectYear={setYear}
              onSelectSeason={setSeason}
              onSelectMonth={setMonth}
              onSelectEvent={onOpen}
              onPreviewEvent={(ev) => setPreview(ev)}
              season={season}
            />
          </div>
          {/* Legend removed per user request — kept the function below
              in case we want to bring it back behind a toggle. */}
        </div>
      ) : (
        <MomentView
          events={focusedEvents.length ? focusedEvents : events}
          focus={focus}
          onOpen={onOpen}
          onBroaden={broadenScope}
        />
      )}
      {preview && (
        <PreviewOverlay
          ev={preview}
          onClose={() => setPreview(null)}
          onOpen={(id) => {
            setPreview(null);
            router.push(`/ani/${id}`);
          }}
        />
      )}
    </div>
  );
}

function PreviewOverlay({
  ev,
  onClose,
  onOpen,
}: {
  ev: LifeEvent;
  onClose: () => void;
  onOpen: (id: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const t = window.setTimeout(() => {
      primaryBtnRef.current?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      const prev = previousFocusRef.current;
      if (prev instanceof HTMLElement) prev.focus({ preventScroll: true });
    };
  }, [onClose]);
  const style = KIND_STYLE[ev.kind];
  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(15, 17, 13, 0.42)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${ev.t} önizleme`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(255, 253, 246, 0.97)",
          borderRadius: 22,
          padding: "22px 22px 18px",
          maxWidth: 340,
          width: "100%",
          boxShadow: "0 22px 60px -22px rgba(15,17,13,0.55)",
          border: "1px solid rgba(31,27,22,0.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 14px",
            borderRadius: "50%",
            background: ev.pinned ? "#FFF8E7" : "#FBF6EA",
            border: `2.4px solid ${ev.pinned ? "#C66E3D" : style.color}`,
            display: "grid",
            placeItems: "center",
            fontSize: 32,
            boxShadow: "0 4px 16px -8px rgba(15,17,13,0.22)",
          }}
        >
          {ev.cat || "·"}
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: "#A38B5F",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {ev.d ?? ""} · {ev.year}
        </div>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.18,
            color: "#1F1B16",
            marginBottom: 18,
            fontWeight: 500,
            letterSpacing: -0.3,
          }}
        >
          {ev.t}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(31,27,22,0.18)",
              background: "transparent",
              color: "#1F1B16",
              fontSize: 12,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            kapat
          </button>
          <button
            ref={primaryBtnRef}
            onClick={() => onOpen(ev.id)}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              background: "#1F1B16",
              color: "#FBF6EA",
              fontSize: 12,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              flex: 1,
            }}
          >
            anıyı aç →
          </button>
        </div>
      </div>
    </div>
  );
}

function FocusCount({ count, level }: { count: number; level: ZoomLevel }) {
  const scopeLabel: Record<ZoomLevel, string> = {
    all: "tüm bahçede",
    year: "bu yılda",
    season: "bu mevsimde",
    month: "bu ayda",
    week: "bu haftada",
    moment: "bu pencerede",
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "4px 16px 8px",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 12px",
          borderRadius: 999,
          background: "rgba(255, 253, 246, 0.55)",
          border: "1px solid rgba(31, 27, 22, 0.08)",
          backdropFilter: "blur(6px)",
          fontSize: 11,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          fontWeight: 600,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 16,
            color: "var(--accent)",
            letterSpacing: 0,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {count}
        </span>
        <span>anı · {scopeLabel[level]}</span>
      </div>
    </div>
  );
}

function TopBar({
  isDark,
  onToggleDark,
}: {
  isDark: boolean;
  onToggleDark?: () => void;
}) {
  return (
    <div
      style={{
        padding: "14px 20px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-accent)",
          fontSize: 18,
          color: "var(--accent)",
          lineHeight: 1,
        }}
      >
        yarim&apos;in
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 14,
            fontStyle: "italic",
            color: "var(--text-muted)",
            letterSpacing: 0.5,
          }}
        >
          bahçesi
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          aria-label="Ara"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "1px solid var(--border-soft)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          🔍
        </button>
        <button
          aria-label="Tema"
          onClick={onToggleDark}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "1px solid var(--border-soft)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {isDark ? "☀" : "☾"}
        </button>
      </div>
    </div>
  );
}

function Breadcrumbs({
  level,
  focus,
  onSet,
}: {
  level: ZoomLevel;
  focus: ZoomFocus;
  onSet: (level: ZoomLevel) => void;
}) {
  const idx = ZOOM_LEVELS.indexOf(level);
  const crumbs: { label: string; level: ZoomLevel }[] = [
    { label: "Tüm Hayat", level: "all" },
  ];
  if (idx >= 1 && focus.year) crumbs.push({ label: String(focus.year), level: "year" });
  if (idx >= 2 && focus.season)
    crumbs.push({ label: SEASON_TR[focus.season], level: "season" });
  if (idx >= 3 && focus.month != null)
    crumbs.push({ label: MONTHS_TR_LONG[focus.month], level: "month" });
  if (idx >= 4 && focus.week) crumbs.push({ label: `${focus.week}. hafta`, level: "week" });
  if (idx >= 5) crumbs.push({ label: "an", level: "moment" });
  return (
    <div
      style={{
        padding: "0 20px 8px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        fontFamily: "var(--font-body)",
        fontSize: 11,
      }}
    >
      {crumbs.map((c, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => onSet(c.level)}
            style={{
              background: i === crumbs.length - 1 ? "var(--accent)" : "transparent",
              color: i === crumbs.length - 1 ? "var(--surface-2)" : "var(--text-muted)",
              border: "none",
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontFamily: "inherit",
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >
            {c.label}
          </button>
          {i < crumbs.length - 1 && (
            <span style={{ color: "var(--text-soft)", fontSize: 10 }}>›</span>
          )}
        </span>
      ))}
    </div>
  );
}

function ZoomSlider({
  level,
  onSet,
}: {
  level: ZoomLevel;
  onSet: (level: ZoomLevel) => void;
}) {
  const labels: Record<ZoomLevel, string> = {
    all: "∞",
    year: "Y",
    season: "M",
    month: "A",
    week: "H",
    moment: "·",
  };
  return (
    <div
      style={{
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 5,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 999,
        padding: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--border-soft)",
      }}
    >
      {ZOOM_LEVELS.map((l) => (
        <button
          key={l}
          onClick={() => onSet(l)}
          aria-label={ZOOM_LABEL[l]}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            background: level === l ? "var(--accent)" : "transparent",
            color: level === l ? "var(--surface-2)" : "var(--text-muted)",
            cursor: "pointer",
            fontSize: 9,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            letterSpacing: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms",
          }}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}

function Legend() {
  const items: { k: EventKind; l: string }[] = [
    { k: "leaf", l: "sıradan" },
    { k: "flower", l: "sevinç" },
    { k: "fruit", l: "değerli" },
    { k: "sparkle", l: "dönüm" },
    { k: "dryleaf", l: "hüzün" },
    { k: "bud", l: "başlangıç" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        bottom: 100,
        zIndex: 4,
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: 12,
        padding: "8px 10px",
        border: "1px solid var(--border-soft)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {items.map((i) => {
        const s = KIND_STYLE[i.k];
        return (
          <div key={i.k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="-7 -7 14 14">
              <circle r="5" fill={s.fill} stroke={s.color} strokeWidth="0.7" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                color: "var(--text-muted)",
                letterSpacing: 0.5,
              }}
            >
              {i.l}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MomentView({
  events,
  focus,
  onOpen,
  onBroaden,
}: {
  events: LifeEvent[];
  focus: ZoomFocus;
  onOpen: (ev: LifeEvent) => void;
  onBroaden?: (target: ZoomLevel) => void;
}) {
  const sorted = useMemo(
    () =>
      [...events].sort((a, b) => {
        const ad = a.year * 10000 + a.month * 100 + a.day;
        const bd = b.year * 10000 + b.month * 100 + b.day;
        return bd - ad;
      }),
    [events],
  );

  const scopeLabel = focus.week
    ? `${focus.month != null ? MONTHS_TR_LONG[focus.month] : ""} · ${focus.week}. hafta`.trim()
    : focus.month != null
      ? `${MONTHS_TR_LONG[focus.month]} ${focus.year}`
      : focus.season
        ? `${SEASON_TR[focus.season]} ${focus.year}`
        : focus.year
          ? `${focus.year}`
          : "Tüm zamanlar";

  // Show "broaden" affordance if any focus is active
  const canBroaden = Boolean(focus.year || focus.season || focus.month != null || focus.week);
  const broadenTarget: ZoomLevel = focus.week
    ? "month"
    : focus.month != null
      ? "season"
      : focus.season
        ? "year"
        : "all";

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        animation: "float-up 600ms ease-out",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "12px 24px 4px",
          fontFamily: "var(--font-accent)",
          fontSize: 16,
          color: "var(--text-muted)",
        }}
      >
        {scopeLabel}
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "0 24px 12px",
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontStyle: "italic",
          color: "var(--text)",
        }}
      >
        {sorted.length} an
      </div>

      {canBroaden && onBroaden && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 24px 16px",
          }}
        >
          <button
            type="button"
            onClick={() => onBroaden(broadenTarget)}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(255, 253, 246, 0.85)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(31,27,22,0.12)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 0.4,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14 }}>↕</span>
            Listede genişlet
          </button>
        </div>
      )}

      <div style={{ position: "relative", padding: "0 24px 80px", minHeight: 400 }}>
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
          preserveAspectRatio="none"
          viewBox={`0 0 320 ${Math.max(400, sorted.length * 110)}`}
        >
          <path
            d={sorted
              .map((_, i) => {
                const y = 30 + i * 110;
                const x = 160 + Math.sin(i * 0.7) * 60;
                return i === 0
                  ? `M ${x} ${y}`
                  : `S ${160 + Math.sin((i - 0.5) * 0.7) * 70} ${y - 55}, ${x} ${y}`;
              })
              .join(" ")}
            stroke="var(--primary)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>

        {sorted.map((m, i) => {
          const xPercent = 50 + Math.sin(i * 0.7) * 22;
          const isLeft = xPercent < 50;
          const style = KIND_STYLE[m.kind];
          return (
            <div
              key={m.id}
              style={{
                position: "relative",
                height: 100,
                marginBottom: 10,
                animation: "float-up 600ms ease-out backwards",
                animationDelay: `${i * 70}ms`,
              }}
            >
              <button
                onClick={() => onOpen(m)}
                style={{
                  position: "absolute",
                  left: `calc(${xPercent}% - 22px)`,
                  top: 18,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: `2px solid ${style.color}`,
                  background: style.fill,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  padding: 0,
                  boxShadow: `0 4px 12px ${style.color}40`,
                  zIndex: 2,
                }}
              >
                {m.cat}
              </button>

              <button
                onClick={() => onOpen(m)}
                style={{
                  position: "absolute",
                  ...(isLeft ? { right: 0 } : { left: 0 }),
                  top: 8,
                  width: "calc(50% - 30px)",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  textAlign: isLeft ? "right" : "left",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--text)",
                    marginBottom: 2,
                  }}
                >
                  {m.t}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  {String(m.day).padStart(2, "0")} {MONTHS_TR_SHORT[m.month]} {m.year}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
