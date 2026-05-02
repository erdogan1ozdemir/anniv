"use client";

import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Memory } from "@/types";
import { CATEGORY_META, formatTurkishDate, shortTurkishDate } from "@/lib/categories";
import { CategoryHero } from "@/components/svg/CategoryIcons";

const MOOD_TINT: Record<string, string> = {
  romantic: "color-mix(in srgb, #E8826B 16%, transparent)",
  happy: "color-mix(in srgb, #E8D9B0 28%, transparent)",
  funny: "color-mix(in srgb, #E8D9B0 22%, transparent)",
  nostalgic: "color-mix(in srgb, #C9A876 20%, transparent)",
  bittersweet: "color-mix(in srgb, #6B6249 16%, transparent)",
};

const CATEGORY_HERO_GRADIENT: Record<string, string> = {
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

interface MemoryDetailProps {
  memory: Memory;
  related: Memory[];
  prevId?: string | null;
  nextId?: string | null;
}

export function MemoryDetail({ memory, related, prevId, nextId }: MemoryDetailProps) {
  const router = useRouter();
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 90;
    if (info.offset.x < -threshold && nextId) {
      router.push(`/ani/${nextId}`);
    } else if (info.offset.x > threshold && prevId) {
      router.push(`/ani/${prevId}`);
    }
  };
  const meta = CATEGORY_META[memory.category];
  const moodTint = memory.mood ? MOOD_TINT[memory.mood] : undefined;
  const heroGradient =
    CATEGORY_HERO_GRADIENT[memory.category] ??
    "linear-gradient(135deg, #5A8B7E, #E8826B)";
  const day = new Date(memory.date);
  const dayName = !Number.isNaN(day.valueOf())
    ? ["pazar", "pzt", "sal", "çar", "prş", "cum", "cmt"][day.getDay()]
    : "";

  const paragraphs = (memory.story ?? "").split(/\n+/).filter(Boolean);

  return (
    <motion.article
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={handleDragEnd}
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingBottom: 120,
        background: moodTint
          ? `linear-gradient(180deg, ${moodTint} 0%, transparent 320px), var(--surface)`
          : "var(--surface)",
      }}
    >
      <header
        style={{
          padding: "16px 20px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
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
          ‹ bahçeye dön
        </Link>
        <div
          style={{
            display: "flex",
            gap: 14,
            color: "var(--text-muted)",
            fontSize: 16,
          }}
        >
          <span aria-hidden>♡</span>
          <span aria-hidden>↗</span>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0.4, 1] }}
        style={{
          margin: "0 16px",
          height: 280,
          borderRadius: 24,
          background: heroGradient,
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))",
            color: "var(--surface-2)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <CategoryHero
            category={memory.category}
            size={180}
            primary="rgba(255,255,255,0.95)"
            accent="rgba(255,255,255,0.65)"
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 18,
            display: "flex",
            gap: 8,
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: 11,
              color: "var(--primary-deep)",
              letterSpacing: 1,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {meta?.emoji ?? "·"} {meta?.label ?? memory.category}
          </span>
        </div>
      </motion.div>

      <div style={{ padding: "24px 22px 8px" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 6,
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span>{formatTurkishDate(memory.date)}</span>
          {dayName && (
            <>
              <span style={{ color: "var(--border)" }}>·</span>
              <span>{dayName}</span>
            </>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 32,
            fontWeight: 500,
            color: "var(--text)",
            lineHeight: 1.1,
            letterSpacing: -0.4,
          }}
        >
          {memory.title}
        </h1>

        {memory.subtitle && (
          <p
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: 22,
              color: "var(--primary)",
              marginTop: 6,
              lineHeight: 1.2,
            }}
          >
            {memory.subtitle}
          </p>
        )}

        {memory.tags && memory.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            {memory.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  background:
                    "color-mix(in srgb, var(--primary) 12%, transparent)",
                  color: "var(--primary)",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 999,
                  border:
                    "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
                }}
              >
                #{tag}
              </span>
            ))}
            {memory.is_pinned && (
              <span
                style={{
                  background:
                    "color-mix(in srgb, var(--accent) 14%, transparent)",
                  color: "var(--accent)",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 999,
                  border:
                    "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
                }}
              >
                📌 öne çıkan
              </span>
            )}
          </div>
        )}
      </div>

      {memory.quote && (
        <div
          style={{
            margin: "20px 22px",
            padding: "16px 18px",
            background: "var(--surface-2)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: 8,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 17,
              color: "var(--text)",
              lineHeight: 1.45,
            }}
          >
            “{memory.quote.replace(/^["“]|["”]$/g, "")}”
          </p>
        </div>
      )}

      <div
        style={{
          padding: "16px 24px 8px",
          fontFamily: "var(--font-heading)",
          fontSize: 17,
          color: "var(--text)",
          lineHeight: 1.65,
        }}
      >
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            style={{ marginBottom: 14 }}
            className={i === 0 ? "with-drop-cap" : undefined}
          >
            {i === 0 && paragraph.length > 0 && (
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 56,
                  fontWeight: 600,
                  color: "var(--accent)",
                  float: "left",
                  lineHeight: 0.85,
                  margin: "8px 8px 0 0",
                }}
              >
                {paragraph[0]}
              </span>
            )}
            {i === 0 ? paragraph.slice(1) : paragraph}
          </p>
        ))}
      </div>

      {memory.whatsapp_excerpt && memory.whatsapp_excerpt.length > 0 && (
        <div
          style={{
            margin: "16px 22px",
            padding: 14,
            background:
              "linear-gradient(135deg, #DCF8C6 0%, #E8F5DC 100%)",
            borderRadius: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#128C7E",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            o gün konuşmamızdan
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {memory.whatsapp_excerpt.map((msg, i) => {
              const isMe = msg.sender.toLowerCase().includes("erdoğan");
              return (
                <div
                  key={i}
                  style={{
                    background: isMe ? "#FFF" : "#FFFCF4",
                    borderRadius: isMe
                      ? "8px 8px 8px 2px"
                      : "8px 8px 2px 8px",
                    padding: "8px 10px",
                    maxWidth: "82%",
                    marginLeft: isMe ? 0 : "auto",
                    fontSize: 13,
                    color: "#3A2E2A",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
                  }}
                >
                  {msg.text}
                  <div
                    style={{
                      fontSize: 9,
                      color: "#7C7C7C",
                      marginTop: 3,
                      textAlign: "right",
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {memory.location && (
        <div
          style={{
            margin: "16px 22px",
            background: "var(--surface-2)",
            border: "1px solid var(--border-soft)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 100,
              background:
                "radial-gradient(circle at 50% 50%, rgba(232,130,107,0.3) 0%, transparent 5%), linear-gradient(135deg, #D8E5C9 0%, #B8C9A4 50%, #E8D9B0 100%)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -100%) rotate(-45deg)",
                width: 22,
                height: 22,
                borderRadius: "50% 50% 50% 0",
                background: "var(--accent)",
                border: "2px solid var(--surface-2)",
                boxShadow: "0 2px 6px rgba(232,130,107,0.4)",
              }}
            />
          </div>
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: 16,
                color: "var(--text)",
              }}
            >
              {memory.location.name}
            </span>
            {memory.location.context && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {memory.location.context}
              </span>
            )}
          </div>
        </div>
      )}

      {memory.song_ref && (
        <div
          style={{
            margin: "16px 22px",
            background: "#1F1F1F",
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 6,
              background:
                "linear-gradient(135deg, #FFD93D, #1ED760)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 9,
                color: "#1ED760",
                letterSpacing: 1.5,
                marginBottom: 2,
                fontWeight: 600,
              }}
            >
              ♪ ŞARKIMIZ
            </div>
            <div
              style={{
                color: "#FFF",
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {memory.song_ref}
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#1ED760",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#000",
              flexShrink: 0,
              fontSize: 14,
            }}
          >
            ▶
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div style={{ padding: "20px 22px 0" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            belki bu da hoşuna gider
          </div>
          <div
            className="scroll-soft"
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              padding: "4px 0 16px",
            }}
          >
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/ani/${item.id}`}
                style={{
                  flex: "0 0 180px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 12,
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    height: 80,
                    borderRadius: 8,
                    background:
                      CATEGORY_HERO_GRADIENT[item.category] ??
                      "linear-gradient(135deg, #5A8B7E, #E8826B)",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 13,
                    color: "var(--text)",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--accent)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {shortTurkishDate(item.date)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "16px 22px 0",
          marginTop: 16,
        }}
      >
        {prevId ? (
          <Link
            href={`/ani/${prevId}`}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--surface-2)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-muted)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>‹</span>
            <span style={{ fontFamily: "var(--font-accent)", fontSize: 15 }}>önceki</span>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        {nextId ? (
          <Link
            href={`/ani/${nextId}`}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--surface-2)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-muted)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <span style={{ fontFamily: "var(--font-accent)", fontSize: 15 }}>sonraki</span>
            <span style={{ fontSize: 18 }}>›</span>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>
    </motion.article>
  );
}
