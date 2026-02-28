import { useState, useEffect, useRef } from "react";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ─── NAV SECTIONS ─────────────────────────────────────────────────────────────
const SECTIONS = [
    { id: "about", label: "About Alumni", icon: "🏛️", color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF", group: "about" },
    { id: "success-story", label: "Share Your Success Story", icon: "⭐", color: "#F38900", bg: "#FFF4E0", border: "#FFE4B0", tag: "Your Story Matters", group: "involve" },
    // { id: "become-mentor", label: "Become a Mentor", icon: "🎓", color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF", tag: "Application", group: "involve" },
    { id: "contribute-expertise", label: "Contribute Your Expertise", icon: "✍️", color: "#6B46C1", bg: "#FAF5FF", border: "#E9D8FD", tag: "Knowledge That Serves", group: "involve" },
    { id: "volunteer-events", label: "Volunteer at Events", icon: "🙌", color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5", tag: "Support. Connect. Contribute.", group: "involve" },
    { id: "directory", label: "Alumni Directory", icon: "🔍", color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF", tag: "Searchable", group: "directory" },
];

// ─── BRAND ────────────────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";

// ─── NAVY TOP BAR (used on all cards) ─────────────────────────────────────────
function NavyTopBar() {
    return <div style={{ height: 3, background: NAVY, width: "100%" }} />;
}



// ─── AVATAR HELPERS ───────────────────────────────────────────────────────────
const AV_COLORS = [
    { bg: "#0F1C80", fg: "#E8EBFF" }, { bg: "#F38900", fg: "#FFF4E0" },
    { bg: "#1A2FA0", fg: "#EEF0FF" }, { bg: "#C46D00", fg: "#FFF4E0" },
    { bg: "#0B5299", fg: "#E0EEFF" },
];
function avColor(name = "") { return AV_COLORS[name.charCodeAt(0) % AV_COLORS.length] || AV_COLORS[0]; }
function initials(n = "") { return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"; }

function Av({ name, size = 36 }) {
    const { bg, fg } = avColor(name);
    return (
        <div className="rounded-full flex items-center justify-center font-black shrink-0 select-none"
            style={{ width: size, height: size, minWidth: size, background: bg, color: fg, fontSize: size * 0.34 }}>
            {initials(name)}
        </div>
    );
}

// ─── FIELD COMPONENT ──────────────────────────────────────────────────────────
function Field({ field, value, onChange, accentColor }) {
    const base = "w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400";
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#0D1240]">
                {field.label}
                {field.required && <span style={{ color: accentColor }} className="ml-0.5">*</span>}
            </label>
            {field.type === "textarea"
                ? <textarea rows={field.rows || 3} value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={`${base} resize-none leading-relaxed`} />
                : field.type === "select"
                    ? <select value={value} onChange={e => onChange(e.target.value)} className={base}>
                        <option value="">Select…</option>
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    : <input type={field.type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={base} />
            }
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════
// SECTION CONTENT COMPONENTS
// ════════════════════════════════════════════════════════════════════

// ── ABOUT ALUMNI ──────────────────────────────────────────────────────
function AboutAlumni() {
    return (
        <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shrink-0"
                            style={{ background: "#EEF0FF", borderColor: "#DDE0FF" }}>🏛️</div>
                        <div>
                            <p className="font-black text-[#0D1240] text-sm">Our Mission</p>
                            <p className="text-[10px] text-gray-400">Mashar Alumni Network</p>
                        </div>
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                        We created the Mashar Alumni Platform to ensure our graduates remain <span className="font-bold text-[#0D1240]">empowered, informed, and connected</span> every stage of their coaching education journey.                         This space is designed to support your continued professional journey offering access to community, learning, ethical guidance, and opportunities to contribute with purpose and pride.
                    </p>
                </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5">
                    <p className="font-black text-[#0D1240] text-sm mb-2">Overview</p>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                        The Mashar Alumni Network supports your ongoing growth as a coach, mentor, and professional.                         Here, you can stay connected to peers, access exclusive resources, participate in events, and remain engaged with Mashar's evolving ecosystem.
                    </p>
                </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5">
                    <p className="font-black text-[#0D1240] text-sm mb-2">Mission</p>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                        Our alumni community is rooted in <span className="font-bold text-[#0D1240]">integrity, reflection, transformation, and shared success</span>.
                        We believe professional growth is sustained through ethical practice, continuous learning, and meaningful contribution; values that guide every interaction within the network.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5">
                    <p className="font-black text-[#0D1240] text-sm mb-2">Values</p>
                    <div className="flex items-center gap-3 flex-wrap">
                        {["Integrity", "Growth", "Community", "Service"].map((val, i) => (
                            <span key={val} className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold text-gray-600">{val}</span>
                                {i < 3 && <span className="text-gray-300">•</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits of Joining */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5">
                    <p className="font-black text-[#0D1240] text-sm mb-2">Benefits of Joining:</p>
                    <ul className="list-disc pl-5 text-[13px] text-gray-600 leading-relaxed space-y-1">
                        <li>Exclusive access to coaching tools and updates</li>
                        <li>Alumni-only events and masterclasses</li>
                        <li>Invitations to participate in Mashar projects</li>
                        <li>Access to free coaching and mentoring tips</li>
                        <li>Connection with Mashar's Community of Practice</li>
                    </ul>
                </div>
            </div>

            {/* How to Stay Engaged */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5">
                    <p className="font-black text-[#0D1240] text-sm mb-2">How to Stay Engaged</p>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
                        Alumni are encouraged to stay actively involved in ways that feel aligned with their journey, including:
                    </p>
                    <ul className="list-disc pl-5 text-[13px] text-gray-600 leading-relaxed space-y-1 mb-3">
                        <li>Attending alumni events and learning sessions</li>
                        <li>Participating in mentoring or supervision opportunities</li>
                        <li>Contributing articles, resources, or peer insights</li>
                        <li>Volunteering in community or Mashar-led initiatives</li>
                    </ul>
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                        Engagement is voluntary, flexible, and grounded in mutual respect.
                    </p>
                </div>
            </div>

            {/* Community Standards & Guidance */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5">
                    <p className="font-black text-[#0D1240] text-sm mb-2">Community Standards & Guidance</p>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                        Participation in the Alumni Community is guided by Mashar's <span className="font-bold text-[#0D1240]">Policies & Professional Standards</span>, available in the Learning Center.
                    </p>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                        The Mashar Alumni Community thrives through shared responsibility, ethical practice, and active contribution.
                    </p>
                    <p className="text-[13px] text-gray-600 leading-relaxed italic">
                        The Mashar Alumni Community thrives through shared responsibility, ethical practice, and active contribution.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── SUCCESS STORY ─────────────────────────────────────────────────────
function SuccessStory() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const section = SECTIONS.find(s => s.id === "success-story");

    const GUIDES = [
        { title: "Success Story Submission Template", desc: "Official Word document template to write and submit your coaching success story.", pages: "2 pages", file: "success-story-template.pdf" },
        { title: "Story Writing Guide", desc: "Tips on structuring a compelling coaching story — from situation to transformation.", pages: "4 pages", file: "story-writing-guide.pdf" },
        { title: "Submission Guidelines", desc: "How to submit your story, photo, and consent form to be featured in the alumni spotlight.", pages: "2 pages", file: "submission-guidelines.pdf" },
    ];

    const fields = [
        { id: "cohort", label: "Cohort / Year of Graduation", required: true, placeholder: "e.g. 2022" },
        { id: "story_title", label: "Story Title", required: true, placeholder: "A short, compelling title for your story" },
        { id: "story_type", label: "Story Type", type: "select", required: true, options: ["Client breakthrough", "Career milestone", "Personal transformation", "Community impact", "Other"] },
        { id: "story", label: "Your Story", type: "textarea", rows: 6, required: true, placeholder: "Share your coaching success story…" },
        { id: "consent", label: "I consent to this story being shared in the Mashar alumni spotlight", type: "select", required: true, options: ["Yes, I consent", "No, for internal review only"] },
    ];

    const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.id, ""])));
    const set = (id, val) => setForm(p => ({ ...p, [id]: val }));
    const canSubmit = fields.filter(f => f.required).every(f => form[f.id]?.trim());

    async function handleSubmit() {
        setSubmitting(true);
        try {
            await API.post("/alumni/engage/success-story", form);
            setSubmittedData(form);
            setSubmitted(true);
            toast.success("Success story submitted!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                        style={{ background: "#FFF4E0", borderColor: "#FFE4B0" }}>⭐</div>
                    <div>
                        {/* <p className="font-black text-[#0D1240] text-base mb-0.5">Share Your Success Story</p>
                        <p className="text-[11px] font-bold text-[#F38900] mb-2">Your Story Matters</p> */}
                        <p className="text-[13px] text-[#F38900] italic leading-relaxed mb-2">
                            Celebrate your journey and inspire the community.
                        </p>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            Your coaching journey is an inspiration. Share a story of transformation, a client breakthrough, a career milestone, or a moment that reminded you why you coach. Submissions are reviewed before being featured on the alumni platform or selected Mashar channels.
                        </p>
                    </div>
                </div>
            </div>



            <div>
                <p className="text-[9px] font-black text-[#F38900] uppercase tracking-[1.2px] opacity-70 mb-2 px-1">Submit Your Story Online</p>
                {submitted && submittedData ? (
                    <div className="rounded-2xl border p-5 flex flex-col gap-3"
                        style={{ background: "#FFF4E0", borderColor: "#FFE4B0", animation: "cardIn 0.3s ease" }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                                style={{ borderColor: ORANGE, background: "white" }}>✅</div>
                            <div>
                                <p className="font-black text-[#0D1240] text-sm">Story Submitted!</p>
                                <p className="text-xs text-gray-400 mt-0.5">Our team will review and feature it in the next alumni spotlight.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animation: "cardIn 0.3s ease both" }}>
                        <NavyTopBar />
                        <div className="px-5 py-5 flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg border shrink-0"
                                    style={{ background: "#FFF4E0", borderColor: "#FFE4B0" }}>⭐</div>
                                <div>
                                    <p className="font-black text-[#0D1240] text-sm">Story Submission Form</p>
                                    <p className="text-[10px] text-gray-400">All fields marked * are required</p>
                                </div>
                            </div>
                            {fields.map(f => (
                                <Field key={f.id} field={f} value={form[f.id]} onChange={v => set(f.id, v)} accentColor={ORANGE} />
                            ))}
                            <button onClick={handleSubmit} disabled={!canSubmit || submitting}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all mt-1"
                                style={{ background: (!canSubmit || submitting) ? "#F3F4F6" : ORANGE, color: (!canSubmit || submitting) ? "#9CA3AF" : "#fff", boxShadow: (!canSubmit || submitting) ? "none" : "0 6px 18px rgba(243,137,0,0.3)", cursor: (!canSubmit || submitting) ? "not-allowed" : "pointer" }}>
                                {submitting
                                    ? <><svg style={{ width: 14, height: 14, animation: "spin 0.85s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Submitting…</>
                                    : <><span>⭐</span><span className="ml-0.5">Submit My Story</span></>
                                }
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── GENERIC APPLICATION FORM ──────────────────────────────────────────
function ApplicationForm({ section, fields, onSubmit, submitting, submitted, submittedData }) {
    const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.id, ""])));
    const set = (id, val) => setForm(p => ({ ...p, [id]: val }));
    const canSubmit = fields.filter(f => f.required).every(f => form[f.id]?.trim());

    if (submitted && submittedData) {
        return (
            <div className="rounded-2xl border p-5 flex flex-col gap-3"
                style={{ background: "#F0FFF4", borderColor: "#C6F6D5", animation: "cardIn 0.3s ease" }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                        style={{ borderColor: "#2D8A4E", background: "white" }}>✅</div>
                    <div>
                        <p className="font-black text-[#0D1240] text-sm">Application Submitted</p>
                        <p className="text-xs text-gray-400 mt-0.5">Our team will review your application and be in touch soon.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animation: "cardIn 0.3s ease both" }}>
            <NavyTopBar />
            <div className="px-5 py-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg border shrink-0"
                        style={{ background: section.bg, borderColor: section.border }}>{section.icon}</div>
                    <div>
                        <p className="font-black text-[#0D1240] text-sm">Application Form</p>
                        <p className="text-[10px] text-gray-400">All fields marked * are required</p>
                    </div>
                </div>
                {fields.map(f => (
                    <Field key={f.id} field={f} value={form[f.id]} onChange={v => set(f.id, v)} accentColor={section.color} />
                ))}
                <button onClick={() => onSubmit(form)} disabled={!canSubmit || submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all relative overflow-hidden mt-1"
                    style={{ background: (!canSubmit || submitting) ? "#F3F4F6" : ORANGE, color: (!canSubmit || submitting) ? "#9CA3AF" : "#fff", boxShadow: (!canSubmit || submitting) ? "none" : `0 6px 18px ${ORANGE}44`, cursor: (!canSubmit || submitting) ? "not-allowed" : "pointer" }}>
                    {!(!canSubmit || submitting) && <span className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-white/20" />}
                    {submitting
                        ? <><svg style={{ width: 14, height: 14, animation: "spin 0.85s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Submitting…</>
                        : <><span>📩</span><span className="ml-0.5">Submit Application</span></>
                    }
                </button>
            </div>
        </div>
    );
}

// ── BECOME A MENTOR ───────────────────────────────────────────────────
function BecomeMentor({ user }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const section = SECTIONS.find(s => s.id === "become-mentor");
    const fields = [
        { id: "full_name", label: "Full Name", required: true, placeholder: "Your full name" },
        { id: "cohort", label: "Cohort / Year of Graduation", required: true, placeholder: "e.g. 2022" },
        { id: "specialisation", label: "Coaching Specialisation", required: true, placeholder: "e.g. Executive coaching, career transitions…" },
        { id: "icf_level", label: "Credential Level", type: "select", options: ["ACC", "PCC", "MCC", "", "None yet"], required: true },
        { id: "experience_years", label: "Years of Coaching Experience", required: true, placeholder: "e.g. 3 years" },
        { id: "mentoring_capacity", label: "How many mentees can you take on?", type: "select", options: ["1", "2", "3", "4+"], required: true },
        { id: "motivation", label: "Why do you want to mentor?", type: "textarea", rows: 3, required: true, placeholder: "Tell us what drives you to give back…" },
        { id: "availability", label: "Availability", type: "select", options: ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"], required: true },
    ];
    async function handleSubmit(form) {
        setSubmitting(true);
        try {
            await API.post("/alumni/engage/mentor", form);
            setSubmittedData(form); setSubmitted(true);
            toast.success("Mentor application submitted!");
        } catch (err) { toast.error(err?.response?.data?.message || "Submission failed."); }
        finally { setSubmitting(false); }
    }
    return (
        <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                        style={{ background: "#EEF0FF", borderColor: "#DDE0FF" }}>🎓</div>
                    <div>
                        <p className="font-black text-[#0D1240] text-base mb-1">Become a Mentor</p>
                        <p className="text-[13px] text-gray-500 leading-relaxed">Share your coaching wisdom with the next generation of Mashar coaches.</p>
                    </div>
                </div>
            </div>
            <ApplicationForm section={section} fields={fields} onSubmit={handleSubmit} submitting={submitting} submitted={submitted} submittedData={submittedData} />
        </div>
    );
}

// ── CONTRIBUTE EXPERTISE ──────────────────────────────────────────────
function ContributeExpertise({ user }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [summary, setSummary] = useState("");
    const [file, setFile] = useState(null);
    const [link, setLink] = useState("");
    const [consentOriginal, setConsentOriginal] = useState(false);
    const [consentGuidelines, setConsentGuidelines] = useState(false);

    const section = SECTIONS.find(s => s.id === "contribute-expertise");

    async function handleSubmit(e) {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            let fileData = null;
            let fileName = "";
            if (file) {
                fileName = file.name;
                try {
                    fileData = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });
                } catch (err) {
                    console.error("File read error:", err);
                }
            }

            const payload = {
                title,
                type,
                summary,
                link,
                consentOriginal,
                consentGuidelines,
                fileName,
                fileData
            };

            await API.post("/alumni/engage/contribute", payload);
            setSubmitted(true);
            toast.success("Contribution proposal submitted!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Submission failed.");
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <NavyTopBar />
                    <div className="px-5 py-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                            style={{ background: "#FAF5FF", borderColor: "#E9D8FD" }}>✍️</div>
                        <div>
                            {/* <p className="font-black text-[#0D1240] text-base mb-0.5">Contribute Your Expertise</p>
                            <p className="text-[11px] font-bold text-[#F38900] mb-2">Knowledge That Serves</p> */}
                            <p className="text-[13px] text-[#F38900] italic leading-relaxed mb-2">
                                Share knowledge with the community
                            </p>
                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                Contribute insights, reflections, tools, templates, or recommended resources that support learning and strengthen professional practice across the alumni community. All submissions are reviewed to ensure alignment with Mashar values and professional standards.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border p-5 flex flex-col gap-3"
                    style={{ background: "#F0FFF4", borderColor: "#C6F6D5", animation: "cardIn 0.3s ease" }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                            style={{ borderColor: "#2D8A4E", background: "white" }}>✅</div>
                        <div>
                            <p className="font-black text-[#0D1240] text-sm">Contribution Submitted</p>
                            <p className="text-xs text-gray-400 mt-0.5">Our team will review your submission and publish it soon.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const canSubmit = type && title.trim() && summary.trim() && consentOriginal && consentGuidelines;

    return (
        <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                        style={{ background: "#FAF5FF", borderColor: "#E9D8FD" }}>✍️</div>
                    <div>
                        {/* <p className="font-black text-[#0D1240] text-base mb-0.5">Contribute Your Expertise</p>
                        <p className="text-[11px] font-bold text-[#F38900] mb-2">Knowledge That Serves</p> */}
                        <p className="text-[13px] text-[#F38900] italic leading-relaxed mb-2">
                            Share knowledge with the community
                        </p>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            Contribute insights, reflections, tools, templates, or recommended resources that support learning and strengthen professional practice across the alumni community. All submissions are reviewed to ensure alignment with Mashar values and professional standards.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animation: "cardIn 0.3s ease both" }}>
                <NavyTopBar />
                <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg border shrink-0"
                            style={{ background: "#FAF5FF", borderColor: "#E9D8FD" }}>✍️</div>
                        <div>
                            <p className="font-black text-[#0D1240] text-sm">Submit Your Contribution</p>
                            <p className="text-[10px] text-gray-400">Please provide all details below</p>
                        </div>
                    </div>

                    {/* Content Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Content Type <span className="text-[#6B46C1]">*</span>
                        </label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors"
                        >
                            <option value="">Select Type…</option>
                            {["Article", "Reflection", "Tool", "Resource Recommendation"].map(o => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title of Contribution */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Title of Contribution <span className="text-[#6B46C1]">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Using Mindfulness in Executive Coaching"
                            className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400"
                        />
                    </div>

                    {/* Brief Summary (long text) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Brief Summary (long text) <span className="text-[#6B46C1]">*</span>
                        </label>
                        <textarea
                            rows={5}
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            placeholder="Describe your contribution, key takeaways, and who will benefit…"
                            className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400 resize-none leading-relaxed"
                        />
                    </div>

                    {/* Upload File / Document */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Upload File / Document (optional)
                        </label>
                        <div className="relative border border-dashed border-[#DDE0FF] hover:border-[#0F1C80] rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-[#EEF0FF]/30 transition-colors cursor-pointer group">
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <div className="flex items-center gap-2 w-full justify-between z-10">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="text-xl">📄</span>
                                        <span className="text-sm font-semibold text-[#0D1240] truncate">{file.name}</span>
                                        <span className="text-[10px] text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFile(null); }}
                                        className="text-gray-400 hover:text-red-500 text-sm font-black p-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-2xl group-hover:scale-110 transition-transform">📤</span>
                                    <span className="text-xs text-gray-500 font-semibold">Click to select document or file</span>
                                    <span className="text-[9px] text-gray-400">PDF, Word, Excel, Images up to 5MB</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Add Link */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Add Link (optional)
                        </label>
                        <input
                            type="url"
                            value={link}
                            onChange={e => setLink(e.target.value)}
                            placeholder="e.g. https://my-blog.com/resource"
                            className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400"
                        />
                    </div>

                    {/* Consent Checkboxes */}
                    <div className="flex flex-col gap-2.5 mt-2 bg-[#EEF0FF]/20 border border-[#DDE0FF]/50 rounded-xl p-3.5">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={consentOriginal}
                                onChange={e => setConsentOriginal(e.target.checked)}
                                className="w-4.5 h-4.5 mt-0.5 rounded border-[#DDE0FF] text-[#0F1C80] focus:ring-[#0F1C80] cursor-pointer"
                            />
                            <span className="text-xs text-[#0D1240] font-medium leading-tight">
                                I confirm this content is original or properly credited <span className="text-[#6B46C1]">*</span>
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={consentGuidelines}
                                onChange={e => setConsentGuidelines(e.target.checked)}
                                className="w-4.5 h-4.5 mt-0.5 rounded border-[#DDE0FF] text-[#0F1C80] focus:ring-[#0F1C80] cursor-pointer"
                            />
                            <span className="text-xs text-[#0D1240] font-medium leading-tight">
                                I agree to Mashar review and publishing guidelines <span className="text-[#6B46C1]">*</span>
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all relative overflow-hidden mt-1"
                        style={{
                            background: (!canSubmit || submitting) ? "#F3F4F6" : ORANGE,
                            color: (!canSubmit || submitting) ? "#9CA3AF" : "#fff",
                            boxShadow: (!canSubmit || submitting) ? "none" : `0 6px 18px ${ORANGE}44`,
                            cursor: (!canSubmit || submitting) ? "not-allowed" : "pointer"
                        }}
                    >
                        {!(!canSubmit || submitting) && <span className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-white/20" />}
                        {submitting ? (
                            <>
                                <svg style={{ width: 14, height: 14, animation: "spin 0.85s linear infinite" }} viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                    <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                Submitting…
                            </>
                        ) : (
                            <>
                                <span>📤</span>
                                <span className="ml-0.5">Submit Contribution</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ── VOLUNTEER AT EVENTS ───────────────────────────────────────────────
function VolunteerEvents({ user }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [interests, setInterests] = useState([]);
    const [hasExperience, setHasExperience] = useState("");
    const [experienceDesc, setExperienceDesc] = useState("");
    const [availabilities, setAvailabilities] = useState([]);
    const [locations, setLocations] = useState("");
    const [motivation, setMotivation] = useState("");

    const section = SECTIONS.find(s => s.id === "volunteer-events");

    const toggleInterest = (val) => {
        setInterests(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    };

    const toggleAvailability = (val) => {
        setAvailabilities(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    };

    async function handleSubmit(e) {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                interests,
                hasExperience,
                experienceDesc: hasExperience === "Yes" ? experienceDesc : "",
                availabilities,
                locations,
                motivation
            };
            await API.post("/alumni/engage/volunteer", payload);
            setSubmitted(true);
            toast.success("Volunteer interest registered!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Submission failed.");
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <NavyTopBar />
                    <div className="px-5 py-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                            style={{ background: "#F0FFF4", borderColor: "#C6F6D5" }}>🙌</div>
                        <div>
                            <p className="font-black text-[#0D1240] text-base mb-0.5">Volunteer at Events</p>
                            <p className="text-[11px] font-bold text-[#2D8A4E] mb-2">Support. Connect. Contribute.</p>
                            <p className="text-[13px] text-[#F38900] italic leading-relaxed mb-2">
                                Be part of the experience
                            </p>
                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                Support Mashar events and community initiatives through coordination, moderation, hosting, or knowledge-sharing roles while contributing to meaningful experiences across the alumni community. Opportunities vary based on event needs and availability.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border p-5 flex flex-col gap-3"
                    style={{ background: "#F0FFF4", borderColor: "#C6F6D5", animation: "cardIn 0.3s ease" }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                            style={{ borderColor: "#2D8A4E", background: "white" }}>✅</div>
                        <div>
                            <p className="font-black text-[#0D1240] text-sm">Interest Registered</p>
                            <p className="text-xs text-gray-400 mt-0.5">Our team will review your interest and connect with you for upcoming events.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const canSubmit = interests.length > 0 && hasExperience && availabilities.length > 0 && locations.trim() && motivation.trim() && (hasExperience !== "Yes" || experienceDesc.trim());

    return (
        <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-5 py-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                        style={{ background: "#F0FFF4", borderColor: "#C6F6D5" }}>🙌</div>
                    <div>
                        {/* <p className="font-black text-[#0D1240] text-base mb-0.5">Volunteer at Events</p>
                        <p className="text-[11px] font-bold text-[#2D8A4E] mb-2">Support. Connect. Contribute.</p> */}
                        <p className="text-[13px] text-[#F38900] italic leading-relaxed mb-2">
                            Be part of the experience
                        </p>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            Support Mashar events and community initiatives through coordination, moderation, hosting, or knowledge-sharing roles while contributing to meaningful experiences across the alumni community. Opportunities vary based on event needs and availability.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animation: "cardIn 0.3s ease both" }}>
                <NavyTopBar />
                <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg border shrink-0"
                            style={{ background: "#F0FFF4", borderColor: "#C6F6D5" }}>🙌</div>
                        <div>
                            <p className="font-black text-[#0D1240] text-sm">Register Your Interest</p>
                            <p className="text-[10px] text-gray-400">All fields are required unless stated otherwise</p>
                        </div>
                    </div>

                    {/* How You'd Like to Contribute */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            How You'd Like to Contribute (select areas of interest) <span className="text-[#2D8A4E]">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {[
                                "Event coordination",
                                "Session support / moderation",
                                "Community hosting",
                                "Registration support",
                                "Knowledge-sharing / speaking",
                                "Other"
                            ].map(opt => {
                                const isChecked = interests.includes(opt);
                                return (
                                    <label key={opt} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#DDE0FF] bg-[#EEF0FF]/25 hover:bg-[#EEF0FF]/50 transition-colors cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleInterest(opt)}
                                            className="w-4 h-4 rounded border-[#DDE0FF] text-[#0F1C80] focus:ring-[#0F1C80]"
                                        />
                                        <span className="text-xs text-gray-600 font-medium">{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Previous Event Experience */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Do you have previous event experience? <span className="text-[#2D8A4E]">*</span>
                        </label>
                        <div className="flex gap-4 mt-1">
                            {["Yes", "No"].map(opt => (
                                <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="hasExperience"
                                        value={opt}
                                        checked={hasExperience === opt}
                                        onChange={() => setHasExperience(opt)}
                                        className="w-4.5 h-4.5 border-[#DDE0FF] text-[#0F1C80] focus:ring-[#0F1C80] cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-600 font-semibold">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Previous Experience Description (Conditional) */}
                    {hasExperience === "Yes" && (
                        <div className="flex flex-col gap-1" style={{ animation: "cardIn 0.25s ease" }}>
                            <label className="text-[11px] font-bold text-[#0D1240]">
                                Please describe your experience <span className="text-[#2D8A4E]">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={experienceDesc}
                                onChange={e => setExperienceDesc(e.target.value)}
                                placeholder="Details about your past event coordination, moderation, or facilitation roles…"
                                className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400 resize-none leading-relaxed"
                            />
                        </div>
                    )}

                    {/* Availability */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Availability <span className="text-[#2D8A4E]">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {["Occasionally", "Flexible", "Regularly"].map(opt => {
                                const isChecked = availabilities.includes(opt);
                                return (
                                    <label key={opt} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#DDE0FF] bg-[#EEF0FF]/25 hover:bg-[#EEF0FF]/50 transition-colors cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleAvailability(opt)}
                                            className="w-4 h-4 rounded border-[#DDE0FF] text-[#0F1C80] focus:ring-[#0F1C80]"
                                        />
                                        <span className="text-xs text-gray-600 font-medium">{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Locations you can support <span className="text-[#2D8A4E]">*</span>
                        </label>
                        <input
                            type="text"
                            value={locations}
                            onChange={e => setLocations(e.target.value)}
                            placeholder="e.g. Remote, City / Country, specific venues…"
                            className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400"
                        />
                    </div>

                    {/* Why volunteer? */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#0D1240]">
                            Why would you like to volunteer with Mashar events? <span className="text-[#2D8A4E]">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={motivation}
                            onChange={e => setMotivation(e.target.value)}
                            placeholder="Tell us what excites you about volunteering with Mashar events…"
                            className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400 resize-none leading-relaxed"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all relative overflow-hidden mt-2"
                        style={{
                            background: (!canSubmit || submitting) ? "#F3F4F6" : ORANGE,
                            color: (!canSubmit || submitting) ? "#9CA3AF" : "#fff",
                            boxShadow: (!canSubmit || submitting) ? "none" : `0 6px 18px ${ORANGE}44`,
                            cursor: (!canSubmit || submitting) ? "not-allowed" : "pointer"
                        }}
                    >
                        {!(!canSubmit || submitting) && <span className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-white/20" />}
                        {submitting ? (
                            <>
                                <svg style={{ width: 14, height: 14, animation: "spin 0.85s linear infinite" }} viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                    <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                Submitting…
                            </>
                        ) : (
                            <>
                                <span>🤝</span>
                                <span className="ml-0.5">Register Your Interest</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ── ALUMNI DIRECTORY ──────────────────────────────────────────────────
function AlumniDirectory() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCourse, setFilterCourse] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        API.get("/alumni/members")
            .then(r => setMembers(r.data.data || r.data || []))
            .catch(() => setMembers([]))
            .finally(() => setLoading(false));
    }, []);

    const courses = [...new Set(members.map(m => m.course).filter(Boolean))].sort();
    const years = [...new Set(members.map(m => m.completion_year).filter(Boolean))].sort((a, b) => b - a);
    const filtered = members.filter(m => {
        const q = search.toLowerCase();
        return (!q || m.full_name?.toLowerCase().includes(q) || m.course?.toLowerCase().includes(q) || m.city?.toLowerCase().includes(q) || m.country?.toLowerCase().includes(q))
            && (!filterCourse || m.course === filterCourse)
            && (!filterYear || String(m.completion_year) === filterYear)
            && (!filterStatus || m.completion_status === filterStatus);
    });

    return (
        <div className="flex flex-col gap-4" style={{ animation: "panelIn 0.28s ease" }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <NavyTopBar />
                <div className="px-4 py-4 flex flex-col gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 14 14">
                            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                            <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name, course, location…"
                            className="w-full border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors placeholder:text-gray-400" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { val: filterCourse, set: setFilterCourse, placeholder: "All Courses", opts: courses },
                            { val: filterYear, set: setFilterYear, placeholder: "All Years", opts: years },
                            { val: filterStatus, set: setFilterStatus, placeholder: "All Status", opts: ["graduate", "student"] },
                        ].map((f, i) => (
                            <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
                                className="flex-1 min-w-[120px] border border-[#DDE0FF] focus:border-[#0F1C80] rounded-xl px-3 py-2 text-xs text-[#0D1240] bg-[#EEF0FF] outline-none transition-colors">
                                <option value="">{f.placeholder}</option>
                                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ))}
                        {(search || filterCourse || filterYear || filterStatus) && (
                            <button onClick={() => { setSearch(""); setFilterCourse(""); setFilterYear(""); setFilterStatus(""); }}
                                className="px-3 py-2 rounded-xl text-xs font-bold border border-[#DDE0FF] text-gray-500 hover:bg-[#EEF0FF] transition-colors">Clear</button>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">
                        Showing <span className="text-[#0F1C80] font-black">{filtered.length}</span> of {members.length} alumni
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#DDE0FF]">
                    <svg style={{ width: 28, height: 28, animation: "spin 0.9s linear infinite", margin: "0 auto 8px" }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#DDE0FF" strokeWidth="3" />
                        <path d="M4 12a8 8 0 018-8" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <p className="text-xs text-gray-400">Loading directory…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#DDE0FF]">
                    <p className="text-2xl mb-2">🔍</p>
                    <p className="font-bold text-[#0D1240] text-sm">No alumni found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filtered.map((m, i) => {
                        const { bg } = avColor(m.full_name);
                        return (
                            <div key={m._id} onClick={() => setPopup(m)}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#DDE0FF] transition-all cursor-pointer overflow-hidden"
                                style={{ animation: "cardIn 0.3s ease both", animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}>
                                <NavyTopBar />
                                <div className="p-4 flex items-start gap-3">
                                    <div className="relative shrink-0">
                                        <Av name={m.full_name} size={44} />
                                        {m.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-[#0D1240] text-sm truncate">{m.full_name}</p>
                                        <p className="text-[11px] font-semibold truncate mt-0.5" style={{ color: bg }}>{m.course}</p>
                                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                            {m.completion_year && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#0F1C80] border border-[#DDE0FF]">Class of {m.completion_year}</span>}
                                            {m.completion_status === "graduate" && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#0F1C80] border border-[#DDE0FF]">🎓 Graduate</span>}
                                            {m.isOnline && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Online</span>}
                                        </div>
                                        {(m.city || m.country) && (
                                            <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                                <svg width="9" height="9" fill="none" viewBox="0 0 12 12"><path d="M6 1a4 4 0 014 4c0 3-4 7-4 7S2 8 2 5a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.2" /><circle cx="6" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.2" /></svg>
                                                {[m.city, m.country].filter(Boolean).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {popup && (
                <>
                    <div onClick={() => setPopup(null)} className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm" />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[min(360px,92vw)] bg-white rounded-2xl shadow-2xl border border-[#DDE0FF] overflow-hidden"
                        style={{ animation: "modalIn .18s ease" }}>
                        <div className="h-20 relative" style={{ background: "linear-gradient(135deg,#0F1C80,#1A2FA0 60%,#F38900)" }}>
                            <button onClick={() => setPopup(null)}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs hover:bg-white/30 transition-colors">✕</button>
                        </div>
                        <div className="px-5 pb-5">
                            <div className="flex items-end gap-3 mb-3" style={{ marginTop: -28 }}>
                                <div className="relative" style={{ zIndex: 1 }}>
                                    <Av name={popup.full_name} size={56} />
                                    {popup.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />}
                                </div>
                            </div>
                            <h3 className="font-black text-[#0D1240] text-lg leading-tight">{popup.full_name}</h3>
                            {popup.bio && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{popup.bio}</p>}
                            <div className="mt-3 space-y-2">
                                {[
                                    { icon: "🎓", label: "Course", value: popup.course },
                                    { icon: "📅", label: "Graduated", value: popup.completion_year },
                                    { icon: "📍", label: "Location", value: [popup.city, popup.country].filter(Boolean).join(", ") || null },
                                    { icon: "✉️", label: "Email", value: popup.email },
                                ].filter(r => r.value).map(({ icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-2.5 text-xs">
                                        <span className="w-6 h-6 rounded-lg bg-[#EEF0FF] flex items-center justify-center text-sm shrink-0">{icon}</span>
                                        <span className="text-gray-400 shrink-0">{label}</span>
                                        <span className="font-semibold text-[#0D1240] truncate">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${popup.completion_status === "graduate" ? "bg-[#EEF0FF] text-[#0F1C80] border-[#DDE0FF]" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                    {popup.completion_status === "graduate" ? "🎓 Graduate" : "📚 " + popup.completion_status}
                                </span>
                                <span className="text-[10px] text-gray-400">Joined {new Date(popup.createdAt).getFullYear()}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── LEFT SIDEBAR ─────────────────────────────────────────────────────────────
function EngageSidebar({ active, setActive }) {
    const groups = [
        { id: "about", label: "About", items: SECTIONS.filter(s => s.group === "about") },
        { id: "involve", label: "Get Involved", items: SECTIONS.filter(s => s.group === "involve") },
        { id: "directory", label: "Directory", items: SECTIONS.filter(s => s.group === "directory") },
    ];
    return (
        <div className="bg-white rounded-2xl border border-[#DDE0FF] p-2.5 shadow-sm">
            <div className="flex items-center gap-2 px-2.5 pt-1 pb-2.5 border-b border-[#EEF0FF] mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg,#0F1C80,#1A2FA0)", boxShadow: "0 3px 8px rgba(15,28,128,0.28)" }}>🤝</div>
                <div>
                    <p className="text-[11px] font-black text-[#0D1240] leading-none">Engage</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">Alumni Community</p>
                </div>
            </div>
            {groups.map((g, gi) => (
                <div key={g.id}>
                    <p className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px] px-2.5 py-1.5 opacity-50">{g.label}</p>
                    {g.items.map(s => (
                        <button key={s.id} onClick={() => setActive(s.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium text-left mb-0.5 transition-all ${active === s.id ? "font-bold" : "text-gray-500 hover:bg-[#EEF0FF] hover:text-[#0D1240]"}`}
                            style={active === s.id ? { background: s.bg, color: s.color, borderLeft: `3px solid ${s.color}`, paddingLeft: "9px" } : {}}>
                            <span className="text-base shrink-0">{s.icon}</span>
                            <span className="flex-1 leading-snug text-[11.5px]">{s.label}</span>
                            {s.tag && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                    style={{ background: active === s.id ? s.color + "22" : "#F3F4F6", color: active === s.id ? s.color : "#9CA3AF" }}>
                                    {s.tag}
                                </span>
                            )}
                        </button>
                    ))}
                    {gi < groups.length - 1 && <div className="h-px bg-[#EEF0FF] mx-2 my-1.5" />}
                </div>
            ))}
        </div>
    );
}

// ─── BANNER — left gradient border ────────────────────────────────────────────
function EngageBanner() {
    return (
        <div className="relative rounded-2xl overflow-hidden mb-4"
            style={{
                border: `1px solid #DDE0FF`,
                borderLeft: `4px solid transparent`,
                backgroundImage: `linear-gradient(135deg, #EEF0FF 0%, #E5E8FF 55%, #FFF4E0 100%), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
                backgroundOrigin: `border-box`,
                backgroundClip: `padding-box, border-box`,
            }}>
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border-2 border-[#0F1C80]/5 pointer-events-none" />
            <div className="absolute right-14 -bottom-8 w-28 h-28 rounded-full bg-[#F38900]/5 pointer-events-none" />

            <div className="relative flex items-center justify-between gap-4 px-7 py-6">
                <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 bg-[#0F1C80]/8 border border-[#0F1C80]/15 rounded-full px-3 py-1 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F1C80]" />
                        <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px]">Mashar Alumni Network</span>
                    </div>
                    <h1 className="font-black text-[#0D1240] text-2xl leading-tight mb-2">
                        Get Involved & Contribute
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xl
                 mb-4 hidden sm:block">
                        Ways to contribute your expertise, support others, remain visible, <br /> and give back to the community.
                    </p>
                    <div className="flex gap-5 flex-wrap">
                        {[{ n: "4", l: "Ways to Engage" }, { n: "1", l: "Directory" }].map(({ n, l }) => (
                            <div key={l}>
                                <p className="text-xl font-black text-[#0F1C80] leading-none">{n}</p>
                                <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex shrink-0 flex-col items-center text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-[#DDE0FF] p-4 w-44">
                    <span className="text-2xl mb-1.5">🌍</span>
                    <p className="text-xs font-black text-[#0D1240] mb-1 leading-tight">Growing<br />Together</p>
                    <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">Connect, contribute, and continue your journey.</p>
                    <div className="w-full py-2 rounded-xl text-xs font-black text-white text-center"
                        style={{ background: NAVY, boxShadow: "0 4px 14px rgba(15,28,128,.2)" }}>
                        ✓ Join the Network
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AlumniEngagement() {
    const { user } = useAuth();
    const [activeId, setActiveId] = useState("about");
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
    }, [activeId]);

    const activeSection = SECTIONS.find(s => s.id === activeId);
    const CONTENT_MAP = {
        "about": <AboutAlumni />,
        "success-story": <SuccessStory />,
        "become-mentor": <BecomeMentor user={user} />,
        "contribute-expertise": <ContributeExpertise user={user} />,
        "volunteer-events": <VolunteerEvents user={user} />,
        "directory": <AlumniDirectory />,
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .egroot * { font-family: 'DM Sans', sans-serif; }
        .egroot h1, .egroot h2, .egroot h3, .egroot h4, .egroot h5, .egroot h6 { font-family: 'Sora', sans-serif; }
        @keyframes cardIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes panelIn { from{opacity:0;transform:translateX(6px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes modalIn { from{opacity:0;transform:translate(-50%,-48%)} to{opacity:1;transform:translate(-50%,-50%)} }
        .egside::-webkit-scrollbar{width:3px}
        .egside::-webkit-scrollbar-thumb{background:#DDE0FF;border-radius:4px}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>

            <div className="egroot w-full max-w-full overflow-x-hidden">
                <EngageBanner />

                {/* Mobile tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3 lg:hidden" style={{ scrollbarWidth: "none" }}>
                    {SECTIONS.map(s => (
                        <button key={s.id} onClick={() => setActiveId(s.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold shrink-0 border transition-all"
                            style={activeId === s.id
                                ? { background: ORANGE, color: "#fff", borderColor: ORANGE }
                                : { background: "#fff", color: "#6B7280", borderColor: "#DDE0FF" }
                            }>
                            <span>{s.icon}</span>
                            <span className="hidden sm:inline">{s.label}</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 items-start">
                    <div className="hidden lg:block sticky top-4 egside" style={{ maxHeight: "calc(100vh - 110px)", overflowY: "auto" }}>
                        <EngageSidebar active={activeId} setActive={setActiveId} />
                    </div>

                    <div className="min-w-0" ref={contentRef}>
                        {activeSection && (
                            <div key={activeId}>
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                                                style={{ color: activeSection.color, background: activeSection.bg, borderColor: activeSection.border }}>
                                                {activeSection.icon} {activeSection.group === "involve" ? "Get Involved" : activeSection.group === "directory" ? "Directory" : "About"}
                                            </span>
                                            <svg width="12" height="12" fill="none" viewBox="0 0 12 12" className="text-gray-300">
                                                <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <h2 className="font-black text-[#0D1240] text-lg leading-snug">{activeSection.label}</h2>
                                        {activeSection.tag && <p className="text-xs text-gray-400 mt-0.5">{activeSection.tag}</p>}
                                    </div>
                                </div>

                                {CONTENT_MAP[activeId]}

                                <div className="mt-4 lg:hidden">
                                    <EngageSidebar active={activeId} setActive={setActiveId} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}