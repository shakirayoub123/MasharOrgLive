import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Users, Heart, Sparkles, Globe, CheckCircle2, ArrowRight, ArrowLeft,
    ChevronDown, Star, Send, MapPin, Lock, GraduationCap, Briefcase,
    FileText, MessageCircle, Handshake, Clock, Award, Languages, ShieldCheck
} from "lucide-react";
import SEO from "../components/SEO";
import teamPhoto from "../assets/MasharFullTeam.png";
import CurvedLine from "../assets/CurvedLine.png";

/* ───────────────────────── DATA ───────────────────────── */

const STATS = [
    { icon: Users, value: "500+", label: "Coaches & Leaders Trained" },
    { icon: Award, value: "ICF · EMCC", label: "Dual Accredited Standards" },
    { icon: Languages, value: "100%", label: "Bilingual (Arabic & English)" },
    { icon: Globe, value: "GCC Bench", label: "Kuwait · KSA · UAE" },
];

const CULTURE_PILLARS = [
    { icon: Heart, title: "Deeply Human, Purpose-Driven", desc: "Every program, cohort and conversation is designed to spark lasting, authentic growth, not tick corporate boxes." },
    { icon: Globe, title: "Bilingual Pride & Cultural Nuance", desc: "Equal fluency in Arabic and English, rooted in Arab heritage, Islamic coaching principles (Ershad) and modern behavioral science." },
    { icon: Sparkles, title: "Psychological Safety", desc: "Kindness and intellectual rigor walk hand-in-hand. You practice in an environment that supports and protects your well-being." },
    { icon: GraduationCap, title: "Continuous Development", desc: "Reflective supervision, train-the-trainer masterclasses and accreditation in our proprietary tools, TAWDI & GEDI." },
];

const FACULTY_DISCIPLINES = [
    {
        title: "Executive & Leadership Coach",
        tag: "Associate Bench",
        credentials: "ICF PCC / MCC or EMCC Senior",
        description: "Partner 1-on-1 with C-suite executives, senior government leaders and enterprise directors across the GCC.",
        perks: ["Competitive executive day / hourly rates", "Premier regional enterprise engagements", "Client onboarding & scheduling support"],
    },
    {
        title: "Master Leadership Facilitator",
        tag: "Cohort Lead",
        credentials: "Certified Master Facilitator",
        description: "Deliver experiential leadership cohorts, corporate academies and masterclasses using Mashar's accredited curricula.",
        perks: ["Turnkey bilingual materials", "Interactive cohort labs & workbooks", "Train-the-trainer certification"],
    },
    {
        title: "Team Coach & Assessment Specialist",
        tag: "Diagnostics Specialist",
        credentials: "Team Coaching Cert. (ACTC / EMCC)",
        description: "Deploy our behavioral diagnostics (GEDI & TAWDI) and lead systemic team coaching for leadership teams.",
        perks: ["Official GEDI & TAWDI certification", "Systemic team intervention playbooks", "High-visibility advisory projects"],
    },
];

const CORE_ROLES = [
    {
        title: "Learning Experience & Instructional Designer",
        type: "Full-Time / Contract",
        location: "Kuwait / Dubai / Remote GCC",
        description: "Architect hybrid executive leadership journeys, digital workbooks and experiential activities rooted in adult learning theory.",
    },
    {
        title: "Client Success & Cohort Experience Manager",
        type: "Full-Time",
        location: "Kuwait / UAE",
        description: "Be the operational heartbeat of our programs, guiding corporate clients and learners from enrollment to graduation with warmth and polish.",
    },
    {
        title: "Enterprise Partnerships & Advisory Lead",
        type: "Full-Time",
        location: "Riyadh / Dubai / Kuwait",
        description: "Consult with CHROs and academy leaders to diagnose talent needs and shape customized Mashar solutions.",
    },
];

const PROCESS = [
    { icon: Send, title: "Apply in 2 minutes", desc: "Share your details and a short story. No lengthy forms." },
    { icon: FileText, title: "Profile review", desc: "Our talent team reviews every application personally, within 3 business days." },
    { icon: MessageCircle, title: "Conversation", desc: "A warm, two-way chat about your approach, fit and goals." },
    { icon: Handshake, title: "Welcome aboard", desc: "Onboarding, certification and your first engagement." },
];

const FAQS = [
    { q: "What is the difference between joining as Faculty vs. Core Team?", a: "Faculty are certified coaches, mentors and master facilitators who lead client delivery on a flexible project/associate basis. Core Team members are full-time or contract professionals managing operations, learning design, client success and growth." },
    { q: "Can I be Associate Faculty while running my own coaching practice?", a: "Yes. Most of our faculty are established independent executive coaches and consultants who partner with Mashar for high-profile GCC enterprise and government engagements." },
    { q: "What are the language requirements?", a: "Some assignments are fully in English, but dual fluency in Arabic and English is strongly preferred, as many regional cohorts need seamless bilingual facilitation." },
    { q: "How does Mashar support my professional development?", a: "Every faculty member is certified in our psychometric diagnostics (TAWDI and GEDI), joins our monthly Community of Practice and receives reflective supervision aligned with ICF and EMCC standards." },
];

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#F39300] focus:ring-4 focus:ring-[#F39300]/15 transition";
const labelCls = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2";

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function JoinOurTeam() {
    const formRef = useRef(null);
    const [pathway, setPathway] = useState("faculty");
    const [selectedRole, setSelectedRole] = useState(FACULTY_DISCIPLINES[0].title);
    const [faqOpen, setFaqOpen] = useState(0);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        linkedin: "", portfolio: "",
        credentials: "ICF PCC",
        coachingHours: "500 - 1,000 hours",
        languages: "Bilingual (Arabic & English)",
        region: "Kuwait",
        experienceYears: "5 - 10 years",
        motivation: "",
    });

    const isFaculty = pathway === "faculty";

    const switchPathway = (type) => {
        setPathway(type);
        setSelectedRole(type === "faculty" ? FACULTY_DISCIPLINES[0].title : CORE_ROLES[0].title);
    };

    const scrollToForm = (roleTitle, type = "faculty") => {
        setPathway(type);
        if (roleTitle) setSelectedRole(roleTitle);
        setStep(1);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const goNext = () => {
        const { firstName, lastName, email, phone } = formData;
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
            toast.error("Please fill in all required contact fields.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) return goNext();

        setSubmitting(true);
        try {
            await axios.post("/api/public/partner/request", {
                inquiryType: "join-team",
                partnershipType: isFaculty ? "Faculty / Associate Network" : "Core Team / Operations",
                roleInterest: selectedRole,
                company: "Individual Talent Application",
                jobTitle: selectedRole,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                linkedin: formData.linkedin,
                website: formData.portfolio,
                region: formData.region,
                experience: isFaculty
                    ? `${formData.credentials} · ${formData.coachingHours} · ${formData.languages}`
                    : `${formData.experienceYears} experience · Location: ${formData.region}`,
                message: formData.motivation,
            });
            setSubmitted(true);
            toast.success("Application received! We look forward to reviewing your profile.");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const SelectField = ({ label, name, options }) => (
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
        <div className="bg-white min-h-screen text-[#1A1A1A] font-poppins selection:bg-[#F39300] selection:text-white">
            <SEO
                title="Join Our Team & Faculty | Mashar"
                description="Become part of Mashar's family of executive coaches, master facilitators and culture creators transforming leadership across the GCC."
            />

            {/* ── HERO: INTERACTIVE TALENT & FACULTY PATHWAYS PORTAL ── */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-white pt-6 sm:pt-10 pb-16 sm:pb-24 border-b border-amber-100/60">
                {/* Ambient luxury glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#F39300]/12 via-[#0F1C80]/06 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
                <div className="absolute -top-10 right-10 w-72 h-72 rounded-full bg-[#F39300]/10 blur-3xl pointer-events-none" />
                <div className="absolute top-40 -left-10 w-72 h-72 rounded-full bg-[#0F1C80]/08 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
                    {/* Modern Live Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 border border-amber-200/80 shadow-sm backdrop-blur-md mb-6">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F39300] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F39300]"></span>
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#0D1240]">
                            Mashar Faculty & Associate Network <span className="text-gray-300 mx-1">|</span> <span className="text-[#C87500]">2026 GCC Expansion</span>
                        </span>
                    </div>

                    {/* Majestic Centered Headline with CurvedLine Accent */}
                    <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-bold font-spartan text-[#0D1240] tracking-tight leading-[1.14] max-w-4xl mx-auto">
                        Step Onto the Region’s Premier{" "}
                        <span className="relative inline-block text-[#F39300]">
                            Coaching Stage.
                            <img
                                src={CurvedLine}
                                alt=""
                                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-2.5 sm:h-3.5 object-contain pointer-events-none"
                            />
                        </span>
                    </h1>

                    <p className="mt-5 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Mashar is expanding our distinguished collective of bilingual executive coaches, master facilitators, and culture creators. Select your pathway below to partner with regional leaders across Kuwait, Saudi Arabia, and the UAE.
                    </p>

                    {/* ── 3 INTERACTIVE TALENT PATHWAY CARDS (Bento Grid) ── */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {/* CARD 1: Executive & Leadership Coach */}
                        <div className="group relative bg-white rounded-3xl p-7 border-2 border-amber-300 shadow-xl shadow-amber-500/5 hover:shadow-2xl hover:border-[#F39300] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
                            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#F39300] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                                High Demand in GCC
                            </div>
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#F39300]/10 text-[#F39300] flex items-center justify-center mb-5 group-hover:bg-[#F39300] group-hover:text-white transition-colors">
                                    <Award size={24} />
                                </div>
                                <span className="text-xs font-bold text-[#C87500] uppercase tracking-wider">Faculty Bench</span>
                                <h3 className="text-xl font-bold font-spartan text-[#0D1240] mt-1 mb-2">
                                    Executive & Team Coach
                                </h3>
                                <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                    <GraduationCap size={14} className="text-[#F39300]" />
                                    ICF PCC / MCC or EMCC Senior
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                                    Partner 1-on-1 with C-suite executives, government ministers, and enterprise directors on high-impact transformation engagements.
                                </p>

                                <ul className="space-y-2.5 text-xs text-gray-600 mb-6">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Executive day & hourly retainer rates</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Dedicated client matching & onboarding</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Reflective coaching supervision included</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => scrollToForm("Executive & Leadership Coach", "faculty")}
                                className="w-full py-3.5 px-4 rounded-full bg-[#F39300] hover:bg-[#D97706] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#F39300]/25 transition-all group-hover:gap-3"
                            >
                                <span>Apply as Coach</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* CARD 2: Master Leadership Facilitator */}
                        <div className="group relative bg-white rounded-3xl p-7 border border-gray-200/90 shadow-lg hover:shadow-2xl hover:border-[#0F1C80] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#0F1C80]/10 text-[#0F1C80] flex items-center justify-center mb-5 group-hover:bg-[#0F1C80] group-hover:text-white transition-colors">
                                    <Users size={24} />
                                </div>
                                <span className="text-xs font-bold text-[#0F1C80] uppercase tracking-wider">Cohort Lead</span>
                                <h3 className="text-xl font-bold font-spartan text-[#0D1240] mt-1 mb-2">
                                    Master Facilitator
                                </h3>
                                <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                    <Languages size={14} className="text-[#0F1C80]" />
                                    Bilingual Arabic & English
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                                    Lead executive academies, team retreats, and systemic cultural shifts using proven behavioral science and experiential methods.
                                </p>

                                <ul className="space-y-2.5 text-xs text-gray-600 mb-6">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Certified in proprietary TAWDI & GEDI tools</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Top GCC corporate & public cohorts</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Comprehensive facilitator toolkits & slides</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => scrollToForm("Master Leadership Facilitator", "faculty")}
                                className="w-full py-3.5 px-4 rounded-full bg-[#0F1C80] hover:bg-[#15237F] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#0F1C80]/20 transition-all group-hover:gap-3"
                            >
                                <span>Apply as Facilitator</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* CARD 3: Core Team & Learning Operations */}
                        <div className="group relative bg-white rounded-3xl p-7 border border-gray-200/90 shadow-lg hover:shadow-2xl hover:border-gray-900 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center mb-5 group-hover:bg-[#0D1240] group-hover:text-white transition-colors">
                                    <Briefcase size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Mashar HQ & Growth</span>
                                <h3 className="text-xl font-bold font-spartan text-[#0D1240] mt-1 mb-2">
                                    Core Team Roles
                                </h3>
                                <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-gray-500" />
                                    Kuwait City & Hybrid GCC
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                                    Build the operational backbone of our institute across learning experience design, alumni engagement, and enterprise partnership management.
                                </p>

                                <ul className="space-y-2.5 text-xs text-gray-600 mb-6">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Kind, intellectually rigorous culture</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Flexible hybrid working structure</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>Annual coaching & learning development budget</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => scrollToForm("Learning Experience Designer", "core")}
                                className="w-full py-3.5 px-4 rounded-full bg-white border-2 border-[#0D1240] text-[#0D1240] hover:bg-[#0D1240] hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all group-hover:gap-3"
                            >
                                <span>View Core Openings</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* ── REAL TEAM PHOTO MOSAIC RIBBON ── */}
                    <div className="mt-14 relative rounded-3xl overflow-hidden border-2 border-amber-100 shadow-xl bg-white max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                            <div className="md:col-span-5 p-6 sm:p-8 text-left bg-gradient-to-br from-[#0D1240] to-[#0F1C80] text-white">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-[#F39300] uppercase tracking-wider mb-3">
                                    The Mashar Family
                                </span>
                                <h4 className="text-xl sm:text-2xl font-bold font-spartan leading-snug">
                                    A Safe, Empowering Home for Transformation Creators.
                                </h4>
                                <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed">
                                    We practice what we teach: psychological safety, genuine kindness, and continuous peer supervision across Kuwait, Riyadh, and Dubai.
                                </p>
                                <div className="mt-5 flex items-center gap-4 text-xs font-semibold text-[#F39300]">
                                    <span>Kuwait</span> • <span>Riyadh</span> • <span>Dubai</span>
                                </div>
                            </div>
                            <div className="md:col-span-7 h-56 sm:h-64 overflow-hidden relative">
                                <img
                                    src={teamPhoto}
                                    alt="The Mashar Team & Faculty"
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-[#0D1240] text-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex items-center gap-3 justify-center lg:justify-start">
                            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#F39300] shrink-0">
                                <Icon size={22} />
                            </div>
                            <div>
                                <p className="text-lg font-bold font-spartan leading-tight">{value}</p>
                                <p className="text-[11px] sm:text-xs text-white/70 leading-snug">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CULTURE ── */}
            <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F39300] mb-2">Our Heartbeat</p>
                    <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240]">What It Feels Like to Work at Mashar</h2>
                    <p className="mt-3 text-sm sm:text-base text-gray-600">We don’t just teach leadership values. We live them every day.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CULTURE_PILLARS.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="group bg-[#FAFBFD] border border-gray-100 hover:border-[#F39300]/40 rounded-3xl p-7 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#F39300] shadow-sm flex items-center justify-center text-[#F39300] group-hover:text-white mb-5 transition-colors">
                                <Icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold font-spartan text-[#0D1240] mb-2">{title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PATHWAYS ── */}
            <section className="py-20 bg-gradient-to-b from-[#F8FAFF] via-white to-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0F1C80] mb-2">Choose Your Pathway</p>
                        <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240]">How Would You Like to Collaborate?</h2>

                        <div role="tablist" className="mt-7 inline-flex p-1.5 rounded-full bg-gray-200/80">
                            {[
                                ["faculty", GraduationCap, "Coaching & Faculty"],
                                ["core", Briefcase, "Core Team"],
                            ].map(([key, Icon, label]) => (
                                <button
                                    key={key}
                                    role="tab"
                                    aria-selected={pathway === key}
                                    type="button"
                                    onClick={() => switchPathway(key)}
                                    className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${pathway === key ? "bg-[#0F1C80] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
                                >
                                    <Icon size={16} /> {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isFaculty ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                            {FACULTY_DISCIPLINES.map((item) => (
                                <div key={item.title} className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#F39300]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className="text-xs font-bold text-[#F39300] bg-[#FFF4E5] px-3 py-1 rounded-full">{item.tag}</span>
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{item.credentials}</span>
                                        </div>
                                        <h3 className="text-xl font-bold font-spartan text-[#0D1240] mb-3">{item.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-5">{item.description}</p>
                                        <ul className="space-y-2.5 mb-6 pt-4 border-t border-gray-100">
                                            {item.perks.map((p) => (
                                                <li key={p} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    <span>{p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => scrollToForm(item.title, "faculty")}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#F39300]/10 hover:bg-[#F39300] text-[#C87500] hover:text-white font-semibold text-sm transition-all"
                                    >
                                        Apply as Faculty <ArrowRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                            {CORE_ROLES.map((role) => (
                                <div key={role.title} className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#0F1C80]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className="text-xs font-bold text-[#0F1C80] bg-[#EEF0FF] px-3 py-1 rounded-full">{role.type}</span>
                                            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                                                <MapPin size={13} /> {role.location}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold font-spartan text-[#0D1240] mb-3">{role.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-6">{role.description}</p>
                                    </div>
                                    <button
                                        onClick={() => scrollToForm(role.title, "core")}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0F1C80]/10 hover:bg-[#0F1C80] text-[#0F1C80] hover:text-white font-semibold text-sm transition-all"
                                    >
                                        Apply for this Role <ArrowRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F39300] mb-2">Simple & Transparent</p>
                    <h2 className="text-2xl sm:text-4xl font-bold font-spartan text-[#0D1240]">What Happens After You Apply</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#F39300]/10 via-[#F39300]/50 to-[#F39300]/10" />
                    {PROCESS.map(({ icon: Icon, title, desc }, i) => (
                        <div key={title} className="relative text-center">
                            <div className="relative mx-auto w-14 h-14 rounded-full bg-white border-2 border-[#F39300] text-[#F39300] flex items-center justify-center shadow-md mb-4">
                                <Icon size={22} />
                                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0F1C80] text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                            </div>
                            <h3 className="text-base font-bold font-spartan text-[#0D1240] mb-1">{title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-[240px] mx-auto">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── APPLICATION FORM (2 STEPS) ── */}
            <section ref={formRef} id="join-form" className="pb-20 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 scroll-mt-24">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0D1240] to-[#0F1C80] text-white px-8 sm:px-12 py-8 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#F39300] flex items-center justify-center mx-auto mb-3">
                            <Send size={22} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-spartan">
                            {isFaculty ? "Faculty & Coach Application" : "Core Team Application"}
                        </h2>
                        <p className="text-sm text-white/75 mt-2">
                            Applying for: <span className="font-bold text-[#F39300]">{selectedRole}</span>
                        </p>

                        {!submitted && (
                            <div className="mt-6 max-w-sm mx-auto">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-white/70 mb-2">
                                    <span className={step === 1 ? "text-white" : ""}>1 · About you</span>
                                    <span className={step === 2 ? "text-white" : ""}>2 · Your profile</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                                    <div className="h-full bg-[#F39300] transition-all duration-500" style={{ width: step === 1 ? "50%" : "100%" }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-8 sm:p-12">
                        {submitted ? (
                            <div className="text-center space-y-3 py-6">
                                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0D1240] font-spartan">Thank you, {formData.firstName}!</h3>
                                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                                    Your application has been delivered to our talent leadership team. We review every profile carefully and will be in touch within 3 business days.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                {step === 1 && (
                                    <div className="space-y-5 animate-fadeIn">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className={labelCls}>First Name *</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Noura" autoComplete="given-name" className={inputCls} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Last Name *</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Al-Sabah" autoComplete="family-name" className={inputCls} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Email Address *</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="noura@example.com" autoComplete="email" className={inputCls} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Phone / WhatsApp *</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+965 9999 1111" autoComplete="tel" className={inputCls} />
                                            </div>
                                        </div>
                                        <SelectField
                                            label="Location / GCC Base"
                                            name="region"
                                            options={[
                                                ["Kuwait", "Kuwait"],
                                                ["Saudi Arabia (Riyadh / Jeddah / Khobar)", "Saudi Arabia"],
                                                ["United Arab Emirates (Dubai / Abu Dhabi)", "United Arab Emirates"],
                                                ["Qatar", "Qatar"],
                                                ["Bahrain", "Bahrain"],
                                                ["Oman", "Oman"],
                                                ["International / Hybrid Remote", "International / Hybrid Remote"],
                                            ]}
                                        />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-5 animate-fadeIn">
                                        {isFaculty ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                                <SelectField
                                                    label="Credentials"
                                                    name="credentials"
                                                    options={[
                                                        ["ICF MCC", "ICF MCC"],
                                                        ["ICF PCC", "ICF PCC"],
                                                        ["ICF ACC", "ICF ACC"],
                                                        ["EMCC Senior / Master", "EMCC Senior / Master"],
                                                        ["Certified Facilitator", "Certified Facilitator / Trainer"],
                                                        ["In Progress", "Credential In Progress"],
                                                    ]}
                                                />
                                                <SelectField
                                                    label="Coaching Hours"
                                                    name="coachingHours"
                                                    options={[
                                                        ["2,500+ verified hours", "2,500+ hours"],
                                                        ["1,000 - 2,500 hours", "1,000 - 2,500 hours"],
                                                        ["500 - 1,000 hours", "500 - 1,000 hours"],
                                                        ["100 - 500 hours", "100 - 500 hours"],
                                                    ]}
                                                />
                                                <SelectField
                                                    label="Languages"
                                                    name="languages"
                                                    options={[
                                                        ["Bilingual (Arabic & English)", "Arabic & English"],
                                                        ["Arabic Native / Dominant", "Arabic dominant"],
                                                        ["English Native / Dominant", "English dominant"],
                                                        ["Multilingual", "Multilingual"],
                                                    ]}
                                                />
                                            </div>
                                        ) : (
                                            <SelectField
                                                label="Years of Relevant Experience"
                                                name="experienceYears"
                                                options={[
                                                    ["10+ years", "10+ years"],
                                                    ["5 - 10 years", "5 - 10 years"],
                                                    ["3 - 5 years", "3 - 5 years"],
                                                    ["1 - 3 years", "1 - 3 years"],
                                                ]}
                                            />
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className={labelCls}>LinkedIn Profile</label>
                                                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" className={inputCls} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>{isFaculty ? "Website / Profile (Optional)" : "Portfolio or CV Link (Optional)"}</label>
                                                <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://yourwork.com or drive link" className={inputCls} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelCls}>Why Mashar? Share Your Story</label>
                                            <textarea
                                                rows={4}
                                                name="motivation"
                                                value={formData.motivation}
                                                onChange={handleChange}
                                                placeholder="Tell us about your signature approach and what draws you to Mashar's mission of purposeful, culturally grounded leadership..."
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <Lock size={13} /> Your application is treated with strict confidentiality.
                                    </p>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        {step === 2 && (
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
                                            >
                                                <ArrowLeft size={16} /> Back
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-[#F39300] hover:bg-[#D97706] text-white font-bold text-sm transition-all shadow-lg shadow-[#F39300]/25 disabled:opacity-50"
                                        >
                                            {step === 1 ? "Continue" : submitting ? "Submitting..." : "Send Application"}
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* ── CROSS-LINK BANNER ── */}
            <section className="py-12 bg-[#0F1C80] text-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#F39300]">Looking for Enterprise Partnership?</p>
                        <h3 className="text-xl sm:text-2xl font-bold font-spartan mt-1">Represent an Organization, Academy or University?</h3>
                        <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl">
                            License our ICF-accredited curricula or deploy diagnostic assessments for your enterprise clients.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a href="/become-partner" className="px-6 py-3 rounded-full bg-white text-[#0F1C80] font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all shadow-md">
                            Become a Partner →
                        </a>
                        <a href="/become-a-mentor" className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all">
                            Become a Mentor →
                        </a>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-20 bg-gradient-to-b from-white to-[#F8FAFF]">
                <div className="max-w-4xl mx-auto px-6 sm:px-10">
                    <div className="text-center mb-12">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F39300] mb-2">Common Questions</p>
                        <h2 className="text-2xl sm:text-3xl font-bold font-spartan text-[#0D1240]">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, idx) => {
                            const open = faqOpen === idx;
                            return (
                                <div key={faq.q} className={`border rounded-2xl bg-white overflow-hidden transition-all ${open ? "border-[#F39300]/40 shadow-md" : "border-gray-200/80"}`}>
                                    <button
                                        type="button"
                                        aria-expanded={open}
                                        onClick={() => setFaqOpen(open ? -1 : idx)}
                                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#0D1240] text-sm sm:text-base hover:text-[#0F1C80] transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown size={18} className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180 text-[#F39300]" : "text-gray-400"}`} />
                                    </button>
                                    {open && (
                                        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}