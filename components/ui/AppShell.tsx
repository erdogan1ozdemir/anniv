"use client";

// Outer layout wrapper that:
//  - Centers app content on wide screens (mobile-app feel preserved
//    on desktop via max-width framing).
//  - Provides a fullscreen toggle so the app can be opened in browser
//    and presented without browser chrome.
//  - Houses the persistent BottomNav (passed as children below page).

import { useEffect, useState } from "react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync isFullscreen state with the document's fullscreen API.
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // user cancelled or browser denied; nothing to do
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        // Reserve space for desktop wide-screen framing — let the outer
        // body gradient show through on either side.
        background: "transparent",
      }}
    >
      {/* Centered "app frame" — caps the inner content at a phone-app
          width on large screens but stays full-bleed on mobile. */}
      <div
        className="app-shell-inner"
        style={{
          maxWidth: 540,
          margin: "0 auto",
          minHeight: "100vh",
          position: "relative",
          background: "var(--surface)",
          // Subtle side borders only on desktop (where there's room)
          boxShadow: "0 0 0 1px var(--border-soft)",
        }}
      >
        {children}
      </div>

      {/* Fullscreen toggle — fixed top-right, only visible on desktop
          where there's room. Hidden on mobile (always full-bleed). */}
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"}
        className="fullscreen-toggle"
        style={{
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 200,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "color-mix(in srgb, var(--surface-2) 88%, transparent)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          cursor: "pointer",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-md)",
          backdropFilter: "blur(10px)",
          transition: "transform 180ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
        }}
      >
        {isFullscreen ? "⊟" : "⛶"}
      </button>

      {/* Hide fullscreen button on mobile (≤640px viewport) and on
          mobile-width app-shell where it would overlap content. */}
      <style jsx>{`
        @media (max-width: 640px) {
          .fullscreen-toggle {
            display: none !important;
          }
          .app-shell-inner {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
