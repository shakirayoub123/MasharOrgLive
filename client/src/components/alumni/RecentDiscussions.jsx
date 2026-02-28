import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { resolveAssetUrl } from "../../utils/baseUrl";

function imgSrc(image) {
    return resolveAssetUrl(image);
}

// ─── THEME TOKENS ──────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const NAVY_200 = "#DDE0FF";
const CARD = "#FFFFFF";
const TH = "#0D1240";
const TB = "#4B5563";
const TS = "#9CA3AF";

const AVATAR_COLORS = [
    { bg: "#0F1C80", fg: "#E8EBFF" },
    { bg: "#F38900", fg: "#FFF4E0" },
    { bg: "#1A2FA0", fg: "#EEF0FF" },
    { bg: "#C46D00", fg: "#FFF4E0" },
    { bg: "#0B5299", fg: "#E0EEFF" },
];

function avatarColor(name = "") {
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || AVATAR_COLORS[0];
}

function initials(n = "") {
    return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function ago(d) {
    if (!d) return "";
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

function Av({ name = "", size = 32 }) {
    const { bg, fg } = avatarColor(name);
    return (
        <div
            className="rounded-full flex items-center justify-center font-black shrink-0 select-none"
            style={{
                width: size,
                height: size,
                minWidth: size,
                background: bg,
                color: fg,
                fontSize: size * 0.32,
            }}
        >
            {initials(name)}
        </div>
    );
}

// ─── MEMBER PROFILE POPUP ────────────────────────────────────────────────────
function MemberPopup({ name, onClose, allMembers = [] }) {
    const member = allMembers.find(m => m.full_name.toLowerCase() === name.toLowerCase());
    const { bg, fg } = avatarColor(name);

    const infoRows = member ? [
        { icon: "🎓", label: "Course", value: member.course },
        { icon: "📅", label: "Graduated", value: member.completion_year },
        { icon: "📍", label: "Location", value: [member.city, member.country].filter(Boolean).join(", ") || "—" },
        { icon: "✉️", label: "Email", value: member.email },
    ].filter(r => r.value) : [];

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[min(360px,92vw)] bg-white rounded-2xl shadow-2xl border border-[#DDE0FF]"
                style={{ animation: "modalIn .18s ease", overflow: "visible" }}>

                <div className="h-24 rounded-t-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0F1C80,#1A2FA0 60%,#F38900)" }}>
                    <button onClick={onClose}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs hover:bg-white/30 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="px-5 pb-5" style={{ overflow: "visible" }}>
                    <div className="flex items-end gap-3 mb-3" style={{ marginTop: -32 }}>
                        <div className="rounded-2xl border-4 border-white shadow-lg flex items-center justify-center font-black shrink-0"
                            style={{ width: 64, height: 64, background: bg, color: fg, fontSize: 22, zIndex: 1, position: "relative" }}>
                            {initials(name)}
                        </div>
                        {member && (
                            <div className="pb-1">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${member.isOnline ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${member.isOnline ? "bg-emerald-500" : "bg-gray-300"}`} />
                                    {member.isOnline ? "Online" : "Offline"}
                                </span>
                            </div>
                        )}
                    </div>

                    {!member ? (
                        <div className="py-6 text-center">
                            <p className="text-2xl mb-1">🔍</p>
                            <p className="text-sm font-bold text-gray-500">Member not found</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-black text-[#0D1240] text-lg leading-tight">{member.full_name}</h3>
                            {member.bio && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{member.bio}</p>}

                            <div className="mt-3 space-y-2">
                                {infoRows.map(({ icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-2.5 text-xs">
                                        <span className="w-6 h-6 rounded-lg bg-[#EEF0FF] flex items-center justify-center text-sm shrink-0">{icon}</span>
                                        <span className="text-gray-400 shrink-0">{label}</span>
                                        <span className="font-semibold text-[#0D1240] truncate">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${member.completion_status === "graduate"
                                    ? "bg-[#EEF0FF] text-[#0F1C80] border-[#DDE0FF]"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}>
                                    {member.completion_status === "graduate" ? "🎓 Graduate" : "📚 " + member.completion_status}
                                </span>
                                <span className="text-[10px] text-gray-400">Joined {new Date(member.createdAt).getFullYear()}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── RENDER MENTIONS ────────────────────────────────────────────────────────
function renderMentions(text, onMentionClick) {
    if (!text) return null;

    const parts = [];
    let lastIndex = 0;
    const mentionRegex = /@[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?=\s|$)/g;

    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        const fullMention = match[0];
        const name = fullMention.slice(1).trim();

        parts.push(
            <span
                key={`mention-${match.index}`}
                onClick={e => {
                    e.stopPropagation();
                    onMentionClick?.(name);
                }}
                className="text-[#0F1C80] font-bold bg-[#EEF0FF] rounded px-0.5 cursor-pointer hover:bg-[#DDE0FF] transition-colors"
            >
                {fullMention}
            </span>
        );

        lastIndex = match.index + fullMention.length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}

// ─── SHARED CARD WRAPPER STYLE ───────────────────────────────────────────────
const cardStyle = {
    background: CARD,
    borderRadius: 16,
    border: `1px solid ${NAVY_100}`,
    borderLeft: `4px solid transparent`,
    backgroundImage: `linear-gradient(white, white), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
    backgroundOrigin: `border-box`,
    backgroundClip: `padding-box, border-box`,
    overflow: "hidden",
    boxShadow: "0 1px 5px rgba(15,28,128,.05)",
    fontFamily: "'DM Sans', sans-serif",
};

export default function RecentDiscussions() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [memberName, setMemberName] = useState(null);

    useEffect(() => {
        Promise.all([
            API.get("/alumni/posts", { params: { tab: "discussion", limit: 4 } }),
            API.get("/alumni/members"),
        ])
            .then(([postsRes, membersRes]) => {
                const postsData = postsRes.data.data || [];
                setPosts(postsData);
                setMembers(membersRes.data.data || membersRes.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ ...cardStyle, padding: 20 }}>
                <div className="flex items-center justify-center py-12">
                    <div
                        className="w-6 h-6 border-2 border-[#0F1C80] border-t-transparent rounded-full animate-spin"
                        style={{ borderTopColor: "transparent" }}
                    />
                </div>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div style={cardStyle}>
                {/* ── header ── */}
                <div style={{
                    padding: "16px 20px 14px",
                    borderBottom: `1px solid ${NAVY_50}`,
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                }}>
                    <div>
                        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: TH, margin: "0 0 3px", letterSpacing: "-0.2px" }}>
                            📢 Announcements & Updates
                        </h2>
                        <p style={{ fontSize: 12, color: TS, margin: 0 }}>Stay informed and never miss an update from Mashar.
Be the first to know about alumni gatherings, upcoming programs, special initiatives, and important community announcements.</p>
                    </div>
                </div>

                <div className="text-center py-10">
                    <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: TH, marginBottom: 4 }}>
                        No discussions yet
                    </p>
                    <p style={{ fontSize: 12, color: TS }}>
                        Be the first to start a discussion!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
        @keyframes modalIn { from { opacity:0; transform:translate(-50%,-48%) } to { opacity:1; transform:translate(-50%,-50%) } }
        .disc-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .disc-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .disc-scrollbar::-webkit-scrollbar-thumb {
            background: ${NAVY_100};
            border-radius: 3px;
        }
        .disc-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${NAVY};
        }
        .post-card {
            transition: all 0.2s ease;
            border-bottom: 1px solid ${NAVY_50};
        }
        .post-card:hover {
            background: ${NAVY_50};
        }
        .post-card:last-child {
            border-bottom: none;
        }
        .comment-author:hover {
            text-decoration: underline;
        }
      `}</style>

            <div style={cardStyle}>

                {/* ── header ── */}
                <div style={{
                    padding: "16px 20px 14px",
                    borderBottom: `1px solid ${NAVY_50}`,
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                }}>
                    <div>
                        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: TH, margin: "0 0 3px", letterSpacing: "-0.2px" }}>
                            📢 Announcements & Updates
                        </h2>
                        <p style={{ fontSize: 12, color: TS, margin: 0 }}>Stay informed and never miss an update from Mashar.
Be the first to know about alumni gatherings, upcoming programs, special initiatives, and important community announcements.</p>
                    </div>
                    <button
                        onClick={() => navigate("/alumni/discussion")}
                        style={{
                            fontSize: 11.5, fontWeight: 700, color: NAVY,
                            background: NAVY_50, padding: "4px 11px", borderRadius: 20,
                            border: `1px solid ${NAVY_100}`, flexShrink: 0,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = NAVY_100;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = NAVY_50;
                        }}
                    >
                        View all →
                    </button>
                </div>

                {/* ── scrollable posts container ── */}
                <div
                    className="disc-scrollbar"
                    style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                    }}
                >
                    {posts.map((post) => (
                        post && post.author ? (
                            <div
                                key={post._id}
                                className="post-card"
                                onClick={() => navigate("/alumni/discussion")}
                                style={{
                                    padding: "16px 20px",
                                    cursor: "pointer",
                                }}
                            >
                                {/* author section */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <Av name={post.author.full_name} size={40} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: TH, margin: 0 }}>
                                            {post.author.full_name}
                                        </p>
                                        <p style={{ fontSize: 11, color: TS, margin: "2px 0 0" }}>
                                            <span style={{ fontWeight: 600, color: avatarColor(post.author.full_name).bg }}>
                                                {post.author.course}
                                            </span>
                                            <span style={{ margin: "0 6px" }}>·</span>
                                            {ago(post.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* title */}
                                {post.title && (
                                    <p style={{
                                        fontSize: 13, fontWeight: 700, color: TH,
                                        margin: "0 0 8px", wordBreak: "break-word",
                                    }}>
                                        {post.title}
                                    </p>
                                )}

                                {/* content */}
                                {post.content && (
                                    <p style={{
                                        fontSize: 13, color: TB,
                                        lineHeight: 1.5, margin: "0 0 8px",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}>
                                        {renderMentions(post.content, setMemberName)}
                                    </p>
                                )}

                                {/* image */}
                                {post.image && (
                                    <div style={{
                                        marginBottom: 10,
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        border: `1px solid ${NAVY_100}`,
                                        maxHeight: 160,
                                        width: "100%",
                                    }}>
                                        <img
                                            src={imgSrc(post.image)}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                            onError={(e) => {
                                                e.target.parentElement.style.display = "none";
                                            }}
                                        />
                                    </div>
                                )}

                                {/* engagement metrics */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    fontSize: 11,
                                    color: TS,
                                }}>
                                    {post.likesCount > 0 && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <span>❤️</span>
                                            {post.likesCount}
                                        </span>
                                    )}
                                    {post.comments?.length > 0 && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <span>💬</span>
                                            {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
                                        </span>
                                    )}
                                    {!post.commentsOpen && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <span>🔒</span>
                                            Locked
                                        </span>
                                    )}
                                </div>

                                {/* ── comments preview ── */}
                                {post.comments?.length > 0 && (
                                    <div style={{
                                        marginTop: 10,
                                        paddingTop: 10,
                                        borderTop: `1px dashed ${NAVY_100}`,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}>
                                        {post.comments.slice(-2).map((comment, idx) => (
                                            comment && comment.author ? (
                                                <div
                                                    key={comment._id || idx}
                                                    onClick={e => e.stopPropagation()}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "flex-start",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <Av name={comment.author?.full_name || "?"} size={24} />
                                                    <div style={{
                                                        flex: 1,
                                                        background: NAVY_50,
                                                        borderRadius: 10,
                                                        padding: "6px 10px",
                                                        border: `1px solid ${NAVY_100}`,
                                                    }}>
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 6,
                                                            marginBottom: 2,
                                                        }}>
                                                            <span
                                                                className="comment-author"
                                                                onClick={() => setMemberName(comment.author?.full_name)}
                                                                style={{
                                                                    fontSize: 11,
                                                                    fontWeight: 700,
                                                                    color: TH,
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                {comment.author?.full_name}
                                                            </span>
                                                            <span style={{ fontSize: 10, color: TS }}>·</span>
                                                            <span style={{ fontSize: 10, color: TS }}>{ago(comment.createdAt)}</span>
                                                        </div>
                                                        <p style={{
                                                            fontSize: 12,
                                                            color: TB,
                                                            margin: 0,
                                                            lineHeight: 1.45,
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                        }}>
                                                            {renderMentions(comment.content, setMemberName)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : null
                                        ))}
                                        {post.comments.length > 2 && (
                                            <p
                                                onClick={e => { e.stopPropagation(); navigate("/alumni/discussion"); }}
                                                style={{
                                                    fontSize: 11,
                                                    color: NAVY,
                                                    fontWeight: 600,
                                                    margin: 0,
                                                    paddingLeft: 32,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                + {post.comments.length - 2} more comment{post.comments.length - 2 > 1 ? "s" : ""}…
                                            </p>
                                        )}
                                    </div>
                                )}

                            </div>
                        ) : null
                    ))}
                </div>

            </div>

            {memberName && <MemberPopup name={memberName} onClose={() => setMemberName(null)} allMembers={members} />}
        </>
    );
}