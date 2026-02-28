import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// ─── THEME TOKENS (matches AlumniDirectory.jsx exactly) ──────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const ORANGE_50 = "#FFF4E0";
const CARD = "#FFFFFF";
const TH = "#0D1240";
const TB = "#4B5563";
const TS = "#9CA3AF";

const CATEGORY_LABELS = {
  posts: "Discussion Posts",
  articles: "Articles",
  books: "Books",
  videos: "Videos",
};

const CATEGORY_ICON = {
  posts: "💬",
  articles: "📄",
  books: "📚",
  videos: "🎬",
};

// Same palette family as COURSE_COLORS in AlumniDirectory
const CATEGORY_COLORS = {
  posts: { bg: NAVY_50, color: NAVY },
  articles: { bg: "#EFF6FF", color: "#1D4ED8" },
  books: { bg: "#ECFDF5", color: "#065F46" },
  videos: { bg: ORANGE_50, color: "#C45000" },
};

// Max height before a category section scrolls instead of growing the page
const SECTION_MAX_HEIGHT = 360;

// ─── ACTIVITY CARD ────────────────────────────────────────────────────────────
function ActivityCard({ item, category, onOpen, onRemove }) {
  const [hov, setHov] = useState(false);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.posts;

  const title = item.title || item.heading || item.name || item.post?.title || "Untitled";
  const description =
    item.description || item.content || item.post?.description || item.post?.excerpt || "Tap to open this resource.";
  const dateValue = item.createdAt || item.updatedAt || item.likedAt;

  return (
    <div
      onClick={() => onOpen(item)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: CARD, borderRadius: 16, overflow: "hidden", cursor: "pointer",
        border: `1px solid ${hov ? NAVY_100 : NAVY_50}`,
        boxShadow: hov ? "0 8px 28px rgba(15,28,128,.10)" : "0 1px 4px rgba(15,28,128,.05)",
        transform: hov ? "translateY(-3px)" : "none",
        transition: "all .2s ease",
        position: "relative",
      }}
    >
      <div style={{ height: 3, background: colors.color }} />

      <div style={{ padding: "16px 16px 14px" }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 6 }}
        >
          <button
            type="button"
            onClick={() => onRemove(category, item)}
            style={{
              height: 30,
              border: "none",
              borderRadius: 999,
              padding: "0 12px",
              background: "#f3f4f6",
              color: "#374151",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>

        {/* Icon + category tag */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, paddingRight: 30 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: colors.bg, color: colors.color,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}
          >
            {CATEGORY_ICON[category]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: colors.color, letterSpacing: "0.6px", textTransform: "uppercase" }}>
              {CATEGORY_LABELS[category]}
            </div>
            <div
              style={{
                fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 14, color: TH,
                lineHeight: 1.3, marginTop: 3,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}
            >
              {title}
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 12.5, color: TB, lineHeight: 1.6, margin: "0 0 12px",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}
        >
          {description}
        </p>

        {/* Footer meta */}
        <div
          style={{
            display: "flex", gap: 10, fontSize: 11.5, color: TS,
            borderTop: `1px solid ${NAVY_50}`, paddingTop: 10,
            justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {dateValue ? new Date(dateValue).toLocaleDateString() : "—"}
          </span>
          <span style={{ flexShrink: 0, color: hov ? colors.color : TS, fontWeight: hov ? 700 : 500, transition: "color .2s" }}>
            Open →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: CARD, borderRadius: 16, overflow: "hidden", border: `1px solid ${NAVY_50}` }}>
      <div style={{ height: 3, background: NAVY_50 }} />
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: NAVY_50, animation: "act-pulse 1.6s ease infinite" }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 9, background: NAVY_50, borderRadius: 4, marginBottom: 7, width: "35%", animation: "act-pulse 1.6s ease infinite" }} />
            <div style={{ height: 12, background: NAVY_50, borderRadius: 4, width: "70%", animation: "act-pulse 1.6s ease .1s infinite" }} />
          </div>
        </div>
        <div style={{ height: 10, background: NAVY_50, borderRadius: 4, marginBottom: 6, animation: "act-pulse 1.6s ease infinite" }} />
        <div style={{ height: 10, background: NAVY_50, borderRadius: 4, width: "60%", animation: "act-pulse 1.6s ease .15s infinite" }} />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Activity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get("/api/alumni/activity", {
          headers: { Authorization: `Bearer ${localStorage.getItem("alumni_token")}` },
        });
        if (res.data.success) {
          // Normalize activity: backend may return either an array of items
          // or a grouped object. Ensure `activity` is set to whatever the
          // response contains, and handle both shapes below.
          setActivity(res.data.data ?? []);
        } else {
          toast.error(res.data.message || "Failed to load activity.");
        }
      } catch (error) {
        console.error("Fetch activity error", error);
        toast.error("Unable to load activity. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // Support two possible shapes from the backend:
  // 1) an array of liked items (we need to group them here)
  // 2) a pre-grouped object like { likedPosts: [...], likedArticles: [...], ... }
  let grouped = {};

  const normalizeCategory = (type) => {
    return {
      post: "posts",
      posts: "posts",
      article: "articles",
      articles: "articles",
      book: "books",
      books: "books",
      video: "videos",
      videos: "videos",
      course: "courses",
      courses: "courses",
    }[type] || type;
  };

  if (Array.isArray(activity)) {
    grouped = activity.reduce((acc, item) => {
      const category = normalizeCategory(item.resourceType || item.type || "posts");
      acc[category] = acc[category] || [];
      acc[category].push(item);
      return acc;
    }, {});
  } else if (activity && typeof activity === "object") {
    const normalizeKey = (k) => `liked${k.charAt(0).toUpperCase() + k.slice(1)}`;

    Object.keys(CATEGORY_LABELS).forEach((cat) => {
      const likedKey = normalizeKey(cat);
      grouped[cat] = Array.isArray(activity[cat])
        ? activity[cat]
        : Array.isArray(activity[likedKey])
        ? activity[likedKey]
        : [];
    });
  }

  const totalCount = Object.values(grouped).flat().length;

  const pathFor = (type) => {
    const tabMap = { articles: "library", books: "reading", videos: "media" };
    if (type === "posts") return "/alumni/discussion";
    if (type === "articles") return `/alumni/resourcessection?tab=${tabMap.articles}`;
    if (type === "books") return `/alumni/resourcessection?tab=${tabMap.books}`;
    if (type === "videos") return `/alumni/resourcessection?tab=${tabMap.videos}`;
    return `/alumni/resourcessection`;
  };

  const getRemoveUrl = (category, item) => {
    const id = item._id || item.id || item.slug;
    if (category === "posts") return `/api/alumni/posts/${id}/like`;

    const normalType = {
      books: "book",
      book: "book",
      articles: "article",
      article: "article",
      videos: "video",
      video: "video",
      courses: "course",
      course: "course",
    }[category] || category;

    return `/api/alumni/resource/${normalType}/${id}/like`;
  };

  const removeItem = async (category, item) => {
    const url = getRemoveUrl(category, item);
    const token = localStorage.getItem("alumni_token");

    try {
      const res = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setActivity((prev) => {
          if (Array.isArray(prev)) {
            return prev.filter((i) => (i._id || i.id || i.slug) !== (item._id || item.id || item.slug));
          }
          if (prev && typeof prev === "object") {
            const updated = { ...prev };
            Object.keys(updated).forEach((key) => {
              if (Array.isArray(updated[key])) {
                updated[key] = updated[key].filter(
                  (i) => (i._id || i.id || i.slug) !== (item._id || item.id || item.slug)
                );
              }
            });
            return updated;
          }
          return prev;
        });
        toast.success("Removed from activity.");
      } else {
        toast.error(res.data.message || "Could not remove item.");
      }
    } catch (error) {
      console.error("Failed removing activity item", error);
      toast.error("Unable to remove item. Please try again.");
    }
  };

  const filterOptions = ["All", ...Object.keys(CATEGORY_LABELS)];
  const visibleCategories = Object.keys(CATEGORY_LABELS).filter(
    (cat) => activeFilter === "All" || activeFilter === cat
  );
  const navigate = (linkTo) => {
    window.location.href = linkTo;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes act-fadeup { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes act-pulse  { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
        .act-card { animation: act-fadeup .28s ease both; }
        .act-scroll::-webkit-scrollbar { width: 7px; }
        .act-scroll::-webkit-scrollbar-track { background: transparent; }
        .act-scroll::-webkit-scrollbar-thumb { background: ${NAVY_100}; border-radius: 20px; }
        .act-scroll::-webkit-scrollbar-thumb:hover { background: ${NAVY}55; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* ── PAGE HEADER ── */}
        <div
          style={{
            borderRadius: 18, padding: "22px 24px 22px 28px", marginBottom: 20,
            border: `1px solid ${NAVY_100}`,
            background: `linear-gradient(135deg, ${NAVY_50} 0%, #E5E8FF 55%, ${ORANGE_50} 100%)`,
            position: "relative", overflow: "hidden",
          }}
        >
          {/* slim gradient accent bar, clipped to the rounded corner by overflow:hidden above */}
          <div
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
              background: `linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
            }}
          />

          <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", border: `2px solid rgba(15,28,128,.07)`, pointerEvents: "none" }} />

          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(15,28,128,.08)", border: "1px solid rgba(15,28,128,.14)",
              borderRadius: 20, padding: "3px 11px", marginBottom: 10,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: NAVY }} />
            <span style={{ fontSize: 9.5, fontWeight: 800, color: NAVY, letterSpacing: "1.1px", textTransform: "uppercase" }}>
              Mashar Alumni Network
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif", fontSize: "clamp(18px,3vw,24px)",
              fontWeight: 900, color: TH, margin: "0 0 6px", letterSpacing: "-0.3px",
            }}
          >
            📈 Activity
          </h1>
          <p style={{ fontSize: 13.5, color: TB, margin: 0 }}>
            Your latest liked posts, articles, books, and videos.
          </p>
        </div>

        {/* ── FILTER PILLS (with counts) ── */}
        {!loading && totalCount > 0 && (
          <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
            {filterOptions.map((f) => {
              const count = f === "All" ? totalCount : (grouped[f] || []).length;
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    border: "none", borderRadius: 20, padding: "6px 14px",
                    fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: active ? ORANGE : CARD,
                    color: active ? "#fff" : TB,
                    boxShadow: active ? `0 3px 10px ${ORANGE}44` : `0 1px 4px rgba(15,28,128,.06)`,
                    fontFamily: "'DM Sans', sans-serif", transition: "all .15s",
                  }}
                >
                  {f !== "All" && <span>{CATEGORY_ICON[f]}</span>}
                  {f === "All" ? "All" : CATEGORY_LABELS[f]}
                  <span
                    style={{
                      background: active ? "rgba(255,255,255,.25)" : NAVY_50,
                      color: active ? "#fff" : NAVY,
                      borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 800,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── SKELETONS ── */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && totalCount === 0 && (
          <div
            style={{
              textAlign: "center", padding: "52px 20px",
              background: NAVY_50, borderRadius: 18, border: `1px solid ${NAVY_100}`,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>✨</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16, color: TH, marginBottom: 6 }}>
              No activity yet
            </div>
            <div style={{ fontSize: 13, color: TS }}>Like a post, article, book, or video to see it here.</div>
          </div>
        )}

        {/* ── SECTIONS ── */}
        {!loading && totalCount > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {visibleCategories.map((category) => {
              const items = grouped[category];
              if (!items || items.length === 0) return null;
              const colors = CATEGORY_COLORS[category];
              const needsScroll = items.length > 4;

              return (
                <section
                  key={category}
                  style={{
                    background: CARD, borderRadius: 18, border: `1px solid ${NAVY_50}`,
                    boxShadow: "0 1px 4px rgba(15,28,128,.04)", padding: "18px 20px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${NAVY_50}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: colors.bg, color: colors.color,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                        }}
                      >
                        {CATEGORY_ICON[category]}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 15, color: TH }}>
                          {CATEGORY_LABELS[category]}
                        </div>
                        <div style={{ fontSize: 11.5, color: TS }}>
                          {items.length} liked {category === "posts" ? "discussion post" : category.slice(0, -1)}
                          {items.length === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10.5, fontWeight: 700, borderRadius: 20,
                        padding: "3px 10px", background: colors.bg, color: colors.color,
                      }}
                    >
                      {items.length}
                    </span>
                  </div>

                  <div
                    className={needsScroll ? "act-scroll" : ""}
                    style={{
                      display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14,
                      maxHeight: needsScroll ? SECTION_MAX_HEIGHT : "none",
                      overflowY: needsScroll ? "auto" : "visible",
                      paddingRight: needsScroll ? 6 : 0,
                    }}
                  >
                    {items.map((item, i) => (
                      <div key={item._id || item.id || item.slug} className="act-card" style={{ animationDelay: `${i * 30}ms` }}>
                        <ActivityCard
                          item={item}
                          category={category}
                          onOpen={() => navigate(pathFor(category))}
                          onRemove={removeItem}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}