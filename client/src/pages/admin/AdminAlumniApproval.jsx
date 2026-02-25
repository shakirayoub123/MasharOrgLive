import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    RotateCcw,
    Clipboard,
    Search,
    Users,
    Clock,
    ExternalLink,
    Filter,
    UserCheck,
    UserPlus
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAlumniApproval() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [setPasswordLink, setSetPasswordLink] = useState("");
    const [filter, setFilter] = useState("pending"); // "pending" | "all"
    const [searchTerm, setSearchTerm] = useState("");
    const { adminToken } = useAuth();
    const navigate = useNavigate();

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const endpoint =
                filter === "pending"
                    ? "/api/v1/admin/alumni/pending"
                    : "/api/v1/admin/alumni/all";
            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setAlumni(res.data.alumni);
        } catch (err) {
            toast.error("Failed to load alumni data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminToken) {
            fetchAlumni();
        }
    }, [filter, adminToken]);

    const handleApprove = async (id, name) => {
        setActionLoading((prev) => ({ ...prev, [id]: "approve" }));
        setSetPasswordLink("");
        try {
            const res = await axios.put(`/api/v1/admin/alumni/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            toast.success(res.data.message || "Alumni approved!");
            if (res.data.setPasswordLink) {
                setSetPasswordLink(res.data.setPasswordLink);
            }
            fetchAlumni();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to approve.");
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: null }));
        }
    };

    const handleResend = async (id, name) => {
        setActionLoading((prev) => ({ ...prev, [id]: "resend" }));
        setSetPasswordLink("");
        try {
            const res = await axios.put(`/api/v1/admin/alumni/${id}/resend`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            toast.success("Set-password link resent!");
            if (res.data.setPasswordLink) {
                setSetPasswordLink(res.data.setPasswordLink);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend link.");
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: null }));
        }
    };

    const handleReject = async (id, name) => {
        setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
        try {
            await axios.put(`/api/v1/admin/alumni/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            toast.success(`"${name}" has been rejected.`);
            fetchAlumni();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject.");
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: null }));
        }
    };

    const filteredAlumni = alumni.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusBadge = (status) => {
        const styles = {
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
            rejected: "bg-rose-50 text-rose-700 border-rose-200",
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${styles[status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <UserCheck size={28} className="text-indigo-600" />
                        Alumni Registrations
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Review and approve new alumni joining the network.</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setFilter("pending")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === "pending"
                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        Pending Actions
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === "all"
                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        All History
                    </button>
                </div>
            </div>

            {/* Set Password Link Portal (Conditional) */}
            {setPasswordLink && (
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 rounded-2xl shadow-xl shadow-indigo-600/20 text-white animate-in zoom-in-95 duration-300">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <ExternalLink size={20} />
                            Action Successful
                        </div>
                        <button onClick={() => setSetPasswordLink("")} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                            <XCircle size={20} />
                        </button>
                    </div>
                    <p className="text-indigo-100 text-sm mb-4 leading-relaxed font-medium">The approval went through! Copy this link and share it with the alumni so they can set their password.</p>
                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-md">
                        <code className="flex-1 text-xs font-mono font-medium truncate px-2">{setPasswordLink}</code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(setPasswordLink);
                                toast.success("Copied to clipboard!");
                            }}
                            className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                {/* Table Toolbar */}
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                        <Filter size={16} />
                        Viewing {filteredAlumni.length} results
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-bold text-slate-400">Fetching alumni data...</p>
                        </div>
                    ) : filteredAlumni.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-slate-800 font-bold text-lg">No Results Found</h3>
                            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Alumni</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Phone / Batch</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date Joined</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAlumni.map((a) => (
                                    <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-slate-800 leading-tight">{a.name}</p>
                                                    <p className="text-[12px] text-slate-500 font-medium mt-0.5">{a.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[13px] font-bold text-slate-700">{a.phone || "—"}</p>
                                            <p className="text-[11px] text-indigo-500 font-bold mt-0.5 tracking-wider">{a.batch ? `CLASS OF ${a.batch}` : "BATCH NOT SET"}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            {statusBadge(a.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                                                <Clock size={14} />
                                                <span className="text-[12px]">
                                                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                {a.status === "pending" ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(a._id, a.name)}
                                                            disabled={!!actionLoading[a._id]}
                                                            className="h-9 px-4 bg-emerald-600 text-white rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={16} />
                                                            {actionLoading[a._id] === "approve" ? "..." : "Approve"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(a._id, a.name)}
                                                            disabled={!!actionLoading[a._id]}
                                                            className="h-9 px-4 bg-white border border-rose-200 text-rose-600 rounded-lg text-[13px] font-bold hover:bg-rose-50 transition-all disabled:opacity-50 flex items-center gap-2"
                                                        >
                                                            <XCircle size={16} />
                                                            {actionLoading[a._id] === "reject" ? "..." : "Reject"}
                                                        </button>
                                                    </>
                                                ) : a.status === "approved" ? (
                                                    <button
                                                        onClick={() => handleResend(a._id, a.name)}
                                                        disabled={!!actionLoading[a._id]}
                                                        className="h-9 px-4 bg-slate-900 text-white rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        <RotateCcw size={16} />
                                                        {actionLoading[a._id] === "resend" ? "..." : "Resend"}
                                                    </button>
                                                ) : (
                                                    <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest italic">Archived</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
