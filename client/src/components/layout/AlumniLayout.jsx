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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

        <main className="flex-1 overflow-y-auto p-7 relative flex flex-col">
          <div className="flex-1">
            <Outlet context={{ user, notifications, onMarkAllRead: markAllRead, onMarkOneRead: markOneRead, onClearAll: clearAll }} />
            {/* <ChatWidget /> */}
          </div>

          {/* ── ALUMNI PANEL FOOTER ── */}
        </main>
        
        <footer className="shrink-0 px-7 py-3.5 border-t border-gray-200/80 bg-[#F9F4EC] flex flex-col md:flex-row items-center justify-between text-[12.5px] font-medium text-slate-500 z-10 relative" style={{ fontFamily: "'DM Sans', sans-serif", boxShadow: "0 -4px 10px rgba(0,0,0,0.02)" }}>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-[#0F1C80] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.3a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.832l8.57 2.77a2 2 0 0 0 1.66 0z"/>
                  <path d="M22 10v6"/>
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>
                </svg>
              </div>
              <p>
                &copy; {new Date().getFullYear()} Mashar Alumni Network. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6 mt-3 md:mt-0">
              <a href="#" className="hover:text-[#0F1C80] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#0F1C80] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#0F1C80] transition-colors">Support</a>
            </div>
        </footer>
      </div>
    </div>
  );
}