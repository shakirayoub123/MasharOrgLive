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
const GREEN_50 = "#ECFDF5";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
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

// ─── PLATFORM BADGE ───────────────────────────────────────────────────────────
function PlatformBadge({ platform }) {
    if (!platform) return null;
    const isZoom = platform === "zoom";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            fontSize: 10, fontWeight: 800,
            background: isZoom ? "#EBF5FF" : "#E6FAF5",
            color: isZoom ? "#2563EB" : "#059669",
        }}>
            🎥 {isZoom ? "Zoom" : "Google Meet"}
        </span>
    );
}

// ─── EVENT DETAIL MODAL ───────────────────────────────────────────────────────
function EventDetail({ ev, onClose, onRegister, onUnregister, registering }) {
    const pct = ev.capacity > 0 ? Math.round((ev.registeredCount / ev.capacity) * 100) : 0;
    const isPast = isEventPast(ev.eventDate);
    const canJoin = ev.isRegistered && isEventDay(ev.eventDate);
    const isFull = ev.registeredCount >= ev.capacity;

    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,28,128,.15)", zIndex: 300, backdropFilter: "blur(6px)" }} />
            <div style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: "min(510px,93vw)", background: CARD, borderRadius: 16, zIndex: 301,
                boxShadow: "0 10px 40px rgba(15,28,128,.12)", overflow: "hidden",
                animation: "popIn .22s ease", border: `1px solid ${NAVY_100}`,
            }}>
                <div style={{ height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${NAVY_100}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ marginBottom: 8 }}>
                                <PlatformBadge platform={ev.platform} />
                            </div>
                            <h2 style={{ fontSize: 16, fontWeight: 800, color: TH, lineHeight: 1.3, margin: "0 0 6px" }}>{ev.eventName}</h2>
                            <p style={{ fontSize: 12, color: TS, margin: 0 }}>📍 {ev.location}</p>
                        </div>
                        <button onClick={onClose} style={{ width: 30, height: 30, minWidth: 30, borderRadius: "50%", border: "none", background: NAVY_50, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: NAVY }}>✕</button>
                    </div>
                </div>
                <div style={{ padding: "20px 24px", maxHeight: "60vh", overflowY: "auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        {[
                            { l: "Date", v: new Date(ev.eventDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) },
                            { l: "Time", v: ev.eventTime || "TBD" },
                            { l: "Location", v: ev.location },
                            { l: "Host", v: ev.host || "TBD" },
                        ].map(({ l, v }) => (
                            <div key={l} style={{ background: NAVY_50, borderRadius: 10, padding: "10px 12px", border: `1px solid ${NAVY_100}` }}>
                                <div style={{ fontSize: 9.5, fontWeight: 700, color: TS, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{l}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: TH }}>{v}</div>
                            </div>
                        ))}
                    </div>
                    {ev.description && <p style={{ fontSize: 13, color: TB, lineHeight: 1.65, marginBottom: 16 }}>{ev.description}</p>}
                    <div style={{ marginBottom: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: TS }}>Registrations</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: pct > 80 ? ORANGE : NAVY }}>{ev.registeredCount}/{ev.capacity}</span>
                        </div>
                        <div style={{ height: 5, background: NAVY_100, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? ORANGE : NAVY, borderRadius: 4, transition: "width .4s ease" }} />
                        </div>
                    </div>

                    {/* Join Meeting Button — only when registered AND event is today or past */}
                    {canJoin && (
                        <a
                            href={ev.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                width: "100%", padding: 12, borderRadius: 10, border: "none",
                                background: `linear-gradient(135deg, ${GREEN}, #047857)`,
                                color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                                boxShadow: `0 4px 14px rgba(5,150,105,.25)`, transition: "opacity .2s",
                                textDecoration: "none", marginBottom: 10,
                            }}
                        >
                            🚀 Join {ev.platform === "zoom" ? "Zoom" : "Google Meet"} Now
                        </a>
                    )}

                    {/* Register / Unregister button */}
                    {ev.isRegistered ? (
                        <div style={{ display: "flex", gap: 8 }}>
                            <div style={{
                                flex: 1, padding: 12, borderRadius: 10, border: `2px solid ${isPast ? "#CBD5E1" : GREEN}`,
                                background: isPast ? "#F8FAFC" : GREEN_50, color: isPast ? "#64748B" : GREEN,
                                fontSize: 13, fontWeight: 700, textAlign: "center",
                            }}>
                                {isPast ? "✓ Attended" : "✓ Registered"}
                            </div>
                            {!isPast && (
                                <button
                                    onClick={() => onUnregister(ev._id)}
                                    disabled={registering}
                                    style={{
                                        padding: "12px 18px", borderRadius: 10, border: `1px solid #FCA5A5`,
                                        background: "#FEF2F2", color: "#DC2626",
                                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                                        opacity: registering ? 0.6 : 1,
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => onRegister(ev._id)}
                            disabled={registering || isFull || isEventPast(ev.eventDate)}
                            style={{
                                width: "100%", padding: 12, borderRadius: 10, border: "none",
                                background: isEventPast(ev.eventDate) || isFull
                                    ? "#CBD5E1"
                                    : `linear-gradient(135deg,${NAVY},#1A2EA0)`,
                                color: "#fff", fontSize: 13, fontWeight: 700,
                                cursor: isEventPast(ev.eventDate) || isFull ? "not-allowed" : "pointer",
                                boxShadow: isEventPast(ev.eventDate) || isFull ? "none" : `0 4px 14px rgba(15,28,128,.22)`,
                                transition: "opacity .2s",
                                opacity: registering ? 0.6 : 1,
                            }}
                        >
                            {isEventPast(ev.eventDate) ? "Event Ended" : isFull ? "Event Full" : registering ? "Registering…" : "Register for Event →"}
                        </button>
                    )}

                    {!ev.isRegistered && !isFull && !isPast && (
                        <p style={{ fontSize: 11, color: TS, textAlign: "center", marginTop: 8 }}>
                            You'll receive a confirmation email with the meeting link
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── EVENT CARD ───────────────────────────────────────────────────────────────
function EventCard({ ev, onSelect, index }) {
    const [hov, setHov] = useState(false);
    const dateObj = new Date(ev.eventDate + "T00:00:00");
    const isToday = isEventDay(ev.eventDate);
    const isPast = isEventPast(ev.eventDate);
    return (
        <div
            onClick={() => onSelect(ev)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: hov ? NAVY_50 : CARD,
                borderRadius: 12,
                border: `1px solid ${hov ? NAVY_100 : "#F0F2FF"}`,
                boxShadow: hov ? "0 4px 16px rgba(15,28,128,.08)" : "0 1px 3px rgba(15,28,128,.04)",
                padding: "13px 14px", cursor: "pointer",
                transition: "all .2s",
                animation: `slideIn .3s ease ${index * 0.05}s both`,
                display: "flex", alignItems: "center", gap: 12,
                opacity: isPast ? 0.6 : 1,
            }}
        >
            <div style={{
                minWidth: 52, padding: "8px 6px", background: hov ? CARD : NAVY_50,
                borderRadius: 8, textAlign: "center", borderLeft: `3px solid ${NAVY}`, flexShrink: 0,
                transition: "background .2s",
            }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: NAVY, letterSpacing: "1px" }}>
                    {MONTHS[dateObj.getMonth()].slice(0, 3).toUpperCase()}
                </div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 900, color: NAVY, lineHeight: 1.1 }}>
                    {dateObj.getDate()}
                </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                    <PlatformBadge platform={ev.platform} />
                    {isToday && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#FEF3C7", color: "#D97706" }}>
                            🔴 Today
                        </span>
                    )}
                    {isPast && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#F1F5F9", color: "#64748B" }}>
                            Expired
                        </span>
                    )}
                    {ev.isRegistered && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: GREEN_50, color: GREEN }}>
                            ✓ Registered
                        </span>
                    )}
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: TH, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ev.eventName}
                </h4>
                <div style={{ fontSize: 11.5, color: TS }}>🕐 {ev.eventTime || "TBD"} · {ev.host || ev.location}</div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>
                    {ev.registeredCount}<span style={{ color: TS, fontWeight: 500 }}>/{ev.capacity}</span>
                </div>
                <div style={{ fontSize: 9.5, color: TS, fontWeight: 500 }}>seats</div>
            </div>
            <span style={{ fontSize: 16, color: hov ? NAVY : NAVY_100, transition: "color .2s", flexShrink: 0 }}>›</span>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProgramCalendar() {
    const today = new Date();
    const [vm, setVm] = useState(today.getMonth());
    const [vy, setVy] = useState(today.getFullYear());
    const [selDay, setSelDay] = useState(null);
    const [selEv, setSelEv] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registering, setRegistering] = useState(false);

    const fetchEvents = () => {
        API.get("/alumni/events")
            .then(res => { setEvents(res.data.events || []); setError(null); })
            .catch(err => { console.error(err); setError("Failed to load events"); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleRegister = async (id) => {
        setRegistering(true);
        try {
            const res = await API.post(`/alumni/events/${id}/register`);
            toast.success(res.data.message || "Registered successfully!");
            // Update the event in state
            setEvents(prev => prev.map(e =>
                e._id === id ? { ...e, ...res.data.event } : e
            ));
            if (selEv && selEv._id === id) {
                setSelEv({ ...selEv, ...res.data.event });
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Registration failed.");
        } finally {
            setRegistering(false);
        }
    };

    const handleUnregister = async (id) => {
        setRegistering(true);
        try {
            const res = await API.post(`/alumni/events/${id}/unregister`);
            toast.success(res.data.message || "Unregistered successfully.");
            setEvents(prev => prev.map(e =>
                e._id === id ? { ...e, ...res.data.event } : e
            ));
            if (selEv && selEv._id === id) {
                setSelEv({ ...selEv, ...res.data.event });
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to unregister.");
        } finally {
            setRegistering(false);
        }
    };

    const firstDay = new Date(vy, vm, 1).getDay();
    const dim = new Date(vy, vm + 1, 0).getDate();
    const prevDim = new Date(vy, vm, 0).getDate();
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: prevDim - i, cur: false });
    for (let d = 1; d <= dim; d++)        cells.push({ d, cur: true });
    while (cells.length % 7 !== 0) cells.push({ d: cells.length - dim - firstDay + 1, cur: false });

    const evOnDay = (d) => events.filter(e => sameDay(new Date(e.eventDate + "T00:00:00"), new Date(vy, vm, d)));
    const prevMonth = () => vm === 0 ? (setVm(11), setVy(y => y - 1)) : setVm(m => m - 1);
    const nextMonth = () => vm === 11 ? (setVm(0), setVy(y => y + 1)) : setVm(m => m + 1);

    const displayedEvents = selDay
        ? evOnDay(selDay)
        : [...events].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
                @keyframes popIn   { from{opacity:0;transform:translate(-50%,-46%)} to{opacity:1;transform:translate(-50%,-50%)} }
                @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

                /* ── single outer card ── */
                .pc-card {
                    background: ${CARD};
                    border-radius: 18px;
                    border: 1px solid ${NAVY_100};
                    box-shadow: 0 2px 12px rgba(15,28,128,.07);
                    overflow: hidden;
                    position: relative;
                }
                .pc-card-inner {
                    padding: 22px 22px 22px 26px;
                }

                .pc-grid  { display:grid; grid-template-columns:270px 1fr; gap:18px; margin-top:18px; }
                .pc-cal   { background:${NAVY_50}; border-radius:14px; border:1px solid ${NAVY_100}; overflow:hidden; height:fit-content; }
                .pc-right { display:flex; flex-direction:column; min-width:0; }
                .pc-events { display:flex; flex-direction:column; gap:8px; overflow-y:auto; max-height:calc(100vh - 340px); padding-right:2px; }
                .pc-events::-webkit-scrollbar       { width:3px; }
                .pc-events::-webkit-scrollbar-thumb { background:${NAVY_100}; border-radius:4px; }
                .pc-empty { text-align:center; padding:40px 20px; background:${NAVY_50}; border-radius:12px; border:1px solid ${NAVY_100}; }

                @media(max-width:1024px) { .pc-grid { grid-template-columns:250px 1fr; gap:14px; } }
                @media(max-width:768px)  { .pc-grid { grid-template-columns:1fr; } .pc-events { max-height:360px; } }
            `}</style>

            <div className="pc-wrap">
                {/* ══ SINGLE OUTER CARD ══ */}
                <div className="pc-card">

                    {/* Gradient left border strip */}
                    <div className="card-side-gradient" />

                    {/* Decorative ring */}
                    <div style={{
                        position: "absolute", right: -20, top: -20, width: 120, height: 120,
                        borderRadius: "50%", border: `2px solid rgba(243,137,0,.08)`, pointerEvents: "none",
                    }} />

                    <div className="pc-card-inner">

                        {/* ── SECTION HEADER ── */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                            <div>
                                <h2 style={{
                                    fontFamily: "'Sora',sans-serif",
                                    fontSize: 17, fontWeight: 900, color: TH,
                                    margin: "0 0 5px", letterSpacing: "-0.2px",
                                    display: "flex", alignItems: "center", gap: 7,
                                }}>
                                    <span>📅</span>
                                    Events &amp; Program Calendar
                                </h2>
                                <p style={{ fontSize: 13, color: TS, margin: 0, lineHeight: 1.55 }}>
                                    View upcoming learning sessions, mentoring activities, alumni events, and key dates. Plan and stay connected to what’s happening across the Mashar ecosystem.
                                </p>
                            </div>
                        </div>

                        {/* ── CALENDAR + EVENTS ── */}
                        <div className="pc-grid">

                            {/* LEFT: Mini calendar */}
                            <div className="pc-cal">
                                <div style={{ background: `linear-gradient(135deg,${NAVY_50},#E5E8FF)`, padding: "14px 12px", borderBottom: `1px solid ${NAVY_100}` }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                        {[prevMonth, nextMonth].map((fn, idx) => (
                                            <button key={idx} onClick={fn} style={{
                                                width: 28, height: 28, borderRadius: "50%",
                                                border: `1px solid ${NAVY_100}`, background: CARD,
                                                color: NAVY, fontSize: 14, cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "all .15s",
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = "#fff"; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = CARD; e.currentTarget.style.color = NAVY; }}
                                            >{idx === 0 ? "‹" : "›"}</button>
                                        ))}
                                        <div style={{ textAlign: "center", flex: 1 }}>
                                            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 900, color: NAVY }}>{MONTHS[vm]}</div>
                                            <div style={{ fontSize: 10, color: TS, fontWeight: 600 }}>{vy}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                                        {DAYS.map(d => (
                                            <div key={d} style={{ textAlign: "center", fontSize: 8.5, fontWeight: 700, color: NAVY, opacity: .5, paddingBottom: 4 }}>{d}</div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ padding: 8 }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                                        {cells.map((cell, i) => {
                                            const dayEvs = cell.cur ? evOnDay(cell.d) : [];
                                            const isTodayCell = cell.cur && sameDay(new Date(vy, vm, cell.d), today);
                                            const isSel = cell.cur && selDay === cell.d;
                                            return (
                                                <div key={i}
                                                    onClick={() => cell.cur && setSelDay(isSel ? null : cell.d)}
                                                    style={{
                                                        height: 34, borderRadius: 6,
                                                        display: "flex", flexDirection: "column",
                                                        alignItems: "center", justifyContent: "center", gap: 1,
                                                        cursor: cell.cur ? "pointer" : "default",
                                                        background: isSel ? NAVY : isTodayCell ? NAVY_100 : "transparent",
                                                        border: `1px solid ${isTodayCell && !isSel ? NAVY_100 : "transparent"}`,
                                                        transition: "all .15s",
                                                        fontSize: 11, fontWeight: isSel ? 700 : 500,
                                                        color: isSel ? "#fff" : isTodayCell ? NAVY : cell.cur ? TH : "#CBD5E1",
                                                    }}
                                                    onMouseEnter={e => { if (cell.cur && !isSel) e.currentTarget.style.background = "#E5E8FF"; }}
                                                    onMouseLeave={e => { if (cell.cur && !isSel) e.currentTarget.style.background = isTodayCell ? NAVY_100 : "transparent"; }}
                                                >
                                                    {cell.d}
                                                    {dayEvs.length > 0 && (
                                                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? "rgba(255,255,255,.8)" : ORANGE }} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div style={{ borderTop: `1px solid ${NAVY_100}`, padding: "8px 12px", display: "flex", gap: 14, flexWrap: "wrap" }}>
                                    {[["Event day", ORANGE], ["Today", NAVY], ["Registered", GREEN]].map(([t, c]) => (
                                        <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: TS, fontWeight: 600 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: Event list */}
                            <div className="pc-right">
                                <div style={{
                                    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                                    marginBottom: 12, paddingBottom: 10,
                                    borderBottom: `2px solid ${ORANGE}`,
                                    flexWrap: "wrap", gap: 8,
                                }}>
                                    <div>
                                        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 900, color: TH, margin: "0 0 2px", letterSpacing: "-0.2px" }}>
                                            {selDay ? `${MONTHS[vm]} ${selDay}` : "All Upcoming Events"}
                                        </h3>
                                        <p style={{ fontSize: 12, color: TS, margin: 0 }}>
                                            {selDay
                                                ? `${displayedEvents.length} event${displayedEvents.length !== 1 ? "s" : ""} on this day`
                                                : `${displayedEvents.length} event${displayedEvents.length !== 1 ? "s" : ""} scheduled`}
                                        </p>
                                    </div>
                                    {selDay && (
                                        <button onClick={() => setSelDay(null)} style={{
                                            fontSize: 11, fontWeight: 700, color: NAVY,
                                            background: NAVY_50, border: `1px solid ${NAVY_100}`,
                                            borderRadius: 20, padding: "4px 12px", cursor: "pointer",
                                        }}>← All Events</button>
                                    )}
                                </div>

                                {loading && (
                                    <div style={{ padding: 40, textAlign: "center", color: TS }}>
                                        <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${NAVY_100}`, borderTop: `2px solid ${NAVY}`, animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>Loading events…</span>
                                    </div>
                                )}
                                {!loading && error && (
                                    <div className="pc-empty">
                                        <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
                                        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, color: TH, marginBottom: 4 }}>Failed to load</div>
                                        <div style={{ fontSize: 12, color: TS }}>{error}</div>
                                    </div>
                                )}
                                {!loading && !error && displayedEvents.length === 0 && (
                                    <div className="pc-empty">
                                        <div style={{ fontSize: 38, marginBottom: 10 }}>📭</div>
                                        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, color: TH, marginBottom: 4 }}>No events found</div>
                                        <div style={{ fontSize: 12, color: TS }}>{selDay ? "Try another date" : "Check back soon!"}</div>
                                    </div>
                                )}
                                {!loading && !error && displayedEvents.length > 0 && (
                                    <div className="pc-events">
                                        {displayedEvents.map((ev, idx) => (
                                            <EventCard key={ev._id} ev={ev} onSelect={setSelEv} index={idx} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selEv && (
                <EventDetail
                    ev={selEv}
                    onClose={() => setSelEv(null)}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    registering={registering}
                />
            )}
        </>
    );
}