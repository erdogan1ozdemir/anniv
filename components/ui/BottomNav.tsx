"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: "🌿", label: "bahçe", id: "tree" },
  { href: "/galeri", icon: "🖼", label: "galeri", id: "gallery" },
  { href: "/harita", icon: "🗺", label: "harita", id: "map" },
  { href: "/jedi", icon: "🐈", label: "jedi", id: "jedi" },
];

function activeFor(pathname: string): string {
  if (pathname === "/") return "tree";
  if (pathname.startsWith("/galeri")) return "gallery";
  if (pathname.startsWith("/harita")) return "map";
  if (pathname.startsWith("/jedi")) return "jedi";
  if (pathname.startsWith("/ani")) return "tree";
  return "";
}

export function BottomNav() {
  const pathname = usePathname();
  const active = activeFor(pathname);
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 12px calc(env(safe-area-inset-bottom) + 14px)",
        background: "color-mix(in srgb, var(--surface-2) 88%, transparent)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderTop: "1px solid var(--border-soft)",
      }}
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              transition: "color 200ms",
              padding: "4px 12px",
              borderRadius: 12,
            }}
          >
            <span
              style={{
                fontSize: 22,
                lineHeight: 1,
                transform: isActive ? "translateY(-1px)" : "none",
                transition: "transform 200ms",
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontFamily: "var(--font-body)",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
