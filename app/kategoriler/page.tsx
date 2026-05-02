import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { CategoryHero } from "@/components/svg/CategoryIcons";
import { loadMemories } from "@/lib/data";
import { CATEGORY_META } from "@/lib/categories";

export default async function CategoriesPage() {
  const memories = await loadMemories();
  const counts = new Map<string, number>();
  for (const memory of memories) {
    counts.set(memory.category, (counts.get(memory.category) ?? 0) + 1);
  }
  const categories = Array.from(counts.entries())
    .map(([key, count]) => ({
      key,
      count,
      meta: CATEGORY_META[key] ?? { label: key, emoji: "·", tone: "leaf" },
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px 96px",
        background:
          "radial-gradient(120% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 50%), var(--surface)",
      }}
    >
      <header style={{ padding: "0 6px 24px" }}>
        <Link
          href="/"
          style={{
            color: "var(--primary)",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ‹ bahçe
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 32,
            color: "var(--text)",
            marginTop: 12,
            lineHeight: 1.05,
          }}
        >
          Tüm <em style={{ color: "var(--accent)" }}>etiketler</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-accent)",
            color: "var(--primary)",
            fontSize: 18,
            marginTop: 6,
          }}
        >
          {memories.length} anı, {categories.length} koleksiyon
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {categories.map((category, i) => {
          const isWide = i === 0; // first/biggest gets wide treatment
          const heroSize = isWide ? 110 : 84;
          return (
            <Link
              key={category.key}
              href={`/?cat=${category.key}`}
              style={{
                gridColumn: isWide ? "1 / -1" : "auto",
                background: "var(--surface-2)",
                border: "1px solid var(--border-soft)",
                borderRadius: 16,
                padding: isWide ? "20px 18px" : "16px 12px",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: isWide ? "row" : "column",
                alignItems: "center",
                gap: isWide ? 16 : 8,
                textAlign: isWide ? "left" : "center",
                minHeight: isWide ? 120 : 160,
                transition: "transform 200ms, box-shadow 200ms",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  color: "var(--primary)",
                  filter: "drop-shadow(0 2px 8px rgba(45,61,58,0.06))",
                }}
              >
                <CategoryHero
                  category={category.key}
                  size={heroSize}
                  primary="var(--primary)"
                  accent="var(--accent)"
                />
              </div>
              <div style={{ flex: isWide ? 1 : "initial", minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: isWide ? 22 : 16,
                    color: "var(--text)",
                    fontWeight: 500,
                    lineHeight: 1.15,
                  }}
                >
                  {category.meta.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    color: "var(--accent)",
                    fontSize: isWide ? 18 : 14,
                    marginTop: 2,
                  }}
                >
                  {category.count} anı
                </div>
                {isWide && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginTop: 8,
                    }}
                  >
                    En kalabalık koleksiyonumuz {category.meta.emoji}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}
