import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false
});

function Popup({ children, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        style={{ width: 340, animation: "popIn 0.18s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {children}
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.93) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

export default function AlumniNavbar({ toggleSidebar, openMobile, user }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      socket.connect();
      // Join personal room for global notifications
      socket.emit("join_room", user.id || user._id);

      fetchUnreadCount();
      fetchSystemNotifications();

      socket.on("receive_message", (message) => {
        // Only increment if message is from Admin
        if (message.senderModel === "Admin") {
          setUnreadMsgs((prev) => prev + 1);

          // Show toast if not on chat page
          if (window.location.pathname !== "/alumni/messages") {
            toast.success(`New message from Staff`, {
              icon: "💬",
              duration: 4000
            });
          }
        }
      });

      return () => {
        socket.off("receive_message");
        socket.disconnect();
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const convRes = await axios.get("/api/v1/chat/conversations");
      const conversations = convRes.data.conversations || [];
      const myConv = conversations.find(c => c.alumniId?._id === (user.id || user._id));
      setUnreadMsgs(myConv?.unreadCount?.alumni || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const fetchSystemNotifications = async () => {
    try {
      const res = await axios.get("/api/v1/alumni/notifications");
      setSystemNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch system notifications", err);
    }
  };

  const closeAll = () => {
    setProfileOpen(false);
    setNotifOpen(false);
    setMsgOpen(false);
  };

  const toggleNotif = () => {
    setMsgOpen(false);
    setProfileOpen(false);
    setNotifOpen((v) => !v);
  };

  const toggleProfile = () => {
    setNotifOpen(false);
    setMsgOpen(false);
    setProfileOpen((v) => !v);
  };

  const logout = () => {
    localStorage.removeItem("alumni_token");
    navigate("/alumni-login");
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'approval': return '✅';
      case 'rejection': return '❌';
      case 'registration': return '📝';
      default: return '📢';
    }
  };

  const getTimeAgo = (date) => {
    const s = Math.floor((new Date() - new Date(date)) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 relative">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobile}
          className="lg:hidden w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center font-bold"
        >
          ☰
        </button>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex w-9 h-9 bg-slate-100 rounded-lg items-center justify-center font-bold transition hover:bg-slate-200"
        >
          ⇆
        </button>
        <h2 className="font-serif text-lg font-semibold text-slate-800">
          Welcome back 👋
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Global Notifications (Bell) */}
        <div className="relative">
          <button
            onClick={toggleNotif}
            className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition ${notifOpen ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
          >
            <span className="text-xl">🔔</span>
            {systemNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {systemNotifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <Popup onClose={() => setNotifOpen(false)}>
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <span className="font-black text-slate-800 text-[10px] uppercase tracking-wider">Recent Alerts</span>
                <span className="text-[10px] text-indigo-500 font-bold cursor-pointer hover:underline">Mark read</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {systemNotifications.length > 0 ? (
                  systemNotifications.map((n) => (
                    <div
                      key={n._id}
                      className="flex items-start gap-4 px-4 py-4 cursor-pointer transition hover:bg-slate-50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 leading-tight">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{n.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{getTimeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-2xl mb-2">🎈</p>
                    <p className="text-[11px] font-bold">All caught up!</p>
                  </div>
                )}
              </div>
              <div className="border-t px-4 py-3 text-center bg-slate-50/50">
                <button
                  onClick={() => { setNotifOpen(false); navigate("/alumni/notifications"); }}
                  className="text-[10px] text-indigo-600 hover:underline font-black uppercase tracking-widest"
                >View all alerts</button>
              </div>
            </Popup>
          )}
        </div>

        {/* Support Chat Button */}
        <div className="relative">
          {/* <button
            onClick={() => {
              navigate("/alumni/messages");
              setUnreadMsgs(0);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition ${window.location.pathname === "/alumni/messages" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
          >
            <span className="text-xl">💬</span>
            {unreadMsgs > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {unreadMsgs}
              </span>
            )}
          </button> */}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-indigo-100">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-bold text-slate-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Alumni Member</p>
            </div>
            <span className={`hidden sm:block transition-transform duration-300 text-slate-300 font-bold ${profileOpen ? "rotate-180" : ""}`}>
              ⌄
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 bg-slate-50/50 border-b">
                <p className="text-sm font-black text-slate-800">{user.name}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate">{user.email}</p>
              </div>
              <div className="p-2">
                <button className="w-full px-4 py-2.5 text-left hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-3 transition-colors">
                  <span className="text-lg">👤</span> Profile Settings
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-3 transition-colors">
                  <span className="text-lg">⚙️</span> Preferences
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-3 transition-colors">
                  <span className="text-lg">🎓</span> Alumni Card
                </button>
              </div>
              <div className="p-2 border-t">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors"
                >
                  <span className="text-lg">🚪</span> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(profileOpen || notifOpen || msgOpen) && (
        <div className="fixed inset-0 z-40" onClick={closeAll} />
      )}
    </header>
  );
}
