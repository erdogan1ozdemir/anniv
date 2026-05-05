import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/ui/BottomNav";
import { CategoryHero } from "@/components/svg/CategoryIcons";
import { loadMemories } from "@/lib/data";
import { getAllClusters, getCluster } from "@/lib/clusters";
import { CATEGORY_META, shortTurkishDate } from "@/lib/categories";

export async function generateStaticParams() {
  return getAllClusters().map((c) => ({ id: c.id }));
}

export default async function ClusterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memories = await loadMemories();
  const cluster = getCluster(id, memories);
  if (!cluster) notFound();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "0 0 96px",
        background:
          "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 50%, var(--surface-3) 100%)",
      }}
    >
      <section
        style={{
          position: "relative",
          padding: "32px 22px 36px",
          background: `linear-gradient(135deg, ${cluster.hue.from} 0%, ${cluster.hue.to} 100%)`,
          color: "#FBF6EA",
          overflow: "hidden",
          minHeight: 280,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.16) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -10,
            top: 8,
            opacity: 0.95,
            filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.28))",
          }}
        >
          <CategoryHero
            category={cluster.hero}
            size={200}
            primary="rgba(255,255,255,0.95)"
            accent="rgba(255,255,255,0.55)"
          />
        </div>
        <Link
          href="/koleksiyonlar"
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            position: "relative",
            zIndex: 2,
          }}
        >
          ‹ koleksiyonlar
        </Link>
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: 28,
            maxWidth: "70%",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.78,
              fontWeight: 600,
            }}
          >
            koleksiyon · {cluster.count} anı
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 38,
              marginTop: 10,
              lineHeight: 1.0,
              fontWeight: 500,
              letterSpacing: -0.5,
            }}
          >
            {cluster.label}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: 19,
              marginTop: 8,
              opacity: 0.92,
              lineHeight: 1.3,
            }}
          >
            {cluster.subtitle}
          </p>
        </div>
      </section>

      <div
        style={{
          padding: "20px 16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {cluster.items.map((memory, i) => {
          const meta = CATEGORY_META[memory.category];
          return (
            <Link
              key={memory.id}
              href={`/ani/${memory.id}`}
              style={{
                background: "color-mix(in srgb, var(--surface-2) 92%, transparent)",
                backdropFilter: "blur(10px)",
                border: "1px solid var(--border-soft)",
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                boxShadow: "0 2px 12px -6px rgba(15, 17, 13, 0.08)",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "var(--surface)",
                  border: `1.6px solid ${cluster.hue.from}`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 20,
                  flexShrink: 0,
                  boxShadow: "0 2px 8px -2px rgba(15,17,13,0.10)",
                }}
              >
                {meta?.emoji ?? "·"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 16,
                    color: "var(--text)",
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {memory.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: cluster.hue.from,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    marginTop: 4,
                    fontWeight: 600,
                  }}
                >
                  {shortTurkishDate(memory.date)}
                  {memory.location && (
                    <>
                      <span style={{ opacity: 0.4, margin: "0 6px" }}>·</span>
                      {memory.location.name}
                    </>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  color: cluster.hue.from,
                  opacity: 0.65,
                  flexShrink: 0,
                  fontWeight: 500,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}
