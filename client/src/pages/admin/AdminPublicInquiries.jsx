import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const AdminPublicInquiries = () => {
    const { adminToken } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await axios.get("/api/admin/public-inquiries", {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (res.data.success) {
                setInquiries(res.data.submissions);
            }
        } catch (err) {
            toast.error("Failed to load inquiries");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`/api/admin/public-inquiries/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            toast.success("Status updated");
            fetchInquiries();
            if (selectedInquiry && selectedInquiry._id === id) {
                setSelectedInquiry({ ...selectedInquiry, status });
            }
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    const deleteInquiry = async (id) => {
        if (!window.confirm("Delete this inquiry forever?")) return;
        try {
            await axios.delete(`/api/admin/public-inquiries/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            toast.success("Inquiry deleted");
            setInquiries(inquiries.filter(i => i._id !== id));
            if (selectedInquiry && selectedInquiry._id === id) setSelectedInquiry(null);
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    return (
        <div className="w-full font-poppins">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#14247B]">Live Website Inquiries</h1>
                <p className="text-gray-500 mt-1">Manage submissions from the "Let's Talk" portal.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left List Pane */}
                <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[75vh] flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">Recent Messages</div>
                    <div className="overflow-y-auto flex-1">
                        {loading ? <p className="p-4 text-gray-400">Loading...</p> : inquiries.length === 0 ? <p className="p-4 text-gray-400">No inquiries found.</p> : inquiries.map(inq => (
                            <div
                                key={inq._id}
                                onClick={() => setSelectedInquiry(inq)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedInquiry?._id === inq._id ? 'border-l-4 border-l-[#14247B] bg-blue-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-[#14247B] truncate">{inq.name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inq.status === 'New' ? 'bg-orange-100 text-orange-700' : inq.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{inq.status}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{inq.service || 'General Inquiry'}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(inq.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Details Pane */}
                <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 h-[75vh] flex flex-col p-6 overflow-y-auto">
                    {!selectedInquiry ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p>Select an inquiry from the list to view details</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#14247B]">{selectedInquiry.name}</h2>
                                    <p className="text-sm text-gray-500"><a href={`mailto:${selectedInquiry.email}`} className="text-blue-500 hover:underline">{selectedInquiry.email}</a> • {selectedInquiry.phone || 'No phone'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => updateStatus(selectedInquiry._id, 'Reviewed')} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-semibold hover:bg-blue-100">Mark Reviewed</button>
                                    <button onClick={() => updateStatus(selectedInquiry._id, 'Replied')} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md text-sm font-semibold hover:bg-green-100">Mark Replied</button>
                                    <button onClick={() => deleteInquiry(selectedInquiry._id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-semibold hover:bg-red-100">Delete</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-gray-500 font-medium mb-1">Organization</p>
                                    <p className="font-semibold text-gray-800">{selectedInquiry.organization || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-gray-500 font-medium mb-1">Service Type</p>
                                    <p className="font-semibold text-gray-800">{selectedInquiry.service || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700 mb-2">Message Content</h4>
                                <div className="p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed text-sm min-h-[150px]">
                                    {selectedInquiry.message || <span className="text-gray-400 italic">No message provided.</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPublicInquiries;
