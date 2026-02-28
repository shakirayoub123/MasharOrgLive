// ─── LIGHT THEME TOKENS ────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const ORANGE_50 = "#FFF4E0";
const CARD = "#FFFFFF";
const TH = "#0D1240";
const TB = "#4B5563";
const TS = "#9CA3AF";

const ITEMS = [
  { tag: "New Event", title: "Alumni Leadership Summit 2026 — Registration Now Open", date: "Feb 14, 2026", color: NAVY, bg: NAVY_50 },
  { tag: "Resource", title: "New ICF Competency Framework resources added to the library", date: "Feb 10, 2026", color: ORANGE, bg: ORANGE_50 },
  { tag: "Platform", title: "Mentorship Program Q1 2026 — Applications now open", date: "Feb 5, 2026", color: NAVY, bg: NAVY_50 },
  { tag: "Community", title: "Peer Supervision Groups now forming — Join a cohort", date: "Jan 29, 2026", color: "#1A6B3C", bg: "#ECFDF5" },
];

export default function Announcements() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .ann-item { transition: background .15s, transform .15s; }
        .ann-item:hover { background: ${NAVY_50} !important; transform: translateX(3px); }
        .ann-link:hover { text-decoration: underline; }
      `}</style>

      <div style={{
        background: CARD,
        borderRadius: 16,
        border: `1px solid ${NAVY_100}`,
        overflow: "hidden",
        boxShadow: "0 1px 5px rgba(15,28,128,.05)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── top accent ── */}
        <div style={{ height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />

        {/* ── header ── */}
        <div style={{
          padding: "16px 20px 14px",
          borderBottom: `1px solid ${NAVY_50}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 4, height: 36, background: `linear-gradient(to bottom,${NAVY},${ORANGE})`, borderRadius: 4, flexShrink: 0, marginTop: 2 }} />
            <div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: TH, margin: "0 0 3px", letterSpacing: "-0.2px" }}>
                📢 Announcements & Updates fyghjkhguyfdtfuygu
              </h2>
              <p style={{ fontSize: 12, color: TS, margin: 0 }}>Stay informed — never miss an update from Mashar</p>
            </div>
          </div>
          <a
            href="#"
            className="ann-link"
            style={{
              fontSize: 11.5, fontWeight: 700, color: NAVY,
              textDecoration: "none", whiteSpace: "nowrap",
              background: NAVY_50, padding: "4px 11px", borderRadius: 20,
              border: `1px solid ${NAVY_100}`, flexShrink: 0,
            }}
          >
            View all →
          </a>
        </div>

        {/* ── list ── */}
        <div style={{ padding: "6px 8px 8px" }}>
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="ann-item"
              style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "11px 12px", borderRadius: 10,
                borderBottom: i < ITEMS.length - 1 ? `1px solid ${NAVY_50}` : "none",
                cursor: "pointer", background: "none",
              }}
            >
              {/* colored dot */}
              <div style={{
                width: 8, height: 8, minWidth: 8, borderRadius: "50%",
                background: item.color, marginTop: 5, flexShrink: 0,
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* tag chip */}
                <span style={{
                  display: "inline-block",
                  fontSize: 9.5, fontWeight: 800, letterSpacing: "0.8px",
                  textTransform: "uppercase", padding: "2px 9px", borderRadius: 20,
                  background: item.bg, color: item.color, marginBottom: 5,
                }}>
                  {item.tag}
                </span>

                <p style={{
                  fontSize: 13, fontWeight: 600, color: TH,
                  lineHeight: 1.45, margin: "0 0 4px", wordBreak: "break-word",
                }}>
                  {item.title}
                </p>

                <p style={{ fontSize: 11, color: TS, margin: 0 }}>{item.date}</p>
              </div>

              {/* arrow */}
              <span style={{ fontSize: 13, color: NAVY_100, flexShrink: 0, marginTop: 4 }}>›</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}