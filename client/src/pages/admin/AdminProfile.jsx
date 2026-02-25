import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    User,
    Mail,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Save,
    Camera,
    CheckCircle,
    AlertTriangle,
    Clock,
    Key,
    Activity,
    LogOut
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminProfile() {
    const { admin, adminToken, adminLogout } = useAuth();

    const [activeTab, setActiveTab] = useState("profile");
    const [saving, setSaving] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleProfileSave = async () => {
        setSaving(true);
        try {
            await axios.put("/api/v1/admin/profile", profileForm, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSave = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setSaving(true);
        try {
            await axios.put(
                "/api/v1/admin/change-password",
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success("Password changed successfully");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile Info", icon: <User size={15} /> },
        { id: "security", label: "Security", icon: <Lock size={15} /> },
    ];

    const passwordStrength = (pw) => {
        if (!pw) return null;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (score <= 1) return { label: "Weak", color: "bg-rose-500", width: "w-1/4" };
        if (score === 2) return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
        if (score === 3) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
        return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
    };

    const strength = passwordStrength(passwordForm.newPassword);

    return (
        <div className="space-y-8 pb-12 mx-auto">
            {/* ── Header ── */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your admin profile and security preferences.</p>
            </div>

            {/* ── Profile Hero Card ── */}
            <div className="bg-[#0F172A] text-white rounded-3xl shadow-2xl shadow-indigo-900/10 p-8 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-900/30">
                            {admin?.email?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 border-2 border-[#0F172A] rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            <Camera size={13} />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-black text-white truncate">
                                {admin?.name || "Staff Account"}
                            </h2>
                            <span className="px-2 py-0.5 bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                Admin
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                            <Mail size={13} />
                            {admin?.email || "—"}
                        </p>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-col gap-2 shrink-0">
                        <MetaChip icon={<Shield size={12} />} label="Super Admin" color="indigo" />
                        <MetaChip icon={<CheckCircle size={12} />} label="Verified" color="emerald" />
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                            activeTab === tab.id
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab: Profile Info ── */}
            {activeTab === "profile" && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-lg">Personal Information</h3>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">Update your admin display name and email address.</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Display Name"
                                icon={<User size={15} />}
                                value={profileForm.name}
                                onChange={(v) => setProfileForm((f) => ({ ...f, name: v }))}
                                placeholder="Your name"
                            />
                            <FormField
                                label="Email Address"
                                icon={<Mail size={15} />}
                                value={profileForm.email}
                                onChange={(v) => setProfileForm((f) => ({ ...f, email: v }))}
                                placeholder="admin@example.com"
                                type="email"
                            />
                        </div>

                        {/* Role info (read-only display) */}
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100/50 text-indigo-600 flex items-center justify-center">
                                <Shield size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Account Role</p>
                                <p className="text-sm font-bold text-slate-700">Super Administrator — Full system access</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleProfileSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-60"
                            >
                                <Save size={15} />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab: Security ── */}
            {activeTab === "security" && (
                <div className="space-y-6">
                    {/* Change Password Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Change Password</h3>
                            <p className="text-slate-400 text-sm font-medium mt-0.5">Use a strong, unique password to keep your account secure.</p>
                        </div>

                        <div className="p-8 space-y-5">
                            <PasswordField
                                label="Current Password"
                                value={passwordForm.currentPassword}
                                show={showPasswords.current}
                                onToggle={() => setShowPasswords((s) => ({ ...s, current: !s.current }))}
                                onChange={(v) => setPasswordForm((f) => ({ ...f, currentPassword: v }))}
                            />
                            <PasswordField
                                label="New Password"
                                value={passwordForm.newPassword}
                                show={showPasswords.new}
                                onToggle={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}
                                onChange={(v) => setPasswordForm((f) => ({ ...f, newPassword: v }))}
                            />

                            {/* Strength meter */}
                            {passwordForm.newPassword && strength && (
                                <div className="space-y-1.5">
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                                    </div>
                                    <p className={`text-[11px] font-bold ${
                                        strength.label === "Weak" ? "text-rose-500" :
                                        strength.label === "Fair" ? "text-amber-500" :
                                        strength.label === "Good" ? "text-blue-500" : "text-emerald-500"
                                    }`}>Password strength: {strength.label}</p>
                                </div>
                            )}

                            <PasswordField
                                label="Confirm New Password"
                                value={passwordForm.confirmPassword}
                                show={showPasswords.confirm}
                                onToggle={() => setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))}
                                onChange={(v) => setPasswordForm((f) => ({ ...f, confirmPassword: v }))}
                            />

                            {/* Mismatch warning */}
                            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold">
                                    <AlertTriangle size={13} />
                                    Passwords do not match
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handlePasswordSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-60"
                                >
                                    <Key size={15} />
                                    {saving ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Session / Danger Zone */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Session & Access</h3>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center">
                                        <Activity size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Current Session</p>
                                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                            <Clock size={11} />
                                            Active now
                                        </p>
                                    </div>
                                </div>
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-rose-100/50 text-rose-600 flex items-center justify-center">
                                        <LogOut size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">End Admin Session</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">You will be logged out immediately.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={adminLogout}
                                    className="px-4 py-2 bg-rose-600 text-white text-xs font-black rounded-xl hover:bg-rose-500 active:scale-95 transition-all shadow-lg shadow-rose-600/20"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Helpers ── */

function MetaChip({ icon, label, color }) {
    const styles = {
        indigo: "bg-indigo-600/20 border-indigo-500/30 text-indigo-300",
        emerald: "bg-emerald-600/20 border-emerald-500/30 text-emerald-300",
    };
    return (
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${styles[color]}`}>
            {icon}
            {label}
        </span>
    );
}

function FormField({ label, icon, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{label}</label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
            </div>
        </div>
    );
}

function PasswordField({ label, value, show, onToggle, onChange }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{label}</label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                    <Lock size={15} />
                </span>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
}