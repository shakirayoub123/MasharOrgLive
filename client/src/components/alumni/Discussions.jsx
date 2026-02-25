import { useState, useEffect } from "react";
import API from "../../utils/api";

/* ═══════════════════════════════════════════
   MASHAR DESIGN TOKENS
   Extracted from mashar.org / screenshot
═══════════════════════════════════════════ */
const M = {
  // backgrounds
  pageBg: "#ece9e0",   // main content parchment
  cardBg: "#ffffff",   // post cards
  sidebarBg: "#1c1a0f",   // dark olive sidebar

  // text
  textDark: "#1c1a0f",   // headings
  textMid: "#5c5240",   // body text
  textLight: "#9a8c78",   // timestamps, hints
  textMuted: "#c4b89c",   // placeholder

  // brand accent
  gold: "#d4a843",   // Mashar gold (button text, active)
  goldLight: "#f0c84a",   // brighter gold for dark bg
  goldBg: "#fdf6e3",   // very light gold tint

  // borders
  border: "#e2d9c8",
  borderHover: "#c8b898",

  // interaction
  likeActive: "#d4a843",
  commentActive: "#1c1a0f",

  // category dots
  cats: {
    "Announcements": { bg: "#fff8e6", text: "#92670a", border: "#f0d07a", dot: "#d4a843" },
    "Alumni Discussion": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
    "Events": { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", dot: "#10b981" },
    "Learning": { bg: "#eff9ff", text: "#0369a1", border: "#bae6fd", dot: "#0ea5e9" },
    "General": { bg: "#f5f4f0", text: "#57534e", border: "#d6d3d1", dot: "#a8a29e" },
  },

  // avatar gradients — one per first-letter band
  avGrad: [
    ["#d4a843", "#a07828"],
    ["#e07b5a", "#b54c2a"],
    ["#6a8fd8", "#3d5fa8"],
    ["#5ab88a", "#2d8057"],
    ["#b07ed4", "#7040a8"],
    ["#d4956a", "#a85e30"],
    ["#e0856a", "#b05030"],
    ["#8ab8d4", "#4a80a8"],
  ],
};

const CATEGORIES = ["Alumni Discussion", "Announcements", "Events", "Learning", "General"];

/* ── helpers ── */
const avGrad = (n = "?") => M.avGrad[(n.charCodeAt(0) || 65) % M.avGrad.length];
const inits = (n = "?") => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

/* ════════════════════════════════════════════════
   ATOMS
════════════════════════════════════════════════ */

function Avatar({ name = "?", size = "md" }) {
  const [w, fs] = { sm: [32, 11], md: [40, 13], lg: [48, 16] }[size];
  const [a, b] = avGrad(name);
  return (
    <div style={{
      width: w, height: w, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: fs,
      boxShadow: "0 1px 6px rgba(0,0,0,.18)",
      fontFamily: "inherit",
    }}>
      {inits(name)}
    </div>
  );
}

function Badge({ category }) {
  const c = M.cats[category] || M.cats["General"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 10, fontWeight: 700, lineHeight: 1,
      padding: "3px 9px", borderRadius: 99,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {category}
    </span>
  );
}

function ActionBtn({ icon, label, active, onClick, activeColor = M.commentActive }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer", padding: 0,
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 13, fontWeight: 600,
      color: active ? activeColor : M.textLight,
      transition: "color .15s",
      fontFamily: "inherit",
    }}
      onMouseEnter={e => !active && (e.currentTarget.style.color = M.textMid)}
      onMouseLeave={e => !active && (e.currentTarget.style.color = M.textLight)}
    >
      {icon}
      {label}
    </button>
  );
}

/* ════════════════════════════════════════════════
   COMMENT ITEM
════════════════════════════════════════════════ */
function CommentItem({ comment, canDelete, onDelete }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <Avatar name={comment.author?.name} size="sm" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: "#f8f5ef", border: `1px solid ${M.border}`,
          borderRadius: "14px 14px 14px 3px", padding: "9px 13px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: M.textDark, margin: 0 }}>{comment.author?.name}</p>
            {canDelete && (
              <button onClick={onDelete} title="Delete comment" style={{
                background: "none", border: "none", cursor: "pointer",
                color: M.textMuted, fontSize: 11, padding: 0, lineHeight: 1,
                transition: "color .15s", flexShrink: 0,
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#e05050"}
                onMouseLeave={e => e.currentTarget.style.color = M.textMuted}
              >✕</button>
            )}
          </div>
          <p style={{ fontSize: 13, color: M.textMid, lineHeight: 1.55, margin: 0 }}>{comment.body}</p>
        </div>
        <p style={{ fontSize: 10, color: M.textLight, marginTop: 3, marginLeft: 6 }}>{timeAgo(comment.createdAt)}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   COMMENT SECTION
════════════════════════════════════════════════ */
function CommentSection({ postId, user, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const submit = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await API.post(`/posts/${postId}/comments`, { body: text.trim() });
      setComments(p => [...p, res.data]);
      setText("");
      setExpanded(true);
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const deleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);
      setComments(p => p.filter(c => c._id !== commentId));
    } catch (e) { console.error(e); }
  };

  const shown = expanded ? comments : comments.slice(0, 2);

  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${M.border}` }}>

      {/* toggle */}
      {comments.length > 2 && (
        <button onClick={() => setExpanded(!expanded)} style={{
          fontSize: 12, fontWeight: 700, color: M.gold,
          background: "none", border: "none", cursor: "pointer",
          marginBottom: 10, padding: 0, display: "block", fontFamily: "inherit",
        }}>
          {expanded ? "↑ Hide comments" : `↓ View all ${comments.length} comments`}
        </button>
      )}

      {/* list */}
      {shown.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {shown.map((c, i) => (
            <CommentItem
              key={c._id || i}
              comment={c}
              canDelete={user?.id === c.author?.id}
              onDelete={() => deleteComment(c._id)}
            />
          ))}
        </div>
      )}

      {/* input */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Avatar name={user?.name} size="sm" />
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          background: "#f8f5ef", border: `1.5px solid ${M.border}`,
          borderRadius: 99, padding: "6px 8px 6px 14px", gap: 6,
          transition: "border-color .15s",
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = M.gold}
          onBlurCapture={e => e.currentTarget.style.borderColor = M.border}
        >
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Write a comment…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 13, color: M.textDark, fontFamily: "inherit",
            }}
          />
          <button onClick={submit} disabled={!text.trim() || sending}
            style={{
              width: 30, height: 30, borderRadius: "50%", border: "none",
              flexShrink: 0, cursor: text.trim() ? "pointer" : "default",
              background: text.trim() ? M.textDark : M.border,
              color: text.trim() ? M.goldLight : M.textLight,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s",
            }}>
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   POST CARD
════════════════════════════════════════════════ */
function PostCard({ post, user, onLike, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [a, b] = avGrad(post.author?.name);
  const isOwner = user?.id === post.author?.id;

  const handleLike = () => {
    if (liked) return;
    setLiked(true); setLikes(n => n + 1);
    onLike(post._id);
  };

  return (
    <div style={{
      background: M.cardBg, border: `1px solid ${M.border}`,
      borderRadius: 14, overflow: "hidden",
      transition: "box-shadow .2s, transform .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(28,26,15,.10)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {/* gradient top strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${a}, ${b})` }} />

      <div style={{ padding: "16px 18px" }}>

        {/* author row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Avatar name={post.author?.name} size="md" />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: M.textDark, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {post.author?.name}
              </p>
              <p style={{ fontSize: 11, color: M.textLight, marginTop: 2 }}>{timeAgo(post.createdAt)}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Badge category={post.category} />
            {isOwner && (
              <button onClick={() => onDelete(post._id)} title="Delete post" style={{
                background: "none", border: "none", cursor: "pointer",
                color: M.textMuted, fontSize: 14, padding: "2px 4px",
                borderRadius: 6, transition: "color .15s, background .15s",
                lineHeight: 1,
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e05050"; e.currentTarget.style.background = "#ffeaea"; }}
                onMouseLeave={e => { e.currentTarget.style.color = M.textMuted; e.currentTarget.style.background = "transparent"; }}
              >
                🗑
              </button>
            )}
          </div>
        </div>

        {/* content */}
        {post.title && (
          <h3 style={{ fontWeight: 800, fontSize: 15, color: M.textDark, margin: "0 0 6px", lineHeight: 1.35 }}>
            {post.title}
          </h3>
        )}
        {post.body && (
          <p style={{ fontSize: 13, color: M.textMid, lineHeight: 1.65, margin: 0 }}>
            {post.body}
          </p>
        )}

        {/* divider + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${M.border}` }}>
          <ActionBtn
            active={liked} activeColor={M.likeActive}
            onClick={handleLike}
            icon={
              <svg width="15" height="15" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 10v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
              </svg>
            }
            label={`${likes} ${likes === 1 ? "Like" : "Likes"}`}
          />
          <ActionBtn
            active={showComments} activeColor={M.textDark}
            onClick={() => setShowComments(!showComments)}
            icon={
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            label={`${post.comments?.length || 0} ${showComments ? "Hide" : "Comment"}`}
          />
        </div>

        {/* comments */}
        {showComments && (
          <CommentSection postId={post._id} user={user} initialComments={post.comments || []} />
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   CREATE POST MODAL
════════════════════════════════════════════════ */
function CreatePostModal({ onClose, onPublish, user }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Alumni Discussion");
  const [publishing, setPublishing] = useState(false);

  const canPost = title.trim() || body.trim();

  const handlePublish = async () => {
    if (!canPost || publishing) return;
    setPublishing(true);
    await onPublish({ title, body, category });
    setPublishing(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <style>{`
        @keyframes masharModalIn {
          from { opacity: 0; transform: translateY(22px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        .mashar-modal-wrap { animation: masharModalIn .22s cubic-bezier(.22,.68,0,1.2); }
        .minput {
          width: 100%; box-sizing: border-box;
          background: #faf8f3; border: 1.5px solid ${M.border};
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: ${M.textDark};
          outline: none; font-family: inherit; transition: border-color .15s;
        }
        .minput:focus { border-color: ${M.gold}; background: #fff; }
        .minput::placeholder { color: ${M.textMuted}; }
      `}</style>

      {/* backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(28,26,15,.55)", backdropFilter: "blur(5px)",
      }} />

      <div className="mashar-modal-wrap" style={{
        position: "relative", width: "100%", maxWidth: 520,
        background: "#fffef9", borderRadius: 18,
        boxShadow: "0 24px 80px rgba(28,26,15,.35)",
        overflow: "hidden",
      }}>
        {/* modal header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "15px 20px", borderBottom: `1px solid ${M.border}`,
          background: "#faf7f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={user?.name} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: M.textDark, margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: M.textLight, marginTop: 1 }}>Sharing with the community</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: M.textLight, padding: 6, borderRadius: 8,
            transition: "background .15s, color .15s", lineHeight: 1,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f0ebe0"; e.currentTarget.style.color = M.textDark; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = M.textLight; }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* category selector */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: M.textLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>Category</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map(c => {
                const active = category === c;
                const meta = M.cats[c] || M.cats["General"];
                return (
                  <button key={c} onClick={() => setCategory(c)} style={{
                    border: `1.5px solid ${active ? M.textDark : M.border}`,
                    background: active ? M.textDark : "#faf7f0",
                    color: active ? M.goldLight : M.textMid,
                    borderRadius: 99, fontWeight: 600, fontSize: 12,
                    padding: "5px 13px", cursor: "pointer",
                    transition: "all .15s", fontFamily: "inherit",
                  }}>
                    {active
                      ? <span style={{ marginRight: 4 }}>✓</span>
                      : <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot, display: "inline-block", marginRight: 5, verticalAlign: "middle" }} />
                    }
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <input className="minput" placeholder="Post title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="minput" rows={4} placeholder="Share something with your alumni community…" value={body} onChange={e => setBody(e.target.value)} style={{ resize: "none" }} />

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, paddingTop: 2 }}>
            <button onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: M.textLight,
              padding: "9px 14px", borderRadius: 9,
              transition: "background .15s, color .15s", fontFamily: "inherit",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f0ebe0"; e.currentTarget.style.color = M.textMid; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = M.textLight; }}
            >Cancel</button>
            <button onClick={handlePublish} disabled={!canPost || publishing} style={{
              background: canPost ? M.textDark : "#c8bfaa",
              color: M.goldLight, border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: 13, padding: "10px 22px",
              cursor: canPost ? "pointer" : "not-allowed",
              transition: "background .18s", fontFamily: "inherit",
            }}>
              {publishing
                ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.3)", borderTopColor: M.goldLight, borderRadius: "50%", display: "inline-block", animation: "masharSpin .7s linear infinite" }} />
                  Publishing…
                </span>
                : "✓ Publish Post"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
export default function Discussion() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get("/alumni/me").then(r => setUser(r.data.alumni)); }, []);
  useEffect(() => {
    API.get("/posts").then(r => setPosts(r.data)).finally(() => setLoading(false));
  }, []);

  const handlePublish = async (data) => {
    const res = await API.post("/posts", data);
    setPosts(p => [res.data, ...p]);
  };

  const handleLike = async (id) => {
    const res = await API.put(`/posts/like/${id}`);
    setPosts(p => p.map(x => x._id === id ? res.data : x));
  };

  const handleDelete = async (id) => {
    await API.delete(`/posts/${id}`);
    setPosts(p => p.filter(x => x._id !== id));
  };

  const FILTERS = ["All", ...CATEGORIES];
  const filtered = activeFilter === "All" ? posts : posts.filter(p => p.category === activeFilter);

  /* ── loading ── */
  if (loading || !user) return (
    <div style={{ background: M.pageBg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes masharSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, border: `2.5px solid ${M.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "masharSpin .8s linear infinite" }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: M.textLight }}>Loading community…</p>
      </div>
    </div>
  );

  /* ── page ── */
  return (
    <div style={{ background: M.pageBg, minHeight: "100vh", width: "100%" }}>
      <style>{`
        @keyframes masharSpin { to { transform: rotate(360deg); } }
        @keyframes masharFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0c8b8; border-radius: 99px; }

        /* responsive overrides */
        @media (max-width: 600px) {
          .mashar-page-pad { padding: 16px 14px !important; }
          .mashar-header   { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .mashar-compose  { border-radius: 12px !important; }
        }
      `}</style>

      <div className="mashar-page-pad" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── PAGE HEADER ── */}
        <div className="mashar-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 24, color: M.textDark, margin: 0, letterSpacing: "-.3px" }}>
              Community Discussion
            </h1>
            <p style={{ fontSize: 13, color: M.textLight, marginTop: 4 }}>
              {posts.length} post{posts.length !== 1 ? "s" : ""} shared by alumni
            </p>
          </div>

          <button onClick={() => setShowModal(true)} style={{
            background: M.textDark, color: M.goldLight,
            border: "none", borderRadius: 11, fontWeight: 700, fontSize: 13,
            padding: "11px 20px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            transition: "background .18s, transform .15s",
            boxShadow: "0 2px 10px rgba(28,26,15,.20)",
            fontFamily: "inherit", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#2e2a18"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = M.textDark; e.currentTarget.style.transform = "none"; }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>

        {/* ── COMPOSE BAR ── */}
        <button className="mashar-compose" onClick={() => setShowModal(true)} style={{
          background: M.cardBg, border: `1.5px solid ${M.border}`,
          borderRadius: 99, display: "flex", alignItems: "center",
          gap: 12, padding: "11px 16px", cursor: "pointer",
          width: "100%", textAlign: "left",
          transition: "border-color .18s, box-shadow .18s",
          boxShadow: "0 1px 4px rgba(28,26,15,.05)",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = M.gold; e.currentTarget.style.boxShadow = "0 2px 12px rgba(28,26,15,.10)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = M.border; e.currentTarget.style.boxShadow = "0 1px 4px rgba(28,26,15,.05)"; }}
        >
          <Avatar name={user?.name} size="md" />
          <span style={{ fontSize: 13, color: M.textMuted, flex: 1 }}>
            What's on your mind, {user?.name?.split(" ")[0]}?
          </span>
          <span style={{
            background: M.textDark, color: M.goldLight,
            fontSize: 11, fontWeight: 700, padding: "6px 13px",
            borderRadius: 99, flexShrink: 0,
          }}>
            ✍️ Write
          </span>
        </button>

        {/* ── FILTER PILLS ── */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {FILTERS.map(f => {
            const active = activeFilter === f;
            const meta = M.cats[f];
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                border: `1.5px solid ${active ? M.textDark : M.border}`,
                background: active ? M.textDark : M.cardBg,
                color: active ? M.goldLight : M.textMid,
                borderRadius: 99, fontWeight: 600, fontSize: 12,
                padding: "6px 15px", cursor: "pointer",
                transition: "all .15s", whiteSpace: "nowrap",
                flexShrink: 0, fontFamily: "inherit",
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = M.gold; e.currentTarget.style.color = M.textDark; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = M.border; e.currentTarget.style.color = M.textMid; } }}
              >
                {meta && <span style={{ marginRight: 4 }}>{/* icons are in meta.cats but General has no dedicated icon; handled via badge */}</span>}
                {{
                  "All": "🏘 All",
                  "Alumni Discussion": "🎓 Alumni",
                  "Announcements": "📢 Announcements",
                  "Events": "📅 Events",
                  "Learning": "📚 Learning",
                  "General": "💬 General",
                }[f] || f}
              </button>
            );
          })}
        </div>

        {/* ── POSTS ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", animation: "masharFadeUp .3s ease-out" }}>
            <p style={{ fontSize: 56, marginBottom: 14, lineHeight: 1 }}>🌱</p>
            <p style={{ fontWeight: 800, fontSize: 17, color: M.textDark, marginBottom: 6 }}>No posts yet</p>
            <p style={{ fontSize: 13, color: M.textLight, marginBottom: 20 }}>Be the first to start a conversation!</p>
            <button onClick={() => setShowModal(true)} style={{
              background: M.textDark, color: M.goldLight, border: "none",
              borderRadius: 11, fontWeight: 700, fontSize: 13,
              padding: "11px 22px", cursor: "pointer", fontFamily: "inherit",
            }}>
              ✍️ Create First Post
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((post, i) => (
              <div key={post._id} style={{ animation: `masharFadeUp .25s ease-out ${i * 40}ms both` }}>
                <PostCard post={post} user={user} onLike={handleLike} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && (
        <CreatePostModal user={user} onClose={() => setShowModal(false)} onPublish={handlePublish} />
      )}
    </div>
  );
}