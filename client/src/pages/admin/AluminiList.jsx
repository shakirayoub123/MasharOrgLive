import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
    Users,
    Search,
    Filter,
    Mail,
    User,
    Calendar,
    ChevronRight,
    MoreVertical,
    Download,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function AluminiList() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { adminToken } = useAuth();

    useEffect(() => {
        fetchAlumni();
    }, [adminToken]);

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/v1/admin/alumni/all", {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setAlumni(res.data.alumni);
        } catch (error) {
            toast.error("Failed to load alumni directory");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAlumni = alumni.filter(a => {
        const matchesSearch =
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || a.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusBadge = (status) => {
        const styles = {
            approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            rejected: "bg-rose-50 text-rose-700 border-rose-200",
        };
        const icons = {
            approved: <CheckCircle size={12} />,
            pending: <Clock size={12} />,
            rejected: <XCircle size={12} />,
        };

        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                {icons[status]}
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <Users size={32} className="text-indigo-600" />
                        Alumni Directory
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and view all registered members in your network.</p>
                </div>

                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Members</p>
                    <h3 className="text-3xl font-black text-slate-800">{alumni.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Active Accounts</p>
                    <h3 className="text-3xl font-black text-emerald-600">{alumni.filter(a => a.status === 'approved').length}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Pending Review</p>
                    <h3 className="text-3xl font-black text-amber-600">{alumni.filter(a => a.status === 'pending').length}</h3>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, batch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {['all', 'approved', 'pending', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${statusFilter === s
                                ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Member Info</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Batch/Program</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Joined On</th>
                                <th className="px-8 py-5 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6"><div className="h-4 w-32 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-6 py-6"><div className="h-4 w-24 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-6 py-6"><div className="h-6 w-16 bg-slate-100 rounded-full"></div></td>
                                        <td className="px-6 py-6"><div className="h-4 w-28 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-8 py-6 text-right"><div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredAlumni.length > 0 ? (
                                filteredAlumni.map((a) => (
                                    <tr key={a._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                                                    {a.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{a.name}</p>
                                                    <p className="text-slate-400 text-xs flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {a.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-semibold text-slate-700">{a.batch}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{a.fieldOfStudy}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            {statusBadge(a.status)}
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-sm text-slate-500 font-medium">
                                                {new Date(a.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-slate-400 font-bold">No members found matching your search</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                {!loading && filteredAlumni.length > 0 && (
                    <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium">Showing {filteredAlumni.length} results</p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
