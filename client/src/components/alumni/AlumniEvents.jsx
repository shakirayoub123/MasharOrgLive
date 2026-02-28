import { useState, useEffect } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";

const NAVY = "#0F1C80";
const ORANGE = "#F38900";
const NAVY_50 = "#EEF0FF";
const NAVY_100 = "#DDE0FF";
const ORANGE_50 = "#FFF4E0";
const CARD = "#FFFFFF";
const TH = "#0D1240";
const TB = "#4B5563";
const TS = "#9CA3AF";
const GREEN = "#059669";

const formatEventDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    return {
        day: String(date.getDate()).padStart(2, "0"),
        month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        year: date.getFullYear(),
    };
};

const formatEventTime = (timeString) => {
    if (!timeString) return "TBA";
    try {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    } catch {
        return timeString;
    }
};

const getEventTypeColor = (platform) => {
    if (platform === "zoom") return "#2563EB";
    if (platform === "meet") return "#059669";
    return NAVY;
};

const getUrgencyBadge = (registeredCount, capacity) => {
    if (!capacity) return { text: "Open", bg: "#ECFDF5", color: "#1A6B3C", full: false };
    const remaining = capacity - registeredCount;
    if (remaining <= 0) return { text: "Full", bg: "#FEE2E2", color: "#991B1B", full: true };
    if (remaining <= Math.ceil(capacity * 0.2)) return { text: `${remaining} left`, bg: ORANGE_50, color: "#C45000", full: false };
    return { text: "Open", bg: "#ECFDF5", color: "#1A6B3C", full: false };
};

function sameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isEventDay(eventDateStr) {
    const today = new Date();
    const eventDate = new Date(eventDateStr + "T00:00:00");
    return sameDay(today, eventDate);
}

function isEventPast(eventDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(eventDateStr + "T00:00:00");
    return eventDate < today;
}

function Chip({ label, color, platform }) {
    const bg =
        platform === "zoom" ? "#EBF5FF" :
            platform === "meet" ? "#E6FAF5" :
                "#F1F5F9";
    return (
        <span
            style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: bg, color, whiteSpace: "nowrap",
                letterSpacing: "0.4px", flexShrink: 0,
            }}
        >
      {(platform === "zoom" || platform === "meet") ? "🎥 " : ""}{label}
    </span>
    );
}

function EventSkeleton({ i }) {
    return (
        <div
            style={{
                background: CARD, borderRadius: 16, border: `1px solid ${NAVY_50}`,
                boxShadow: "0 1px 4px rgba(15,28,128,.05)", overflow: "hidden",
                display: "flex", animation: `fu .35s ease ${i * 0.08}s both`,
            }}
        >
            <div
                style={{
                    flexShrink: 0, background: NAVY_50, width: 78, padding: "18px 0",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}
            >
                <div style={{ width: 40, height: 40, background: NAVY_100, borderRadius: 8, animation: "pulse 2s infinite" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, padding: "15px 16px 15px 14px" }}>
                <div style={{ height: 16, background: NAVY_50, borderRadius: 4, marginBottom: 8, animation: "pulse 2s infinite", width: "60%" }} />
                <div style={{ height: 14, background: NAVY_50, borderRadius: 4, marginBottom: 8, animation: "pulse 2s infinite" }} />
                <div style={{ height: 12, background: NAVY_50, borderRadius: 4, animation: "pulse 2s infinite", width: "70%" }} />
            </div>
        </div>
    );
}

function EventCard({ ev, i, onRegister, onUnregister }) {
    const [hov, setHov] = useState(false);
    const [registering, setRegistering] = useState(false);

    const dateInfo = formatEventDate(ev.eventDate);
    const timeInfo = formatEventTime(ev.eventTime);
    const eventTypeColor = getEventTypeColor(ev.platform);
    const urgency = getUrgencyBadge(ev.registeredCount || 0, ev.capacity);
    const isPast = isEventPast(ev.eventDate);
    const isToday = isEventDay(ev.eventDate);
    const canJoin = ev.isRegistered && isToday;

    const pastBadge = isPast
        ? ev.isRegistered
            ? { text: "✓ Attended", bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" }
            : { text: "Ended", bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0" }
        : null;

    const handleAction = async () => {
        setRegistering(true);
        if (ev.isRegistered) {
            await onUnregister(ev._id);
        } else {
            await onRegister(ev._id);
        }
        setRegistering(false);
    };

    const outerStyle = {
        background: isPast ? "#FAFAFA" : CARD,
        borderRadius: 16,
        border: `1px solid ${hov && !isPast ? NAVY_100 : NAVY_50}`,
        boxShadow: hov && !isPast ? "0 8px 28px rgba(15,28,128,.10)" : "0 1px 4px rgba(15,28,128,.05)",
        transform: hov && !isPast ? "translateY(-3px)" : "none",
        transition: "all .2s ease",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: `fu .35s ease ${i * 0.08}s both`,
        opacity: isPast ? 0.82 : 1,
    };

    const dateColStyle = {
        flexShrink: 0,
        background: isPast ? "#F1F5F9" : NAVY_50,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        borderRight: `1px solid ${isPast ? "#E2E8F0" : NAVY_100}`,
    };

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={outerStyle}
        >
            <div style={{ display: "flex", flex: 1 }}>
                <div className="ev-date" style={dateColStyle}>
                    <div
                        style={{
                            position: "absolute", top: 0, left: 0, right: 0, height: 3,
                            background: isPast
                                ? "linear-gradient(90deg,#94A3B8,#CBD5E1)"
                                : `linear-gradient(90deg,${NAVY},${ORANGE})`,
                        }}
                    />
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: isPast ? "#94A3B8" : NAVY, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.6 }}>
            {dateInfo.month}
          </span>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 900, color: isPast ? "#94A3B8" : NAVY, lineHeight: 1, letterSpacing: "-1px" }}>
            {dateInfo.day}
          </span>
                    <span style={{ fontSize: 9, color: TS, fontWeight: 600, textAlign: "center", padding: "0 5px" }}>
            {timeInfo}
          </span>
                </div>

                <div style={{ flex: 1, minWidth: 0, padding: "15px 16px 15px 14px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                        <Chip
                            label={ev.platform === "zoom" ? "Zoom" : ev.platform === "meet" ? "Google Meet" : "Event"}
                            color={isPast ? "#94A3B8" : eventTypeColor}
                            platform={isPast ? null : ev.platform}
                        />
                        {isPast ? (
                            <span
                                style={{
                                    fontSize: 10.5, fontWeight: 700,
                                    color: pastBadge.color,
                                    background: pastBadge.bg,
                                    border: `1px solid ${pastBadge.border}`,
                                    padding: "2px 10px", borderRadius: 9, flexShrink: 0,
                                }}
                            >
                {pastBadge.text}
              </span>
                        ) : (
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: urgency.color, background: urgency.bg, padding: "2px 8px", borderRadius: 9, flexShrink: 0 }}>
                {urgency.text}
              </span>
                        )}
                    </div>

                    <h3 style={{ fontSize: 14, fontWeight: 800, color: isPast ? "#6B7280" : TH, lineHeight: 1.4, margin: "0 0 5px", wordBreak: "break-word" }}>
                        {ev.eventName}
                    </h3>

                    <p style={{ fontSize: 12.5, color: TB, lineHeight: 1.6, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {ev.description}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, color: TS, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              📍 {ev.location}
            </span>
                        {!isPast && (
                            <button
                                onClick={handleAction}
                                disabled={registering || (urgency.full && !ev.isRegistered)}
                                style={{
                                    padding: "6px 16px", borderRadius: 20, border: "none",
                                    background: ev.isRegistered ? NAVY_50 : (urgency.full ? "#E2E8F0" : NAVY),
                                    color: ev.isRegistered ? NAVY : (urgency.full ? "#94A3B8" : "#fff"),
                                    fontSize: 12, fontWeight: 700,
                                    cursor: (urgency.full && !ev.isRegistered) ? "not-allowed" : "pointer",
                                    transition: "all .2s", whiteSpace: "nowrap",
                                    boxShadow: ev.isRegistered || urgency.full ? "none" : "0 3px 10px rgba(15,28,128,.2)",
                                    opacity: registering ? 0.6 : 1,
                                }}
                            >
                                {registering ? "..." : ev.isRegistered ? "✓ Registered" : urgency.full ? "Full" : "Register →"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {canJoin && (
                <div
                    style={{
                        background: "#F0FDF4",
                        padding: "10px 16px",
                        borderTop: "1px solid #DCFCE7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>
            🟢 Event is happening today!
          </span>
                    <a
                        href={ev.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: "6px 16px", borderRadius: 16, border: "none",
                            background: GREEN, color: "#fff",
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            textDecoration: "none", display: "inline-block",
                            boxShadow: "0 2px 8px rgba(5,150,105,.25)",
                        }}
                    >
                        Join Now
                    </a>
                </div>
            )}
        </div>
    );
}

function SectionHead() {
    return (
        <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div
                style={{
                    width: 4, height: 36,
                    background: `linear-gradient(to bottom,${NAVY},${ORANGE})`,
                    borderRadius: 4, flexShrink: 0, marginTop: 2,
                }}
            />
            <div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, color: TH, margin: "0 0 3px" }}>
                    📅 Events
                </h2>
                <p style={{ fontSize: 13, color: TS, margin: 0 }}>
                    View upcoming sessions, register for events, and join meetings.
                </p>
            </div>
        </div>
    );
}

export default function AlumniEvents({ search = "", hideHeader = false }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const res = await API.get("/alumni/events", { params: { page: 1, limit: 9, search } });
                setEvents(res.data.events || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [search]);

    const handleRegister = async (id) => {
        try {
            const res = await API.post(`/alumni/events/${id}/register`);
            toast.success(res.data.message || "Registered successfully!");
            setEvents(events.map((e) => (e._id === id ? { ...e, ...res.data.event } : e)));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Registration failed.");
        }
    };

    const handleUnregister = async (id) => {
        try {
            const res = await API.post(`/alumni/events/${id}/unregister`);
            toast.success(res.data.message || "Unregistered successfully.");
            setEvents(events.map((e) => (e._id === id ? { ...e, ...res.data.event } : e)));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to unregister.");
        }
    };

    return (
        <>
            <style>{`
        @keyframes fu    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .ev-list { display: flex; flex-direction: column; gap: 11px; }
        .ev-date { width: 78px; padding: 18px 0; }
        @media (max-width: 540px) { .ev-date { width: 62px; padding: 13px 0; } }
      `}</style>

            {!hideHeader && <SectionHead />}

            {loading && (
                <div className="ev-list">
                    {[...Array(3)].map((_, i) => (
                        <EventSkeleton key={i} i={i} />
                    ))}
                </div>
            )}

            {!loading && error && (
                <div style={{ padding: 20, textAlign: "center", color: TB }}>
                    <p>⚠️ Unable to load events: {error}</p>
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: TB }}>
                    <p>{search ? "No events match your search." : "No events available yet. Check back soon!"}</p>
                </div>
            )}

            {!loading && !error && events.length > 0 && (
                <div className="ev-list">
                    {events.map((ev, i) => (
                        <EventCard
                            key={ev._id || i}
                            ev={ev}
                            i={i}
                            onRegister={handleRegister}
                            onUnregister={handleUnregister}
                        />
                    ))}
                </div>
            )}
        </>
    );
}