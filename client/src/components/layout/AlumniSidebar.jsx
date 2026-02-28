import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import toast from "react-hot-toast";
import alumniLogoWhite from "../../assets/alumniLogoWhite.svg";
import { resolveAssetUrl } from "../../utils/baseUrl";

// ─── BADGE DATA ───────────────────────────────────────────────────────────────
const BADGES = [
  {
    id: "pioneer",
    label: "Pioneer",
    tagline: "First steps, lasting impact",
    icon: "🚀",
    bg: "#F5A623",
    fg: "#0F2056",
    ringColor: "#0F2056",
    textColor: "#0F2056",
  },
  {
    id: "mentor",
    label: "Mentor",
    tagline: "Guiding the next generation",
    icon: "🎓",
    bg: "#1C3A6E",
    fg: "#ffffff",
    ringColor: "#ffffff",
    textColor: "#ffffff",
  },
  {
    id: "champion",
    label: "Champion",
    tagline: "Excellence in every endeavor",
    icon: "🏆",
    bg: "#111111",
    fg: "#ffffff",
    ringColor: "#ffffff",
    textColor: "#ffffff",
  },
];

// ─── MASHAR STACKED STONES SVG LOGO ──────────────────────────────────────────
function MasharLogo({ size = 80, color = "#ffffff" }) {
  const s = size;
  return (
    <svg width={s} height={s * 0.85} viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="72" rx="32" ry="7" stroke={color} strokeWidth="2.2" fill="none" />
      <ellipse cx="50" cy="62" rx="28" ry="6" stroke={color} strokeWidth="2.2" fill="none" />
      <ellipse cx="50" cy="52" rx="23" ry="5.5" stroke={color} strokeWidth="2.2" fill="none" />
      <ellipse cx="50" cy="43" rx="18" ry="5" stroke={color} strokeWidth="2.2" fill="none" />
      <ellipse cx="50" cy="35" rx="12" ry="4" stroke={color} strokeWidth="2.2" fill="none" />
      <ellipse cx="50" cy="28" rx="7" ry="3" stroke={color} strokeWidth="2.2" fill="none" />
      <circle cx="50" cy="50" r="2.5" fill={color} />
      <line x1="50" y1="25" x2="50" y2="79" stroke={color} strokeWidth="1.2" strokeDasharray="2 3" opacity="0.4" />
    </svg>
  );
}

// ─── BADGE CARD ───────────────────────────────────────────────────────────────
function BadgeCard({ badge, user, forExport = false }) {
  const size = forExport ? 420 : 175;
  const cx = size / 2;
  const outerR = size * 0.46;
  const innerRingR = size * 0.44;
  const textPathR = size * 0.38;
  const subtextR = size * 0.32;

  function describeArc(x, y, r, startAngle, endAngle) {
    const toRad = (d) => (d * Math.PI) / 180;
    const sx = x + r * Math.cos(toRad(startAngle));
    const sy = y + r * Math.sin(toRad(startAngle));
    const ex = x + r * Math.cos(toRad(endAngle));
    const ey = y + r * Math.sin(toRad(endAngle));
    const la = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${la} 1 ${ex} ${ey}`;
  }

  const bottomArcStart = 155;
  const bottomArcEnd = 385;
  const subArcStart = 170;
  const subArcEnd = 370;
  const logoSize = forExport ? 120 : 50;
  const fontSize = {
    orgLabel: forExport ? 11 : 4.5,
    brandName: forExport ? 38 : 16,
    bottomText: forExport ? 13 : 5.5,
    subText: forExport ? 10 : 4.2,
    userName: forExport ? 14 : 5.8,
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <path id={`bottomArc-${badge.id}-${forExport}`} d={describeArc(cx, cx, textPathR, bottomArcStart, bottomArcEnd)} />
        <path id={`subArc-${badge.id}-${forExport}`} d={describeArc(cx, cx, subtextR, subArcStart, subArcEnd)} />
      </defs>
      <circle cx={cx} cy={cx} r={outerR} fill={badge.bg} />
      <circle cx={cx} cy={cx} r={outerR - size * 0.01} fill="none" stroke={badge.ringColor} strokeWidth={size * 0.006} opacity="0.9" />
      <circle cx={cx} cy={cx} r={innerRingR - size * 0.015} fill="none" stroke={badge.ringColor} strokeWidth={size * 0.004} opacity="0.5" />
      <foreignObject x={cx - logoSize / 2} y={size * 0.13} width={logoSize} height={logoSize * 0.85}>
        <div xmlns="http://www.w3.org/1999/xhtml">
          <MasharLogo size={logoSize} color={badge.fg} />
        </div>
      </foreignObject>
      <text x={cx} y={size * 0.60} textAnchor="middle" fill={badge.fg} fontFamily="'Georgia','Times New Roman',serif" fontSize={fontSize.brandName} fontWeight="400" letterSpacing={forExport ? 1 : 0.5}>Mashar</text>
      {[cx - size * 0.30, cx + size * 0.30].map((starX, i) => (
        <g key={i} transform={`translate(${starX}, ${size * 0.565})`}>
          <polygon points={`0,-${size * 0.025} ${size * 0.008},0 0,${size * 0.025} -${size * 0.008},0`} fill={badge.fg} opacity="0.85" />
          <polygon points={`-${size * 0.025},0 0,${size * 0.008} ${size * 0.025},0 0,-${size * 0.008}`} fill={badge.fg} opacity="0.85" />
        </g>
      ))}
      <line x1={cx - size * 0.22} y1={size * 0.645} x2={cx + size * 0.22} y2={size * 0.645} stroke={badge.ringColor} strokeWidth={size * 0.003} opacity="0.5" />
      <text fontFamily="'Arial',sans-serif" fontSize={fontSize.subText} fill={badge.fg} fontWeight="400" letterSpacing={forExport ? 1.5 : 0.6} opacity="0.8">
        <textPath href={`#subArc-${badge.id}-${forExport}`} startOffset="50%" textAnchor="middle">COACHING · TRAINING · CONSULTANCY</textPath>
      </text>
      <text fontFamily="'Arial','Helvetica',sans-serif" fontSize={fontSize.bottomText} fill={badge.fg} fontWeight="800" letterSpacing={forExport ? 1.2 : 0.5}>
        <textPath href={`#bottomArc-${badge.id}-${forExport}`} startOffset="50%" textAnchor="middle">MEMBER OF THE MASHAR ALUMNI NETWORK</textPath>
      </text>
      {user?.full_name && (
        <>
          <rect x={cx - size * 0.22} y={size * 0.84} width={size * 0.44} height={size * 0.07} rx={size * 0.035} fill={badge.fg} opacity="0.15" />
          <text x={cx} y={size * 0.885} textAnchor="middle" fill={badge.fg} fontFamily="'Arial',sans-serif" fontSize={fontSize.userName} fontWeight="700">{user.full_name}</text>
        </>
      )}
    </svg>
  );
}

// ─── BADGE MODAL ──────────────────────────────────────────────────────────────
export function BadgeModal({ user, onClose }) {
  const [badges, setBadges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { updateUser } = useAuth();

  // Load available badges
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const res = await axios.get("/api/alumni/badges/available", {
          headers: { Authorization: `Bearer ${localStorage.getItem("alumni_token")}` }
        });
        if (res.data.success) {
          setBadges(res.data.data);
          if (res.data.data.length > 0) {
            setSelected(res.data.data[0].badgeId);
          }
        }
      } catch (error) {
        console.error("Error loading badges:", error);
        toast.error("Failed to load badges");
      } finally {
        setLoading(false);
      }
    };
    loadBadges();
  }, []);

  const selectedBadge = badges.find(b => b.badgeId === selected);
  const userBadge = user?.badges?.find(b => b.badgeId === selected);
  const badgeStatus = userBadge?.status || "unrequested";

  async function handleRequest() {
    setRequesting(true);
    try {
      const res = await axios.post(`/api/alumni/badges/request/${selected}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("alumni_token")}` }
      });
      if (res.data.success) {
        toast.success(res.data.message || "Badge requested successfully!");
        updateUser({ ...user, badges: res.data.badges });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request badge");
    } finally {
      setRequesting(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `position:fixed;left:-9999px;top:-9999px;`;
      document.body.appendChild(wrapper);
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(wrapper);
      await new Promise(resolve => {
        root.render(
          <div id="badge-export" style={{ padding: 48, background: "#f0f0f0", display: "inline-block", borderRadius: 32 }}>
            <BadgeCard badge={selectedBadge} user={user} forExport />
          </div>
        );
        setTimeout(resolve, 300);
      });
      const el = wrapper.querySelector("#badge-export");
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#f0f0f0", useCORS: true, logging: false, allowTaint: true });
      const link = document.createElement("a");
      link.download = `mashar_${selectedBadge.id}_badge.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      root.unmount();
      document.body.removeChild(wrapper);
    } catch (err) {
      console.error("Badge download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes bdPop { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes bdFadeIn { from{opacity:0} to{opacity:1} }
        .bd-modal { animation: bdPop 0.22s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .bd-overlay { animation: bdFadeIn 0.18s ease forwards; }
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
      <div className="bd-overlay fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}>
        <div className="absolute inset-0" onClick={onClose} />
        <div className="bd-modal relative z-10 w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ height: 3, background: "linear-gradient(90deg,#0F2056,#F5A623)" }} />
          <div style={{ padding: "20px 24px 16px" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 900, color: "#0D1240", margin: 0 }}>My Badges</h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0", fontFamily: "'DM Sans',sans-serif" }}>Select a badge to request or download</p>
              </div>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(243,137,0,0.25)", background: "rgba(243,137,0,0.08)", color: "#F38900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }} >×</button>
            </div>
          </div>
          <div style={{ padding: "4px 24px 24px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {loading ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#9CA3AF", fontSize: 12 }}>Loading badges...</div>
            ) : badges.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#9CA3AF", fontSize: 12 }}>No badges available</div>
            ) : (
              badges.map(badge => (
                <button key={badge.badgeId} type="button" onClick={() => setSelected(badge.badgeId)} style={{ padding: 0, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, outline: "none" }}>
                  <div style={{ borderRadius: "50%", padding: selected === badge.badgeId ? 3 : 0, background: selected === badge.badgeId ? `linear-gradient(135deg,#0F2056,#F5A623)` : "transparent", boxShadow: selected === badge.badgeId ? `0 0 0 1px rgba(243,166,35,0.3),0 8px 24px rgba(0,0,0,0.2)` : "none" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {badge.image ? (
                        <img src={resolveAssetUrl(badge.image)} alt={badge.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: 24 }}>🏆</span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 800, color: selected === badge.badgeId ? "#F5A623" : "#9CA3AF", margin: 0 }}>{badge.name}</p>
                </button>
              ))
            )}
          </div>
          {selectedBadge && (
            <div style={{ margin: "0 24px 20px", padding: "12px 16px", background: "rgba(243,166,35,0.06)", borderRadius: 12, border: "1px solid rgba(243,166,35,0.18)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, overflow: "hidden" }}>
                {selectedBadge.image ? (
                  <img src={resolveAssetUrl(selectedBadge.image)} alt={selectedBadge.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : "🏆"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 800, color: "#0D1240", margin: 0 }}>{selectedBadge.name}</p>
                <p style={{ fontSize: 10, color: "#9CA3AF", margin: "2px 0 0", fontFamily: "'DM Sans',sans-serif" }}>{selectedBadge.description}</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: "3px 10px", borderRadius: 999, background: badgeStatus === "approved" ? "rgba(34,197,94,0.12)" : badgeStatus === "pending" ? "rgba(234,179,8,0.12)" : "rgba(156,163,175,0.12)", color: badgeStatus === "approved" ? "#15803d" : badgeStatus === "pending" ? "#a16207" : "#6b7280" }}>
                {badgeStatus === "approved" ? "✓ Approved" : badgeStatus === "pending" ? "⏳ Pending" : badgeStatus === "rejected" ? "✕ Rejected" : "Not Requested"}
              </span>
            </div>
          )}
          <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1px solid rgba(243,166,35,0.2)", background: "rgba(243,166,35,0.06)", color: "#b85e00", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
            {badgeStatus === "approved" && (
              <button onClick={handleDownload} disabled={downloading} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: downloading ? "rgba(243,166,35,0.5)" : "linear-gradient(135deg,#F5A623,#d67600)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: downloading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {downloading ? <><svg style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Preparing…</> : <>⬇ Download PNG</>}
              </button>
            )}
            {badgeStatus === "pending" && (
              <button disabled style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: "rgba(156,163,175,0.2)", color: "#6B7280", fontSize: 12, fontWeight: 700, cursor: "not-allowed", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>⏳ Pending Approval</button>
            )}
            {(badgeStatus === "unrequested" || badgeStatus === "rejected") && (
              <button onClick={handleRequest} disabled={requesting} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: requesting ? "rgba(243,166,35,0.6)" : "linear-gradient(135deg,#F5A623,#d67600)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: requesting ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {requesting ? <><svg style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Requesting…</> : badgeStatus === "rejected" ? <>↺ Request Again</> : <>Request Badge</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
export default function AlumniSidebar({ collapsed, mobileOpen, closeMobile }) {
  const { user } = useAuth();
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  return (
    <>
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
      `}</style>
      
      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={closeMobile} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" />
      )}

      <aside className={`
        fixed lg:static z-50 top-0 left-0 h-full
        bg-[#0F172A] text-slate-100 flex flex-col
        border-r border-slate-800/50
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* LOGO */}
        <div className={`flex items-center justify-center border-b border-slate-800/50 ${collapsed ? "px-2" : "px-4"}`}>
          <img
            src={alumniLogoWhite}
            alt="Mashar Alumni Logo"
            className={`transition-all duration-300 object-contain ${collapsed ? "w-12" : "w-52 -ml-3"}`}
          />
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 sidebar-scroll">
          <Section label="Main" collapsed={collapsed} />
          <NavItem to="/alumni" icon="home" label="Dashboard" collapsed={collapsed} />
          <NavItem to="/alumni/profile" icon="user" label="My Profile" collapsed={collapsed} />

          {/* Programs & Learning */}
          <NavItem
            to="/alumni/programs"
            icon="academic"
            label="Learning Center"
            collapsed={collapsed}
          />
          <NavItem to="/alumni/resourcessection" icon="folder" label="Resources" collapsed={collapsed} />
          {/* Events — alumni request sessions */}
          <NavItem
            to="/alumni/events"
            icon="events"
            label="Events"
            collapsed={collapsed}
          />
          <NavItem to="/alumni/discussion" icon="message" label="Discussion" collapsed={collapsed} />
          <NavItem to="/alumni/activity" icon="activity" label="Activity" collapsed={collapsed} />
          {/* <Section label="Community" collapsed={collapsed} /> */}
          <NavItem to="/alumni/directory" icon="users" label="Directory" collapsed={collapsed} />
          {/* <NavItem to="/alumni/spotlight" icon="bell" label="Announcements" collapsed={collapsed} /> */}
          {/* <Section label="Resources" collapsed={collapsed} /> */}

          {/* Engage — about, get involved, directory */}
          <NavItem
            to="/alumni/engage"
            icon="engage"
            label="Community"
            collapsed={collapsed}
          />

          <NavItem to="/alumni/calendar" icon="calendar" label="Calendar" collapsed={collapsed} />
          <NavItem to="/alumni/contact" icon="contact" label="Contact Us" collapsed={collapsed} />
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={() => setShowBadgeModal(true)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium text-sm transition-all duration-200 ${collapsed ? "p-2" : ""}`}
            style={{ background: "linear-gradient(135deg,#F5A623,#d67600)", boxShadow: "0 4px 16px rgba(245,166,35,0.35)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#ffba44,#F5A623)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#F5A623,#d67600)"; }}
            title={collapsed ? "My Badges" : undefined}
          >
            🎖️{!collapsed && " My Badges"}
          </button>
        </div>
      </aside>

      {showBadgeModal && <BadgeModal user={user} onClose={() => setShowBadgeModal(false)} />}
    </>
  );
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────*/
function Section({ label, collapsed }) {
  if (collapsed) return <div className="h-px bg-slate-800/50 my-4 mx-4" />;
  return <p className="px-4 pt-4 pb-2 text-[10px] tracking-[2px] uppercase text-slate-500 font-bold">{label}</p>;
}

function NavItem({ to, icon, label, badge, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) => `
        px-4 py-3 rounded-xl border border-transparent
        transition-all duration-200 flex items-center gap-3
        ${isActive ? "font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}
      `}
      style={({ isActive }) => isActive ? { background: "rgba(245,166,35,0.12)", color: "#F5A623", borderColor: "rgba(245,166,35,0.2)" } : {}}
    >
      <Icon name={icon} />
      {!collapsed && <span className="flex-1 text-sm font-semibold">{label}</span>}
      {!collapsed && badge && (
        <span className="text-[7px] px-2 py-1 rounded-full text-white font-bold uppercase" style={{ background: "#F5A623" }}>{badge}</span>
      )}
    </NavLink>
  );
}

function Icon({ name }) {
  const icons = {
    home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m2-2l6-4m4 0l2 3m0 0l-2 3m2-3v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7m12 0V5" /></svg>,
    user: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646zM12 16a7 7 0 100-14 7 7 0 000 14z" /></svg>,
    message: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    folder: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
    bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    activity: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h3l2 5 4-10 3 6 3-8 2 5h3" /></svg>,
    // ── Programs/Learning ──
    academic: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14V4M4.93 10.93L12 4l7.07 6.93" />
      </svg>
    ),
    // ── Events ──
    events: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
        <circle cx="8" cy="15" r="1.5" fill="currentColor" />
        <circle cx="16" cy="15" r="1.5" fill="currentColor" />
      </svg>
    ),
    // ── Engage ──
    engage: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    // ── Contact ──
    contact: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };
  return icons[name] || null;
}