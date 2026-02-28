import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { resolveAssetUrl } from "../../utils/baseUrl";

// ─── THEME (matches Resources list + Contact Us) ──────────────────────────────
const NAVY      = "#0F1C80";
const NAVY_DARK = "#0A1260";
const NAVY_MID  = "#1A2FA0";
const ORANGE    = "#F38900";
const ORANGE_LT = "#FF9F1C";
const NAVY_50   = "#EEF0FF";
const NAVY_100  = "#DDE0FF";
const CREAM     = "#FAF8F3";
const CREAM_2   = "#F3F1EA";
const TH        = "#0D1240";
const TB        = "#374151";
const TS        = "#6B7280";

function imgSrc(image) {
    return resolveAssetUrl(image);
}

function fmtDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton() {
    return (
        <div style={{ background: CREAM, minHeight: "100vh" }}>
            <style>{`@keyframes sk-pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }`}</style>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
                <div style={{ width: "100%", height: 320, borderRadius: 24, background: `linear-gradient(135deg, ${NAVY_DARK}, ${NAVY_MID})`, animation: "sk-pulse 1.6s ease infinite" }} />
                <div style={{ marginTop: 32 }}>
                    {[0.6, 1, 0.85, 0.7, 0.9, 0.5].map((w, i) => (
                        <div key={i} style={{
                            height: i < 2 ? (i === 0 ? 14 : 30) : 16,
                            borderRadius: 8, background: NAVY_100,
                            marginBottom: i < 2 ? (i === 0 ? 12 : 24) : 12,
                            width: `${w * 100}%`,
                            animation: "sk-pulse 1.6s ease infinite",
                            animationDelay: `${i * 0.12}s`
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── READING PROGRESS BAR ─────────────────────────────────────────────────────
function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: "rgba(15,28,128,.08)" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})`, transition: "width .1s linear" }} />
        </div>
    );
}

// ─── STAT CHIP ────────────────────────────────────────────────────────────────
function StatChip({ icon, label, tone = "navy" }) {
    const styles = {
        navy:   { bg: NAVY_50, border: NAVY_100, color: NAVY },
        orange: { bg: "rgba(243,137,0,.1)", border: "rgba(243,137,0,.22)", color: ORANGE },
    }[tone];
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 700, color: styles.color,
            background: styles.bg, border: `1px solid ${styles.border}`,
            padding: "6px 13px", borderRadius: 20,
        }}>
            {icon} {label}
        </span>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const load = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/alumni/articles/${id}`);
                const data = res.data?.data?.data || res.data?.data || res.data;
                setArticle(data);
                const relatedRes = await API.get("/alumni/articles", { params: { limit: 4 } });
                const relatedData = relatedRes.data?.data?.data || relatedRes.data?.data || [];
                setRelatedArticles(relatedData.filter(a => a._id !== id).slice(0, 3));
            } catch (err) {
                setError("Article not found.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <Skeleton />;

    if (error || !article) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24, background: CREAM }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: NAVY_50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📄</div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", color: TH, margin: 0 }}>Article not found</h2>
                <p style={{ color: TS, margin: 0, textAlign: "center" }}>The article you're looking for doesn't exist or was removed.</p>
                <button onClick={() => navigate(-1)} style={{
                    padding: "10px 28px", borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
                    color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14
                }}>← Go Back</button>
            </div>
        );
    }

    const authorInitials = (article.author || "MT").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const bodyParagraphs = article.description
        ? article.description.split(/\r?\n/).filter(p => p.trim())
        : [];

    return (
        <>
            <ReadingProgress />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

                *, *::before, *::after { box-sizing: border-box; }

                .ad-page { background: ${CREAM}; min-height: 100vh; font-family: 'DM Sans', sans-serif; padding: 28px 24px 80px; }

                /* ── SHELL ── */
                .ad-shell {  margin: 0 auto; }

                /* ── HERO ── */
                .ad-hero {
                    position: relative; width: 100%; height: 340px; overflow: hidden;
                    border-radius: 24px;
                    background: linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_MID} 100%);
                    box-shadow: 0 12px 32px rgba(15,28,128,.18);
                }
                .ad-hero::before {
                    content: ''; position: absolute; top: -60px; right: -60px;
                    width: 220px; height: 220px; border-radius: 50%;
                    background: rgba(255,255,255,.05);
                }
                .ad-hero::after {
                    content: ''; position: absolute; bottom: -70px; left: -40px;
                    width: 200px; height: 200px; border-radius: 50%;
                    background: rgba(243,137,0,.1);
                }
                .ad-hero img {
                    width: 100%; height: 100%; object-fit: cover; display: block;
                    opacity: 0; transition: opacity .6s ease; position: relative; z-index: 1;
                }
                .ad-hero img.loaded { opacity: .88; }
                .ad-hero-overlay {
                    position: absolute; inset: 0; z-index: 2;
                    background: linear-gradient(to top, rgba(10,18,96,.88) 0%, rgba(10,18,96,.35) 55%, rgba(10,18,96,.12) 100%);
                }
                .ad-hero-top {
                    position: absolute; top: 22px; left: 22px; right: 22px; z-index: 3;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .ad-hero-badge {
                    background: ${ORANGE}; color: #fff;
                    font-size: 10px; font-weight: 800; padding: 5px 14px;
                    border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;
                    font-family: 'DM Sans', sans-serif;
                    box-shadow: 0 4px 12px rgba(243,137,0,.4);
                }
                .ad-hero-meta {
                    position: absolute; bottom: 28px; left: 28px; right: 28px; z-index: 3;
                }
                .ad-back-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    background: rgba(255,255,255,0.14);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.25);
                    color: #fff; font-weight: 600; font-size: 12.5px;
                    padding: 8px 16px; border-radius: 10px; cursor: pointer;
                    transition: background .18s;
                    font-family: 'DM Sans', sans-serif;
                }
                .ad-back-btn:hover { background: rgba(255,255,255,0.24); }
                .ad-hero-category {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
                    text-transform: uppercase; color: #fff;
                    background: rgba(255,255,255,.16);
                    border: 1px solid rgba(255,255,255,.28);
                    padding: 4px 12px; border-radius: 20px; margin-bottom: 14px;
                    font-family: 'DM Sans', sans-serif;
                }
                .ad-hero-category .dot { width: 5px; height: 5px; border-radius: 50%; background: ${ORANGE}; }
                .ad-hero-title {
                    font-family: 'Sora', sans-serif; font-weight: 900;
                    font-size: clamp(21px, 3vw, 30px); color: #fff;
                    line-height: 1.22; margin: 0; letter-spacing: -0.4px;
                    text-shadow: 0 2px 16px rgba(0,0,0,.3);
                    max-width: 760px;
                    padding-bottom: 15px;
                }

                /* ── META CARD ── */
                .ad-meta-card {
                    background: #fff;
                    border: 1px solid ${NAVY_100};
                    border-radius: 18px;
                    padding: 22px 26px;
                    margin-top: -34px;
                    position: relative; z-index: 10;
                    box-shadow: 0 6px 24px rgba(15,28,128,.09);
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 16px;
                    overflow: hidden;
                }
                .ad-meta-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
                    background: linear-gradient(90deg, ${NAVY}, ${ORANGE});
                }
                .ad-author-row { display: flex; align-items: center; gap: 12px; }
                .ad-avatar {
                    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
                    background: linear-gradient(135deg, ${NAVY}, ${NAVY_MID});
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-size: 14px; font-weight: 800;
                    font-family: 'Sora', sans-serif;
                    box-shadow: 0 4px 12px rgba(15,28,128,.2);
                }
                .ad-author-name { font-size: 14px; font-weight: 700; color: ${TH}; }
                .ad-author-role { font-size: 11.5px; color: ${TS}; margin-top: 1px; }
                .ad-meta-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

                /* ── BODY CARD ── */
                .ad-body-card {
                    background: #fff; border: 1px solid ${NAVY_100};
                    border-radius: 20px; margin-top: 22px;
                    padding: 44px 48px 32px;
                    box-shadow: 0 2px 16px rgba(15,28,128,.05);
                }
                .ad-body p {
                    font-size: 15.5px; line-height: 1.9; color: ${TB};
                    margin: 0 0 22px; font-family: 'DM Sans', sans-serif;
                }
                .ad-body p:last-child { margin-bottom: 0; }
                .ad-body p:first-child::first-letter {
                    float: left; font-family: 'Sora', sans-serif; font-size: 52px;
                    font-weight: 900; line-height: 0.85; color: ${NAVY};
                    margin: 6px 10px -4px 0; padding: 4px;
                }
                .ad-empty-body {
                    padding: 40px 24px; text-align: center;
                }

                /* ── DIVIDER ── */
                .ad-divider {
                    display: flex; align-items: center; gap: 16px;
                    margin: 28px 0 20px;
                }
                .ad-divider-line { flex: 1; height: 1px; background: ${NAVY_100}; }
                .ad-divider-dot { width: 6px; height: 6px; border-radius: 50%; background: ${ORANGE}; }

                /* ── SHARE ROW ── */
                .ad-share-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
                .ad-share-btn {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 8px 18px; border-radius: 10px; cursor: pointer;
                    font-size: 12.5px; font-weight: 700; transition: all .18s;
                    font-family: 'DM Sans', sans-serif; border: none;
                }

                /* ── PDF CARD ── */
                .ad-pdf-card {
                    background: linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_MID} 100%);
                    border-radius: 20px; padding: 26px 30px;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 20px; margin-top: 22px;
                    box-shadow: 0 8px 28px rgba(15,28,128,.22);
                    position: relative; overflow: hidden;
                }
                .ad-pdf-card::before {
                    content: ''; position: absolute; top: -40px; right: -40px;
                    width: 160px; height: 160px; border-radius: 50%;
                    background: rgba(255,255,255,.04);
                }
                .ad-pdf-card::after {
                    content: ''; position: absolute; bottom: -50px; right: 60px;
                    width: 120px; height: 120px; border-radius: 50%;
                    background: rgba(243,137,0,.08);
                }
                .ad-pdf-icon {
                    width: 48px; height: 48px; border-radius: 12px;
                    background: rgba(255,255,255,.12);
                    border: 1px solid rgba(255,255,255,.2);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .ad-pdf-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 3px; font-family: 'Sora', sans-serif; }
                .ad-pdf-sub { font-size: 12px; color: rgba(255,255,255,.55); }
                .ad-pdf-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: ${ORANGE}; color: #fff;
                    font-weight: 700; font-size: 13.5px;
                    padding: 12px 24px; border-radius: 12px;
                    text-decoration: none; border: none; cursor: pointer;
                    transition: all .2s ease; flex-shrink: 0;
                    font-family: 'DM Sans', sans-serif;
                    box-shadow: 0 4px 16px rgba(243,137,0,.4);
                    position: relative; z-index: 1;
                }
                .ad-pdf-btn:hover { background: ${ORANGE_LT}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(243,137,0,.5); }

                /* ── RELATED ── */
                .ad-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 18px; }
                .ad-rel-card {
                    background: #fff; border-radius: 16px; overflow: hidden; cursor: pointer;
                    border: 1px solid ${NAVY_100}; transition: all .2s ease;
                    box-shadow: 0 2px 10px rgba(15,28,128,.05);
                }
                .ad-rel-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(15,28,128,.12); }
                .ad-rel-thumb { height: 118px; position: relative; overflow: hidden; background: ${NAVY_50}; }
                .ad-rel-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .35s; }
                .ad-rel-card:hover .ad-rel-thumb img { transform: scale(1.06); }
                .ad-rel-tag {
                    position: absolute; top: 10px; left: 10px;
                    background: ${NAVY}; color: #fff; font-size: 9.5px; font-weight: 800;
                    letter-spacing: .5px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px;
                }

                /* ── SECTION HEADER ── */
                .ad-section-head { display: flex; align-items: center; gap: 12px; margin: 32px 0 4px; }
                .ad-section-bar { width: 4px; height: 22px; border-radius: 2px; background: linear-gradient(180deg, ${ORANGE}, ${NAVY}); }

                @media (max-width: 640px) {
                    .ad-page { padding: 18px 14px 60px; }
                    .ad-related-grid { grid-template-columns: 1fr; }
                    .ad-hero { height: 260px; border-radius: 18px; }
                    .ad-hero-meta { left: 18px; right: 18px; bottom: 20px; }
                    .ad-hero-title { font-size: 19px; }
                    .ad-meta-card { margin-top: -22px; padding: 16px 18px; }
                    .ad-body-card { padding: 30px 22px 24px; }
                    .ad-pdf-card { padding: 22px 20px; }
                    .ad-body p:first-child::first-letter { font-size: 40px; }
                }

                @keyframes ad-fade-up { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
                .ad-anim { animation: ad-fade-up .5s ease both; }
                .ad-anim-d1 { animation-delay: .08s; }
                .ad-anim-d2 { animation-delay: .14s; }
                .ad-anim-d3 { animation-delay: .2s; }

                .ad-hero-placeholder {
                    width: 100%; height: 100%; position: relative; z-index: 1;
                    display: flex; align-items: center; justify-content: center;
                }
                .ad-hero-placeholder-icon {
                    width: 76px; height: 76px; border-radius: 20px;
                    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
                    display: flex; align-items: center; justify-content: center; font-size: 32px;
                }
            `}</style>

            <div className="ad-page">
                <div className="ad-shell">

                    {/* ══ HERO ══════════════════════════════════════════════════════ */}
                    <div className="ad-hero">
                        {article.cover_image ? (
                            <img
                                src={imgSrc(article.cover_image)}
                                alt={article.heading || "Article cover"}
                                className={imgLoaded ? "loaded" : ""}
                                onLoad={() => setImgLoaded(true)}
                                onError={e => { e.target.style.display = "none"; setImgLoaded(true); }}
                            />
                        ) : (
                            <div className="ad-hero-placeholder">
                                <div className="ad-hero-placeholder-icon">📄</div>
                            </div>
                        )}

                        <div className="ad-hero-overlay" />

                        <div className="ad-hero-top">
                            <button className="ad-back-btn" onClick={() => navigate(-1)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                                Back to Resources
                            </button>
                            {article.featured && <div className="ad-hero-badge">✦ Featured</div>}
                        </div>

                        <div className="ad-hero-meta">
                            <div className="ad-hero-category"><span className="dot" /> Article</div>
                            <h1 className="ad-hero-title">
                                {article.heading || article.title || "Untitled Article"}
                            </h1>
                        </div>
                    </div>

                    {/* Author / Meta Card */}
                    <div className="ad-meta-card ad-anim">
                        <div className="ad-author-row">
                            <div className="ad-avatar">{authorInitials}</div>
                            <div>
                                <div className="ad-author-name">{article.author || "Mashar Team"}</div>
                                <div className="ad-author-role">{article.authorRole || "Mashar Editorial"}</div>
                            </div>
                        </div>
                        <div className="ad-meta-right">
                            <StatChip
                                tone="navy"
                                icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                                label={fmtDate(article.createdAt)}
                            />
                            <StatChip tone="orange" icon="⏱" label={article.readTime || "5 min read"} />
                        </div>
                    </div>

                    {/* ══ BODY CARD ═══════════════════════════════════════════════════ */}
                    <div className="ad-body-card ad-anim ad-anim-d1">
                        <div className="ad-body">
                            {bodyParagraphs.length > 0 ? (
                                bodyParagraphs.map((para, i) => <p key={i}>{para}</p>)
                            ) : (
                                <div className="ad-empty-body">
                                    <div style={{ fontSize: 38, marginBottom: 12 }}>📝</div>
                                    <p style={{ color: TS, fontSize: 14, margin: 0 }}>
                                        No detailed content available for this article.
                                    </p>
                                    {article.pdf_file && (
                                        <p style={{ color: TB, fontSize: 13, marginTop: 8 }}>
                                            Download the PDF below to read the full article.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="ad-divider">
                            <div className="ad-divider-line" />
                            <div className="ad-divider-dot" />
                            <div className="ad-divider-line" />
                        </div>

                        <div className="ad-share-row">
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: TS }}>Share this article</span>
                            <button
                                onClick={handleCopy}
                                className="ad-share-btn"
                                style={{
                                    background: copied ? "rgba(34,197,94,.1)" : NAVY_50,
                                    border: `1px solid ${copied ? "rgba(34,197,94,.3)" : NAVY_100}`,
                                    color: copied ? "#15803d" : NAVY,
                                }}
                            >
                                {copied ? "✓ Copied!" : (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                        </svg>
                                        Copy Link
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* PDF Download Card */}
                    {article.pdf_file && (
                        <div className="ad-pdf-card ad-anim ad-anim-d2">
                            <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
                                <div className="ad-pdf-icon">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="12" y1="18" x2="12" y2="12"/>
                                        <line x1="9" y1="15" x2="15" y2="15"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="ad-pdf-title">Download Full Article</div>
                                    <div className="ad-pdf-sub">PDF format · Available for offline reading</div>
                                </div>
                            </div>
                            <a href={imgSrc(article.pdf_file)} target="_blank" rel="noopener noreferrer" download className="ad-pdf-btn">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Download PDF
                            </a>
                        </div>
                    )}

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="ad-anim ad-anim-d3">
                            <div className="ad-section-head">
                                <div className="ad-section-bar" />
                                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: TH, margin: 0 }}>
                                    More Articles
                                </h3>
                            </div>
                            <div className="ad-related-grid">
                                {relatedArticles.map(rel => (
                                    <RelatedCard key={rel._id} article={rel} onClick={rid => navigate(`/alumni/article/${rid}`)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{
                        marginTop: 40, paddingTop: 22,
                        borderTop: `1px solid ${NAVY_100}`,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        flexWrap: "wrap", gap: 12
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 26, height: 26, borderRadius: 8, background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ color: "#fff", fontWeight: 800, fontSize: 12, fontFamily: "'Sora',sans-serif" }}>M</span>
                            </div>
                            <span style={{ fontSize: 12, color: TS, fontWeight: 500 }}>Published by Mashar Alumni Network</span>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: NAVY_50, border: `1px solid ${NAVY_100}`,
                                color: NAVY, fontWeight: 700, fontSize: 12.5,
                                padding: "8px 18px", borderRadius: 10, cursor: "pointer",
                                transition: "background .18s", fontFamily: "'DM Sans',sans-serif"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = NAVY_100}
                            onMouseLeave={e => e.currentTarget.style.background = NAVY_50}
                        >
                            ← Back to Resources
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── RELATED CARD (mirrors the Resources list card style) ─────────────────────
function RelatedCard({ article, onClick }) {
    function imgSrc2(image) {
        return resolveAssetUrl(image);
    }
    return (
        <div className="ad-rel-card" onClick={() => onClick(article._id)}>
            <div className="ad-rel-thumb">
                {article.cover_image ? (
                    <img src={imgSrc2(article.cover_image)} alt="" />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📄</div>
                )}
                <div className="ad-rel-tag">Article</div>
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
                <h4 style={{
                    fontSize: 13, fontWeight: 700, color: TH, lineHeight: 1.35,
                    margin: "0 0 10px", fontFamily: "'Sora',sans-serif",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                    {article.heading || article.title}
                </h4>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10.5, color: TS, fontWeight: 500 }}>
                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                    </span>
                    <span style={{
                        fontSize: 10, fontWeight: 700, color: ORANGE,
                        background: "rgba(243,137,0,.1)", padding: "3px 9px", borderRadius: 20,
                    }}>
                        Read →
                    </span>
                </div>
            </div>
        </div>
    );
}