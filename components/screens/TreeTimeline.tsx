"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Memory, MemoryKind } from "@/types";
import { CATEGORY_META } from "@/lib/categories";

const KIND_STYLE: Record<
  MemoryKind,
  { stroke: string; fill: string; emoji: string }
> = {
  leaf: { stroke: "#5E8F4A", fill: "#9FC580", emoji: "🌿" },
  flower: { stroke: "#D17A95", fill: "#F2C5D1", emoji: "🌸" },
  fruit: { stroke: "#A82E2E", fill: "#E25656", emoji: "🍎" },
  dryleaf: { stroke: "#9C6F3D", fill: "#D9B280", emoji: "🍂" },
  bud: { stroke: "#7A9F4A", fill: "#C8E07A", emoji: "🌱" },
  sparkle: { stroke: "#D8624C", fill: "#F4B49E", emoji: "✨" },
};

function seasonOf(month: number): "spring" | "summer" | "autumn" | "winter" {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

interface YearGroup {
  year: number;
  memories: Memory[];
}

interface TreeTimelineProps {
  groups: YearGroup[];
}

export function TreeTimeline({ groups }: TreeTimelineProps) {
  const [filter, setFilter] = useState<string>("all");
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const filteredGroups = useMemo(() => {
    if (filter === "all") return groups;
    return groups
      .map((g) => ({
        ...g,
        memories: g.memories.filter((m) => m.category === filter),
      }))
      .filter((g) => g.memories.length > 0);
  }, [groups, filter]);

  const total = useMemo(
    () => groups.reduce((sum, g) => sum + g.memories.length, 0),
    [groups],
  );

  const filterChips = useMemo(() => {
    const counts = new Map<string, number>();
    for (const g of groups) {
      for (const m of g.memories) {
        counts.set(m.category, (counts.get(m.category) ?? 0) + 1);
      }
    }
    return [
      { id: "all", label: "Tüm Hayat", emoji: "🌳", count: total },
      ...Array.from(counts.entries())
        .filter(([cat]) => CATEGORY_META[cat])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([cat, count]) => ({
          id: cat,
          label: CATEGORY_META[cat]?.label ?? cat,
          emoji: CATEGORY_META[cat]?.emoji ?? "·",
          count,
        })),
    ];
  }, [groups, total]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingBottom: 96,
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 30%), var(--surface)",
      }}
    >
      <header
        style={{
          padding: "20px 22px 12px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: 20,
              color: "var(--accent)",
              letterSpacing: 0.5,
              lineHeight: 1,
            }}
          >
            yarim&apos;in
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 30,
              fontWeight: 500,
              color: "var(--text)",
              letterSpacing: -0.4,
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            bahçesi
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--shadow-sm)",
              color: "var(--text-muted)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M11 11l3 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div
        className="scroll-soft"
        style={{
          display: "flex",
          gap: 8,
          padding: "4px 22px 16px",
          overflowX: "auto",
          scrollSnapType: "x proximity",
        }}
      >
        {filterChips.map((chip) => {
          const isActive = filter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id)}
              type="button"
              style={{
                flexShrink: 0,
                padding: "8px 14px",
                borderRadius: 999,
                background: isActive ? "var(--accent)" : "var(--surface-2)",
                color: isActive ? "var(--surface-2)" : "var(--text-muted)",
                border: isActive
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border-soft)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: 0.4,
                display: "inline-flex",
                gap: 6,
                alignItems: "center",
                transition: "all 200ms",
                scrollSnapAlign: "start",
                boxShadow: isActive ? "var(--shadow-md)" : "none",
              }}
            >
              <span>{chip.emoji}</span>
              <span>{chip.label}</span>
              <span style={{ opacity: 0.7, fontSize: 11 }}>{chip.count}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          position: "relative",
          padding: "12px 0 32px",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 16,
            bottom: 16,
            width: 8,
            background:
              "linear-gradient(180deg, #5C4733 0%, #3F2D1E 50%, #1F1408 100%)",
            borderRadius: 4,
            transform: "translateX(-50%)",
            boxShadow: "0 0 12px rgba(63,45,30,0.2)",
          }}
        />

        <div style={{ position: "relative" }}>
          {filteredGroups.map((group, idx) => (
            <YearBranch
              key={group.year}
              group={group}
              side={idx % 2 === 0 ? "left" : "right"}
              hovered={hoveredYear === group.year}
              onHover={(h) => setHoveredYear(h ? group.year : null)}
            />
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 64,
              color: "var(--text-muted)",
              fontFamily: "var(--font-accent)",
              fontSize: 22,
            }}
          >
            bu kategoride henüz bir an yok
          </div>
        )}
      </div>
    </div>
  );
}

function YearBranch({
  group,
  side,
  hovered,
  onHover,
}: {
  group: YearGroup;
  side: "left" | "right";
  hovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const grouped = useMemo(() => {
    const seasons = { spring: [], summer: [], autumn: [], winter: [] } as Record<
      string,
      Memory[]
    >;
    for (const m of group.memories) {
      const month = Number(m.date.split("-")[1]) - 1;
      seasons[seasonOf(month)].push(m);
    }
    return seasons;
  }, [group.memories]);

  return (
    <section
      style={{ position: "relative", padding: "32px 0" }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div
        style={{
          position: "absolute",
          left: side === "left" ? "calc(50% - 4px)" : "calc(50% + 4px)",
          top: 24,
          transform: side === "left" ? "translateX(-100%)" : "none",
          padding: "6px 14px",
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontSize: 28,
          color: hovered ? "var(--accent)" : "var(--text)",
          background: "var(--surface-2)",
          border: hovered ? "1px solid var(--accent)" : "1px solid var(--border-soft)",
          borderRadius: 999,
          boxShadow: "var(--shadow-sm)",
          transition: "all 300ms",
          zIndex: 3,
        }}
      >
        {group.year}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          padding: side === "left" ? "0 24px 0 0" : "0 0 0 24px",
        }}
      >
        <div
          style={{
            gridColumn: side === "left" ? "1 / 2" : "2 / 3",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingTop: 80,
          }}
        >
          {(Object.entries(grouped) as Array<
            ["spring" | "summer" | "autumn" | "winter", Memory[]]
          >).map(([season, memories]) =>
            memories.length === 0 ? null : (
              <SeasonBranch
                key={season}
                season={season}
                memories={memories}
                side={side}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

const SEASON_LABEL: Record<string, { label: string; emoji: string; color: string }> = {
  spring: { label: "ilkbahar", emoji: "🌱", color: "#9FC580" },
  summer: { label: "yaz", emoji: "🌿", color: "#5E8F4A" },
  autumn: { label: "sonbahar", emoji: "🍂", color: "#C56B3F" },
  winter: { label: "kış", emoji: "❄️", color: "#A8B5C5" },
};

function SeasonBranch({
  season,
  memories,
  side,
}: {
  season: "spring" | "summer" | "autumn" | "winter";
  memories: Memory[];
  side: "left" | "right";
}) {
  const meta = SEASON_LABEL[season];
  return (
    <div
      style={{
        position: "relative",
        background: "color-mix(in srgb, var(--surface-2) 92%, transparent)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--border-soft)",
        borderRadius: 16,
        padding: 12,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          position: "absolute",
          [side === "left" ? "right" : "left"]: -32,
          top: "50%",
          width: 32,
          height: 2,
          background: meta.color,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          fontWeight: 500,
        }}
      >
        <span>{meta.emoji}</span>
        <span>{meta.label}</span>
        <span
          style={{
            marginLeft: "auto",
            background: meta.color,
            color: "var(--surface-2)",
            padding: "1px 8px",
            borderRadius: 999,
            fontSize: 10,
          }}
        >
          {memories.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {memories.map((memory) => (
          <MemoryLeaf key={memory.id} memory={memory} />
        ))}
      </div>
    </div>
  );
}

function MemoryLeaf({ memory }: { memory: Memory }) {
  const kindStyle = KIND_STYLE[memory.kind ?? "leaf"];
  const categoryMeta = CATEGORY_META[memory.category];
  const day = Number(memory.date.split("-")[2]);
  const month = Number(memory.date.split("-")[1]);
  const monthLabel = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][month - 1];
  return (
    <Link
      href={`/ani/${memory.id}`}
      style={{
        display: "flex",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 12,
        background: "var(--surface-2)",
        border: "1px solid var(--border-soft)",
        transition: "all 200ms",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${kindStyle.fill}, ${kindStyle.stroke})`,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          boxShadow: memory.is_pinned
            ? `0 0 0 2px ${kindStyle.stroke}, 0 0 0 5px color-mix(in srgb, ${kindStyle.stroke} 30%, transparent)`
            : "none",
        }}
      >
        <span style={{ fontSize: 14 }}>
          {categoryMeta?.emoji ?? kindStyle.emoji}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 14,
            color: "var(--text)",
            lineHeight: 1.2,
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {memory.title}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--accent)",
            letterSpacing: 1,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {String(day).padStart(2, "0")} {monthLabel}
        </div>
      </div>
    </Link>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute(
      "data-theme",
      next === "dark" ? "coastal-dark" : "",
    );
    try {
      window.localStorage.setItem("bahce-theme", next);
    } catch {}
  }
  return (
    <button
      onClick={toggle}
      type="button"
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        display: "grid",
        placeItems: "center",
        boxShadow: "var(--shadow-sm)",
        color: "var(--text-muted)",
        fontSize: 14,
      }}
      aria-label="tema değiştir"
    >
      {theme === "light" ? "☾" : "☀"}
    </button>
  );
}
