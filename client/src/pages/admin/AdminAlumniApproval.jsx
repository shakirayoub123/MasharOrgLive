import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminAlumniApproval() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [setPasswordLink, setSetPasswordLink] = useState("");
    const [filter, setFilter] = useState("pending"); // "pending" | "all"
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const endpoint =
                filter === "pending"
                    ? "/api/v1/admin/alumni/pending"
                    : "/api/v1/admin/alumni/all";
            const res = await axios.get(endpoint);
            setAlumni(res.data.alumni);
        } catch (err) {
            setMessage({ text: "Failed to load alumni data.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, [filter]);

    const handleApprove = async (id, name) => {
        setActionLoading((prev) => ({ ...prev, [id]: "approve" }));
        setSetPasswordLink("");
        try {
            const res = await axios.put(`/api/v1/admin/alumni/${id}/approve`, {});
            setMessage({
                text: res.data.message,
                type: "success",
            });
            if (res.data.setPasswordLink) {
                setSetPasswordLink(res.data.setPasswordLink);
            }
            fetchAlumni();
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Failed to approve.",
                type: "error",
            });
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: null }));
        }
    };

    const handleResend = async (id, name) => {
        setActionLoading((prev) => ({ ...prev, [id]: "resend" }));
        setSetPasswordLink("");
        try {
            const res = await axios.put(`/api/v1/admin/alumni/${id}/resend`, {});
            setMessage({
                text: res.data.message,
                type: "success",
            });
            if (res.data.setPasswordLink) {
                setSetPasswordLink(res.data.setPasswordLink);
            }
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Failed to resend link.",
                type: "error",
            });
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: null }));
        }
    };

    const handleReject = async (id, name) => {
        setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
        try {
            await axios.put(`/api/v1/admin/alumni/${id}/reject`, {});
            setMessage({
                text: `"${name}" has been rejected.`,
                type: "info",
            });
            fetchAlumni();
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Failed to reject.",
                type: "error",
            });
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: null }));
        }
    };

    const statusBadge = (status) => {
        const styles = {
            pending:
                "bg-yellow-100 text-yellow-800 border border-yellow-300",
            approved:
                "bg-green-100 text-green-800 border border-green-300",
            rejected:
                "bg-red-100 text-red-800 border border-red-300",
        };
        return (
            <span
                className={`inline-block px-3 py-1 rounded-full text-[13px] font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"
                    }`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />

            <div className="flex-1 px-4 sm:px-8 py-10 max-w-[1200px] mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <h1 className="font-spartan font-bold text-[28px] text-[#0F1C80]">
                        Alumni Approvals
                    </h1>

                    {/* Filter tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-5 py-2 rounded-xl font-poppins text-[14px] transition ${filter === "pending"
                                ? "bg-[#0F1C80] text-white"
                                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-5 py-2 rounded-xl font-poppins text-[14px] transition ${filter === "all"
                                ? "bg-[#0F1C80] text-white"
                                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            All Alumni
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div
                        className={`px-4 py-3 rounded-xl mb-6 font-poppins text-[15px] ${message.type === "success"
                            ? "bg-green-50 border border-green-300 text-green-700"
                            : message.type === "error"
                                ? "bg-red-50 border border-red-300 text-red-700"
                                : "bg-blue-50 border border-blue-200 text-blue-700"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Set Password Link display */}
                {setPasswordLink && (
                    <div className="bg-indigo-50 border border-indigo-300 text-indigo-800 px-4 py-4 rounded-xl mb-6 font-poppins">
                        <p className="text-[14px] font-semibold mb-2">🔑 Set Password Link (share with alumni):</p>
                        <div className="flex items-center gap-2">
                            <a
                                href={setPasswordLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] text-indigo-600 underline break-all flex-1"
                            >
                                {setPasswordLink}
                            </a>
                            <button
                                onClick={() => { navigator.clipboard.writeText(setPasswordLink); setMessage({ text: "Link copied to clipboard!", type: "success" }); }}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[12px] font-medium hover:bg-indigo-700 transition whitespace-nowrap"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="py-16 text-center">
                            <div className="w-10 h-10 border-4 border-[#0F1C80] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="font-poppins text-gray-500">Loading...</p>
                        </div>
                    ) : alumni.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="font-poppins text-gray-500 text-[16px]">
                                {filter === "pending"
                                    ? "No pending registrations."
                                    : "No alumni found."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#0F1C80] text-white">
                                        <th className="px-6 py-4 font-poppins text-[14px] font-semibold">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 font-poppins text-[14px] font-semibold">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 font-poppins text-[14px] font-semibold">
                                            Phone
                                        </th>
                                        <th className="px-6 py-4 font-poppins text-[14px] font-semibold">
                                            Batch
                                        </th>
                                        <th className="px-6 py-4 font-poppins text-[14px] font-semibold">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 font-poppins text-[14px] font-semibold">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 font-poppins text-[14px] font-semibold text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumni.map((a, idx) => (
                                        <tr
                                            key={a._id}
                                            className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } hover:bg-blue-50 transition`}
                                        >
                                            <td className="px-6 py-4 font-poppins text-[15px] text-gray-800 font-medium">
                                                {a.name}
                                            </td>
                                            <td className="px-6 py-4 font-poppins text-[14px] text-gray-600">
                                                {a.email}
                                            </td>
                                            <td className="px-6 py-4 font-poppins text-[14px] text-gray-600">
                                                {a.phone || "—"}
                                            </td>
                                            <td className="px-6 py-4 font-poppins text-[14px] text-gray-600">
                                                {a.batch || "—"}
                                            </td>
                                            <td className="px-6 py-4">{statusBadge(a.status)}</td>
                                            <td className="px-6 py-4 font-poppins text-[13px] text-gray-500">
                                                {new Date(a.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {a.status === "pending" ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(a._id, a.name)}
                                                                disabled={!!actionLoading[a._id]}
                                                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-poppins text-[13px] font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {actionLoading[a._id] === "approve"
                                                                    ? "Approving..."
                                                                    : "Approve"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(a._id, a.name)}
                                                                disabled={!!actionLoading[a._id]}
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-poppins text-[13px] font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {actionLoading[a._id] === "reject"
                                                                    ? "Rejecting..."
                                                                    : "Reject"}
                                                            </button>
                                                        </>
                                                    ) : a.status === "approved" ? (
                                                        <button
                                                            onClick={() => handleResend(a._id, a.name)}
                                                            disabled={!!actionLoading[a._id]}
                                                            className="bg-[#0F1C80] text-white px-4 py-2 rounded-lg font-poppins text-[13px] font-medium hover:bg-[#0C1766] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {actionLoading[a._id] === "resend"
                                                                ? "Sending..."
                                                                : "Resend Link"}
                                                        </button>
                                                    ) : (
                                                        <span className="font-poppins text-[13px] text-gray-400">
                                                            —
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
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
