import { useState, useEffect, useCallback } from "react";
import { Trash2, Search, AlertTriangle, Mail, RefreshCw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function DeleteModal({ subscriber, onConfirm, onCancel, loading }) {
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
                            <p className="text-sm font-bold text-slate-800">Remove newsletter subscriber?</p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                <span className="text-xs font-mono text-slate-700 font-semibold">{subscriber?.email}</span> will be permanently removed from the footer newsletter list.
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
                            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Removing...</>
                            : <><Trash2 size={14} />Remove</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-slate-100">
            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-1/3" /></td>
            <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded-lg w-8 inline-block" /></td>
        </tr>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
                <Mail size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">No footer newsletter subscribers yet</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                People who subscribe using the email form in the website footer will appear here.
            </p>
        </div>
    );
}

export default function AdminFooterNewsletter() {
    const { token } = useAuth();
    const [subscribers, setSubscribers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchSubscribers = useCallback(async () => {
        setFetching(true);
        try {
            const { data } = await axios.get("/api/footer-newsletter", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubscribers(data.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch footer newsletter subscribers.");
        } finally {
            setFetching(false);
        }
    }, [token]);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 250);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/footer-newsletter/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Subscriber removed successfully.");
            setDeleteTarget(null);
            fetchSubscribers();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to remove subscriber.");
        } finally {
            setDeleting(false);
        }
    };

    const filteredSubscribers = subscribers.filter((s) =>
        (s.email || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="space-y-8 pb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Footer Newsletter</h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium animate-fade-in">
                            {fetching ? "Loading list..." : `${subscribers.length} active footer subscriber${subscribers.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    <button
                        onClick={fetchSubscribers}
                        disabled={fetching}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-60 text-sm font-bold rounded-xl transition-all border border-slate-200 shadow-sm self-start sm:self-auto"
                    >
                        <RefreshCw size={15} className={fetching ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex-shrink-0">
                            Footer Subscriber List
                        </p>
                        <div className="relative sm:ml-auto sm:w-72 w-full">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-500">
                            <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Email Address</th>
                                    <th scope="col" className="px-6 py-4">Date Subscribed</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                                {fetching ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : filteredSubscribers.length > 0 ? (
                                    filteredSubscribers.map((s) => (
                                        <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">{s.email}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                {new Date(s.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setDeleteTarget(s)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    title="Remove subscriber"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>
                                            {search ? (
                                                <div className="py-12 text-center">
                                                    <p className="text-xs font-bold text-slate-500">No subscribers match your search</p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a different email</p>
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

            {deleteTarget && (
                <DeleteModal
                    subscriber={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}
        </>
    );
}

