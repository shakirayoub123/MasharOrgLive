import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    User, Mail, Shield, Save, Camera,
    CheckCircle, Clock, Activity, LogOut, Loader2
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminProfile() {
    const { admin, adminToken, adminLogout, updateAdmin } = useAuth();

    const [saving, setSaving] = useState(false);

    const [profileForm, setProfileForm] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
    });

    const handleProfileSave = async () => {
        setSaving(true);
        try {
            const res = await axios.put("/api/v1/admin/profile", profileForm, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const updated = res.data.data || {};
            updateAdmin({
                name: updated.name || profileForm.name,
                email: updated.email || profileForm.email,
            });
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">

            {/* ── Header ── */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your admin profile and session.</p>
            </div>

            {/* ── Profile Hero Banner ── */}
            <div className="bg-[#0F172A] text-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full -ml-24 -mb-24 blur-3xl" />

                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white/10">
                            {admin?.email?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 border-2 border-[#0F172A] rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={13} />
                        </button>
                    </div>

                    {/* Name & Email */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                            <h2 className="text-xl font-black">{admin?.name || "Staff Account"}</h2>
                            <span className="px-2 py-0.5 bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                Admin
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-2 justify-center sm:justify-start">
                            <Mail size={13} /> {admin?.email || "—"}
                        </p>
                    </div>

                    {/* Chips */}
                    <div className="flex flex-col gap-2">
                        <MetaChip icon={<Shield size={12} />} label="Super Admin" />
                        <MetaChip icon={<CheckCircle size={12} />} label="Verified" />
                    </div>
                </div>

                {/* Mini stats row */}
                <div className="relative grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-white/10">
                    {[
                        { label: "Role", value: "Super Admin", icon: <Shield size={14} className="text-indigo-400" /> },
                        { label: "Status", value: "Active", icon: <CheckCircle size={14} className="text-emerald-400" /> },
                        { label: "Session", value: "Online now", icon: <Activity size={14} className="text-sky-400" /> },
                    ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                {icon}
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                            </div>
                            <p className="text-sm font-black text-white">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Profile Form ── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg">Profile Information</h3>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">Update your display name or email address.</p>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Display Name"
                            icon={<User size={15} />}
                            value={profileForm.name}
                            onChange={v => setProfileForm(f => ({ ...f, name: v }))}
                            placeholder="Your name"
                        />
                        <FormField
                            label="Email Address"
                            icon={<Mail size={15} />}
                            value={profileForm.email}
                            onChange={v => setProfileForm(f => ({ ...f, email: v }))}
                            placeholder="admin@example.com"
                            type="email"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleProfileSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-60 active:scale-[0.98]"
                        >
                            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Session Card ── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg">Session & Access</h3>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">Manage your active session and sign out.</p>
                </div>
                <div className="p-8 space-y-4">
                    {/* Active session */}
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Activity size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Current Session</p>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                    <Clock size={11} /> Active now
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-emerald-600">Online</span>
                        </div>
                    </div>

                    {/* Sign out */}
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-rose-50 border border-rose-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                <LogOut size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">End Admin Session</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">You will be logged out immediately.</p>
                            </div>
                        </div>
                        <button
                            onClick={adminLogout}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Helpers ── */
function MetaChip({ icon, label }) {
    return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-indigo-600/20 border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
            {icon}{label}
        </span>
    );
}

function FormField({ label, icon, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all"
                />
            </div>
        </div>
    );
}