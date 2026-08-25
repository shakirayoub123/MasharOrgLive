import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Plus, Pencil, Trash2, Eye, EyeOff, Save, X,
    AtSign, Sparkles, CheckCircle, AlertTriangle,
    Search, Calendar, Award, UserPlus, BookOpen,
    Trophy, Bell, PartyPopper, GraduationCap, Briefcase, Heart
} from "lucide-react";

// ── Announcement Types ──────────────────────────────────────────────
const ANNOUNCEMENT_TYPES = [
    { id: "welcome", label: "Welcome", icon: PartyPopper, color: "#10b981", bg: "#ecfdf5" },
    { id: "certificate", label: "Certificate", icon: Award, color: "#f59e0b", bg: "#fffbeb" },
    { id: "course", label: "Course", icon: BookOpen, color: "#6366f1", bg: "#eef2ff" },
    { id: "achievement", label: "Achievement", icon: Trophy, color: "#ef4444", bg: "#fef2f2" },
    { id: "job", label: "New Role", icon: Briefcase, color: "#0ea5e9", bg: "#f0f9ff" },
    { id: "graduation", label: "Graduation", icon: GraduationCap, color: "#8b5cf6", bg: "#f5f3ff" },
    { id: "shoutout", label: "Shoutout", icon: Heart, color: "#ec4899", bg: "#fdf2f8" },
    { id: "general", label: "Announcement", icon: Bell, color: "#64748b", bg: "#f8fafc" },
];

const TYPE_TEMPLATES = {
    welcome: (n) => `We're thrilled to welcome ${n || "@alumni"} to the Mashar family! 🎉 We're so glad to have you here and can't wait to see you grow with our community.`,
    certificate: (n) => `Huge congratulations to ${n || "@alumni"} for earning their certificate! 🏆 This is a testament to your hard work and dedication. We're incredibly proud of you!`,
    course: (n) => `Shoutout to ${n || "@alumni"} for enrolling in a new course! 📚 Your commitment to continuous learning is truly inspiring. Keep pushing forward!`,
    achievement: (n) => `We're celebrating ${n || "@alumni"} for an incredible milestone! 🌟 Your dedication and perseverance have truly paid off. Congratulations!`,
    job: (n) => `Exciting news — ${n || "@alumni"} has just landed a new role! 💼 This is a well-deserved milestone. Wishing you all the best in this new chapter!`,
    graduation: (n) => `Congratulations to ${n || "@alumni"} on their graduation! 🎓 What an incredible journey — the entire Mashar community is so proud of you.`,
    shoutout: (n) => `A big shoutout to ${n || "@alumni"} for being an amazing part of our community! ❤️ Your presence and contributions make Mashar a better place for everyone.`,
    general: () => `We have an important update for the Mashar community. Please read on for the details...`,
};

const EMPTY_FORM = { type: "welcome", title: "", body: "", taggedAlumni: [], status: "published" };

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ── Main Component ──────────────────────────────────────────────────
export default function AdminSpotlight() {
    const { adminToken } = useAuth();
    const [spotlights, setSpotlights] = useState([]);
    const [alumniList, setAlumniList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [alumniSearch, setAlumniSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => { fetchSpotlights(); fetchAlumniList(); }, [adminToken]);

    useEffect(() => {
        const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchSpotlights = async () => {
        try {
            const res = await axios.get("/api/admin/spotlights", { headers: { Authorization: `Bearer ${adminToken}` } });
            setSpotlights(res.data.spotlights || []);
        } catch { toast.error("Failed to load announcements"); }
        finally { setLoading(false); }
    };

    const fetchAlumniList = async () => {
        try {
            const res = await axios.get("/api/admin/alumni/list", { headers: { Authorization: `Bearer ${adminToken}` } });
            setAlumniList(res.data.alumni || res.data.data || []);
        } catch { console.error("Failed to load alumni"); }
    };

    const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
    const openEdit = (s) => {
        setForm({ type: s.type || "general", title: s.title || "", body: s.body || s.quote || "", taggedAlumni: s.taggedAlumni || [], status: s.status || (s.active ? "published" : "draft") });
        setEditingId(s._id); setShowForm(true);
    };

    const applyTemplate = (type, tagged) => {
        const first = tagged?.[0]?.name?.split(" ")[0];
        const mention = first ? `@${first}` : "";
        return TYPE_TEMPLATES[type]?.(mention) || "";
    };

    const handleTypeSelect = (typeId) => {
        setForm(f => ({ ...f, type: typeId, title: ANNOUNCEMENT_TYPES.find(t => t.id === typeId)?.label || "", body: applyTemplate(typeId, f.taggedAlumni) }));
    };

    const toggleTag = (alumni) => {
        const id = alumni._id || alumni.id;
        const already = form.taggedAlumni.find(a => (a.id || a._id) === id);
        setForm(f => {
            const updated = already
                ? f.taggedAlumni.filter(a => (a.id || a._id) !== id)
                : [...f.taggedAlumni, { id, name: alumni.full_name || alumni.name }];
            return { ...f, taggedAlumni: updated, body: applyTemplate(f.type, updated) };
        });
        setAlumniSearch(""); setShowDropdown(false);
    };

    const handleSave = async () => {
        if (!form.title || !form.body) { toast.error("Title and content are required"); return; }
        setSaving(true);
        try {
            const payload = { type: form.type, title: form.title, body: form.body, quote: form.body, taggedAlumni: form.taggedAlumni.map(a => a.id || a._id), active: form.status === "published", status: form.status };
            if (editingId) {
                await axios.put(`/api/admin/spotlights/${editingId}`, payload, { headers: { Authorization: `Bearer ${adminToken}` } });
                toast.success("Announcement updated");
            } else {
                await axios.post("/api/admin/spotlights", payload, { headers: { Authorization: `Bearer ${adminToken}` } });
                toast.success("Announcement published!");
            }
            setShowForm(false); fetchSpotlights();
        } catch (err) { toast.error(err?.response?.data?.message || "Failed to save"); }
        finally { setSaving(false); }
    };

    const handleToggle = async (s) => {
        try {
            await axios.put(`/api/admin/spotlights/${s._id}`, { ...s, active: !s.active, status: !s.active ? "published" : "draft" }, { headers: { Authorization: `Bearer ${adminToken}` } });
            toast.success(!s.active ? "Published!" : "Set to draft");
            fetchSpotlights();
        } catch { toast.error("Failed to update"); }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/spotlights/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
            toast.success("Deleted"); setDeleteConfirm(null); fetchSpotlights();
        } catch { toast.error("Failed to delete"); }
    };

    const filtered = alumniList.filter(a => (a.full_name || a.name || "").toLowerCase().includes(alumniSearch.toLowerCase()) || (a.email || "").toLowerCase().includes(alumniSearch.toLowerCase()));
    const published = spotlights.filter(s => s.active || s.status === "published");
    const drafts = spotlights.filter(s => !s.active && s.status !== "published");

    return (
        <div className="space-y-8 pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Announcements</h1>
                    <p className="text-slate-500 mt-1 text-sm">Welcome alumni, celebrate achievements, share community updates.</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 active:scale-[0.98] transition-all">
                    <Plus size={16} /> New Announcement
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total", val: spotlights.length, cls: "bg-indigo-50 text-indigo-600", icon: <Sparkles size={15} /> },
                    { label: "Published", val: published.length, cls: "bg-emerald-50 text-emerald-600", icon: <CheckCircle size={15} /> },
                    { label: "Drafts", val: drafts.length, cls: "bg-amber-50 text-amber-600", icon: <Eye size={15} /> },
                ].map(s => (
                    <div key={s.label} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.cls}`}>{s.icon}</div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                            <p className="text-2xl font-black text-slate-800">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4 animate-pulse">{[1, 2, 3].map(i => <div key={i} className="h-36 bg-slate-100 rounded-3xl" />)}</div>
            ) : spotlights.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center py-24 text-center">
                    <Sparkles size={40} className="text-slate-200 mb-4" />
                    <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">No announcements yet</p>
                    <p className="text-slate-300 text-xs mt-1">Create your first one to welcome or celebrate alumni.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {spotlights.map(s => (
                        <AnnouncementCard key={s._id} item={s}
                            onEdit={() => openEdit(s)}
                            onToggle={() => handleToggle(s)}
                            onDelete={() => setDeleteConfirm(s._id)}
                        />
                    ))}
                </div>
            )}

            {/* ── Slide-in Form Panel ── */}
            {showForm && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                    <div className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
                        style={{ animation: "slideIn 0.3s cubic-bezier(.16,1,.3,1)" }}>
                        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{editingId ? "Edit Announcement" : "New Announcement"}</h3>
                                <p className="text-slate-400 text-xs mt-0.5">Alumni will see this on their dashboard once published.</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={18} /></button>
                        </div>

                        {/* Two-column body */}
                        <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">

                            {/* Left: Form */}
                            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 md:overflow-y-auto p-6 space-y-5">

                                {/* Type Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ANNOUNCEMENT_TYPES.map(t => {
                                            const Icon = t.icon;
                                            const active = form.type === t.id;
                                            return (
                                                <button key={t.id} onClick={() => handleTypeSelect(t.id)}
                                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border text-left transition-all duration-150 ${active ? "border-indigo-300 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                                                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                                                        style={{ background: active ? t.bg : "#f1f5f9", color: t.color }}>
                                                        <Icon size={14} />
                                                    </div>
                                                    <p className={`text-xs font-bold truncate ${active ? "text-indigo-700" : "text-slate-600"}`}>{t.label}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Mention Alumni */}
                                <div className="space-y-2" ref={dropdownRef}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><AtSign size={11} /> Mention Alumni</label>

                                    {form.taggedAlumni.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {form.taggedAlumni.map(a => (
                                                <span key={a.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border"
                                                    style={{ background: avatarColor(a.name) + "12", borderColor: avatarColor(a.name) + "30", color: avatarColor(a.name) }}>
                                                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-black flex-shrink-0"
                                                        style={{ background: avatarColor(a.name) }}>
                                                        {a.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    {a.name?.split(" ")[0]}
                                                    <button onClick={() => toggleTag(a)} className="opacity-50 hover:opacity-100 ml-0.5"><X size={10} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="relative">
                                        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                            <Search size={13} className="text-slate-400 flex-shrink-0" />
                                            <input type="text" value={alumniSearch}
                                                onChange={e => { setAlumniSearch(e.target.value); setShowDropdown(true); }}
                                                onFocus={() => setShowDropdown(true)}
                                                placeholder="Search by name or email..."
                                                className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-300" />
                                        </div>
                                        {showDropdown && filtered.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-44 overflow-y-auto">
                                                {filtered.slice(0, 8).map(a => {
                                                    const id = a._id || a.id;
                                                    const tagged = form.taggedAlumni.some(t => (t.id || t._id) === id);
                                                    const color = avatarColor(a.full_name || a.name || "");
                                                    return (
                                                        <button key={id} onClick={() => toggleTag(a)}
                                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${tagged ? "bg-indigo-50/30" : ""}`}>
                                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                                style={{ background: color }}>
                                                                {(a.full_name || a.name || "?").charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-slate-800 truncate">{a.full_name || a.name}</p>
                                                                <p className="text-[11px] text-slate-400 truncate">{a.email}</p>
                                                            </div>
                                                            {tagged && <CheckCircle size={13} className="text-indigo-500 flex-shrink-0" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</label>
                                    <input type="text" value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="e.g. Welcome to the Family!"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-300" />
                                </div>

                                {/* Body */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                                    <textarea value={form.body}
                                        onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                                        rows={5} placeholder="Write your message here..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-300 resize-none" />
                                </div>

                                {/* Status toggle */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{form.status === "published" ? "Published" : "Draft"}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{form.status === "published" ? "Visible to all alumni" : "Only admins can see"}</p>
                                    </div>
                                    <button onClick={() => setForm(f => ({ ...f, status: f.status === "published" ? "draft" : "published" }))}
                                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.status === "published" ? "bg-indigo-600" : "bg-slate-200"}`}>
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.status === "published" ? "translate-x-6" : "translate-x-1"}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Right: Live Preview */}
                            <div className="w-full md:w-1/2 bg-slate-50/60 md:overflow-y-auto p-6 flex flex-col gap-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</p>
                                <AnnouncementPreview form={form} />
                                <p className="text-xs text-slate-400 text-center mt-auto pt-4 border-t border-slate-200 font-medium">
                                    This is how alumni will see the post
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 border-t border-slate-100 bg-white flex gap-3 flex-shrink-0">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-60">
                                <Save size={15} />
                                {saving ? "Saving..." : editingId ? "Update" : "Publish"}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Modal */}
            {deleteConfirm && (
                <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setDeleteConfirm(null)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
                        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-rose-600" /></div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Announcement?</h3>
                        <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-rose-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-500 transition-all">Delete</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ── Announcement Card ───────────────────────────────────────────────
function AnnouncementCard({ item: s, onEdit, onToggle, onDelete }) {
    const isPublished = s.active || s.status === "published";
    const typeInfo = ANNOUNCEMENT_TYPES.find(t => t.id === s.type) || ANNOUNCEMENT_TYPES[7];
    const Icon = typeInfo.icon;
    const tagged = s.taggedAlumni || [];

    return (
        <div className={`bg-white rounded-3xl border overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 ${isPublished ? "border-slate-200" : "border-dashed border-slate-200 opacity-65"}`}>
            {/* Colored left accent */}
            <div className="flex">
                <div className="w-1 flex-shrink-0 rounded-l-3xl" style={{ background: typeInfo.color }} />
                <div className="flex-1 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: typeInfo.bg, color: typeInfo.color }}>
                            <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg"
                                            style={{ background: typeInfo.bg, color: typeInfo.color }}>{typeInfo.label}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${isPublished ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                            {isPublished ? "● Live" : "○ Draft"}
                                        </span>
                                        {s.createdAt && (
                                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                <Calendar size={10} />{new Date(s.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-[15px]">{s.title || "Untitled"}</h3>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{s.body || s.quote}</p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={onToggle} className="p-2 rounded-xl text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-colors" title={isPublished ? "Set to draft" : "Publish"}>
                                        {isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button onClick={onEdit} className="p-2 rounded-xl text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-colors"><Pencil size={14} /></button>
                                    <button onClick={onDelete} className="p-2 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            {tagged.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1">Featuring</span>
                                    {tagged.map((a, i) => {
                                        const name = a.name || a.full_name || String(a);
                                        const color = avatarColor(name);
                                        return (
                                            <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold"
                                                style={{ background: color + "15", color }}>
                                                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-black"
                                                    style={{ background: color }}>{name.charAt(0).toUpperCase()}</div>
                                                @{name.split(" ")[0]}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Live Preview ────────────────────────────────────────────────────
function AnnouncementPreview({ form }) {
    const typeInfo = ANNOUNCEMENT_TYPES.find(t => t.id === form.type) || ANNOUNCEMENT_TYPES[7];
    const Icon = typeInfo.icon;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${typeInfo.color}, ${typeInfo.color}55)` }} />
            <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: typeInfo.bg, color: typeInfo.color }}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg"
                            style={{ background: typeInfo.bg, color: typeInfo.color }}>{typeInfo.label}</span>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                            <Calendar size={9} />{new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                </div>

                <h3 className="font-bold text-slate-800 text-[15px] mb-2 leading-snug">
                    {form.title || <span className="text-slate-300 font-normal italic text-sm">Title will appear here...</span>}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {form.body || <span className="text-slate-300 italic">Your message will appear here...</span>}
                </p>

                {form.taggedAlumni.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1">Featuring</span>
                        {form.taggedAlumni.map(a => {
                            const color = avatarColor(a.name);
                            return (
                                <span key={a.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold"
                                    style={{ background: color + "15", color }}>
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-black"
                                        style={{ background: color }}>{a.name?.charAt(0)?.toUpperCase()}</div>
                                    @{a.name?.split(" ")[0]}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}