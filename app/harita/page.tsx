import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { loadLocations, loadMemories } from "@/lib/data";

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
  beşiktaş: "⚓",
  besiktas: "⚓",
  kadıköy: "☕",
  kadikoy: "☕",
  marmaray: "🚇",
  suadiye: "🏠",
  bağcılar: "🌆",
  bagcilar: "🌆",
  pendik: "🌅",
  bostancı: "🌊",
  bostanci: "🌊",
  esenyurt: "🌆",
  maltepe: "🌆",
  levent: "🏙️",
  caddebostan: "🏖️",
};

function pickIcon(name: string): string {
  const slug = name
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
  return PLACE_ICONS[slug] ?? "📍";
}

export default async function MapPage() {
  const [locations, memories] = await Promise.all([
    loadLocations(),
    loadMemories(),
  ]);

  const places = locations
    .filter((loc) => (loc.frequency ?? 0) > 5 || (loc.associated_memories ?? []).length > 0)
    .slice(0, 24);

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 30% 30%, #C2B891 0%, transparent 50%), radial-gradient(circle at 70% 70%, #C2B891 0%, transparent 50%), linear-gradient(180deg, #F5EBD3 0%, #EBDDBA 100%)",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(180,150,100,0.04) 2px, rgba(180,150,100,0.04) 3px), repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(180,150,100,0.04) 2px, rgba(180,150,100,0.04) 3px)",
        paddingBottom: 220,
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#5C4A30",
        }}
      >
        <Link href="/" style={{ color: "#5C4A30", fontSize: 14 }}>
          ‹ bahçe
        </Link>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 18,
            }}
          >
            geçtiğimiz yerler
          </div>
          <div
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: 14,
              color: "#A8503D",
            }}
          >
            hazinelerimiz
          </div>
        </div>
      </header>

      <div
        style={{
          position: "relative",
          height: "60vh",
          margin: "0 14px",
          border: "2px dashed rgba(92,74,48,0.2)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 320 460"
          preserveAspectRatio="none"
        >
          <path
            d="M0 130 Q40 90 80 120 Q100 100 130 130 L130 460 L0 460 Z"
            fill="#B5A87C"
            opacity="0.4"
          />
          <path
            d="M180 220 Q220 215 260 230 Q280 240 270 260 Q230 275 200 265 Q180 260 180 240 Z"
            fill="#9FC5BD"
            opacity="0.5"
          />
          <text
            x="225"
            y="245"
            textAnchor="middle"
            fontFamily="var(--font-accent)"
            fontSize="11"
            fill="#5A8B7E"
            fontStyle="italic"
          >
            Akdeniz
          </text>
          <path
            d="M50 60 Q110 100 90 180 Q70 240 200 240 Q260 250 230 320"
            stroke="#B85C5C"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 4"
            opacity="0.55"
          />
          <circle
            cx="40"
            cy="50"
            r="10"
            fill="none"
            stroke="#5C4A30"
            strokeWidth="0.6"
            opacity="0.4"
          />
          <text x="40" y="53" textAnchor="middle" fontSize="9" fill="#5C4A30">
            ⚓
          </text>
        </svg>

        {places.map((place, i) => {
          const left = 12 + ((i * 27) % 76);
          const top = 8 + ((i * 19) % 78);
          const associated = (place.associated_memories ?? []).length;
          return (
            <div
              key={place.name}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${top}%`,
                textAlign: "center",
                transform: "translate(-50%, -100%)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  filter: "drop-shadow(0 1px 2px rgba(92,74,48,0.3))",
                }}
              >
                {pickIcon(place.name)}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-accent)",
                  color: "#5C4A30",
                  fontSize: 11,
                  lineHeight: 1,
                  marginTop: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {place.name}
                {associated > 0 && (
                  <span
                    style={{
                      color: "#B85C5C",
                      fontSize: 9,
                      marginLeft: 4,
                    }}
                  >
                    ({associated})
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 24 }}>🐈</div>
          <div
            style={{
              fontFamily: "var(--font-accent)",
              color: "#B85C5C",
              fontSize: 11,
            }}
          >
            jedi&apos;in kalesi
          </div>
        </div>
      </div>

      <section
        style={{
          margin: "20px 14px 0",
          background: "var(--surface-2)",
          border: "1px solid var(--border-soft)",
          borderRadius: 16,
          padding: 16,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          en sevdiklerimiz
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {places.slice(0, 6).map((place) => {
            const memoryIds = place.associated_memories ?? [];
            const firstMemory = memories.find((m) => memoryIds.includes(m.id));
            return (
              <Link
                key={place.name}
                href={firstMemory ? `/ani/${firstMemory.id}` : "/"}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "var(--surface)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <span style={{ fontSize: 20 }}>{pickIcon(place.name)}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 14,
                      color: "var(--text)",
                    }}
                  >
                    {place.name}
                  </div>
                  {place.context && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: 0.5,
                      }}
                    >
                      {place.context}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  {place.frequency ? `${place.frequency} mention` : "·"}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
