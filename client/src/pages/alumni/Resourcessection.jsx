import { useState } from "react";

// ─── FAKE DATA ────────────────────────────────────────────────────────────────

const readingRoomData = {
    featured: {
        title: "The Coaching Habit",
        author: "Michael Bungay Stanier",
        tag: "Recommended by Mashar",
        description:
            "Say less, ask more & change the way you lead forever. A practical guide to making coaching a daily leadership habit — concise, powerful, and immediately applicable.",
        cover: "📘",
        badge: "Staff Pick",
        readTime: "4 hrs",
        category: "Leadership",
    },
    categories: [
        {
            name: "Coaching Foundations",
            color: "#6366f1",
            items: [
                { title: "Co-Active Coaching", author: "Kimsey-House et al.", type: "Book", level: "Core", pages: 312 },
                { title: "Coaching for Performance", author: "John Whitmore", type: "Book", level: "Core", pages: 248 },
                { title: "The Inner Game of Work", author: "W. Timothy Gallwey", type: "Book", level: "Intermediate", pages: 208 },
            ],
        },
        {
            name: "ICF & Ethics",
            color: "#0ea5e9",
            items: [
                { title: "ICF Core Competencies Guide", author: "ICF Official", type: "Guide", level: "Essential", pages: 45 },
                { title: "Ethics in Professional Coaching", author: "Mashar Faculty", type: "Article", level: "Core", pages: 18 },
                { title: "EMCC Global Code of Ethics", author: "EMCC", type: "Guide", level: "Essential", pages: 32 },
            ],
        },
        {
            name: "Tools & Assessments",
            color: "#10b981",
            items: [
                { title: "GROW Model Deep Dive", author: "Mashar Team", type: "Toolkit", level: "Practical", pages: 24 },
                { title: "Strengths-Based Coaching", author: "Ryan & Deci", type: "Article", level: "Intermediate", pages: 56 },
                { title: "Clean Language Sourcebook", author: "Wendy Sullivan", type: "Book", level: "Advanced", pages: 272 },
            ],
        },
        {
            name: "Leadership & Mindset",
            color: "#f59e0b",
            items: [
                { title: "Dare to Lead", author: "Brené Brown", type: "Book", level: "Recommended", pages: 320 },
                { title: "Mindset: The New Psychology", author: "Carol Dweck", type: "Book", level: "Core", pages: 288 },
                { title: "Boundaries for Leaders", author: "Henry Cloud", type: "Book", level: "Intermediate", pages: 256 },
            ],
        },
    ],
};

const libraryData = [
    { id: 1, title: "CPCP Program Handbook 2025", type: "PDF", size: "3.4 MB", date: "Jan 2025", tag: "Program", icon: "📄", color: "#6366f1" },
    { id: 2, title: "ICF ACC Application Template", type: "Template", size: "1.1 MB", date: "Dec 2024", tag: "Credentials", icon: "📋", color: "#0ea5e9" },
    { id: 3, title: "Supervision Session Recording – Nov", type: "Recording", size: "187 MB", date: "Nov 2024", tag: "Recording", icon: "🎙️", color: "#ec4899" },
    { id: 4, title: "Coaching Agreement Template", type: "Template", size: "0.8 MB", date: "Oct 2024", tag: "Tools", icon: "📋", color: "#10b981" },
    { id: 5, title: "GROW Model Worksheet", type: "PDF", size: "0.5 MB", date: "Oct 2024", tag: "Tools", icon: "📄", color: "#6366f1" },
    { id: 6, title: "Alumni Mentoring Guidelines", type: "PDF", size: "1.2 MB", date: "Sep 2024", tag: "Program", icon: "📄", color: "#f59e0b" },
    { id: 7, title: "Coach Essentials – Module 3 Recording", type: "Recording", size: "210 MB", date: "Sep 2024", tag: "Recording", icon: "🎙️", color: "#ec4899" },
    { id: 8, title: "Peer Coaching Circle Framework", type: "Template", size: "0.9 MB", date: "Aug 2024", tag: "Tools", icon: "📋", color: "#0ea5e9" },
    { id: 9, title: "ICF Core Competencies Breakdown", type: "PDF", size: "2.1 MB", date: "Aug 2024", tag: "Credentials", icon: "📄", color: "#6366f1" },
];

const mediaData = {
    videos: [
        { id: 1, title: "Mastering the GROW Model in Real Sessions", host: "Mashar Faculty", duration: "42:18", views: "1.2k", thumb: "🎥", date: "Feb 2025", tag: "Coaching" },
        { id: 2, title: "ICF ACC: Your Path to Credentialing", host: "Dr. Sara Al-Rashid", duration: "35:04", views: "983", thumb: "🎥", date: "Jan 2025", tag: "Credentials" },
        { id: 3, title: "Supervision Deep Dive – Group Session", host: "Mashar Team", duration: "58:22", views: "761", thumb: "🎥", date: "Dec 2024", tag: "Supervision" },
    ],
    podcasts: [
        { id: 1, title: "The Art of Powerful Questions", host: "Coach to Coach Series", duration: "28:45", ep: "Ep. 12", thumb: "🎙️", date: "Feb 2025" },
        { id: 2, title: "Building a Thriving Coaching Practice", host: "Alumni Spotlight", duration: "34:10", ep: "Ep. 11", thumb: "🎙️", date: "Jan 2025" },
        { id: 3, title: "Ethics in the Coaching Room", host: "Mashar Faculty", duration: "22:33", ep: "Ep. 10", thumb: "🎙️", date: "Dec 2024" },
        { id: 4, title: "Mindset Shifts That Transform Clients", host: "Coach to Coach Series", duration: "31:20", ep: "Ep. 9", thumb: "🎙️", date: "Nov 2024" },
    ],
    blogs: [
        { id: 1, title: "Why Supervision is Non-Negotiable for Coaches", author: "Dr. Sara Al-Rashid", readTime: "5 min", date: "Feb 2025", tag: "Supervision" },
        { id: 2, title: "From Graduate to ICF Credentialed Coach: My Journey", author: "Lena Hofmann", readTime: "7 min", date: "Jan 2025", tag: "Alumni Story" },
        { id: 3, title: "The 7 Questions That Changed My Coaching Practice", author: "Mashar Faculty", readTime: "4 min", date: "Jan 2025", tag: "Tools" },
        { id: 4, title: "Understanding EMCC vs ICF: Which Path is Right for You?", author: "Ahmed Al-Farsi", readTime: "6 min", date: "Dec 2024", tag: "Credentials" },
    ],
};

const TABS = [
    { id: "reading-room", label: "Reading Room", icon: "📖", sub: "Recommended Reading & Coaching Tools" },
    { id: "library", label: "Knowledge Library", icon: "🗂️", sub: "PDFs, Templates & Recordings" },
    { id: "media", label: "Mastermind Media", icon: "🎬", sub: "Video, Podcast & Blog" },
];

function Badge({ label, color = "#6366f1" }) {
    return (
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: color + "18", color }}>
            {label}
        </span>
    );
}

function ReadingRoom() {
    const [search, setSearch] = useState("");
    const { featured, categories } = readingRoomData;
    const filtered = search.trim()
        ? categories.map(c => ({ ...c, items: c.items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.author.toLowerCase().includes(search.toLowerCase())) })).filter(c => c.items.length > 0)
        : categories;

    return (
        <div className="space-y-8">
            {/* Featured */}
            <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6"
                style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)" }}>
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #818cf8 0%, transparent 60%)" }} />
                <div className="w-20 h-28 md:w-24 md:h-32 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl md:text-5xl flex-shrink-0 shadow-xl">
                    {featured.cover}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">⭐ {featured.badge}</span>
                        <span className="text-xs text-indigo-300">{featured.tag}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {featured.title}
                    </h2>
                    <p className="text-indigo-200 text-sm mb-3">by {featured.author} · {featured.readTime} read · {featured.category}</p>
                    <p className="text-indigo-100/80 text-sm leading-relaxed">{featured.description}</p>
                </div>
                <button className="flex-shrink-0 px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl text-sm hover:bg-indigo-50 transition shadow">
                    View Resource →
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search books, guides, tools..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" />
            </div>

            {/* Categories */}
            {filtered.map(cat => (
                <div key={cat.name}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                        <h3 className="font-semibold text-slate-700 text-xs tracking-widest uppercase">{cat.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {cat.items.map(item => (
                            <div key={item.title} className="group bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <Badge label={item.level} color={cat.color} />
                                    <span className="text-xs text-slate-400">{item.type} · {item.pages}p</span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-1 group-hover:text-indigo-700 transition">{item.title}</h4>
                                <p className="text-xs text-slate-400">{item.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function KnowledgeLibrary() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const tags = ["All", "PDF", "Template", "Recording", "Program", "Tools", "Credentials"];
    const filtered = libraryData.filter(item => {
        const matchTag = filter === "All" || item.type === filter || item.tag === filter;
        const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
        return matchTag && matchSearch;
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Files", value: "24", icon: "📁", color: "#6366f1" },
                    { label: "New This Month", value: "3", icon: "✨", color: "#10b981" },
                    { label: "Total Storage", value: "1.2 GB", icon: "💾", color: "#f59e0b" },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: s.color + "15" }}>{s.icon}</div>
                        <div>
                            <p className="text-xl font-bold text-slate-800">{s.value}</p>
                            <p className="text-xs text-slate-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {tags.map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition ${filter === t ? "bg-indigo-600 text-white shadow" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 px-5 py-3 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="col-span-6">File</span>
                    <span className="col-span-2 text-center">Type</span>
                    <span className="col-span-2 text-center">Size</span>
                    <span className="col-span-2 text-right">Action</span>
                </div>
                {filtered.length === 0
                    ? <div className="py-16 text-center text-slate-400">No files match your search.</div>
                    : filtered.map(file => (
                        <div key={file.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                            <div className="col-span-6 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: file.color + "15" }}>{file.icon}</div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 leading-snug">{file.title}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5">{file.date} · <Badge label={file.tag} color={file.color} /></p>
                                </div>
                            </div>
                            <div className="col-span-2 text-center">
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{file.type}</span>
                            </div>
                            <div className="col-span-2 text-center text-sm text-slate-400">{file.size}</div>
                            <div className="col-span-2 flex justify-end">
                                <button className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-lg transition">↓ Download</button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

function MastermindMedia() {
    const [section, setSection] = useState("video");
    const sections = [
        { id: "video", label: "🎥 Videos", count: mediaData.videos.length },
        { id: "podcast", label: "🎙️ Podcasts", count: mediaData.podcasts.length },
        { id: "blog", label: "✍️ Articles", count: mediaData.blogs.length },
    ];

    return (
        <div className="space-y-6">
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
                {sections.map(s => (
                    <button key={s.id} onClick={() => setSection(s.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${section === s.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        {s.label}
                        <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">{s.count}</span>
                    </button>
                ))}
            </div>

            {section === "video" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {mediaData.videos.map(v => (
                        <div key={v.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer">
                            <div className="h-36 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #1e1b4b, #4338ca)" }}>
                                <span className="text-5xl">{v.thumb}</span>
                                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg font-mono">{v.duration}</div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-xl">▶</div>
                                </div>
                            </div>
                            <div className="p-4">
                                <Badge label={v.tag} color="#6366f1" />
                                <h4 className="font-semibold text-slate-800 text-sm mt-2 mb-1 leading-snug group-hover:text-indigo-700 transition">{v.title}</h4>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>{v.host}</span>
                                    <span>👁 {v.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {section === "podcast" && (
                <div className="space-y-3">
                    {mediaData.podcasts.map(p => (
                        <div key={p.id} className="group flex items-center gap-4 bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition cursor-pointer">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>{p.thumb}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">{p.ep}</span>
                                    <span className="text-xs text-slate-400">{p.date}</span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition leading-snug">{p.title}</h4>
                                <p className="text-xs text-slate-400">{p.host}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-xs text-slate-400 font-mono">{p.duration}</span>
                                <button className="w-9 h-9 bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-full flex items-center justify-center transition text-sm font-bold">▶</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {section === "blog" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaData.blogs.map(b => (
                        <div key={b.id} className="group bg-white border border-slate-100 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <Badge label={b.tag} color="#6366f1" />
                                <span className="text-xs text-slate-400">{b.date}</span>
                            </div>
                            <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-3 group-hover:text-indigo-700 transition">{b.title}</h4>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                        {b.author.charAt(0)}
                                    </div>
                                    <span className="text-xs text-slate-500">{b.author}</span>
                                </div>
                                <span className="text-xs text-slate-400">📖 {b.readTime}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
    const [activeTab, setActiveTab] = useState("reading-room");

    return (
        <div className="min-h-screen bg-slate-50">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        * { font-family: 'DM Sans', system-ui, sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fu { animation: fadeUp 0.35s ease both; }
        .fu1 { animation-delay:.05s } .fu2 { animation-delay:.1s } .fu3 { animation-delay:.18s }
      `}</style>

            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 md:px-10 pt-8 pb-0">
                <p className="fu text-xs font-bold text-indigo-500 tracking-widest uppercase mb-1">Mashar Alumni Network</p>
                <h1 className="fu fu1 text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    📂 Resources
                </h1>
                <p className="fu fu2 text-slate-400 text-sm mb-6">Your curated knowledge hub — books, files, videos, podcasts & more.</p>

                {/* Tabs */}
                <div className="fu fu3 flex overflow-x-auto gap-1 -mb-px">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                                }`}>
                            <span className="text-base">{tab.icon}</span>
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <span className="text-xs text-slate-400 hidden md:block">— {tab.sub}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 md:px-10 py-8 mx-auto">
                {activeTab === "reading-room" && <ReadingRoom />}
                {activeTab === "library" && <KnowledgeLibrary />}
                {activeTab === "media" && <MastermindMedia />}
            </div>
        </div>
    );
}