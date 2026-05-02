import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { JediPortrait } from "@/components/svg/JediSilhouette";
import { Sprig } from "@/components/svg/Botanic";
import { loadMemories } from "@/lib/data";
import { shortTurkishDate } from "@/lib/categories";

export default async function JediPage() {
  const memories = await loadMemories();
  const jediMemories = memories.filter((m) =>
    [m.category, ...(m.tags ?? [])].some((value) =>
      value?.toString().toLowerCase().includes("jedi"),
    ),
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingBottom: 96,
        background: `radial-gradient(120% 80% at 30% 0%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 50%), linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: "20px 22px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ color: "var(--primary)", fontSize: 14 }}>
          ‹ bahçeye dön
        </Link>
        <span
          style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          🐈 jedi profili
        </span>
      </header>

      <section
        style={{
          padding: "32px 22px 20px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -10,
            color: "var(--primary)",
            animation: "sway 9s ease-in-out infinite",
          }}
        >
          <Sprig size={70} opacity={0.22} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: -10,
            color: "var(--primary)",
            animation: "sway 11s ease-in-out infinite reverse",
            transform: "scaleX(-1)",
          }}
        >
          <Sprig size={70} opacity={0.22} />
        </div>

        <div style={{ display: "inline-block", position: "relative" }}>
          <JediPortrait size={180} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 36,
            color: "var(--text)",
            marginTop: 18,
            lineHeight: 1,
          }}
        >
          Jedi
        </h1>
        <p
          style={{
            fontFamily: "var(--font-accent)",
            color: "var(--accent)",
            fontSize: 22,
            marginTop: 4,
          }}
        >
          canım kızımız
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            marginTop: 24,
            background:
              "color-mix(in srgb, var(--surface-2) 70%, transparent)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--border-soft)",
            borderRadius: 16,
            padding: "14px 6px",
          }}
        >
          {[
            { num: "5", label: "yaş" },
            { num: "5.2", label: "kg" },
            { num: jediMemories.length.toString(), label: "anı" },
            { num: "∞", label: "miyav" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                borderRight:
                  i < 3 ? "1px solid var(--border-soft)" : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 22,
                  color:
                    i % 2 === 0 ? "var(--accent)" : "var(--primary)",
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        style={{
          margin: "8px 22px 24px",
          padding: 14,
          background: "color-mix(in srgb, var(--accent) 10%, transparent)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: 10,
          fontFamily: "var(--font-accent)",
          fontSize: 18,
          color: "var(--text)",
          lineHeight: 1.4,
        }}
      >
        “miyav miyav miyav miyav”
        <div
          style={{
            textAlign: "right",
            marginTop: 6,
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}
        >
          – Jedi, her sabah
        </div>
      </div>

      <section style={{ padding: "0 22px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--text)",
            }}
          >
            hayatının çizgisi
          </h2>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            {jediMemories.length} anı
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {jediMemories.map((memory) => (
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
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #A89376, #6B5740)",
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 20,
                }}
              >
                🐈
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 15,
                    color: "var(--text)",
                    lineHeight: 1.2,
                  }}
                >
                  {memory.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--accent)",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {shortTurkishDate(memory.date)}
                </div>
              </div>
            </Link>
          ))}
          {jediMemories.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: 24,
                fontFamily: "var(--font-accent)",
                fontSize: 18,
              }}
            >
              jedi anıları yakında doluyor
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
