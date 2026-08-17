import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api.js";
import { resolveAssetUrl } from "../../utils/baseUrl";

function imgSrc(image) {
    return resolveAssetUrl(image);
}

const PINNED_IDS_KEY = "mashar_pinned_posts";

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

const TABS = [
    { key: "all", icon: "🌐", label: "All Posts" },
    { key: "discussion", icon: "💬", label: "Discussion" },
    { key: "featured", icon: "⭐", label: "Featured" },
    { key: "announcements", icon: "📢", label: "Announcements" },
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
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || AVATAR_COLORS[0];
}
function initials(n = "") { return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"; }
function ago(d) {
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}
function renderMentions(text, onMentionClick) {
    if (!text) return null;
    const parts = [];
    let lastIndex = 0;
    const mentionRegex = /@[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?=\s|$)/g;
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
        const fullMention = match[0];
        const name = fullMention.slice(1).trim();
        parts.push(
            <span key={`mention-${match.index}`}
                onClick={e => { e.stopPropagation(); onMentionClick?.(name); }}
                className="text-[#0F1C80] font-bold bg-[#EEF0FF] rounded px-0.5 cursor-pointer hover:bg-[#DDE0FF] transition-colors">
                {fullMention}
            </span>
        );
        lastIndex = match.index + fullMention.length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts.length > 0 ? parts : text;
}

// ─── MEMBER PROFILE POPUP ────────────────────────────────────────────────────
function MemberPopup({ name, onClose, allMembers = [] }) {
    const [loading, setLoading] = useState(true);
    useEffect(() => { setLoading(false); }, []);
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
                        {member?.avatar ? (
                            <img
                                src={resolveAssetUrl(member.avatar)}
                                alt={name}
                                className="rounded-2xl border-4 border-white shadow-lg shrink-0"
                                style={{ width: 64, height: 64, objectFit: "cover", zIndex: 1, position: "relative" }}
                            />
                        ) : (
                            <div className="rounded-2xl border-4 border-white shadow-lg flex items-center justify-center font-black shrink-0"
                                style={{ width: 64, height: 64, background: bg, color: fg, fontSize: 22, zIndex: 1, position: "relative" }}>
                                {initials(name)}
                            </div>
                        )}
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
                            <p className="text-xs text-gray-400 mt-2">"{name}" is not a member yet.</p>
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
                                    : "bg-amber-50 text-amber-700 border-amber-200"}`}>
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

// ─── AVATAR ──────────────────────────────────────────────────────────────────
function Av({ name, size = 36, avatar }) {
    const { bg, fg } = avatarColor(name);
    const avatarSrc = avatar ? resolveAssetUrl(avatar) : null;

    if (avatarSrc) {
        return (
            <img
                src={avatarSrc}
                alt={name}
                className="rounded-full shrink-0 select-none"
                style={{ width: size, height: size, minWidth: size, objectFit: "cover" }}
            />
        );
    }
    return (
        <div className="rounded-full flex items-center justify-center font-black shrink-0 select-none"
            style={{ width: size, height: size, minWidth: size, background: bg, color: fg, fontSize: size * 0.32 }}>
            {initials(name)}
        </div>
    );
}

// ─── MENTION INPUT ────────────────────────────────────────────────────────────
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
        <div className="relative flex-1 min-w-0">
            <textarea
                ref={ref}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                onBlur={() => setTimeout(() => { setMention(null); setSuggestions([]); }, 150)}
                className={`w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2 text-sm text-[#0D1240] bg-[#EEF0FF] resize-none outline-none leading-relaxed transition-colors placeholder:text-gray-400 ${className}`}
            />
            {suggestions.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 z-50 bg-white border border-[#DDE0FF] rounded-xl shadow-lg overflow-hidden min-w-[200px]">
                    <p className="px-3 pt-2 pb-1 text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-50">Mention</p>
                    {suggestions.map((m, i) => (
                        <div key={m._id} onMouseDown={() => insertMention(m)}
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${i === selIdx ? "bg-[#EEF0FF]" : "hover:bg-gray-50"}`}>
                            <Av name={m.full_name} size={26} avatar={m.avatar} />
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

// ─── COMMENT ─────────────────────────────────────────────────────────────────
function Comment({ c, onMentionClick, allMembers = [] }) {
    return (
        <div className="flex gap-2 items-start">
            <Av name={c.author.full_name} size={28} avatar={c.author.avatar} />
            <div className="flex-1 min-w-0">
                <div className="bg-[#EEF0FF] rounded-2xl rounded-tl-sm px-3 py-2">
                    <span className="text-xs font-bold text-[#0D1240]">{c.author.full_name}</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">{c.author.course}</span>
                    <p className="text-[13px] text-gray-600 leading-relaxed mt-0.5 break-words">{renderMentions(c.content, onMentionClick)}</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 ml-1">{ago(c.createdAt)}</p>
            </div>
        </div>
    );
}

// ─── POST MODAL ───────────────────────────────────────────────────────────────
function PostModal({ post, onClose, onLike, onComment, onPin, pinnedIds, currentUser, members = [] }) {
    const [txt, setTxt] = useState("");
    const [memberName, setMemberName] = useState(null);
    const liked = !!post.isLiked;
    const isPinned = pinnedIds.includes(post._id);
    const { bg } = avatarColor(post.author.full_name);

    const submit = () => {
        if (!txt.trim()) return;
        onComment(post._id, txt.trim());
        setTxt("");
    };

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 z-[300] bg-[#0F1C80]/10 backdrop-blur-sm" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[min(580px,94vw)] max-h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#DDE0FF]"
                style={{ animation: "modalIn .2s ease" }}>
                <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#0F1C80,#F38900)" }} />
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DDE0FF] shrink-0">
                    <Av name={post.author.full_name} size={40} avatar={post.author.avatar} />
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-[#0D1240] text-sm truncate">{post.author.full_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            <span className="font-semibold" style={{ color: bg }}>{post.author.course}</span>
                            <span className="mx-1">·</span>{ago(post.createdAt)}
                        </p>
                    </div>
                    <button onClick={() => onPin(post._id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${isPinned ? "bg-orange-50 text-orange-500" : "bg-[#EEF0FF] text-[#0F1C80]"}`}>
                        📌
                    </button>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-sm hover:bg-[#DDE0FF] transition-colors">
                        ✕
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    <div className="px-5 py-4">
                        {post.title && <h2 className="font-black text-[#0D1240] text-lg leading-snug mb-2 break-words">{post.title}</h2>}
                        {post.content && <p className="text-[13.5px] text-gray-600 leading-relaxed break-words">{renderMentions(post.content, setMemberName)}</p>}
                    </div>
                    {post.image && (
                        <div className="px-5 pb-4">
                            <img src={imgSrc(post.image)} alt="" className="w-full max-h-72 object-cover rounded-xl border border-[#EEF0FF]"
                                onError={e => e.target.parentElement.style.display = "none"} />
                        </div>
                    )}
                    {(post.likesCount > 0 || (post.comments?.length > 0)) && (
                        <div className="flex items-center justify-between px-5 py-2 border-t border-[#EEF0FF] text-xs text-gray-400">
                            {post.likesCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[9px]">❤️</span>
                                    {post.likesCount}
                                </span>
                            )}
                            {post.comments?.length > 0 && (
                                <span>{post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}</span>
                            )}
                        </div>
                    )}
                    <div className="flex border-t border-[#EEF0FF] px-2 py-1">
                        {[
                            { icon: liked ? "❤️" : "🤍", label: "Like", active: liked, cls: liked ? "text-red-500 hover:bg-red-50" : "text-gray-500 hover:bg-gray-50", fn: () => onLike(post._id) },
                            { icon: "💬", label: "Comment", active: false, cls: "text-gray-500 hover:bg-[#EEF0FF]", fn: null },
                            { icon: isPinned ? "📌" : "📍", label: isPinned ? "Unpin" : "Pin", active: isPinned, cls: isPinned ? "text-orange-500 hover:bg-orange-50" : "text-gray-500 hover:bg-gray-50", fn: () => onPin(post._id) },
                        ].map(({ icon, label, cls, fn }) => (
                            <button key={label} onClick={fn || undefined}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${cls}`}>
                                <span className="text-sm">{icon}</span>{label}
                            </button>
                        ))}
                    </div>
                    {post.commentsOpen && post.comments?.length > 0 && (
                        <div className="px-5 py-3 border-t border-[#EEF0FF] flex flex-col gap-3">
                            {post.comments.map(c => <Comment key={c._id} c={c} onMentionClick={setMemberName} allMembers={members} />)}
                        </div>
                    )}
                </div>
                {post.commentsOpen && (
                    <div className="px-4 py-3 border-t border-[#EEF0FF] flex gap-2 items-end shrink-0">
                        <Av name={currentUser?.full_name || ""} size={30} avatar={currentUser?.avatar} />
                        <MentionInput value={txt} onChange={setTxt} placeholder="Write a comment… Use @ to mention"
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} members={members} />
                        <button onClick={submit} disabled={!txt.trim()}
                            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${txt.trim() ? "bg-[#0F1C80] text-white hover:bg-[#1A2FA0]" : "bg-gray-100 text-gray-400 cursor-default"}`}>
                            Post
                        </button>
                    </div>
                )}
            </div>
            {memberName && <MemberPopup name={memberName} onClose={() => setMemberName(null)} allMembers={members} />}
        </>
    );
}

// ─── COMPOSE MODAL ────────────────────────────────────────────────────────────
function ComposeModal({ activeTab, onPost, onClose, currentUser, members = [] }) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [commentsOn, setCommentsOn] = useState(true);
    const [tab, setTab] = useState(activeTab === "all" ? "discussion" : activeTab);
    const fileRef = useRef(null);
    const ok = title.trim() || text.trim();

    const submit = () => {
        if (!ok) return;
        onPost({ title: title.trim(), text: text.trim(), imageFile: imgFile, commentsOpen: commentsOn, tab });
        onClose();
    };

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 z-[300] bg-[#0F1C80]/10 backdrop-blur-sm" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[min(540px,94vw)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#DDE0FF]"
                style={{ animation: "modalIn .2s ease" }}>
                <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#0F1C80,#F38900)" }} />
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#EEF0FF]">
                    <Av name={currentUser?.full_name || ""} size={40} avatar={currentUser?.avatar} />
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-[#0D1240] text-sm">{currentUser?.full_name}</p>
                        <p className="text-[11px] text-gray-400">Posting in <span className="text-[#F38900] font-semibold">Mashar Alumni Community</span></p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-sm hover:bg-[#DDE0FF] transition-colors">✕</button>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)"
                        className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400 font-medium" />
                    <MentionInput value={text} onChange={setText}
                        placeholder="What's on your mind? Use @ to mention someone…" rows={4} members={members} />
                    {img && (
                        <div className="relative inline-block max-w-full">
                            <img src={img} alt="" className="max-h-32 max-w-full rounded-xl border border-[#DDE0FF] object-cover" />
                            <button onClick={() => { setImg(null); setImgFile(null); }}
                                className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0F1C80] text-white rounded-full text-xs flex items-center justify-center hover:bg-[#1A2FA0]">✕</button>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Comments</span>
                        <button onClick={() => setCommentsOn(v => !v)}
                            className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${commentsOn ? "bg-[#0F1C80]" : "bg-gray-200"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-all ${commentsOn ? "left-[18px] bg-[#F38900]" : "left-0.5 bg-white"}`} />
                        </button>
                        <div className="ml-auto flex gap-2">
                            <button onClick={() => fileRef.current?.click()}
                                className="w-8 h-8 rounded-full border border-[#DDE0FF] bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-sm hover:bg-[#DDE0FF] transition-colors">
                                🖼️
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                                const f = e.target.files[0];
                                if (f) { setImg(URL.createObjectURL(f)); setImgFile(f); }
                            }} />
                        </div>
                    </div>
                    <select value={tab} onChange={e => setTab(e.target.value)}
                        className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors">
                        <option value="discussion">💬 Discussion</option>
                        <option value="featured">⭐ Featured</option>
                        <option value="announcements">📢 Announcement</option>
                    </select>
                </div>
                <div className="flex gap-2 px-5 pb-5">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#DDE0FF] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={submit} disabled={!ok}
                        className={`flex-[2] py-2.5 rounded-xl text-sm font-black transition-all relative overflow-hidden ${ok ? "bg-[#0F1C80] text-white shadow-lg shadow-[#0F1C80]/20 hover:bg-[#1A2FA0]" : "bg-gray-100 text-gray-400 cursor-default"}`}>
                        {ok && <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#F38900] rounded-r-xl" />}
                        Publish Post
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onOpen, onPin, pinnedIds, allMembers = [] }) {
    if (!post || !post.author || !post.author.full_name) return null;

    const liked = !!post.isLiked;
    const isPinned = pinnedIds.includes(post._id);
    const { bg } = avatarColor(post.author.full_name);
    const hasComments = post.comments?.length > 0;
    const hasEngagement = post.likesCount > 0 || hasComments;
    const [memberName, setMemberName] = useState(null);

    const tabBadge = {
        featured: <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">⭐ Featured</span>,
        announcements: <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">📢 Announcement</span>,
    }[post.tab];

    // ✅ Add pending status badge for user's own posts
    const { user } = useAuth();
    const isOwnPost = user && post.author._id === user._id;
    const pendingBadge = isOwnPost && post.approvalStatus === "pending" ?
        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">⏳ Pending Approval</span> : null;
    const rejectedBadge = isOwnPost && post.approvalStatus === "rejected" ?
        <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">❌ Rejected</span> : null;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#DDE0FF] transition-all duration-200 overflow-hidden group">
            <div className="flex items-start gap-3 px-4 pt-4 pb-0">
                <Av name={post.author.full_name} size={42} avatar={post.author.avatar} />
                <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-[#0D1240] text-sm leading-none">{post.author.full_name}</span>
                        {isPinned && <span className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">📌 Pinned</span>}
                        {pendingBadge}
                        {rejectedBadge}
                        {tabBadge}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                        <span className="font-semibold" style={{ color: bg }}>{post.author.course}</span>
                        <span>·</span>
                        <span>{ago(post.createdAt)}</span>
                        {!post.commentsOpen && <span className="text-gray-300">· 🔒</span>}
                    </div>
                </div>
                <button onClick={e => { e.stopPropagation(); onPin(post._id); }}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${isPinned ? "text-orange-400 bg-orange-50" : "text-gray-300 hover:text-gray-500 hover:bg-gray-50"}`}>
                    {isPinned ? "📌" : "📍"}
                </button>
            </div>
            <div onClick={() => onOpen(post)} className="cursor-pointer px-4 pt-3 pb-2">
                {post.title && <p className="font-black text-[#0D1240] text-[15px] leading-snug mb-2 break-words">{post.title}</p>}
                {post.content && (
                    <p className="text-[13.5px] text-gray-600 leading-relaxed break-words mb-2 line-clamp-4">
                        {renderMentions(post.content, setMemberName)}
                    </p>
                )}
                {post.image && (
                    <div className="mt-1 mb-2 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                        <img src={imgSrc(post.image)} alt=""
                            className="w-full object-cover max-h-80"
                            onError={e => e.target.parentElement.style.display = "none"} />
                    </div>
                )}
            </div>
            {hasEngagement && (
                <div className="flex items-center justify-between px-4 py-1.5 text-xs text-gray-400 border-t border-slate-50">
                    {post.likesCount > 0 ? (
                        <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[11px]">❤️</span>
                            {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
                        </span>
                    ) : <span />}
                    {hasComments && (
                        <button onClick={() => onOpen(post)} className="hover:underline hover:text-[#0F1C80] transition-colors">
                            {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
                        </button>
                    )}
                </div>
            )}
            <div className="flex border-t border-slate-100 px-2 py-1">
                <button onClick={e => { e.stopPropagation(); onLike(post._id); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold transition-colors ${liked ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-gray-500 hover:bg-gray-50"}`}>
                    <span className="text-base">{liked ? "❤️" : "🤍"}</span> Like
                </button>
                <button onClick={e => { e.stopPropagation(); onOpen(post); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold text-gray-500 hover:bg-[#EEF0FF] hover:text-[#0F1C80] transition-colors">
                    <span className="text-base">💬</span> Comment
                </button>
            </div>
            {memberName && <MemberPopup name={memberName} onClose={() => setMemberName(null)} allMembers={allMembers} />}
        </div>
    );
}

// ─── BANNER ───────────────────────────────────────────────────────────────────
function Banner({ total, memberCount, onCompose, userName }) {
    return (
        <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#DDE0FF]"
            style={{ background: "linear-gradient(135deg,#EEF0FF 0%,#E5E8FF 55%,#FFF4E0 100%)" }}>

            {/* ── LEFT gradient border line ── */}
            <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 4, borderRadius: "4px 0 0 4px",
                background: "linear-gradient(to bottom,#0F1C80,#F38900)",
                zIndex: 2,
            }} />

            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border-2 border-[#0F1C80]/5 pointer-events-none" />
            <div className="absolute right-14 -bottom-8 w-28 h-28 rounded-full bg-[#F38900]/5 pointer-events-none" />

            <div className="relative flex items-center justify-between gap-4 px-8 py-6">
                <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 bg-[#0F1C80]/8 border border-[#0F1C80]/15 rounded-full px-3 py-1 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F1C80]" />
                        <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px]">Mashar Alumni Network</span>
                    </div>
                    <h1 className="font-black text-[#0D1240] text-2xl leading-tight mb-2">
                        Welcome back, <span className="text-[#F38900]">{userName?.split(" ")[0] || "there"} 👋</span>
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed whitespace-nowrap mb-4 hidden sm:block">
                        Connect, share your journey, and grow together.
                    </p>
                    <div className="flex gap-5 flex-wrap">
                        {[{ n: memberCount, l: "Members" }, { n: total, l: "Posts" }].map(({ n, l }) => (
                            <div key={l}>
                                <p className="text-xl font-black text-[#0F1C80] leading-none">{n}</p>
                                <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA card — white bg, orange button ── */}
                <div className="hidden md:flex shrink-0 flex-col items-center text-center bg-white rounded-2xl border border-[#DDE0FF] shadow-sm p-4 w-40">
                    <span className="text-2xl mb-1.5">✍️</span>
                    <p className="text-xs font-black text-[#0D1240] mb-1 leading-tight">Share with the<br />community</p>
                    <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">Post an update or celebrate a win.</p>
                    <button onClick={onCompose}
                        className="w-full py-2 rounded-xl text-xs font-black text-white transition-all hover:scale-105 hover:opacity-90"
                        style={{ background: "navy", boxShadow: "0 4px 14px rgba(243,137,0,.3)" }}>
                        ✏️ New Post
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── LEFT SIDEBAR ─────────────────────────────────────────────────────────────
function LeftBar({ tab, setTab, cnt, memberCount }) {
    return (
        <div className="bg-white rounded-2xl border border-[#DDE0FF] p-2.5 shadow-sm">
            <p className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px] px-2.5 py-1.5 opacity-50">Channels</p>
            {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-left mb-0.5 transition-all ${tab === t.key ? "bg-[#0F1C80] text-white font-bold shadow-sm shadow-[#0F1C80]/20" : "text-gray-600 hover:bg-[#EEF0FF]"}`}>
                    <span className="text-sm">{t.icon}</span>
                    {t.label}
                    {t.key === "announcements" && tab !== "announcements" && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-[#F38900] shrink-0" />
                    )}
                </button>
            ))}
            <div className="h-px bg-[#DDE0FF] my-2 mx-1" />
            <div className="px-2.5 pb-1">
                <p className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px] opacity-50 mb-2">Community</p>
                {[{ l: "Members", v: memberCount }, { l: "Posts", v: cnt }].map(({ l, v }) => (
                    <div key={l} className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-400">{l}</span>
                        <span className="text-xs font-black text-[#0F1C80]">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────
function RightBar({ pinnedPosts, topMembers = [] }) {
    const allPinned = [...pinnedPosts];
    const accentMap = { blue: "bg-[#EEF0FF] border-[#DDE0FF]", orange: "bg-[#FFF4E0] border-[#FFE4B0]", green: "bg-emerald-50 border-emerald-200" };

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-[#DDE0FF] overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#EEF0FF]">
                    <div className="w-0.5 h-4 rounded-full" style={{ background: "linear-gradient(#0F1C80,#F38900)" }} />
                    <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1px] opacity-60">📌 Pinned</span>
                </div>
                <div className="p-2">
                    {allPinned.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">No pinned posts yet.</p>
                    )}
                    {allPinned.map((p, i) => (
                        <div key={p._id}>
                            <div className="flex items-start gap-2.5 px-2 py-2 rounded-xl cursor-pointer hover:bg-[#EEF0FF] transition-colors">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm border shrink-0 ${accentMap[p.accent] || accentMap.blue}`}>
                                    {p.icon || "📌"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#0D1240] leading-snug break-words">{p.title || p.content?.slice(0, 40)}</p>
                                    <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5 line-clamp-2">{p.text || p.content}</p>
                                </div>
                            </div>
                            {i < allPinned.length - 1 && <div className="h-px bg-slate-50 mx-2" />}
                        </div>
                    ))}
                </div>
            </div>

            {topMembers.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#DDE0FF] overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#EEF0FF]">
                        <div className="w-0.5 h-4 rounded-full" style={{ background: "linear-gradient(#0F1C80,#F38900)" }} />
                        <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1px] opacity-60">👥 Members</span>
                    </div>
                    <div className="p-2">
                        {topMembers.slice(0, 5).map((m) => (
                            <div key={m._id} className="flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer hover:bg-[#EEF0FF] transition-colors">
                                <div className="relative shrink-0">
                                    <Av name={m.full_name} size={30} avatar={m.avatar} />
                                    {m.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#0D1240] truncate">{m.full_name}</p>
                                    <p className="text-[10px] text-gray-400">{m.course}</p>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${m.isOnline ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                                    {m.isOnline ? "Online" : "Offline"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CommunityFeed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState("all");
    const [open, setOpen] = useState(null);
    const [compose, setCompose] = useState(false);
    const [pinnedIds, setPinnedIds] = useState(() => {
        try { return JSON.parse(localStorage.getItem(PINNED_IDS_KEY) || "[]"); } catch { return []; }
    });
    const members = useMembersCache();

    useEffect(() => {
        API.get("/alumni/posts", { params: { tab } })
            .then(r => setPosts(r.data.data || []))
            .catch(console.error);
    }, [tab]);

    const togglePin = useCallback((id) => {
        setPinnedIds(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            try { localStorage.setItem(PINNED_IDS_KEY, JSON.stringify(next)); } catch { }
            return next;
        });
    }, []);

    const addPost = async ({ title, text, imageFile, commentsOpen, tab: t }) => {
        if (!user) return;
        try {
            const fd = new FormData();
            if (title) fd.append("title", title);
            if (text) fd.append("content", text);
            fd.append("commentsOpen", String(commentsOpen));
            fd.append("tab", t);
            if (imageFile) fd.append("image", imageFile);
            const res = await API.post("/alumni/posts", fd, { headers: { "Content-Type": "multipart/form-data" } });
            const newPost = res.data.data;
            newPost.author = { _id: user._id, full_name: user.full_name, course: user.course };
            newPost.comments = [];
            newPost.likesCount = 0;
            newPost.isLiked = false;
            if (!newPost.image && imageFile) newPost.image = URL.createObjectURL(imageFile);
            setPosts(p => [newPost, ...p]);
        } catch (err) { console.error(err); }
    };

    const like = async id => {
        if (!user) return;
        try {
            const post = posts.find(p => p._id === id);
            await API.post(`/alumni/posts/${id}/like`, {
                postOwnerId: post?.author?._id,
                likerName: user.full_name,
            });
            const f = p => p._id !== id ? p : { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) };
            setPosts(p => p.map(f));
            setOpen(p => p ? f(p) : p);
        } catch (err) { console.error(err); }
    };

    const cmt = async (id, txt) => {
        if (!user) return;
        try {
            const res = await API.post(`/alumni/posts/${id}/comment`, { content: txt });
            const newC = { ...res.data.data, author: { _id: user._id, full_name: user.full_name, course: user.course } };
            const f = p => p._id !== id ? p : { ...p, comments: [...(p.comments || []), newC], commentsCount: (p.commentsCount || 0) + 1 };
            setPosts(p => p.map(f));
            setOpen(p => p ? f(p) : p);
        } catch (err) { console.error(err); }
    };

    const filtered = posts.filter(p => tab === "all" || p.tab === tab);
    const pinnedPostObjects = posts.filter(p => pinnedIds.includes(p._id)).map(p => ({
        _id: p._id, title: p.title, content: p.content, icon: "📌", accent: "blue"
    }));

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                * { font-family: 'DM Sans', sans-serif; }
                h1 { font-family: 'Sora', sans-serif; }
                @keyframes modalIn { from { opacity:0; transform:translate(-50%,-48%) } to { opacity:1; transform:translate(-50%,-50%) } }
                .line-clamp-4 { display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }
            `}</style>

            <div className="w-full max-w-full overflow-x-hidden">
                <Banner total={posts.length} memberCount={members.length} onCompose={() => setCompose(true)} userName={user?.full_name} />

                {/* Mobile tab pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3 lg:hidden scrollbar-none">
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 border transition-all ${tab === t.key ? "bg-[#0F1C80] text-white border-[#0F1C80]" : "bg-white text-gray-600 border-[#DDE0FF] hover:border-[#0F1C80]"}`}>
                            <span className="text-sm">{t.icon}</span>{t.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_252px] gap-4 items-start">

                    <div className="hidden lg:block sticky top-4">
                        <LeftBar tab={tab} setTab={setTab} cnt={posts.length} memberCount={members.length} />
                    </div>

                    <div className="min-w-0">
                        {/* ── Feed header — NAVY "New Post" button ── */}
                        <div className="flex items-center justify-between mb-3 gap-2">
                            <div>
                                <h2 className="font-black text-[#0D1240] text-lg leading-none">
                                    {TABS.find(t => t.key === tab)?.icon} {TABS.find(t => t.key === tab)?.label}
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">{filtered.length} post{filtered.length !== 1 ? "s" : ""}</p>
                            </div>
                            <button onClick={() => setCompose(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold transition-colors shrink-0 relative overflow-hidden hover:opacity-90"
                                style={{ background: "#0F1C80", boxShadow: "0 4px 14px rgba(15,28,128,.25)" }}>
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#F38900] rounded-r-full" />
                                <span className="ml-1">✏️ New Post</span>
                            </button>
                        </div>

                        {/* Compose prompt bar */}
                        <div onClick={() => setCompose(true)}
                            className="flex items-center gap-3 bg-white rounded-2xl border border-[#DDE0FF] px-4 py-3 mb-3 cursor-pointer hover:shadow-sm transition-shadow">
                            <Av name={user?.full_name || ""} size={34} />
                            <div className="flex-1 min-w-0 bg-[#EEF0FF] rounded-full px-4 py-2 text-sm text-gray-400 truncate">
                                What's on your mind? Use @ to mention someone…
                            </div>
                            <span className="text-lg shrink-0">🖼️</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {filtered.length === 0 ? (
                                <div className="text-center py-14 bg-white rounded-2xl border border-[#DDE0FF]">
                                    <p className="text-3xl mb-2">📭</p>
                                    <p className="font-bold text-[#0D1240] text-sm">No posts here yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Be the first to post!</p>
                                </div>
                            ) : filtered
                                .filter(p => p && p.author && p.author.full_name).map(p => (
                                    <PostCard key={p._id} post={p} onLike={like} onOpen={setOpen} onPin={togglePin} pinnedIds={pinnedIds} allMembers={members} />
                                ))}
                        </div>

                        <div className="mt-4 lg:hidden">
                            <RightBar pinnedPosts={pinnedPostObjects} topMembers={members} />
                        </div>
                    </div>

                    <div className="hidden lg:block sticky top-4">
                        <RightBar pinnedPosts={pinnedPostObjects} topMembers={members} />
                    </div>
                </div>
            </div>

            {open && <PostModal post={open} onClose={() => setOpen(null)} onLike={like} onComment={cmt} onPin={togglePin} pinnedIds={pinnedIds} currentUser={user} members={members} />}
            {compose && <ComposeModal activeTab={tab} onPost={addPost} onClose={() => setCompose(false)} currentUser={user} members={members} />}
        </>
    );
}