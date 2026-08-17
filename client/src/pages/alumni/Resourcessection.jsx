import { useState } from "react";
import AlumniArticles from "../../components/alumni/AlumniArticles";
import AlumniEvents from "../../components/alumni/AlumniEvents";
import AluminiBooks from "../../components/alumni/AluminiBooks";
import AlumniVideos from "../../components/alumni/AluminiVideos";
import { useSearchParams } from "react-router-dom";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const ORANGE_50 = "#FFF4E0";
const CARD = "#FFFFFF";
const TH = "#0D1240";
const TB = "#4B5563";
const TS = "#9CA3AF";

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "reading", icon: "📖", label: "Reading Room" },
  { key: "library", icon: "📚", label: "Knowledge Library" },
  { key: "media", icon: "🎬", label: "Mastermind Media" },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ResourceLibrary() {
  const [searchParams] = useSearchParams();

  const rawTab = searchParams.get("tab");
  const tabMap = { articles: "library", events: "library", books: "reading", videos: "media" };
  const initialTab = tabMap[rawTab] || rawTab || "reading";

  const [search, setSearch] = useState("");
  const [sec, setSec] = useState(initialTab);

  const handleTabChange = (key) => {
    setSec(key);
    setSearch("");
  };

  return (
    <>
      <style>{`
                .rl { width: 100%; max-width: 100%; overflow-x: hidden; }
                .hero-row   { display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
                .hero-stats { display: flex; gap: 10px; flex-shrink: 0; }
                .tabs-row   { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
                .tabs-bar   { display: flex; gap: 4px; background: ${NAVY_50}; border-radius: 13px; padding: 4px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; max-width: 100%; }
                .tabs-bar::-webkit-scrollbar { display: none; }

                /* Hero card: left gradient border via pseudo-element trick */
                .hero-card {
                    position: relative;
                    background: linear-gradient(135deg, ${NAVY_50} 0%, #E5E8FF 55%, ${ORANGE_50} 100%);
                    border-radius: 18px;
                    padding: 26px 28px 26px 32px;
                    margin-bottom: 18px;
                    overflow: hidden;
                    animation: fi .5s ease;
                    border: 1px solid ${NAVY_100};
                    border-left: 4px solid transparent;
                    background-image:
                        linear-gradient(135deg, ${NAVY_50} 0%, #E5E8FF 55%, ${ORANGE_50} 100%),
                        linear-gradient(to bottom, ${NAVY}, ${ORANGE});
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                }

                @media (max-width: 860px) { .hero-stats { display: none; } }
                @media (max-width: 540px) {
                    .tabs-row  { flex-direction: column; align-items: stretch; }
                    .search-box { width: 100% !important; }
                    .search-box input { width: 100% !important; }
                }
            `}</style>

      <div className="rl">
        {/* ── HERO ── */}
        <div className="hero-card">
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              right: -28,
              top: -28,
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: `2px solid rgba(15,28,128,.07)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 55,
              bottom: -38,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(243,137,0,.07)",
              pointerEvents: "none",
            }}
          />

          <div className="hero-row" style={{ position: "relative" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Label badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(15,28,128,.08)",
                  border: "1px solid rgba(15,28,128,.14)",
                  borderRadius: 20,
                  padding: "3px 11px",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: NAVY,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    color: NAVY,
                    letterSpacing: "1.1px",
                    textTransform: "uppercase",
                  }}
                >
                  Exclusive Learning Materials for Alumni
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: "clamp(19px,3.5vw,26px)",
                  fontWeight: 900,
                  color: TH,
                  lineHeight: 1.25,
                  margin: "0 0 8px",
                  letterSpacing: "-0.4px",
                }}
              >
                Curated resources to support your ongoing professional development
              </h1>
              <p
                style={{
                  fontSize: 13.5,
                  color: TB,
                  lineHeight: 1.65,
                  maxWidth: 750,
                  wordBreak: "break-word",
                }}
              >
                Enhance your practice with hand-picked learning materials designed specifically for
                Mashar alumni.
                <br />
                This space offers curated reading, practical tools, and shared
                knowledge to support reflection, application, and continuous growth beyond formal
                programs.
              </p>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {[
                { n: "48+", l: "Resources", c: NAVY },
                { n: "3", l: "Collections", c: ORANGE },
              ].map(({ n, l, c }) => (
                <div
                  key={l}
                  style={{
                    textAlign: "center",
                    background: "rgba(255,255,255,.7)",
                    borderRadius: 14,
                    padding: "13px 16px",
                    border: `1px solid ${NAVY_100}`,
                    backdropFilter: "blur(8px)",
                    minWidth: 72,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 21,
                      fontWeight: 900,
                      color: c,
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: TS,
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS + SEARCH ── */}
        <div className="tabs-row">
          <div className="tabs-bar">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: sec === t.key ? ORANGE : "none",
                  color: sec === t.key ? "#fff" : TB,
                  fontSize: 13,
                  fontWeight: sec === t.key ? 700 : 500,
                  cursor: "pointer",
                  transition: "all .18s",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  boxShadow:
                    sec === t.key ? `0 3px 10px ${ORANGE}44` : "none",
                }}
              >
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div
            className="search-box"
            style={{ position: "relative", flexShrink: 0 }}
          >
            <span
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${sec}…`}
              style={{
                paddingLeft: 34,
                paddingRight: 13,
                height: 39,
                border: `1.5px solid ${NAVY_100}`,
                borderRadius: 11,
                fontSize: 13,
                outline: "none",
                width: 195,
                background: CARD,
                color: TH,
                display: "block",
              }}
              onFocus={(e) => (e.target.style.borderColor = ORANGE)}
              onBlur={(e) => (e.target.style.borderColor = NAVY_100)}
            />
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div key={sec} style={{ animation: "fu .28s ease", width: "100%" }}>
          {sec === "reading" && (
            <div className="flex flex-col gap-12">
              <div style={{ paddingBottom: 10, borderBottom: `1px solid ${NAVY_100}` }}>
                <p className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 mb-3 px-1">Read. Reflect. Grow</p>
                <p className="text-[14px] text-gray-500 whitespace-nowrap px-1 leading-relaxed">
                  A curated selection of books, frameworks, and practical coaching tools to deepen understanding and support reflective practice
                </p>
              </div>

              <section>
                <div className="flex items-center gap-2 mb-6 px-1">
                  <span className="text-lg">📚</span>
                  <h3 className="text-[15px] font-bold text-gray-800">Recommended Reading & Coaching Tools</h3>
                </div>
                <AluminiBooks search={search} hideHeader={true} />
              </section>
            </div>
          )}

          {sec === "library" && (
            <div className="flex flex-col gap-12">
              <div style={{ paddingBottom: 10, borderBottom: `1px solid ${NAVY_100}` }}>
                <p className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 mb-3 px-1">Learn. Apply. Download.</p>
                <p className="text-[14px] text-gray-500 max-w-2xl px-1 leading-relaxed">
                  Access downloadable resources, session materials, templates, and selected recordings that support application, structure, and professional alignment.
                </p>
              </div>

              <section>
                <div className="flex items-center gap-2 mb-6 px-1">
                  <span className="text-lg">🛠️</span>
                  <h3 className="text-[15px] font-bold text-gray-800">Recommended Learning Resources & Templates</h3>
                </div>
                <AlumniArticles search={search} hideHeader={true} />
              </section>

              <div style={{ height: 1, background: `linear-gradient(90deg, ${NAVY_100}, transparent)` }} />

              <section>
                <div className="flex items-center gap-2 mb-6 px-1">
                  <span className="text-lg">📚</span>
                  <h3 className="text-[15px] font-bold text-gray-800">Essential Books</h3>
                </div>
                <AluminiBooks search={search} hideHeader={true} />
              </section>

              <div style={{ height: 1, background: `linear-gradient(90deg, ${NAVY_100}, transparent)` }} />

              <section>
                <div className="flex items-center gap-2 mb-6 px-1">
                  <span className="text-lg">📼</span>
                  <h3 className="text-[15px] font-bold text-gray-800">Session Recordings</h3>
                </div>
                <AlumniEvents search={search} hideHeader={true} />
              </section>
            </div>
          )}

          {sec === "media" && (
            <div className="flex flex-col gap-12">
              <div style={{ paddingBottom: 10, borderBottom: `1px solid ${NAVY_100}` }}>
                <p className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 mb-3 px-1">Watch. Reflect. Evolve.</p>
                <p className="text-[14px] text-gray-500 max-w-2xl px-1 leading-relaxed">
                  On-demand content from Mastermind sessions, guest speakers, alumni conversations, and shared peer experiences.
                </p>
              </div>
              <section>
                <div className="flex items-center gap-2 mb-6 px-1">
                  <span className="text-lg">🎬</span>
                  <h3 className="text-[15px] font-bold text-gray-800">2.	Recommended Videos, Podcasts & Blogs</h3>
                </div>
                <AlumniVideos search={search} />
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}