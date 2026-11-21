import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Award, ShieldCheck, HeartHandshake, Compass, BookOpen,
    Send, CheckCircle2, ChevronDown, Check, Star, Globe,
    Users, Sparkles, Building, Lock, ArrowRight, UserCheck
} from "lucide-react";
import SEO from "../components/SEO";
import founderImg from "../assets/foundernew.jpg";

const MENTOR_TRACKS = [
    {
        title: "Executive & C-Suite Mentor",
        badge: "Strategic Wisdom",
        audience: "Ministers, C-Suite, Board Directors, Enterprise Leaders",
        description: "Walk alongside senior leaders navigating organizational transformation, high-stakes decisions, and legacy leadership.",
        profile: "15+ years of senior executive or director-level leadership experience in the GCC or globally.",
    },
    {
        title: "Coach Mentor & Supervisor",
        badge: "Reflective Mastery",
        audience: "Credentialing Coaches & Internal Corporate Coaches",
        description: "Provide the 10 hours of required mentor coaching for ICF ACC/PCC/MCC applications and systemic reflective supervision.",
        profile: "Active ICF PCC / MCC with certified mentor coach or coaching supervision qualification.",
    },
    {
        title: "Emerging & High-Potential Mentor",
        badge: "Next-Gen Growth",
        audience: "Fast-track national talent, young executives, alumni cohorts",
        description: "Guide rising regional talent through key career transitions, personal authority, and strategic influence.",
        profile: "Seasoned mid-to-senior leaders with deep passion for developing the next generation of GCC talent.",
    },
];

const ERSHAD_PILLARS = [
    {
        num: "01",
        title: "Rooted in Ershad (Cultural Guidance)",
        desc: "Mentoring at Mashar draws upon the time-honored tradition of Ershad — guidance characterized by moral integrity, mutual dignity, and authentic care for human growth.",
    },
    {
        num: "02",
        title: "EMCC & ICF Global Standards",
        desc: "Every mentoring relationship is governed by the rigorous ethical codes and competency frameworks of the European Mentoring & Coaching Council and ICF.",
    },
    {
        num: "03",
        title: "Bespoke Mentee Matching",
        desc: "We ensure precise alignment between mentor wisdom and mentee challenges, considering sector nuance, executive stage, and cultural context.",
    },
    {
        num: "04",
        title: "Reflective Community of Practice",
        desc: "Our mentors benefit from regular masterclasses led by founder Raja'a Allaho, ongoing peer supervision, and shared regional research insights.",
    },
];

const FAQS = [
    {
        q: "How does mentoring differ from coaching at Mashar?",
        a: "While coaching focuses primarily on inquiry and unlocking the coachee's self-generated solutions, mentoring combines powerful inquiry with the generous sharing of wisdom, contextual perspective, industry insight, and long-term career stewardship.",
    },
    {
        q: "What credentials or background are required to become a Mashar Mentor?",
        a: "For Executive Mentoring, we look for distinguished leadership track records (15+ years in senior executive roles). For Coach Mentoring and Supervision, we require active ICF PCC/MCC or EMCC Senior/Master Practitioner credentials with verified mentor coach competencies.",
    },
    {
        q: "What is the expected time commitment?",
        a: "Mentoring engagements are tailored to your schedule. Typically, a mentor works with 1 to 3 mentees simultaneously, with 60 to 90-minute monthly or bi-weekly sessions over a 6 to 12-month development cycle.",
    },
    {
        q: "Can mentoring sessions take place virtually?",
        a: "Yes. Our mentors support executives across Kuwait, Saudi Arabia, the UAE, and the wider Arab world via both secure virtual platforms and in-person executive sessions where geographically convenient.",
    },
];

export default function BecomeMentor() {
    const formRef = useRef(null);
    const [selectedTrack, setSelectedTrack] = useState(MENTOR_TRACKS[0].title);
    const [faqOpen, setFaqOpen] = useState(0);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organization: "",
        executiveRole: "",
        credentials: "ICF PCC / MCC",
        yearsExperience: "15+ years",
        mentoringDomain: "Executive & Board Advisory",
        region: "Kuwait & GCC",
        linkedin: "",
        philosophy: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const scrollToForm = (trackTitle) => {
        if (trackTitle) setSelectedTrack(trackTitle);
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error("Please fill in all required contact fields.");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post("/api/public/partner/request", {
                inquiryType: "mentor",
                partnershipType: "Mentor & Supervisor Network",
                roleInterest: selectedTrack,
                company: formData.organization || "Independent Mentor",
                jobTitle: formData.executiveRole || selectedTrack,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                linkedin: formData.linkedin,
                region: formData.region,
                experience: `${formData.credentials} · ${formData.yearsExperience} · Domain: ${formData.mentoringDomain}`,
                message: formData.philosophy,
            });

            setSubmitted(true);
            toast.success("Mentor application submitted! Our mentorship committee will reach out.");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white min-h-screen text-[#1A1A1A] font-poppins selection:bg-[#0F1C80] selection:text-white">
            <SEO
                title="Become a Mentor | Mashar Mentorship Network"
                description="Join Mashar's distinguished cadre of EMCC and ICF accredited mentors guiding C-suite executives and rising leaders across the GCC."
            />

            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#F9FAFC] via-white to-white py-10 sm:py-16 border-b border-gray-100">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#0F1C80]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F39300]/10 text-[#D97F00] text-xs sm:text-sm font-semibold mb-6">
                        <HeartHandshake size={16} />
                        <span>Mashar Mentoring & Supervision Network</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-spartan text-[#0D1240] tracking-tight leading-[1.15] max-w-4xl mx-auto">
                        Mentor with Purpose.{" "}
                        <span className="text-[#F39300]">Elevate the Next Generation.</span>
                    </h1>

                    <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Join our distinguished cadre of EMCC-aligned mentors and seasoned C-suite advisors guiding executives, national leaders, and emerging coaches across the Arab world.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={() => scrollToForm()}
                            className="flex items-center gap-2.5 bg-[#0F1C80] hover:bg-[#15237F] text-white text-sm sm:text-base font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-[#0F1C80]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>Apply as a Mentor</span>
                            <ArrowRight size={18} />
                        </button>
                        <a
                            href="#philosophy"
                            className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#0F1C80] text-gray-700 hover:text-[#0F1C80] text-sm sm:text-base font-semibold px-7 py-3.5 rounded-full transition-all"
                        >
                            <span>Our Mentoring Philosophy</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── ERSHAD PHILOSOPHY SECTION ── */}
            <section id="philosophy" className="py-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 scroll-mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gray-100">
                            <img
                                src={founderImg}
                                alt="Raja'a Allaho - Mashar Founder"
                                className="w-full h-[440px] sm:h-[480px] object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#F39300]">Pioneering Regional Mentorship</p>
                                <p className="text-xl font-bold font-spartan mt-1">Raja’a Allaho</p>
                                <p className="text-xs text-white/80">Co-Author of "Coaching & Mentoring in Islamic Culture: The Principles & Practice of Ershad"</p>
                            </div>
                        </div>

                        {/* Floating Credential Chip */}
                        <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0F1C80]/10 text-[#0F1C80] flex items-center justify-center font-bold">
                                🎖️
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#0D1240]">EMCC Accredited</p>
                                <p className="text-[11px] text-gray-500">Mentoring Excellence</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F39300] mb-2">The Philosophy of Ershad</p>
                        <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240] leading-tight mb-6">
                            Where International Science Meets Arab Cultural Wisdom
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
                            At Mashar, mentoring is not merely technical advice — it is the practice of <strong>Ershad</strong>: intentional guidance rooted in wisdom, psychological safety, and cultural stewardship. We cultivate a shared space where senior mentors transfer decades of leadership experience with humility and rigor.
                        </p>

                        <div className="space-y-4">
                            {ERSHAD_PILLARS.map((p, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F9FC] border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                                    <span className="font-spartan font-bold text-sm text-[#F39300] bg-white w-8 h-8 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                        {p.num}
                                    </span>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-[#0D1240] font-spartan">{p.title}</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MENTOR TRACKS ── */}
            <section className="py-20 bg-gradient-to-b from-[#F8FAFF] to-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F39300] mb-2">Mentoring Practice Tracks</p>
                        <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240]">
                            Choose How You Want to Mentor
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-gray-600">
                            Our network connects experienced mentors with targeted leadership cohorts across government and enterprise.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {MENTOR_TRACKS.map((track, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#0F1C80]/30 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-xs font-bold text-[#0F1C80] bg-[#EEF0FF] px-3 py-1 rounded-full inline-block mb-4">
                                        {track.badge}
                                    </span>
                                    <h3 className="text-xl font-bold font-spartan text-[#0D1240] mb-3">
                                        {track.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Audience: {track.audience}
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                        {track.description}
                                    </p>
                                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 mb-6">
                                        <p className="font-bold text-[#0D1240] mb-1">Ideal Mentor Profile:</p>
                                        <p>{track.profile}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => scrollToForm(track.title)}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0F1C80]/5 hover:bg-[#0F1C80] text-[#0F1C80] hover:text-white font-semibold text-sm transition-all"
                                >
                                    <span>Apply for this Track</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MENTOR APPLICATION FORM ── */}
            <section ref={formRef} id="mentor-form" className="py-20 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 scroll-mt-20">
                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-8 sm:p-12">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#F39300]/10 text-[#D97F00] flex items-center justify-center mx-auto mb-4 font-bold">
                            <UserCheck size={24} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-spartan text-[#0D1240]">
                            Mentor Network Application Form
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Applying for track: <span className="font-bold text-[#0F1C80]">{selectedTrack}</span>. Share your background below to begin the alignment dialogue.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                                ✓
                            </div>
                            <h3 className="text-xl font-bold text-emerald-900 font-spartan">Application Received With Honor</h3>
                            <p className="text-sm text-emerald-700 max-w-md mx-auto">
                                Thank you for your commitment to mentoring regional leadership. Our Mentorship Committee will review your profile and connect with you shortly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name *</label>
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="e.g. Dr. Tariq"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name *</label>
                                    <input
                                        required
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="e.g. Al-Hashemi"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tariq@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+965 9999 0000"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Current Organization / Advisory Firm</label>
                                    <input
                                        type="text"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        placeholder="e.g. Former CEO / Independent Board Member"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Current Executive Title / Role</label>
                                    <input
                                        type="text"
                                        name="executiveRole"
                                        value={formData.executiveRole}
                                        onChange={handleChange}
                                        placeholder="e.g. Senior Executive Advisor"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mentoring / Coaching Credential</label>
                                    <select
                                        name="credentials"
                                        value={formData.credentials}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm bg-white"
                                    >
                                        <option value="EMCC EIA Senior / Master">EMCC EIA Senior / Master</option>
                                        <option value="ICF MCC (Master Certified)">ICF MCC (Master Certified)</option>
                                        <option value="ICF PCC (Professional Certified)">ICF PCC (Professional Certified)</option>
                                        <option value="Certified Mentor Coach">Certified Mentor Coach</option>
                                        <option value="Senior C-Suite Leader (No formal coach credential)">C-Suite Leader (Experience Track)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Years of Leadership Experience</label>
                                    <select
                                        name="yearsExperience"
                                        value={formData.yearsExperience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm bg-white"
                                    >
                                        <option value="20+ years">20+ years</option>
                                        <option value="15 - 20 years">15 - 20 years</option>
                                        <option value="10 - 15 years">10 - 15 years</option>
                                        <option value="5 - 10 years">5 - 10 years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mentoring Focus Domain</label>
                                    <select
                                        name="mentoringDomain"
                                        value={formData.mentoringDomain}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm bg-white"
                                    >
                                        <option value="C-Suite & Board Governance">C-Suite & Board Governance</option>
                                        <option value="Public Sector & National Strategy">Public Sector & National Strategy</option>
                                        <option value="Coach Credentialing & Supervision">Coach Credentialing & Supervision</option>
                                        <option value="Family Business Leadership">Family Business Leadership</option>
                                        <option value="Women in Executive Leadership">Women in Executive Leadership</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">LinkedIn Profile URL</label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Base Location / GCC Region *</label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm bg-white"
                                    >
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Saudi Arabia (Riyadh / Jeddah / Eastern)">Saudi Arabia</option>
                                        <option value="United Arab Emirates (Dubai / Abu Dhabi)">United Arab Emirates</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Oman">Oman</option>
                                        <option value="International / Diaspora">International / Diaspora</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Your Mentorship Vision & Motivation
                                </label>
                                <textarea
                                    rows={4}
                                    name="philosophy"
                                    value={formData.philosophy}
                                    onChange={handleChange}
                                    placeholder="Why do you wish to mentor with Mashar? Briefly describe the leadership wisdom or coaching perspective you hope to impart to your mentees..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 text-sm"
                                />
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                    <Lock size={13} />
                                    <span>All mentor profiles are handled with executive discretion.</span>
                                </p>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0F1C80] hover:bg-[#15237F] text-white font-semibold text-sm transition-all shadow-md disabled:opacity-50"
                                >
                                    {submitting ? "Submitting Application..." : "Submit Mentor Application →"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>

            {/* ── FAQ SECTION ── */}
            <section className="py-20 bg-gradient-to-b from-white to-[#F8FAFF] border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-6 sm:px-10">
                    <div className="text-center mb-14">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F39300] mb-2">Mentorship Inquiries</p>
                        <h2 className="text-2xl sm:text-3xl font-bold font-spartan text-[#0D1240]">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200/80 rounded-2xl bg-white overflow-hidden transition-all"
                            >
                                <button
                                    type="button"
                                    onClick={() => setFaqOpen(faqOpen === idx ? -1 : idx)}
                                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#0D1240] text-sm sm:text-base hover:text-[#0F1C80] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 text-gray-400 shrink-0 ${faqOpen === idx ? "rotate-180 text-[#0F1C80]" : ""}`}
                                    />
                                </button>
                                {faqOpen === idx && (
                                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

