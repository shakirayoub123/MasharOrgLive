import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

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

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: "articles",
    icon: "📄",
    label: "Articles",
    color: NAVY,
    bgChip: NAVY_50,
    endpoint: "/alumni/articles",
    extract: (d) => (d?.data?.data ?? d?.data ?? []).slice(0, 2),
    getTitle: (item) => item.heading || item.title,
    getMeta: (item) => item.author || "Mashar Team",
    getDate: (item) => item.createdAt,
  },
  {
    key: "events",
    icon: "📅",
    label: "Events",
    color: NAVY,
    bgChip: NAVY_50,
    endpoint: "/alumni/events",
    extract: (d) => (d?.events ?? d?.data?.data ?? d?.data ?? []).slice(0, 2),
    getTitle: (item) => item.eventName,
    getMeta: (item) => item.location || "Online",
    getDate: (item) => item.eventDate,
  },
  {
    key: "books",
    icon: "📚",
    label: "Books",
    color: NAVY,
    bgChip: NAVY_50,
    endpoint: "/alumni/books",
    extract: (d) => (d?.data?.data ?? d?.data ?? d ?? []).slice(0, 2),
    getTitle: (item) => item.heading || item.title,
    getMeta: (item) => item.author || "",
    getDate: (item) => item.createdAt,
  },
  {
    key: "videos",
    icon: "🎬",
    label: "Videos",
    color: NAVY,
    bgChip: NAVY_50,
    endpoint: "/alumni/videos",
    extract: (d) => (Array.isArray(d) ? d : d?.data?.data ?? d?.data ?? []).slice(0, 2),
    getTitle: (item) => item.heading || item.title,
    getMeta: (item) => item.description?.slice(0, 40) + "…" || "",
    getDate: (item) => item.createdAt,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return ""; }
}

// ─── SHIMMER ROW ─────────────────────────────────────────────────────────────
function ShimmerRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: NAVY_50, flexShrink: 0, animation: "lr-pulse 1.6s ease infinite" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 11, width: "70%", background: NAVY_50, borderRadius: 4, marginBottom: 6, animation: "lr-pulse 1.6s ease infinite" }} />
        <div style={{ height: 9, width: "45%", background: NAVY_50, borderRadius: 4, animation: "lr-pulse 1.6s ease .2s infinite" }} />
      </div>
    </div>
  );
}

// ─── RESOURCE ROW ────────────────────────────────────────────────────────────
function ResourceRow({ item, sec, i, onNavigate, onArticleNavigate }) {
  const [hov, setHov] = useState(false);
  const title = sec.getTitle(item);
  const meta = sec.getMeta(item);
  const date = fmtDate(sec.getDate(item));

  const handleClick = () => {
    if (sec.key === "articles" && onArticleNavigate) {
      onArticleNavigate(item._id);
    } else {
      onNavigate(sec.key);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 10px", borderRadius: 10, cursor: "pointer",
        background: hov ? NAVY_50 : "transparent",
        transition: "background .15s",
        animation: `lr-fadeup .3s ease ${i * .07}s both`,
      }}
    >
      {/* Icon pill */}
      <div style={{
        width: 36, height: 36, minWidth: 36, borderRadius: 10,
        background: NAVY_50, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 16, flexShrink: 0,
        transition: "transform .15s", transform: hov ? "scale(1.1)" : "scale(1)",
        border: `1px solid ${hov ? NAVY + "33" : "transparent"}`,
      }}>
        {sec.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 700, color: TH, lineHeight: 1.3,
          margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {title}
        </p>
        <p style={{
          fontSize: 11, color: TS, margin: "3px 0 0",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {meta}{date ? ` · ${date}` : ""}
        </p>
      </div>

      {/* Arrow */}
      <span style={{
        fontSize: 13, color: hov ? NAVY : TS,
        transition: "color .15s, transform .15s",
        transform: hov ? "translateX(3px)" : "none",
        flexShrink: 0, fontWeight: 700,
      }}>→</span>
    </div>
  );
}

// ─── SECTION BLOCK ────────────────────────────────────────────────────────────
function SectionBlock({ sec, items, loading, onNavigate, onArticleNavigate }) {
  return (
    <div>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8, padding: "0 2px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 3, height: 16, borderRadius: 2, flexShrink: 0,
            background: `linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
          }} />
          <span style={{
            fontSize: 10.5, fontWeight: 800, color: NAVY,
            letterSpacing: "1px", textTransform: "uppercase",
          }}>
            {sec.icon} {sec.label}
          </span>
        </div>
        <button
          onClick={() => onNavigate(sec.key)}
          style={{
            fontSize: 10.5, fontWeight: 700, color: NAVY,
            background: NAVY_50, border: `1px solid ${NAVY_100}`,
            borderRadius: 20, padding: "3px 10px", cursor: "pointer",
            transition: "all .15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = NAVY;
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = NAVY;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = NAVY_50;
            e.currentTarget.style.color = NAVY;
            e.currentTarget.style.borderColor = NAVY_100;
          }}
        >
          See all →
        </button>
      </div>

      {/* Rows card */}
      <div style={{
        background: CARD, borderRadius: 14,
        border: `1.5px solid ${NAVY_100}`,
        overflow: "hidden",
      }}>
        {loading ? (
          <>
            <ShimmerRow />
            <div style={{ height: 1, background: NAVY_50, margin: "0 10px" }} />
            <ShimmerRow />
          </>
        ) : items.length === 0 ? (
          <p style={{ fontSize: 12, color: TS, textAlign: "center", padding: "18px 0" }}>
            Nothing yet
          </p>
        ) : (
          items.map((item, i) => (
            <div key={item._id || i}>
              {i > 0 && <div style={{ height: 1, background: NAVY_50, margin: "0 10px" }} />}
              <ResourceRow item={item} sec={sec} i={i} onNavigate={onNavigate} onArticleNavigate={onArticleNavigate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── MAIN WIDGET ──────────────────────────────────────────────────────────────
export default function LatestResources({ onNavigate }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const navigate = useNavigate();

  const handleNav = onNavigate || ((tab) => console.log("Navigate to:", tab));

  const handleArticleNavigate = (articleId) => {
    navigate(`/alumni/article/${articleId}`);
  };

  useEffect(() => {
    SECTIONS.forEach(sec => {
      setLoading(prev => ({ ...prev, [sec.key]: true }));
      API.get(sec.endpoint, { params: { page: 1, limit: 3 } })
        .then(res => setData(prev => ({ ...prev, [sec.key]: sec.extract(res.data) })))
        .catch(() => setData(prev => ({ ...prev, [sec.key]: [] })))
        .finally(() => setLoading(prev => ({ ...prev, [sec.key]: false })));
    });
  }, []);

  const totalLoaded = Object.values(data).flat().length;

  return (
    <>
      <style>{`
        @keyframes lr-fadeup { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lr-pulse  { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
      `}</style>

      {/* ── Outer flex wrapper with LEFT gradient bar outside the card ── */}
      <div style={{
        display: "flex",
        width: "100%",
        minWidth: 0,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(15,28,128,.07)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── LEFT GRADIENT BAR (outside the card) ── */}
        <div style={{
          width: 4,
          flexShrink: 0,
          background: `linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
        }} />

        {/* ── CARD ── */}
        <div style={{
          background: "#F0F2FA",
          border: `1px solid ${NAVY_100}`,
          borderLeft: "none",
          borderRadius: "0 18px 18px 0",
          flex: 1,
          minWidth: 0,
          overflow: "visible",
        }}>

          {/* ── HEADER ── */}
          <div style={{
            padding: "16px 18px 14px",
            background: CARD,
            borderBottom: `1px solid ${NAVY_100}`,
            position: "relative", overflow: "hidden",
            borderRadius: "0 18px 0 0",
          }}>
            {/* decorative circle */}
            <div style={{
              position: "absolute", right: -20, top: -20, width: 100, height: 100,
              borderRadius: "50%", border: `2px solid rgba(15,28,128,.07)`, pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{
                  fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 900,
                  color: TH, letterSpacing: "-0.3px", lineHeight: 1.2, marginBottom: 3,
                }}>
                  📚 Latest Resources
                </h3>
                <p style={{ fontSize: 11.5, lineHeight: '20px', color: TB }}>
                  Access newly added articles, videos, research, tools, and templates curated for your continued development as a coach and leader.
                </p>
              </div>
              <button
                onClick={() => handleNav("articles")}
                style={{
                  fontSize: 11, fontWeight: 700, color: NAVY,
                  background: NAVY_50, border: `1px solid ${NAVY_100}`,
                  borderRadius: 20, padding: "5px 13px", cursor: "pointer",
                  whiteSpace: "nowrap", transition: "background .15s",
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = NAVY_100}
                onMouseLeave={e => e.currentTarget.style.background = NAVY_50}
              >
                Full Library →
              </button>
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              {SECTIONS.map(sec => (
                <button
                  key={sec.key}
                  onClick={() => handleNav(sec.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    background: CARD, border: `1.5px solid ${NAVY_100}`,
                    borderRadius: 20, padding: "4px 11px", cursor: "pointer",
                    fontSize: 10.5, fontWeight: 700, color: NAVY,
                    transition: "all .15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = NAVY_50; e.currentTarget.style.borderColor = NAVY; }}
                  onMouseLeave={e => { e.currentTarget.style.background = CARD; e.currentTarget.style.borderColor = NAVY_100; }}
                >
                  {sec.icon} {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── BODY ── */}
          <div style={{
            padding: "14px 14px 4px",
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            {SECTIONS.map(sec => (
              <SectionBlock
                key={sec.key}
                sec={sec}
                items={data[sec.key] || []}
                loading={!!loading[sec.key]}
                onNavigate={handleNav}
                onArticleNavigate={handleArticleNavigate}
              />
            ))}
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            margin: "14px 14px 14px",
            borderRadius: 12,
            background: CARD,
            border: `1px solid ${NAVY_100}`,
            padding: "11px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 11, color: TS }}>
              {totalLoaded > 0 ? `${totalLoaded} items loaded` : "Loading resources…"}
            </span>
            <button
              onClick={() => handleNav("articles")}
              style={{
                fontSize: 11.5, fontWeight: 700, color: "#fff",
                background: `linear-gradient(90deg,${NAVY},#1A2EA0)`,
                border: "none", borderRadius: 20, padding: "6px 16px",
                cursor: "pointer", boxShadow: "0 3px 10px rgba(15,28,128,.22)",
                transition: "opacity .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Browse All →
            </button>
          </div>

        </div>
      </div>
    </>
  );
}