import React from "react";
import { useNavigate } from "react-router-dom";

// ─── LIGHT THEME TOKENS ────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const ORANGE_50 = "#FFF4E0";
const TH = "#0D1240";
const TB = "#4B5563";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .hero-section { font-family: 'DM Sans', sans-serif; }

        /* ── buttons ── */
        .hero-btn-primary  { transition: box-shadow .2s, transform .15s; }
        .hero-btn-primary:hover  { box-shadow: 0 8px 24px rgba(15,28,128,.28); transform: translateY(-1px); }
        .hero-btn-secondary { transition: all .2s; }
        .hero-btn-secondary:hover { background: ${NAVY_50} !important; border-color: ${NAVY} !important; color: ${NAVY} !important; }

        /* ── layout ── */
        .hero-inner  { display: flex; align-items: center; gap: 24px; }
        .hero-btns   { display: flex; flex-wrap: wrap; gap: 10px; }
        .hero-stats  { display: flex; flex-direction: column; gap: 0; margin-left: auto; flex-shrink: 0; }
        .hero-divider { display: block; }

        /* ── tablet / mobile ── */
        @media (max-width: 1023px) {
          .hero-inner  { flex-direction: column; align-items: flex-start; }
          .hero-stats  {
            flex-direction: row !important;
            margin-top: 22px !important;
            margin-left: 0 !important;
            flex-wrap: wrap;
            gap: 8px !important;
            width: 100%;
          }
          .hero-stat {
            flex: 1 1 auto;
            min-width: 80px;
            text-align: left !important;
            padding: 10px 14px !important;
          }
          .hero-divider { display: none !important; }
        }

        /* ── small mobile: buttons stay side by side ── */
        @media (max-width: 480px) {
          .hero-btns   { flex-wrap: nowrap; gap: 8px; }
          .hero-btn-primary,
          .hero-btn-secondary {
            flex: 1 1 0;
            justify-content: center;
            padding: 10px 14px !important;
            font-size: 12px !important;
          }
        }

        /* ── very small (< 340px): allow stacking ── */
        @media (max-width: 340px) {
          .hero-btns { flex-wrap: wrap; }
          .hero-btn-primary,
          .hero-btn-secondary { flex: 1 1 100%; }
        }
      `}</style>

      <section
        className="hero-section"
        style={{
          background: `linear-gradient(135deg, ${NAVY_50} 0%, #E5E8FF 55%, ${ORANGE_50} 100%)`,
          borderRadius: 18,
          border: `1px solid ${NAVY_100}`,
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 2px 14px rgba(15,28,128,.07)",
        }}
      >
        {/* ── decorative rings ── */}
        <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", border: `2px solid rgba(15,28,128,.07)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 60, bottom: -40, width: 130, height: 130, borderRadius: "50%", background: "rgba(243,137,0,.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: -15, bottom: -20, width: 90, height: 90, borderRadius: "50%", border: `1px solid rgba(15,28,128,.06)`, pointerEvents: "none" }} />

        {/* ── left accent bar ── */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(to bottom,${NAVY},${ORANGE})`, borderRadius: "0 4px 4px 0" }} />

        <div className="hero-inner" style={{ position: "relative", zIndex: 1, paddingLeft: 8 }}>

          {/* ── LEFT CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: 560 }}>

            {/* eyebrow badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(15,28,128,.08)", border: "1px solid rgba(15,28,128,.14)",
              borderRadius: 20, padding: "3px 12px", marginBottom: 14,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: NAVY, flexShrink: 0 }} />
              <span style={{ fontSize: 9.5, fontWeight: 800, color: NAVY, letterSpacing: "1.2px", textTransform: "uppercase" }}>
                Mashar Alumni Network
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(22px, 4vw, 34px)",
              fontWeight: 900, color: TH,
              lineHeight: 1.2, margin: "0 0 10px", letterSpacing: "-0.5px",
              whiteSpace: "nowrap",
            }}>
              Connect with Your Coaching Network
            </h1>

            <p style={{ fontSize: 14, color: TB, lineHeight: 1.7, margin: "0 0 22px", maxWidth: 420, whiteSpace: "nowrap" }}>
              Stay connected. Keep growing. Contribute to the profession.
            </p>

            {/* ── buttons ── */}
            <div className="hero-btns">
              <button
                className="hero-btn-primary"
                onClick={() => navigate('/alumni/engage')}
                style={{
                  padding: "10px 22px", borderRadius: 12, border: "none",
                  background: NAVY, color: "#fff",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: `0 4px 16px rgba(15,28,128,.22)`,
                  display: "flex", alignItems: "center", gap: 7,
                  position: "relative", overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 4, background: ORANGE, borderRadius: "0 12px 12px 0" }} />
                Explore Community
              </button>

              <button
                className="hero-btn-secondary"
                onClick={() => navigate('/alumni/events')}
                style={{
                  padding: "10px 22px", borderRadius: 12,
                  border: `1.5px solid ${NAVY_100}`,
                  background: "rgba(255,255,255,.7)",
                  color: TH, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                View Events →
              </button>
            </div>
          </div>

          {/* ── RIGHT STATS ── */}
          <div className="hero-stats">
            {[
              { num: "1,240+", label: "Members" },
              { num: "18", label: "Countries" },
              { num: "96%", label: "Certified" },
            ].map(({ num, label }, i) => (
              <React.Fragment key={label}>
                <Stat num={num} label={label} />
                {i < 2 && <Divider />}
              </React.Fragment>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Stat({ num, label }) {
  return (
    <div
      className="hero-stat"
      style={{
        padding: "14px 20px", textAlign: "center",
        background: "rgba(255,255,255,.65)", borderRadius: 14,
        border: `1px solid ${NAVY_100}`, backdropFilter: "blur(8px)",
        minWidth: 90,
      }}
    >
      <p style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 22, fontWeight: 900, color: NAVY,
        margin: "0 0 3px", lineHeight: 1,
      }}>{num}</p>
      <p style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
        textTransform: "uppercase", color: "#9CA3AF", margin: 0,
      }}>{label}</p>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="hero-divider"
      style={{ width: 1, height: 10, background: `${NAVY_100}`, margin: "4px auto" }}
    />
  );
}