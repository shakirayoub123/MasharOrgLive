import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const SPECIALTIES = [
    "Executive Coaching", "Life Coaching", "Career Coaching",
    "Team Coaching", "Leadership Coaching", "Business Coaching",
    "Wellbeing Coaching", "NLP Coaching",
];
const LEVELS = ["ICF ACC", "ICF PCC", "ICF MCC", "EMCC Foundation",
    "EMCC Practitioner", "EMCC Senior", "EMCC Master", "Other"];
const YEARS = Array.from({ length: 15 }, (_, i) => String(2010 + i));
const LANGUAGES_OPTIONS = ["Arabic", "English", "French", "Urdu", "Hindi", "Turkish", "Persian"];

const EMPTY_PROFILE = {
    name: "", phone: "", bio: "", city: "", country: "",
    linkedin: "", website: "", coachingSpecialty: "Executive Coaching",
    certificationLevel: "", graduationYear: "", languages: [],
    availableForMentoring: false, openToCollaboration: false,
};

export default function ProfileEdit() {
    const { user, token, updateUser } = useAuth();

    const [form, setForm] = useState(EMPTY_PROFILE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Password change state
    const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
    const [pwSaving, setPwSaving] = useState(false);

    // Load profile on mount
    useEffect(() => {
        if (!user) return;
        setForm({
            name: user.name || "",
            phone: user.phone || "",
            bio: user.bio || "",
            city: user.city || "",
            country: user.country || "",
            linkedin: user.linkedin || "",
            website: user.website || "",
            coachingSpecialty: user.coachingSpecialty || "Executive Coaching",
            certificationLevel: user.certificationLevel || "",
            graduationYear: user.graduationYear || "",
            languages: user.languages || [],
            availableForMentoring: user.availableForMentoring ?? false,
            openToCollaboration: user.openToCollaboration ?? false,
        });
        setLoading(false);
    }, [user]);

    function set(key, val) {
        setForm(f => ({ ...f, [key]: val }));
    }

    function toggleLanguage(lang) {
        setForm(f => ({
            ...f,
            languages: f.languages.includes(lang)
                ? f.languages.filter(l => l !== lang)
                : [...f.languages, lang],
        }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put("/api/v1/alumni/profile", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            updateUser(res.data.alumni);
            toast.success("Profile saved");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        if (pwForm.next !== pwForm.confirm) {
            return toast.error("New passwords don't match");
        }
        if (pwForm.next.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        setPwSaving(true);
        try {
            await axios.put(
                "/api/v1/alumni/password",
                { currentPassword: pwForm.current, newPassword: pwForm.next },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password updated");
            setPwForm({ current: "", next: "", confirm: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setPwSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 h-40" />
                ))}
            </div>
        );
    }

    return (
        <div className=" mx-auto space-y-1">

            {/* Header */}
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Keep your information up to date</p>
                </div>
                <button
                    form="profile-form"
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 transition-all"
                >
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </div>

            <form id="profile-form" onSubmit={handleSave} className="space-y-5">

                {/* Personal */}
                <Section title="Personal Info">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Full Name">
                            <Input value={form.name} onChange={v => set("name", v)} placeholder="Full name" />
                        </Field>
                        <Field label="Phone">
                            <Input value={form.phone} onChange={v => set("phone", v)} placeholder="+971…" type="tel" />
                        </Field>
                        <Field label="City">
                            <Input value={form.city} onChange={v => set("city", v)} placeholder="City" />
                        </Field>
                        <Field label="Country">
                            <Input value={form.country} onChange={v => set("country", v)} placeholder="Country" />
                        </Field>
                    </div>
                    <Field label="Bio" hint="Max 300 characters">
                        <div className="relative">
                            <textarea
                                value={form.bio}
                                onChange={e => set("bio", e.target.value)}
                                maxLength={300}
                                rows={3}
                                placeholder="A short professional bio…"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 resize-none"
                            />
                            <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-300">
                                {form.bio.length}/300
                            </span>
                        </div>
                    </Field>
                    <Field label="Languages">
                        <div className="flex flex-wrap gap-2 mt-1">
                            {LANGUAGES_OPTIONS.map(lang => (
                                <button
                                    type="button"
                                    key={lang}
                                    onClick={() => toggleLanguage(lang)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.languages.includes(lang)
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </Field>
                </Section>

                {/* Coaching */}
                <Section title="Coaching Profile">
                    <Field label="Specialty">
                        <Select value={form.coachingSpecialty} onChange={v => set("coachingSpecialty", v)} options={SPECIALTIES} />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Certification Level">
                            <Select value={form.certificationLevel} onChange={v => set("certificationLevel", v)} options={["", ...LEVELS]} />
                        </Field>
                        <Field label="Graduation Year">
                            <Select value={form.graduationYear} onChange={v => set("graduationYear", v)} options={["", ...YEARS]} />
                        </Field>
                    </div>
                </Section>

                {/* Links */}
                <Section title="Links">
                    <Field label="LinkedIn">
                        <Input value={form.linkedin} onChange={v => set("linkedin", v)} placeholder="https://linkedin.com/in/yourname" />
                    </Field>
                    <Field label="Website">
                        <Input value={form.website} onChange={v => set("website", v)} placeholder="https://yoursite.com" />
                    </Field>
                </Section>

                {/* Preferences */}
                <Section title="Preferences">
                    <Toggle
                        label="Available for Mentoring"
                        desc="Allow junior coaches to request mentoring sessions"
                        checked={form.availableForMentoring}
                        onChange={v => set("availableForMentoring", v)}
                    />
                    <Toggle
                        label="Open to Collaboration"
                        desc="Show up in collaboration searches across the network"
                        checked={form.openToCollaboration}
                        onChange={v => set("openToCollaboration", v)}
                    />
                </Section>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => setForm({
                            name: user.name || "",
                            phone: user.phone || "",
                            bio: user.bio || "",
                            city: user.city || "",
                            country: user.country || "",
                            linkedin: user.linkedin || "",
                            website: user.website || "",
                            coachingSpecialty: user.coachingSpecialty || "Executive Coaching",
                            certificationLevel: user.certificationLevel || "",
                            graduationYear: user.graduationYear || "",
                            languages: user.languages || [],
                            availableForMentoring: user.availableForMentoring ?? false,
                            openToCollaboration: user.openToCollaboration ?? false,
                        })}
                        className="px-4 py-2 rounded-xl text-sm text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 transition-all"
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </form>

            {/* Change Password — separate form so it doesn't trigger profile submit */}
            <Section title="Change Password">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <Field label="Current Password">
                        <Input
                            type="password"
                            value={pwForm.current}
                            onChange={v => setPwForm(f => ({ ...f, current: v }))}
                            placeholder="Enter current password"
                        />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="New Password">
                            <Input
                                type="password"
                                value={pwForm.next}
                                onChange={v => setPwForm(f => ({ ...f, next: v }))}
                                placeholder="At least 6 characters"
                            />
                        </Field>
                        <Field label="Confirm New Password">
                            <Input
                                type="password"
                                value={pwForm.confirm}
                                onChange={v => setPwForm(f => ({ ...f, confirm: v }))}
                                placeholder="Repeat new password"
                            />
                        </Field>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={pwSaving || !pwForm.current || !pwForm.next}
                            className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-40 transition-all"
                        >
                            {pwSaving ? "Updating…" : "Update Password"}
                        </button>
                    </div>
                </form>
            </Section>
        </div>
    );
}

/* ── Section wrapper ── */
function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h2>
            {children}
        </div>
    );
}

/* ── Field wrapper ── */
function Field({ label, hint, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {label}
            </label>
            {hint && <p className="text-[11px] text-slate-400 -mt-1">{hint}</p>}
            {children}
        </div>
    );
}

/* ── Text input ── */
function Input({ value, onChange, placeholder, type = "text" }) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
        />
    );
}

/* ── Select ── */
function Select({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:border-slate-400 transition-colors"
        >
            {options.map(o => <option key={o} value={o}>{o || "— Select —"}</option>)}
        </select>
    );
}

/* ── Toggle row ── */
function Toggle({ label, desc, checked, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 py-1">
            <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-slate-900" : "bg-slate-200"}`}
            >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
            </button>
        </div>
    );
}