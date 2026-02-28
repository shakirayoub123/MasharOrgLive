import { useState, useEffect } from "react";
import {
  Users, Clock, CheckCircle, XCircle, RefreshCw,
  Search, AlertCircle, Loader2, Eye, LayoutGrid, FileText,
  MessageSquare, Settings, Calendar, GraduationCap,
  Mail, ShieldCheck, Edit3, MoreHorizontal, Heart
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

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONTACT_CATEGORIES = [
  { id: "all", label: "All Requests", icon: <LayoutGrid size={15} />, color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF" },
  { id: "certificate", label: "Certificates", icon: <FileText size={15} />, color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5" },
  { id: "letter", label: "Letters", icon: <Mail size={15} />, color: "#F38900", bg: "#FFF4E0", border: "#FFE4B0" },
  { id: "transcript", label: "Transcripts", icon: <FileText size={15} />, color: "#6B46C1", bg: "#FAF5FF", border: "#E9D8FD" },
  { id: "access", label: "App Access", icon: <ShieldCheck size={15} />, color: "#E53E3E", bg: "#FFF5F5", border: "#FED7D7" },
  { id: "data-update", label: "Profile Update", icon: <Edit3 size={15} />, color: "#0B7285", bg: "#E6FCFF", border: "#B5F5EC" },
  { id: "general", label: "General Form", icon: <MessageSquare size={15} />, color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF" },
  { id: "technical", label: "Technical", icon: <Settings size={15} />, color: "#E53E3E", bg: "#FFF5F5", border: "#FED7D7" },
  { id: "account", label: "Account Support", icon: <Users size={15} />, color: "#F38900", bg: "#FFF4E0", border: "#FFE4B0" },
  { id: "events", label: "Events Enquiry", icon: <Calendar size={15} />, color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5" },
  { id: "programs", label: "Programs Enquiry", icon: <GraduationCap size={15} />, color: "#6B46C1", bg: "#FAF5FF", border: "#E9D8FD" },
  { id: "feedback", label: "Feedback", icon: <Heart size={15} />, color: "#E53E3E", bg: "#FFF5F5", border: "#FED7D7" },
  { id: "other", label: "Other", icon: <MoreHorizontal size={15} />, color: "#718096", bg: "#F7FAFC", border: "#E2E8F0" },
];

const STATUS_CFG = {
  pending: { label: "Pending", Icon: Clock, color: "#D97706", bg: "#FEF3C7", border: "#FDE68A" },
  approved: { label: "Completed", Icon: CheckCircle, color: "#059669", bg: "#D1FAE5", border: "#A7F3D0" },
  rejected: { label: "Rejected", Icon: XCircle, color: "#DC2626", bg: "#FEE2E2", border: "#FECACA" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"; }
function initials(n = "") { return (n || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
const AV_PAL = ["#0F1C80", "#F38900", "#E53E3E", "#6B46C1", "#0B7285", "#2D8A4E"];
function avColor(n = "") { return AV_PAL[(n.charCodeAt(0) || 0) % AV_PAL.length]; }
function getCategoryCfg(id) { return CONTACT_CATEGORIES.find(e => e.id === id) || CONTACT_CATEGORIES.find(e => e.id === "other"); }

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
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
      <Icon size={10} />{cfg.label}
    </span>
  );
}

// ─── STATS CARD ───────────────────────────────────────────────────────────────
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
  const email = req.alumni?.email || req.alumniEmail || "No email";
  const catCfg = getCategoryCfg(req.type);

  async function handleStatus(status) {
    setUpdating(status);
    try {
      await api.patch(`/admin/contact-requests/${req._id}/status`, { status, adminNote: note });
      toast.success(`Request marked as ${status}.`);
      onUpdate(req._id, status, note);
      onClose();
    } catch { toast.error("Failed to update."); }
    finally { setUpdating(null); }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this request permanently?")) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/contact-requests/${req._id}`);
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
              <p className="text-sm font-black text-slate-900 leading-tight">{name}</p>
              <p className="text-[11px] text-slate-500 font-medium">{email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <XCircle size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1 min-w-[140px]">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Category</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-md"
                style={{ color: catCfg.color, background: catCfg.bg, border: `1px solid ${catCfg.border}` }}>
                {catCfg.icon} {catCfg.label}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1 min-w-[140px]">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Current Status</p>
              <StatusBadge status={req.status} />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1 min-w-[140px]">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Submitted</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">{fmtDate(req.createdAt)}</p>
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              Request Context
              <span className="flex-1 h-px bg-slate-100" />
            </p>
            <div className="bg-white border text-sm text-slate-700 font-medium p-4 rounded-xl leading-relaxed whitespace-pre-wrap shadow-sm">
              {req.subject && (
                <div className="font-black text-slate-900 mb-2 pb-2 border-b border-slate-100 text-base">
                  {req.subject}
                </div>
              )}
              {req.details}
            </div>
          </div>

          {/* Admin Note */}
          <div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              Admin Note <span className="text-slate-400 normal-case font-medium tracking-normal text-[11px]">(Alumni will see this)</span>
              <span className="flex-1 h-px bg-slate-100" />
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add files to check, internal trackers, or comments for the alumni..."
              rows={3}
              className="w-full text-sm font-medium p-3.5 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 transition-all custom-scrollbar"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between gap-2">
          <button onClick={handleDelete} disabled={deleting} title="Delete Request permanently"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50 border border-transparent hover:border-red-600 shrink-0">
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={18} />}
          </button>

          <div className="flex items-center gap-2 flex-1 justify-end">
            {req.status !== "pending" && (
              <button onClick={() => handleStatus("pending")} disabled={!!updating}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-bold rounded-xl transition-all disabled:opacity-50">
                {updating === "pending" ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Mark Pending"}
              </button>
            )}
            <button onClick={() => handleStatus("rejected")} disabled={!!updating}
              className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 text-sm font-bold rounded-xl transition-all disabled:opacity-50">
              {updating === "rejected" ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Reject"}
            </button>
            <button onClick={() => handleStatus("approved")} disabled={!!updating}
              className="px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20 text-sm font-bold rounded-xl transition-all disabled:opacity-50">
              {updating === "approved" ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Approve & Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TABLE ROW ────────────────────────────────────────────────────────────────
function ReqRow({ req, onView, onUpdate, index }) {
  const name = req.alumni?.full_name || req.alumniName || "Unknown";
  const catCfg = getCategoryCfg(req.type);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 bg-white transition-all group cursor-pointer"
      onClick={() => onView(req)}
      style={{ animation: `fadeUp .25s ease both`, animationDelay: `${index * 0.04}s` }}>

      <div className="flex items-center gap-3 md:w-[220px] shrink-0 overflow-hidden">
        <Av name={name} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-800 truncate leading-tight group-hover:text-indigo-700 transition-colors">{name}</p>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{fmtDate(req.createdAt)}</p>
        </div>
      </div>

      <div className="md:w-[150px] shrink-0">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md truncate whitespace-nowrap"
          style={{ color: catCfg.color, background: catCfg.bg, border: `1px solid ${catCfg.border}` }}>
          {catCfg.icon} {catCfg.label}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {req.subject && <p className="text-xs font-bold text-slate-800 truncate mb-0.5">{req.subject}</p>}
        <p className="text-xs text-slate-500 font-medium truncate leading-relaxed">
          {req.details}
        </p>
      </div>

      <div className="flex items-center gap-4 justify-between md:justify-end md:w-[200px] shrink-0">
        <StatusBadge status={req.status} />
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onView(req); }} title="Review Request"
            className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors">
            <Eye size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onUpdate(req._id, "approved", req.adminNote); }} title="Quick Approve"
            className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors">
            <CheckCircle size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminContactRequests() {
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
      const r = await api.get("/admin/contact-requests/stats");
      setStats(r.data.data || {});
    } catch { }
  }

  async function load(type = activeType, silent = false) {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type !== "all") params.set("type", type);
      const r = await api.get(`/admin/contact-requests?${params}`);
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
    const subject = (r.subject || "").toLowerCase();
    const matchType = activeType === "all" || r.type === activeType;
    const matchSearch = !q || name.includes(q) || email.includes(q) || subject.includes(q);
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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>

      <div className="space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Support & Document Requests</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage certificates, transcripts, profile updates, and general support.
            </p>
          </div>
          <button onClick={() => { load(activeType, true); loadStats(); }} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold rounded-xl transition-all shrink-0 shadow-sm bg-white">
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

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Type tabs */}
          <div className="flex overflow-x-auto border-b border-slate-100 custom-scrollbar">
            {CONTACT_CATEGORIES.map(t => (
              <button key={t.id}
                onClick={() => { setActiveType(t.id); setSearch(""); setStatusFilter("all"); }}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0 ${activeType === t.id
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}>
                <span className={`flex items-center justify-center p-1.5 rounded-lg ${activeType === t.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100/50 text-slate-400"}`}>
                  {t.icon}
                </span>
                {t.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1 ${activeType === t.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                  }`}>
                  {t.id === "all"
                    ? (overall.total ?? counts.total)
                    : (stats[t.id]?.total ?? requests.filter(r => r.type === t.id).length)}
                </span>
              </button>
            ))}
          </div>

          {/* Search + filter */}
          <div className="px-5 py-4 flex flex-col sm:flex-row items-center gap-3 border-b border-slate-100 bg-slate-50/30">
            <div className="relative w-full sm:flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shrink-0 shadow-sm cursor-pointer">
              <option value="all">All Statuses</option>
              <option value="pending">🟡 Pending</option>
              <option value="approved">🟢 Confirmed</option>
              <option value="rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* Count */}
          <div className="px-5 py-2.5 border-b border-slate-100 bg-white">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Showing <span className="text-indigo-600 font-black">{filtered.length}</span> of {requests.length} request{requests.length !== 1 ? "s" : ""}
              {statusFilter !== "all" && <span className="ml-1">· FILTERED BY <span className="font-black text-slate-600">{statusFilter}</span></span>}
            </p>
          </div>

          {/* List */}
          <div className="p-4 space-y-2.5 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-indigo-400 mb-4" />
                <p className="text-sm text-slate-400 font-medium">Loading requests…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeUp">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4">
                  <AlertCircle size={30} className="text-slate-300" />
                </div>
                <p className="text-base font-black text-slate-700 mb-1">No requests found</p>
                <p className="text-sm font-medium text-slate-400">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "No alumni have submitted requests yet."}
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
