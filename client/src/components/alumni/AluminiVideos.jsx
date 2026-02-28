import { useState, useEffect } from "react";
import API from "../../utils/api";
import LikeButton from "../LikeButton";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const NAVY    = "#0F1C80";
const ORANGE  = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100= "#DDE0FF";
const CARD    = "#FFFFFF";
const TH      = "#0D1240";
const TB      = "#4B5563";
const TS      = "#9CA3AF";

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function VideoSkeleton({ i }) {
    return (
        <div style={{
            background: CARD, borderRadius: 16, border: `1px solid ${NAVY_50}`,
            boxShadow: "0 1px 4px rgba(15,28,128,.05)", overflow: "hidden",
            animation: `fu .35s ease ${i * 0.08}s both`,
        }}>
            <div style={{ height: 162, background: NAVY_50, animation: "pulse 2s infinite" }} />
            <div style={{ padding: "13px 15px 15px" }}>
                <div style={{ height: 16, background: NAVY_50, borderRadius: 4, marginBottom: 8, animation: "pulse 2s infinite" }} />
                <div style={{ height: 12, background: NAVY_50, borderRadius: 4, marginBottom: 8, animation: "pulse 2s infinite", width: "85%" }} />
                <div style={{ height: 12, background: NAVY_50, borderRadius: 4, marginBottom: 11, animation: "pulse 2s infinite", width: "75%" }} />
                <div style={{ height: 10, background: NAVY_50, borderRadius: 4, animation: "pulse 2s infinite", width: "40%" }} />
            </div>
        </div>
    );
}

// ─── VIDEO CARD ───────────────────────────────────────────────────────────────
function VideoCard({ v, i }) {
    const [hov, setHov] = useState(false);

    return (
        <div
            onClick={() => v.youtubeUrl && window.open(v.youtubeUrl, "_blank")}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: CARD, borderRadius: 16,
                border: `1px solid ${hov ? NAVY_100 : NAVY_50}`,
                boxShadow: hov ? "0 8px 28px rgba(15,28,128,.10)" : "0 1px 4px rgba(15,28,128,.05)",
                transform: hov ? "translateY(-3px)" : "none",
                transition: "all .2s ease", overflow: "hidden", cursor: v.youtubeUrl ? "pointer" : "default",
                animation: `fu .35s ease ${i * 0.08}s both`,
            }}
        >
            {/* Thumbnail */}
            <div style={{ height: 162, overflow: "hidden", position: "relative", background: NAVY_50 }}>
                {v.youtubeUrl ? (
                    <img
                        src={`https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`}
                        alt={v.heading}
                        style={{
                            width: "100%", height: "100%", objectFit: "cover", display: "block",
                            transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .4s",
                        }}
                        onError={(e) => { e.target.src = `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`; }}
                    />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: TS }}>
                        No preview available
                    </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,28,128,.55) 0%,rgba(15,28,128,.05) 60%,transparent 100%)" }} />
                {/* Play button */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: `translate(-50%,-50%) scale(${hov ? 1.1 : 1})`, transition: "transform .2s",
                    width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.95)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 16px rgba(15,28,128,.22)`,
                }}>
                    <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: `13px solid ${NAVY}`, marginLeft: 3 }} />
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "13px 15px 15px" }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 800, color: TH, lineHeight: 1.4, margin: "0 0 6px", wordBreak: "break-word" }}>
                    {v.heading}
                </h3>
                <p style={{
                    fontSize: 12, color: TB, lineHeight: 1.6, margin: "0 0 11px",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {v.description}
                </p>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 8, borderTop: `1px solid ${NAVY_50}`, gap: 6,
                }}>
                    <span style={{ fontSize: 11, color: TS, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeButton resourceType="videos" id={v._id || v.id || v.videoId} initialLiked={!!v.isLiked} />
                        </div>
                        <a
                            href={v.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: 10.5, fontWeight: 700, color: "#fff", background: ORANGE,
                                padding: "4px 10px", borderRadius: 20, textDecoration: "none",
                                transition: "opacity .2s", flexShrink: 0, display: "inline-block",
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
                            onMouseLeave={(e) => e.target.style.opacity = "1"}
                        >
                            Watch →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHead() {
    return (
        <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
                width: 4, height: 36,
                background: `linear-gradient(to bottom,${NAVY},${ORANGE})`,
                borderRadius: 4, flexShrink: 0, marginTop: 2,
            }} />
            <div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, color: TH, margin: "0 0 3px" }}>
                    🎬 Videos
                </h2>
                <p style={{ fontSize: 13, color: TS, margin: 0 }}>
                    Recorded masterclasses and panel discussions from alumni summits.
                </p>
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AlumniVideos({ search = "" }) {
    const [videos,  setVideos]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await API.get('/alumni/videos', {
                    params: { page: 1, limit: 9 },
                });

                console.log("🎬 /alumni/videos raw response.data:", res.data);

                const raw = res.data;
                const data =
                    Array.isArray(raw)            ? raw         :
                        Array.isArray(raw?.data?.data) ? raw.data.data :
                            Array.isArray(raw?.data)       ? raw.data    :
                                [];

                setVideos(data);
            } catch (err) {
                console.error("🎬 Videos fetch error:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch videos");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const filtered = videos.filter(v => {
        const q = search.toLowerCase();
        return (
            (v.heading     || "").toLowerCase().includes(q) ||
            (v.description || "").toLowerCase().includes(q)
        );
    });

    return (
        <>
            <style>{`
                @keyframes fu    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

                .alumni-videos { min-height: 80vh; }
                .vid-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 13px; }

                @media (max-width: 860px) { .vid-grid { grid-template-columns: 1fr 1fr; } }
                @media (max-width: 540px) { .vid-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div className="alumni-videos">
                {/* Header row */}
                <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 12,
                    marginBottom: 20, flexWrap: "wrap",
                }}>
                    <SectionHead />
                </div>

                {/* States */}
                {loading && (
                    <div className="vid-grid">
                        {[...Array(3)].map((_, i) => <VideoSkeleton key={i} i={i} />)}
                    </div>
                )}

                {!loading && error && (
                    <div style={{ padding: 20, textAlign: "center", color: TB }}>
                        <p>⚠️ Unable to load videos: {error}</p>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ padding: 20, textAlign: "center", color: TB }}>
                        <p>{search ? "No videos match your search." : "No videos available yet. Check back soon!"}</p>
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="vid-grid">
                        {filtered.map((v, i) => (
                            <VideoCard key={v._id || i} v={v} i={i} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}