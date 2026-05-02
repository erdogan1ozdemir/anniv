"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TreeOfLife } from "./TreeOfLife";
import {
  KIND_STYLE,
  MONTHS_TR_LONG,
  MONTHS_TR_SHORT,
  NOW,
  SEASON_MONTHS,
  SEASON_TR,
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

  const bgs: Record<ZoomLevel, string> = {
    all: "radial-gradient(120% 70% at 50% 60%, var(--surface-2) 0%, var(--surface) 60%, var(--surface-3) 100%)",
    year: "radial-gradient(100% 60% at 50% 40%, var(--surface-2) 0%, var(--surface) 100%)",
    season: "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)",
    month: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)",
    week: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface-3) 100%)",
    moment:
      "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 60%, var(--surface-3) 100%)",
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
      <Breadcrumbs level={level} focus={focus} onSet={goLevel} />

      {level !== "moment" ? (
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
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
              season={season}
            />
          </div>
          {(level === "all" || level === "year") && <Legend />}
        </div>
      ) : (
        <MomentView
          events={focusedEvents.length ? focusedEvents : events}
          focus={focus}
          onOpen={onOpen}
        />
      )}
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
}: {
  events: LifeEvent[];
  focus: ZoomFocus;
  onOpen: (ev: LifeEvent) => void;
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
        {focus.year && focus.month != null
          ? `${MONTHS_TR_LONG[focus.month]} ${focus.year}`
          : "tüm anlar"}
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
