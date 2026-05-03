"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CatSilSit } from "@/components/svg/Cats";

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
        gap: 18,
        background:
          "radial-gradient(120% 60% at 50% 30%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 60%), var(--surface)",
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0.4, 1.4] }}
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, var(--surface-2), var(--surface-3))",
          boxShadow: "var(--shadow-md), inset 0 -10px 28px rgba(0,0,0,0.05)",
          border: "3px solid var(--surface-2)",
          outline: "1px solid var(--border)",
          display: "grid",
          placeItems: "center",
          color: "var(--primary-deep)",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 4, -4, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatSilSit size={120} color="var(--primary-deep)" opacity={0.85} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ maxWidth: 320 }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 26,
            color: "var(--text)",
            lineHeight: 1.2,
          }}
        >
          buraya nasıl <em style={{ color: "var(--accent)" }}>geldin?</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-accent)",
            color: "var(--primary)",
            fontSize: 22,
            marginTop: 6,
          }}
        >
          jedi de bilmiyor
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 14,
            lineHeight: 1.5,
          }}
        >
          aradığın anı bulunamadı. belki silindi, belki yanlış bir kapı açtın.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          href="/"
          style={{
            background: "var(--primary)",
            color: "var(--surface-2)",
            padding: "12px 22px",
            borderRadius: 999,
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "var(--shadow-md)",
            letterSpacing: 0.4,
          }}
        >
          bahçeye dön →
        </Link>
      </motion.div>
    </main>
  );
}
