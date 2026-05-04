"use client";

import Link from "next/link";
import { Compass } from "@/components/svg/Botanic";
import type { LocationEntry } from "@/types";

// Feature flag: locations map is hidden for now (will be developed later).
// Set to true to re-enable the full "Birlikte gittiğimiz yerler" experience.
const SHOW_LOCATIONS_MAP = false;

const PLACE_ICONS: Record<string, string> = {
  kapadokya: "🎈",
  goreme: "🎈",
  bursa: "🏛️",
  olympos: "🌲",
  marmaris: "🏖️",
  cesme: "⛵",
  izmir: "🌊",
  eskisehir: "🚂",
  antalya: "🏖️",
  besiktas: "⚓",
  kadikoy: "☕",
  marmaray: "🚇",
  suadiye: "🏠",
  bagcilar: "🌆",
  pendik: "🌅",
  bostanci: "🌊",
  esenyurt: "🌆",
  maltepe: "🌆",
  levent: "🏙️",
  caddebostan: "🏖️",
  datca: "🌊",
};

function pickIcon(name: string): string {
  const slug = name
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
  return PLACE_ICONS[slug] ?? "📍";
}

interface MapScreenProps {
  locations: LocationEntry[];
}

export function MapScreen({ locations }: MapScreenProps) {
  if (!SHOW_LOCATIONS_MAP) {
    return <MapPlaceholder />;
  }
  return <FullMap locations={locations} />;
}

function MapPlaceholder() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        background:
          "linear-gradient(180deg, #F4F0E1 0%, #ECE5D2 50%, #DBD3BD 100%)",
        paddingBottom: 96,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "16px 22px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ color: "#1F1B16", fontSize: 14, opacity: 0.8 }}>
          ‹ ağaç
        </Link>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#7C6E55",
            opacity: 0.6,
            animation: "breathe 8s ease-in-out infinite",
            marginBottom: 24,
          }}
        >
          <Compass size={72} />
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: "#A38B5F",
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          yakında
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 38,
            lineHeight: 1.1,
            color: "#1F1B16",
            fontWeight: 500,
            letterSpacing: -0.5,
            marginBottom: 14,
            maxWidth: 320,
          }}
        >
          gittiğimiz yerler
        </h1>

        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: 19,
            lineHeight: 1.4,
            color: "#5A4F3E",
            opacity: 0.85,
            maxWidth: 300,
            marginBottom: 28,
          }}
        >
          haritamız hâlâ çiziliyor… birlikte adım attığımız her köşeyi yakında
          burada toplayacağız.
        </p>

        <Link
          href="/"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#1F1B16",
            background: "rgba(255, 253, 246, 0.85)",
            border: "1px solid rgba(31, 27, 22, 0.12)",
            borderRadius: 999,
            padding: "10px 20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 12px -6px rgba(15, 17, 13, 0.12)",
          }}
        >
          ağaca dön
        </Link>
      </div>
    </div>
  );
}

function FullMap({ locations }: MapScreenProps) {
  const places = (locations ?? [])
    .filter(
      (loc) => (loc.frequency ?? 0) > 4 || (loc.associated_memories ?? []).length > 0,
    )
    .slice(0, 12);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        background:
          "repeating-linear-gradient(0deg, transparent 0 38px, rgba(101,80,40,0.05) 38px 39px), radial-gradient(ellipse at 30% 20%, var(--gold) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, var(--primary) 0%, transparent 50%), var(--surface-3)",
        paddingBottom: 96,
      }}
    >
      <header style={{ padding: "16px 22px 0", display: "flex", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "var(--primary)", fontSize: 14 }}>
          ‹ ağaç
        </Link>
      </header>

      <div style={{ padding: "12px 16px 8px" }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 26,
            color: "var(--text)",
          }}
        >
          Birlikte gittiğimiz <em style={{ color: "var(--accent)" }}>yerler</em>
        </div>
        <div
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: 18,
            color: "var(--primary)",
          }}
        >
          hazinelerimiz
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 80,
          right: 16,
          color: "var(--text-muted)",
          animation: "breathe 8s ease-in-out infinite",
        }}
      >
        <Compass size={48} />
      </div>

      <div
        style={{
          position: "relative",
          height: 500,
          margin: "12px 16px 16px",
          background:
            "repeating-linear-gradient(45deg, transparent 0 30px, rgba(45,61,58,0.02) 30px 31px), radial-gradient(ellipse 200px 60px at 30% 30%, rgba(159,197,189,0.3), transparent), radial-gradient(ellipse 150px 50px at 70% 60%, rgba(159,197,189,0.3), transparent), linear-gradient(135deg, var(--gold) 0%, var(--surface-2) 100%)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 500"
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M40 100 Q100 80 160 110 Q220 140 280 100"
            stroke="var(--text-muted)"
            strokeWidth="0.6"
            fill="none"
            opacity="0.3"
            strokeDasharray="2 4"
          />
          <path
            d="M30 150 Q100 130 170 160 Q240 190 290 150"
            stroke="var(--text-muted)"
            strokeWidth="0.6"
            fill="none"
            opacity="0.25"
            strokeDasharray="2 4"
          />
          <path
            d="M50 220 Q120 200 200 230"
            stroke="var(--text-muted)"
            strokeWidth="0.6"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M40 350 Q120 330 200 360 Q260 380 290 350"
            stroke="var(--text-muted)"
            strokeWidth="0.6"
            fill="none"
            opacity="0.3"
            strokeDasharray="2 4"
          />
          <path
            d="M60 80 Q120 150 180 130 Q240 160 200 250 Q150 320 220 380 Q260 420 200 460"
            stroke="var(--accent)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 6"
            opacity="0.6"
          />
        </svg>

        {(places.length > 0
          ? places
          : (
              [
                { name: "Kapadokya", frequency: 8, context: "balon turu" },
                { name: "Olympos", frequency: 6, context: "kamp" },
                { name: "Marmaris", frequency: 12, context: "plaj" },
                { name: "Suadiye", frequency: 30, context: "evimiz" },
                { name: "Bursa", frequency: 5, context: "bahar gezisi" },
              ] as LocationEntry[]
            )
        ).map((place, i) => {
          const positions = [
            { x: "15%", y: "12%" },
            { x: "60%", y: "20%" },
            { x: "20%", y: "40%" },
            { x: "70%", y: "48%" },
            { x: "40%", y: "70%" },
            { x: "75%", y: "82%" },
            { x: "30%", y: "30%" },
            { x: "55%", y: "55%" },
            { x: "10%", y: "60%" },
            { x: "85%", y: "30%" },
            { x: "40%", y: "85%" },
            { x: "65%", y: "65%" },
          ];
          const pos = positions[i % positions.length];
          const isStar = i === 2;
          const associated = (place.associated_memories ?? []).length;
          return (
            <div
              key={place.name}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {isStar && (
                <div
                  style={{
                    position: "absolute",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    top: -12,
                    left: -10,
                    animation: "pulse-ring 2.5s ease-out infinite",
                  }}
                />
              )}
              <div
                style={{
                  width: isStar ? 40 : 32,
                  height: isStar ? 40 : 32,
                  borderRadius: "50%",
                  background: "var(--surface-2)",
                  boxShadow: "var(--shadow-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isStar ? 20 : 16,
                  border: isStar ? "2px solid var(--accent)" : "1px solid var(--border)",
                }}
              >
                {pickIcon(place.name)}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: 13,
                  color: "var(--text)",
                  background: "rgba(255,255,255,0.7)",
                  padding: "0 6px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}
              >
                {place.name}
                {associated > 0 && (
                  <span style={{ color: "var(--accent)", marginLeft: 4, fontSize: 10 }}>
                    ({associated})
                  </span>
                )}
              </div>
              {isStar && (
                <div
                  style={{
                    fontSize: 7,
                    letterSpacing: 1.5,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  ★ en sevdiğimiz
                </div>
              )}
            </div>
          );
        })}
      </div>

      {places.length > 0 && (
        <div
          style={{
            margin: "0 16px 24px",
            background: "var(--surface-2)",
            borderRadius: "14px 14px 0 0",
            padding: "12px 16px 20px",
            boxShadow: "0 -8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              background: "var(--border)",
              borderRadius: 2,
              margin: "0 auto 12px",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 24 }}>{pickIcon(places[0].name)}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 18,
                  color: "var(--text)",
                }}
              >
                {places[0].name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: 1.5,
                }}
              >
                {places[0].frequency ?? 0} ZİYARET
              </div>
            </div>
            <div
              style={{
                padding: "3px 8px",
                borderRadius: 999,
                background: "var(--accent)",
                color: "var(--surface-2)",
                fontSize: 8,
                letterSpacing: 1.5,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              ★ favori
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
