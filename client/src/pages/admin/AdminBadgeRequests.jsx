import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { ShieldCheck, XCircle, Clock, Search, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { resolveAssetUrl } from "../../utils/baseUrl";

export default function AdminBadgeRequests() {
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("pending"); // pending, approved, rejected, all

    const token = localStorage.getItem("admin_token");

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/admin/badges/requests", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                // Separate pending and history
                const pending = res.data.data.filter(r => r.status === "pending");
                const nonPending = res.data.data.filter(r => r.status !== "pending");
                setRequests(pending);
                setHistory(nonPending);
            }
        } catch (error) {
            console.error("Error fetching badge requests:", error);
            toast.error("Failed to load badge requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (alumniId, badgeId, status) => {
        try {
            const res = await axios.put(`/api/admin/badges/${alumniId}/${badgeId}/${status}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(`Badge ${status} successfully!`);
                // Refresh both lists
                await fetchRequests();
            }
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${status} badge`);
        }
    };

    const getFilteredData = () => {
        let data = [];
        if (activeTab === "pending") data = requests;
        else if (activeTab === "approved") data = history.filter(h => h.status === "approved");
        else if (activeTab === "rejected") data = history.filter(h => h.status === "rejected");
        else data = [...requests, ...history];

        return data.filter(req =>
            req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const resolveAvatar = (url) => {
        return resolveAssetUrl(url);
    };

    const getBadgeEmoji = (badgeId) => {
        const emojis = { pioneer: "🚀", mentor: "🎓", champion: "🏆" };
        return emojis[badgeId] || "🎖️";
    };

    const filteredData = getFilteredData();
    const pendingCount = requests.length;
    const approvedCount = history.filter(h => h.status === "approved").length;
    const rejectedCount = history.filter(h => h.status === "rejected").length;

    return (
        <div className="space-y-6 mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#0D1240] flex items-center gap-2">
                        <Shield className="text-[#2F80C7]" size={28} />
                        Badge Management
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                        Review, approve, and track alumni achievement badge requests.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80C7]/20 focus:border-[#2F80C7] transition-all"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
                            <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</p>
                        </div>
                        <Clock className="text-amber-400" size={32} />
                    </div>
                </div>

                <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved</p>
                            <p className="text-2xl font-black text-emerald-700 mt-1">{approvedCount}</p>
                        </div>
                        <CheckCircle className="text-emerald-400" size={32} />
                    </div>
                </div>

                <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Rejected</p>
                            <p className="text-2xl font-black text-rose-700 mt-1">{rejectedCount}</p>
                        </div>
                        <AlertCircle className="text-rose-400" size={32} />
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-1 flex items-center gap-1 w-fit">
                {[
                    { id: "pending", label: "Pending", icon: Clock },
                    { id: "approved", label: "Approved", icon: CheckCircle },
                    { id: "rejected", label: "Rejected", icon: XCircle },
                    { id: "all", label: "All Requests", icon: Shield },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                                    ? "bg-[#2F80C7] text-white shadow-md"
                                    : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* List Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        {activeTab === "pending" && <Clock className="text-amber-500" size={18} />}
                        {activeTab === "approved" && <CheckCircle className="text-emerald-500" size={18} />}
                        {activeTab === "rejected" && <XCircle className="text-rose-500" size={18} />}
                        {activeTab === "all" && <Shield className="text-[#2F80C7]" size={18} />}
                        {activeTab === "pending" && "Pending Approvals"}
                        {activeTab === "approved" && "Approved Badges"}
                        {activeTab === "rejected" && "Rejected Requests"}
                        {activeTab === "all" && "All Badge Requests"}
                        <span className={`py-0.5 px-2.5 rounded-full text-xs font-black ml-2 ${activeTab === "pending" ? "bg-amber-100 text-amber-700" :
                                activeTab === "approved" ? "bg-emerald-100 text-emerald-700" :
                                    activeTab === "rejected" ? "bg-rose-100 text-rose-700" :
                                        "bg-blue-100 text-blue-700"
                            }`}>
                            {filteredData.length}
                        </span>
                    </h2>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 font-medium animate-pulse">
                            Loading requests...
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <Shield className="text-slate-200 mb-3" size={48} />
                            <h3 className="text-lg font-bold text-slate-700">No requests found</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                {searchQuery ? "No requests match your search." : `No ${activeTab} badge requests.`}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                        <th className="px-6 py-4 font-bold">Alumni</th>
                                        <th className="px-6 py-4 font-bold">Badge</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                        <th className="px-6 py-4 font-bold">Date</th>
                                        {activeTab === "pending" && <th className="px-6 py-4 font-bold text-right">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.map((req) => (
                                        <tr key={`${req.alumniId}-${req.badgeId}`} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {req.avatar ? (
                                                        <img src={resolveAvatar(req.avatar)} alt={req.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                            {req.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800">{req.name}</p>
                                                        <p className="text-[11px] text-slate-500 font-medium">{req.email} • {req.course || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#EEF0FF] text-[#0F1C80] border border-[#DDE0FF]">
                                                    {getBadgeEmoji(req.badgeId)} {req.badgeId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${req.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                        req.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                                            "bg-amber-50 text-amber-700 border border-amber-200"
                                                    }`}>
                                                    {req.status === "approved" && <CheckCircle size={14} />}
                                                    {req.status === "rejected" && <XCircle size={14} />}
                                                    {req.status === "pending" && <Clock size={14} />}
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                                {new Date(req.requestedAt || req.approvedAt || req.rejectedAt).toLocaleDateString()}
                                            </td>
                                            {activeTab === "pending" && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleAction(req.alumniId, req.badgeId, "rejected")}
                                                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                                            title="Reject Request"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.alumniId, req.badgeId, "approved")}
                                                            className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                                                        >
                                                            <ShieldCheck size={16} />
                                                            Approve
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}