import { useState, useEffect } from "react";
import {
    Users, Clock, CheckCircle, XCircle, RefreshCw,
    Search, ChevronDown, Check, X, Eye, Loader2,
    AlertCircle, Mail, GraduationCap, Calendar, Trash2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────
function useAdminAxios() {
    const { adminToken } = useAuth();
    const h = { Authorization: `Bearer ${adminToken}` };
    return {
        get: (url) => axios.get(`/api${url}`, { headers: h }),
        patch: (url, data) => axios.patch(`/api${url}`, data, { headers: h }),
        delete: (url) => axios.delete(`/api${url}`, { headers: h }),
    };
}

// ─── EVENT TYPE CONFIG ────────────────────────────────────────────────────────
const EVENT_TYPES = [
    { id: "all", label: "All Requests", icon: "📋", color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF" },
    { id: "coach-to-coach", label: "Coach to Coach", icon: "🤝", color: "#F38900", bg: "#FFF4E0", border: "#FFE4B0" },
    { id: "hot-seat", label: "Hot Seat Sessions", icon: "🔥", color: "#E53E3E", bg: "#FFF5F5", border: "#FED7D7" },
    { id: "peer-coaching", label: "Peer Coaching Circles", icon: "⭕", color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF" },
    { id: "webinar", label: "Webinars", icon: "🎙️", color: "#6B46C1", bg: "#FAF5FF", border: "#E9D8FD" },
];

const STATUS_CFG = {
    pending: { label: "Pending", Icon: Clock, color: "#D97706", bg: "#FEF3C7", border: "#FDE68A" },
    approved: { label: "Confirmed", Icon: CheckCircle, color: "#059669", bg: "#D1FAE5", border: "#A7F3D0" },
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
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"; }
function initials(n = "") { return (n || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
const AV_PAL = ["#0F1C80", "#F38900", "#E53E3E", "#6B46C1", "#0B7285", "#2D8A4E"];
function avColor(n = "") { return AV_PAL[(n.charCodeAt(0) || 0) % AV_PAL.length]; }
function getEventCfg(id) { return EVENT_TYPES.find(e => e.id === id) || EVENT_TYPES[0]; }

// ─── SMALL UI ─────────────────────────────────────────────────────────────────
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

function EventPill({ eventTypeId }) {
    const cfg = getEventCfg(eventTypeId);
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
            {cfg.icon} {cfg.label}
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
function DetailModal({ req, onClose, onUpdate }) {
    const api = useAdminAxios();
    const [note, setNote] = useState(req.adminNote || "");
    const [updating, setUpdating] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const name = req.alumni?.full_name || req.alumniName || "Unknown";
    const evtCfg = getEventCfg(req.eventTypeId);

    async function handleStatus(status) {
        setUpdating(status);
        try {
            await api.patch(`/admin/event-requests/${req._id}/status`, { status, adminNote: note });
            toast.success(`Request ${status}.`);
            onUpdate(req._id, status, note);
            onClose();
        } catch { toast.error("Failed to update."); }
        finally { setUpdating(null); }
    }

    async function handleDelete() {
        if (!window.confirm("Delete this request permanently?")) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/event-requests/${req._id}`);
            toast.success("Request deleted.");
            onUpdate(req._id, null);
            onClose();
        } catch { toast.error("Failed to delete."); }
        finally { setDeleting(false); }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
                style={{ animation: "modalUp .2s ease" }}>

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Av name={name} size={42} />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Request</p>
                            <h3 className="text-sm font-black text-slate-800 mt-0.5">{name}</h3>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <EventPill eventTypeId={req.eventTypeId} />
                                <StatusBadge status={req.status} />
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

                    {/* Event info */}
                    <div className="rounded-xl border overflow-hidden"
                        style={{ borderColor: evtCfg.border, background: evtCfg.bg }}>
                        <div className="px-4 py-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                                style={{ background: "white", borderColor: evtCfg.border }}>
                                {evtCfg.icon}
                            </div>
                            <div>
                                <p className="font-black text-[#0D1240] text-sm">{req.eventLabel || evtCfg.label}</p>
                                <p className="text-[11px] mt-0.5" style={{ color: evtCfg.color }}>
                                    Requested {ago(req.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Alumni profile */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Alumni Profile</p>
                        <div className="space-y-2">
                            {[
                                { icon: <Mail size={11} />, label: req.alumni?.email || req.alumniEmail },
                                { icon: <GraduationCap size={11} />, label: req.alumni?.course },
                                { icon: <Calendar size={11} />, label: req.alumni?.completion_year ? `Class of ${req.alumni.completion_year}` : null },
                                { icon: <span className="text-[10px]">📍</span>, label: [req.alumni?.city, req.alumni?.country].filter(Boolean).join(", ") || null },
                            ].filter(r => r.label).map((r, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="text-slate-400 shrink-0">{r.icon}</span>
                                    {r.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-xl border border-slate-100 p-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Timeline</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Submitted</span>
                                <span className="font-semibold text-slate-700">{fmtDate(req.createdAt)}</span>
                            </div>
                            {req.reviewedAt && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Reviewed</span>
                                    <span className="font-semibold text-slate-700">{fmtDate(req.reviewedAt)}</span>
                                </div>
                            )}
                            {req.reviewedBy && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Reviewed by</span>
                                    <span className="font-semibold text-slate-700">{req.reviewedBy.email || req.reviewedBy.name || "Admin"}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Previous admin note */}
                    {req.adminNote && (
                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Previous Admin Note</p>
                            <p className="text-xs text-amber-800">{req.adminNote}</p>
                        </div>
                    )}

                    {/* Admin note textarea */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Admin Note / Schedule Info (sent to alumni)
                        </label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                            placeholder="e.g. Your session is scheduled for Tuesday 25 March at 3pm. Zoom link: …"
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
                        {req.status !== "rejected" && (
                            <button onClick={() => handleStatus("rejected")} disabled={!!updating}
                                className="flex items-center gap-2 px-4 py-2.5 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold rounded-xl transition-all">
                                {updating === "rejected" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                                Reject
                            </button>
                        )}
                        {req.status !== "approved" && (
                            <button onClick={() => handleStatus("approved")} disabled={!!updating}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200">
                                {updating === "approved" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                                Confirm
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── REQUEST ROW ──────────────────────────────────────────────────────────────
function ReqRow({ req, onView, onUpdate, index }) {
    const api = useAdminAxios();
    const [quickUpdating, setQuickUpdating] = useState(null);
    const name = req.alumni?.full_name || req.alumniName || "Unknown";
    const evtCfg = getEventCfg(req.eventTypeId);

    async function quickStatus(e, status) {
        e.stopPropagation();
        setQuickUpdating(status);
        try {
            await api.patch(`/admin/event-requests/${req._id}/status`, { status });
            onUpdate(req._id, status, "");
            toast.success(`Marked as ${status}.`);
        } catch { toast.error("Failed."); }
        finally { setQuickUpdating(null); }
    }

    return (
        <div onClick={() => onView(req)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer overflow-hidden group"
            style={{ animation: "fadeUp .2s ease both", animationDelay: `${index * 0.04}s` }}>

            {/* Top accent */}
            <div className="h-[2px]" style={{ background: `linear-gradient(90deg,${evtCfg.color},transparent)` }} />

            <div className="px-5 py-4 flex items-center gap-4">
                <Av name={name} size={40} />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                        <StatusBadge status={req.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <EventPill eventTypeId={req.eventTypeId} />
                        <span className="text-[10px] text-slate-400">{ago(req.createdAt)}</span>
                        {(req.alumni?.email || req.alumniEmail) && (
                            <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                                <Mail size={9} />{req.alumni?.email || req.alumniEmail}
                            </span>
                        )}
                    </div>
                    {req.adminNote && (
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                            💬 {req.adminNote}
                        </p>
                    )}
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {req.status !== "approved" && (
                        <button onClick={e => quickStatus(e, "approved")} disabled={!!quickUpdating} title="Confirm"
                            className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 flex items-center justify-center transition-all">
                            {quickUpdating === "approved" ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        </button>
                    )}
                    {req.status !== "rejected" && (
                        <button onClick={e => quickStatus(e, "rejected")} disabled={!!quickUpdating} title="Reject"
                            className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all">
                            {quickUpdating === "rejected" ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                        </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); onView(req); }} title="View details"
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
export default function AdminEventRequests() {
    const api = useAdminAxios();
    const [activeType, setActiveType] = useState("all");
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewing, setViewing] = useState(null);

    async function loadStats() {
        try {
            const r = await api.get("/admin/event-requests/stats");
            setStats(r.data.data || {});
        } catch { }
    }

    async function load(type = activeType, silent = false) {
        silent ? setRefreshing(true) : setLoading(true);
        try {
            const params = new URLSearchParams();
            if (type !== "all") params.set("eventTypeId", type);
            const r = await api.get(`/admin/event-requests?${params}`);
            setRequests(r.data.data || []);
        } catch {
            toast.error("Failed to load requests.");
            setRequests([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => { loadStats(); }, []);
    useEffect(() => { load(); }, [activeType]);

    function handleUpdate(id, status, note) {
        if (status === null) {
            setRequests(prev => prev.filter(r => r._id !== id));
        } else {
            setRequests(prev => prev.map(r => r._id === id ? { ...r, status, adminNote: note } : r));
        }
        loadStats();
    }

    const filtered = requests.filter(r => {
        const q = search.toLowerCase();
        const name = (r.alumni?.full_name || r.alumniName || "").toLowerCase();
        const email = (r.alumni?.email || r.alumniEmail || "").toLowerCase();
        const matchType = activeType === "all" || r.eventTypeId === activeType;
        const matchSearch = !q || name.includes(q) || email.includes(q);
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        return matchType && matchSearch && matchStatus;
    });

    const overall = stats.overall || {};
    const counts = {
        total: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        approved: requests.filter(r => r.status === "approved").length,
        rejected: requests.filter(r => r.status === "rejected").length,
    };

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
                        <h1 className="text-2xl font-black text-slate-800">Event Requests</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Review and confirm alumni event session requests.
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
                    <StatsCard label="Total" value={overall.total ?? counts.total} Icon={Users} color="#0F1C80" bg="#EEF0FF" border="#DDE0FF" i={0} />
                    <StatsCard label="Pending" value={overall.pending ?? counts.pending} Icon={Clock} color="#D97706" bg="#FEF3C7" border="#FDE68A" i={1} />
                    <StatsCard label="Confirmed" value={overall.approved ?? counts.approved} Icon={CheckCircle} color="#059669" bg="#D1FAE5" border="#A7F3D0" i={2} />
                    <StatsCard label="Rejected" value={overall.rejected ?? counts.rejected} Icon={XCircle} color="#DC2626" bg="#FEE2E2" border="#FECACA" i={3} />
                </div>

                {/* Per-type stat cards */}
                {Object.keys(stats).filter(k => k !== "overall").length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {EVENT_TYPES.filter(t => t.id !== "all").map((t, i) => {
                            const s = stats[t.id] || {};
                            return (
                                <div key={t.id} onClick={() => setActiveType(t.id)}
                                    className="bg-white rounded-xl border p-3.5 cursor-pointer transition-all hover:shadow-md"
                                    style={{ borderColor: activeType === t.id ? t.border : "#E5E7EB", boxShadow: activeType === t.id ? `0 0 0 2px ${t.color}22` : "none", animation: `fadeUp .25s ease both`, animationDelay: `${(i + 4) * 0.05}s` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xl">{t.icon}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                            style={{ color: t.color, background: t.bg, border: `1px solid ${t.border}` }}>
                                            {s.total || 0}
                                        </span>
                                    </div>
                                    <p className="text-xs font-black text-slate-700 leading-snug mb-1.5">{t.label}</p>
                                    <div className="flex gap-2">
                                        {["pending", "approved", "rejected"].map(st => (
                                            <span key={st} className="text-[10px] font-bold" style={{ color: STATUS_CFG[st].color }}>
                                                {s[st] || 0} {st === "approved" ? "conf" : st.slice(0, 3)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Main card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Type tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-100">
                        {EVENT_TYPES.map(t => (
                            <button key={t.id}
                                onClick={() => { setActiveType(t.id); setSearch(""); setStatusFilter("all"); }}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0 ${activeType === t.id
                                        ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
                                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    }`}>
                                <span>{t.icon}</span>
                                {t.label}
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeType === t.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {t.id === "all"
                                        ? (overall.total ?? counts.total)
                                        : (stats[t.id]?.total ?? requests.filter(r => r.eventTypeId === t.id).length)}
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
                            <option value="approved">Confirmed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Count */}
                    <div className="px-5 py-2.5 border-b border-slate-100">
                        <p className="text-[11px] text-slate-400 font-semibold">
                            Showing <span className="text-indigo-600 font-black">{filtered.length}</span> of {requests.length} request{requests.length !== 1 ? "s" : ""}
                            {statusFilter !== "all" && <span className="ml-1">· filtered by <span className="font-black">{statusFilter}</span></span>}
                        </p>
                    </div>

                    {/* List */}
                    <div className="p-4 space-y-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 size={28} className="animate-spin text-indigo-400 mb-3" />
                                <p className="text-sm text-slate-400 font-medium">Loading requests…</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <AlertCircle size={30} className="text-slate-200 mb-3" />
                                <p className="text-sm font-bold text-slate-400">No requests found</p>
                                <p className="text-xs text-slate-300 mt-1">
                                    {search || statusFilter !== "all"
                                        ? "Try adjusting your filters."
                                        : "No alumni have submitted event requests yet."}
                                </p>
                            </div>
                        ) : (
                            filtered.map((r, i) => (
                                <ReqRow key={r._id} req={r} onView={setViewing} onUpdate={handleUpdate} index={i} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {viewing && (
                <DetailModal req={viewing} onClose={() => setViewing(null)} onUpdate={handleUpdate} />
            )}
        </>
    );
}