import { Outlet } from "react-router-dom";
import AlumniSidebar from "./AlumniSidebar";
import AlumniNavbar from "./AlumniNavbar";
// import ChatWidget from "../chat/ChatWidget";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import socket from "../../utils/socket";

// Must match backend notifier.js exactly
const GLOBAL_NOTIF_EVENT = "f9Tz3Kw8mXqP2nVbRjL5sYcDhA4eGuN";

export default function AlumniLayout() {
  const [collapsed,     setCollapsed]     = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [notifications, setNotifications] = useState([]);  // starts empty, populated by socket only

  const { user, loading } = useAuth();

  // ── Persist sidebar state ────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved) setCollapsed(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(collapsed));
  }, [collapsed]);

  // ── Global socket notifications ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const handleNotif = ({ message, action_link }) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          message,
          action_link,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    socket.on(GLOBAL_NOTIF_EVENT, handleNotif);

    // Console helper for manual testing — remove in production
    // Usage: window._testNotif("Your message", "/alumni/spotlight")
    window._testNotif = (msg = "Test notification 🔔", link = "/alumni") => {
      handleNotif({ message: msg, action_link: link });
    };

    return () => {
      socket.off(GLOBAL_NOTIF_EVENT, handleNotif);
      delete window._testNotif;
    };
  }, [user]);

  // ── Notification actions ─────────────────────────────────────────────────
  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markOneRead = (id) =>
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );

  const clearAll = () => setNotifications([]);

  // ── Loading guard ────────────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F4EC]">
      <Toaster position="top-right" />

      <AlumniSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <AlumniNavbar
          toggleSidebar={() => setCollapsed(c => !c)}
          openMobile={() => setMobileOpen(true)}
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onMarkOneRead={markOneRead}
          onClearAll={clearAll}
        />

        <main className="flex-1 overflow-y-auto p-7 relative">
          <Outlet context={{ user, notifications, onMarkAllRead: markAllRead, onMarkOneRead: markOneRead, onClearAll: clearAll }} />
          {/* <ChatWidget /> */}
        </main>
      </div>
    </div>
  );
}