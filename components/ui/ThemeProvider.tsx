"use client";

// Theme picker — 4 themes (coastal light/dark, meadow, vintage) plus
// the new "twilight" gradient theme. Persists to localStorage and
// applies via document.documentElement[data-theme].

import { useEffect, useState, useCallback } from "react";

export type ThemeId =
  | "coastal"
  | "coastal-dark"
  | "meadow"
  | "vintage"
  | "twilight";

export const THEMES: Array<{
  id: ThemeId;
  label: string;
  swatch: string;
  blurb: string;
}> = [
  {
    id: "coastal",
    label: "Sahil",
    swatch: "linear-gradient(135deg, #f0f5f0 0%, #e8826b 100%)",
    blurb: "yumuşak deniz havası",
  },
  {
    id: "coastal-dark",
    label: "Gece Sahili",
    swatch: "linear-gradient(135deg, #13201d 0%, #2d3d3a 100%)",
    blurb: "koyu yeşil, gece nefesi",
  },
  {
    id: "meadow",
    label: "Çayır",
    swatch: "linear-gradient(135deg, #faf6ec 0%, #b85c5c 100%)",
    blurb: "kır çiçeği, sıcak terra",
  },
  {
    id: "vintage",
    label: "Eski Kâğıt",
    swatch: "linear-gradient(135deg, #f4ecd8 0%, #b8654a 100%)",
    blurb: "antika defter sayfası",
  },
  {
    id: "twilight",
    label: "Alacakaranlık",
    swatch: "linear-gradient(135deg, #fde8c4 0%, #d4a5c8 50%, #6b5a9e 100%)",
    blurb: "gün batımı pastelleri",
  },
];

const STORAGE_KEY = "yarim-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>("coastal");

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && THEMES.some((t) => t.id === saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute(
        "data-theme",
        saved === "coastal" ? "" : saved,
      );
    }
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute(
      "data-theme",
      next === "coastal" ? "" : next,
    );
  }, []);

  return { theme, setTheme };
}

// Floating popup picker — opens from a trigger button.
export function ThemePicker({
  open,
  onClose,
  theme,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  theme: ThemeId;
  onSelect: (id: ThemeId) => void;
}) {
  if (!open) return null;
  return (
    <>
      {/* Click-outside scrim */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
        }}
      />
      <div
        role="dialog"
        aria-label="Tema seç"
        style={{
          position: "absolute",
          right: 0,
          top: 44,
          zIndex: 100,
          width: 240,
          background: "var(--surface-2)",
          border: "1px solid var(--border-soft)",
          borderRadius: 16,
          padding: 8,
          boxShadow: "0 18px 40px -12px rgba(15, 17, 13, 0.22)",
          animation: "float-up 200ms ease-out",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontWeight: 600,
            padding: "8px 10px 6px",
          }}
        >
          tema
        </div>
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <button
              key={t.id}
              onClick={() => {
                onSelect(t.id);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "10px 10px",
                borderRadius: 12,
                background: active
                  ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                  : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 180ms ease",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background =
                    "color-mix(in srgb, var(--primary) 8%, transparent)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: t.swatch,
                  border: "1.5px solid rgba(31,27,22,0.12)",
                  flexShrink: 0,
                  boxShadow: active
                    ? "0 0 0 2px var(--accent), 0 2px 6px rgba(0,0,0,0.12)"
                    : "0 1px 4px rgba(0,0,0,0.08)",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 15,
                    color: "var(--text)",
                    fontWeight: 500,
                  }}
                >
                  {t.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.2,
                  }}
                >
                  {t.blurb}
                </div>
              </div>
              {active && (
                <span
                  style={{
                    color: "var(--accent)",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
