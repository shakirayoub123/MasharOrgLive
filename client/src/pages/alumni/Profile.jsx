import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff, Camera, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import API from "../../utils/api";
import { BadgeModal } from "../../components/layout/AlumniSidebar";
import { resolveAssetUrl } from "../../utils/baseUrl";

// ─── THEME ────────────────────────────────────────────────────────────────────
const NAVY      = "#0F1C80";
const ORANGE    = "#F38900";
const NAVY_50   = "#EEF0FF";
const NAVY_100  = "#DDE0FF";
const TH        = "#0D1240";
const TB        = "#4B5563";
const TS        = "#9CA3AF";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ACCREDITATION_CREDENTIALS = [
    "ICF – ACC", "ICF – PCC", "ICF – MCC", "ICF – Not yet",
    "EMCC Foundation", "EMCC Practitioner", "EMCC Senior Practitioner", "EMCC Master Practitioner", "EMCC Not yet",
];
const YEARS = Array.from({ length: 15 }, (_, i) => String(2010 + i));
const LANGUAGES_OPTIONS = ["Arabic", "English", "French", "Other"];

const EMPTY_PROFILE = {
    full_name: "", email: "", bio: "", city: "", country: "", phone: "",
    course: "ICF – Not yet", completion_year: "", languages: [],
};

// Build full avatar URL from relative path stored in DB
function avatarUrl(path) {
    return resolveAssetUrl(path);
}

function getInitials(name = "") {
    return name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

// ─── AVATAR UPLOAD ────────────────────────────────────────────────────────────
function AvatarUpload({ name, currentAvatar, onUpload, onRemove, uploading }) {
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(currentAvatar || null);

    useEffect(() => { setPreview(currentAvatar || null); }, [currentAvatar]);

    function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
        if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
        onUpload(file);
    }

    function handleRemove() {
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
        onRemove();
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                    width: 88, height: 88, borderRadius: "50%",
                    background: preview ? "transparent" : `linear-gradient(135deg,${NAVY} 0%,#1A2EA0 100%)`,
                    border: `3px solid ${NAVY_100}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", position: "relative",
                    boxShadow: `0 4px 16px rgba(15,28,128,.18)`,
                }}>
                    {preview
                        ? <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{
                            fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 900,
                            color: "#fff", letterSpacing: "0.5px",
                        }}>{getInitials(name)}</span>
                    }
                    {uploading && (
                        <div style={{
                            position: "absolute", inset: 0, background: "rgba(15,28,128,.55)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{
                                width: 22, height: 22, borderRadius: "50%",
                                border: `2px solid rgba(255,255,255,.3)`,
                                borderTop: "2px solid #fff",
                                animation: "av-spin 1s linear infinite",
                            }} />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    style={{
                        position: "absolute", bottom: 0, right: 0,
                        width: 28, height: 28, borderRadius: "50%", border: "none",
                        background: ORANGE, color: "#fff", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 2px 8px rgba(243,137,0,.4)`,
                        transition: "transform .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    <Camera size={13} />
                </button>
            </div>

            <div>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: TH, margin: "0 0 3px" }}>Profile Picture</p>
                <p style={{ fontSize: 12, color: TS, margin: "0 0 10px", lineHeight: 1.5 }}>
                    JPG, PNG or WEBP · Max 5 MB
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        style={{
                            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${NAVY_100}`,
                            background: NAVY_50, color: NAVY, fontSize: 12, fontWeight: 700,
                            cursor: uploading ? "not-allowed" : "pointer", transition: "all .15s",
                            opacity: uploading ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = NAVY_100; }}
                        onMouseLeave={e => { e.currentTarget.style.background = NAVY_50; }}
                    >
                        {uploading ? "Uploading…" : "Upload Photo"}
                    </button>
                    {preview && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={uploading}
                            style={{
                                padding: "6px 12px", borderRadius: 20, border: "1.5px solid #FEE2E2",
                                background: "#FEF2F2", color: "#DC2626", fontSize: 12, fontWeight: 700,
                                cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                                transition: "all .15s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; }}
                        >
                            <Trash2 size={12} /> Remove
                        </button>
                    )}
                </div>
            </div>

            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ProfileEdit() {
    const { user, updateUser } = useAuth();
    const [showBadgeModal, setShowBadgeModal] = useState(false);

    const [profileData, setProfileData] = useState(null);   // raw DB data
    const [form,        setForm]        = useState(EMPTY_PROFILE);
    const [loading,     setLoading]     = useState(true);
    const [saving,      setSaving]      = useState(false);
    const [avatarFile,  setAvatarFile]  = useState(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [removeAvatar, setRemoveAvatar] = useState(false);

    const [pwForm,   setPwForm]   = useState({ current: "", next: "", confirm: "" });
    const [pwSaving, setPwSaving] = useState(false);
    const [showPw,   setShowPw]   = useState({ current: false, next: false, confirm: false });

    // ── Fetch profile from API ────────────────────────────────────────────────
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const res  = await API.get("/auth/profile");
            const data = res.data?.data;
            if (!data) throw new Error("No data");
            setProfileData(data);
            setForm({
                full_name:       data.full_name       || "",
                email:           data.email           || "",
                phone:           data.phone           || "",
                bio:             data.bio             || "",
                city:            data.city            || "",
                country:         data.country         || "",
                course:          data.course          || "Other - Developer",
                completion_year: data.completion_year || "",
                languages:       data.languages       || [],
            });
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

    function toggleLanguage(lang) {
        setForm(f => ({
            ...f,
            languages: f.languages.includes(lang)
                ? f.languages.filter(l => l !== lang)
                : [...f.languages, lang],
        }));
    }

    function discardChanges() {
        if (!profileData) return;
        setForm({
            full_name:       profileData.full_name       || "",
            email:           profileData.email           || "",
            phone:           profileData.phone           || "",
            bio:             profileData.bio             || "",
            city:            profileData.city            || "",
            country:         profileData.country         || "",
            course:          profileData.course          || "Other - Developer",
            completion_year: profileData.completion_year || "",
            languages:       profileData.languages       || [],
        });
        setAvatarFile(null);
        setRemoveAvatar(false);
    }

    // ── Save profile ──────────────────────────────────────────────────────────
    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();

            Object.entries(form).forEach(([key, val]) => {
                fd.append(key, Array.isArray(val) ? JSON.stringify(val) : val ?? "");
            });

            if (avatarFile) {
                setAvatarUploading(true);
                fd.append("avatar", avatarFile);
            }

            if (removeAvatar) fd.append("remove_avatar", "true");

            const res = await API.post("/auth/profile", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Keep AuthContext in sync (e.g. navbar avatar)
            if (res.data?.data && typeof updateUser === "function") {
                updateUser(res.data.data);
            }

            setAvatarFile(null);
            setRemoveAvatar(false);
            setAvatarUploading(false);
            toast.success("Profile saved successfully!");

            // Re-fetch fresh data from DB so form reflects persisted state
            await fetchProfile();

        } catch (err) {
            console.error("Save profile error:", err);
            toast.error(err.response?.data?.message || "Failed to save profile");
            setAvatarUploading(false);
        } finally {
            setSaving(false);
        }
    }

    // ── Change password ───────────────────────────────────────────────────────
    async function handlePasswordChange(e) {
        e.preventDefault();
        if (pwForm.next !== pwForm.confirm) return toast.error("New passwords don't match");
        if (pwForm.next.length < 6) return toast.error("Password must be at least 6 characters");
        setPwSaving(true);
        try {
            await API.post("/auth/password", {
                currentPassword: pwForm.current,
                newPassword:     pwForm.next,
            });
            toast.success("Password updated successfully!");
            setPwForm({ current: "", next: "", confirm: "" });
            setShowPw({ current: false, next: false, confirm: false });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setPwSaving(false);
        }
    }

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) return (
        <>
            <style>{`@keyframes av-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        background: "#fff", borderRadius: 18,
                        border: `1px solid ${NAVY_100}`, height: 140,
                        animation: "av-pulse 1.6s ease infinite",
                    }} />
                ))}
            </div>
        </>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="pf-root">
            <style>{`
                .pf-root * { box-sizing: border-box; }
                .pf-input  { width:100%; border:1.5px solid ${NAVY_100}; border-radius:11px; padding:9px 14px; font-size:13.5px; color:${TH}; background:#fff; transition:border-color .15s, box-shadow .15s; outline:none; }
                .pf-input:focus        { border-color:${NAVY}; box-shadow:0 0 0 3px rgba(15,28,128,.09); }
                .pf-input::placeholder { color:${TS}; }
                .pf-input:disabled     { background:${NAVY_50}; color:${TS}; cursor:not-allowed; }
                .pf-select   { width:100%; border:1.5px solid ${NAVY_100}; border-radius:11px; padding:9px 14px; font-size:13.5px; color:${TH}; background:#fff; outline:none; cursor:pointer; transition:border-color .15s; }
                .pf-select:focus { border-color:${NAVY}; }
                .pf-textarea { width:100%; border:1.5px solid ${NAVY_100}; border-radius:11px; padding:10px 14px; font-size:13.5px; color:${TH}; background:#fff; resize:none; outline:none; transition:border-color .15s; }
                .pf-textarea:focus       { border-color:${NAVY}; box-shadow:0 0 0 3px rgba(15,28,128,.09); }
                .pf-textarea::placeholder { color:${TS}; }
                @keyframes av-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes av-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
            `}</style>

            <div className="pf-root">

                {/* ── PAGE HEADER ── */}
                <div style={{ marginBottom: 22 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: NAVY_50, border: `1px solid ${NAVY_100}`,
                        borderRadius: 20, padding: "3px 11px", marginBottom: 8,
                    }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: NAVY }} />
                        <span style={{ fontSize: 9.5, fontWeight: 800, color: NAVY, letterSpacing: "1.1px", textTransform: "uppercase" }}>
                            Alumni Profile
                        </span>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 900, color: TH, margin: "0 0 4px" }}>
                        My Profile
                    </h1>
                    <p style={{ fontSize: 13.5, color: TS, margin: 0 }}>Keep your Profile up to date</p>
                </div>

                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* ── AVATAR ── */}
                    <Section title="Profile Picture">
                        <AvatarUpload
                            name={form.full_name}
                            currentAvatar={avatarUrl(profileData?.avatar)}
                            onUpload={file => { setAvatarFile(file); setRemoveAvatar(false); }}
                            onRemove={() => { setAvatarFile(null); setRemoveAvatar(true); }}
                            uploading={avatarUploading}
                        />
                    </Section>

                    {/* ── PERSONAL ── */}
                    <Section title="Personal Info">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                            <Field label="Full Name">
                                <input className="pf-input" value={form.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Full name" />
                            </Field>
                            <Field label="Email">
                                <input className="pf-input" value={form.email} type="email" disabled placeholder="your@email.com" />
                            </Field>
                            <Field label="City">
                                <input className="pf-input" value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" />
                            </Field>
                            <Field label="Country">
                                <input className="pf-input" value={form.country} onChange={e => set("country", e.target.value)} placeholder="Country" />
                            </Field>
                            <Field label="Phone">
                                <input className="pf-input" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="Phone number" />
                            </Field>
                        </div>

                        <Field label="Bio" hint="Max 300 characters">
                            <div style={{ position: "relative" }}>
                                <textarea
                                    className="pf-textarea"
                                    value={form.bio}
                                    onChange={e => set("bio", e.target.value)}
                                    maxLength={300}
                                    rows={3}
                                    placeholder="A short professional bio…"
                                />
                                <span style={{
                                    position: "absolute", bottom: 9, right: 12,
                                    fontSize: 10, color: form.bio.length > 260 ? ORANGE : TS, fontWeight: 600,
                                }}>{form.bio.length}/300</span>
                            </div>
                        </Field>

                        <Field label="Languages">
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                                {LANGUAGES_OPTIONS.map(lang => {
                                    const active = form.languages.includes(lang);
                                    return (
                                        <button
                                            type="button" key={lang}
                                            onClick={() => toggleLanguage(lang)}
                                            style={{
                                                padding: "5px 13px", borderRadius: 20,
                                                background: active ? NAVY : NAVY_50,
                                                color: active ? "#fff" : TB,
                                                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                                                border: active ? "none" : `1px solid ${NAVY_100}`,
                                                boxShadow: active ? `0 3px 10px rgba(15,28,128,.2)` : "none",
                                                transition: "all .15s",
                                            }}
                                        >{lang}</button>
                                    );
                                })}
                            </div>
                        </Field>
                    </Section>

                    {/* ── COURSE ── */}
                    <Section title="Coaching Education Record">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                            <Field label="Accreditation Credentials">
                                <select className="pf-select" value={form.course} onChange={e => set("course", e.target.value)}>
                                    {ACCREDITATION_CREDENTIALS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </Field>
                            <Field label="Completion Year">
                                <select className="pf-select" value={form.completion_year} onChange={e => set("completion_year", e.target.value)}>
                                    {["", ...YEARS].map(o => <option key={o} value={o}>{o || "— Select —"}</option>)}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    {/* ── MY BADGES ── */}
                    <Section title="My Badges">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                            <div>
                                <p style={{ fontSize: 13.5, fontWeight: 700, color: TH, margin: "0 0 3px" }}>Alumni Badges & Credentials</p>
                                <p style={{ fontSize: 12, color: TS, margin: 0, lineHeight: 1.5 }}>View, request, or download your official Mashar badges.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowBadgeModal(true)}
                                style={{
                                    padding: "8px 18px", borderRadius: 20, border: "none",
                                    background: `linear-gradient(135deg,${ORANGE},#C45000)`,
                                    color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                                    boxShadow: `0 4px 14px rgba(243,137,0,.28)`, transition: "transform .15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                🎖️ Manage Badges
                            </button>
                        </div>
                    </Section>

                    {/* ── FOOTER ── */}
                    <div style={{
                        display: "flex", justifyContent: "flex-end", gap: 10,
                        paddingTop: 14, borderTop: `1px solid ${NAVY_100}`,
                    }}>
                        <button
                            type="button"
                            onClick={discardChanges}
                            style={{
                                padding: "8px 18px", borderRadius: 20,
                                border: `1.5px solid ${NAVY_100}`, background: "#fff",
                                color: TB, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                transition: "background .15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = NAVY_50}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                        >Discard</button>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: "8px 22px", borderRadius: 20, border: "none",
                                background: saving ? TS : `linear-gradient(135deg,${NAVY},#1A2EA0)`,
                                color: "#fff", fontSize: 13, fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer",
                                boxShadow: saving ? "none" : `0 4px 14px rgba(15,28,128,.25)`,
                                transition: "all .15s",
                            }}
                        >{saving ? "Saving…" : "Save Changes"}</button>
                    </div>
                </form>

                {/* ── CHANGE PASSWORD ── */}
                <div style={{ marginTop: 14 }}>
                    <Section title="Change Password">
                        <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <Field label="Current Password">
                                <PwInput
                                    value={pwForm.current}
                                    visible={showPw.current}
                                    onChange={v => setPwForm(f => ({ ...f, current: v }))}
                                    onToggle={() => setShowPw(p => ({ ...p, current: !p.current }))}
                                    placeholder="Enter current password"
                                />
                            </Field>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                                <Field label="New Password">
                                    <PwInput
                                        value={pwForm.next}
                                        visible={showPw.next}
                                        onChange={v => setPwForm(f => ({ ...f, next: v }))}
                                        onToggle={() => setShowPw(p => ({ ...p, next: !p.next }))}
                                        placeholder="At least 6 characters"
                                    />
                                </Field>
                                <Field label="Confirm New Password">
                                    <PwInput
                                        value={pwForm.confirm}
                                        visible={showPw.confirm}
                                        onChange={v => setPwForm(f => ({ ...f, confirm: v }))}
                                        onToggle={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                                        placeholder="Repeat new password"
                                    />
                                </Field>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button
                                    type="submit"
                                    disabled={pwSaving || !pwForm.current || !pwForm.next}
                                    style={{
                                        padding: "8px 22px", borderRadius: 20, border: "none",
                                        background: `linear-gradient(135deg,${ORANGE},#C45000)`,
                                        color: "#fff", fontSize: 13, fontWeight: 700,
                                        cursor: pwSaving || !pwForm.current || !pwForm.next ? "not-allowed" : "pointer",
                                        opacity: pwSaving || !pwForm.current || !pwForm.next ? 0.45 : 1,
                                        boxShadow: `0 4px 14px rgba(243,137,0,.28)`,
                                        transition: "all .15s",
                                    }}
                                >{pwSaving ? "Updating…" : "Update Password"}</button>
                            </div>
                        </form>
                    </Section>
                </div>

            </div>
            
            {showBadgeModal && <BadgeModal user={user} onClose={() => setShowBadgeModal(false)} />}
        </div>
    );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Section({ title, children }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 16,
            border: `1px solid ${NAVY_100}`,
            padding: "20px 22px",
            boxShadow: "0 1px 4px rgba(15,28,128,.05)",
            display: "flex", flexDirection: "column", gap: 14,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 3, height: 14, background: `linear-gradient(to bottom,${NAVY},${ORANGE})`, borderRadius: 2, flexShrink: 0 }} />
                <h2 style={{ fontSize: 10, fontWeight: 800, color: TS, letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}

function Field({ label, hint, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: TB, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label}
            </label>
            {hint && <p style={{ fontSize: 11, color: TS, margin: 0 }}>{hint}</p>}
            {children}
        </div>
    );
}

function PwInput({ value, visible, onChange, onToggle, placeholder }) {
    return (
        <div style={{ position: "relative" }}>
            <input
                className="pf-input"
                type={visible ? "text" : "password"}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ paddingRight: 40 }}
            />
            <button
                type="button"
                onClick={onToggle}
                style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    border: "none", background: "none", cursor: "pointer",
                    color: TS, display: "flex", alignItems: "center",
                    transition: "color .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = NAVY}
                onMouseLeave={e => e.currentTarget.style.color = TS}
            >
                {visible ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
        </div>
    );
}