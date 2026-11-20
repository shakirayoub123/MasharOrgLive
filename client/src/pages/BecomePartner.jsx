import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Award, ShieldCheck, Globe2, Sparkles, Building2, Users2, BookOpenCheck,
    ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, BadgeCheck, Layers,
    ChevronDown, Check, Lock, Brain, Library, UserCheck, Clock
} from "lucide-react";
import SEO from "../components/SEO";

/* ───────────────────────── DATA ───────────────────────── */

const PARTNER_MODELS = [
    {
        id: "Delivery Partner",
        title: "Delivery & Training Partner",
        badge: "Accredited Curricula",
        icon: BookOpenCheck,
        accent: "#0F1C80",
        soft: "#EEF0FF",
        forWho: "Corporate academies, training institutes, leadership centers",
        description: "License and deliver Mashar's ICF Level 1, Level 2 and EMCC accredited programs under your banner or co-branded.",
        perks: [
            "Turnkey curriculum & learner workbooks",
            "Faculty certification and train-the-trainer support",
            "Digital LMS and workbook assets provided",
            "Attractive licensing and revenue-share margins",
        ],
    },
    {
        id: "Consulting Partner",
        title: "Consulting & Advisory Partner",
        badge: "Diagnostic Tools",
        icon: Building2,
        accent: "#F38900",
        soft: "#FFF4E5",
        forWho: "Management consultancies, HR advisory firms, executive search",
        description: "Embed our behavioral diagnostics (GEDI & TAWDI) and executive coaching in your enterprise client engagements.",
        perks: [
            "TAWDI (10-min) & GEDI (20-min) psychometrics",
            "Executive coaching & leadership talent matching",
            "Joint RFP bidding on major GCC tenders",
            "Co-branded leadership audit & maturity reports",
        ],
    },
    {
        id: "Strategic Alliance",
        title: "Academic & Strategic Alliance",
        badge: "Institutional",
        icon: Globe2,
        accent: "#0F1C80",
        soft: "#EEF0FF",
        forWho: "Universities, business schools, government leadership initiatives",
        description: "Co-design executive diplomas and dual certifications, and collaborate on regional leadership research.",
        perks: [
            "Joint certificates with ICF / EMCC recognition",
            "Faculty exchange & guest masterclasses",
            "GCC leadership case studies & research data",
            "Custom blended pathways for graduate cohorts",
        ],
    },
];

const STATS = [
    { value: "15,000+", label: "Leaders certified & coached", tone: "text-[#0F1C80]" },
    { value: "Level 1 & 2", label: "ICF coaching accreditation", tone: "text-[#F38900]" },
    { value: "10+ Nations", label: "GCC & international delivery", tone: "text-[#0F1C80]" },
    { value: "100%", label: "Enablement & faculty support", tone: "text-[#F38900]" },
];

const ADVANTAGES = [
    { icon: Award, title: "Dual ICF & EMCC Backing", desc: "Deliver programs that meet the most exacting global standards and remove hesitation from enterprise procurement." },
    { icon: Brain, title: "Proprietary Behavioral Tools", desc: "Use TAWDI (team awareness) and GEDI (executive growth) to pinpoint development needs before costly engagements." },
    { icon: Library, title: "Complete Faculty Kits", desc: "Session outlines, slide decks, workbooks and case studies, ready for in-person or virtual delivery." },
    { icon: UserCheck, title: "Dedicated Partner Manager", desc: "Direct support from co-selling proposals and RFPs to graduation ceremonies and credential issuance." },
];

const ROADMAP_STEPS = [
    { num: "01", title: "Submit Application", desc: "Tell us about your organization, audience and partnership goals." },
    { num: "02", title: "Alignment Discovery", desc: "A 30-minute strategic consultation with our Head of Partnerships to assess fit and commercial model." },
    { num: "03", title: "Enablement & Certification", desc: "Partner agreement, portal access, curricula licensing and faculty onboarding." },
    { num: "04", title: "Launch & Co-Delivery", desc: "Roll out accredited programs with ongoing marketing, academic and technical backing." },
];

const FAQS = [
    { q: "What credentials do Mashar partner programs carry?", a: "Mashar programs are accredited by the International Coaching Federation (ICF) for Level 1 and Level 2 pathways, as well as the European Mentoring and Coaching Council (EMCC). Learners completing accredited programs through partners receive internationally recognized credentials." },
    { q: "How does curriculum licensing work for Training Partners?", a: "Licensed delivery partners receive digital facilitator guides, participant workbooks, slide decks and evaluation frameworks. You can deliver in-person, virtual or hybrid, and we run faculty train-the-trainer certification before launch." },
    { q: "Can programs and diagnostic reports be co-branded?", a: "Yes. Strategic and Delivery partners can co-brand learner materials, completion certificates and diagnostic insight reports with their logo alongside Mashar and the relevant accrediting bodies." },
    { q: "What commercial models are available?", a: "Flexible models tailored to your business: per-seat licensing, annual enterprise subscriptions, revenue-share on co-delivered engagements, or referral commissions for client introductions." },
    { q: "How long does onboarding take?", a: "From application to signed agreement and faculty enablement, onboarding typically takes 2 to 4 weeks depending on the partnership track." },
];

const INITIAL_FORM = {
    organizationName: "",
    organizationType: "Corporate Training / Academy",
    website: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    region: "Kuwait & GCC",
    estimatedLearners: "100 - 500 learners/yr",
    message: "",
};

const STEPS = ["Organization", "Contact", "Scope"];

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBFBFE] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0F1C80] focus:ring-4 focus:ring-[#0F1C80]/10 transition";
const labelCls = "block text-xs font-bold text-gray-700 mb-1.5";

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function BecomePartner() {
    const formSectionRef = useRef(null);
    const [selectedModel, setSelectedModel] = useState("Delivery Partner");
    const [faqOpen, setFaqOpen] = useState(0);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const scrollToFormWithModel = (modelId) => {
        setSelectedModel(modelId);
        setStep(1);
        setTimeout(() => formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateStep = () => {
        if (step === 1 && !formData.organizationName.trim()) {
            toast.error("Please enter your organization name.");
            return false;
        }
        if (step === 2) {
            const { firstName, lastName, email, phone } = formData;
            if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
                toast.error("Please fill in all required contact fields.");
                return false;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                toast.error("Please enter a valid work email.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        if (step < 3) return setStep(step + 1);

        setSubmitting(true);
        try {
            await axios.post("/api/public/partner/request", {
                inquiryType: "partner",
                partnershipType: selectedModel,
                company: formData.organizationName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                jobTitle: formData.jobTitle || formData.organizationType,
                email: formData.email,
                phone: formData.phone,
                website: formData.website,
                region: formData.region,
                message: `[Learners Estimate: ${formData.estimatedLearners}] [Org Type: ${formData.organizationType}] ${formData.message || ""}`,
            });
            setSubmitted(true);
            toast.success("Partnership application submitted successfully!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubmitted(false);
        setStep(1);
        setFormData(INITIAL_FORM);
    };

    const Select = ({ label, name, options }) => (
        <div>
            <label className={labelCls}>{label}</label>
            <select name={name} value={formData[name]} onChange={handleChange} className={inputCls}>
                {options.map(([v, t]) => (
                    <option key={v} value={v}>{t}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="relative overflow-hidden font-poppins bg-[#FAFAFC] text-[#0D1240]">
            <SEO
                title="Become a Partner | Mashar Global Partner Network"
                description="Join the Mashar Partner Ecosystem. License ICF & EMCC accredited leadership programs, integrate behavioral diagnostics, and scale human transformation across the GCC and internationally."
            />

            {/* ── HERO ── */}
            <section className="relative bg-[#0A1033] text-white overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0F1C80]/30 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-10 w-[450px] h-[450px] rounded-full bg-[#F38900]/15 blur-[130px] pointer-events-none" />
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#F38900] animate-pulse" />
                            Global Partner Ecosystem
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold font-spartan leading-[1.1] tracking-tight">
                            Partner with Mashar. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E6FF] to-[#F38900]">
                                Scale Transformative Leadership.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            License ICF and EMCC accredited programs, deploy proprietary psychometric diagnostics, and co-deliver human-centric leadership journeys with the GCC's premier coaching authority.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <button
                                type="button"
                                onClick={() => scrollToFormWithModel("Delivery Partner")}
                                className="px-7 py-3.5 rounded-full font-bold text-sm bg-[#F38900] hover:bg-[#D97706] shadow-lg shadow-[#F38900]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                Apply for Partnership <ArrowRight size={16} />
                            </button>
                            <a
                                href="#partner-models"
                                className="px-7 py-3.5 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/20 transition-all backdrop-blur-sm"
                            >
                                Explore Partner Models
                            </a>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-xs text-white/65">
                            <span className="flex items-center gap-2"><BadgeCheck size={16} className="text-[#F38900]" /> ICF Level 1 &amp; 2 Accredited</span>
                            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#F38900]" /> EMCC Framework</span>
                            <span className="flex items-center gap-2"><Clock size={16} className="text-[#F38900]" /> Reply within 48 hours</span>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.03] p-7 sm:p-9 border border-white/15 backdrop-blur-xl shadow-2xl space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#F38900]">Ecosystem Impact</p>
                                    <h3 className="text-xl font-bold font-spartan mt-0.5">Why Organizations Partner</h3>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F38900]">
                                    <Sparkles size={20} />
                                </div>
                            </div>

                            {[
                                { icon: Award, t: "Turnkey Global Accreditation", d: "Deliver internationally certifiable programs without years of accreditation overhead." },
                                { icon: Layers, t: "TAWDI & GEDI Diagnostics", d: "Fast, culturally attuned psychometric and leadership assessments for your clients." },
                                { icon: TrendingUp, t: "Flexible Revenue Models", d: "Co-sell, license or co-deliver on clear, competitive commercial terms." },
                            ].map(({ icon: Icon, t, d }) => (
                                <div key={t} className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-[#F38900]/25 text-[#F38900] flex items-center justify-center shrink-0">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{t}</p>
                                        <p className="text-xs text-white/70 mt-1 leading-snug">{d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <div className="bg-white border-y border-gray-200/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {STATS.map((s) => (
                        <div key={s.label}>
                            <p className={`text-2xl sm:text-4xl font-extrabold font-spartan ${s.tone}`}>{s.value}</p>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── PARTNER MODELS ── */}
            <section id="partner-models" className="scroll-mt-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20">
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">Collaboration Pathways</p>
                    <h2 className="text-2xl sm:text-4xl font-bold font-spartan">Choose Your Partnership Model</h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Expanding an educational portfolio or advising regional enterprises? Pick the track that fits, and you can change it later in the form.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {PARTNER_MODELS.map((m) => {
                        const Icon = m.icon;
                        const selected = selectedModel === m.id;
                        return (
                            <div
                                key={m.id}
                                className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between bg-white hover:-translate-y-1 ${selected ? "border-[#0F1C80] shadow-xl ring-4 ring-[#0F1C80]/10" : "border-gray-200 shadow-sm hover:shadow-lg"
                                    }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-4 mb-5">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: m.soft, color: m.accent }}>
                                            <Icon size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: m.soft, color: m.accent }}>
                                            {m.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold font-spartan mb-2">{m.title}</h3>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ideal for: {m.forWho}</p>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6">{m.description}</p>

                                    <ul className="space-y-2.5 pt-4 border-t border-gray-100 mb-8">
                                        {m.perks.map((perk) => (
                                            <li key={perk} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                                                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: m.accent }} />
                                                <span>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => scrollToFormWithModel(m.id)}
                                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${selected ? "bg-[#0F1C80] text-white" : "bg-[#F4F6FF] text-[#0F1C80] hover:bg-[#0F1C80] hover:text-white"
                                        }`}
                                >
                                    {selected ? "Selected · Continue" : "Select & Apply"} <ArrowRight size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Individual talent callout */}
                <div className="mt-12 bg-gradient-to-r from-[#FFF8EE] to-[#FFF4E5] border border-[#FFE0B2] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-[#F39300] text-white flex items-center justify-center shrink-0 shadow-md">
                            <Users2 size={24} />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-bold font-spartan">Are you an individual coach, facilitator or mentor?</h4>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Apply to Mashar's associate faculty bench or mentor network through our talent portal.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 shrink-0">
                        <a href="/join-our-team" className="px-6 py-3 rounded-full bg-[#0F1C80] hover:bg-[#15237F] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02]">
                            Join Our Faculty Bench →
                        </a>
                        <a href="/become-a-mentor" className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-[#0F1C80] text-[#0F1C80] text-xs sm:text-sm font-bold transition-all">
                            Become a Mentor →
                        </a>
                    </div>
                </div>
            </section>

            {/* ── ADVANTAGE ── */}
            <section className="bg-gradient-to-b from-[#F2F4FD] to-white py-20 border-y border-gray-200/70">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
                    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">The Mashar Advantage</p>
                        <h2 className="text-2xl sm:text-4xl font-bold font-spartan">What Sets Our Partner Network Apart</h2>
                        <p className="text-sm sm:text-base text-gray-600">We don't just license materials. We build institutional alliances backed by rigorous science and hands-on enablement.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ADVANTAGES.map(({ icon: Icon, title, desc }, i) => (
                            <div key={title} className="group bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${i % 2 === 0 ? "bg-[#EEF0FF] text-[#0F1C80] group-hover:bg-[#0F1C80]" : "bg-[#FFF4E5] text-[#F38900] group-hover:bg-[#F38900]"} group-hover:text-white`}>
                                    <Icon size={22} />
                                </div>
                                <h4 className="font-bold text-base font-spartan mb-2">{title}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ROADMAP ── */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20">
                <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">Clear Pathway</p>
                    <h2 className="text-2xl sm:text-4xl font-bold font-spartan">How We Onboard Partners</h2>
                    <p className="text-sm sm:text-base text-gray-600">A structured journey designed to have your faculty and programs live within weeks.</p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="hidden md:block absolute top-9 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#0F1C80]/10 via-[#F38900]/60 to-[#0F1C80]/10" />
                    {ROADMAP_STEPS.map((s) => (
                        <div key={s.num} className="relative bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-[#0F1C80] text-white font-spartan font-bold flex items-center justify-center mb-4 ring-4 ring-white">
                                {s.num}
                            </div>
                            <h4 className="text-base font-bold font-spartan mb-2">{s.title}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── APPLICATION FORM (3 STEPS) ── */}
            <section ref={formSectionRef} id="apply" className="scroll-mt-16 bg-[#0B1238] text-white py-20 relative overflow-hidden">
                <div className="absolute top-1/2 left-10 w-[400px] h-[400px] rounded-full bg-[#0F1C80]/40 blur-[130px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#F38900]/20 blur-[130px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 sm:px-10 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F38900] uppercase tracking-wider">
                            Official Partner Application
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold font-spartan">Apply to Join the Mashar Partner Network</h2>
                        <p className="text-sm sm:text-base text-white/75">
                            Takes about 3 minutes. Our partnerships team replies within 48 hours.
                        </p>
                    </div>

                    <div className="bg-white text-[#0D1240] rounded-3xl p-7 sm:p-12 shadow-2xl">
                        {submitted ? (
                            <div className="text-center py-10 space-y-5">
                                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold font-spartan">Application Received!</h3>
                                <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
                                    Thank you, {formData.firstName}. Our Head of Global Partnerships will review {formData.organizationName}'s profile and reach out within 2 business days.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-3 rounded-full text-sm font-bold bg-[#0F1C80] text-white hover:bg-[#14247B] transition-all"
                                >
                                    Submit Another Application
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                                {/* Stepper */}
                                <ol className="flex items-center justify-between gap-2">
                                    {STEPS.map((label, i) => {
                                        const n = i + 1;
                                        const done = step > n;
                                        const active = step === n;
                                        return (
                                            <li key={label} className="flex-1 flex items-center gap-2">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${done ? "bg-emerald-500 text-white" : active ? "bg-[#0F1C80] text-white" : "bg-gray-100 text-gray-400"}`}>
                                                    {done ? <Check size={14} /> : n}
                                                </span>
                                                <span className={`hidden sm:block text-xs font-bold ${active ? "text-[#0D1240]" : "text-gray-400"}`}>{label}</span>
                                                {n < STEPS.length && <span className={`flex-1 h-px ${done ? "bg-emerald-400" : "bg-gray-200"}`} />}
                                            </li>
                                        );
                                    })}
                                </ol>

                                {/* Track selector (always visible) */}
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Partnership Track</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {PARTNER_MODELS.map((m) => {
                                            const on = selectedModel === m.id;
                                            return (
                                                <button
                                                    type="button"
                                                    key={m.id}
                                                    onClick={() => setSelectedModel(m.id)}
                                                    aria-pressed={on}
                                                    className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex items-center justify-between gap-2 ${on ? "bg-[#0F1C80] text-white border-[#0F1C80] shadow-sm" : "bg-[#F8F9FF] border-[#DDE0FF] hover:border-[#0F1C80]"}`}
                                                >
                                                    <span className="truncate">{m.title}</span>
                                                    {on && <Check size={14} className="shrink-0 text-[#F38900]" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {step === 1 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                        <div className="sm:col-span-2">
                                            <label className={labelCls}>Organization / Entity Name *</label>
                                            <input name="organizationName" value={formData.organizationName} onChange={handleChange} placeholder="e.g. Gulf Academy of Leadership" autoComplete="organization" className={inputCls} />
                                        </div>
                                        <Select
                                            label="Organization Type"
                                            name="organizationType"
                                            options={[
                                                ["Corporate Training / Academy", "Corporate Training / Academy"],
                                                ["Management Consulting Firm", "Management Consulting Firm"],
                                                ["University / Higher Education", "University / Higher Education"],
                                                ["HR & Talent Advisory", "HR & Talent Advisory"],
                                                ["Executive Coaching Practice", "Executive Coaching Practice"],
                                                ["Government Entity", "Government Entity"],
                                                ["Other", "Other"],
                                            ]}
                                        />
                                        <div>
                                            <label className={labelCls}>Website URL</label>
                                            <input name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://..." className={inputCls} />
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                        <div>
                                            <label className={labelCls}>First Name *</label>
                                            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Abdullah" autoComplete="given-name" className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Last Name *</label>
                                            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Al-Mutawa" autoComplete="family-name" className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Job Title / Role</label>
                                            <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Head of Programs / Dean" autoComplete="organization-title" className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Work Email *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@org.com" autoComplete="email" className={inputCls} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={labelCls}>Phone / WhatsApp *</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+965 ..." autoComplete="tel" className={inputCls} />
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                        <Select
                                            label="Primary Operating Region"
                                            name="region"
                                            options={[
                                                ["Kuwait & GCC", "Kuwait & GCC Region"],
                                                ["Saudi Arabia", "Saudi Arabia (KSA)"],
                                                ["United Arab Emirates", "United Arab Emirates (UAE)"],
                                                ["Qatar & Bahrain & Oman", "Qatar, Bahrain & Oman"],
                                                ["Egypt & Levant", "Egypt & Levant"],
                                                ["Europe & UK", "Europe & UK"],
                                                ["North America", "North America"],
                                                ["Global / Multi-region", "Global / Multi-region"],
                                            ]}
                                        />
                                        <Select
                                            label="Projected Annual Learners"
                                            name="estimatedLearners"
                                            options={[
                                                ["50 - 100 learners/yr", "50 - 100 learners/yr"],
                                                ["100 - 500 learners/yr", "100 - 500 learners/yr"],
                                                ["500 - 1,500 learners/yr", "500 - 1,500 learners/yr"],
                                                ["1,500+ learners/yr", "1,500+ enterprise cohort"],
                                            ]}
                                        />
                                        <div className="sm:col-span-2">
                                            <label className={labelCls}>Tell us about your audience and partnership vision</label>
                                            <textarea
                                                rows={4}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Your current leadership or coaching offerings, target clientele, and what you aim to achieve with Mashar..."
                                                className={`${inputCls} resize-none`}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-1 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <Lock size={13} /> Partnership inquiries are treated as strictly confidential.
                                    </p>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setStep(step - 1)}
                                                className="flex items-center justify-center gap-2 px-6 h-12 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
                                            >
                                                <ArrowLeft size={16} /> Back
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 sm:flex-none h-12 px-8 rounded-full font-bold text-white text-sm bg-[#F38900] hover:bg-[#D97706] transition-all shadow-lg shadow-[#F38900]/25 flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            {submitting ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {step < 3 ? "Continue" : "Submit Application"} <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">Frequently Asked Questions</p>
                    <h3 className="text-2xl sm:text-3xl font-bold font-spartan">Everything You Need to Know About Partnering</h3>
                </div>

                <div className="space-y-3">
                    {FAQS.map((faq, idx) => {
                        const open = faqOpen === idx;
                        return (
                            <div key={faq.q} className={`border rounded-2xl bg-white overflow-hidden transition-all ${open ? "border-[#0F1C80]/30 shadow-md" : "border-gray-200"}`}>
                                <button
                                    type="button"
                                    aria-expanded={open}
                                    onClick={() => setFaqOpen(open ? -1 : idx)}
                                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm sm:text-base hover:text-[#0F1C80] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown size={18} className={`transition-transform duration-300 shrink-0 ${open ? "rotate-180 text-[#F38900]" : "text-gray-400"}`} />
                                </button>
                                {open && (
                                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}