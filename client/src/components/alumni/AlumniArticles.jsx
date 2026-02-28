import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { resolveAssetUrl } from "../../utils/baseUrl";
import LikeButton from "../LikeButton";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const NAVY     = "#0F1C80";
const ORANGE   = "#F38900";
const NAVY_50  = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const ORANGE_50= "#FFF4E0";
const CARD     = "#FFFFFF";
const TH       = "#0D1240";
const TB       = "#4B5563";
const TS       = "#9CA3AF";

function imgSrc(image) {
    return resolveAssetUrl(image);
}

// ─── PDF DOWNLOAD BUTTON ──────────────────────────────────────────────────────
function PdfButton({ url, dark = false }) {
    const [hov, setHov] = useState(false);
    if (!url) return null;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            title="Download PDF"
            style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 700, textDecoration: "none",
                padding: "4px 11px 4px 8px", borderRadius: 20, flexShrink: 0,
                transition: "all .18s",
                ...(dark ? {
                    background: hov ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.88)",
                    color: NAVY,
                    border: "1px solid rgba(255,255,255,0.4)",
                } : {
                    background: hov ? ORANGE_50 : "#FFF8EE",
                    color: ORANGE,
                    border: `1px solid ${hov ? ORANGE : "#FFE0A0"}`,
                }),
            }}
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            PDF
        </a>
    );
}

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function Chip({ label, color }) {
    const bgs = { [NAVY]: NAVY_50, [ORANGE]: ORANGE_50, "#1A6B3C": "#ECFDF5" };
    return (
        <span style={{
            fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            background: bgs[color] || "#F3F4F6", color, whiteSpace: "nowrap",
            letterSpacing: "0.4px", flexShrink: 0,
        }}>{label}</span>
    );
}

function ChipOnDark({ label, color }) {
    return (
        <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
            background: "rgba(255,255,255,0.88)", color, whiteSpace: "nowrap",
            letterSpacing: "0.3px", flexShrink: 0,
        }}>{label}</span>
    );
}

function ImageLoader({ src, alt, imgStyle, containerStyle, onLoad, fallback }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div style={{ position: "relative", overflow: "hidden", ...containerStyle }}>
            {!loaded && (
                <div style={{
                    position: "absolute", inset: 0,
                    background: NAVY_50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.8)", animation: "pulse 1.4s ease-in-out infinite" }} />
                </div>
            )}
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    onLoad={(e) => {
                        setLoaded(true);
                        if (onLoad) onLoad(e);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity .28s ease",
                        ...imgStyle,
                    }}
                    loading="lazy"
                />
            ) : (
                fallback || <div style={{ width: "100%", height: "100%", background: NAVY_50 }} />
            )}
        </div>
    );
}

function GradBar() {
    return <div style={{ height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />;
}

// ─── FEATURED ARTICLE ─────────────────────────────────────────────────────────
function ArticleFeatured({ a, onNavigate }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            className="art-featured"
            onClick={() => onNavigate(a._id)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: CARD, borderRadius: 16,
                border: `1px solid ${hov ? NAVY_100 : NAVY_50}`,
                boxShadow: hov ? "0 8px 28px rgba(15,28,128,.10)" : "0 1px 4px rgba(15,28,128,.05)",
                transform: hov ? "translateY(-3px)" : "none",
                transition: "all .2s ease", overflow: "hidden", cursor: "pointer",
                gridColumn: "1 / -1",
            }}
        >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="feat-img" style={{ overflow: "hidden", flexShrink: 0, position: "relative" }}>
                    <ImageLoader
                        src={imgSrc(a.cover_image)}
                        alt={a.heading}
                        imgStyle={{ transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform .45s" }}
                        containerStyle={{ width: "100%", minHeight: 240 }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,transparent 55%,rgba(246,247,253,.75))" }} />
                    <span style={{
                        position: "absolute", top: 14, left: 14, background: ORANGE, color: "#fff",
                        fontSize: 9.5, fontWeight: 800, padding: "3px 11px", borderRadius: 20,
                        letterSpacing: "1px", textTransform: "uppercase",
                    }}>✦ Featured</span>
                    {a.pdf_file && (
                        <div style={{ position: "absolute", bottom: 14, left: 14 }}>
                            <PdfButton url={a.pdf_file} dark />
                        </div>
                    )}
                </div>

                <div className="feat-body" style={{ flex: 1, minWidth: 0 }}>
                    <Chip label={a.category || "Article"} color={NAVY} />
                    <h2 className="feat-title" style={{
                        fontFamily: "'Sora',sans-serif", fontWeight: 900, color: TH,
                        lineHeight: 1.3, margin: "11px 0 9px", letterSpacing: "-0.3px", wordBreak: "break-word",
                    }}>{a.heading}</h2>
                    <p style={{ fontSize: 13.5, color: TB, lineHeight: 1.72, margin: "0 0 18px", wordBreak: "break-word" }}>
                        {a.description || a.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                            <div style={{
                                width: 32, height: 32, minWidth: 32, borderRadius: "50%",
                                background: NAVY_50, display: "flex", alignItems: "center",
                                justifyContent: "center", color: NAVY, fontSize: 11, fontWeight: 800,
                            }}>
                                {(a.author || "?").split(" ").map(w => w[0]).join("").slice(0, 2)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 700, color: TH, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {a.author || "Mashar Team"}
                                </div>
                                <div style={{ fontSize: 10.5, color: TS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {a.authorRole || "Mashar Editorial"}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, color: TS }}>
                                {new Date(a.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: ORANGE, background: ORANGE_50, padding: "2px 9px", borderRadius: 20 }}>
                                {a.readTime || "5 min"}
                            </span>
                            <div onClick={(e) => e.stopPropagation()}>
                                <LikeButton resourceType="articles" id={a._id || a.id} initialLiked={!!a.isLiked} />
                            </div>
                            <div style={{
                                width: 32, height: 32, minWidth: 32, borderRadius: "50%",
                                background: hov ? "#d67600" : ORANGE, color: "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14, transition: "background .2s,color .2s,transform .2s",
                                transform: hov ? "translateX(3px)" : "none",
                            }}>→</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── ARTICLE CARD ─────────────────────────────────────────────────────────────
function ArticleCard({ a, i, onNavigate }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onClick={() => onNavigate(a._id)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: CARD, borderRadius: 16,
                border: `1px solid ${hov ? NAVY_100 : NAVY_50}`,
                boxShadow: hov ? "0 8px 28px rgba(15,28,128,.10)" : "0 1px 4px rgba(15,28,128,.05)",
                transform: hov ? "translateY(-3px)" : "none",
                transition: "all .2s ease", overflow: "hidden", cursor: "pointer",
                animation: `fu .35s ease ${i * .08}s both`,
            }}
        >
            <div style={{ height: 168, overflow: "hidden", position: "relative" }}>
                <ImageLoader
                    src={imgSrc(a.cover_image)}
                    alt={a.heading}
                    imgStyle={{
                        transform: hov ? "scale(1.06)" : "scale(1)",
                        transition: "transform .4s",
                    }}
                    containerStyle={{ width: "100%", height: "100%" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,28,128,.4) 0%,transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <ChipOnDark label={a.category || "Article"} color={NAVY} />
                    {a.pdf_file && <PdfButton url={a.pdf_file} dark />}
                </div>
            </div>

            <div style={{ padding: "14px 16px 16px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: TH, lineHeight: 1.4, margin: "0 0 6px", wordBreak: "break-word" }}>
                    {a.heading}
                </h3>
                <p style={{
                    fontSize: 12.5, color: TB, lineHeight: 1.6, margin: "0 0 12px",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {a.description || a.title}
                </p>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 10, borderTop: `1px solid ${NAVY_50}`, flexWrap: "wrap", gap: 5,
                }}>
                    <span style={{ fontSize: 11, color: TS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {a.author || "Mashar Team"} · {new Date(a.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: ORANGE, background: ORANGE_50, padding: "2px 8px", borderRadius: 20 }}>
                            {a.readTime || "5 min"}
                        </span>
                        {!a.cover_image && a.pdf_file && <PdfButton url={a.pdf_file} />}
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeButton resourceType="articles" id={a._id || a.id} initialLiked={!!a.isLiked} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHead() {
    return (
        <div style={{
            marginBottom: 20,
            borderLeft: `4px solid transparent`,
            backgroundImage: `linear-gradient(white, white), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
            backgroundOrigin: `border-box`,
            backgroundClip: `padding-box, border-box`,
            paddingLeft: 14,
            borderRadius: 4,
        }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, color: TH, margin: "0 0 3px" }}>📄 Articles</h2>
            <p style={{ fontSize: 13, color: TS, margin: 0 }}>Insights, research, and alumni stories curated by the Mashar team.</p>
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AlumniArticles({ search = "", hideHeader = false }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleNavigate = (articleId) => {
        navigate(`/alumni/article/${articleId}`);
    };

    useEffect(() => {
        API.get("/alumni/articles")
            .then(r => {
                const data = r.data?.data?.data || r.data?.data || [];
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load articles:", err);
                setLoading(false);
            });
    }, []);

    const filtered = articles.filter(a => {
        const q = search.toLowerCase();
        return (
            (a.heading || "").toLowerCase().includes(q) ||
            (a.description && a.description.toLowerCase().includes(q)) ||
            (a.author && a.author.toLowerCase().includes(q)) ||
            (a.category && a.category.toLowerCase().includes(q))
        );
    });

    if (loading) {
        return (
            <>
                {!hideHeader && <SectionHead />}
                <div style={{ padding: 40, textAlign: "center" }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        border: `2.5px solid ${NAVY_100}`,
                        borderTopColor: NAVY,
                        animation: "spin 0.7s linear infinite",
                        margin: "0 auto",
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: TS, marginTop: 12, fontSize: 13 }}>Loading articles...</p>
                </div>
            </>
        );
    }

    const featuredArticles = filtered.filter(a => a.featured);
    const regularArticles  = filtered.filter(a => !a.featured);

    return (
        <>
            <style>{`
                @keyframes fu { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
                .art-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
                .feat-img   { width: 42%; min-height: 230px; }
                .feat-body  { padding: 26px 26px 22px; }
                .feat-title { font-size: 18px; }
                @media (max-width: 860px) {
                    .art-grid   { grid-template-columns: 1fr; }
                    .feat-img   { width: 100%; min-height: 190px; max-height: 210px; }
                    .feat-body  { padding: 16px 16px 14px; }
                    .feat-title { font-size: 15px !important; }
                }
            `}</style>

            {!hideHeader && <SectionHead />}

            {filtered.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: TB }}>
                    <p>No articles match your search.</p>
                </div>
            ) : (
                <div className="art-grid">
                    {featuredArticles.map((a) => (
                        <ArticleFeatured key={a._id} a={a} onNavigate={handleNavigate} />
                    ))}
                    {regularArticles.map((a, i) => (
                        <ArticleCard key={a._id} a={a} i={i} onNavigate={handleNavigate} />
                    ))}
                </div>
            )}
        </>
    );
}