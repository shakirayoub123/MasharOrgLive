import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import { resolveAssetUrl } from "../../utils/baseUrl";
import { 
    Plus, 
    Upload, 
    Edit3, 
    Trash2, 
    Eye, 
    EyeOff, 
    Search, 
    Shield, 
    Award,
    Users,
    Clock,
    CheckCircle,
    AlertTriangle
} from "lucide-react";

function imgSrc(image) {
    return resolveAssetUrl(image);
}

const CATEGORIES = [
    { value: "achievement", label: "🏆 Achievement", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { value: "skill", label: "🎯 Skill", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "participation", label: "🤝 Participation", color: "bg-green-50 text-green-700 border-green-200" },
    { value: "leadership", label: "👑 Leadership", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { value: "other", label: "📋 Other", color: "bg-gray-50 text-gray-700 border-gray-200" }
];

// ─── CONFIRM DELETE DIALOG ────────────────────────────────────────────────────
function ConfirmDialog({ badge, onConfirm, onCancel }) {
    return (
        <>
            <div className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-[min(400px,92vw)] bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden"
                style={{ animation: "modalIn .18s ease" }}>
                <div className="h-[3px] bg-gradient-to-r from-red-400 to-red-600" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                            <AlertTriangle className="text-red-500" size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-[#0D1240] text-base">Delete Badge</h3>
                            <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone</p>
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 leading-relaxed mb-5">
                        Are you sure you want to delete <span className="font-black text-[#0D1240]">"{badge.name}"</span>? 
                        Alumni who have requested this badge will no longer be able to see it.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2">
                            <Trash2 size={14} />
                            Delete Badge
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function AdminBadgeManagement() {
    const { adminToken } = useAuth();
    const [badges, setBadges] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        badgeId: "",
        category: "achievement",
        criteria: "",
        sortOrder: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Load badges and stats
    const loadData = async () => {
        setLoading(true);
        try {
            const [badgesRes, statsRes] = await Promise.all([
                API.get("/admin/badges", { headers: { Authorization: `Bearer ${adminToken}` } }),
                API.get("/admin/badges/stats", { headers: { Authorization: `Bearer ${adminToken}` } })
            ]);

            if (badgesRes.data.success) setBadges(badgesRes.data.data);
            if (statsRes.data.success) setStats(statsRes.data.data);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load badge data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.badgeId) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!editingBadge && !imageFile) {
            toast.error("Please select a badge image");
            return;
        }

        setSubmitting(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                fd.append(key, formData[key]);
            });
            if (imageFile) fd.append("image", imageFile);

            let res;
            if (editingBadge) {
                res = await API.put(`/admin/badges/${editingBadge._id}`, fd, {
                    headers: { 
                        Authorization: `Bearer ${adminToken}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                res = await API.post("/admin/badges", fd, {
                    headers: { 
                        Authorization: `Bearer ${adminToken}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            if (res.data.success) {
                toast.success(editingBadge ? "Badge updated successfully" : "Badge created successfully");
                closeModal();
                loadData();
            }
        } catch (error) {
            console.error("Error saving badge:", error);
            toast.error(error.response?.data?.message || "Failed to save badge");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle badge deletion
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await API.delete(`/admin/badges/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (res.data.success) {
                toast.success("Badge deleted successfully");
                setDeleteTarget(null);
                loadData();
            }
        } catch (error) {
            console.error("Error deleting badge:", error);
            toast.error(error.response?.data?.message || "Failed to delete badge");
            setDeleteTarget(null);
        }
    };

    // Handle badge activation toggle
    const handleToggleActive = async (badge) => {
        try {
            const res = await API.put(`/admin/badges/${badge._id}`, 
                { isActive: !badge.isActive },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );

            if (res.data.success) {
                toast.success(`Badge ${badge.isActive ? 'deactivated' : 'activated'} successfully`);
                loadData();
            }
        } catch (error) {
            console.error("Error toggling badge status:", error);
            toast.error("Failed to update badge status");
        }
    };

    // Open modal for creating/editing
    const openModal = (badge = null) => {
        if (badge) {
            setEditingBadge(badge);
            setFormData({
                name: badge.name,
                description: badge.description,
                badgeId: badge.badgeId,
                category: badge.category,
                criteria: badge.criteria || "",
                sortOrder: badge.sortOrder || 0
            });
            setImagePreview(imgSrc(badge.image));
        } else {
            setEditingBadge(null);
            setFormData({
                name: "",
                description: "",
                badgeId: "",
                category: "achievement",
                criteria: "",
                sortOrder: 0
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBadge(null);
        setImageFile(null);
        setImagePreview(null);
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Filter badges
    const filteredBadges = badges.filter(badge => {
        const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            badge.badgeId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || badge.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Toaster position="top-center" />
            
            <div className="w-full min-h-screen bg-[#F6F7FD] p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#0F1C80] to-[#F38900]" />
                            <h1 className="text-2xl font-black text-[#0D1240] leading-none">Badge Management</h1>
                        </div>
                        <p className="text-sm text-gray-400 ml-3">Create and manage achievement badges</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F1C80] text-white text-sm font-black shadow-lg shadow-[#0F1C80]/20 hover:bg-[#1A2FA0] transition-colors relative overflow-hidden"
                    >
                        <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#F38900] rounded-r-xl" />
                        <Plus size={16} />
                        Create Badge
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-blue-50">
                            <Shield className="text-[#0F1C80]" size={20} />
                        </div>
                        <div>
                            <p className="text-xl font-black leading-none text-[#0F1C80]">{stats.totalBadges || 0}</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">Total Badges</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-amber-50">
                            <Clock className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xl font-black leading-none text-amber-600">{stats.pendingRequests || 0}</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">Pending</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-green-50">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xl font-black leading-none text-green-600">{stats.approvedRequests || 0}</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">Approved</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-slate-50">
                            <Users className="text-gray-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xl font-black leading-none text-gray-600">{stats.totalRequests || 0}</p>
                            <p className="text-[10px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">Total Requests</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-slate-100 p-3 mb-4 flex items-center gap-3 flex-wrap shadow-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-[#EEF0FF] rounded-xl px-3 py-2 border border-[#DDE0FF]">
                        <Search className="text-gray-400" size={16} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search badges..."
                            className="flex-1 bg-transparent text-sm text-[#0D1240] outline-none placeholder:text-gray-400 min-w-0"
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 bg-[#EEF0FF] border border-[#DDE0FF] rounded-xl text-sm text-[#0D1240] outline-none"
                    >
                        <option value="all">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Badge Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 border-2 border-[#0F1C80] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading badges...</p>
                    </div>
                ) : filteredBadges.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                        <Award className="mx-auto text-gray-200 mb-3" size={48} />
                        <p className="font-black text-[#0D1240] text-base">No badges found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {searchQuery ? "Try a different search term" : "Create your first badge!"}
                        </p>
                        <button 
                            onClick={() => openModal()}
                            className="mt-4 px-5 py-2.5 rounded-xl bg-[#0F1C80] text-white text-sm font-bold hover:bg-[#1A2FA0] transition-colors"
                        >
                            <Plus size={16} className="inline mr-2" />
                            Create Badge
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBadges.map(badge => {
                            const categoryInfo = CATEGORIES.find(c => c.value === badge.category);
                            return (
                                <div key={badge._id} className="bg-white rounded-2xl border border-slate-100 hover:border-[#DDE0FF] hover:shadow-md transition-all group overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                                                <img 
                                                    src={imgSrc(badge.image)} 
                                                    alt={badge.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🏆</div>';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-black text-[#0D1240] text-sm leading-tight truncate">{badge.name}</h3>
                                                    {!badge.isActive && (
                                                        <EyeOff className="text-gray-400 shrink-0" size={14} />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{badge.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryInfo?.color || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                                        {categoryInfo?.label || badge.category}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">#{badge.badgeId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleToggleActive(badge)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
                                                    badge.isActive 
                                                        ? "bg-gray-50 text-gray-600 hover:bg-gray-100" 
                                                        : "bg-green-50 text-green-600 hover:bg-green-100"
                                                }`}
                                            >
                                                {badge.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
                                                {badge.isActive ? "Hide" : "Show"}
                                            </button>
                                            <button
                                                onClick={() => openModal(badge)}
                                                className="flex-1 py-2 rounded-lg bg-[#FFF4E0] text-[#F38900] text-xs font-bold hover:bg-[#FFE4B0] transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Edit3 size={12} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(badge)}
                                                className="flex-1 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Trash2 size={12} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (                <>
                    <div onClick={closeModal} className="fixed inset-0 z-[9980] bg-[#0F1C80]/15 backdrop-blur-sm" />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9981] w-[min(600px,95vw)] max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#DDE0FF] flex flex-col overflow-hidden">
                        <div className="h-[3px] shrink-0 bg-gradient-to-r from-[#0F1C80] to-[#F38900]" />
                        
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#EEF0FF] shrink-0">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-[#EEF0FF]">
                                {editingBadge ? "✏️" : "➕"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-black text-[#0D1240] text-base">
                                    {editingBadge ? "Edit Badge" : "Create New Badge"}
                                </h2>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    {editingBadge ? "Update badge information" : "Add a new achievement badge"}
                                </p>
                            </div>
                            <button onClick={closeModal} className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-sm hover:bg-[#DDE0FF] transition-colors shrink-0">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-2 block">
                                    Badge Image {!editingBadge && "*"}
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#DDE0FF] bg-[#EEF0FF] flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="text-[#0F1C80]" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#EEF0FF] file:text-[#0F1C80] hover:file:bg-[#DDE0FF] file:cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">
                                        Badge Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g., Pioneer Badge"
                                        className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">
                                        Badge ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.badgeId}
                                        onChange={(e) => setFormData({...formData, badgeId: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                                        placeholder="e.g., pioneer"
                                        className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe what this badge represents..."
                                    rows={3}
                                    className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                                        placeholder="0"
                                        className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest opacity-60 mb-1 block">
                                    Criteria (Optional)
                                </label>
                                <textarea
                                    value={formData.criteria}
                                    onChange={(e) => setFormData({...formData, criteria: e.target.value})}
                                    placeholder="What are the requirements to earn this badge?"
                                    rows={2}
                                    className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-2.5 rounded-xl border border-[#DDE0FF] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex-[2] py-2.5 rounded-xl text-sm font-black transition-all relative overflow-hidden ${
                                        submitting 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                            : "bg-[#0F1C80] text-white shadow-lg shadow-[#0F1C80]/20 hover:bg-[#1A2FA0]"
                                    }`}
                                >
                                    {!submitting && <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#F38900] rounded-r-xl" />}
                                    {submitting ? "Saving..." : (editingBadge ? "Update Badge" : "Create Badge")}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* ✅ Delete Confirmation Dialog */}
            {deleteTarget && (
                <ConfirmDialog
                    badge={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <style>{`@keyframes modalIn { from { opacity:0; transform:translate(-50%,-47%) } to { opacity:1; transform:translate(-50%,-50%) } }`}</style>
        </>
    );
}