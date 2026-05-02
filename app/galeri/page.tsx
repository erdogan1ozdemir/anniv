import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { loadMemories } from "@/lib/data";
import { CATEGORY_META, shortTurkishDate } from "@/lib/categories";

export default async function GalleryPage() {
  const memories = await loadMemories();
  return (
    <main
      style={{
        minHeight: "100vh",
        paddingBottom: 96,
        padding: "20px 16px 96px",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
          padding: "0 6px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 26,
            color: "var(--text)",
          }}
        >
          galeri
        </h1>
        <span
          style={{
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          {memories.length} anı
        </span>
      </header>

      <div
        style={{
          columnCount: 2,
          columnGap: 8,
        }}
      >
        {memories.map((memory) => {
          const meta = CATEGORY_META[memory.category];
          const height = 110 + ((memory.id.length * 17) % 90);
          const gradient = `linear-gradient(${135 + ((memory.id.length * 9) % 60)}deg, var(--accent), var(--primary))`;
          return (
            <Link
              key={memory.id}
              href={`/ani/${memory.id}`}
              style={{
                display: "block",
                marginBottom: 8,
                breakInside: "avoid",
                position: "relative",
              }}
            >
              <div
                style={{
                  height,
                  borderRadius: 12,
                  background: gradient,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    right: 8,
                    color: "#FFF",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontFamily: "var(--font-heading)",
                      fontStyle: "italic",
                      lineHeight: 1.1,
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
                      fontSize: 9,
                      opacity: 0.85,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {shortTurkishDate(memory.date)}
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    fontSize: 14,
                  }}
                >
                  {meta?.emoji ?? "·"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}
