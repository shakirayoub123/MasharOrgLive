import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import socket from "../../utils/socket";

// ── Design tokens ─────────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const TH = "#0D1240";
const TS = "#9CA3AF";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getTimeAgo = (date) => {
  if (!date) return "";
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

function getTag(message = "") {
  const m = message.toLowerCase();
  if (m.includes("session") || m.includes("webinar") || m.includes("calendar"))
    return { tag: "Session", color: NAVY, bg: NAVY_50 };
  if (m.includes("resource") || m.includes("pdf") || m.includes("library"))
    return { tag: "Resource", color: NAVY, bg: NAVY_50 };
  if (m.includes("summit") || m.includes("reunion") || m.includes("event"))
    return { tag: "Event", color: NAVY, bg: NAVY_50 };
  if (m.includes("registr") || m.includes("open"))
    return { tag: "New Event", color: NAVY, bg: NAVY_50 };
  if (m.includes("announc") || m.includes("update"))
    return { tag: "Update", color: NAVY, bg: NAVY_50 };
  if (m.includes("mentor") || m.includes("program") || m.includes("platform"))
    return { tag: "Platform", color: NAVY, bg: NAVY_50 };
  return { tag: "Notice", color: NAVY, bg: NAVY_50 };
}

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const sorted = [
    ...notifications.filter(n => !n.read),
    ...notifications.filter(n => n.read),
  ];

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    API.get("/alumni/notifications")
      .then(res => setNotifications(res.data?.data || []))
      .catch(err => console.error("Failed to fetch notifications", err))
      .finally(() => setLoading(false));
  }, [user?._id]);

  // ── Socket: live push ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    const handler = (notif) => {
      setNotifications(prev => {
        if (prev.some(n => n._id === notif._id)) return prev;
        return [{ ...notif, read: false }, ...prev];
      });
    };
    socket.on("new_notification", handler);
    return () => socket.off("new_notification", handler);
  }, [user?._id]);

  // ── Mark one read ─────────────────────────────────────────────────────────
  const handleMarkOneRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await API.post(`/alumni/notification/${id}/read`);
    } catch {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: false } : n));
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .notif-item { transition: background .15s, transform .15s; }
        .notif-item:hover { background: ${NAVY_50} !important; transform: translateX(3px); }
        .notif-scroll::-webkit-scrollbar { width: 4px; }
        .notif-scroll::-webkit-scrollbar-track { background: transparent; }
        .notif-scroll::-webkit-scrollbar-thumb { background: ${NAVY_100}; border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Outer flex wrapper with LEFT gradient bar outside the card ── */}
      <div style={{
        display: "flex",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 5px rgba(15,28,128,.05)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── LEFT GRADIENT BAR ── */}
        <div style={{
          width: 4,
          flexShrink: 0,
          background: `linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
        }} />

        {/* ── CARD ── */}
        <div style={{
          background: "#fff",
          border: `1px solid ${NAVY_100}`,
          borderLeft: "none",
          borderRadius: "0 16px 16px 0",
          flex: 1,
          overflow: "hidden",
        }}>

          {/* ── header ── */}
          <div style={{
            padding: "16px 20px 14px",
            borderBottom: `1px solid ${NAVY_50}`,
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800,
                color: TH, margin: "0 0 3px", letterSpacing: "-0.2px",
              }}>
                🔔 Notifications
              </h2>
              <p style={{ fontSize: 12, color: TS, margin: 0 }}>Stay on  &amp; track with timely reminders</p>
            </div>

            {/* unread badge */}
            {unreadCount > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 800, color: "#fff",
                background: "#DC2626", padding: "2px 8px", borderRadius: 20,
                flexShrink: 0,
              }}>
                {unreadCount} new
              </span>
            )}
          </div>

          {/* ── scrollable list ── */}
          <div
            className="notif-scroll"
            style={{ padding: "6px 8px 8px", maxHeight: 348, overflowY: "auto" }}
          >
            {loading ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <div style={{
                  width: 20, height: 20, margin: "0 auto 8px",
                  border: `2px solid ${NAVY_100}`, borderTopColor: NAVY,
                  borderRadius: "50%", animation: "spin 0.7s linear infinite",
                }} />
                <p style={{ fontSize: 11, color: TS }}>Loading...</p>
              </div>

            ) : sorted.length > 0 ? sorted.map((n, i) => {
              const { tag, color, bg } = getTag(n.message);
              return (
                <div
                  key={n._id}
                  className="notif-item"
                  onClick={() => {
                    handleMarkOneRead(n._id);
                    if (n.action_link) navigate(n.action_link);
                  }}
                  style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "11px 12px", borderRadius: 10, cursor: "pointer",
                    borderBottom: i < sorted.length - 1 ? `1px solid ${NAVY_50}` : "none",
                    background: "none",
                    opacity: n.read ? 0.55 : 1,
                  }}
                >
                  {/* colored dot */}
                  <div style={{
                    width: 8, height: 8, minWidth: 8, borderRadius: "50%",
                    background: NAVY, marginTop: 5, flexShrink: 0,
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* tag chip */}
                    <span style={{
                      display: "inline-block",
                      fontSize: 9.5, fontWeight: 800, letterSpacing: "0.8px",
                      textTransform: "uppercase", padding: "2px 9px", borderRadius: 20,
                      background: bg, color: color, marginBottom: 5,
                    }}>
                      {tag}
                    </span>

                    {/* message */}
                    <p style={{
                      fontSize: 13, fontWeight: n.read ? 500 : 600,
                      color: n.read ? "#6B7280" : TH,
                      lineHeight: 1.45, margin: "0 0 4px", wordBreak: "break-word",
                    }}>
                      {n.message}
                    </p>

                    {/* time */}
                    <p style={{ fontSize: 11, color: TS, margin: 0 }}>{getTimeAgo(n.createdAt)}</p>
                  </div>

                  {/* arrow */}
                  <span style={{
                    fontSize: 14, color: n.read ? NAVY_100 : NAVY,
                    flexShrink: 0, marginTop: 4, fontWeight: 700,
                  }}>›</span>
                </div>
              );
            }) : (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <p style={{ fontSize: 24, marginBottom: 8 }}>🎈</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", margin: "0 0 4px" }}>All caught up!</p>
                <p style={{ fontSize: 11, color: TS, margin: 0 }}>No new notifications</p>
              </div>
            )}
          </div>

          {/* ── scroll hint ── */}
          {sorted.length > 6 && (
            <div style={{
              textAlign: "center", padding: "4px 0 8px",
              fontSize: 10, color: NAVY_100, fontWeight: 700,
              letterSpacing: "0.8px", textTransform: "uppercase",
            }}>
              scroll for more ↑
            </div>
          )}

        </div>
      </div>
    </>
  );
}