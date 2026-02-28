import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { resolveAssetUrl } from "../../utils/baseUrl";

function imgSrc(image) {
  return resolveAssetUrl(image);
}

const NAVY = "#0F1C80";
const ORANGE = "#F38900";

const TABS = [
  { key: "all", icon: "🌐", label: "All" },
  { key: "pending", icon: "⏳", label: "Pending" },
  { key: "approved", icon: "✅", label: "Approved" },
  { key: "rejected", icon: "❌", label: "Rejected" },
  { key: "discussion", icon: "💬", label: "Discussion" },
  { key: "featured", icon: "⭐", label: "Featured" },
  { key: "announcements", icon: "📢", label: "Announcements" },
];

const TAB_OPTIONS = [
  { value: "discussion", label: "💬 Discussion" },
  { value: "featured", label: "⭐ Featured" },
  { value: "announcements", label: "📢 Announcement" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "#0F1C80", fg: "#E8EBFF" },
  { bg: "#F38900", fg: "#FFF4E0" },
  { bg: "#1A2FA0", fg: "#EEF0FF" },
  { bg: "#C46D00", fg: "#FFF4E0" },
  { bg: "#0B5299", fg: "#E0EEFF" },
];
function avatarColor(name = "") {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}
function initials(n = "") { return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"; }
function ago(d) {
  if (!d) return "";
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ─── MEMBERS CACHE (same pattern as CommunityFeed) ────────────────────────────
let _membersCache = [];
function useMembersCache() {
  const [members, setMembers] = useState(_membersCache);
  useEffect(() => {
    if (_membersCache.length > 0) return;
    API.get("/alumni/members")
      .then(r => {
        _membersCache = (r.data.data || r.data || []);
        setMembers([..._membersCache]);
      })
      .catch(console.error);
  }, []);
  return members;
}

function Av({ name = "", size = 34 }) {
  const { bg, fg } = avatarColor(name);
  return (
    <div className="rounded-full flex items-center justify-center font-black shrink-0 select-none"
      style={{ width: size, height: size, minWidth: size, background: bg, color: fg, fontSize: size * 0.32 }}>
      {initials(name)}
    </div>
  );
}

// ─── MENTION INPUT (ported from CommunityFeed) ────────────────────────────────
function MentionInput({ value, onChange, placeholder, rows = 1, className = "", onKeyDown, members = [] }) {
  const [mention, setMention] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selIdx, setSelIdx] = useState(0);
  const ref = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    const cursor = e.target.selectionStart;
    const before = val.slice(0, cursor);
    const atIdx = before.lastIndexOf("@");
    if (atIdx !== -1) {
      const charBefore = before[atIdx - 1];
      const validTrigger = atIdx === 0 || charBefore === " " || charBefore === "\n";
      if (validTrigger) {
        const query = before.slice(atIdx + 1);
        const filtered = query === ""
          ? members
          : members.filter(m => m.full_name.toLowerCase().includes(query.toLowerCase()));
        setMention({ query, start: atIdx, end: cursor });
        setSuggestions(filtered);
        setSelIdx(0);
        return;
      }
    }
    setMention(null);
    setSuggestions([]);
  };

  const insertMention = (member) => {
    if (!mention) return;
    const before = value.slice(0, mention.start);
    const after = value.slice(mention.end);
    const inserted = `@${member.full_name} `;
    const newVal = before + inserted + after;
    onChange(newVal);
    setMention(null);
    setSuggestions([]);
    setTimeout(() => {
      if (ref.current) {
        const pos = mention.start + inserted.length;
        ref.current.selectionStart = ref.current.selectionEnd = pos;
        ref.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelIdx(i => Math.min(i + 1, suggestions.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insertMention(suggestions[selIdx]); return; }
      if (e.key === "Escape") { setMention(null); setSuggestions([]); return; }
    }
    onKeyDown?.(e);
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        onBlur={() => setTimeout(() => { setMention(null); setSuggestions([]); }, 150)}
        className={`w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] resize-none outline-none leading-relaxed transition-colors placeholder:text-gray-400 ${className}`}
      />
      {suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-1 z-50 bg-white border border-[#DDE0FF] rounded-xl shadow-lg overflow-hidden min-w-[200px] max-h-52 overflow-y-auto">
          <p className="px-3 pt-2 pb-1 text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-50">Mention</p>
          {suggestions.map((m, i) => (
            <div key={m._id} onMouseDown={() => insertMention(m)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${i === selIdx ? "bg-[#EEF0FF]" : "hover:bg-gray-50"}`}>
              <Av name={m.full_name} size={26} />
              <div>
                <p className="text-xs font-bold text-[#0D1240]">{m.full_name}</p>
                <p className="text-[10px] text-gray-400">{m.course}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <>
      <div className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-[min(380px,92vw)] bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden"
        style={{ animation: "adminModalIn .18s ease" }}>
        <div className="h-1 bg-red-500" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
          <p className="text-center font-bold text-[#0D1240] text-sm leading-relaxed">{message}</p>
          <div className="flex gap-3 mt-5">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors shadow-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── POST FORM MODAL (Create / Edit) — now with @mention ─────────────────────
function PostFormModal({ post = null, onSave, onClose, currentUser, members = [] }) {
  const { adminToken } = useAuth();
  const isEdit = !!post;
  const [title, setTitle] = useState(post?.title || "");
  const [text, setText] = useState(post?.content || "");
  const [tab, setTab] = useState(post?.tab || "discussion");
  const [commentsOn, setCommentsOn] = useState(post?.commentsOpen !== false);
  const [img, setImg] = useState(post?.image ? imgSrc(post.image) : null);
  const [imgFile, setImgFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const ok = title.trim() || text.trim();

  const submit = async () => {
    if (!ok || saving) return;
    setSaving(true);
    const tid = toast.loading(isEdit ? "Saving changes…" : "Publishing post…");
    try {
      const fd = new FormData();
      if (title) fd.append("title", title.trim());
      if (text) fd.append("content", text.trim());
      fd.append("commentsOpen", String(commentsOn));
      fd.append("tab", tab);
      if (imgFile) fd.append("image", imgFile);

      let res;
      if (isEdit) {
        res = await API.put(`/admin/posts/${post._id}`, fd, {
          headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.post("/admin/posts", fd, {
          headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "multipart/form-data" },
        });
      }
      toast.success(isEdit ? "Post updated successfully" : "Post published successfully", { id: tid });
      onSave(res.data.data, isEdit);
      onClose();
    } catch (err) {
      console.error("save error", err);
      toast.error("Failed to save post", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[9980] bg-[#0F1C80]/15 backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9981] w-[min(560px,95vw)] max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#DDE0FF] flex flex-col overflow-hidden"
        style={{ animation: "adminModalIn .2s ease" }}>
        <div className="h-[3px] shrink-0" style={{ background: "linear-gradient(90deg,#0F1C80,#F38900)" }} />

        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EEF0FF] shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: isEdit ? "#FFF4E0" : "#EEF0FF" }}>
            {isEdit ? "✏️" : "✍️"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-[#0D1240] text-base">{isEdit ? "Edit Post" : "Create New Post"}</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isEdit ? `Editing post by ${post.author?.full_name}` : `Posting as ${currentUser?.full_name || currentUser?.name || "Admin"}`}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-sm hover:bg-[#DDE0FF] transition-colors shrink-0">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title (optional)"
              className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400" />
          </div>

          <div>
            <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">
              Content
              <span className="ml-2 normal-case font-medium opacity-70">— type @ to mention a member</span>
            </label>
            {/* ✅ MentionInput replaces plain textarea */}
            <MentionInput
              value={text}
              onChange={setText}
              placeholder="Write your post… Use @ to mention someone"
              rows={5}
              members={members}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">Category</label>
              <select value={tab} onChange={e => setTab(e.target.value)}
                className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors">
                {TAB_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">Comments</label>
              <button onClick={() => setCommentsOn(v => !v)}
                className={`w-full py-2.5 rounded-xl border text-sm font-bold transition-colors flex items-center justify-center gap-2 ${commentsOn ? "bg-[#EEF0FF] border-[#DDE0FF] text-[#0F1C80]" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                <span className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${commentsOn ? "bg-[#0F1C80]" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full shadow transition-all bg-white ${commentsOn ? "left-[18px]" : "left-0.5"}`} />
                </span>
                {commentsOn ? "Open" : "Closed"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">Image</label>
            {img ? (
              <div className="relative inline-block max-w-full">
                <img src={img} alt="" className="max-h-36 max-w-full rounded-xl border border-[#DDE0FF] object-cover" />
                <button onClick={() => { setImg(null); setImgFile(null); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 shadow">✕</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="w-full py-6 border-2 border-dashed border-[#DDE0FF] rounded-xl text-sm text-gray-400 hover:border-[#0F1C80] hover:text-[#0F1C80] hover:bg-[#EEF0FF] transition-colors flex flex-col items-center gap-1">
                <span className="text-2xl">🖼️</span>
                <span className="font-medium">Click to upload image</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files[0];
              if (f) { setImg(URL.createObjectURL(f)); setImgFile(f); }
            }} />
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-[#EEF0FF] shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#DDE0FF] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={!ok || saving}
            className={`flex-[2] py-2.5 rounded-xl text-sm font-black transition-all relative overflow-hidden ${ok && !saving ? "bg-[#0F1C80] text-white hover:bg-[#1A2FA0] shadow-lg shadow-[#0F1C80]/20" : "bg-gray-100 text-gray-400 cursor-default"}`}>
            {ok && !saving && <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#F38900] rounded-r-xl" />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Publish Post"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── POST ROW ─────────────────────────────────────────────────────────────────
function PostRow({ post, onEdit, onDelete, onToggleComments, onApprove, onReject }) {
  const { bg } = avatarColor(post.author?.full_name || "");
  const tabColors = {
    discussion: "bg-blue-50 text-blue-600 border-blue-200",
    featured: "bg-emerald-50 text-emerald-600 border-emerald-200",
    announcements: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const statusColors = {
    pending: "bg-orange-50 text-orange-600 border-orange-200",
    approved: "bg-green-50 text-green-600 border-green-200", 
    rejected: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:border-[#DDE0FF] hover:shadow-sm transition-all group">
      <div className="flex items-start gap-4 p-4">
        {post.image ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
            <img src={imgSrc(post.image)} alt="" className="w-full h-full object-cover"
              onError={e => e.target.parentElement.style.display = "none"} />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl shrink-0 bg-[#EEF0FF] flex items-center justify-center text-2xl">
            {post.tab === "featured" ? "⭐" : post.tab === "announcements" ? "📢" : "💬"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tabColors[post.tab] || tabColors.discussion}`}>
                  {TAB_OPTIONS.find(t => t.value === post.tab)?.label || post.tab}
                </span>
                {/* ✅ Approval Status Badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[post.approvalStatus] || statusColors.pending}`}>
                  {post.approvalStatus === "pending" && "⏳ Pending"}
                  {post.approvalStatus === "approved" && "✅ Approved"}
                  {post.approvalStatus === "rejected" && "❌ Rejected"}
                </span>
                {!post.commentsOpen && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">🔒 Locked</span>
                )}
              </div>
              <p className="font-black text-[#0D1240] text-sm leading-snug break-words">
                {post.title || <span className="font-normal text-gray-400 italic">No title</span>}
              </p>
              {post.content && (
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{post.content}</p>
              )}
              {/* ✅ Show rejection reason if rejected */}
              {post.approvalStatus === "rejected" && post.rejectionReason && (
                <p className="text-xs text-red-500 mt-1 italic">Reason: {post.rejectionReason}</p>
              )}
            </div>

            <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* ✅ Approval/Rejection buttons for pending posts */}
              {post.approvalStatus === "pending" && (
                <>
                  <button onClick={() => onApprove(post)}
                    title="Approve post"
                    className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-sm hover:bg-green-100 transition-colors">
                    ✅
                  </button>
                  <button onClick={() => onReject(post)}
                    title="Reject post"
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-sm hover:bg-red-100 transition-colors">
                    ❌
                  </button>
                </>
              )}
              <button onClick={() => onToggleComments(post)}
                title={post.commentsOpen ? "Lock comments" : "Unlock comments"}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors ${post.commentsOpen ? "bg-[#EEF0FF] text-[#0F1C80] hover:bg-[#DDE0FF]" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                {post.commentsOpen ? "💬" : "🔒"}
              </button>
              <button onClick={() => onEdit(post)}
                className="w-8 h-8 rounded-xl bg-[#FFF4E0] text-[#F38900] flex items-center justify-center text-sm hover:bg-[#FFE4B0] transition-colors">
                ✏️
              </button>
              <button onClick={() => onDelete(post)}
                className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-sm hover:bg-red-100 transition-colors">
                🗑️
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            <div className="flex items-center gap-1.5">
              <Av name={post.author?.full_name || ""} size={16} />
              <span className="font-semibold" style={{ color: bg }}>{post.author?.full_name}</span>
            </div>
            <span>·</span>
            <span>{ago(post.createdAt)}</span>
            {post.approvalStatus === "approved" && post.approvedBy && (
              <>
                <span>·</span>
                <span className="text-green-600">Approved by {post.approvedBy.full_name}</span>
              </>
            )}
            <span>·</span>
            <span>❤️ {post.likesCount || 0}</span>
            <span>·</span>
            <span>💬 {post.commentsCount || post.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STATS CARD ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent = NAVY }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: accent + "15" }}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-black leading-none" style={{ color: accent }}>{value}</p>
        <p className="text-[10px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminDiscussion() {
  const { user, admin, adminToken } = useAuth();
  const currentUser = admin || user;

  // ✅ Load members for @mention
  const members = useMembersCache();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [formPost, setFormPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await API.get("/admin/posts", {
        params: { tab: "all", limit: 200 },
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const list = (res.data.data || []).map(p => ({
        ...p,
        tab: p.tab || "discussion",
        commentsOpen: p.commentsOpen !== false,
      }));
      setPosts(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { load(); }, [load]);

  const handleSave = (saved, isEdit) => {
    if (isEdit) {
      setPosts(p => p.map(x => x._id === saved._id ? { ...x, ...saved } : x));
    } else {
      const newPost = {
        ...saved,
        author: { _id: currentUser?._id, full_name: currentUser?.full_name || currentUser?.name, course: currentUser?.course || "" },
        comments: [],
        likesCount: 0,
        commentsOpen: saved.commentsOpen !== false,
        tab: saved.tab || "discussion",
      };
      setPosts(p => [newPost, ...p]);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const tid = toast.loading("Deleting post…");
    try {
      await API.delete(`/admin/posts/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setPosts(p => p.filter(x => x._id !== deleteTarget._id));
      toast.success("Post deleted", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Delete failed", { id: tid });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleComments = async (post) => {
    try {
      await API.put(`/admin/posts/${post._id}`, { commentsOpen: !post.commentsOpen }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setPosts(p => p.map(x => x._id === post._id ? { ...x, commentsOpen: !post.commentsOpen } : x));
      toast(post.commentsOpen ? "🔒 Comments locked" : "💬 Comments unlocked");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update comments");
    }
  };

  // ✅ Approve post handler
  const handleApprove = async (post) => {
    const tid = toast.loading("Approving post…");
    try {
      const res = await API.patch(`/admin/posts/${post._id}/approve`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setPosts(p => p.map(x => x._id === post._id ? { ...x, ...res.data.data } : x));
      toast.success("Post approved successfully", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve post", { id: tid });
    }
  };

  // ✅ Reject post handler
  const handleReject = async (post) => {
    const reason = prompt("Reason for rejection (optional):");
    if (reason === null) return; // User cancelled
    
    const tid = toast.loading("Rejecting post…");
    try {
      const res = await API.patch(`/admin/posts/${post._id}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setPosts(p => p.map(x => x._id === post._id ? { ...x, ...res.data.data } : x));
      toast.success("Post rejected", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject post", { id: tid });
    }
  };

  const filtered = posts.filter(p => {
    // Handle approval status filtering
    if (tab === "pending") return p.approvalStatus === "pending";
    if (tab === "approved") return p.approvalStatus === "approved";
    if (tab === "rejected") return p.approvalStatus === "rejected";
    
    // Handle category filtering (for non-status tabs)
    const matchTab = tab === "all" || p.tab === tab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q) ||
      p.author?.full_name?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totalLikes = posts.reduce((a, p) => a + (p.likesCount || 0), 0);
  const totalComments = posts.reduce((a, p) => a + (p.commentsCount || p.comments?.length || 0), 0);
  const lockedPosts = posts.filter(p => !p.commentsOpen).length;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            borderRadius: 14,
            padding: "10px 18px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
          },
          success: { iconTheme: { primary: NAVY, secondary: "#fff" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2 { font-family: 'Sora', sans-serif; }
        @keyframes adminModalIn { from { opacity:0; transform:translate(-50%,-47%) } to { opacity:1; transform:translate(-50%,-50%) } }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .scrollbar-thin::-webkit-scrollbar { width:4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background:transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background:#DDE0FF; border-radius:4px; }
      `}</style>

      <div className="w-full min-h-screen bg-[#F6F7FD] p-4 md:p-6">

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(${NAVY},${ORANGE})` }} />
              <h1 className="text-2xl font-black text-[#0D1240] leading-none">Discussion Admin</h1>
            </div>
            <p className="text-sm text-gray-400 ml-3">Manage all community posts</p>
          </div>
          <button onClick={() => setFormPost(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F1C80] text-white text-sm font-black shadow-lg shadow-[#0F1C80]/20 hover:bg-[#1A2FA0] transition-colors relative overflow-hidden">
            <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#F38900] rounded-r-xl" />
            <span>✏️ New Post</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon="📝" label="Total Posts" value={posts.length} accent={NAVY} />
          <StatCard icon="❤️" label="Total Likes" value={totalLikes} accent="#E03C3C" />
          <StatCard icon="💬" label="Comments" value={totalComments} accent="#1A6B3C" />
          <StatCard icon="🔒" label="Locked" value={lockedPosts} accent={ORANGE} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-3 mb-4 flex items-center gap-3 flex-wrap shadow-sm">
          <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-[#EEF0FF] rounded-xl px-3 py-2 border border-[#DDE0FF]">
            <span className="text-gray-400 text-sm shrink-0">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search posts or authors…"
              className="flex-1 bg-transparent text-sm text-[#0D1240] outline-none placeholder:text-gray-400 min-w-0" />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs shrink-0">✕</button>
            )}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tab === t.key ? "bg-[#0F1C80] text-white shadow-sm" : "bg-[#EEF0FF] text-[#0F1C80] hover:bg-[#DDE0FF]"}`}>
                <span>{t.icon}</span>{t.label}
                {tab !== t.key && (
                  <span className="text-[9px] font-black opacity-60 bg-white/50 rounded-full px-1">
                    {(() => {
                      if (t.key === "all") return posts.length;
                      if (t.key === "pending") return posts.filter(p => p.approvalStatus === "pending").length;
                      if (t.key === "approved") return posts.filter(p => p.approvalStatus === "approved").length;
                      if (t.key === "rejected") return posts.filter(p => p.approvalStatus === "rejected").length;
                      return posts.filter(p => p.tab === t.key).length;
                    })()}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button onClick={load} title="Refresh"
            className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-sm hover:bg-[#DDE0FF] transition-colors shrink-0">
            🔄
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-[#0F1C80] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading posts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-black text-[#0D1240] text-base">No posts found</p>
            <p className="text-sm text-gray-400 mt-1">{search ? "Try a different search term" : "Create the first post!"}</p>
            <button onClick={() => setFormPost(false)}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#0F1C80] text-white text-sm font-bold hover:bg-[#1A2FA0] transition-colors">
              ✏️ New Post
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs text-gray-400 px-1">{filtered.length} post{filtered.length !== 1 ? "s" : ""}{search && ` matching "${search}"`}</p>
            {filtered.map(p => (
              <PostRow
                key={p._id}
                post={p}
                onEdit={setFormPost}
                onDelete={setDeleteTarget}
                onToggleComments={handleToggleComments}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>

      {formPost !== null && (
        <PostFormModal
          post={formPost || null}
          onSave={handleSave}
          onClose={() => setFormPost(null)}
          currentUser={currentUser}
          members={members}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.title || "this post"}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}