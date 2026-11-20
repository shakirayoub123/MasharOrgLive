import { useState, useEffect, useCallback } from "react";
import {
    Trash2, Search, AlertTriangle, FileText, RefreshCw,
    Eye, Mail, Building2, Sparkles, Calendar, Check, Copy, X
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ── View Details Modal ──
function DetailsModal({ interaction, onClose, onDelete }) {
    const [copied, setCopied] = useState(false);

    if (!interaction) return null;

    const copyEmail = () => {
        navigator.clipboard.writeText(interaction.email);
        setCopied(true);
        toast.success("Email copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.15em] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                            Discovery Request Details
                        </span>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">
                            {interaction.name}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Contact & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Mail size={13} className="text-indigo-500" /> Email Address
                            </p>
                            <div className="flex items-center justify-between gap-2">
                                <a href={`mailto:${interaction.email}`} className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline break-all">
                                    {interaction.email}
                                </a>
                                <button
                                    onClick={copyEmail}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-white transition-all shrink-0"
                                    title="Copy email"
                                >
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Building2 size={13} className="text-indigo-500" /> Organization / Company
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-800 break-words" dir="auto">
                                {interaction.company || "N/A (Individual)"}
                            </p>
                        </div>
                    </div>

                    {/* Help Topic & Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Sparkles size={13} className="text-amber-500" /> Topic of Interest
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-800">
                                {interaction.helpTopic || "General Coaching & Leadership"}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Calendar size={13} className="text-slate-400" /> Submission Date
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-800">
                                {new Date(interaction.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Biggest Challenge */}
                    <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/70">
                        <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                            Biggest Challenge / Message:
                        </p>
                        <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap break-words font-medium" dir="auto">
                            {interaction.challenge || "No description provided."}
                        </p>
                    </div>

                    {/* Newsletter Preference */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="text-slate-600 font-medium">Newsletter & Leadership Updates:</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded-full ${interaction.receiveUpdates ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                            {interaction.receiveUpdates ? "Yes, Subscribed" : "No"}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                    <button
                        onClick={() => {
                            onClose();
                            onDelete(interaction);
                        }}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1.5"
                    >
                        <Trash2 size={13} />
                        Delete Request
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Close
                        </button>
                        <a
                            href={`mailto:${interaction.email}?subject=Mashar%20Discovery%20Conversation&body=Hi%20${encodeURIComponent(interaction.name)},%0A%0AThank%20you%20for%20reaching%20out%20to%20Mashar.`}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F1C80] hover:bg-[#15237F] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                        >
                            <Mail size={13} />
                            Reply via Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Delete Modal ──
function DeleteModal({ interaction, onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Confirm Delete</p>
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Delete Discovery Request?</p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                <span className="font-semibold text-slate-700">"{interaction?.name}"</span>'s discovery request will be permanently deleted.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-red-200">
                        {loading
                            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</>
                            : <><Trash2 size={14} />Delete</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Skeleton Loader ──
function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-slate-100">
            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-2/3" /></td>
            <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded-lg w-8 inline-block" /></td>
        </tr>
    );
}

// ── Empty State ──
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5 text-indigo-500">
                <FileText size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">No discovery requests yet</h3>
            <p className="text-xs text-slate-400 font-medium text-center max-w-xs">
                No users have submitted a discovery call request yet.
            </p>
        </div>
    );
}

// ── Main Dashboard ──
export default function AdminDiscovery() {
    const { adminToken } = useAuth();
    const [interactions, setInteractions] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedInteraction, setSelectedInteraction] = useState(null);

    // Fetch interactions
    const fetchInteractions = useCallback(async () => {
        setFetching(true);
        try {
            const { data } = await axios.get("/api/discovery", {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setInteractions(data.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch discovery requests.");
        } finally {
            setFetching(false);
        }
    }, [adminToken]);

    useEffect(() => {
        fetchInteractions();
    }, [fetchInteractions]);

    // Handle real-time search debouncing
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    // Delete confirmation
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/discovery/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Discovery request deleted successfully.");
            setDeleteTarget(null);
            fetchInteractions();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete request.");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filter interactions client-side
    const filteredInteractions = interactions.filter((i) => {
        const query = search.toLowerCase();
        return (
            i.name.toLowerCase().includes(query) ||
            i.email.toLowerCase().includes(query) ||
            (i.company && i.company.toLowerCase().includes(query)) ||
            (i.helpTopic && i.helpTopic.toLowerCase().includes(query))
        );
    });

    return (
        <>
            <div className="space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Discovery Requests</h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium animate-fade-in">
                            {fetching ? "Loading list..." : `${interactions.length} active request${interactions.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    <button
                        onClick={fetchInteractions}
                        disabled={fetching}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-60 text-sm font-bold rounded-xl transition-all border border-slate-200 shadow-sm self-start sm:self-auto"
                    >
                        <RefreshCw size={15} className={fetching ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex-shrink-0">Request List</p>
                        <div className="relative sm:ml-auto sm:w-72 w-full">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or company..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-500">
                            <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="px-5 py-4 w-[240px]">Name & Email</th>
                                    <th scope="col" className="px-5 py-4 w-[160px]">Company</th>
                                    <th scope="col" className="px-5 py-4 w-[160px]">Help Topic</th>
                                    <th scope="col" className="px-5 py-4 min-w-[240px]">Challenge</th>
                                    <th scope="col" className="px-5 py-4 w-[100px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                                {fetching ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : filteredInteractions.length > 0 ? (
                                    filteredInteractions.map((i) => (
                                        <tr
                                            key={i._id}
                                            onClick={() => setSelectedInteraction(i)}
                                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-5 py-4 align-top">
                                                <p className="font-bold text-slate-900 leading-snug break-words">
                                                    {i.name}
                                                </p>
                                                <a
                                                    href={`mailto:${i.email}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="font-mono text-xs text-indigo-600 hover:underline block mt-0.5 break-all"
                                                >
                                                    {i.email}
                                                </a>
                                                {i.receiveUpdates && (
                                                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full">
                                                        WANTS UPDATES
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 align-top">
                                                {i.company ? (
                                                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 break-words" dir="auto">
                                                        {i.company}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 italic text-xs">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 align-top">
                                                <span className="text-xs font-semibold text-slate-700 block">
                                                    {i.helpTopic || "General Coaching"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 align-top">
                                                <div className="text-xs text-slate-700 break-words leading-relaxed font-medium" dir="auto">
                                                    {i.challenge}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-2">
                                                    {new Date(i.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right align-top" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setSelectedInteraction(i)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                                                        title="View Full Details"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(i)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                                                        title="Delete Request"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12">
                                            {search ? (
                                                <div className="flex flex-col items-center justify-center gap-2 text-center">
                                                    <Search size={24} className="text-slate-300 animate-bounce" />
                                                    <p className="text-xs font-bold text-slate-500">No requests match your search</p>
                                                </div>
                                            ) : (
                                                <EmptyState />
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {selectedInteraction && (
                <DetailsModal
                    interaction={selectedInteraction}
                    onClose={() => setSelectedInteraction(null)}
                    onDelete={(target) => setDeleteTarget(target)}
                />
            )}

            {/* Delete Modal */}
            {deleteTarget && (
                <DeleteModal
                    interaction={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}
        </>
    );
}
