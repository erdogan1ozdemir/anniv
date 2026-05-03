import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { CategoryHero, CategoryLucideIcon } from "@/components/svg/CategoryIcons";
import { getMemoriesForDay, loadMemories } from "@/lib/data";
import { CATEGORY_META } from "@/lib/categories";

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
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const memories = await getMemoriesForDay(month, day);

  // Find a featured one (oldest if any)
  const featured = memories[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 0 96px",
        background:
          "radial-gradient(120% 50% at 50% 0%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 60%), var(--surface)",
      }}
    >
      <header style={{ padding: "0 22px", marginBottom: 28 }}>
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
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-accent)",
              color: "var(--accent)",
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            {day} {MONTHS[today.getMonth()]}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 28,
              color: "var(--text)",
              marginTop: 4,
              lineHeight: 1.1,
            }}
          >
            geçmiş yıllarda <em style={{ color: "var(--accent)" }}>bugün</em>
          </h1>
        </div>
      </header>

      {memories.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            padding: "32px 24px",
          }}
        >
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}>🌱</div>
          <p
            style={{
              fontFamily: "var(--font-accent)",
              color: "var(--text-muted)",
              fontSize: 22,
              lineHeight: 1.4,
            }}
          >
            bugün için bir anı yok ama yeni bir tane eklemenin tam zamanı
          </p>
        </div>
      ) : (
        <>
          {featured && (
            <Link
              href={`/ani/${featured.id}`}
              style={{
                display: "block",
                margin: "0 22px 20px",
                background: "var(--surface-2)",
                border: "1px solid var(--border-soft)",
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  padding: "28px 24px",
                  background:
                    "radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent) 18%, transparent) 0%, transparent 60%), color-mix(in srgb, var(--surface) 80%, transparent)",
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    color: "var(--primary)",
                    filter: "drop-shadow(0 2px 8px rgba(45,61,58,0.08))",
                  }}
                >
                  <CategoryHero
                    category={featured.category}
                    size={92}
                    primary="var(--primary)"
                    accent="var(--accent)"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontStyle: "italic",
                      fontSize: 26,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    {featured.date.slice(0, 4)}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 18,
                      color: "var(--text)",
                      lineHeight: 1.2,
                      marginTop: 4,
                    }}
                  >
                    {featured.title}
                  </div>
                  {featured.subtitle && (
                    <div
                      style={{
                        fontFamily: "var(--font-accent)",
                        color: "var(--primary)",
                        fontSize: 15,
                        marginTop: 4,
                      }}
                    >
                      {featured.subtitle}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )}

          {memories.length > 1 && (
            <div style={{ padding: "0 22px" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                  fontWeight: 600,
                }}
              >
                Aynı tarihte daha fazlası
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {memories.slice(1).map((memory) => {
                  const year = memory.date.slice(0, 4);
                  const meta = CATEGORY_META[memory.category];
                  return (
                    <Link
                      key={memory.id}
                      href={`/ani/${memory.id}`}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "center",
                        padding: 14,
                        background: "var(--surface-2)",
                        border: "1px solid var(--border-soft)",
                        borderRadius: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background:
                            "color-mix(in srgb, var(--primary) 12%, transparent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--primary)",
                          flexShrink: 0,
                        }}
                      >
                        <CategoryLucideIcon category={memory.category} size={22} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontStyle: "italic",
                            fontSize: 18,
                            color: "var(--accent)",
                            lineHeight: 1,
                          }}
                        >
                          {year}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: 15,
                            color: "var(--text)",
                            lineHeight: 1.2,
                            marginTop: 3,
                          }}
                        >
                          {memory.title}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            marginTop: 4,
                          }}
                        >
                          {meta?.label ?? memory.category}
                          {memory.location && (
                            <>
                              <span style={{ color: "var(--border)", margin: "0 6px" }}>·</span>
                              {memory.location.name}
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <BottomNav />
    </main>
  );
}
