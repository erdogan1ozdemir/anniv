import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { CategoryHero } from "@/components/svg/CategoryIcons";
import { loadMemories } from "@/lib/data";
import { buildClusters } from "@/lib/clusters";

export default async function CollectionsPage() {
  const memories = await loadMemories();
  const clusters = buildClusters(memories);

  // Decide hero (largest pinned cluster) for top
  const hero = clusters.find((c) => c.id === "kilometre-taslari") ?? clusters[0];
  const rest = clusters.filter((c) => c.id !== hero.id);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 0 96px",
        background:
          "linear-gradient(180deg, #F4F0E1 0%, #ECE5D2 50%, #DBD3BD 100%)",
        position: "relative",
      }}
    >
      <header style={{ padding: "0 22px 18px" }}>
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
            fontSize: 34,
            color: "#1F1B16",
            marginTop: 14,
            lineHeight: 1.05,
            letterSpacing: -0.4,
            fontWeight: 500,
          }}
        >
          Koleksiyonlar
        </h1>
        <p
          style={{
            fontFamily: "var(--font-accent)",
            color: "var(--accent)",
            fontSize: 18,
            marginTop: 6,
          }}
        >
          {memories.length} anı, {clusters.length} tema
        </p>
      </header>

      {/* Hero cluster — wide editorial card */}
      {hero && (
        <Link
          href={`/koleksiyonlar/${hero.id}`}
          style={{
            display: "block",
            margin: "0 16px 14px",
            background: `linear-gradient(135deg, ${hero.hue.from} 0%, ${hero.hue.to} 100%)`,
            borderRadius: 24,
            padding: "26px 26px 22px",
            color: "#FBF6EA",
            position: "relative",
            overflow: "hidden",
            minHeight: 220,
            boxShadow: "0 18px 40px -12px rgba(15, 17, 13, 0.18)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -10,
              top: -10,
              opacity: 0.95,
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.28))",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            <CategoryHero
              category={hero.hero}
              size={170}
              primary="rgba(255,255,255,0.95)"
              accent="rgba(255,255,255,0.55)"
            />
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "65%",
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
              ⌘ öne çıkan koleksiyon
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: 32,
                marginTop: 8,
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              {hero.label}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: 18,
                marginTop: 6,
                opacity: 0.92,
              }}
            >
              {hero.subtitle}
            </p>
            <div
              style={{
                marginTop: 18,
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.18)",
                padding: "6px 14px",
                borderRadius: 999,
                backdropFilter: "blur(8px)",
                fontWeight: 600,
              }}
            >
              {hero.count} anı
              <span style={{ opacity: 0.8 }}>›</span>
            </div>
          </div>
        </Link>
      )}

      {/* Rest — alternating row layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          padding: "0 16px",
        }}
      >
        {rest.map((cluster) => (
          <Link
            key={cluster.id}
            href={`/koleksiyonlar/${cluster.id}`}
            style={{
              background: "rgba(255, 253, 246, 0.82)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(31, 27, 22, 0.06)",
              borderRadius: 18,
              padding: "16px 14px 14px",
              minHeight: 168,
              boxShadow: "0 4px 16px -8px rgba(15, 17, 13, 0.10)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -6,
                right: -10,
                opacity: 0.92,
                filter: "drop-shadow(0 4px 12px rgba(15,17,13,0.10))",
                color: cluster.hue.from,
              }}
            >
              <CategoryHero
                category={cluster.hero}
                size={86}
                primary={cluster.hue.from}
                accent={cluster.hue.to}
              />
            </div>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: cluster.hue.from,
                  fontWeight: 600,
                }}
              >
                {cluster.count} anı
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "#1F1B16",
                  marginTop: 4,
                  lineHeight: 1.1,
                  fontWeight: 500,
                  letterSpacing: -0.2,
                }}
              >
                {cluster.label}
              </h3>
            </div>
            <div
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: 13,
                color: "#5A8B7E",
                lineHeight: 1.3,
                position: "relative",
                zIndex: 2,
              }}
            >
              {cluster.subtitle}
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
