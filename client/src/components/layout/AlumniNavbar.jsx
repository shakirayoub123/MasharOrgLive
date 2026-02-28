import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket";
import axios from "axios";
import toast from "react-hot-toast";
import AlumniCard from "../alumni/AluminiCard";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import { resolveAssetUrl } from "../../utils/baseUrl";

const ANIM_STYLE = `
  @keyframes dropDown {
    from { opacity: 0; transform: scale(0.95) translateY(-6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  .dropdown-pop {
    animation: dropDown 0.18s cubic-bezier(0.34,1.3,0.64,1) forwards;
    transform-origin: top right;
  }
`;

function avatarUrl(path) {
  const url = resolveAssetUrl(path);
  return url ? `${url}?t=${Date.now()}` : null;
}

function Avatar({ user, size = 36, radius = "rounded-xl", className = "" }) {
  const [imgError, setImgError] = useState(false);
  const src = avatarUrl(user?.avatar);
  const letter = user?.full_name?.charAt(0).toUpperCase() || "?";

  useEffect(() => { setImgError(false); }, [user?.avatar]);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={user?.full_name || "avatar"}
        onError={() => setImgError(true)}
        className={`object-cover flex-shrink-0 ${radius} ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-white font-black flex-shrink-0 ${radius} ${className}`}
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg,#0F1C80 0%,#1a2fa0 100%)",
        fontSize: size * 0.38,
        boxShadow: "0 4px 12px rgba(15,28,128,.3)",
      }}
    >
      {letter}
    </div>
  );
}

function NotifPopup({ children, onClose }) {
  return (
    <>
      <style>{ANIM_STYLE}</style>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="dropdown-pop absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        style={{ width: 360 }}
      >
        {children}
      </div>
    </>
  );
}

export default function AlumniNavbar({ toggleSidebar, openMobile }) {
  const { user, avatarVersion } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const [profile, setProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [showAlumniCard, setShowAlumniCard] = useState(false);
  const navigate = useNavigate();

  // ── Fetch notifications ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    setNotifLoading(true);
    API.get("/alumni/notifications")
      .then(res => setNotifications(res.data?.data || []))
      .catch(err => console.error("Failed to fetch notifications", err))
      .finally(() => setNotifLoading(false));
  }, [user?._id]);

  // ── Socket: live notifications ────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;

    const handleNewNotif = (notif) => {
      setNotifications(prev => {
        const exists = prev.some(n => n._id === notif._id);
        if (exists) return prev;
        return [{ ...notif, read: false }, ...prev];
      });
      toast.success(notif.message, {
        icon: "🔔",
        duration: 4000,
        style: { fontWeight: 700, fontSize: 13, borderLeft: "4px solid #0F1C80" },
      });
    };

    socket.on("f9Tz3Kw8mXqP2nVbRjL5sYcDhA4eGuN", handleNewNotif);
    socket.on(`msh_alumni_${user._id}`, handleNewNotif);
    socket.on("new_notification", handleNewNotif);

    return () => {
      socket.off("f9Tz3Kw8mXqP2nVbRjL5sYcDhA4eGuN", handleNewNotif);
      socket.off(`msh_alumni_${user._id}`, handleNewNotif);
      socket.off("new_notification", handleNewNotif);
    };
  }, [user?._id]);

  // ── Mark one as read ──────────────────────────────────────────────────────
  const handleMarkOneRead = useCallback(async (id) => {
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, read: true } : n)
    );
    try {
      await API.post(`/alumni/notification/${id}/read`);
    } catch (err) {
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: false } : n)
      );
      console.error("Failed to mark notification read", err);
    }
  }, []);

  // ── Mark all as read ──────────────────────────────────────────────────────
  const handleMarkAllRead = useCallback(async () => {
    const previous = notifications;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await API.post("/alumni/notification/read");
    } catch (err) {
      setNotifications(previous);
      console.error("Failed to mark all read", err);
      toast.error("Failed to mark notifications as read");
    }
  }, [notifications]);

  // ── Clear all ─────────────────────────────────────────────────────────────
  const handleClearAll = useCallback(async () => {
    const previous = notifications;
    setNotifications([]);
    setClearing(true);
    try {
      await API.delete("/alumni/notifications/clear");
    } catch (err) {
      setNotifications(previous);
      console.error("Failed to clear notifications", err);
      toast.error("Could not clear notifications");
    } finally {
      setClearing(false);
    }
  }, [notifications]);

  // ── Fresh avatar after profile save ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    API.get("/auth/profile")
      .then(res => setProfile(res.data?.data || null))
      .catch(() => { });
  }, [user?._id, avatarVersion]);

  // Merge full profile when available so derived UI (AlumniCard, dropdown) has latest fields like `phone`.
  const displayUser = profile ? { ...user, ...profile } : user;

  const closeAll = () => { setProfileOpen(false); setNotifOpen(false); };
  const toggleNotif = () => { setProfileOpen(false); setNotifOpen(v => !v); };
  const toggleProfile = () => { setNotifOpen(false); setProfileOpen(v => !v); };

  const logout = () => {
    localStorage.removeItem("alumni_token");
    navigate("/alumni-login");
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
    <>
      <style>{ANIM_STYLE}</style>

      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 relative z-30">

        <div className="flex items-center gap-3">
          <button onClick={openMobile}
            className="lg:hidden w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition">
            ☰
          </button>
          <button onClick={toggleSidebar}
            className="hidden lg:flex w-9 h-9 bg-slate-100 rounded-lg items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition">
            ⇆
          </button>
          <h2 className="font-serif text-lg font-semibold text-slate-800">Welcome back 👋</h2>
        </div>

        <div className="flex items-center gap-2">

          {/* ── Bell ── */}
          <div className="relative">
            <button
              onClick={toggleNotif}
              className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition
                ${notifOpen ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#0F1C80] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <NotifPopup onClose={() => setNotifOpen(false)}>

                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 text-[11px] uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0F1C80] text-[9px] font-black leading-none">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-[#0F1C80] font-bold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        disabled={clearing}
                        className="text-[10px] text-slate-400 font-bold hover:underline disabled:opacity-40"
                      >
                        {clearing ? "Clearing…" : "Clear all"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifLoading ? (
                    <div className="py-14 text-center">
                      <div className="w-6 h-6 border-2 border-blue-300 border-t-[#0F1C80] rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-[11px] text-slate-400 font-semibold">Loading...</p>
                    </div>
                  ) : notifications.length > 0 ? notifications.map(n => (
                    <div
                      key={n._id}
                      onClick={() => {
                        handleMarkOneRead(n._id);
                        setNotifOpen(false);
                        if (n.action_link) navigate(n.action_link);
                      }}
                      className={`relative flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition
                        ${!n.read ? "bg-blue-50/40" : ""}`}
                    >
                      {!n.read && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0F1C80]" />
                      )}
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base flex-shrink-0 ml-2">
                        📢
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12.5px] leading-snug ${n.read ? "text-slate-500 font-medium" : "text-slate-800 font-bold"}`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-tight">
                          {getTimeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0F1C80] mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  )) : (
                    <div className="py-14 text-center">
                      <p className="text-3xl mb-2">🎈</p>
                      <p className="text-[12px] font-bold text-slate-500">All caught up!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">No new notifications</p>
                    </div>
                  )}
                </div>

              </NotifPopup>
            )}
          </div>

          {/* ── Support Chat ── */}
          {/* <div className="relative">
            <button
              onClick={() => {
                setUnreadMsgs(0);
                axios.put(`/api/chat/read/${user.id || user._id}`, { role: "Alumni" }).catch(() => { });
                window.dispatchEvent(new Event("open_chat_widget"));
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center relative transition bg-slate-100 hover:bg-slate-200 text-slate-600"
              title="Support Chat"
            >
              <span className="text-xl">💬</span>
              {unreadMsgs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F38900] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {unreadMsgs}
                </span>
              )}
            </button>
          </div> */}

          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* ── Profile trigger ── */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="relative">
                <Avatar user={displayUser} size={36} radius="rounded-xl" className="shadow-md shadow-blue-100" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-bold text-slate-800 leading-none">{displayUser.full_name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Alumni Member</p>
              </div>
              <svg
                className={`hidden sm:block w-3 h-3 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeAll} />
                <div className="dropdown-pop absolute right-0 top-full mt-2 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

                  {/* ── Profile header — NAVY ── */}
                  <div
                    className="relative px-4 pt-4 pb-3 overflow-hidden"
                    style={{ background: "linear-gradient(135deg,#0F1C80 0%,#1a2fa0 100%)" }}
                  >
                    <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10" />
                    <div className="absolute -bottom-6 -left-4 w-16 h-16 rounded-full bg-white/10" />
                    <div className="relative flex items-center gap-3">
                      <Avatar user={displayUser} size={44} radius="rounded-xl" className="border-2 border-white/30 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[14px] font-black text-white leading-tight truncate">{displayUser.full_name}</p>
                        <p className="text-[11px] text-blue-200 truncate">{displayUser.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-bold text-emerald-300">ONLINE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/alumni/profile"); }}
                      className="w-full px-3 py-2.5 flex items-center gap-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                    >
                      <span className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-base transition-colors flex-shrink-0">👤</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-700 leading-tight">My Profile</p>
                        <p className="text-[11px] text-slate-400">View &amp; edit your info</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setProfileOpen(false); setShowAlumniCard(true); }}
                      className="w-full px-3 py-2.5 flex items-center gap-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                    >
                      <span className="w-8 h-8 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-base transition-colors flex-shrink-0">🎓</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-700 leading-tight">Alumni Card</p>
                        <p className="text-[11px] text-slate-400">View your digital ID</p>
                      </div>
                    </button>
                  </div>

                  <div className="mx-3 border-t border-slate-100" />

                  {/* ── Sign Out — ORANGE ── */}
                  <div className="p-1.5">
                    <button
                      onClick={logout}
                      className="w-full px-3 py-2.5 flex items-center gap-3 rounded-xl hover:bg-orange-50 transition-colors group text-left"
                    >
                      <span className="w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-base transition-colors flex-shrink-0">🚪</span>
                      <div>
                        <p className="text-[13px] font-bold leading-tight" style={{ color: "#F38900" }}>Sign Out</p>
                        <p className="text-[11px] text-orange-300">End your session</p>
                      </div>
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>

        </div>
      </header>

      {showAlumniCard && (
        <AlumniCard user={displayUser} onClose={() => setShowAlumniCard(false)} />
      )}
    </>
  );
}