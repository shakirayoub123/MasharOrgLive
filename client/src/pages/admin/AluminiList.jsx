import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
    Users, Search, Mail, Download, CheckCircle2,
    XCircle, MapPin, BookOpen, X, Loader2,
    Eye, Pencil, Trash2, MoreHorizontal, AlertCircle,
    Calendar, Save, ChevronDown, FileText,
    GraduationCap, Award, Clock
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── Config ─────────────────────────────────────────── */
const STATUS_CFG = {
    approved: { label: "Approved", icon: <CheckCircle2 size={11} />, cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    pending:  { label: "Pending",  icon: <AlertCircle  size={11} />, cls: "bg-amber-50  text-amber-700  border border-amber-200"   },
    rejected: { label: "Rejected", icon: <XCircle      size={11} />, cls: "bg-rose-50   text-rose-700   border border-rose-200"   },
};
const COMPLETION_CFG = {
    graduate:    { label: "Graduate",    cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
    passed:      { label: "Passed",      cls: "bg-sky-50    text-sky-700    border border-sky-200"    },
    in_progress: { label: "In Progress", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
    accredited:  { label: "Accredited",  cls: "bg-teal-50   text-teal-700   border border-teal-200"   },
};
const AVATAR_COLORS = ["bg-indigo-500","bg-emerald-500","bg-violet-500","bg-sky-500","bg-rose-500","bg-amber-500","bg-teal-500"];
const getAvatarColor = (id) => AVATAR_COLORS[parseInt(id?.slice(-2) || "0", 16) % AVATAR_COLORS.length];
const getInitials    = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

/* ─── Badge ───────────────────────────────────────────── */
function Badge({ value, config }) {
    const c = config[value] || { label: value, cls: "bg-slate-100 text-slate-500 border border-slate-200" };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${c.cls}`}>
            {c.icon}{c.label}
        </span>
    );
}

/* ─── Form Fields ─────────────────────────────────────── */
function FieldInput({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
            <input type={type} value={value || ""} onChange={e => onChange(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all" />
        </div>
    );
}
function FieldSelect({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
            <div className="relative">
                <select value={value || ""} onChange={e => onChange(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all pr-8">
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}

/* ─── Action Dropdown ─────────────────────────────────── */
function ActionMenu({ onView, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    return (
        <div className="relative" ref={ref}>
            <button onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 text-slate-500 transition-all">
                <MoreHorizontal size={16} />
            </button>
            {open && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 py-2 z-50">
                    <button onClick={e => { e.stopPropagation(); setOpen(false); onView(); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0"><Eye size={13} className="text-indigo-500" /></div>
                        View Details
                    </button>
                    <div className="mx-3 my-1 border-t border-slate-100" />
                    <button onClick={e => { e.stopPropagation(); setOpen(false); onDelete(); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center shrink-0"><Trash2 size={13} className="text-rose-500" /></div>
                        Delete Member
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── View Modal ──────────────────────────────────────── */
function ViewModal({ alumnus, loading, onClose, onEdit }) {
    if (!loading && !alumnus) return null;
    const statusCfg = alumnus ? (STATUS_CFG[alumnus.account_status] || STATUS_CFG.pending) : null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-28 gap-3">
                        <Loader2 size={32} className="text-indigo-500 animate-spin" />
                        <p className="text-sm text-slate-400 font-bold">Loading member details…</p>
                    </div>
                ) : (
                    <>
                        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-8 py-7">
                            <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                                <X size={15} className="text-white" />
                            </button>
                            <div className="flex items-center gap-5">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black ring-4 ring-white/20 shrink-0 ${getAvatarColor(alumnus._id)}`}>
                                    {getInitials(alumnus.full_name)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-white text-2xl font-black tracking-tight">{alumnus.full_name}</h2>
                                    <p className="text-indigo-200 text-sm font-medium flex items-center gap-1.5 mt-1"><Mail size={13} className="shrink-0" /> {alumnus.email}</p>
                                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide bg-white/15 text-white border border-white/20">
                                            {statusCfg?.icon} {alumnus.account_status}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide bg-white/15 text-white border border-white/20">
                                            {alumnus.completion_status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                <DetailCard icon={<BookOpen size={16} className="text-indigo-500" />}   label="Course"            value={alumnus.course || "—"}  bg="bg-indigo-50" />
                                <DetailCard icon={<Calendar size={16} className="text-violet-500" />}   label="Completion Year"   value={alumnus.completion_year || "—"} bg="bg-violet-50" />
                                <DetailCard icon={<GraduationCap size={16} className="text-sky-500" />} label="Completion Status" value={<Badge value={alumnus.completion_status} config={COMPLETION_CFG} />} bg="bg-sky-50" />
                                <DetailCard icon={<Award size={16} className="text-emerald-500" />}     label="Account Status"    value={<Badge value={alumnus.account_status} config={STATUS_CFG} />} bg="bg-emerald-50" />
                                <DetailCard icon={<MapPin size={16} className="text-rose-500" />}       label="Location"          value={[alumnus.city, alumnus.country].filter(Boolean).join(", ") || "—"} bg="bg-rose-50" />
                                <DetailCard icon={<Clock size={16} className="text-amber-500" />}       label="Member Since"      value={new Date(alumnus.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} bg="bg-amber-50" />
                                {alumnus.bio && (
                                    <div className="col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2"><FileText size={14} className="text-slate-400" /><span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bio</span></div>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{alumnus.bio}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-8 pb-7 flex items-center justify-end border-t border-slate-100 pt-5">
                            <button onClick={onEdit} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]">
                                <Pencil size={14} /> Edit Member
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function DetailCard({ icon, label, value, bg }) {
    return (
        <div className={`${bg} rounded-2xl p-4 border border-white`}>
            <div className="flex items-center gap-2 mb-2">{icon}<span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span></div>
            {typeof value === "string" ? <p className="text-sm font-bold text-slate-800">{value}</p> : value}
        </div>
    );
}

/* ─── Edit Modal ──────────────────────────────────────── */
function EditModal({ alumnus, onClose, onSave, saving }) {
    const [form, setForm] = useState({ ...alumnus });
    const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black ${getAvatarColor(alumnus._id)}`}>{getInitials(alumnus.full_name)}</div>
                        <div><h2 className="text-lg font-black text-slate-800">Edit Member</h2><p className="text-xs text-slate-400 font-medium">{alumnus.email}</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"><X size={15} className="text-slate-500" /></button>
                </div>
                <div className="px-8 py-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><FieldInput label="Full Name" value={form.full_name} onChange={set("full_name")} /></div>
                        <div className="col-span-2"><FieldInput label="Email" value={form.email} onChange={set("email")} type="email" /></div>
                        <FieldInput label="Course" value={form.course} onChange={set("course")} />
                        <FieldInput label="Completion Year" value={form.completion_year} onChange={set("completion_year")} />
                        <FieldSelect label="Completion Status" value={form.completion_status} onChange={set("completion_status")} options={[
                            { value: "graduate",    label: "Graduate"    },
                            { value: "passed",      label: "Passed"      },
                            { value: "in_progress", label: "In Progress" },
                            { value: "accredited",  label: "Accredited"  },
                        ]} />
                        <FieldSelect label="Account Status" value={form.account_status} onChange={set("account_status")} options={[
                            { value: "approved", label: "Approved" },
                            { value: "pending",  label: "Pending"  },
                            { value: "rejected", label: "Rejected" },
                        ]} />
                        <FieldInput label="City" value={form.city} onChange={set("city")} />
                        <FieldInput label="Country" value={form.country} onChange={set("country")} />
                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bio</label>
                            <textarea value={form.bio || ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all resize-none" />
                        </div>
                    </div>
                </div>
                <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={() => onSave(form)} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-60 active:scale-[0.98]">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main ────────────────────────────────────────────── */
export default function AlumniList() {
    const [alumni, setAlumni]             = useState([]);
    const [allAlumni, setAllAlumni]       = useState([]); // unfiltered — for stat card counts
    const [loading, setLoading]           = useState(true);
    const [searchTerm, setSearchTerm]     = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewAlumni, setViewAlumni]     = useState(null);
    const [editAlumni, setEditAlumni]     = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [saving, setSaving]             = useState(false);
    const { adminToken } = useAuth();

    // ── Fetch ALL (unfiltered) once — drives stat card counts ──
    const fetchCounts = useCallback(async () => {
        try {
            const res = await axios.get("/api/admin/alumni/list", {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setAllAlumni(res.data.data || []);
        } catch { /* silent */ }
    }, [adminToken]);

    useEffect(() => { fetchCounts(); }, [fetchCounts]);

    // ── Fetch filtered list — passes account_status to API ──
    // GET /api/admin/alumni/list?search=&account_status=approved
    const fetchAlumni = useCallback(async (search = "", accountStatus = "all") => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (accountStatus !== "all") params.append("account_status", accountStatus); // ✅ correct param
            const res = await axios.get(`/api/admin/alumni/list?${params.toString()}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setAlumni(res.data.data || []);
        } catch {
            toast.error("Failed to load alumni directory");
        } finally {
            setLoading(false);
        }
    }, [adminToken]);

    // Re-fetch filtered list whenever search or filter tab changes
    useEffect(() => {
        const t = setTimeout(() => fetchAlumni(searchTerm, statusFilter), 400);
        return () => clearTimeout(t);
    }, [searchTerm, statusFilter, fetchAlumni]);

    const handleView = async (id) => {
        setViewAlumni(null);
        setModalLoading(true);
        try {
            const res = await axios.get(`/api/admin/alumni/info/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setViewAlumni(res.data.data || res.data);
        } catch {
            toast.error("Failed to load details");
        } finally {
            setModalLoading(false);
        }
    };

    const handleSave = async (form) => {
        try {
            setSaving(true);
            await axios.post(`/api/admin/alumni/${form._id}/update`, {
                full_name: form.full_name, email: form.email, course: form.course,
                completion_status: form.completion_status, completion_year: form.completion_year,
                city: form.city, country: form.country, bio: form.bio,
                account_status: form.account_status,
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            toast.success("Member updated successfully");
            // update both lists in-place so counts stay correct
            setAlumni(prev    => prev.map(a => a._id === form._id ? { ...a, ...form } : a));
            setAllAlumni(prev => prev.map(a => a._id === form._id ? { ...a, ...form } : a));
            setEditAlumni(null);
        } catch {
            toast.error("Failed to update member");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
        try {
            await axios.delete(`/api/admin/alumni/delete/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Alumni deleted");
            setAlumni(prev    => prev.filter(a => a._id !== id));
            setAllAlumni(prev => prev.filter(a => a._id !== id));
            if (viewAlumni?._id === id) setViewAlumni(null);
        } catch {
            toast.error("Failed to delete");
        }
    };

    // Counts always from unfiltered allAlumni — never drops when filtered
    const counts = {
        all:      allAlumni.length,
        approved: allAlumni.filter(a => a.account_status === "approved").length,
        pending:  allAlumni.filter(a => a.account_status === "pending").length,
        rejected: allAlumni.filter(a => a.account_status === "rejected").length,
    };

    return (
        <div className="space-y-7 pb-12">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Directory</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and review all registered members in the Mashar network.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
                    <Download size={15} /> Export CSV
                </button>
            </div>

            {/* Stat Cards — always reflect full unfiltered totals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { key: "all",      label: "Total",    color: "text-slate-800",   bg: "bg-white border-slate-200",        dot: "bg-slate-400"   },
                    { key: "approved", label: "Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
                    { key: "pending",  label: "Pending",  color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",     dot: "bg-amber-500"   },
                    { key: "rejected", label: "Rejected", color: "text-rose-700",    bg: "bg-rose-50 border-rose-200",       dot: "bg-rose-500"    },
                ].map(({ key, label, color, bg, dot }) => (
                    <div key={key} className={`${bg} p-5 rounded-3xl border shadow-sm`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full ${dot}`} />
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{label}</p>
                        </div>
                        <p className={`text-3xl font-black ${color}`}>{counts[key]}</p>
                    </div>
                ))}
            </div>

            {/* Search & Filter Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-5 py-4 flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                    <input type="text" placeholder="Search by name, email, course or country…"
                           value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                           className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all" />
                </div>

                {/* Filter tabs — clicking triggers API call with account_status param */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200 w-full md:w-auto">
                    {["all", "approved", "pending", "rejected"].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-bold capitalize transition-all whitespace-nowrap ${
                                    statusFilter === s
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                        : "text-slate-400 hover:text-slate-700"
                                }`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60">
                            {["Member", "Course", "Completion", "Account Status", "Location", "Joined", ""].map((h, i) => (
                                <th key={i} className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-2xl shrink-0" />
                                            <div className="space-y-2"><div className="h-3 bg-slate-100 rounded w-28" /><div className="h-2.5 bg-slate-100 rounded w-36" /></div>
                                        </div>
                                    </td>
                                    {[...Array(5)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-3 bg-slate-100 rounded w-20" /></td>)}
                                    <td className="px-6 py-4"><div className="h-8 w-8 bg-slate-100 rounded-xl" /></td>
                                </tr>
                            ))
                        ) : alumni.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-20 text-center">
                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Users size={22} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-bold text-sm">No members found</p>
                                    <p className="text-slate-300 text-xs mt-1">Try adjusting your search or filter</p>
                                </td>
                            </tr>
                        ) : alumni.map((a) => (
                            <tr key={a._id} className="hover:bg-slate-50/60 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-black shrink-0 group-hover:scale-105 transition-transform ${getAvatarColor(a._id)}`}>
                                            {getInitials(a.full_name)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{a.full_name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5"><Mail size={10} /> {a.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen size={13} className="text-slate-300 shrink-0" />
                                        <span className="text-sm font-bold text-slate-700">{a.course || "—"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <Badge value={a.completion_status} config={COMPLETION_CFG} />
                                        <span className="text-[11px] text-slate-400 font-medium pl-0.5">{a.completion_year}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><Badge value={a.account_status} config={STATUS_CFG} /></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                        <MapPin size={11} className="shrink-0" />
                                        {[a.city, a.country].filter(Boolean).join(", ") || "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                    <ActionMenu onView={() => handleView(a._id)} onDelete={() => handleDelete(a._id, a.full_name)} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {!loading && alumni.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">
                            Showing <span className="text-slate-600">{alumni.length}</span> member{alumni.length !== 1 ? "s" : ""}
                            {statusFilter !== "all" && <span className="text-indigo-500 ml-1 capitalize">· {statusFilter}</span>}
                        </p>
                        <div className="flex gap-1.5">
                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-300 cursor-not-allowed">Prev</button>
                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {(modalLoading || viewAlumni) && (
                <ViewModal
                    alumnus={viewAlumni} loading={modalLoading}
                    onClose={() => { setViewAlumni(null); setModalLoading(false); }}
                    onEdit={() => { const a = viewAlumni; setViewAlumni(null); setEditAlumni(a); }}
                />
            )}
            {editAlumni && (
                <EditModal alumnus={editAlumni} onClose={() => setEditAlumni(null)} onSave={handleSave} saving={saving} />
            )}
        </div>
    );
}