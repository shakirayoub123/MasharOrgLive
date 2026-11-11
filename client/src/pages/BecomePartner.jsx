import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Handshake, Award, ShieldCheck, Globe2, Sparkles, Building2,
    Users2, BookOpenCheck, ArrowRight, CheckCircle2, ChevronRight,
    TrendingUp, BadgeCheck, FileText, HelpCircle, Layers, PhoneCall,
    Briefcase, Compass, ChevronDown, Check, Star
} from "lucide-react";
import SEO from "../components/SEO";
import handshakeImg from "../assets/handshake.png";
import officeImg from "../assets/OurSignoffice.png";

const PARTNER_MODELS = [
    {
        id: "Delivery Partner",
        title: "Delivery & Training Partner",
        badge: "Accredited Curricula",
        icon: BookOpenCheck,
        color: "#0F1C80",
        bgLight: "#EEF0FF",
        borderLight: "#DDE0FF",
        forWho: "Corporate Academies, Training Institutes, Leadership Centers",
        description: "License and deliver Mashar's ICF Level 1, Level 2, and EMCC accredited programs under your banner or co-branded.",
        perks: [
            "Complete turnkey curriculum & learner workbooks",
            "Faculty certification and train-the-trainer support",
            "Digital LMS and workbook assets provided",
            "Attractive licensing and revenue share margins",
        ],
    },
    {
        id: "Consulting Partner",
        title: "Consulting & Advisory Partner",
        badge: "Diagnostic Tools",
        icon: Building2,
        color: "#F38900",
        bgLight: "#FFF4E5",
        borderLight: "#FFE0B2",
        forWho: "Management Consultancies, HR Advisory Firms, Executive Search",
        description: "Incorporate Mashar's proprietary behavioral diagnostics (GEDI & TAWDI) and executive coaching into enterprise client engagements.",
        perks: [
            "Access to TAWDI (10-min) & GEDI (20-min) psychometrics",
            "Executive coaching & leadership talent matching",
            "Joint RFP bidding on major GCC government tenders",
            "Co-branded leadership audit and maturity reports",
        ],
    },
    {
        id: "Strategic Alliance",
        title: "Academic & Strategic Alliance",
        badge: "Institutional",
        icon: Globe2,
        color: "#0F1C80",
        bgLight: "#EEF0FF",
        borderLight: "#DDE0FF",
        forWho: "Universities, Business Schools, Government Leadership Initiatives",
        description: "Co-design executive diplomas, dual certifications, and collaborate on regional leadership intelligence and applied research.",
        perks: [
            "Joint certificate issuance with ICF / EMCC recognition",
            "Faculty exchange and guest masterclass delivery",
            "GCC leadership case studies & research data",
            "Custom blended pathways for graduate cohorts",
        ],
    },
    {
        id: "Coach Network",
        title: "Associate Coach & Facilitator Network",
        badge: "Faculty & Talent",
        icon: Users2,
        color: "#F38900",
        bgLight: "#FFF4E5",
        borderLight: "#FFE0B2",
        forWho: "ICF Credentialed Coaches (ACC/PCC/MCC), Master Facilitators",
        description: "Join Mashar's premier bench of facilitators to lead enterprise coaching and leadership cohorts across Kuwait, Saudi Arabia, UAE, and beyond.",
        perks: [
            "Engage high-caliber enterprise and government clients",
            "Peer community of practice & continuous supervision",
            "Certification in proprietary diagnostic tools",
            "Flexible associate contracts and competitive day rates",
        ],
    },
];

const ROADMAP_STEPS = [
    {
        num: "01",
        title: "Submit Application",
        desc: "Complete the partner inquiry form detailing your organization, audience, and partnership goals.",
    },
    {
        num: "02",
        title: "Alignment Discovery",
        desc: "A 30-minute strategic consultation with our Head of Partnerships to assess mutual fit and commercial model.",
    },
    {
        num: "03",
        title: "Enablement & Certification",
        desc: "Formal partner agreement, access to the partner portal, curricula licensing, and faculty onboarding.",
    },
    {
        num: "04",
        title: "Launch & Co-Delivery",
        desc: "Roll out accredited programs to your clients or cohorts with ongoing marketing, academic, and technical backing.",
    },
];

const FAQS = [
    {
        q: "What credentials do Mashar partner programs carry?",
        a: "Mashar programs are accredited by the International Coaching Federation (ICF) for Level 1 and Level 2 pathways, as well as the European Mentoring and Coaching Council (EMCC). Learners completing accredited programs through partners receive internationally recognized credentials.",
    },
    {
        q: "How does curriculum licensing work for Training Partners?",
        a: "Licensed delivery partners receive digital facilitator guides, participant workbooks, presentation slide decks, and evaluation frameworks. You can deliver these programs in-person, virtual, or hybrid. We also conduct faculty train-the-trainer certification before launch.",
    },
    {
        q: "Can programs and diagnostic reports be co-branded?",
        a: "Yes. Strategic and Delivery partners have the option to co-brand learner materials, completion certificates, and diagnostic insight reports with their organization's logo alongside Mashar and relevant accrediting bodies.",
    },
    {
        q: "What commercial models and revenue-sharing options are available?",
        a: "We offer flexible models tailored to your business: per-seat licensing, annual enterprise subscriptions, revenue-share splits on co-delivered engagements, or referral commissions for client introductions.",
    },
    {
        q: "How long does the partner onboarding process take?",
        a: "From initial application to signed agreement and faculty enablement, the standard onboarding timeline is typically 2 to 4 weeks depending on the complexity of the partnership track.",
    },
];

export default function BecomePartner() {
    const formSectionRef = useRef(null);
    const [selectedModel, setSelectedModel] = useState("Delivery Partner");
    const [faqOpen, setFaqOpen] = useState(0);

    const [formData, setFormData] = useState({
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
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const scrollToFormWithModel = (modelId) => {
        setSelectedModel(modelId);
        if (formSectionRef.current) {
            formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.organizationName.trim() || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error("Please fill in all required organization and contact fields.");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post("/api/public/partner/request", {
                inquiryType: selectedModel === "Coach Network" ? "join-team" : "partner",
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

    return (
        <div className="relative overflow-hidden font-poppins bg-[#FAFAFC] text-[#0D1240]">
            <SEO
                title="Become a Partner | Mashar Global Partner Network"
                description="Join the Mashar Partner Ecosystem. License ICF & EMCC accredited leadership programs, integrate behavioral diagnostics, and scale human transformation across the GCC and internationally."
            />

            {/* ═══════════════════════════════════════════════════════════════════
                HERO SECTION — Bespoke dark luxury tech architecture
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#0A1033] text-white overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
                {/* Background decorative glows */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0F1C80]/30 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-10 w-[450px] h-[450px] rounded-full bg-[#F38900]/15 blur-[130px] pointer-events-none" />

                {/* Subtle grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: `48px 48px`,
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Column — Value Prop */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider uppercase text-white">
                                <span className="w-2 h-2 rounded-full bg-[#F38900] animate-pulse" />
                                <span>Global Partner Ecosystem</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold font-spartan leading-[1.12] tracking-tight">
                                Partner with Mashar. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E6FF] to-[#F38900]">
                                    Scale Transformative Leadership.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                                License world-class ICF and EMCC accredited programs, deploy proprietary psychometric diagnostics, and co-deliver human-centric leadership journeys with the GCC's premier coaching authority.
                            </p>

                            {/* Hero Actions */}
                            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <button
                                    type="button"
                                    onClick={() => scrollToFormWithModel("Delivery Partner")}
                                    className="px-7 py-3.5 rounded-full font-bold text-sm bg-[#F38900] hover:bg-[#D97706] text-white shadow-lg shadow-[#F38900]/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <span>Apply for Partnership</span>
                                    <ArrowRight size={16} />
                                </button>
                                <a
                                    href="#partner-models"
                                    className="px-7 py-3.5 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-sm"
                                >
                                    Explore Partner Models
                                </a>
                            </div>

                            {/* Trust badges */}
                            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-white/60">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck size={16} className="text-[#F38900]" />
                                    <span>ICF Level 1 &amp; Level 2 Accredited</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-[#F38900]" />
                                    <span>EMCC European Framework</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe2 size={16} className="text-[#F38900]" />
                                    <span>GCC &amp; Global Enterprise Reach</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column — Bento Highlights Card */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.03] p-7 sm:p-9 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6">
                                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#F38900]">Ecosystem Impact</p>
                                        <h3 className="text-xl font-bold font-spartan text-white mt-0.5">Why Organizations Partner</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F38900]">
                                        <Sparkles size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-[#0F1C80]/60 text-white flex items-center justify-center shrink-0 mt-0.5">
                                            <Award size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Turnkey Global Accreditation</p>
                                            <p className="text-xs text-white/70 mt-1 leading-snug">Deliver internationally certifiable diplomas without years of independent accreditation overhead.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-[#F38900]/40 text-white flex items-center justify-center shrink-0 mt-0.5">
                                            <Layers size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">TAWDI &amp; GEDI Diagnostics</p>
                                            <p className="text-xs text-white/70 mt-1 leading-snug">Empower your client engagements with fast, culturally attuned psychometric and leadership assessments.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Generous Revenue Models</p>
                                            <p className="text-xs text-white/70 mt-1 leading-snug">Co-sell, license, or co-deliver with predictable and competitive multi-year commercial terms.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => scrollToFormWithModel("Delivery Partner")}
                                        className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-[#0A1033] hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Start Partner Evaluation</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                STATISTICS COUNTERS
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="bg-white border-y border-gray-200/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-3xl sm:text-4xl font-extrabold font-spartan text-[#0F1C80]">15,000+</p>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Leaders Certified &amp; Coached</p>
                    </div>
                    <div>
                        <p className="text-3xl sm:text-4xl font-extrabold font-spartan text-[#F38900]">Level 1 &amp; 2</p>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">ICF Coaching Accreditation</p>
                    </div>
                    <div>
                        <p className="text-3xl sm:text-4xl font-extrabold font-spartan text-[#0F1C80]">10+ Nations</p>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">GCC &amp; International Delivery</p>
                    </div>
                    <div>
                        <p className="text-3xl sm:text-4xl font-extrabold font-spartan text-[#F38900]">100%</p>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Enablement &amp; Faculty Support</p>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                PARTNER MODELS — 4 Tiered Architecture
            ═══════════════════════════════════════════════════════════════════ */}
            <section id="partner-models" className="scroll-mt-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">Collaboration Pathways</p>
                    <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240]">
                        Choose Your Partnership Model
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Whether you are an institution expanding your educational portfolio or a consulting advisory serving regional enterprises, we have tailored collaboration tracks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PARTNER_MODELS.map((model) => {
                        const Icon = model.icon;
                        const isSelected = selectedModel === model.id;

                        return (
                            <div
                                key={model.id}
                                className={`rounded-3xl p-8 sm:p-9 border transition-all duration-300 flex flex-col justify-between relative bg-white ${
                                    isSelected
                                        ? "border-[#0F1C80] shadow-xl ring-2 ring-[#0F1C80]/10"
                                        : "border-gray-200/90 shadow-sm hover:shadow-lg hover:border-gray-300"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-4 mb-5">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ background: model.bgLight, color: model.color }}
                                        >
                                            <Icon size={24} />
                                        </div>
                                        <span
                                            className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border"
                                            style={{ background: model.bgLight, color: model.color, borderColor: model.borderLight }}
                                        >
                                            {model.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold font-spartan text-[#0D1240] mb-2">
                                        {model.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                        Ideal For: {model.forWho}
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                        {model.description}
                                    </p>

                                    <div className="space-y-2.5 pt-4 border-t border-gray-100 mb-8">
                                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Included In This Model:</p>
                                        {model.perks.map((perk, pi) => (
                                            <div key={pi} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                                                <CheckCircle2 size={16} className="text-[#0F1C80] shrink-0 mt-0.5" />
                                                <span>{perk}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => scrollToFormWithModel(model.id)}
                                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                    style={{
                                        background: isSelected ? "#0F1C80" : "#F4F6FF",
                                        color: isSelected ? "#FFFFFF" : "#0F1C80",
                                    }}
                                >
                                    <span>{isSelected ? "Selected for Application" : "Select & Apply"}</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                WHY PARTNER WITH MASHAR — 4 Core Enablement Pillars
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="bg-gradient-to-b from-[#F2F4FD] to-[#FFFFFF] py-20 border-y border-gray-200/70">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">The Mashar Advantage</p>
                        <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240]">
                            What Sets Our Partner Network Apart
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            We don’t just license materials; we form deep institutional alliances backed by rigorous science and hands-on enablement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm space-y-3 hover:translate-y-[-4px] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-xl font-bold">
                                🎖️
                            </div>
                            <h4 className="font-bold text-base font-spartan text-[#0D1240]">Dual ICF &amp; EMCC Backing</h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                Deliver programs that satisfy the most exacting global standards, eliminating hesitation from enterprise procurement teams.
                            </p>
                        </div>

                        <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm space-y-3 hover:translate-y-[-4px] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFF4E5] text-[#F38900] flex items-center justify-center text-xl font-bold">
                                🧠
                            </div>
                            <h4 className="font-bold text-base font-spartan text-[#0D1240]">Proprietary Behavioral Tools</h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                Deploy TAWDI (team awareness) and GEDI (executive growth) to pinpoint developmental needs before costly engagements.
                            </p>
                        </div>

                        <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm space-y-3 hover:translate-y-[-4px] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] text-[#0F1C80] flex items-center justify-center text-xl font-bold">
                                📚
                            </div>
                            <h4 className="font-bold text-base font-spartan text-[#0D1240]">Comprehensive Faculty Kits</h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                Facilitator lesson plans, slide decks, participant workbooks, and case studies ready for immediate in-person or virtual delivery.
                            </p>
                        </div>

                        <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm space-y-3 hover:translate-y-[-4px] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFF4E5] text-[#F38900] flex items-center justify-center text-xl font-bold">
                                🤝
                            </div>
                            <h4 className="font-bold text-base font-spartan text-[#0D1240]">Dedicated Partner Manager</h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                Direct channel support from co-selling proposals and RFP support to learner graduation ceremonies and credential issuance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                ROADMAP — 4 Step Partner Journey
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">Clear Pathway</p>
                    <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240]">
                        How We Onboard Partners
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        A structured, rapid onboarding journey designed to have your faculty and programs live in 30 days or less.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {ROADMAP_STEPS.map((s, idx) => (
                        <div key={s.num} className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm relative">
                            <span className="text-3xl font-black font-spartan text-[#0F1C80]/15 mb-3 block">
                                {s.num}
                            </span>
                            <h4 className="text-base font-bold font-spartan text-[#0D1240] mb-2">{s.title}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                PARTNERSHIP APPLICATION SECTION — Distinct Bento Form
            ═══════════════════════════════════════════════════════════════════ */}
            <section ref={formSectionRef} className="scroll-mt-16 bg-[#0B1238] text-white py-20 relative overflow-hidden">
                <div className="absolute top-1/2 left-10 w-[400px] h-[400px] rounded-full bg-[#0F1C80]/40 blur-[130px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#F38900]/20 blur-[130px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 sm:px-10 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F38900] uppercase tracking-wider">
                            <span>Official Partner Application</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-white">
                            Apply to Join the Mashar Partner Network
                        </h2>
                        <p className="text-sm sm:text-base text-white/75">
                            Selected track: <span className="font-bold text-[#F38900]">{selectedModel}</span>. Complete the details below and our partnership leadership will be in touch within 48 hours.
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white text-[#0D1240] rounded-3xl p-7 sm:p-12 shadow-2xl border border-white/20">
                        {submitted ? (
                            <div className="text-center py-12 space-y-5 animate-in fade-in">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                                    ✓
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold font-spartan text-[#0D1240]">
                                    Application Successfully Received!
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
                                    Thank you for your interest in partnering with Mashar. Our Head of Global Partnerships will review your organization’s profile and reach out within 2 business days.
                                </p>
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSubmitted(false);
                                            setFormData({
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
                                            });
                                        }}
                                        className="px-8 py-3 rounded-full text-sm font-bold bg-[#0F1C80] text-white hover:bg-[#14247B] transition-all"
                                    >
                                        Submit Another Application
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Track selector pill buttons inside form */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                                        Select Partnership Track
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                        {PARTNER_MODELS.map(m => (
                                            <button
                                                type="button"
                                                key={m.id}
                                                onClick={() => setSelectedModel(m.id)}
                                                className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex items-center justify-between gap-2 ${
                                                    selectedModel === m.id
                                                        ? "bg-[#0F1C80] text-white border-[#0F1C80] shadow-sm"
                                                        : "bg-[#F8F9FF] text-[#0D1240] border-[#DDE0FF] hover:border-[#0F1C80]"
                                                }`}
                                            >
                                                <span className="truncate">{m.title}</span>
                                                {selectedModel === m.id && <Check size={14} className="shrink-0 text-[#F38900]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4" />

                                {/* Section 1: Organization Details */}
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-[#0F1C80] mb-3">
                                        1. Organization Profile
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Organization / Entity Name *</label>
                                            <input
                                                required
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleChange}
                                                placeholder="e.g. Gulf Academy of Leadership"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Organization Type</label>
                                            <select
                                                name="organizationType"
                                                value={formData.organizationType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            >
                                                <option value="Corporate Training / Academy">Corporate Training / Academy</option>
                                                <option value="Management Consulting Firm">Management Consulting Firm</option>
                                                <option value="University / Higher Education">University / Higher Education</option>
                                                <option value="HR & Talent Advisory">HR &amp; Talent Advisory</option>
                                                <option value="Executive Coaching Practice">Executive Coaching Practice</option>
                                                <option value="Government Entity">Government Entity</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Website URL</label>
                                            <input
                                                name="website"
                                                type="url"
                                                value={formData.website}
                                                onChange={handleChange}
                                                placeholder="https://..."
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Contact Person */}
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-[#0F1C80] mb-3">
                                        2. Primary Contact Person
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                                            <input
                                                required
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="e.g. Abdullah"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Last Name *</label>
                                            <input
                                                required
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="e.g. Al-Mutawa"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Job Title / Role</label>
                                            <input
                                                name="jobTitle"
                                                value={formData.jobTitle}
                                                onChange={handleChange}
                                                placeholder="e.g. Head of Programs / Dean"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Work Email *</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@org.com"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Scope & Region */}
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-[#0F1C80] mb-3">
                                        3. Delivery Region &amp; Scope
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp *</label>
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+965 ..."
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Primary Operating Region</label>
                                            <select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            >
                                                <option value="Kuwait & GCC">Kuwait &amp; GCC Region</option>
                                                <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                                                <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                                                <option value="Qatar & Bahrain & Oman">Qatar, Bahrain &amp; Oman</option>
                                                <option value="Egypt & Levant">Egypt &amp; Levant</option>
                                                <option value="Europe & UK">Europe &amp; UK</option>
                                                <option value="North America">North America</option>
                                                <option value="Global / Multi-region">Global / Multi-region</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Projected Annual Learners</label>
                                            <select
                                                name="estimatedLearners"
                                                value={formData.estimatedLearners}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE]"
                                            >
                                                <option value="50 - 100 learners/yr">50 - 100 learners/yr</option>
                                                <option value="100 - 500 learners/yr">100 - 500 learners/yr</option>
                                                <option value="500 - 1,500 learners/yr">500 - 1,500 learners/yr</option>
                                                <option value="1,500+ learners/yr">1,500+ enterprise cohort</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Message */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Tell us about your audience and partnership vision
                                    </label>
                                    <textarea
                                        rows={3}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Describe your current leadership or coaching offerings, your target clientele, and what you aim to achieve with Mashar..."
                                        className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 bg-[#FBFBFE] resize-none"
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                                    <p className="text-xs text-gray-400">
                                        🔒 All partnership inquiries are governed by non-disclosure and strict confidentiality.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="h-12 px-8 rounded-full font-bold text-white text-sm bg-[#F38900] hover:bg-[#D97706] transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
                                    >
                                        {submitting ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Submit Partner Application</span>
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                PARTNER FAQS
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F38900]">Frequently Asked Questions</p>
                    <h3 className="text-2xl sm:text-3xl font-bold font-spartan text-[#0D1240]">
                        Everything You Need to Know About Partnering
                    </h3>
                </div>

                <div className="space-y-3">
                    {FAQS.map((faq, idx) => {
                        const isOpen = faqOpen === idx;
                        return (
                            <div
                                key={idx}
                                className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all"
                            >
                                <button
                                    type="button"
                                    onClick={() => setFaqOpen(isOpen ? -1 : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-[#0D1240] hover:text-[#0F1C80]"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 text-gray-400 shrink-0 ${isOpen ? "rotate-180 text-[#0F1C80]" : ""}`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
