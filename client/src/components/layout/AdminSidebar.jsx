import { NavLink } from "react-router-dom";
import {
    BarChart2,
    Users,
    CheckCircle,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    MessageSquare
} from "lucide-react";

export default function AdminSidebar({ collapsed, mobileOpen, closeMobile }) {
    return (
        <>
            {/* Overlay for mobile */}
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
                {/* Header/Logo Section */}
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

                {/* Navigation Section */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                    <Section label="Management" collapsed={collapsed} />

                    <Item
                        to="/admin"
                        icon={<BarChart2 size={20} />}
                        label="Overview"
                        collapsed={collapsed}
                    />

                    <Item
                        to="/admin/alumni-approval"
                        icon={<CheckCircle size={20} />}
                        label="Approvals"
                        badge="New"
                        collapsed={collapsed}
                    />

                    <Section label="Directory" collapsed={collapsed} />

                    <Item
                        to="/admin/alumni-list"
                        icon={<Users size={20} />}
                        label="Alumni List"
                        collapsed={collapsed}
                    />

                    <Item
                        to="/admin/messages"
                        icon={<MessageSquare size={20} />}
                        label="Messages"
                        collapsed={collapsed}
                    />

                    <Item
                        to="/admin/spotlight"
                        icon={<FileText size={20} />}
                        label="Spotlight"
                        collapsed={collapsed}
                    />

                    <Section label="System" collapsed={collapsed} />

                    <Item
                        to="/admin/settings"
                        icon={<Settings size={20} />}
                        label="Settings"
                        collapsed={collapsed}
                    />
                </nav>

                {/* Footer/Acknowledge Section */}
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

/* ── UI Components ── */

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
            title={label}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive
                    ? "bg-indigo-600/10 text-indigo-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`
            }
        >
            <span className="shrink-0 transition-colors group-hover:text-indigo-400">
                {icon}
            </span>
            {!collapsed && (
                <span className="flex-1 text-[14px] font-poppins tracking-wide">
                    {label}
                </span>
            )}
            {!collapsed && badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-600 text-white shadow-sm">
                    {badge}
                </span>
            )}
        </NavLink>
    );
}
