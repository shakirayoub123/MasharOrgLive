import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { resolveAssetUrl } from "../../utils/baseUrl";

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

// ─── AVATAR COLOR PALETTE ─────────────────────────────────────────────────────
const AVATAR_PALETTE = [
    { bg: "#0F1C80", color: "#EEF0FF" }, // navy
    { bg: "#C45000", color: "#FFF4E0" }, // orange
    { bg: "#6B21A8", color: "#F5F0FF" }, // purple
    { bg: "#065F46", color: "#ECFDF5" }, // green
    { bg: "#9D174D", color: "#FFF1F2" }, // rose
    { bg: "#1D4ED8", color: "#EFF6FF" }, // blue
    { bg: "#B45309", color: "#FFFBEB" }, // amber
    { bg: "#0F766E", color: "#F0FDFA" }, // teal
];

function getAvatarColor(name = "") {
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

// ─── COURSE / STATUS CONFIG ───────────────────────────────────────────────────
const COURSE_COLORS = {
    CPCP: { bg: NAVY_50, color: NAVY },
    PMP: { bg: ORANGE_50, color: "#C45000" },
    PMF: { bg: "#F5F0FF", color: "#6B21A8" },
    "B.E": { bg: "#ECFDF5", color: "#065F46" },
    default: { bg: "#F3F4F6", color: TB },
};

const STATUS_CONFIG = {
    graduate: { label: "Graduate", bg: "#ECFDF5", color: "#065F46" },
    certified: { label: "Certified", bg: ORANGE_50, color: "#C45000" },
    accredited: { label: "Accredited", bg: NAVY_50, color: NAVY },
    passed: { label: "Passed", bg: "#F5F0FF", color: "#6B21A8" },
    in_progress: { label: "In Progress", bg: "#FFF1F2", color: "#9D174D" },
};

const STATUSES = ["All", "graduate", "certified", "accredited", "passed", "in_progress"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getInitials(name = "") {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

// ─── AVATAR — varied color per name ──────────────────────────────────────────
function Avatar({ name, avatar, size = 48 }) {
    const { bg, color } = getAvatarColor(name);

    if (avatar) {
        const src = resolveAssetUrl(avatar);
        return (
            <img
                src={src}
                alt={name}
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: `2px solid rgba(255,255,255,0.6)`,
                }}
            />
        );
    }

    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: bg, color: color, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.3, fontWeight: 900,
            fontFamily: "'Sora', sans-serif", letterSpacing: "0.5px",
            border: `2px solid rgba(255,255,255,0.6)`,
        }}>
            {getInitials(name)}
        </div>
    );
}

// ─── ALUMNI CARD ──────────────────────────────────────────────────────────────
function AlumniCard({ alumni, onClick, highlighted }) {
    const [hov, setHov] = useState(false);
    const course = alumni.course || "";
    const courseStyle = COURSE_COLORS[course] || COURSE_COLORS.default;
    const statusCfg = STATUS_CONFIG[alumni.completion_status] || { label: alumni.completion_status, bg: "#F3F4F6", color: TB };

    return (
        <div
            onClick={() => onClick(alumni)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: CARD, borderRadius: 16, overflow: "hidden", cursor: "pointer",
                border: `1px solid ${highlighted ? NAVY_100 : hov ? NAVY_100 : NAVY_50}`,
                boxShadow: highlighted
                    ? `0 0 0 2px ${NAVY}, 0 8px 28px rgba(15,28,128,.13)`
                    : hov ? "0 8px 28px rgba(15,28,128,.10)" : "0 1px 4px rgba(15,28,128,.05)",
                transform: hov || highlighted ? "translateY(-3px)" : "none",
                transition: "all .2s ease",
                position: "relative",
            }}
        >
            {/* Top navy bar */}
            <div style={{ height: 3, background: NAVY }} />

            <div style={{ padding: "16px 16px 14px" }}>
                {/* Spotlight / Online badge */}
                {highlighted && (
                    <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: NAVY, color: "#fff",
                        fontSize: 9.5, fontWeight: 800, letterSpacing: "0.5px",
                        padding: "3px 10px", borderRadius: 20,
                    }}>✦ Spotlight</div>
                )}
                {alumni.isOnline && !highlighted && (
                    <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "#ECFDF5", color: "#065F46",
                        fontSize: 9.5, fontWeight: 800, letterSpacing: "0.5px",
                        padding: "3px 10px", borderRadius: 20,
                    }}>🟢 Online</div>
                )}

                {/* Top row: avatar + name */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <Avatar name={alumni.full_name} avatar={alumni.avatar} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontFamily: "'Sora', sans-serif", fontWeight: 800,
                            fontSize: 14.5, color: TH, lineHeight: 1.2,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{alumni.full_name}</div>
                        <div style={{ fontSize: 12, color: NAVY, fontWeight: 700, marginTop: 2 }}>{course}</div>
                        <div style={{ fontSize: 11.5, color: TS, marginTop: 1 }}>{alumni.country || "—"}</div>
                    </div>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{
                        fontSize: 10.5, fontWeight: 700, borderRadius: 20,
                        padding: "3px 10px", background: courseStyle.bg, color: courseStyle.color,
                    }}>{course}</span>
                    <span style={{
                        fontSize: 10.5, fontWeight: 700, borderRadius: 20,
                        padding: "3px 10px", background: statusCfg.bg, color: statusCfg.color,
                    }}>{statusCfg.label}</span>
                </div>

                {/* Meta row */}
                <div style={{
                    display: "flex", gap: 10, fontSize: 11.5, color: TS,
                    borderTop: `1px solid ${NAVY_50}`, paddingTop: 10,
                    justifyContent: "space-between", alignItems: "center",
                }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {alumni.country ? `📍 ${alumni.city ? alumni.city + ", " : ""}${alumni.country}` : ""}
                    </span>
                    <span style={{ flexShrink: 0, color: hov ? NAVY : TS, fontWeight: hov ? 700 : 500, transition: "color .2s" }}>
                        {alumni.completion_year ? `🎓 '${alumni.completion_year.slice(2)}` : "View →"}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────
function DetailPanel({ alumni, onClose }) {
    if (!alumni) return null;
    const statusCfg = STATUS_CONFIG[alumni.completion_status] || { label: alumni.completion_status, bg: "#F3F4F6", color: TB };
    const { bg: avatarBg, color: avatarColor } = getAvatarColor(alumni.full_name);

    return (
        <>
            <div onClick={onClose} style={{
                position: "fixed", inset: 0, background: "rgba(13,18,64,0.35)",
                zIndex: 100, backdropFilter: "blur(4px)", animation: "dp-fade .2s ease",
            }} />
            <div style={{
                position: "fixed", right: 0, top: 0, bottom: 0, width: 400,
                background: CARD, zIndex: 101, overflowY: "auto",
                boxShadow: "-8px 0 40px rgba(15,28,128,.15)",
                animation: "dp-slide .25s cubic-bezier(.4,0,.2,1)",
                fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column",
            }}>
                {/* Header — uses avatar color as accent */}
                <div style={{
                    background: `linear-gradient(135deg,${NAVY} 0%,#1A2FA0 100%)`,
                    padding: "28px 24px 22px", position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", border: "2px solid rgba(255,255,255,.12)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", right: 40, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(243,137,0,.15)", pointerEvents: "none" }} />

                    <button onClick={onClose} style={{
                        position: "absolute", top: 14, right: 14,
                        border: "none", background: "rgba(255,255,255,.15)", borderRadius: "50%",
                        width: 32, height: 32, cursor: "pointer", color: "#fff",
                        fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background .15s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.28)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.15)"}
                    >✕</button>

                    <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative" }}>
                        {/* Larger avatar in detail panel also gets varied color */}
                        {alumni.avatar ? (
                            <img
                                src={resolveAssetUrl(alumni.avatar)}
                                alt={alumni.full_name}
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    flexShrink: 0,
                                    border: `3px solid rgba(255,255,255,0.5)`,
                                    boxShadow: `0 0 0 4px rgba(255,255,255,0.15)`,
                                }}
                            />
                        ) : (
                            <div style={{
                                width: 64, height: 64, borderRadius: "50%",
                                background: avatarBg, color: avatarColor, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 64 * 0.3, fontWeight: 900,
                                fontFamily: "'Sora', sans-serif", letterSpacing: "0.5px",
                                border: `3px solid rgba(255,255,255,0.5)`,
                                boxShadow: `0 0 0 4px rgba(255,255,255,0.15)`,
                            }}>
                                {getInitials(alumni.full_name)}
                            </div>
                        )}
                        <div>
                            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 900, fontSize: 19, color: "#fff", lineHeight: 1.2 }}>{alumni.full_name}</div>
                            <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", marginTop: 3, fontWeight: 600 }}>{alumni.course}</div>
                            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{alumni.email}</div>
                        </div>
                    </div>

                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        marginTop: 14, background: "rgba(255,255,255,.15)", borderRadius: 20,
                        padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#fff",
                    }}>
                        {alumni.isOnline ? "🟢 Online" : "⚫ Offline"}
                    </div>
                </div>

                {/* Accent stripe */}
                <div style={{ height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />

                {/* Body */}
                <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                            { icon: "📍", label: "Location", val: [alumni.city, alumni.country].filter(Boolean).join(", ") || "—" },
                            { icon: "🎓", label: "Batch", val: alumni.completion_year || "—" },
                            { icon: "📚", label: "Course", val: alumni.course || "—" },
                            { icon: "📋", label: "Status", val: statusCfg.label },
                        ].map(({ icon, label, val }) => (
                            <div key={label} style={{ background: NAVY_50, borderRadius: 12, padding: "11px 13px", border: `1px solid ${NAVY_100}` }}>
                                <div style={{ fontSize: 9.5, color: TS, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.6px" }}>{icon} {label}</div>
                                <div style={{ fontSize: 13, color: TH, fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>{val}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ height: 1, background: NAVY_50 }} />

                    {alumni.bio && (
                        <>
                            <div>
                                <div style={{ fontSize: 9.5, fontWeight: 800, color: TS, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>About</div>
                                <p style={{ fontSize: 13.5, color: TB, lineHeight: 1.75, margin: 0 }}>{alumni.bio}</p>
                            </div>
                            <div style={{ height: 1, background: NAVY_50 }} />
                        </>
                    )}

                    <div>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: TS, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Program Status</div>
                        <span style={{ fontSize: 13, fontWeight: 700, borderRadius: 20, padding: "6px 16px", background: statusCfg.bg, color: statusCfg.color }}>{statusCfg.label}</span>
                    </div>

                    <div style={{ height: 1, background: NAVY_50 }} />

                    <div style={{ fontSize: 12, color: TS, textAlign: "center" }}>
                        Member since {new Date(alumni.createdAt).toLocaleDateString([], { month: "long", year: "numeric" })}
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div style={{ background: CARD, borderRadius: 16, overflow: "hidden", border: `1px solid ${NAVY_50}` }}>
            <div style={{ height: 3, background: NAVY_50 }} />
            <div style={{ padding: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: NAVY_50, animation: "dir-pulse 1.6s ease infinite" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ height: 13, background: NAVY_50, borderRadius: 4, marginBottom: 7, width: "65%", animation: "dir-pulse 1.6s ease infinite" }} />
                        <div style={{ height: 10, background: NAVY_50, borderRadius: 4, width: "40%", animation: "dir-pulse 1.6s ease .15s infinite" }} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    <div style={{ height: 22, width: 60, background: NAVY_50, borderRadius: 20, animation: "dir-pulse 1.6s ease infinite" }} />
                    <div style={{ height: 22, width: 72, background: NAVY_50, borderRadius: 20, animation: "dir-pulse 1.6s ease .1s infinite" }} />
                </div>
                <div style={{ height: 10, background: NAVY_50, borderRadius: 4, animation: "dir-pulse 1.6s ease infinite" }} />
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AlumniDirectory() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("All");
    const [status, setStatus] = useState("All");
    const [selected, setSelected] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        axios.get("/api/alumni/members", {
            headers: { Authorization: `Bearer ${localStorage.getItem("alumni_token")}` }
        })
            .then(res => setAlumni((res.data.data || []).filter(a => a.account_status === "approved")))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const id = searchParams.get("highlight");
        if (!id || alumni.length === 0) return;
        const found = alumni.find(a => a._id === id);
        if (found) setSelected(found);
    }, [alumni, searchParams]);

    const courses = useMemo(() => {
        const unique = [...new Set(alumni.map(a => a.course).filter(Boolean))];
        return ["All", ...unique];
    }, [alumni]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return alumni.filter(a => {
            const matchSearch = !q ||
                a.full_name?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.course?.toLowerCase().includes(q) ||
                a.country?.toLowerCase().includes(q) ||
                a.city?.toLowerCase().includes(q);
            return matchSearch &&
                (course === "All" || a.course === course) &&
                (status === "All" || a.completion_status === status);
        });
    }, [search, course, status, alumni]);

    const hasFilters = search || course !== "All" || status !== "All";
    const highlightId = searchParams.get("highlight");

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes dir-fadeup  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes dp-fade     { from { opacity: 0; } to { opacity: 1; } }
                @keyframes dp-slide    { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes dir-pulse   { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
                .dir-card { animation: dir-fadeup .28s ease both; }
                .dir-search:focus { outline: none; border-color: ${NAVY} !important; box-shadow: 0 0 0 3px rgba(15,28,128,.1); }
                .dir-search::placeholder { color: ${TS}; }
            `}</style>

            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

                {/* ── PAGE HEADER ── */}
                <div style={{
                    borderRadius: 18, padding: "22px 24px 22px 28px", marginBottom: 20,
                    border: `1px solid ${NAVY_100}`,
                    borderLeft: `4px solid transparent`,
                    backgroundImage: `linear-gradient(135deg, ${NAVY_50} 0%, #E5E8FF 55%, ${ORANGE_50} 100%), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
                    backgroundOrigin: `border-box`,
                    backgroundClip: `padding-box, border-box`,
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", border: `2px solid rgba(15,28,128,.07)`, pointerEvents: "none" }} />

                    <div>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: "rgba(15,28,128,.08)", border: "1px solid rgba(15,28,128,.14)",
                            borderRadius: 20, padding: "3px 11px", marginBottom: 10,
                        }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: NAVY }} />
                            <span style={{ fontSize: 9.5, fontWeight: 800, color: NAVY, letterSpacing: "1.1px", textTransform: "uppercase" }}>
                                Mashar Alumni Network
                            </span>
                        </div>
                        <h1 style={{
                            fontFamily: "'Sora', sans-serif", fontSize: "clamp(18px,3vw,24px)",
                            fontWeight: 900, color: TH, margin: "0 0 6px", letterSpacing: "-0.3px",
                        }}>
                            👥 Alumni Directory
                        </h1>
                        <p style={{ fontSize: 13.5, color: TB, margin: 0 }}>
                            Search and explore{" "}
                            <span style={{ fontWeight: 700, color: NAVY }}></span>{" "}
                            Mashar alumni. Click a profile to view full details.
                        </p>
                    </div>
                </div>

                {/* ── SEARCH ── */}
                <div style={{ position: "relative", marginBottom: 12 }}>
                    <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                    <input
                        className="dir-search"
                        type="text"
                        placeholder="Search by name, email, course, country…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: "100%", padding: "10px 14px 10px 38px",
                            border: `1.5px solid ${NAVY_100}`, borderRadius: 12,
                            fontSize: 13.5, background: CARD, color: TH,
                            transition: "border-color .15s, box-shadow .15s",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    />
                </div>

                {/* ── FILTERS ── */}
                <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
                    {courses.map(c => (
                        <button key={c} onClick={() => setCourse(c)} style={{
                            border: "none", borderRadius: 20, padding: "6px 14px",
                            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                            background: course === c ? ORANGE : CARD,
                            color: course === c ? "#fff" : TB,
                            boxShadow: course === c ? `0 3px 10px ${ORANGE}44` : `0 1px 4px rgba(15,28,128,.06)`,
                            fontFamily: "'DM Sans', sans-serif", transition: "all .15s",
                        }}>{c}</button>
                    ))}

                    <div style={{ width: 1, height: 24, background: NAVY_100, margin: "0 2px" }} />

                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        style={{
                            border: `1.5px solid ${NAVY_100}`, borderRadius: 20, padding: "6px 14px",
                            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                            background: CARD, color: TB, fontFamily: "'DM Sans', sans-serif",
                            outline: "none",
                        }}
                    >
                        {STATUSES.map(s => (
                            <option key={s} value={s}>{s === "All" ? "All Status" : STATUS_CONFIG[s]?.label || s}</option>
                        ))}
                    </select>
                </div>

                {/* ── RESULTS BAR ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <span style={{ fontSize: 13, color: TS }}>
                        Showing <strong style={{ color: NAVY }}>{filtered.length}</strong> of {alumni.length} alumni
                    </span>
                    {hasFilters && (
                        <button onClick={() => { setSearch(""); setCourse("All"); setStatus("All"); }} style={{
                            border: "none", background: "none", color: ORANGE,
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                        }}>Clear all ✕</button>
                    )}
                </div>

                {/* ── SKELETONS ── */}
                {loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* ── GRID ── */}
                {!loading && filtered.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                        {filtered.map((a, i) => (
                            <div key={a._id} className="dir-card" style={{ animationDelay: `${i * 35}ms` }}>
                                <AlumniCard alumni={a} onClick={setSelected} highlighted={a._id === highlightId} />
                            </div>
                        ))}
                    </div>
                )}

                {/* ── EMPTY STATE ── */}
                {!loading && filtered.length === 0 && (
                    <div style={{
                        textAlign: "center", padding: "52px 20px",
                        background: NAVY_50, borderRadius: 18, border: `1px solid ${NAVY_100}`,
                    }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16, color: TH, marginBottom: 6 }}>No alumni found</div>
                        <div style={{ fontSize: 13, color: TS }}>Try a different search or filter</div>
                    </div>
                )}

                <DetailPanel alumni={selected} onClose={() => setSelected(null)} />
            </div>
        </>
    );
}