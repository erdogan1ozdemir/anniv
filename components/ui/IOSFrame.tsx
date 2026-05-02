"use client";

import type { ReactNode } from "react";

export function IOSStatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      style={{
        height: 44,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 28px",
        position: "relative",
        zIndex: 5,
        color: dark ? "var(--text)" : "var(--text)",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: "-0.2px",
        flexShrink: 0,
      }}
    >
      <span>9:41</span>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 12,
          transform: "translateX(-50%)",
          width: 120,
          height: 32,
          background: "#000",
          borderRadius: 24,
        }}
      />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="1" y="6" width="3" height="5" rx="0.5" fill="currentColor" />
          <rect x="5" y="4" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="9" y="2" width="3" height="9" rx="0.5" fill="currentColor" />
          <rect
            x="13"
            y="0"
            width="3"
            height="11"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 11.5C8.83 11.5 9.5 10.83 9.5 10C9.5 9.17 8.83 8.5 8 8.5C7.17 8.5 6.5 9.17 6.5 10C6.5 10.83 7.17 11.5 8 11.5Z"
            fill="currentColor"
          />
          <path
            d="M3 6.5C4.4 5.1 6.1 4.3 8 4.3C9.9 4.3 11.6 5.1 13 6.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M0.5 4C2.6 1.9 5.2 0.7 8 0.7C10.8 0.7 13.4 1.9 15.5 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="2.5"
            stroke="currentColor"
            fill="none"
          />
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
          <rect x="23" y="4" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function PhoneFrame({
  children,
  dark = false,
  bare = false,
}: {
  children: ReactNode;
  dark?: boolean;
  bare?: boolean;
}) {
  if (bare) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "var(--surface)",
          color: "var(--text)",
          position: "relative",
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "var(--surface)",
        color: "var(--text)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IOSStatusBar dark={dark} />
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
