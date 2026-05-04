"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: "🌳", label: "ağaç", id: "tree" },
  { href: "/koleksiyonlar", icon: "📚", label: "koleksiyon", id: "collections" },
  { href: "/sayac", icon: "⏳", label: "sayaç", id: "counter" },
  { href: "/jedi", icon: "🐈", label: "jedi", id: "jedi" },
];

function activeFor(pathname: string): string {
  if (pathname === "/") return "tree";
  if (pathname.startsWith("/koleksiyonlar") || pathname.startsWith("/kategoriler"))
    return "collections";
  if (pathname.startsWith("/sayac") || pathname.startsWith("/harita"))
    return "counter";
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
        padding: "10px 8px calc(env(safe-area-inset-bottom) + 14px)",
        background: "rgba(244, 240, 225, 0.78)",
        backdropFilter: "blur(22px) saturate(1.6)",
        WebkitBackdropFilter: "blur(22px) saturate(1.6)",
        borderTop: "1px solid rgba(31, 27, 22, 0.08)",
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
              padding: "4px 10px",
              borderRadius: 12,
              flex: 1,
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
                whiteSpace: "nowrap",
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
