"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Memory } from "@/types";
import { CategoryHero } from "@/components/svg/CategoryIcons";
import { CATEGORY_META, formatTurkishDate } from "@/lib/categories";

const CATEGORY_GRADIENT: Record<string, string> = {
  ilkler: "linear-gradient(135deg, #9FC580, #E8D9B0)",
  yildonumu: "linear-gradient(135deg, #F2C5D1, #E8826B)",
  gezi: "linear-gradient(135deg, #9FC5BD, #E8D9B0)",
  ozelgun: "linear-gradient(135deg, #E8D9B0, #E8826B)",
  jedi: "linear-gradient(135deg, #A89376, #6B5740)",
  donumnoktasi: "linear-gradient(135deg, #5A8B7E, #2D3D3A)",
  kucuksey: "linear-gradient(135deg, #E5EDE5, #9FC5BD)",
  mektup: "linear-gradient(135deg, #F2C5D1, #C9A876)",
  kahve: "linear-gradient(135deg, #C9A876, #6B5740)",
  maker: "linear-gradient(135deg, #5A8B7E, #C9A876)",
  sarki: "linear-gradient(135deg, #E8826B, #5A8B7E)",
  game: "linear-gradient(135deg, #5A8B7E, #E8826B)",
  kilometre_tasi: "linear-gradient(135deg, #E8826B, #5A8B7E)",
};

export function RandomReveal({ memory }: { memory: Memory }) {
  const router = useRouter();
  const meta = CATEGORY_META[memory.category];
  const gradient =
    CATEGORY_GRADIENT[memory.category] ?? "linear-gradient(135deg, #5A8B7E, #E8826B)";
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 22px 96px",
        background:
          "radial-gradient(120% 60% at 50% 20%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 60%), var(--surface)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ marginBottom: 24 }}>
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
              fontSize: 24,
              lineHeight: 1,
            }}
          >
            şanslı hatıra
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 26,
              color: "var(--text)",
              marginTop: 4,
              lineHeight: 1.1,
            }}
          >
            tesadüfen bir <em style={{ color: "var(--accent)" }}>an</em>
          </h1>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -3, y: 30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0.4, 1.2] }}
        style={{
          margin: "16px auto 24px",
          width: "100%",
          maxWidth: 360,
          background: "var(--surface-2)",
          border: "1px solid var(--border-soft)",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--accent)",
            color: "var(--surface-2)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            padding: "5px 14px",
            borderRadius: 999,
            zIndex: 2,
            boxShadow: "0 4px 12px rgba(232,130,107,0.35)",
          }}
        >
          🎲 senin için
        </div>

        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            height: 220,
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--surface-2)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.32) 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.18))",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            <CategoryHero
              category={memory.category}
              size={140}
              primary="rgba(255,255,255,0.95)"
              accent="rgba(255,255,255,0.7)"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ padding: "20px 22px 22px" }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            {formatTurkishDate(memory.date)}
            {meta && <> · {meta.label}</>}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 24,
              color: "var(--text)",
              lineHeight: 1.15,
            }}
          >
            {memory.title}
          </h2>
          {memory.subtitle && (
            <p
              style={{
                fontFamily: "var(--font-accent)",
                color: "var(--primary)",
                fontSize: 17,
                marginTop: 4,
              }}
            >
              {memory.subtitle}
            </p>
          )}
          {memory.story && (
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 15,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginTop: 12,
              }}
            >
              {memory.story.length > 140
                ? `${memory.story.slice(0, 138).trim()}...`
                : memory.story}
            </p>
          )}
        </motion.div>
      </motion.div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 4,
        }}
      >
        <Link
          href={`/ani/${memory.id}`}
          style={{
            flex: 1,
            padding: "14px 18px",
            background: "var(--accent)",
            color: "var(--surface-2)",
            borderRadius: 999,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 0.5,
            boxShadow: "var(--shadow-md)",
          }}
        >
          aç →
        </Link>
        <button
          onClick={() => router.refresh()}
          type="button"
          style={{
            flex: 1,
            padding: "14px 18px",
            background: "var(--surface-2)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            textAlign: "center",
            fontSize: 14,
            fontFamily: "inherit",
            cursor: "pointer",
            letterSpacing: 0.5,
          }}
        >
          🎲 yeniden çevir
        </button>
      </div>
    </main>
  );
}
