import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Star,
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    Save,
    X,
    User,
    Briefcase,
    MapPin,
    GraduationCap,
    Quote,
    Sparkles,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

const EMPTY_FORM = {
    name: "",
    initials: "",
    role: "",
    location: "",
    batch: "",
    quote: "",
    gradientFrom: "#C9A84C",
    gradientTo: "#2A6B7C",
    active: true,
};

export default function AdminSpotlight() {
    const { adminToken } = useAuth();
    const [spotlights, setSpotlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchSpotlights();
    }, [adminToken]);

    const fetchSpotlights = async () => {
        try {
            const res = await axios.get("/api/v1/admin/spotlights", {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setSpotlights(res.data.spotlights || []);
        } catch (err) {
            toast.error("Failed to load spotlights");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (s) => {
        setForm({
            name: s.name,
            initials: s.initials,
            role: s.role,
            location: s.location,
            batch: s.batch,
            quote: s.quote,
            gradientFrom: s.gradientFrom || "#C9A84C",
            gradientTo: s.gradientTo || "#2A6B7C",
            active: s.active,
        });
        setEditingId(s._id);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.quote) {
            toast.error("Name and quote are required");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await axios.put(`/api/v1/admin/spotlights/${editingId}`, form, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                toast.success("Spotlight updated");
            } else {
                await axios.post("/api/v1/admin/spotlights", form, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                toast.success("Spotlight created");
            }
            setShowForm(false);
            fetchSpotlights();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (s) => {
        try {
            await axios.put(
                `/api/v1/admin/spotlights/${s._id}`,
                { ...s, active: !s.active },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success(`Spotlight ${!s.active ? "activated" : "hidden"}`);
            fetchSpotlights();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/v1/admin/spotlights/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Spotlight deleted");
            setDeleteConfirm(null);
            fetchSpotlights();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const autoInitials = (name) => {
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleNameChange = (val) => {
        setForm((f) => ({
            ...f,
            name: val,
            initials: f.initials || autoInitials(val),
        }));
    };

    return (
        <div className="space-y-8 pb-12">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Spotlight</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Manage spotlight cards displayed on the alumni dashboard.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all"
                >
                    <Plus size={16} />
                    Add Spotlight
                </button>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MiniStat
                    label="Total Spotlights"
                    value={spotlights.length}
                    icon={<Star size={16} />}
                    color="indigo"
                />
                <MiniStat
                    label="Active"
                    value={spotlights.filter((s) => s.active).length}
                    icon={<CheckCircle size={16} />}
                    color="emerald"
                />
                <MiniStat
                    label="Hidden"
                    value={spotlights.filter((s) => !s.active).length}
                    icon={<EyeOff size={16} />}
                    color="amber"
                />
            </div>

            {/* ── Spotlight Cards Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-slate-100 rounded-3xl" />
                    ))}
                </div>
            ) : spotlights.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center py-24 text-center">
                    <Sparkles size={48} className="text-slate-200 mb-4" />
                    <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">No spotlights yet</p>
                    <p className="text-slate-300 text-xs mt-1">Click "Add Spotlight" to create your first one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {spotlights.map((s) => (
                        <SpotlightCard
                            key={s._id}
                            spotlight={s}
                            onEdit={() => openEdit(s)}
                            onToggle={() => handleToggleActive(s)}
                            onDelete={() => setDeleteConfirm(s._id)}
                        />
                    ))}
                </div>
            )}

            {/* ── Slide-in Form Panel ── */}
            {showForm && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setShowForm(false)}
                    />
                    <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
                        style={{ animation: "slideIn 0.3s cubic-bezier(.16,1,.3,1)" }}>
                        <style>{`
                            @keyframes slideIn {
                                from { transform: translateX(100%); }
                                to { transform: translateX(0); }
                            }
                        `}</style>

                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">
                                    {editingId ? "Edit Spotlight" : "New Spotlight"}
                                </h3>
                                <p className="text-slate-400 text-xs font-medium mt-0.5">
                                    {editingId ? "Update the spotlight details below." : "Fill in the details to create a spotlight card."}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-5">
                            {/* Live Preview */}
                            <div className="mb-2">
                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">Live Preview</p>
                                <SpotlightPreview form={form} />
                            </div>

                            <div className="h-px bg-slate-100" />

                            <FormField
                                label="Full Name"
                                icon={<User size={14} />}
                                value={form.name}
                                onChange={handleNameChange}
                                placeholder="Nour Al-Mansouri"
                            />
                            <FormField
                                label="Initials (auto-filled)"
                                icon={<Star size={14} />}
                                value={form.initials}
                                onChange={(v) => setForm((f) => ({ ...f, initials: v.toUpperCase().slice(0, 2) }))}
                                placeholder="NM"
                                maxLength={2}
                            />
                            <FormField
                                label="Role / Title"
                                icon={<Briefcase size={14} />}
                                value={form.role}
                                onChange={(v) => setForm((f) => ({ ...f, role: v }))}
                                placeholder="Executive Coach"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="Location"
                                    icon={<MapPin size={14} />}
                                    value={form.location}
                                    onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                                    placeholder="UAE"
                                />
                                <FormField
                                    label="Batch Year"
                                    icon={<GraduationCap size={14} />}
                                    value={form.batch}
                                    onChange={(v) => setForm((f) => ({ ...f, batch: v }))}
                                    placeholder="Mashar 2021"
                                />
                            </div>

                            {/* Quote */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Quote size={12} /> Quote
                                </label>
                                <textarea
                                    value={form.quote}
                                    onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                                    placeholder="Inspiring words from this alumni..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 resize-none"
                                />
                            </div>

                            {/* Avatar Gradient Colors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Avatar Color 1</label>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
                                        <input
                                            type="color"
                                            value={form.gradientFrom}
                                            onChange={(e) => setForm((f) => ({ ...f, gradientFrom: e.target.value }))}
                                            className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
                                        />
                                        <span className="text-sm font-mono text-slate-600">{form.gradientFrom}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Avatar Color 2</label>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
                                        <input
                                            type="color"
                                            value={form.gradientTo}
                                            onChange={(e) => setForm((f) => ({ ...f, gradientTo: e.target.value }))}
                                            className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
                                        />
                                        <span className="text-sm font-mono text-slate-600">{form.gradientTo}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Visible to Alumni</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Show this card on the alumni dashboard</p>
                                </div>
                                <button
                                    onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.active ? "bg-indigo-600" : "bg-slate-200"}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${form.active ? "translate-x-7" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>

                        {/* Panel Footer */}
                        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-60"
                            >
                                <Save size={15} />
                                {saving ? "Saving..." : editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteConfirm && (
                <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setDeleteConfirm(null)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
                        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={24} className="text-rose-600" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Spotlight?</h3>
                        <p className="text-slate-400 text-sm font-medium mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-3 bg-rose-600 text-white rounded-2xl text-sm font-bold hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/* ── Sub-components ── */

function MiniStat({ label, value, icon, color }) {
    const colors = {
        indigo: "bg-indigo-100/50 text-indigo-600",
        emerald: "bg-emerald-100/50 text-emerald-600",
        amber: "bg-amber-100/50 text-amber-600",
    };
    return (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-2xl font-black text-slate-800">{value}</p>
            </div>
        </div>
    );
}

function SpotlightCard({ spotlight: s, onEdit, onToggle, onDelete }) {
    return (
        <div className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 ${s.active ? "border-slate-200" : "border-dashed border-slate-200 opacity-60"}`}>
            {/* Mini preview */}
            <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] p-5 relative overflow-hidden">
                <div className="absolute right-3 -top-4 text-[60px] text-[#C9A84C]/10">★</div>
                <div className="flex gap-3 items-center mb-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm shrink-0"
                        style={{ background: `linear-gradient(135deg, ${s.gradientFrom}, ${s.gradientTo})` }}
                    >
                        {s.initials}
                    </div>
                    <div>
                        <p className="font-semibold text-[#C9A84C] text-sm leading-tight">{s.name}</p>
                        <p className="text-[10px] text-white/50">{s.role} · {s.location} · {s.batch}</p>
                    </div>
                </div>
                <p className="text-xs italic text-white/70 leading-relaxed line-clamp-2">"{s.quote}"</p>
            </div>

            {/* Card Actions */}
            <div className="px-5 py-4 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${s.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    {s.active ? "● Active" : "○ Hidden"}
                </span>
                <div className="flex items-center gap-1">
                    <ActionBtn icon={s.active ? <EyeOff size={14} /> : <Eye size={14} />} onClick={onToggle} title={s.active ? "Hide" : "Show"} />
                    <ActionBtn icon={<Pencil size={14} />} onClick={onEdit} title="Edit" />
                    <ActionBtn icon={<Trash2 size={14} />} onClick={onDelete} title="Delete" danger />
                </div>
            </div>
        </div>
    );
}

function ActionBtn({ icon, onClick, title, danger }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-xl transition-colors ${danger ? "text-slate-300 hover:bg-rose-50 hover:text-rose-500" : "text-slate-300 hover:bg-slate-100 hover:text-slate-600"}`}
        >
            {icon}
        </button>
    );
}

function SpotlightPreview({ form }) {
    return (
        <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl p-4 text-white relative overflow-hidden">
            <div className="absolute right-3 -top-4 text-[60px] text-[#C9A84C]/10">★</div>
            <div className="flex gap-3 items-center mb-3">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm shrink-0"
                    style={{ background: `linear-gradient(135deg, ${form.gradientFrom || "#C9A84C"}, ${form.gradientTo || "#2A6B7C"})` }}
                >
                    {form.initials || "?"}
                </div>
                <div>
                    <p className="font-semibold text-[#C9A84C] text-sm">{form.name || "Alumni Name"}</p>
                    <p className="text-[10px] text-white/50">
                        {[form.role, form.location, form.batch].filter(Boolean).join(" · ") || "Role · Location · Batch"}
                    </p>
                </div>
            </div>
            <p className="text-xs italic text-white/70 leading-relaxed line-clamp-2">
                "{form.quote || "Quote will appear here..."}"
            </p>
        </div>
    );
}

function FormField({ label, icon, value, onChange, placeholder, type = "text", maxLength }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                {icon} {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
            />
        </div>
    );
}