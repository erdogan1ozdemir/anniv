"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const fromPath = params.get("from") ?? "/";
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pw.length < 3) {
      setShake(true);
      setError("biraz daha");
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.replace(fromPath);
        router.refresh();
        return;
      }
      setShake(true);
      setError("yanlış şifre");
      window.setTimeout(() => setShake(false), 500);
      setPw("");
    });
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        maxWidth: 320,
        animation: shake ? "shake 0.4s" : undefined,
        position: "relative",
      }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <input
          type="password"
          value={pw}
          onChange={(event) => setPw(event.target.value)}
          maxLength={32}
          autoComplete="off"
          aria-label="şifre"
          style={{
            width: "100%",
            height: 56,
            borderRadius: 16,
            background: "color-mix(in srgb, var(--surface-2) 70%, transparent)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: error
              ? "1px solid var(--accent)"
              : "1px solid var(--border)",
            padding: "0 20px",
            fontSize: 18,
            letterSpacing: "12px",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            outline: "none",
            textAlign: "center",
            transition: "border 200ms, box-shadow 200ms",
          }}
        />
        {!pw && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--text-soft)",
                  opacity: 0.4,
                }}
              />
            ))}
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 64,
              textAlign: "center",
              fontFamily: "var(--font-accent)",
              color: "var(--accent)",
              fontSize: 16,
            }}
          >
            {error}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--accent)",
          border: "none",
          color: "var(--surface-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-md), 0 0 24px rgba(232,130,107,0.3)",
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.8 : 1,
          transition: "transform 200ms, opacity 200ms",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 10 L16 10 M11 5 L16 10 L11 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
