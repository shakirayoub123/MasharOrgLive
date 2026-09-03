import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
    CheckCircle, XCircle, Clock, Search,
    GraduationCap, MapPin, BookOpen,
    RotateCcw, ChevronDown, Award,
    Mail, Calendar, AlertCircle, Loader2, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── Config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
    approved: { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle2 },
    pending: { badge: "bg-amber-50  text-amber-700  border border-amber-200", dot: "bg-amber-400", icon: Clock },
    rejected: { badge: "bg-rose-50   text-rose-700   border border-rose-200", dot: "bg-rose-500", icon: XCircle },
};
const COMPLETION_CONFIG = {
    graduate: { style: "bg-indigo-50 text-indigo-700 border border-indigo-200", icon: GraduationCap },
    passed: { style: "bg-sky-50    text-sky-700    border border-sky-200", icon: Award },
    in_progress: { style: "bg-violet-50 text-violet-700 border border-violet-200", icon: Clock },
    accredited: { style: "bg-teal-50   text-teal-700   border border-teal-200", icon: Award },
};
const AVATAR_COLORS = ["bg-indigo-500", "bg-emerald-500", "bg-violet-500", "bg-sky-500", "bg-rose-500", "bg-amber-500", "bg-teal-500"];
const getAvatarColor = (id) => AVATAR_COLORS[parseInt(id?.slice(-2) || "0", 16) % AVATAR_COLORS.length];
const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

/* ─── Badges ──────────────────────────────────────────── */
function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {status}
        </span>
    );
}
function CompletionBadge({ status }) {
    const cfg = COMPLETION_CONFIG[status] || { style: "bg-slate-50 text-slate-500 border border-slate-200", icon: BookOpen };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${cfg.style}`}>
            <Icon size={9} />{status}
        </span>
    );
}

/* ─── Main ────────────────────────────────────────────── */
export default function AdminAlumniApproval() {
    const [alumni, setAlumni] = useState([]);
    const [allAlumni, setAllAlumni] = useState([]); // unfiltered — for stat card counts
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [filter, setFilter] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRow, setExpandedRow] = useState(null);
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

    // ── Fetch filtered list — uses account_status param ───
    // GET /api/admin/alumni/list?search=&account_status=pending
    const fetchAlumni = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (filter !== "all") params.append("account_status", filter); // ✅ fixed param name
            const res = await axios.get(`/api/admin/alumni/list?${params.toString()}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setAlumni(res.data.data || []);
        } catch {
            toast.error("Failed to load alumni data.");
        } finally {
            setLoading(false);
        }
    }, [filter, searchTerm, adminToken]);

    useEffect(() => {
        const t = setTimeout(fetchAlumni, 350);
        return () => clearTimeout(t);
    }, [fetchAlumni]);

    const handleAction = async (id, action) => {
        setActionLoading(p => ({ ...p, [id]: action }));
        try {
            await axios.put(
                `/api/admin/alumni/${id}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success(action === "approve" ? "Alumni approved!" : "Alumni rejected.");
            const newStatus = action === "approve" ? "approved" : "rejected";
            // update both lists so counts stay accurate
            setAlumni(prev => prev.map(a => a._id === id ? { ...a, account_status: newStatus } : a));
            setAllAlumni(prev => prev.map(a => a._id === id ? { ...a, account_status: newStatus } : a));
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action}.`);
        } finally {
            setActionLoading(p => ({ ...p, [id]: null }));
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-slate-800">Are you sure you want to permanently delete this alumni?</p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            executeDelete(id);
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold transition-all hover:bg-rose-500"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold transition-all hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: Infinity, position: 'top-center' });
    };

    const executeDelete = async (id) => {
        setActionLoading(p => ({ ...p, [id]: "delete" }));
        try {
            await axios.delete(`/api/admin/alumni/delete/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Alumni permanently deleted");
            // Remove the deleted alumni from state so it immediately disappears and updates counts
            setAlumni(prev => prev.filter(a => a._id !== id));
            setAllAlumni(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete alumni.");
        } finally {
            setActionLoading(p => ({ ...p, [id]: null }));
        }
    };

    // Counts always from unfiltered allAlumni — never drops when filtered
    const counts = {
        all: allAlumni.length,
        pending: allAlumni.filter(a => a.account_status === "pending").length,
        approved: allAlumni.filter(a => a.account_status === "approved").length,
        rejected: allAlumni.filter(a => a.account_status === "rejected").length,
    };

    return (
        <div className="space-y-7 pb-12">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Approvals</h1>
                    <p className="text-slate-500 font-medium mt-1">Review and manage alumni registration requests.</p>
                </div>
                <button onClick={() => { fetchAlumni(); fetchCounts(); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
                    <RotateCcw size={14} /> Refresh
                </button>
            </div>

            {/* Stat Cards — always reflect full unfiltered totals, clickable as filter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { key: "all", label: "Total", color: "text-slate-800", bg: "bg-white border-slate-200", dot: "bg-slate-400" },
                    { key: "pending", label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
                    { key: "approved", label: "Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
                    { key: "rejected", label: "Rejected", color: "text-rose-700", bg: "bg-rose-50 border-rose-200", dot: "bg-rose-500" },
                ].map(({ key, label, color, bg, dot }) => (
                    <button key={key} onClick={() => setFilter(key)}
                        className={`${bg} p-5 rounded-3xl border shadow-sm text-left transition-all hover:shadow-md ${filter === key ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{label}</p>
                        </div>
                        <p className={`text-3xl font-black ${color}`}>{counts[key]}</p>
                    </button>
                ))}
            </div>

            {/* Search & Filter Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-5 py-4 flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                    <input type="text" placeholder="Search by name or email…"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all" />
                </div>
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200 w-full md:w-auto">
                    {["all", "pending", "approved", "rejected"].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-bold capitalize transition-all whitespace-nowrap ${filter === s ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-400 hover:text-slate-700"
                                }`}>
                            {s}
                            {s !== "all" && (
                                <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-black ${filter === s ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
                                    {counts[s]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3">
                        <Loader2 size={30} className="text-indigo-500 animate-spin" />
                        <p className="text-slate-400 font-bold text-sm">Loading alumni data…</p>
                    </div>
                ) : alumni.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
                            <AlertCircle size={22} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold text-sm">No alumni found</p>
                        <p className="text-slate-300 text-xs">Try changing your filter or search term</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                    {["Member", "Course & Year", "Location", "Registered", "Status", "Actions"].map((h, i) => (
                                        <th key={h} className={`px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap ${i === 5 ? "text-center" : ""}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {alumni.map(a => {
                                    const isExpanded = expandedRow === a._id;
                                    const isActing = !!actionLoading[a._id];
                                    return (
                                        <React.Fragment key={a._id}>
                                            <tr className={`transition-colors hover:bg-slate-50/60 cursor-pointer ${isExpanded ? "bg-indigo-50/30" : ""}`}
                                                onClick={() => setExpandedRow(isExpanded ? null : a._id)}>

                                                {/* Member */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-black shrink-0 ${getAvatarColor(a._id)}`}>
                                                            {getInitials(a.full_name)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 leading-tight">{a.full_name || "—"}</p>
                                                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5"><Mail size={10} /> {a.email}</p>
                                                        </div>
                                                        <ChevronDown size={14} className={`text-slate-300 ml-1 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                                    </div>
                                                </td>

                                                {/* Course */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <BookOpen size={12} className="text-slate-300 shrink-0" />
                                                        <span className="text-sm font-bold text-slate-700">{a.course || "—"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <CompletionBadge status={a.completion_status} />
                                                        <span className="text-[11px] text-slate-400 font-medium">{a.completion_year}</span>
                                                    </div>
                                                </td>

                                                {/* Location */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-[12px] text-slate-500 font-medium">
                                                        <MapPin size={11} className="text-slate-300 shrink-0" />
                                                        {[a.city, a.country].filter(Boolean).join(", ") || <span className="text-slate-300">Not provided</span>}
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                        <Calendar size={11} className="shrink-0" />
                                                        {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4"><StatusBadge status={a.account_status} /></td>

                                                {/* Actions */}
                                                <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {a.account_status === "pending" && (
                                                            <>
                                                                <button onClick={() => handleAction(a._id, "approve")} disabled={isActing}
                                                                    className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-emerald-200">
                                                                    {actionLoading[a._id] === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                                                    Approve
                                                                </button>
                                                                <button onClick={() => handleAction(a._id, "reject")} disabled={isActing}
                                                                    className="h-8 px-3.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[11px] font-bold transition-all disabled:opacity-50 flex items-center gap-1.5">
                                                                    {actionLoading[a._id] === "reject" ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        {a.account_status === "approved" && (
                                                            <span className="inline-flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
                                                                <CheckCircle size={13} /> Approved
                                                            </span>
                                                        )}
                                                        {a.account_status === "rejected" && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-flex items-center gap-1.5 text-rose-500 text-[11px] font-bold">
                                                                    <XCircle size={13} /> Rejected
                                                                </span>
                                                                <button onClick={() => handleDelete(a._id)} disabled={isActing}
                                                                    className="h-7 px-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm ml-2">
                                                                    {actionLoading[a._id] === "delete" ? <Loader2 size={10} className="animate-spin" /> : "Delete"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Detail Row */}
                                            {isExpanded && (
                                                <tr className="bg-indigo-50/20">
                                                    <td colSpan={6} className="px-6 pb-5 pt-2">
                                                        <div className="ml-13 grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-indigo-100/60">
                                                            {[
                                                                { label: "Full Name", value: a.full_name },
                                                                { label: "Email", value: a.email },
                                                                { label: "Course", value: a.course },
                                                                { label: "Completion", value: a.completion_status ? `${a.completion_status} · ${a.completion_year}` : "—" },
                                                                { label: "City", value: a.city },
                                                                { label: "Country", value: a.country },
                                                                { label: "Registered", value: new Date(a.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                                                                { label: "Last Updated", value: new Date(a.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                                                            ].map(({ label, value }) => (
                                                                <div key={label} className="bg-white rounded-xl px-3.5 py-3 border border-slate-100 shadow-sm">
                                                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                                                                    <p className="text-[12px] font-bold text-slate-700 truncate">{value || "—"}</p>
                                                                </div>
                                                            ))}
                                                            {a.bio && (
                                                                <div className="col-span-2 md:col-span-4 bg-white rounded-xl px-3.5 py-3 border border-slate-100 shadow-sm">
                                                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Bio</p>
                                                                    <p className="text-[12px] text-slate-600 leading-relaxed">{a.bio}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                {!loading && alumni.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">
                            Showing <span className="text-slate-600">{alumni.length}</span> result{alumni.length !== 1 ? "s" : ""}
                            {filter !== "all" && <span className="ml-1.5 text-indigo-500 font-bold capitalize">· {filter} only</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                            Click any row to expand details
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}