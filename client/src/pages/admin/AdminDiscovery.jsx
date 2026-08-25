import { useState, useEffect, useCallback } from "react";
import { Trash2, Search, AlertTriangle, FileText, RefreshCw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

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
                        <table className="w-full border-collapse text-left text-sm text-slate-500 table-fixed">
                            <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="px-4 py-4 w-1/6">Name / Email</th>
                                    <th scope="col" className="px-4 py-4 w-1/6">Company</th>
                                    <th scope="col" className="px-4 py-4 w-1/6">Help Topic</th>
                                    <th scope="col" className="px-4 py-4 w-1/3">Challenge</th>
                                    <th scope="col" className="px-4 py-4 w-[120px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                                {fetching ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : filteredInteractions.length > 0 ? (
                                    filteredInteractions.map((i) => (
                                        <tr key={i._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-slate-800 truncate" title={i.name}>{i.name}</p>
                                                <p className="font-mono text-[11px] text-slate-500 truncate mt-0.5" title={i.email}>{i.email}</p>
                                                {i.receiveUpdates && (
                                                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded">
                                                        WANTS UPDATES
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {i.company ? (
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 truncate max-w-full" title={i.company}>
                                                        {i.company}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 italic text-xs">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-xs font-medium text-slate-700 truncate" title={i.helpTopic}>
                                                {i.helpTopic}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-xs text-slate-600 break-words leading-relaxed max-h-20 overflow-y-auto custom-scrollbar pr-2">
                                                    {i.challenge}
                                                </div>
                                                <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider mt-2">
                                                    {new Date(i.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right align-top">
                                                <button
                                                    onClick={() => setDeleteTarget(i)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50/30 transition-all focus:opacity-100"
                                                    title="Delete Request"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
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
