import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── LIGHT THEME TOKENS ────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const CARD = "#FFFFFF";
const TH = "#0D1240";
const TB = "#4B5563";
const TS = "#9CA3AF";

const TYPE_CONFIG = {
  welcome: { icon: "👋", label: "Welcome" },
  certificate: { icon: "🏆", label: "Certificate" },
  course: { icon: "📚", label: "Course" },
  achievement: { icon: "⭐", label: "Achievement" },
  job: { icon: "💼", label: "New Role" },
  graduation: { icon: "🎓", label: "Graduation" },
  shoutout: { icon: "📣", label: "Shoutout" },
  general: { icon: "📢", label: "Announcement" },
};

export default function Spotlight() {
  const [spotlights, setSpotlights] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/alumni/spotlights", {
          headers: { Authorization: `Bearer ${localStorage.getItem("alumni_token")}` },
        });
        setSpotlights(res.data.spotlights || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (spotlights.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % spotlights.length), 6000);
    return () => clearInterval(t);
  }, [spotlights.length]);

  const s = spotlights[current];
  const typeConfig = TYPE_CONFIG[s?.type] || TYPE_CONFIG.general;
  const accentColor = s?.gradientFrom || NAVY;
  const accentColor2 = s?.gradientTo || ORANGE;

  const handleAlumniClick = () => {
    if (!s?.taggedAlumni?.length) return;
    navigate(`/alumni/directory?highlight=${s.taggedAlumni[0]}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer  { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
        .spotlight-card { animation: fadeSlide .35s ease; }
      `}</style>

      {/* ── Outer flex wrapper with LEFT gradient bar ── */}
      <div style={{
        display: "flex",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 5px rgba(15,28,128,.05)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── LEFT GRADIENT BAR ── */}
        <div style={{
          width: 4, flexShrink: 0,
          background: `linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
        }} />

        {/* ── CARD ── */}
        <div style={{
          background: CARD,
          border: `1px solid ${NAVY_100}`,
          borderLeft: "none",
          borderRadius: "0 16px 16px 0",
          flex: 1,
          overflow: "hidden",
        }}>

          {/* ── HEADER ── */}
          <div style={{
            padding: "16px 20px 14px",
            borderBottom: `1px solid ${NAVY_50}`,
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800,
                color: TH, margin: "0 0 3px", letterSpacing: "-0.2px",
              }}>
                ✨ Alumni Spotlight
              </h2>
              <p style={{ fontSize: 12, color: TS, lineHeight: "20px", margin: 0 }}>Celebrating the impact of our alumni community.
                Each month, we feature alumni achievements, stories, interviews, or contributions that inspire others and showcase the power of coaching in action.
              </p>
            </div>
            {spotlights.length > 1 && (
              <span style={{
                fontSize: 10, fontWeight: 800, color: TS,
                textTransform: "uppercase", letterSpacing: "1.5px", flexShrink: 0, marginTop: 2,
              }}>
                {current + 1} / {spotlights.length}
              </span>
            )}
          </div>

          {/* ── BODY ── */}
          <div style={{ padding: "14px 16px 16px" }}>

            {/* Loading skeleton */}
            {loading && (
              <div style={{
                borderRadius: 14, background: NAVY_50, height: 180,
                animation: "shimmer 1.5s ease infinite",
              }} />
            )}

            {/* Empty state */}
            {!loading && spotlights.length === 0 && (
              <div style={{
                borderRadius: 14, padding: "32px 20px", textAlign: "center",
                background: `linear-gradient(135deg,${NAVY_50},#E5E8FF)`,
                border: `1px solid ${NAVY_100}`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
                <p style={{ fontSize: 13, color: TS, fontStyle: "italic", margin: 0 }}>No spotlights yet.</p>
              </div>
            )}

            {/* ── INNER SPOTLIGHT CARD ── */}
            {!loading && s && (
              <div
                key={s._id}
                className="spotlight-card"
                style={{
                  borderRadius: 14,
                  background: NAVY_50,
                  border: `1px solid ${NAVY_100}`,
                  overflow: "hidden",
                }}
              >
                {/* Content area */}
                <div style={{ padding: "18px 18px 14px" }}>

                  {/* Badge pill */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: CARD, border: `1px solid ${NAVY_100}`,
                    borderRadius: 20, padding: "4px 12px 4px 8px",
                    marginBottom: 14,
                  }}>
                    <span style={{ fontSize: 14 }}>{typeConfig.icon}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                      letterSpacing: "0.8px", color: NAVY,
                    }}>
                      {typeConfig.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 16, fontWeight: 800, color: TH,
                    lineHeight: 1.3, margin: "0 0 10px", letterSpacing: "-0.2px",
                  }}>
                    {s.title || s.name}
                  </h4>

                  {/* Body text with @mention highlighting */}
                  <p style={{
                    fontSize: 13, color: TB, lineHeight: 1.75, margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {(s.body || s.quote || "").split(/(@\w+)/g).map((part, i) =>
                      part.startsWith("@") ? (
                        <span key={i} onClick={handleAlumniClick} style={{
                          color: NAVY, fontWeight: 700,
                          cursor: s.taggedAlumni?.length ? "pointer" : "default",
                          background: NAVY_100,
                          borderRadius: 4, padding: "1px 6px",
                        }}>{part}</span>
                      ) : part
                    )}
                  </p>
                </div>

                {/* Footer strip on white bg */}
                <div style={{
                  background: CARD,
                  borderTop: `1px solid ${NAVY_100}`,
                  padding: "10px 18px",
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    {/* Avatar */}
                    <div
                      onClick={s.taggedAlumni?.length ? handleAlumniClick : undefined}
                      style={{
                        width: 32, height: 32, minWidth: 32, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 800, color: "#fff",
                        cursor: s.taggedAlumni?.length ? "pointer" : "default",
                        transition: "transform .15s", flexShrink: 0,
                      }}
                      onMouseEnter={e => { if (s.taggedAlumni?.length) e.currentTarget.style.transform = "scale(1.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {s.initials || s.name?.charAt(0) || "M"}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      {[s.role, s.location, s.batch].filter(Boolean).length > 0 && (
                        <p style={{
                          fontSize: 11, color: TS, margin: "0 0 2px",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {[s.role, s.location, s.batch].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {s.taggedAlumni?.length > 0 && (
                        <button onClick={handleAlumniClick} style={{
                          border: "none", background: "none", padding: 0,
                          fontSize: 11, fontWeight: 700, color: NAVY, cursor: "pointer",
                        }}>
                          View {s.taggedAlumni.length} tagged alumni →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date pill */}
                  <span style={{
                    fontSize: 11, color: TS, flexShrink: 0,
                    background: NAVY_50, border: `1px solid ${NAVY_100}`,
                    borderRadius: 20, padding: "2px 10px",
                  }}>
                    {new Date(s.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            )}

            {/* ── Dot pagination ── */}
            {!loading && spotlights.length > 1 && (
              <div style={{
                display: "flex", gap: 6, marginTop: 12,
                justifyContent: "center", alignItems: "center",
              }}>
                {spotlights.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    style={{
                      borderRadius: 20, border: "none", cursor: "pointer", padding: 0,
                      height: 6, width: i === current ? 18 : 6,
                      background: i === current ? NAVY : NAVY_100,
                      transition: "all .25s ease",
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}