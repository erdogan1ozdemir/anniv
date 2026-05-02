import { LoginForm } from "@/components/screens/LoginForm";
import { Sprig } from "@/components/svg/Botanic";
import { JediPortrait } from "@/components/svg/JediSilhouette";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: `radial-gradient(120% 80% at 50% 30%, var(--surface-2) 0%, var(--surface) 50%, var(--surface-3) 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 28px",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 60%)",
          opacity: 0.18,
          filter: "blur(40px)",
          top: "16%",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 60,
          left: -10,
          color: "var(--primary)",
          animation: "sway 9s ease-in-out infinite",
        }}
      >
        <Sprig size={86} opacity={0.28} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: -10,
          color: "var(--primary)",
          animation: "sway 11s ease-in-out infinite reverse",
          transform: "scaleX(-1)",
        }}
      >
        <Sprig size={92} opacity={0.24} />
      </div>

      <div
        style={{
          fontFamily: "var(--font-accent)",
          fontSize: 24,
          color: "var(--accent)",
          letterSpacing: 0.5,
        }}
      >
        yarim&apos;in
      </div>
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontSize: 32,
          color: "var(--text)",
          fontWeight: 500,
          marginBottom: 36,
          letterSpacing: -0.3,
        }}
      >
        bahçesi
      </div>

      <div style={{ marginBottom: 56, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -40,
            borderRadius: "50%",
            border: "1px solid var(--primary)",
            opacity: 0.2,
            animation: "breathe 5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -22,
            borderRadius: "50%",
            border: "1px solid var(--accent)",
            opacity: 0.3,
            animation: "breathe 4s ease-in-out infinite 0.5s",
            pointerEvents: "none",
          }}
        />
        <JediPortrait size={200} />
      </div>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
