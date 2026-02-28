import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { resolveAssetUrl } from "../../utils/baseUrl";
import {
    Users, UserCheck, UserPlus, TrendingUp,
    ArrowUpRight, ArrowDownRight, Activity,
    Clock, ChevronRight, BookOpen, MapPin,
    Mail, BarChart3, Zap, RefreshCw,
    CalendarDays, FileText, ShoppingBag,
    Plus, Play, Video
} from "lucide-react";

// ── Helpers ──
const AVATAR_COLORS = ["bg-indigo-500","bg-emerald-500","bg-violet-500","bg-sky-500","bg-rose-500","bg-amber-500","bg-teal-500"];
const getAvatarColor = (id) => AVATAR_COLORS[parseInt(id?.slice(-2) || "0", 16) % AVATAR_COLORS.length];
const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
const resolveImage = (img) => {
    return resolveAssetUrl(img);
};
const formatTimeAgo = (date) => {
    const s = Math.floor((new Date() - new Date(date)) / 1000);
    if (s < 60) return "Just now";
    const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("admin_token");

    const [alumni, setAlumni] = useState([]);
    const [alumniLoading, setAlumniLoading] = useState(true);
    const [stats, setStats] = useState({ totalAlumni: 0, approvedAlumni: 0, pendingAlumni: 0, rejectedAlumni: 0 });

    const [events, setEvents] = useState([]);
    const [books, setBooks] = useState([]);
    const [articles, setArticles] = useState([]);
    const [videos, setVideos] = useState([]);
    const [contentLoading, setContentLoading] = useState(true);

    // ── Fetch alumni ──
    useEffect(() => {
        if (!token) { setAlumniLoading(false); return; }
        axios.get("/api/admin/alumni/list", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const data = res?.data?.data ?? [];
                setAlumni(data);
                setStats({
                    totalAlumni: data.length,
                    approvedAlumni: data.filter(a => a.account_status?.toLowerCase() === "approved").length,
                    pendingAlumni:  data.filter(a => a.account_status?.toLowerCase() === "pending").length,
                    rejectedAlumni: data.filter(a => a.account_status?.toLowerCase() === "rejected").length,
                });
            })
            .catch(err => console.error("Alumni fetch error:", err))
            .finally(() => setAlumniLoading(false));
    }, [token]);

    // ── Fetch content ──
    useEffect(() => {
        if (!token) return;
        const h = { Authorization: `Bearer ${token}` };
        Promise.allSettled([
            axios.get("/api/admin/events",   { headers: h }),
            axios.get("/api/admin/books",    { headers: h }),
            axios.get("/api/admin/articles", { headers: h }),
            axios.get("/api/admin/videos",   { headers: h }),
        ]).then(([ev, bk, ar, vi]) => {
            if (ev.status === "fulfilled") setEvents(ev.value.data.events || []);
            if (bk.status === "fulfilled") setBooks(bk.value.data.books || []);
            if (ar.status === "fulfilled") {
                const d = ar.value.data;
                setArticles(d?.data?.data || d?.data || d?.articles || []);
            }
            if (vi.status === "fulfilled") setVideos(vi.value.data.data || vi.value.data.data || []);
        }).finally(() => setContentLoading(false));
    }, [token]);

    // ── Derived ──
    const approvalRate = stats.totalAlumni > 0 ? Math.round((stats.approvedAlumni / stats.totalAlumni) * 100) : 0;
    const recentAlumni = [...alumni].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const courseCounts = alumni.reduce((acc, a) => { if (a.course) acc[a.course] = (acc[a.course] || 0) + 1; return acc; }, {});
    const topCourses = Object.entries(courseCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxCourseCount = topCourses[0]?.[1] || 1;
    const now = new Date();
    const upcomingEvents = [...events].filter(e => new Date(e.eventDate) >= now).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)).slice(0, 3);
    const recentBooks    = [...books].sort((a, b)    => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
    const recentArticles = [...articles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
    const recentVideos   = [...videos].sort((a, b)   => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

    return (
        <div className="space-y-8 pb-12">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back. Here's what's happening with Mashar today.</p>
                </div>
                <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all self-start sm:self-auto">
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {/* ── Alumni Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users />}     label="Total Alumni"    value={alumniLoading ? "..." : stats.totalAlumni.toLocaleString()}    trend="+12%" trendUp color="indigo"  />
                <StatCard icon={<UserCheck />} label="Approved"        value={alumniLoading ? "..." : stats.approvedAlumni.toLocaleString()}  trend="+5.2%" trendUp color="emerald" />
                <StatCard icon={<UserPlus />}  label="Pending Review"  value={alumniLoading ? "..." : stats.pendingAlumni.toLocaleString()}                  color="amber"  />
                <StatCard icon={<Activity />}  label="Rejected"        value={alumniLoading ? "..." : stats.rejectedAlumni.toLocaleString()}                 color="rose"   />
            </div>

            {/* ── Content Counter Row ── */}
            <div>
                <SectionHeader title="Content Overview" subtitle="Live counts from all published content" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <ContentCountCard icon={<CalendarDays />} label="Events"   count={contentLoading ? null : events.length}   color="indigo" sub={`${upcomingEvents.length} upcoming`} onNew={() => navigate("/admin/upload-event")} onView={() => navigate("/admin/events")} />
                    <ContentCountCard icon={<BookOpen />}     label="Books"    count={contentLoading ? null : books.length}    color="amber"  sub={books.length > 0 ? `Latest: ${books.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0]?.heading?.slice(0,20)}…` : "No books yet"} onNew={() => navigate("/admin/upload-book")} onView={() => navigate("/admin/books")} />
                    <ContentCountCard icon={<FileText />}     label="Articles" count={contentLoading ? null : articles.length} color="emerald" sub={articles.length > 0 ? `Latest: ${articles.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0]?.heading?.slice(0,20)}…` : "No articles yet"} onNew={() => navigate("/admin/upload-article")} onView={() => navigate("/admin/articles")} />
                    <ContentCountCard icon={<Video />}        label="Videos"   count={contentLoading ? null : videos.length}   color="red"   sub={videos.length > 0 ? `Latest: ${videos.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0]?.heading?.slice(0,20)}…` : "No videos yet"} onNew={() => navigate("/admin/upload-video")} onView={() => navigate("/admin/videos")} />
                </div>
            </div>

            {/* ── Recent Content Grid ── */}
            <div>
                <SectionHeader title="Recent Content" subtitle="Latest additions across all sections" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    {/* Upcoming Events */}
                    <ContentPanel
                        icon={<CalendarDays size={14} className="text-indigo-500" />}
                        title="Upcoming Events"
                        accentColor="indigo"
                        onAdd={() => navigate("/admin/upload-event")}
                        onViewAll={() => navigate("/admin/events")}
                        loading={contentLoading}
                        empty={upcomingEvents.length === 0}
                        emptyLabel="No upcoming events"
                    >
                        {upcomingEvents.map(event => (
                            <div key={event._id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex flex-col items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-100">
                                    <span className="text-[8px] font-black text-indigo-200 uppercase leading-none">
                                        {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short" })}
                                    </span>
                                    <span className="text-xs font-black text-white leading-tight">
                                        {new Date(event.eventDate).getDate()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{event.eventName}</p>
                                    <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                        <MapPin size={8} /> {event.location}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[10px] font-black text-indigo-500">{event.registeredCount || 0}<span className="text-slate-300 font-normal">/{event.capacity}</span></p>
                                </div>
                            </div>
                        ))}
                    </ContentPanel>

                    {/* Recent Books */}
                    <ContentPanel
                        icon={<BookOpen size={14} className="text-amber-500" />}
                        title="Recent Books"
                        accentColor="amber"
                        onAdd={() => navigate("/admin/upload-book")}
                        onViewAll={() => navigate("/admin/books")}
                        loading={contentLoading}
                        empty={recentBooks.length === 0}
                        emptyLabel="No books published"
                    >
                        {recentBooks.map(book => (
                            <div key={book._id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                                <div className="w-8 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                                    {book.cover_image
                                        ? <img src={resolveImage(book.cover_image)} alt={book.heading} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full bg-amber-50 flex items-center justify-center"><BookOpen size={12} className="text-amber-300" /></div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{book.heading}</p>
                                    <p className="text-[10px] text-indigo-400 font-semibold truncate">{book.author}</p>
                                    <p className="text-[10px] text-slate-400">{formatTimeAgo(book.createdAt)}</p>
                                </div>
                                <a href={book.amazonLink} target="_blank" rel="noopener noreferrer"
                                   className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                    <ShoppingBag size={11} className="text-amber-600" />
                                </a>
                            </div>
                        ))}
                    </ContentPanel>

                    {/* Recent Articles */}
                    <ContentPanel
                        icon={<FileText size={14} className="text-emerald-500" />}
                        title="Recent Articles"
                        accentColor="emerald"
                        onAdd={() => navigate("/admin/upload-article")}
                        onViewAll={() => navigate("/admin/articles")}
                        loading={contentLoading}
                        empty={recentArticles.length === 0}
                        emptyLabel="No articles published"
                    >
                        {recentArticles.map(article => (
                            <div key={article._id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                                <div className="w-9 h-9 rounded-xl overflow-hidden bg-emerald-50 flex-shrink-0 flex items-center justify-center mt-0.5">
                                    {article.cover_image
                                        ? <img src={resolveImage(article.cover_image)} alt={article.heading} className="w-full h-full object-cover" />
                                        : <FileText size={14} className="text-emerald-300" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{article.heading}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                        <Clock size={8} /> {formatTimeAgo(article.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </ContentPanel>

                    {/* Recent Videos */}
                    <ContentPanel
                        icon={<Video size={14} className="text-red-500" />}
                        title="Recent Videos"
                        accentColor="red"
                        onAdd={() => navigate("/admin/upload-video")}
                        onViewAll={() => navigate("/admin/videos")}
                        loading={contentLoading}
                        empty={recentVideos.length === 0}
                        emptyLabel="No videos published"
                    >
                        {recentVideos.map(video => (
                            <div key={video._id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                                <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                        alt={video.heading}
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                                            <Play size={8} fill="currentColor" className="text-red-600 ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{video.heading}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{formatTimeAgo(video.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </ContentPanel>
                </div>
            </div>

            {/* ── Analytics Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Approval Rate */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Approval Rate</h3>
                        <span className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <BarChart3 size={15} className="text-indigo-500" />
                        </span>
                    </div>
                    <div className="flex items-center justify-center my-2">
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#4f46e5" strokeWidth="12"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 50}`}
                                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - approvalRate / 100)}`}
                                        className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-800">{alumniLoading ? "—" : `${approvalRate}%`}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">approved</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                            { label: "Approved", value: stats.approvedAlumni, color: "text-emerald-600", dot: "bg-emerald-500" },
                            { label: "Pending",  value: stats.pendingAlumni,  color: "text-amber-600",  dot: "bg-amber-500" },
                            { label: "Rejected", value: stats.rejectedAlumni, color: "text-rose-600",   dot: "bg-rose-500" },
                        ].map(({ label, value, color, dot }) => (
                            <div key={label} className="text-center p-2 bg-slate-50 rounded-xl">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                                </div>
                                <p className={`text-lg font-black ${color}`}>{alumniLoading ? "—" : value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Quick Actions</h3>
                        <span className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Zap size={15} className="text-indigo-500" />
                        </span>
                    </div>
                    <div className="space-y-1.5">
                        {[
                            { label: "Review Pending Alumni", sub: `${stats.pendingAlumni} awaiting`, icon: <Clock size={14} />,        color: "bg-amber-50 text-amber-600",   path: "/admin/alumni-approval" },
                            { label: "Create New Event",      sub: `${events.length} published`,       icon: <CalendarDays size={14} />, color: "bg-indigo-50 text-indigo-600", path: "/admin/upload-event" },
                            { label: "Upload a Book",         sub: `${books.length} in library`,        icon: <BookOpen size={14} />,     color: "bg-amber-50 text-amber-700",   path: "/admin/upload-book" },
                            { label: "Write an Article",      sub: `${articles.length} published`,      icon: <FileText size={14} />,     color: "bg-emerald-50 text-emerald-600", path: "/admin/upload-article" },
                            { label: "Upload a Video",        sub: `${videos.length} published`,        icon: <Video size={14} />,        color: "bg-red-50 text-red-600",       path: "/admin/upload-video" },
                        ].map(({ label, sub, icon, color, path }) => (
                            <button key={label} onClick={() => navigate(path)}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group text-left"
                            >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-700 truncate">{label}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
                                </div>
                                <ChevronRight size={13} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Top Courses</h3>
                        <span className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <BookOpen size={15} className="text-indigo-500" />
                        </span>
                    </div>
                    {alumniLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3, 4].map(i => <div key={i} className="space-y-1.5"><div className="h-3 bg-slate-100 rounded w-1/2" /><div className="h-2 bg-slate-100 rounded w-full" /></div>)}
                        </div>
                    ) : topCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-300">
                            <BookOpen size={28} className="mb-2 opacity-40" />
                            <p className="text-xs font-bold">No course data yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topCourses.map(([course, count], i) => {
                                const colors = ["bg-indigo-500","bg-emerald-500","bg-violet-500","bg-sky-500","bg-amber-500"];
                                return (
                                    <div key={course}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-slate-700">{course}</span>
                                            <span className="text-[11px] font-black text-slate-500">{count} <span className="font-medium text-slate-300">member{count !== 1 ? "s" : ""}</span></span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-700`} style={{ width: `${Math.round((count / maxCourseCount) * 100)}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Recent Registrations + Network Stats ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Registrations */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-800">Recent Registrations</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Latest members who joined the network</p>
                        </div>
                        <button onClick={() => navigate("/admin/alumni-list")} className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="divide-y divide-slate-50 flex-1">
                        {alumniLoading ? (
                            <div className="p-6 space-y-4 animate-pulse">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-2xl shrink-0" />
                                        <div className="flex-1 space-y-2"><div className="h-3 bg-slate-100 rounded w-32" /><div className="h-2.5 bg-slate-100 rounded w-48" /></div>
                                        <div className="h-6 w-16 bg-slate-100 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        ) : recentAlumni.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                <Users size={36} className="opacity-10 mb-3" />
                                <p className="text-sm font-bold">No registrations yet</p>
                            </div>
                        ) : recentAlumni.map(a => {
                            const statusCls = {
                                approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                pending:  "bg-amber-50 text-amber-700 border-amber-200",
                                rejected: "bg-rose-50 text-rose-700 border-rose-200",
                            }[a.account_status] || "bg-slate-100 text-slate-500 border-slate-200";
                            return (
                                <div key={a._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors group">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 ${getAvatarColor(a._id)}`}>
                                        {getInitials(a.full_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{a.full_name}</p>
                                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                            <Mail size={9} /> {a.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[11px] font-bold text-slate-600">{a.course || "—"}</p>
                                            <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end"><MapPin size={8} /> {a.country || "—"}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${statusCls}`}>
                                            {a.account_status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {!alumniLoading && recentAlumni.length > 0 && (
                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/40">
                            <p className="text-xs text-slate-400">Showing <span className="font-bold text-slate-600">{recentAlumni.length}</span> most recent registrations</p>
                        </div>
                    )}
                </div>

                {/* Network Stats dark card */}
                <div className="bg-[#0F172A] text-white rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 mb-5">
                            <TrendingUp size={26} className="text-indigo-400" />
                        </div>
                        <h4 className="font-bold text-xl mb-1">Network Growth</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Your network expanded by 24% compared to last month.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 my-6 relative z-10">
                        {[
                            { label: "Alumni",   value: alumniLoading   ? "—" : stats.totalAlumni,     color: "text-white" },
                            { label: "Active",   value: alumniLoading   ? "—" : stats.approvedAlumni,  color: "text-emerald-400" },
                            { label: "Events",   value: contentLoading  ? "—" : events.length,         color: "text-indigo-400" },
                            { label: "Books",    value: contentLoading  ? "—" : books.length,          color: "text-amber-400" },
                            { label: "Articles", value: contentLoading  ? "—" : articles.length,       color: "text-emerald-300" },
                            { label: "Videos",   value: contentLoading  ? "—" : videos.length,         color: "text-red-400" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                                <p className={`text-xl font-black ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => window.location.reload()} className="w-full py-3 bg-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative z-10">
                        <RefreshCw size={13} /> Sync Data
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Reusable Components ──

function SectionHeader({ title, subtitle }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-800">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
        </div>
    );
}

function StatCard({ icon, label, value, trend, trendUp, color }) {
    const colors = {
        indigo:  "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber:   "bg-amber-50 text-amber-600",
        rose:    "bg-rose-50 text-rose-600",
    };
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
                    {React.cloneElement(icon, { size: 20 })}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-lg ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
            <h2 className="text-2xl font-black text-slate-800">{value}</h2>
        </div>
    );
}

function ContentCountCard({ icon, label, count, color, sub, onNew, onView }) {
    const colors = {
        indigo:  { bg: "bg-indigo-50",  icon: "text-indigo-600",  btn: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700" },
        amber:   { bg: "bg-amber-50",   icon: "text-amber-600",   btn: "bg-amber-50 hover:bg-amber-100 text-amber-700" },
        emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", btn: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" },
        red:     { bg: "bg-red-50",     icon: "text-red-600",     btn: "bg-red-50 hover:bg-red-100 text-red-700" },
    }[color];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    {React.cloneElement(icon, { size: 20, className: colors.icon })}
                </div>
                <button onClick={onNew} className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-colors ${colors.btn}`}>
                    <Plus size={10} /> New
                </button>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-3xl font-black text-slate-900">{count ?? "—"}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium truncate flex-1 pr-2">{sub}</p>
                <button onClick={onView} className="text-[10px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-0.5 flex-shrink-0 transition-colors">
                    All <ChevronRight size={10} />
                </button>
            </div>
        </div>
    );
}

function ContentPanel({ icon, title, accentColor, onAdd, onViewAll, loading, empty, emptyLabel, children }) {
    const addColors = {
        indigo:  "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
        amber:   "text-amber-700 bg-amber-50 hover:bg-amber-100",
        emerald: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
        red:     "text-red-700 bg-red-50 hover:bg-red-100",
    }[accentColor];

    const viewColors = {
        indigo:  "text-indigo-500 hover:text-indigo-700",
        amber:   "text-amber-500 hover:text-amber-700",
        emerald: "text-emerald-500 hover:text-emerald-700",
        red:     "text-red-500 hover:text-red-700",
    }[accentColor];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{title}</p>
                </div>
                <button onClick={onViewAll} className={`text-[10px] font-bold flex items-center gap-0.5 transition-colors ${viewColors}`}>
                    All <ChevronRight size={10} />
                </button>
            </div>
            <div className="flex-1 divide-y divide-slate-50 min-h-[160px]">
                {loading ? (
                    <div className="p-4 space-y-3 animate-pulse">
                        {[1,2,3].map(i => <div key={i} className="flex gap-3"><div className="w-9 h-9 bg-slate-100 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-2.5 bg-slate-100 rounded w-3/4" /><div className="h-2 bg-slate-100 rounded w-1/2" /></div></div>)}
                    </div>
                ) : empty ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 gap-2">
                        <p className="text-xs font-bold text-slate-400">{emptyLabel}</p>
                        <button onClick={onAdd} className={`mt-1 text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${addColors}`}>
                            <Plus size={9} /> Add one
                        </button>
                    </div>
                ) : children}
            </div>
            {!loading && !empty && (
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/30">
                    <button onClick={onAdd} className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-colors ${addColors}`}>
                        <Plus size={11} /> Add New
                    </button>
                </div>
            )}
        </div>
    );
}