import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Users, Star, GraduationCap, Lightbulb, HandHeart,
    ChevronDown, Check, X, Clock, Eye, Loader2,
    Search, RefreshCw, Mail, Calendar,
    AlertCircle, CheckCircle, XCircle, Trash2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ─── AUTH HOOK — same pattern as your original ────────────────────────────────
function useAdminAxios() {
    const { adminToken } = useAuth();
    const h = { Authorization: `Bearer ${adminToken}` };
    return {
        get: (url) => axios.get(`/api${url}`, { headers: h }),
        patch: (url, data) => axios.patch(`/api${url}`, data, { headers: h }),
        delete: (url) => axios.delete(`/api${url}`, { headers: h }),
    };
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const TYPES = [
    {
        id: "all",
        label: "All Submissions",
        icon: <Users size={16} />,
        color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF",
        endpoint: "/admin/engage/submissions",
    },
    {
        id: "mentor",
        label: "Mentor Applications",
        icon: <GraduationCap size={16} />,
        color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF",
        endpoint: "/admin/engage/mentor-applications",
        fields: [
            { key: "full_name", label: "Full Name" },
            { key: "cohort", label: "Cohort / Year" },
            { key: "specialisation", label: "Specialisation" },
            { key: "icf_level", label: "ICF Level" },
            { key: "experience_years", label: "Experience" },
            { key: "mentoring_capacity", label: "Mentee Capacity" },
            { key: "motivation", label: "Motivation" },
            { key: "availability", label: "Availability" },
        ],
    },
    {
        id: "volunteer",
        label: "Volunteer Applications",
        icon: <HandHeart size={16} />,
        color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5",
        endpoint: "/admin/engage/volunteer-applications",
        fields: [
            { key: "full_name", label: "Full Name" },
            { key: "email", label: "Email" },
            { key: "event_types", label: "Event Preference" },
            { key: "role_preference", label: "Role Preference" },
            { key: "experience", label: "Experience" },
            { key: "availability", label: "Availability" },
            { key: "motivation", label: "Motivation" },
        ],
    },
    {
        id: "contribute",
        label: "Expertise Contributions",
        icon: <Lightbulb size={16} />,
        color: "#6B46C1", bg: "#FAF5FF", border: "#E9D8FD",
        endpoint: "/admin/engage/contributions",
        fields: [
            { key: "title", label: "Title" },
            { key: "type", label: "Content Type" },
            { key: "summary", label: "Summary" },
            { key: "target_audience", label: "Target Audience" },
            { key: "format", label: "Format" },
            { key: "timeline", label: "Timeline" },
            { key: "notes", label: "Notes" },
        ],
    },
    {
        id: "success-story",
        label: "Success Stories",
        icon: <Star size={16} />,
        color: "#F38900", bg: "#FFF4E0", border: "#FFE4B0",
        endpoint: "/admin/engage/success-stories",
        fields: [
            { key: "full_name", label: "Full Name" },
            { key: "cohort", label: "Cohort / Year" },
            { key: "story_title", label: "Story Title" },
            { key: "story_type", label: "Story Type" },
            { key: "story", label: "Story" },
            { key: "consent", label: "Consent" },
        ],
    },
];

const STATUS_CFG = {
    pending: { label: "Pending", Icon: Clock, color: "#D97706", bg: "#FEF3C7", border: "#FDE68A" },
    approved: { label: "Approved", Icon: CheckCircle, color: "#059669", bg: "#D1FAE5", border: "#A7F3D0" },
    rejected: { label: "Rejected", Icon: XCircle, color: "#DC2626", bg: "#FEE2E2", border: "#FECACA" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function ago(d) {
    if (!d) return "—";
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function initials(n = "") { return (n || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
const AV_PAL = ["#0F1C80", "#F38900", "#6B46C1", "#2D8A4E", "#0B7285", "#C53030"];
function avColor(n = "") { return AV_PAL[(n.charCodeAt(0) || 0) % AV_PAL.length]; }
function getName(s) { return s.formData?.full_name || s.formData?.submitter_name || s.alumniName || "Unknown"; }
function getSub(s) { return s.formData?.specialisation || s.formData?.story_title || s.formData?.title || s.formData?.event_types || s.alumniEmail || "—"; }

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Av({ name, size = 36 }) {
    return (
        <div className="rounded-full flex items-center justify-center font-black text-white shrink-0"
            style={{ width: size, height: size, minWidth: size, background: avColor(name), fontSize: size * 0.34 }}>
            {initials(name)}
        </div>
    );
}

function StatusBadge({ status }) {
    const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
    const { Icon } = cfg;
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border"
            style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
            <Icon size={10} />{cfg.label}
        </span>
    );
}

function TypePill({ typeId }) {
    const t = TYPES.find(x => x.id === typeId);
    if (!t || t.id === "all") return null;
    return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: t.color, background: t.bg, borderColor: t.border }}>
            {t.label}
        </span>
    );
}

function StatsCard({ label, value, Icon, color, bg, border, i = 0 }) {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4"
            style={{ borderColor: border, animation: `fadeUp .25s ease both`, animationDelay: `${i * 0.06}s` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon size={18} style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-black text-slate-800 leading-none">{value ?? "—"}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ sub, typeCfg, onClose, onUpdate }) {
    const api = useAdminAxios();
    const [note, setNote] = useState(sub.adminNote || "");
    const [updating, setUpdating] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const name = getName(sub);

    async function handleStatus(status) {
        setUpdating(status);
        try {
            await api.patch(`/admin/engage/submissions/${sub._id}/status`, { status, adminNote: note });
            toast.success(`Submission ${status}.`);
            onUpdate(sub._id, status, note);
            onClose();
        } catch { toast.error("Failed to update."); }
        finally { setUpdating(null); }
    }

    async function handleDelete() {
        if (!window.confirm("Delete this submission permanently?")) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/engage/submissions/${sub._id}`);
            toast.success("Submission deleted.");
            onUpdate(sub._id, null);
            onClose();
        } catch { toast.error("Failed to delete."); }
        finally { setDeleting(false); }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
                style={{ animation: "modalUp .2s ease" }}>

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Av name={name} size={42} />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{typeCfg.label}</p>
                            <h3 className="text-sm font-black text-slate-800 mt-0.5">{name}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <StatusBadge status={sub.status} />
                                <span className="text-[10px] text-slate-400">{ago(sub.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <X size={14} className="text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-4">

                    {/* Alumni profile */}
                    {sub.alumni && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alumni Profile</p>
                            {[
                                { icon: <Mail size={11} />, label: sub.alumni.email },
                                { icon: <GraduationCap size={11} />, label: sub.alumni.course },
                                { icon: <Calendar size={11} />, label: sub.alumni.completion_year ? `Class of ${sub.alumni.completion_year}` : null },
                            ].filter(r => r.label).map((r, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="text-slate-400">{r.icon}</span>{r.label}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submission fields */}
                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Details</p>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {(typeCfg.fields || []).map(({ key, label }) => {
                                const val = sub.formData?.[key];
                                if (!val) return null;
                                return (
                                    <div key={key} className="px-4 py-3 flex gap-3">
                                        <span className="text-[11px] font-bold text-slate-400 min-w-[130px] shrink-0 pt-0.5">{label}</span>
                                        <span className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{val}</span>
                                    </div>
                                );
                            })}
                            {/* Fallback for types with no field config */}
                            {!typeCfg.fields?.length && Object.entries(sub.formData || {}).filter(([, v]) => v).map(([k, v]) => (
                                <div key={k} className="px-4 py-3 flex gap-3">
                                    <span className="text-[11px] font-bold text-slate-400 min-w-[130px] shrink-0 pt-0.5 capitalize">{k.replace(/_/g, " ")}</span>
                                    <span className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin note */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Admin Note (optional)
                        </label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                            placeholder="Add a note for your records…"
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
                    <button onClick={handleDelete} disabled={deleting}
                        className="flex items-center gap-1.5 px-3 py-2.5 border border-red-100 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 text-sm font-bold rounded-xl transition-all">
                        {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                    <button onClick={onClose}
                        className="px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        Close
                    </button>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                        {sub.status !== "rejected" && (
                            <button onClick={() => handleStatus("rejected")} disabled={!!updating}
                                className="flex items-center gap-2 px-4 py-2.5 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold rounded-xl transition-all">
                                {updating === "rejected" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                                Reject
                            </button>
                        )}
                        {sub.status !== "approved" && (
                            <button onClick={() => handleStatus("approved")} disabled={!!updating}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200">
                                {updating === "approved" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                                Approve
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── SUBMISSION ROW ───────────────────────────────────────────────────────────
function SubRow({ sub, typeCfg, onView, onUpdate, index }) {
    const api = useAdminAxios();
    const [quickUpdating, setQuickUpdating] = useState(null);
    const name = getName(sub);
    const subtitle = getSub(sub);

    async function quickStatus(e, status) {
        e.stopPropagation();
        setQuickUpdating(status);
        try {
            await api.patch(`/admin/engage/submissions/${sub._id}/status`, { status });
            onUpdate(sub._id, status, "");
            toast.success(`Marked as ${status}.`);
        } catch { toast.error("Failed."); }
        finally { setQuickUpdating(null); }
    }

    return (
        <div onClick={() => onView(sub)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer overflow-hidden group"
            style={{ animation: "fadeUp .2s ease both", animationDelay: `${index * 0.04}s` }}>
            <div className="px-5 py-4 flex items-center gap-4">
                <Av name={name} size={40} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                        <StatusBadge status={sub.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {typeCfg.id === "all" && <TypePill typeId={sub.type} />}
                        <span className="text-[10px] text-slate-400">{ago(sub.createdAt)}</span>
                        {sub.alumni?.email && (
                            <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                                <Mail size={9} /> {sub.alumni.email}
                            </span>
                        )}
                    </div>
                </div>

                {/* Quick actions — show on hover */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {sub.status !== "approved" && (
                        <button onClick={e => quickStatus(e, "approved")} disabled={!!quickUpdating} title="Approve"
                            className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 flex items-center justify-center transition-all">
                            {quickUpdating === "approved" ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        </button>
                    )}
                    {sub.status !== "rejected" && (
                        <button onClick={e => quickStatus(e, "rejected")} disabled={!!quickUpdating} title="Reject"
                            className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all">
                            {quickUpdating === "rejected" ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                        </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); onView(sub); }} title="View details"
                        className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center transition-all">
                        <Eye size={12} />
                    </button>
                </div>

                <ChevronDown size={14} className="text-slate-300 shrink-0 -rotate-90 group-hover:text-indigo-400 transition-colors" />
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminEngagementSubmissions() {
    const api = useAdminAxios();
    const location = useLocation();
    const navigate = useNavigate();

    // ── Sync active tab from ?type= URL param (used by sidebar links) ─────────
    const urlType = new URLSearchParams(location.search).get("type") || "all";
    const [activeType, setActiveType] = useState(urlType);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewing, setViewing] = useState(null);

    // Keep activeType in sync when sidebar link changes the URL
    useEffect(() => {
        setActiveType(urlType);
        setSearch("");
        setStatusFilter("all");
    }, [urlType]);

    const [stats, setStats] = useState({});
    const typeCfg = TYPES.find(t => t.id === activeType) || TYPES[0];

    // ── Fetch stats separately so tab badge counts are always accurate ─────────
    async function loadStats() {
        try {
            const r = await api.get("/admin/engage/stats");
            setStats(r.data.data || {});
        } catch { }
    }

    async function load(type = activeType, silent = false) {
        silent ? setRefreshing(true) : setLoading(true);
        try {
            const endpoint = TYPES.find(t => t.id === type)?.endpoint || "/admin/engage/submissions";
            const r = await api.get(endpoint);
            setSubmissions(r.data.data || []);
        } catch {
            toast.error("Failed to load submissions.");
            setSubmissions([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => { loadStats(); }, []);
    useEffect(() => { load(); }, [activeType]);

    function handleUpdate(id, status, note) {
        if (status === null) {
            setSubmissions(prev => prev.filter(s => s._id !== id));
        } else {
            setSubmissions(prev => prev.map(s => s._id === id ? { ...s, status, adminNote: note } : s));
        }
        loadStats(); // keep badge counts in sync
    }

    const filtered = submissions.filter(s => {
        const q = search.toLowerCase();
        const name = getName(s).toLowerCase();
        const email = (s.alumni?.email || s.alumniEmail || "").toLowerCase();
        const matchType = activeType === "all" || s.type === activeType;
        const matchSearch = !q || name.includes(q) || email.includes(q);
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        return matchType && matchSearch && matchStatus;
    });

    const counts = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === "pending").length,
        approved: submissions.filter(s => s.status === "approved").length,
        rejected: submissions.filter(s => s.status === "rejected").length,
    };

    const viewingTypeCfg = viewing
        ? (TYPES.find(t => t.id === (viewing.type || activeType)) || typeCfg)
        : null;

    return (
        <>
            <style>{`
                @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
                @keyframes modalUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
            `}</style>

            <div className="space-y-6 pb-12">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Engagement Submissions</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Review and manage alumni applications, contributions, and success stories.
                        </p>
                    </div>
                    <button onClick={() => { load(activeType, true); loadStats(); }} disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold rounded-xl transition-all shrink-0">
                        <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard label="Total" value={counts.total} Icon={Users} color="#0F1C80" bg="#EEF0FF" border="#DDE0FF" i={0} />
                    <StatsCard label="Pending" value={counts.pending} Icon={Clock} color="#D97706" bg="#FEF3C7" border="#FDE68A" i={1} />
                    <StatsCard label="Approved" value={counts.approved} Icon={CheckCircle} color="#059669" bg="#D1FAE5" border="#A7F3D0" i={2} />
                    <StatsCard label="Rejected" value={counts.rejected} Icon={XCircle} color="#DC2626" bg="#FEE2E2" border="#FECACA" i={3} />
                </div>

                {/* Tabs + list card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Type tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-100">
                        {TYPES.map(t => (
                            <button key={t.id}
                                onClick={() => {
                                    setActiveType(t.id);
                                    setSearch("");
                                    setStatusFilter("all");
                                    navigate(t.id === "all" ? "/admin/engage" : `/admin/engage?type=${t.id}`, { replace: true });
                                }}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0 ${activeType === t.id
                                        ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
                                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    }`}>
                                <span className={activeType === t.id ? "text-indigo-600" : "text-slate-400"}>{t.icon}</span>
                                {t.label}
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeType === t.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {t.id === "all"
                                        ? (stats.overall?.total ?? counts.total)
                                        : (stats[t.id]?.total ?? 0)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search + filter */}
                    <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/30">
                        <div className="relative flex-1">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or email…"
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shrink-0">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Count bar */}
                    <div className="px-5 py-2.5 border-b border-slate-100">
                        <p className="text-[11px] text-slate-400 font-semibold">
                            Showing <span className="text-indigo-600 font-black">{filtered.length}</span> of {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                            {statusFilter !== "all" && <span className="ml-1">· filtered by <span className="font-black">{statusFilter}</span></span>}
                        </p>
                    </div>

                    {/* List */}
                    <div className="p-4 space-y-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 size={28} className="animate-spin text-indigo-400 mb-3" />
                                <p className="text-sm text-slate-400 font-medium">Loading submissions…</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <AlertCircle size={30} className="text-slate-200 mb-3" />
                                <p className="text-sm font-bold text-slate-400">No submissions found</p>
                                <p className="text-xs text-slate-300 mt-1">
                                    {search || statusFilter !== "all"
                                        ? "Try adjusting your filters."
                                        : "No alumni have submitted applications yet."}
                                </p>
                            </div>
                        ) : (
                            filtered.map((s, i) => (
                                <SubRow key={s._id} sub={s}
                                    typeCfg={activeType === "all" ? (TYPES.find(t => t.id === s.type) || TYPES[1]) : typeCfg}
                                    onView={setViewing}
                                    onUpdate={handleUpdate}
                                    index={i}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Detail modal */}
            {viewing && viewingTypeCfg && (
                <DetailModal
                    sub={viewing}
                    typeCfg={viewingTypeCfg}
                    onClose={() => setViewing(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
}