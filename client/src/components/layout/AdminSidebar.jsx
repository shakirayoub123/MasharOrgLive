import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    BarChart2,
    Users,
    CheckCircle,
    Video,
    BookOpen,
    CalendarDays,
    FileText,
    MessageSquare,
    Newspaper,
    Plus,
    List,
    ChevronDown,
    ShieldCheck,
    Award,
    GraduationCap,
    Upload,
    Heart,
    Mail,
} from "lucide-react";

export default function AdminSidebar({ collapsed, mobileOpen, closeMobile }) {
    const location = useLocation();

    const isArticlesActive =
        location.pathname.startsWith("/admin/articles") ||
        location.pathname.startsWith("/admin/upload-article");

    const isVideosActive =
        location.pathname.startsWith("/admin/videos") ||
        location.pathname.startsWith("/admin/upload-video");

    const isBooksActive =
        location.pathname.startsWith("/admin/books") ||
        location.pathname.startsWith("/admin/upload-book");

    const isEventsActive =
        location.pathname.startsWith("/admin/events") ||
        location.pathname.startsWith("/admin/upload-event");

    const isProgramsActive = location.pathname.startsWith("/admin/programs");

    // ── Engagement active state ───────────────────────────────────────────────
    const isEngageActive = location.pathname.startsWith("/admin/engage");

    const [articlesOpen, setArticlesOpen] = useState(isArticlesActive);
    const [videosOpen, setVideosOpen] = useState(isVideosActive);
    const [booksOpen, setBooksOpen] = useState(isBooksActive);
    const [eventsOpen, setEventsOpen] = useState(isEventsActive);
    const [programsOpen, setProgramsOpen] = useState(isProgramsActive);
    const [engageOpen, setEngageOpen] = useState(isEngageActive);   // ← new

    return (
        <>
            {mobileOpen && (
                <div
                    onClick={closeMobile}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            <aside
                className={`
                    fixed lg:static z-50 top-0 left-0 h-full
                    bg-[#0F172A] text-slate-100 flex flex-col
                    border-r border-slate-800
                    transition-all duration-300 ease-in-out
                    ${collapsed ? "w-20" : "w-64"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo */}
                <div className="px-6 py-8 flex items-center gap-3 border-b border-slate-800/50">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/20">
                        <span className="font-bold text-white text-lg">M</span>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <h1 className="font-spartan font-bold text-xl tracking-tight text-white">
                                Mashar<span className="text-indigo-500">Admin</span>
                            </h1>
                            <p className="text-[10px] tracking-[2px] text-slate-400 uppercase font-medium">
                                Control Panel
                            </p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">

                    <Section label="Management" collapsed={collapsed} />
                    <Item to="/admin" icon={<BarChart2 size={20} />} label="Dashboard" collapsed={collapsed} />
                    <Item to="/admin/alumni-approval" icon={<CheckCircle size={20} />} label="Approvals" collapsed={collapsed} />
                    <Item to="/admin/badge-requests" icon={<ShieldCheck size={20} />} label="Badge Requests" collapsed={collapsed} />
                    <Item to="/admin/badge-management" icon={<Award size={20} />} label="Badge Management" collapsed={collapsed} />

                    <Section label="Directory" collapsed={collapsed} />
                    <Item to="/admin/alumni-list" icon={<Users size={20} />} label="Alumni List" collapsed={collapsed} />

                    {/* not needed for now */}
                    {/* <Item to="/admin/messages" icon={<MessageSquare size={20} />} label="Messages" collapsed={collapsed} /> */}
                    <Item to="/admin/spotlight" icon={<FileText size={20} />} label="Spotlight" collapsed={collapsed} />
                    <Item to="/admin/subscribers" icon={<Mail size={20} />} label="Subscribers" collapsed={collapsed} />

                    <Section label="Resources" collapsed={collapsed} />

                    <Item to="/admin/discussion" icon={<FileText size={20} />} label="Discussions" collapsed={collapsed} />

                    {/* Programs */}
                    <ExpandableItem
                        icon={<GraduationCap size={20} />}
                        label="Programs"
                        collapsed={collapsed}
                        isActive={isProgramsActive}
                        open={programsOpen}
                        onToggle={() => setProgramsOpen(p => !p)}
                        children={[
                            // { to: "/admin/programs", icon: <List size={15} />, label: "All Programs" },
                            { to: "/admin/programs/upload", icon: <Upload size={15} />, label: "Create Program" },
                        ]}
                    />

                    {/* Engagement Submissions ← NEW */}
                    <ExpandableItem
                        icon={<Heart size={20} />}
                        label="Engagement"
                        collapsed={collapsed}
                        isActive={isEngageActive}
                        open={engageOpen}
                        onToggle={() => setEngageOpen(p => !p)}
                        children={[
                            {
                                to: "/admin/engage",
                                icon: <List size={15} />,
                                label: "All Submissions",
                            },
                            {
                                to: "/admin/engage?type=mentor",
                                icon: <GraduationCap size={15} />,
                                label: "Mentor Apps",
                            },
                            {
                                to: "/admin/engage?type=volunteer",
                                icon: <Users size={15} />,
                                label: "Volunteers",
                            },
                            {
                                to: "/admin/engage?type=contribute",
                                icon: <FileText size={15} />,
                                label: "Contributions",
                            },
                        ]}
                    />

                    <ExpandableItem
                        icon={<Newspaper size={20} />}
                        label="Articles"
                        collapsed={collapsed}
                        isActive={isArticlesActive}
                        open={articlesOpen}
                        onToggle={() => setArticlesOpen(p => !p)}
                        children={[
                            { to: "/admin/articles", icon: <List size={15} />, label: "All Articles" },
                            { to: "/admin/upload-article", icon: <Plus size={15} />, label: "Create Article" },
                        ]}
                    />

                    <ExpandableItem
                        icon={<Video size={20} />}
                        label="Videos"
                        collapsed={collapsed}
                        isActive={isVideosActive}
                        open={videosOpen}
                        onToggle={() => setVideosOpen(p => !p)}
                        children={[
                            { to: "/admin/videos", icon: <List size={15} />, label: "All Videos" },
                            { to: "/admin/upload-video", icon: <Plus size={15} />, label: "Upload Video" },
                        ]}
                    />

                    <ExpandableItem
                        icon={<BookOpen size={20} />}
                        label="Books"
                        collapsed={collapsed}
                        isActive={isBooksActive}
                        open={booksOpen}
                        onToggle={() => setBooksOpen(p => !p)}
                        children={[
                            { to: "/admin/books", icon: <List size={15} />, label: "All Books" },
                            { to: "/admin/upload-book", icon: <Plus size={15} />, label: "Upload Book" },
                        ]}
                    />

                    <ExpandableItem
                        icon={<CalendarDays size={20} />}
                        label="Events"
                        collapsed={collapsed}
                        isActive={isEventsActive}
                        open={eventsOpen}
                        onToggle={() => setEventsOpen(p => !p)}
                        children={[
                            { to: "/admin/events", icon: <List size={15} />, label: "All Events" },
                            { to: "/admin/upload-event", icon: <Plus size={15} />, label: "Create Event" },
                        ]}
                    />
                    <Item to="/admin/event/requests" icon={<FileText size={20} />} label="Event Requests" collapsed={collapsed} />
                    <Item to="/admin/contact/requests" icon={<MessageSquare size={20} />} label="Contact Requests" collapsed={collapsed} />

                </nav>

                {/* Footer */}
                {!collapsed && (
                    <div className="p-4 mx-3 mb-6 bg-slate-800/40 rounded-xl border border-slate-700/50">
                        <p className="text-[11px] text-slate-400 font-medium mb-1">LOGGED IN AS</p>
                        <p className="text-[13px] text-white font-semibold truncate">Administrator</p>
                    </div>
                )}
            </aside>
        </>
    );
}

/* ── UI Components ───────────────────────────────────────────────────────────*/

function Section({ label, collapsed }) {
    if (collapsed) return <div className="h-px bg-slate-800/50 my-4 mx-4" />;
    return (
        <p className="px-4 pt-4 pb-2 text-[10px] tracking-[2px] uppercase text-slate-500 font-bold">
            {label}
        </p>
    );
}

function Item({ to, icon, label, badge, collapsed }) {
    return (
        <NavLink
            to={to}
            end
            title={label}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                    ? "bg-indigo-600/10 text-indigo-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`
            }
        >
            <span className="shrink-0 transition-colors group-hover:text-indigo-400">{icon}</span>
            {!collapsed && (
                <span className="flex-1 text-[14px] font-poppins tracking-wide">{label}</span>
            )}
            {!collapsed && badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-600 text-white shadow-sm">
                    {badge}
                </span>
            )}
        </NavLink>
    );
}

function ExpandableItem({ icon, label, collapsed, isActive, open, onToggle, children, badge }) {
    if (collapsed) {
        return (
            <NavLink
                to={children[0].to}
                title={label}
                className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                        ? "bg-indigo-600/10 text-indigo-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`}
            >
                <span className="shrink-0 transition-colors group-hover:text-indigo-400">{icon}</span>
            </NavLink>
        );
    }

    return (
        <div>
            <button
                onClick={onToggle}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                        ? "bg-indigo-600/10 text-indigo-400 font-medium"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`}
            >
                <span className="shrink-0 transition-colors group-hover:text-indigo-400">{icon}</span>
                <span className="flex-1 text-left text-[14px] font-poppins tracking-wide">{label}</span>
                {badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-600 text-white shadow-sm mr-1">
                        {badge}
                    </span>
                )}
                <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${isActive ? "text-indigo-400" : "text-slate-600"}`}
                />
            </button>

            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${open ? "max-h-64 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}>
                <div className="ml-4 pl-3 border-l border-slate-700/60 space-y-0.5 py-1">
                    {children.map((child) => (
                        <NavLink
                            key={child.to}
                            to={child.to}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 text-[13px] font-poppins tracking-wide
                                ${isActive
                                    ? "bg-indigo-600/10 text-indigo-400 font-semibold"
                                    : "text-slate-500 hover:bg-slate-800/50 hover:text-white"
                                }`
                            }
                        >
                            <span>{child.icon}</span>
                            {child.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}