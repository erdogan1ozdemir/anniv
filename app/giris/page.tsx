import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/screens/LoginForm";
import { Sprig } from "@/components/svg/Botanic";
import { WalkingCat } from "@/components/svg/Cats";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(120% 80% at 50% 30%, var(--surface-2) 0%, var(--surface) 50%, var(--surface-3) 100%)",
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
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 60,
          left: -10,
          color: "var(--primary)",
          animation: "sway 9s ease-in-out infinite",
          pointerEvents: "none",
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
          pointerEvents: "none",
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
        hayat ağacı
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
        <div
          style={{
            position: "relative",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, var(--surface-2), var(--surface-3))",
            boxShadow: "var(--shadow-lg), inset 0 -10px 28px rgba(0,0,0,0.06)",
            overflow: "hidden",
            border: "3px solid var(--surface-2)",
            outline: "1px solid var(--border)",
          }}
        >
          <Image
            src="/img/jedi-portrait.png"
            alt="Jedi"
            fill
            sizes="220px"
            style={{
              objectFit: "cover",
              objectPosition: "55% 45%",
            }}
            priority
          />
        </div>
      </div>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>

      <WalkingCat
        duration={28}
        size={48}
        color="var(--primary-deep)"
        opacity={0.32}
        bottom={28}
      />
    </main>
  );
}
