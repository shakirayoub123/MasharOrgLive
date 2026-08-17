import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import FooterLogo from "../../assets/masharBlackFinal.svg?url";
import { resolveAssetUrl } from "../../utils/baseUrl";

// Build full avatar URL from relative path stored in DB
function avatarUrl(path) {
  return resolveAssetUrl(path);
}

/**
 * AlumniCard — Keka-style
 * PDF: white A4 page, card centered with white margins (exactly like Keka)
 */
export default function AlumniCard({ user, onClose }) {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  /* ── derived fields ─────────────────────────── */
  const initials = user.full_name?.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  const course = user.course || "N/A";
  const graduated = user.completion_year || user.batch || "N/A";
  const location = [user.city, user.country].filter(Boolean).join(", ") || "N/A";
  const joinYear = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();
  const role = user.completion_status
    ? user.completion_status.charAt(0).toUpperCase() + user.completion_status.slice(1)
    : "Alumni Member";

  const avatarSrc = avatarUrl(user.avatar || user.profile_pic || null);

  const rows = [
    { label: "Alumni ID", value: user._id || user.id || "N/A" },
    { label: "Course",    value: course },
    { label: "Graduated", value: graduated },
    { label: "Phone",     value: user.phone || "N/A" },
    { label: "Email",     value: user.email },
    { label: "Location",  value: location },
    { label: "Joined",    value: `${joinYear}` },
  ];

  /* ── PDF export — white A4, card centered ───── */
  const handleDownload = async () => {
    if (!cardRef.current || loading) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const pageW = 210;
      const pageH = 297;

      const pxToMm = (px) => (px * 25.4) / 96;
      const rawCardW = pxToMm(cardRef.current.offsetWidth);
      const rawCardH = pxToMm(cardRef.current.offsetHeight);

      const maxCardW = pageW * 0.55;
      const scale = maxCardW / rawCardW;
      const cardW = rawCardW * scale;
      const cardH = rawCardH * scale;

      const offsetX = (pageW - cardW) / 2;
      const offsetY = (pageH - cardH) / 2;

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageW, pageH, "F");
      pdf.addImage(imgData, "PNG", offsetX, offsetY, cardW, cardH);
      pdf.save(`${(user.full_name || "Alumni").replace(/\s+/g, "_")}_AlumniCard.pdf`);
    } catch (err) {
      console.error("PDF failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── render ─────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes cardPop {
          from { opacity:0; transform:scale(0.92) translateY(16px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
        .acard-pop { animation: cardPop 0.22s cubic-bezier(0.34,1.4,0.64,1) forwards; }
      `}</style>

      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto flex"
        style={{ backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}
      >
        <div className="fixed inset-0" onClick={onClose} />

        <div className="relative z-10 m-auto flex flex-col items-center gap-3 acard-pop py-6 px-4 w-full">

          {/* ══════════════ CARD ══════════════ */}
          <div
            ref={cardRef}
            className="overflow-hidden bg-white w-full max-w-[330px]"
            style={{
              borderRadius: 16,
              fontFamily: "'Segoe UI', Tahoma, sans-serif",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* ── NAVY header ── */}
            <div
              className="relative flex flex-col items-center"
              style={{
                background: "linear-gradient(180deg,#0F1C80 0%,#1a2fa0 100%)",
                paddingTop: 24,
                paddingBottom: 16,
              }}
            >
              {/* Subtle orange accent circle */}
              <div style={{
                position: "absolute", bottom: -20, right: -20,
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(243,137,0,0.12)", pointerEvents: "none",
              }} />

              {/* Circular avatar */}
              <div style={{
                width: 76, height: 76,
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.55)",
                overflow: "hidden",
                background: "rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 10,
                flexShrink: 0,
                position: "relative", zIndex: 1,
              }}>
                {avatarSrc && !imgError ? (
                  <img
                    src={avatarSrc}
                    alt={user.full_name}
                    crossOrigin="anonymous"
                    onError={() => setImgError(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ color: "#fff", fontSize: 24, fontWeight: 800 }}>{initials}</span>
                )}
              </div>

              <h2 style={{
                color: "#fff", fontWeight: 700, fontSize: 17,
                margin: "0 0 4px", textAlign: "center", position: "relative", zIndex: 1,
              }}>
                {user.full_name}
              </h2>
              <p style={{
                color: "rgba(255,255,255,0.75)", fontWeight: 400, fontSize: 12,
                margin: 0, textAlign: "center", position: "relative", zIndex: 1,
              }}>
                {role}
              </p>
            </div>

            {/* Orange accent stripe */}
            <div style={{ height: 3, background: "linear-gradient(90deg,#0F1C80,#F38900)" }} />

            {/* Info rows */}
            <div style={{ padding: "4px 20px 2px", background: "#fff" }}>
              {rows.map((r, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "6px 0",
                  borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none",
                  gap: 12,
                }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, flexShrink: 0, minWidth: 76 }}>
                    {r.label}
                  </span>
                  <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, textAlign: "right", wordBreak: "break-all" }}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Logo footer */}
            <div style={{
              borderTop: "1px solid #f1f5f9",
              padding: "10px 20px 14px",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 2,
              background: "#fff",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <img
                  src={FooterLogo}
                  alt="Alumni Portal"
                  style={{ width: 85, height: 40, objectFit: "contain" }}
                />
              </div>
              <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, margin: 0, letterSpacing: "0.3px" }}>
                Powered by Alumni Management System
              </p>
            </div>
          </div>
          {/* ══════════════ END CARD ══════════════ */}

          {/* ── Download button — NAVY → ORANGE ── */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl
              text-white text-sm font-extrabold tracking-wide w-full max-w-[330px]
              transition-all duration-150 hover:opacity-90 hover:-translate-y-0.5
              disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg,#0F1C80 0%,#F38900 100%)",
              boxShadow: "0 8px 28px rgba(15,28,128,0.35)",
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating PDF…
              </>
            ) : (
              <>⬇ Download ID Card</>
            )}
          </button>

        </div>
      </div>
    </>
  );
}