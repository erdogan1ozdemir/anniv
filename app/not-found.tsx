import Link from "next/link";
import { JediPortrait } from "@/components/svg/JediSilhouette";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        gap: 14,
      }}
    >
      <JediPortrait size={140} />
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontSize: 24,
          color: "var(--text)",
        }}
      >
        buraya nasıl geldin?
      </h1>
      <p
        style={{
          fontFamily: "var(--font-accent)",
          color: "var(--accent)",
          fontSize: 20,
        }}
      >
        jedi de bilmiyor
      </p>
      <Link
        href="/"
        style={{
          background: "var(--primary)",
          color: "var(--surface-2)",
          padding: "10px 18px",
          borderRadius: 999,
          fontSize: 13,
          marginTop: 12,
        }}
      >
        bahçeye dön →
      </Link>
    </main>
  );
}
