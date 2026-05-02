"use client";

import Link from "next/link";
import type { Memory } from "@/types";
import { JediSilhouette } from "@/components/svg/JediSilhouette";
import { WalkingCat } from "@/components/svg/Cats";
import { shortTurkishDate } from "@/lib/categories";

interface JediScreenProps {
  memories: Memory[];
}

export function JediScreen({ memories }: JediScreenProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FFE9D6 0%, var(--surface) 50%)",
        position: "relative",
        paddingBottom: 96,
        overflow: "hidden",
      }}
    >
      <WalkingCat duration={22} size={56} color="var(--primary-deep)" opacity={0.32} bottom={140} />
      <WalkingCat
        duration={26}
        size={44}
        color="var(--primary-deep)"
        opacity={0.22}
        bottom={300}
        delay={4}
        reverse
      />

      <header
        style={{
          padding: "16px 22px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ color: "var(--primary)", fontSize: 14 }}>
          ‹ bahçe
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
          position: "relative",
          padding: "32px 24px 24px",
          background: "radial-gradient(ellipse at top, #FFE9D6 0%, transparent 70%)",
        }}
      >
        <svg
          width="100%"
          height="80"
          viewBox="0 0 350 80"
          style={{ position: "absolute", top: 16, left: 0, opacity: 0.4 }}
        >
          <path
            d="M30 60 Q60 20 100 30 M260 30 Q300 20 320 60"
            stroke="var(--primary)"
            strokeWidth="1.5"
            fill="none"
          />
          <ellipse
            cx="50"
            cy="40"
            rx="8"
            ry="3"
            fill="var(--primary)"
            opacity="0.6"
            transform="rotate(-30 50 40)"
          />
          <ellipse
            cx="80"
            cy="32"
            rx="8"
            ry="3"
            fill="var(--primary)"
            opacity="0.6"
            transform="rotate(-15 80 32)"
          />
          <ellipse
            cx="270"
            cy="32"
            rx="8"
            ry="3"
            fill="var(--primary)"
            opacity="0.6"
            transform="rotate(15 270 32)"
          />
          <ellipse
            cx="300"
            cy="40"
            rx="8"
            ry="3"
            fill="var(--primary)"
            opacity="0.6"
            transform="rotate(30 300 40)"
          />
        </svg>

        <div
          style={{
            margin: "20px auto 0",
            width: 170,
            height: 210,
            borderRadius: 16,
            background: "var(--surface-2)",
            border: "4px solid var(--surface-2)",
            boxShadow: "var(--shadow-lg)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 30%, #FFE9D6, var(--surface-3))",
            }}
          />
          <div style={{ position: "relative" }}>
            <JediSilhouette size={150} />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 36,
              color: "var(--text)",
            }}
          >
            <em style={{ color: "var(--accent)" }}>Jedi</em>
          </div>
          <div
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: 22,
              color: "var(--primary)",
              marginTop: 2,
            }}
          >
            canım kızımız
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 8,
          padding: "0 16px 16px",
        }}
      >
        {[
          { n: "5", l: "yaş", c: "var(--accent)" },
          { n: "5.2", l: "kg", c: "var(--primary)" },
          { n: String(memories.length), l: "anı", c: "#A89376" },
          { n: "∞", l: "miyav", c: "var(--accent)" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
              border: "1px solid var(--border-soft)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                color: s.c,
                fontStyle: "italic",
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                fontSize: 8,
                letterSpacing: 1.5,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            background: "var(--surface-2)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: "0 12px 12px 0",
            padding: 14,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: 18,
              color: "var(--text)",
              fontStyle: "italic",
            }}
          >
            miyav miyav miyav miyav
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4,
              fontStyle: "italic",
            }}
          >
            - Jedi, her sabah
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 16px 40px" }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          Hayatının <em style={{ color: "var(--accent)" }}>çizgisi</em>
        </div>
        <div
          style={{
            fontSize: 9,
            color: "var(--text-muted)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {memories.length} anı
        </div>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 0,
              bottom: 0,
              width: 2,
              background:
                "linear-gradient(180deg, var(--accent), var(--primary), var(--gold))",
              borderRadius: 1,
            }}
          />
          {memories.map((memory) => (
            <Link
              key={memory.id}
              href={`/ani/${memory.id}`}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "8px 0",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--surface-2)",
                  border: "2px solid var(--accent)",
                }}
              />
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 6,
                  background: "linear-gradient(135deg, #A89376, #D8C8AB)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🐈
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--text-muted)",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  {shortTurkishDate(memory.date)}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 14,
                    color: "var(--text)",
                  }}
                >
                  {memory.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
