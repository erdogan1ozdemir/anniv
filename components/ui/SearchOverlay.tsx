"use client";

// Full-screen search overlay — searches across all memories by
// title, story, tags. Tapping a result navigates to /ani/[id].

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Memory } from "@/types";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  memories: Memory[];
}

function normalize(s: string): string {
  return (s || "")
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function SearchOverlay({ open, onClose, memories }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus when opened, reset on close
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = normalize(query);
    const tokens = q.split(/\s+/).filter(Boolean);
    return memories
      .map((m) => {
        const haystack = normalize(
          [
            m.title,
            m.subtitle ?? "",
            m.story ?? "",
            (m.tags ?? []).join(" "),
            m.location?.name ?? "",
          ].join(" "),
        );
        const score = tokens.reduce(
          (acc, t) => acc + (haystack.includes(t) ? 1 : 0),
          0,
        );
        return { m, score };
      })
      .filter((x) => x.score === tokens.length)
      .sort((a, b) => a.m.date.localeCompare(b.m.date))
      .slice(0, 30);
  }, [query, memories]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Anılarda ara"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "color-mix(in srgb, var(--surface) 96%, transparent)",
        backdropFilter: "blur(20px)",
        animation: "float-up 200ms ease-out",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header — input + close */}
      <div
        style={{
          padding: "20px 18px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span
          aria-hidden
          style={{
            fontSize: 18,
            opacity: 0.55,
            color: "var(--text-muted)",
          }}
        >
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Anılarda ara — başlık, hikâye, etiket"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            fontSize: 16,
            padding: "8px 4px",
          }}
        />
        <button
          onClick={onClose}
          aria-label="Kapat"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: 18,
            cursor: "pointer",
            padding: 6,
          }}
        >
          ✕
        </button>
      </div>

      {/* Results */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 0 24px",
        }}
      >
        {!query.trim() ? (
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontFamily: "var(--font-accent)",
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            anılarınız hâlâ tazedir; istediğin kelimeyi ara
          </div>
        ) : results.length === 0 ? (
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontFamily: "var(--font-accent)",
              fontSize: 15,
            }}
          >
            *{query}* için bir anı bulamadım.
          </div>
        ) : (
          <>
            <div
              style={{
                padding: "0 22px 8px",
                fontSize: 10,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {results.length} sonuç
            </div>
            {results.map(({ m }) => (
              <button
                key={m.id}
                onClick={() => {
                  router.push(`/ani/${m.id}`);
                  onClose();
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 22px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border-soft)",
                  cursor: "pointer",
                  transition: "background 160ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "color-mix(in srgb, var(--accent) 6%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: 1.5,
                    color: "var(--accent)",
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  {m.date}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontStyle: "italic",
                    fontSize: 17,
                    color: "var(--text)",
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {m.title}
                </div>
                {m.subtitle && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {m.subtitle}
                  </div>
                )}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
