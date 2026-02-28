import { useAuth } from "../../context/AuthContext";
import {
    Bell,
    Search,
    User,
    ChevronDown,
    LogOut,
    Menu,
    Settings,
    HelpCircle,
    MessageSquare,
    UserPlus,
    UserCheck,
    X as CloseIcon,
    Activity
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import socket from "../../utils/socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Popup({ children, onClose }) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className="absolute right-0 top-full mt-3 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                style={{ width: 340, animation: "popIn 0.2s cubic-bezier(.34,1.56,.64,1)" }}
            >
                {children}
            </div>
            <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.95) translateY(-10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
        </>
    );
}
let navbarListenerAttached = false;

export default function AdminNavbar({ toggleSidebar, openMobile, admin }) {
    const { adminLogout, adminToken } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showChatNotifs, setShowChatNotifs] = useState(false);
    const [unreadChat, setUnreadChat] = useState(0);
    const [chatNotifs, setChatNotifs] = useState([]);
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();
    const listenerAttached = useRef(false);


    useEffect(() => {
        if (!adminToken) return;

        if (!socket.connected) socket.connect();
        socket.emit("join_admin");
        fetchInitialState();

        if (!navbarListenerAttached) {
            navbarListenerAttached = true;

            const handleMessage = (message) => {
                if (message.senderModel === "Alumni") {
                    setUnreadChat(prev => prev + 1);
                    setChatNotifs(prev => [{
                        text: message.text,
                        conversationId: message.conversationId,
                        alumniName: message.alumniName || "Alumni",
                        sentAt: message.sentAt || new Date().toISOString(),
                    }, ...prev].slice(0, 10));
                }
            };

            socket.on("receiveMessage", handleMessage);
        }

        return () => {
            navbarListenerAttached = false;
            socket.off("receiveMessage");
        };
    }, [adminToken]);

    const fetchInitialState = async () => {
        try {
            const convRes = await axios.get("/api/admin/conversations", {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const conversations = convRes.data.data?.conversations || convRes.data.conversations || [];
            const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount?.admin || 0), 0);
            setUnreadChat(totalUnread);
            setActivities([]);
        } catch (err) {
            console.error("Failed to fetch admin navbar data", err);
        }
    };

    const formatTimeAgo = (date) => {
        const s = Math.floor((new Date() - new Date(date)) / 1000);
        if (s < 60) return "Just now";
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return new Date(date).toLocaleDateString();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'registration': return <UserPlus className="text-indigo-600" size={16} />;
            case 'approval': return <UserCheck className="text-emerald-600" size={16} />;
            case 'rejection': return <CloseIcon className="text-rose-600" size={16} />;
            default: return <Activity className="text-slate-600" size={16} />;
        }
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            {/* Left side */}
            <div className="flex items-center gap-4 flex-1">
                <button onClick={openMobile} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
                    <Menu size={20} className="text-slate-600" />
                </button>
                <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg hidden lg:block">
                    <Menu size={20} className="text-slate-600" />
                </button>
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search registrations, alumni..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">

                {/* Chat Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setShowChatNotifs(!showChatNotifs); setUnreadChat(0); setShowNotifs(false); }}
                        className={`p-2.5 rounded-xl relative transition-all duration-300 ${unreadChat > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                        <MessageSquare size={20} />
                        {unreadChat > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                                {unreadChat > 9 ? "9+" : unreadChat}
                            </span>
                        )}
                    </button>

                    {showChatNotifs && (
                        <Popup onClose={() => setShowChatNotifs(false)}>
                            <div className="px-5 py-4 border-b flex items-center justify-between bg-slate-50/50">
                                <span className="font-black text-slate-800 text-[10px] uppercase tracking-[0.1em]">New Messages</span>
                                {chatNotifs.length > 0 && (
                                    <button onClick={() => setChatNotifs([])} className="text-[10px] text-slate-400 hover:text-slate-600 font-bold">
                                        Clear all
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
                                {chatNotifs.length > 0 ? chatNotifs.map((notif, i) => (
                                    <button key={i}
                                        onClick={() => { setShowChatNotifs(false); navigate("/admin/messages"); }}
                                        className="w-full flex gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 font-black text-indigo-600 text-sm">
                                            {notif.alumniName?.charAt(0).toUpperCase() || "A"}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-bold text-slate-800 leading-tight truncate">{notif.alumniName}</p>
                                            <p className="text-[11px] text-slate-500 mt-1 truncate">{notif.text}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">{formatTimeAgo(notif.sentAt)}</p>
                                        </div>
                                    </button>
                                )) : (
                                    <div className="py-12 text-center">
                                        <MessageSquare size={32} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No New Messages</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t bg-slate-50/50 text-center">
                                <button
                                    onClick={() => { setShowChatNotifs(false); navigate("/admin/messages"); }}
                                    className="text-[10px] text-indigo-600 font-black uppercase tracking-widest hover:underline"
                                >View All Messages</button>
                            </div>
                        </Popup>
                    )}
                </div>

                {/* Bell Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setShowNotifs(!showNotifs); setShowChatNotifs(false); }}
                        className={`p-2.5 rounded-xl relative transition-all duration-300 ${showNotifs ? 'bg-slate-100 text-slate-900' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                        <Bell size={20} />
                        {activities.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {showNotifs && (
                        <Popup onClose={() => setShowNotifs(false)}>
                            <div className="px-5 py-4 border-b flex items-center justify-between bg-slate-50/50">
                                <span className="font-black text-slate-800 text-[10px] uppercase tracking-[0.1em]">Administrative Alerts</span>
                            </div>
                            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
                                {activities.length > 0 ? activities.map((act) => (
                                    <div key={act._id} className="flex gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-default">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                                            {getIcon(act.type)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-bold text-slate-800 leading-tight truncate">{act.title}</p>
                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{act.description}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">{formatTimeAgo(act.createdAt)}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-12 text-center">
                                        <Activity size={32} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Alerts</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t bg-slate-50/50 text-center">
                                <button
                                    onClick={() => { setShowNotifs(false); navigate("/admin/dashboard"); }}
                                    className="text-[10px] text-indigo-600 font-black uppercase tracking-widest hover:underline"
                                >Dashboard Overview</button>
                            </div>
                        </Popup>
                    )}
                </div>

                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-[14px] transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                            {admin?.email?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-[13px] font-black text-slate-800 leading-tight">Staff Account</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{admin?.email || "Administrator"}</p>
                        </div>
                        <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${showProfile ? "rotate-180" : ""}`} />
                    </button>

                    {showProfile && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden">
                                <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50 mb-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Administrative Control</p>
                                </div>
                                <DropdownItem icon={<User size={16} />} label="My Profile" onClick={() => { setShowProfile(false); navigate("/admin/profile"); }} />
                                <DropdownItem icon={<Settings size={16} />} label="Security Settings" />
                                <DropdownItem icon={<HelpCircle size={16} />} label="System Logs" />
                                <div className="h-px bg-slate-100 my-2 mx-2"></div>
                                <button
                                    onClick={adminLogout}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                >
                                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-bold">End Session</span>
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
            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
            <span className="text-slate-300">{icon}</span>
            <span className="font-bold">{label}</span>
        </button>
    );
}