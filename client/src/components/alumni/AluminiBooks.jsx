import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API from "../../utils/api";
import { resolveAssetUrl } from "../../utils/baseUrl";
import LikeButton from "../LikeButton";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const CARD = "#FFFFFF";
const TH = "#0D1240";
const TB = "#4B5563";
const TS = "#9CA3AF";

const COVER_COLORS = [NAVY, "#1A3A7A", "#7B1E3C", "#1A6B3C", "#5B2D8E", "#B45309"];

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function BookSkeleton({ i }) {
    return (
        <div style={{
            background: CARD, borderRadius: 16, border: `1px solid ${NAVY_50}`,
            boxShadow: "0 1px 4px rgba(15,28,128,.05)", overflow: "hidden",
            display: "flex", animation: `fu .35s ease ${i * 0.08}s both`,
        }}>
            <div style={{ width: 104, flexShrink: 0, background: NAVY_50, animation: "pulse 2s infinite" }} />
            <div style={{ flex: 1, padding: "15px 17px" }}>
                <div style={{ height: 16, background: NAVY_50, borderRadius: 4, marginBottom: 8, animation: "pulse 2s infinite" }} />
                <div style={{ height: 12, background: NAVY_50, borderRadius: 4, marginBottom: 10, width: "60%", animation: "pulse 2s infinite" }} />
                <div style={{ height: 12, background: NAVY_50, borderRadius: 4, marginBottom: 6, animation: "pulse 2s infinite" }} />
                <div style={{ height: 12, background: NAVY_50, borderRadius: 4, width: "80%", animation: "pulse 2s infinite" }} />
            </div>
        </div>
    );
}

// ─── IMAGE LOADER ───────────────────────────────────────────────────────────
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

// ─── BOOK CARD ────────────────────────────────────────────────────────────────
function BookCard({ b, i, onSelect }) {
    const [hov, setHov] = useState(false);
    const coverColor = COVER_COLORS[i % COVER_COLORS.length];
    const hasImage = b.cover_image && !b.cover_image.startsWith("undefined");

    return (
        <div
            onClick={() => onSelect(b)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: CARD,
                borderRadius: 20,
                border: `1px solid ${hov ? NAVY_100 : NAVY_50}`,
                boxShadow: hov ? "0 10px 35px rgba(15,28,128,.12)" : "0 1px 4px rgba(15,28,128,.05)",
                transform: hov ? "translateY(-3px)" : "none",
                transition: "all .2s ease",
                overflow: "hidden",
                display: "flex",
                cursor: "pointer",
                animation: `fu .35s ease ${i * 0.08}s both`,
            }}
        >
            <div className="book-cover" style={{
                flexShrink: 0,
                width: 140,
                minWidth: 140,
                aspectRatio: "3 / 4",
                background: coverColor,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: 14,
            }}>
                {hasImage ? (
                    <ImageLoader
                        src={resolveAssetUrl(b.cover_image)}
                        alt={b.heading || b.title || "Book cover"}
                        containerStyle={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
                        imgStyle={{ position: "absolute", inset: 0 }}
                    />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.85)", fontSize: 18, fontWeight: 800 }}>
                        📚
                    </div>
                )}
                <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", gap: 6, marginTop: "auto" }}>
                    <div style={{ width: 32, height: 3, background: ORANGE, borderRadius: 24, marginBottom: 4 }} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.9)", textAlign: "left", fontWeight: 700 }}>{(b.author || "Mashar Team").split("&")[0].trim()}</div>
                </div>
            </div>

            <div style={{ flex: 1, minWidth: 0, padding: "20px 22px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: TH, lineHeight: 1.3, margin: "0 0 8px", wordBreak: "break-word" }}>{b.heading || b.title}</h3>
                <div style={{ fontSize: 13, color: TS, fontWeight: 700, marginBottom: 10 }}>{b.author}</div>
                {b.description && (
                    <p className="book-desc" style={{ fontSize: 13, color: TB, lineHeight: 1.75, margin: "0 0 16px" }}>{b.description}</p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: TS, fontWeight: 600 }}>Tap card for full details</span>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        {b.amazonLink && (
                            <a href={b.amazonLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{
                                padding: "8px 16px",
                                borderRadius: 12,
                                background: ORANGE,
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                textDecoration: "none",
                                boxShadow: `0 4px 14px rgba(243,137,0,.18)`,
                            }}>
                                Get Book →
                            </a>
                        )}
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeButton resourceType="books" id={b._id || b.id || i} initialLiked={!!b.isLiked} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BookDetailModal({ book, onClose }) {
    const hasImage = book.cover_image && !book.cover_image.startsWith("undefined");
    const paragraphs = (book.description || "").split(/\n+/).filter(Boolean);

    return (
        <div className="book-modal-overlay" onClick={onClose}>
            <div className="book-modal" onClick={(e) => e.stopPropagation()}>
                <button className="book-modal-close" onClick={onClose} aria-label="Close book details">×</button>
                <div className="book-modal-grid">
                    <div className="book-modal-cover">
                        {hasImage ? (
                            <ImageLoader
                                src={resolveAssetUrl(book.cover_image)}
                                alt={book.heading || book.title || "Book cover"}
                                containerStyle={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
                                imgStyle={{ position: "absolute", inset: 0 }}
                            />
                        ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(15,28,128,.65)", fontSize: 36 }}>
                                📚
                            </div>
                        )}
                    </div>

                    <div className="book-modal-body">
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <span style={{ fontSize: 12, color: ORANGE, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" }}>Book details</span>
                            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: TH, lineHeight: 1.1 }}>{book.heading || book.title}</h2>
                            <div style={{ fontSize: 14, color: TS, fontWeight: 600 }}>{book.author}</div>
                        </div>

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {book.amazonLink && (
                                <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="book-modal-action">Buy on Amazon</a>
                            )}
                        </div>

                        <div style={{ marginTop: 14 }}>
                            {paragraphs.length > 0 ? paragraphs.map((para, index) => (
                                <p key={index} style={{ margin: index === 0 ? 0 : "18px 0 0", color: TB, fontSize: 15.5, lineHeight: 1.8 }}>
                                    {para}
                                </p>
                            )) : (
                                <p style={{ color: TS, margin: 0 }}>No additional book details are available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

BookSkeleton.propTypes = {
    i: PropTypes.number.isRequired,
};

ImageLoader.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    imgStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    onLoad: PropTypes.func,
    fallback: PropTypes.node,
};

BookCard.propTypes = {
    b: PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        heading: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        description: PropTypes.string,
        cover_image: PropTypes.string,
        amazonLink: PropTypes.string,
        isLiked: PropTypes.bool,
    }).isRequired,
    i: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};

BookDetailModal.propTypes = {
    book: PropTypes.shape({
        heading: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        description: PropTypes.string,
        cover_image: PropTypes.string,
        amazonLink: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

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
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, color: TH, margin: "0 0 3px" }}>📚 Books</h2>
            <p style={{ fontSize: 13, color: TS, margin: 0 }}>Faculty-endorsed reading list for your ongoing professional growth.</p>
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AluminiBooks({ search = "", hideHeader = false }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await API.get('/alumni/books');
                const raw = response.data;
                const data = raw?.data?.data ?? raw?.data ?? raw ?? [];
                setBooks(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch books");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const filtered = books.filter(b => {
        const q = search.toLowerCase();
        return (
            (b.heading || "").toLowerCase().includes(q) ||
            (b.author || "").toLowerCase().includes(q)
        );
    });

    const imageCount = filtered.filter(b => b.cover_image && !b.cover_image.startsWith("undefined")).length;
    const imagesReady = imageCount === 0 || imagesLoaded >= imageCount;
    const showSectionLoader = loading || (!imagesReady && filtered.length > 0 && imageCount > 0);

    const handleImageLoaded = () => setImagesLoaded((prev) => prev + 1);

    return (
        <>
            <style>{`
                @keyframes fu    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .book-cover { width: 104px; padding: 18px 12px; }
                .book-modal-overlay { position: fixed; inset: 0; background: rgba(15,28,128,.42); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 22px; z-index: 9999; }
                .book-modal { width: min(980px, 100%); max-height: min(90vh, 100%); overflow-y: auto; background: #fff; border-radius: 28px; box-shadow: 0 26px 60px rgba(15,28,128,.18); position: relative; padding: 28px; }
                .book-modal-close { position: absolute; top: 18px; right: 18px; width: 38px; height: 38px; border: none; border-radius: 999px; background: rgba(15,28,128,.06); color: ${TH}; font-size: 24px; cursor: pointer; display: grid; place-items: center; }
                .book-modal-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
                .book-modal-cover { width: 100%; aspect-ratio: 3 / 4; border-radius: 22px; overflow: hidden; position: relative; background: ${NAVY_50}; }
                .book-modal-body { display: flex; flex-direction: column; gap: 18px; }
                .book-modal-action { display: inline-flex; align-items: center; justify-content: center; padding: 12px 20px; border-radius: 14px; background: ${ORANGE}; color: #fff; font-weight: 700; text-decoration: none; box-shadow: 0 12px 24px rgba(243,137,0,.18); }
                .book-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                @media (max-width: 900px) { .book-modal-grid { grid-template-columns: 1fr; } }
                @media (max-width: 540px) { .book-cover { width: 82px; padding: 13px 8px; } }
            `}</style>

            <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
                {!hideHeader && <SectionHead />}

                {loading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                        {[...Array(3)].map((_, i) => <BookSkeleton key={i} i={i} />)}
                    </div>
                )}

                {!loading && error && (
                    <div style={{ padding: 20, textAlign: "center", color: TB }}>
                        <p>⚠️ Unable to load books: {error}</p>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ padding: 20, textAlign: "center", color: TB }}>
                        <p>{search ? "No books match your search." : "No books available yet."}</p>
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                        {filtered.map((b, i) => <BookCard key={b._id || i} b={b} i={i} onSelect={setSelectedBook} />)}
                    </div>
                )}
            </div>

            {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
        </>
    );
}

AluminiBooks.propTypes = {
    search: PropTypes.string,
    hideHeader: PropTypes.bool,
};