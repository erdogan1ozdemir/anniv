import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
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
        padding: "20px 16px 96px",
      }}
    >
      <header style={{ padding: "0 6px 16px" }}>
        <Link href="/" style={{ color: "var(--primary)", fontSize: 14 }}>
          ‹ bahçe
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 26,
            color: "var(--text)",
            marginTop: 8,
          }}
        >
          tüm <em>etiketler</em>
        </h1>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {categories.map((category) => (
          <div
            key={category.key}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border-soft)",
              borderRadius: 14,
              padding: "16px 10px",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ fontSize: 26, lineHeight: 1 }}>
              {category.meta.emoji}
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                color: "var(--text)",
                marginTop: 6,
              }}
            >
              {category.meta.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--accent)",
                letterSpacing: 1,
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              {category.count} anı
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
