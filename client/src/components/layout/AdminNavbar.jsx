import { useAuth } from "../../context/AuthContext";
import {
    Bell,
    Search,
    User,
    ChevronDown,
    LogOut,
    Menu,
    Settings,
    HelpCircle
} from "lucide-react";
import { useState } from "react";

export default function AdminNavbar({ toggleSidebar, openMobile, admin }) {
    const { adminLogout } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            {/* Left side: Search and Toggle */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={openMobile}
                    className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
                >
                    <Menu size={20} className="text-slate-600" />
                </button>

                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-slate-100 rounded-lg hidden lg:block"
                >
                    <Menu size={20} className="text-slate-600" />
                </button>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search registrations, alumni..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Right side: Notifications and Profile */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <button className="p-2.5 hover:bg-slate-100 rounded-xl relative text-slate-500 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                            <User size={20} />
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-[13px] font-bold text-slate-800 leading-tight">Admin User</p>
                            <p className="text-[11px] text-slate-500 font-medium">{admin?.email || "Administrator"}</p>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`} />
                    </button>

                    {showProfile && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowProfile(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Settings</p>
                                </div>

                                <DropdownItem icon={<User size={16} />} label="My Profile" />
                                <DropdownItem icon={<Settings size={16} />} label="System Settings" />
                                <DropdownItem icon={<HelpCircle size={16} />} label="Help Center" />

                                <div className="h-px bg-slate-100 my-2 mx-2"></div>

                                <button
                                    onClick={adminLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span className="font-semibold">Sign Out</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

function DropdownItem({ icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
            <span className="text-slate-400">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
}
