import { useState, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { ChevronDown, ChevronRight } from "lucide-react";
import logoMashar from "../assets/masharBlackFinal.svg";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

/* ─── Dropdown config ─────────────────────────────────────────────── */
const NAV_ITEMS = [
    {
        label: "Why Mashar",
        to: "/whyMashar",
        columns: [
            {
                heading: "Our Story",
                links: [
                    { label: "Roots Run Deep", sub: "Our origin & philosophy", to: "/whyMashar#roots", icon: "🌿" },
                    { label: "Our Founder", sub: "Meet Raja Al Gurg", to: "/whyMashar#team", icon: "👤" },
                    { label: "Our Team", sub: "The minds behind Mashar", to: "/whyMashar#team", icon: "🤝" },
                ],
            },
            {
                heading: "Credentials",
                links: [
                    { label: "ICF Accreditation", sub: "Globally certified coaching", to: "/whyMashar#mission", icon: "🏅" },
                    { label: "EMCC Mentoring", sub: "European accreditation", to: "/whyMashar#mission", icon: "🎖️" },
                    { label: "Global Tools", sub: "Persona, BBL & more", to: "/whyMashar#mission", icon: "🔬" },
                    { label: "Program Calendar", sub: "2026–2027 Schedule", to: "/calendar", icon: "🗓️" },
                ],
            },
        ],
        featured: {
            title: "Built for Transformation",
            desc: "Where human insight meets modern leadership excellence.",
            to: "/whyMashar",
            cta: "Our Story",
            quickAction: { label: "🗓️ View Calendar", to: "/calendar" }
        },
    },
    {
        label: "Our Signature",
        to: "/ourSignature",
        columns: [
            {
                heading: "Methodology",
                links: [
                    { label: "The Mashar Method", sub: "Our unique approach", to: "/ourSignature#method", icon: "⚡" },
                    { label: "How We Work", sub: "Step-by-step process", to: "/ourSignature#how", icon: "🔄" },
                    { label: "5-Step Growth Plan", sub: "Your transformation path", to: "/ourSignature#approach", icon: "📈" },
                ],
            },
            {
                heading: "Philosophy",
                links: [
                    { label: "Learning Philosophy", sub: "Inner life of leaders", to: "/ourSignature#philosophy", icon: "💡" },
                    { label: "Tools that Unlock Insight", sub: "Psychometric tools", to: "/ourSignature#tools", icon: "🔑" },
                    { label: "Signature Programs", sub: "Flagship experiences", to: "/ourSignature#programs", icon: "🎯" },
                    { label: "Become A Partner / Join Our Team", sub: "Partner or join our faculty", to: "/become-partner", icon: "🤝" },
                ],
            },
        ],
        featured: { title: "The Mashar Signature", desc: "Insight-driven, culturally intelligent, deeply human.", to: "/ourSignature", cta: "Explore Method" },
    },
    {
        label: "Explore Programs",
        to: "/explorePrograms",
        columns: [
            {
                heading: "Training Programs",
                links: [
                    { label: "Leader as a Coach", sub: "ICF accredited · 3-day", to: "/explorePrograms", tab: "training", icon: "🏆" },
                    { label: "Personal Leadership", sub: "20-hour blended journey", to: "/explorePrograms", tab: "training", icon: "🌟" },
                    { label: "Present, Speak, Influence", sub: "5-day mastery program", to: "/explorePrograms", tab: "training", icon: "🎤" },
                ],
            },
            {
                heading: "Specialised Programs",
                links: [
                    { label: "Psychological Safety", sub: "Neuroscience-based", to: "/explorePrograms", tab: "training", icon: "🧠" },
                    { label: "Coaching Programs", sub: "1-on-1 & group coaching", to: "/explorePrograms", tab: "coaching", icon: "❤️" },
                    { label: "Custom Solutions", sub: "Tailored for your organisation", to: "/explorePrograms", tab: "custom", icon: "⚙️" },
                ],
            },
        ],
        featured: { title: "Find Your Program", desc: "Research-backed workshops that deliver lasting change.", to: "/explorePrograms", cta: "View All Programs" },
    },
    {
        label: "Leadership Hub",
        to: "/leadership-hub",
        columns: [
            {
                heading: "Resources",
                links: [
                    { label: "Articles & Insights", sub: "Thought leadership", to: "/leadership-hub#articles", icon: "📖" },
                    { label: "Videos & Webinars", sub: "Expert conversations", to: "/leadership-hub#videos", icon: "🎥" },
                    { label: "Books", sub: "Curated reading list", to: "/leadership-hub#books", icon: "📚" },
                ],
            },
            {
                heading: "Community",
                links: [
                    { label: "Alumni Network", sub: "Join our community", to: "/alumni-login", icon: "🌐" },
                    { label: "Events & Seminars", sub: "Browse & register online", to: "/events", icon: "📅" },
                    { label: "Newsletter", sub: "Stay in the loop", to: "/lets-talk#contact", icon: "✉️" },
                ],
            },
        ],
        featured: { title: "Grow Your Leadership", desc: "Curated content for forward-thinking leaders.", to: "/leadership-hub", cta: "Explore Hub" },
    },
    {
        label: "Events",
        to: "/events",
        columns: [
            {
                heading: "Browse by Type",
                links: [
                    { label: "Alumni Talks", sub: "Insights from Mashar Alumni", to: "/events", icon: "🗣️" },
                    { label: "Networking", sub: "Connect with the community", to: "/events", icon: "🤝" },
                    { label: "Webinars", sub: "Online learning & seminars", to: "/events", icon: "🎙️" },
                ],
            },
            {
                heading: "More Formats",
                links: [
                    { label: "Workshops", sub: "Intensive deep-dive sessions", to: "/events", icon: "🛠️" },
                    { label: "Program Schedule", sub: "2026–2027 Calendar", to: "/calendar", icon: "🗓️" },
                ],
            },
        ],
        featured: { title: "Training Calendar", desc: "Browse 2026–2027 public training programs and schedules.", to: "/calendar", cta: "View Calendar" },
    },
    {
        label: "Let's Talk",
        to: "/lets-talk",
        columns: [
            {
                heading: "Get in Touch",
                links: [
                    { label: "Book a Discovery Call", sub: "15-min intro session", to: "/lets-talk#contact", icon: "📞" },
                    { label: "Request a Proposal", sub: "Custom workshops", to: "/lets-talk#contact", icon: "📋" },
                    { label: "General Enquiry", sub: "We'd love to hear from you", to: "/lets-talk#contact", icon: "💬" },
                ],
            },
            {
                heading: "Quick Answers",
                links: [
                    { label: "Common Questions", sub: "FAQ at a glance", to: "/lets-talk#faq", icon: "❓" },
                    { label: "Pricing & Packages", sub: "Transparent overview", to: "/lets-talk#contact", icon: "💰" },
                    { label: "Our Locations", sub: "Dubai · UAE · Region", to: "/lets-talk#map", icon: "📍" },
                ],
            },
        ],
        featured: { title: "Start the Conversation", desc: "Every transformation begins with a single conversation.", to: "/lets-talk", cta: "Contact Us" },
    },
];

/* ─────────────────────────────────────────────────────────────────── */
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);   // label string | null
    const [mobileExpanded, setMobileExpanded] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const leaveTimer = useRef(null);

    const handleEnter = (label) => {
        clearTimeout(leaveTimer.current);
        setActiveDropdown(label);
    };
    const handleLeave = () => {
        leaveTimer.current = setTimeout(() => setActiveDropdown(null), 150);
    };
    const keepOpen = () => clearTimeout(leaveTimer.current);

    const closeAll = () => {
        clearTimeout(leaveTimer.current);
        setActiveDropdown(null);
        setMenuOpen(false);
        setMobileExpanded(null);
    };

    // Shared scroll helper — accounts for sticky navbar height
    const scrollToSection = (id) => {
        let attempts = 0;
        const tryScroll = () => {
            const el = document.getElementById(id);
            if (el) {
                const navHeight = document.querySelector('nav, header[class*="sticky"], div[class*="sticky"]')?.offsetHeight || 80;
                const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 12;
                window.scrollTo({ top, behavior: 'smooth' });
            } else if (attempts < 12) {
                attempts++;
                setTimeout(tryScroll, 100);
            }
        };
        setTimeout(tryScroll, 80);
    };

    const go = (to, tab = null) => {
        closeAll();

        if (tab) {
            // Tab-based navigation (ExplorePrograms)
            const [path] = to.split('#');
            navigate(path, { state: { targetTab: tab } });
            return;
        }

        const hashIdx = to.indexOf('#');
        if (hashIdx !== -1) {
            const path = to.slice(0, hashIdx);
            const hash = to.slice(hashIdx + 1);

            if (location.pathname === path) {
                // Already on this page — scroll immediately with retry
                scrollToSection(hash);
            } else {
                // Different page — use object form so location.hash is set reliably
                navigate({ pathname: path, hash: `#${hash}` });
            }
        } else {
            navigate(to);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const isActive = (to) => location.pathname === to;

    return (
        <div className="w-full font-poppins bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">

            {/* ── Desktop bar ── */}
            <div className="w-full max-w-[1380px] mx-auto flex justify-between items-center px-6 md:px-10 lg:px-16">

                {/* Logo */}
                <NavLink to="/" onClick={closeAll} className="flex items-center flex-shrink-0 -ml-2 lg:-ml-3">
                    <img src={logoMashar} alt="Mashar Logo"
                        className="w-28 md:w-[140px] lg:w-[160px] h-auto object-contain -mt-2 md:-mt-4" />
                </NavLink>

                {/* ── Hamburger ── */}
                <button
                    className="text-[#0f1c80] text-2xl lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setMenuOpen(v => !v)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* ── Desktop Nav ── */}
                <nav className="hidden lg:flex items-center">
                    {/* Home */}
                    <NavLink
                        to="/"
                        onClick={closeAll}
                        className="relative px-3 py-6 text-[15px] font-medium transition-colors duration-200"
                        style={{ color: isActive("/") ? "#f39300" : "#1a1a2e" }}
                    >
                        Home
                        {/* underline */}
                        <span className="absolute bottom-4 left-3 right-3 h-[2.5px] rounded-full bg-[#f39300] block origin-left"
                            style={{ transform: isActive("/") ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.25s ease" }} />
                    </NavLink>

                    {/* Items with dropdowns */}
                    {NAV_ITEMS.map((item) => {
                        const open = activeDropdown === item.label;
                        const active = isActive(item.to);

                        return (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => handleEnter(item.label)}
                                onMouseLeave={handleLeave}
                            >
                                {/* Trigger button */}
                                <button
                                    onClick={() => go(item.to)}
                                    className="relative px-3 py-6 flex items-center gap-1 text-[15px] font-medium transition-colors duration-200 whitespace-nowrap"
                                    style={{ color: active || open ? "#f39300" : "#1a1a2e" }}
                                >
                                    {item.label}
                                    <ChevronDown
                                        size={14}
                                        className="flex-shrink-0"
                                        style={{
                                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.25s ease",
                                            color: open ? "#f39300" : "currentColor",
                                        }}
                                    />
                                    {/* underline */}
                                    <span className="absolute bottom-4 left-3 right-3 h-[2.5px] rounded-full bg-[#f39300] block origin-left"
                                        style={{ transform: (active || open) ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.25s ease" }} />
                                </button>

                                {/* ── Dropdown Panel (always mounted, CSS-animated) ── */}
                                <div
                                    onMouseEnter={keepOpen}
                                    onMouseLeave={handleLeave}
                                    style={{
                                        opacity: open ? 1 : 0,
                                        transform: open ? "translateY(0)" : "translateY(-10px)",
                                        pointerEvents: open ? "auto" : "none",
                                        transition: "opacity 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1)",
                                    }}
                                    className="absolute top-[calc(100%-1px)] left-1/2 w-[720px] bg-white shadow-[0_20px_60px_rgba(15,28,128,0.13)] rounded-2xl border border-gray-100 overflow-hidden z-50"
                                    // Center the panel under the button (capped so it doesn't go off screen)
                                    ref={(el) => {
                                        if (!el) return;
                                        // reset inline style set by previous run
                                        el.style.marginLeft = "";
                                        const rect = el.getBoundingClientRect();
                                        if (rect.right > window.innerWidth - 16) {
                                            el.style.marginLeft = `${window.innerWidth - 16 - rect.right}px`;
                                        }
                                        if (rect.left < 16) {
                                            el.style.marginLeft = `${16 - rect.left}px`;
                                        }
                                    }}
                                >
                                    {/* accent line */}
                                    <div className="h-[3px] bg-gradient-to-r from-[#f39300] via-[#ffb347] to-[#f39300]" />

                                    <div className="flex">
                                        {/* Columns */}
                                        <div className="flex-1 grid grid-cols-2 p-5 gap-0">
                                            {item.columns.map((col, ci) => (
                                                <div key={ci} className={ci === 0 ? "pr-5 border-r border-gray-100" : "pl-5"}>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f39300] mb-3 px-2">
                                                        {col.heading}
                                                    </p>
                                                    <ul className="space-y-0.5">
                                                        {col.links.map((link) => (
                                                            <li key={link.label}>
                                                                <button
                                                                    onClick={() => go(link.to, link.tab)}
                                                                    className="group w-full text-left flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-200 hover:bg-[#f5f7ff]"
                                                                >
                                                                    <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#e8ecff] flex items-center justify-center text-[15px] flex-shrink-0 transition-colors duration-200">
                                                                        {link.icon}
                                                                    </span>
                                                                    <span className="flex-1 min-w-0">
                                                                        <span className="block text-[13px] font-semibold text-gray-700 group-hover:text-[#0f1c80] transition-colors duration-200 leading-tight">
                                                                            {link.label}
                                                                        </span>
                                                                        <span className="block text-[11px] text-gray-400 leading-snug mt-[1px]">
                                                                            {link.sub}
                                                                        </span>
                                                                    </span>
                                                                    <ChevronRight
                                                                        size={12}
                                                                        className="opacity-0 group-hover:opacity-100 text-[#f39300] flex-shrink-0 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                                                                    />
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Featured card */}
                                        <div className="w-[185px] flex-shrink-0 bg-gradient-to-br from-[#0f1c80] to-[#0a1260] text-white p-5 flex flex-col justify-between">
                                            <div>
                                                <div className="w-6 h-[3px] bg-[#f39300] rounded mb-3" />
                                                <p className="text-[13.5px] font-bold leading-snug mb-2">{item.featured.title}</p>
                                                <p className="text-[11px] text-white/60 leading-relaxed">{item.featured.desc}</p>
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <button
                                                    onClick={() => go(item.featured.to)}
                                                    className="group flex items-center gap-1.5 text-[12px] font-bold text-[#f39300] hover:text-white transition-colors duration-200"
                                                >
                                                    {item.featured.cta}
                                                    <ChevronRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                                                </button>
                                                {item.featured.quickAction && (
                                                    <button
                                                        onClick={() => go(item.featured.quickAction.to)}
                                                        className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-[#f39300] hover:bg-[#d97f00] text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                                                    >
                                                        <span>{item.featured.quickAction.label}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Alumni Login */}
                <div className="hidden lg:flex items-center">
                    <NavLink
                        to="/alumni-login"
                        onClick={closeAll}
                        className="group relative overflow-hidden px-5 py-2 rounded-full text-[14px] font-semibold border-2 border-[#f39300] text-[#f39300] transition-colors duration-300 hover:text-white"
                    >
                        <span className="absolute inset-0 bg-[#f39300] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                        <span className="relative z-10">Alumni Login</span>
                    </NavLink>
                </div>
            </div>

            {/* ── Mobile menu ── */}
            <div
                className="lg:hidden overflow-hidden bg-white shadow-xl"
                style={{
                    maxHeight: menuOpen ? "85vh" : "0",
                    opacity: menuOpen ? 1 : 0,
                    transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
                    overflowY: "auto",
                }}
            >
                <div className="px-5 pb-5 pt-2 flex flex-col">
                    <NavLink to="/" onClick={closeAll}
                        className="py-3.5 border-b border-gray-100 text-[15px] font-medium text-[#1a1a2e] hover:text-[#f39300] transition-colors">
                        Home
                    </NavLink>

                    {NAV_ITEMS.map((item) => (
                        <div key={item.label} className="border-b border-gray-100">
                            <button
                                className="w-full flex justify-between items-center py-3.5 text-[15px] font-medium transition-colors duration-200"
                                style={{ color: mobileExpanded === item.label ? "#f39300" : "#1a1a2e" }}
                                onClick={() => setMobileExpanded(prev => prev === item.label ? null : item.label)}
                            >
                                {item.label}
                                <ChevronDown size={16}
                                    style={{
                                        transform: mobileExpanded === item.label ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.25s ease",
                                        color: mobileExpanded === item.label ? "#f39300" : "#999",
                                    }}
                                />
                            </button>
                            <div
                                style={{
                                    maxHeight: mobileExpanded === item.label ? "500px" : "0",
                                    opacity: mobileExpanded === item.label ? 1 : 0,
                                    transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
                                    overflow: "hidden",
                                }}
                            >
                                <div className="pb-3 grid grid-cols-2 gap-1">
                                    {item.columns.flatMap(c => c.links).map((link) => (
                                        <button
                                            key={link.label}
                                            onClick={() => go(link.to, link.tab)}
                                            className="text-left flex items-center gap-2 p-2 text-[12.5px] text-gray-600 hover:text-[#0f1c80] rounded-xl hover:bg-[#f5f7ff] transition-all duration-150"
                                        >
                                            <span className="text-base">{link.icon}</span>
                                            <span className="leading-tight">{link.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mt-5">
                        <NavLink to="/alumni-login" onClick={closeAll}
                            className="block text-center py-3 border-2 border-[#f39300] text-[#f39300] rounded-full text-[14px] font-semibold hover:bg-[#f39300] hover:text-white transition-all duration-300">
                            Alumni Login
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;