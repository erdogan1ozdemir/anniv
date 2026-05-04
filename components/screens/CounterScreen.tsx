"use client";

import Link from "next/link";
import { ANCHORS, countAnchor, ordinalTr } from "@/lib/anchors";

function todayLocal(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function CounterScreen() {
  const today = todayLocal();
  const cards = ANCHORS.map((a) => ({
    anchor: a,
    count: countAnchor(a, today),
  }));

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "0 0 96px",
        background:
          "linear-gradient(180deg, #F4F0E1 0%, #ECE5D2 50%, #DBD3BD 100%)",
      }}
    >
      <header
        style={{
          padding: "20px 22px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{ color: "#1F1B16", fontSize: 14, opacity: 0.8 }}
        >
          ‹ bahçe
        </Link>
      </header>

      <section style={{ padding: "20px 22px 8px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: "#A38B5F",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          sayaç
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 36,
            lineHeight: 1.05,
            color: "#1F1B16",
            fontWeight: 500,
            letterSpacing: -0.5,
            margin: 0,
          }}
        >
          kaç kez beraber?
        </h1>
        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: 18,
            color: "#5A4F3E",
            opacity: 0.85,
            marginTop: 8,
            marginBottom: 0,
            lineHeight: 1.35,
          }}
        >
          her özel günün, birlikte geçirdiğimiz sayımı.
        </p>
      </section>

      <div
        style={{
          padding: "16px 16px 0",
          display: "grid",
          gap: 12,
        }}
      >
        {cards.map(({ anchor, count }) => {
          const card = (
            <article
              key={anchor.id}
              style={{
                position: "relative",
                padding: "18px 18px 16px",
                borderRadius: 18,
                background: `linear-gradient(135deg, ${anchor.hue.from} 0%, ${anchor.hue.to} 100%)`,
                color: "#FBF6EA",
                boxShadow: "0 6px 22px -10px rgba(15,17,13,0.28)",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden
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
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <div
                  aria-hidden
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 28,
                    flexShrink: 0,
                    border: "1.5px solid rgba(255,255,255,0.35)",
                  }}
                >
                  {anchor.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                      opacity: 0.85,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {anchor.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontStyle: "italic",
                      fontSize: 30,
                      lineHeight: 1.05,
                      fontWeight: 500,
                      letterSpacing: -0.4,
                    }}
                  >
                    {ordinalTr(count.occurrences)} {anchor.countNoun ?? "yıldönümü"}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontFamily: "var(--font-accent)",
                      fontSize: 15,
                      opacity: 0.92,
                      lineHeight: 1.3,
                    }}
                  >
                    {count.daysUntilNext === 0
                      ? "bugün ✨"
                      : `bir sonrakine ${count.daysUntilNext} gün`}
                  </div>
                </div>
                {anchor.memoryId && (
                  <div
                    aria-hidden
                    style={{
                      alignSelf: "center",
                      fontSize: 22,
                      opacity: 0.7,
                      flexShrink: 0,
                    }}
                  >
                    ›
                  </div>
                )}
              </div>
            </article>
          );

          if (anchor.memoryId) {
            return (
              <Link
                key={anchor.id}
                href={`/ani/${anchor.memoryId}`}
                style={{ textDecoration: "none" }}
                aria-label={`${anchor.label}: ${ordinalTr(count.occurrences)} ${anchor.countNoun ?? "yıldönümü"}, ilgili anıyı aç`}
              >
                {card}
              </Link>
            );
          }
          return card;
        })}
      </div>

      <p
        style={{
          padding: "20px 22px 0",
          fontFamily: "var(--font-accent)",
          fontSize: 13,
          color: "#7C6E55",
          opacity: 0.75,
          lineHeight: 1.5,
        }}
      >
        doğum günleriniz sayaca eklenmek üzere — tarihler geldikçe burada
        belirecek.
      </p>
    </main>
  );
}
