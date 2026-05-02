import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { getMemoriesForDay } from "@/lib/data";
import { CATEGORY_META, formatTurkishDate } from "@/lib/categories";

export const dynamic = "force-dynamic";

const MONTHS = [
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

export default async function TodayPage() {
  const today = new Date();
  const memories = await getMemoriesForDay(
    today.getMonth() + 1,
    today.getDate(),
  );
  return (
    <main
      style={{ minHeight: "100vh", padding: "20px 22px 96px" }}
    >
      <header style={{ marginBottom: 24, textAlign: "center" }}>
        <Link href="/" style={{ color: "var(--primary)", fontSize: 14, alignSelf: "flex-start" }}>
          ‹ bahçe
        </Link>
        <p
          style={{
            fontFamily: "var(--font-accent)",
            color: "var(--accent)",
            fontSize: 22,
            marginTop: 12,
          }}
        >
          {today.getDate()} {MONTHS[today.getMonth()]}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 24,
            color: "var(--text)",
          }}
        >
          geçmiş yıllarda <em>bugün</em>
        </h1>
      </header>

      {memories.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontFamily: "var(--font-accent)",
            fontSize: 22,
            padding: 32,
          }}
        >
          bugün için bir an yok ama yeni bir tane eklemenin tam zamanı 🌱
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {memories.map((memory) => {
            const year = memory.date.slice(0, 4);
            const meta = CATEGORY_META[memory.category];
            return (
              <Link
                key={memory.id}
                href={`/ani/${memory.id}`}
                style={{
                  display: "flex",
                  gap: 12,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 22,
                    color: "var(--accent)",
                    width: 56,
                    flexShrink: 0,
                    fontStyle: "italic",
                  }}
                >
                  {year}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 16,
                      color: "var(--text)",
                      lineHeight: 1.2,
                    }}
                  >
                    {memory.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--primary)",
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    {meta?.emoji ?? "·"} {meta?.label ?? memory.category}
                    {memory.location && (
                      <>
                        <span style={{ color: "var(--border)", margin: "0 6px" }}>
                          ·
                        </span>
                        {memory.location.name}
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
