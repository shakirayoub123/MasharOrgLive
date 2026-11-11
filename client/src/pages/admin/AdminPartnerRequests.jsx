import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Handshake, Search, Filter, RefreshCw, Eye, Trash2, Mail, Phone,
    Globe, Building2, Calendar, CheckCircle2, Clock, X, ExternalLink,
    AlertCircle, MessageSquare, ChevronDown, Check, User, MapPin, Award
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATUS_COLORS = {
    Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    Reviewed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    Contacted: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
    Approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    Declined: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
    Closed: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" },
};

export default function AdminPartnerRequests() {
    const { adminToken } = useAuth();
    const [requests, setRequests] = useState([]);
    const [counts, setCounts] = useState({ total: 0, pending: 0, reviewed: 0, contacted: 0, approved: 0, declined: 0 });
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    // Modal
    const [activeRequest, setActiveRequest] = useState(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter, typeFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== "All") params.status = statusFilter;
            if (typeFilter !== "All") params.type = typeFilter;
            if (search.trim()) params.search = search.trim();

            const res = await axios.get("/api/admin/partner-requests", {
                headers: { Authorization: `Bearer ${adminToken}` },
                params,
            });

            if (res.data.success) {
                setRequests(res.data.requests || []);
                if (res.data.counts) setCounts(res.data.counts);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load partner requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRequests();
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdatingStatus(true);
        try {
            const res = await axios.patch(
                `/api/admin/partner-requests/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );

            if (res.data.success) {
                toast.success(`Status updated to ${newStatus}`);
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
                if (activeRequest && activeRequest._id === id) {
                    setActiveRequest(prev => ({ ...prev, status: newStatus }));
                }
                // Refresh summary counts
                fetchRequests();
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update status.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!activeRequest) return;
        setSavingNotes(true);
        try {
            const res = await axios.patch(
                `/api/admin/partner-requests/${activeRequest._id}/notes`,
                { adminNotes },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );

            if (res.data.success) {
                toast.success("Notes saved!");
                setRequests(prev => prev.map(r => r._id === activeRequest._id ? { ...r, adminNotes } : r));
                setActiveRequest(prev => ({ ...prev, adminNotes }));
            }
        } catch (err) {
            toast.error("Failed to save notes.");
        } finally {
            setSavingNotes(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete the partner request from "${name}"?`)) return;

        try {
            await axios.delete(`/api/admin/partner-requests/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Partner request deleted.");
            setRequests(prev => prev.filter(r => r._id !== id));
            if (activeRequest && activeRequest._id === id) {
                setActiveRequest(null);
            }
            fetchRequests();
        } catch (err) {
            toast.error("Failed to delete partner request.");
        }
    };

    const openDetailsModal = (req) => {
        setActiveRequest(req);
        setAdminNotes(req.adminNotes || "");
    };

    return (
        <div className="w-full font-poppins pb-16">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1C80]/10 text-[#0F1C80] text-xs font-bold uppercase tracking-wider mb-2">
                        <Handshake size={14} />
                        <span>Partner Network Module</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-spartan text-[#0D1240]">
                        Partner &amp; Team Applications
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Review, track, and manage applications submitted through the Become a Partner portal.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchRequests}
                    className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-bold text-[#0F1C80] bg-white border border-[#DDE0FF] hover:bg-[#F8F9FF] transition-all flex items-center gap-2 shadow-sm"
                >
                    <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Inquiries</p>
                        <p className="text-2xl font-black font-spartan text-[#0D1240] mt-1">{counts.total}</p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center font-bold">
                        <Handshake size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Review</p>
                        <p className="text-2xl font-black font-spartan text-amber-700 mt-1">{counts.pending}</p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Clock size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">In Contact</p>
                        <p className="text-2xl font-black font-spartan text-purple-700 mt-1">{counts.contacted + counts.reviewed}</p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <MessageSquare size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Approved</p>
                        <p className="text-2xl font-black font-spartan text-emerald-700 mt-1">{counts.approved}</p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 size={20} />
                    </div>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-3">
                <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by company, applicant, email, phone, or region..."
                            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-gray-50/50"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F1C80] hover:bg-[#14247B] transition-all"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                    </select>

                    {/* Track filter */}
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20"
                    >
                        <option value="All">All Tracks</option>
                        <option value="Delivery Partner">Delivery & Training Partner</option>
                        <option value="Consulting Partner">Consulting & Advisory Partner</option>
                        <option value="Strategic Alliance">Academic & Strategic Alliance</option>
                        <option value="Coach Network">Associate Coach & Facilitator</option>
                    </select>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 space-y-2">
                        <RefreshCw size={24} className="animate-spin mx-auto text-[#0F1C80]" />
                        <p className="text-sm font-medium">Loading partner inquiries...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 space-y-2">
                        <Handshake size={32} className="mx-auto text-gray-300" />
                        <p className="text-base font-bold text-gray-600">No partner requests found</p>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                            {statusFilter !== "All" || typeFilter !== "All" || search
                                ? "Try adjusting your search criteria or filters."
                                : "When users submit the Become a Partner form, their inquiries will appear here."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-[#F8F9FF] border-b border-gray-200/80 text-[11px] font-black uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="py-3.5 px-5">Organization &amp; Applicant</th>
                                    <th className="py-3.5 px-4">Partnership Track</th>
                                    <th className="py-3.5 px-4">Region</th>
                                    <th className="py-3.5 px-4">Contact</th>
                                    <th className="py-3.5 px-4">Date</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map(req => {
                                    const st = STATUS_COLORS[req.status] || STATUS_COLORS.Pending;
                                    return (
                                        <tr key={req._id} className="hover:bg-gray-50/70 transition-colors">
                                            {/* Organization & Applicant */}
                                            <td className="py-4 px-5">
                                                <div className="font-bold text-[#0D1240] text-sm">
                                                    {req.company || "Independent"}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                    <span className="font-medium text-gray-700">{req.firstName} {req.lastName}</span>
                                                    {req.jobTitle && <span className="text-gray-400">• {req.jobTitle}</span>}
                                                </div>
                                            </td>

                                            {/* Partnership Track */}
                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EEF0FF] text-[#0F1C80] border border-[#DDE0FF]">
                                                    {req.partnershipType || "Partner"}
                                                </span>
                                            </td>

                                            {/* Region */}
                                            <td className="py-4 px-4 text-xs text-gray-600 font-medium">
                                                {req.region || "GCC"}
                                            </td>

                                            {/* Contact */}
                                            <td className="py-4 px-4">
                                                <div className="space-y-0.5">
                                                    <a
                                                        href={`mailto:${req.email}`}
                                                        className="text-xs text-blue-600 hover:underline block truncate max-w-[160px]"
                                                        title={req.email}
                                                    >
                                                        {req.email}
                                                    </a>
                                                    <a
                                                        href={`tel:${req.phone}`}
                                                        className="text-[11px] text-gray-400 hover:text-gray-600 block"
                                                    >
                                                        {req.phone}
                                                    </a>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-4 text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(req.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-4">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={req.status || "Pending"}
                                                        onChange={e => handleUpdateStatus(req._id, e.target.value)}
                                                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${st.bg} ${st.text} ${st.border}`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Reviewed">Reviewed</option>
                                                        <option value="Contacted">Contacted</option>
                                                        <option value="Approved">Approved</option>
                                                        <option value="Declined">Declined</option>
                                                        <option value="Closed">Closed</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-5 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openDetailsModal(req)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#0F1C80] hover:bg-[#EEF0FF] transition-all"
                                                        title="View Complete Application"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(req._id, `${req.firstName} ${req.lastName} (${req.company})`)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                        title="Delete Request"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                APPLICATION DETAIL MODAL
            ═══════════════════════════════════════════════════════════════════ */}
            {activeRequest && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-[#F8F9FF] to-white rounded-t-3xl">
                            <div>
                                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#0F1C80] border border-[#DDE0FF] mb-2">
                                    <Handshake size={12} />
                                    <span>{activeRequest.partnershipType || "Partner Application"}</span>
                                </div>
                                <h2 className="text-xl font-bold font-spartan text-[#0D1240]">
                                    {activeRequest.company || "Independent Applicant"}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Submitted by {activeRequest.firstName} {activeRequest.lastName} on {new Date(activeRequest.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveRequest(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs sm:text-sm">
                            {/* Status and Quick Action Bar */}
                            <div className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#DDE0FF] flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-600">Application Status:</span>
                                    <select
                                        value={activeRequest.status || "Pending"}
                                        onChange={e => handleUpdateStatus(activeRequest._id, e.target.value)}
                                        disabled={updatingStatus}
                                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Reviewed">Reviewed</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Declined">Declined</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={`mailto:${activeRequest.email}?subject=Mashar%20Partner%20Inquiry%20-%20${encodeURIComponent(activeRequest.company || "")}`}
                                        className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#0F1C80] text-white hover:bg-[#14247B] transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Mail size={13} />
                                        <span>Send Email</span>
                                    </a>
                                    <a
                                        href={`tel:${activeRequest.phone}`}
                                        className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5"
                                    >
                                        <Phone size={13} />
                                        <span>Call / WhatsApp</span>
                                    </a>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Contact Person</p>
                                    <p className="font-bold text-[#0D1240] text-sm mt-1">{activeRequest.firstName} {activeRequest.lastName}</p>
                                    <p className="text-xs text-gray-500">{activeRequest.jobTitle || "Representative"}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Operating Region</p>
                                    <p className="font-bold text-[#0D1240] text-sm mt-1">{activeRequest.region || "Not specified"}</p>
                                    <p className="text-xs text-gray-500">Target Geographical Market</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email Address</p>
                                    <a href={`mailto:${activeRequest.email}`} className="font-bold text-blue-600 text-sm mt-1 block truncate hover:underline">
                                        {activeRequest.email}
                                    </a>
                                </div>

                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Phone / WhatsApp</p>
                                    <a href={`tel:${activeRequest.phone}`} className="font-bold text-[#0D1240] text-sm mt-1 block hover:underline">
                                        {activeRequest.phone}
                                    </a>
                                </div>
                            </div>

                            {/* Website Link */}
                            {activeRequest.website && (
                                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-gray-400" />
                                        <span className="text-xs text-gray-600 font-medium">Company Website:</span>
                                        <span className="text-xs font-bold text-gray-800">{activeRequest.website}</span>
                                    </div>
                                    <a
                                        href={activeRequest.website.startsWith("http") ? activeRequest.website : `https://${activeRequest.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-bold"
                                    >
                                        <span>Open</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            )}

                            {/* Application Message / Pitch */}
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                                    Partnership Vision &amp; Audience Details
                                </p>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                    {activeRequest.message || "No detailed message provided with this submission."}
                                </div>
                            </div>

                            {/* Admin Internal Notes */}
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                        <MessageSquare size={14} className="text-[#0F1C80]" />
                                        <span>Internal Admin Notes</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleSaveNotes}
                                        disabled={savingNotes}
                                        className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#0F1C80] hover:bg-[#14247B] transition-all disabled:opacity-50"
                                    >
                                        {savingNotes ? "Saving..." : "Save Notes"}
                                    </button>
                                </div>
                                <textarea
                                    rows={3}
                                    value={adminNotes}
                                    onChange={e => setAdminNotes(e.target.value)}
                                    placeholder="Add private administrative notes regarding this applicant, call outcomes, or next steps..."
                                    className="w-full p-3 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-white"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 px-6 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-3xl">
                            <button
                                type="button"
                                onClick={() => handleDelete(activeRequest._id, `${activeRequest.firstName} ${activeRequest.lastName}`)}
                                className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 size={14} />
                                <span>Delete Application</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveRequest(null)}
                                className="px-5 py-2 rounded-xl text-xs font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

