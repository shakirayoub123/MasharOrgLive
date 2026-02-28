import { useState, useEffect, useRef } from "react";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ─── EVENT TYPES ──────────────────────────────────────────────────────────────
const EVENT_TYPES = [
    {
        id: "coach-to-coach",
        label: "Coach-to-Coach Experience",
        icon: "🤝",
        color: "#F38900",
        bg: "#FFF4E0",
        border: "#FFE4B0",
        subtitle: "A reflective exchange between practitioners",
        description:
            "A facilitated session where coaches explore real practice questions together. The experience may include short provocations, paired or small-group dialogue, and collective reflection designed to deepen insight through peer learning rather than instruction.",
        details: ["Reflection", "Peer learning", "Professional maturity"],
    },
    {
        id: "hot-seat",
        label: "Hot Seat Sessions",
        icon: "🔥",
        color: "#E53E3E",
        bg: "#FFF5F5",
        border: "#FED7D7",
        subtitle: "Live coaching with collective insight",
        description:
            "One participant brings a real professional or coaching challenge and receives live coaching. The wider group observes and then reflects together, using a shared coaching or supervision framework.",
        details: ["Applied learning", "Observation", "Reflective feedback", "Practical Insight"],
    },
    {
        id: "peer-coaching",
        label: "Peer Coaching Circles",
        icon: "⭕",
        color: "#0F1C80",
        bg: "#EEF0FF",
        border: "#DDE0FF",
        subtitle: "Small groups. Shared accountability.",
        description:
            "A small, consistent group of alumni meet in structured coaching rounds. Each participant both gives and receives coaching, building trust, consistency, and accountability over time.",
        details: ["Ongoing development", "Practice", "Connection", "Accountability"],
    },
    {
        id: "webinar",
        label: "Webinars",
        icon: "🎙️",
        color: "#6B46C1",
        bg: "#FAF5FF",
        border: "#E9D8FD",
        subtitle: "Focused insights from experienced voices",
        description:
            "Short, focused sessions led by experienced coaches, mentors, or invited guests. Webinars may include a live Q&A or reflective prompt but remain insight-driven rather than training-based.",
        details: ["Thought leadership", "Exposure", "Inspiration", "Broader perspective"],
    },
    {
        id: "guidelines",
        label: "Events Guidelines",
        subtitle: "Event Formats & Participation Guidelines",
        icon: "📋",
        color: "#2D8A4E",
        bg: "#F0FFF4",
        border: "#C6F6D5",
        isGuidelines: true,
        description:
            "Mashar events are designed as professional, reflective learning spaces. To support trust, ethical practice, and meaningful engagement, the following guidelines apply across all alumni events.",
        guidelines: [
            {
                title: "Event Formats",
                icon: "🎭",
                desc: "Mashar alumni events may include live, recorded, or pre-recorded learning experiences.",
                points: [
                    { label: "Live sessions with participants", desc: "Real-time engagement through discussion, reflection, or coaching." },
                    { label: "Pre-recorded sessions (no live audience)", desc: "Selected content may be recorded in advance and shared for learning purposes." },
                    { label: "Live sessions that are recorded", desc: "When recording applies, this is clearly communicated in advance and governed by consent and confidentiality guidelines." },
                ],
                note: "Access details (e.g., Zoom links or venue information) are shared prior to each event.",
            },
            {
                title: "Recording & Use of Content",
                icon: "📼",
                desc: "Recording and content use are always communicated clearly to protect confidentiality, consent, and the integrity of the learning experience.",
                points: [
                    "Recording status is always communicated before the event",
                    "Participant-led recording, screenshots, or redistribution of content is not permitted",
                    "Recorded content is used for learning and internal community purposes only",
                    "Sessions involving live coaching or sensitive cases are handled with additional care and consent",
                ],
            },
            {
                title: "Confidentiality & Professional Conduct",
                icon: "⚖️",
                desc: "Mashar alumni events are built on confidentiality, ethical practice, professional respect, and shared trust.",
                points: [
                    "Events involving reflective practice, coaching, or supervision are treated as confidential professional spaces",
                    "Participants are expected to respect confidentiality, ethical boundaries, and shared trust",
                    "Professional conduct aligned with Mashar values and ICF / EMCC ethical standards is always expected",
                ],
            },
            {
                title: "Platform & Access",
                icon: "📡",
                desc: "Event access details and joining instructions are shared in advance to support a smooth and focused experience.",
                points: [
                    "Online events are typically hosted via Zoom",
                    "Joining instructions and technical details are shared ahead of each session",
                    "Participants are encouraged to join from a private, interruption-free environment when possible",
                ],
            },
        ],
    },
];

// ─── BRAND CONSTANTS ──────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";

// ─── SHARED CARD STYLE (left gradient border) ─────────────────────────────────
const cardStyle = {
    background: "#FFFFFF",
    borderRadius: 16,
    border: `1px solid #E2E8F0`,
    borderLeft: `4px solid transparent`,
    backgroundImage: `linear-gradient(white, white), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
    backgroundOrigin: `border-box`,
    backgroundClip: `padding-box, border-box`,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(15,28,128,.05)",
};

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS = {
    pending: { label: "Request Sent", color: "#F38900", bg: "#FFF4E0", border: "#FFE4B0", icon: "⏳", sub: "Admin will contact you to schedule." },
    approved: { label: "Confirmed!", color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5", icon: "✅", sub: "Check your email for session details." },
    rejected: { label: "Not Available", color: "#E53E3E", bg: "#FFF5F5", border: "#FED7D7", icon: "❌", sub: "Admin was unable to fulfil this request. You may request again." },
};

// ─── GUIDELINE CARD ───────────────────────────────────────────────────────────
function GuidelineCard({ item, index }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                ...cardStyle,
                animation: "cardIn 0.32s ease both",
                animationDelay: `${index * 0.07}s`,
            }}
        >
            <div className="px-5 py-5 flex flex-col gap-4">
                {/* Icon + title row */}
                <div className="flex items-start gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 border transition-all duration-200"
                        style={expanded
                            ? { background: "#2D8A4E", borderColor: "#2D8A4E" }
                            : { background: "#F0FFF4", borderColor: "#C6F6D5" }
                        }
                    >
                        <span style={expanded ? { filter: "brightness(0) invert(1)" } : {}}>{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-black text-[#0D1240] text-sm leading-snug">{item.title}</p>
                            <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 px-2 py-0.5 rounded-full border"
                                style={{ color: "#2D8A4E", background: "#F0FFF4", borderColor: "#C6F6D5" }}>
                                Guideline
                            </span>
                        </div>
                        <p className="text-[12px] text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                </div>

                {expanded && (
                    <div className="flex flex-col gap-2 pt-1">
                        {item.title === "Event Formats" ? (
                            <>
                                {item.points.map((row, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="w-[3px] rounded-full shrink-0 self-stretch" style={{ background: "#C6F6D5" }} />
                                        <div>
                                            <p className="text-[11px] font-black text-[#0D1240] mb-0.5">{row.label}</p>
                                            <p className="text-[11px] text-gray-400 leading-relaxed">{row.desc}</p>
                                        </div>
                                    </div>
                                ))}
                                {item.note && (
                                    <div className="flex items-start gap-2 p-3 rounded-xl border"
                                        style={{ background: "#F0FFF4", borderColor: "#C6F6D5" }}>
                                        <span className="text-[11px] mt-0.5">📍</span>
                                        <p className="text-[11px] font-semibold text-[#2D8A4E] leading-relaxed">{item.note}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            item.points.map((point, i) => (
                                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                                            <path d="M1 4l3 3 5-6" stroke="#2D8A4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-[11.5px] font-medium text-slate-600 leading-relaxed">{point}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="h-px bg-slate-100 -mx-5" />
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all"
                        style={{ color: "#2D8A4E" }}
                    >
                        {expanded ? "Show less" : "View details"}
                        <svg
                            width="12" height="12" viewBox="0 0 12 12" fill="none"
                            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s" }}
                        >
                            <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {expanded && (
                        <span className="text-[9px] text-slate-300 italic font-semibold">Mashar Standard</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── PARTICIPATION NOTICE ─────────────────────────────────────────────────────
function ParticipationNotice() {
    return (
        <div style={{ ...cardStyle, animation: "cardIn 0.32s ease both", animationDelay: "0.3s" }}>
            <div className="px-5 py-5 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                        style={{ background: "#F0FFF4", borderColor: "#C6F6D5" }}>
                        🤝
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold mb-0.5" style={{ color: "#2D8A4E" }}>Mashar Ethical Standard</p>
                        <p className="font-black text-[#0D1240] text-base leading-snug mb-1">Participation Agreement</p>
                        <p className="text-[12.5px] text-gray-500 leading-relaxed">
                            By registering for or attending a Mashar alumni event, participants agree to engage with respect, ethical awareness, and reflective presence.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl p-4 flex flex-wrap gap-2"
                    style={{ background: "#F0FFF4", border: "1px solid #C6F6D5" }}>
                    <p className="text-[9px] font-black uppercase tracking-widest w-full mb-1"
                        style={{ color: "#2D8A4E", opacity: 0.7 }}>Core Values</p>
                    {["Respect", "Ethical awareness", "Reflective presence", "Responsibility toward the learning space"].map(tag => (
                        <div key={tag} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#2D8A4E" }} />
                            <span className="text-xs text-gray-600 font-medium">{tag}</span>
                        </div>
                    ))}
                </div>

                <div className="h-px bg-slate-100 -mx-5" />

                <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] italic text-slate-400 leading-relaxed">
                        "Mashar events are not performances. They are shared professional experiences shaped by those who participate."
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#2D8A4E" }}>Join professionally</span>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs border"
                            style={{ background: "#F0FFF4", borderColor: "#C6F6D5" }}>✨</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── REQUEST CARD ─────────────────────────────────────────────────────────────
function RequestCard({ evt, request, onRequest, requesting }) {
    const s = request ? STATUS[request.status] : null;
    const canRequest = !request || request.status === "rejected";

    return (
        <div style={cardStyle}>
            <div className="px-5 py-5 flex flex-col gap-5">
                <div className="flex items-start gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                        style={{ background: evt.bg, borderColor: evt.border }}
                    >
                        {evt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold mb-0.5" style={{ color: evt.color }}>{evt.subtitle}</p>
                        <p className="font-black text-[#0D1240] text-base leading-snug mb-1">{evt.label}</p>
                        <p className="text-[12.5px] text-gray-500 leading-relaxed">{evt.description}</p>
                    </div>
                </div>

                <div
                    className="rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
                    style={{ background: evt.bg, border: `1px solid ${evt.border}` }}
                >
                    <p className="text-[9px] font-black uppercase tracking-widest col-span-full mb-1"
                        style={{ color: evt.color, opacity: 0.7 }}>Best For</p>
                    {evt.details.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: evt.color }} />
                            <span className="text-xs text-gray-600 font-medium">{d}</span>
                        </div>
                    ))}
                </div>

                <div className="h-px bg-slate-100 -mx-5" />

                {s && !canRequest ? (
                    <div
                        className="rounded-xl p-4 flex items-center gap-3"
                        style={{ background: s.bg, border: `1px solid ${s.border}` }}
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-2"
                            style={{ borderColor: s.color, background: "white" }}
                        >
                            {s.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-sm" style={{ color: s.color }}>{s.label}</p>
                            <p className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed">{s.sub}</p>
                            {request.adminNote && (
                                <p className="text-[11px] font-semibold text-gray-600 mt-1 bg-white/70 rounded-lg px-2.5 py-1.5 border border-white">
                                    💬 Admin: {request.adminNote}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {s?.status === "rejected" && (
                            <p className="text-[11px] text-center font-semibold" style={{ color: STATUS.rejected.color }}>
                                Previous request was not fulfilled — you can request again below.
                            </p>
                        )}
                        {/* CTA — always orange */}
                        <button
                            onClick={onRequest}
                            disabled={requesting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all duration-200 relative overflow-hidden"
                            style={{
                                background: requesting ? `${ORANGE}88` : ORANGE,
                                color: "#fff",
                                boxShadow: requesting ? "none" : `0 6px 18px ${ORANGE}44`,
                                cursor: requesting ? "not-allowed" : "pointer",
                            }}
                        >
                            {!requesting && <span className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-white/20" />}
                            {requesting
                                ? <><svg style={{ width: 14, height: 14, animation: "spin 0.85s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Sending Request…</>
                                : <><span className="text-base">📩</span><span className="ml-0.5">Request Your Spot</span></>
                            }
                        </button>
                        <p className="text-[10px] text-center text-gray-400 italic">
                            Our team will contact you to discuss details. No form is needed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── LEFT SIDEBAR ─────────────────────────────────────────────────────────────
function EventsSidebar({ active, setActive, requests }) {
    return (
        <div className="bg-white rounded-2xl border border-[#DDE0FF] p-2.5 shadow-sm">
            <div className="flex items-center gap-2 px-2.5 pt-1 pb-2.5 border-b border-[#EEF0FF] mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg,#F38900,#d67600)", boxShadow: "0 3px 8px rgba(243,137,0,0.28)" }}>
                    📅
                </div>
                <div>
                    <p className="text-[11px] font-black text-[#0D1240] leading-none">Events</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">{EVENT_TYPES.length} event types</p>
                </div>
            </div>

            <p className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px] px-2.5 py-1.5 opacity-50">Event Types</p>

            {EVENT_TYPES.map(evt => {
                const isActive = active === evt.id;
                const req = !evt.isGuidelines && requests[evt.id];
                return (
                    <button key={evt.id} onClick={() => setActive(evt.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium text-left mb-0.5 transition-all ${isActive ? "font-bold" : "text-gray-500 hover:bg-[#EEF0FF] hover:text-[#0D1240]"}`}
                        style={isActive ? { background: evt.bg, color: evt.color, borderLeft: `3px solid ${evt.color}`, paddingLeft: "9px" } : {}}
                    >
                        <span className="text-base shrink-0">{evt.icon}</span>
                        <span className="flex-1 leading-snug">{evt.label}</span>
                        {req && (
                            <span className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: STATUS[req.status]?.color || "#9CA3AF" }} />
                        )}
                    </button>
                );
            })}

            <div className="h-px bg-[#DDE0FF] my-2 mx-1" />
            <div className="px-2.5 pb-1">
                <p className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px] opacity-50 mb-2">My Requests</p>
                {[
                    { l: "Pending", v: Object.values(requests).filter(r => r.status === "pending").length, c: "#F38900" },
                    { l: "Confirmed", v: Object.values(requests).filter(r => r.status === "approved").length, c: "#2D8A4E" },
                    { l: "Rejected", v: Object.values(requests).filter(r => r.status === "rejected").length, c: "#E53E3E" },
                ].map(({ l, v, c }) => (
                    <div key={l} className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-400">{l}</span>
                        <span className="text-xs font-black" style={{ color: v > 0 ? c : "#D1D5DB" }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── BANNER ───────────────────────────────────────────────────────────────────
function EventsBanner({ requestCount }) {
    return (
        <div className="relative rounded-2xl overflow-hidden mb-4"
            style={{
                border: `1px solid #DDE0FF`,
                borderLeft: `4px solid transparent`,
                backgroundImage: `linear-gradient(135deg, #EEF0FF 0%, #E5E8FF 55%, #FFF4E0 100%), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
                backgroundOrigin: `border-box`,
                backgroundClip: `padding-box, border-box`,
            }}>
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border-2 border-[#0F1C80]/5 pointer-events-none" />
            <div className="absolute right-14 -bottom-8 w-28 h-28 rounded-full bg-[#F38900]/5 pointer-events-none" />

            <div className="relative flex items-center justify-between gap-4 px-7 py-6">
                <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 bg-[#0F1C80]/8 border border-[#0F1C80]/15 rounded-full px-3 py-1 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F1C80]" />
                        <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px]">Mashar Alumni Events</span>
                    </div>
                    <h1 className="font-black text-[#0D1240] text-2xl leading-tight mb-2">
                        Show Up. Practice. Grow Together.
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xl mb-4 hidden sm:block">
                        Join interactive alumni experiences designed to strengthen your coaching through real practice,
                        shared reflection, and meaningful exchange with peers.
                    </p>
                    <div className="flex gap-5 flex-wrap">
                        {[
                            { n: EVENT_TYPES.filter(e => !e.isGuidelines).length, l: "Event Types" },
                            { n: requestCount, l: "My Requests" },
                        ].map(({ n, l }) => (
                            <div key={l}>
                                <p className="text-xl font-black text-[#0F1C80] leading-none">{n}</p>
                                <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right card — navy button */}
                <div className="hidden md:flex shrink-0 flex-col items-center text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-[#DDE0FF] p-4 w-44">
                    <span className="text-2xl mb-1.5">🛎️</span>
                    <p className="text-xs font-black text-[#0D1240] mb-1 leading-tight">One tap to join</p>
                    <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">No forms. Just request — admin handles the rest.</p>
                    <div className="w-full py-2 rounded-xl text-xs font-black text-white text-center"
                        style={{ background: NAVY, boxShadow: "0 4px 14px rgba(15,28,128,.2)" }}>
                        4 Event Types
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function EventsSection() {
    const { user } = useAuth();
    const [activeId, setActiveId] = useState(EVENT_TYPES[0].id);
    const [requests, setRequests] = useState({});
    const [requesting, setRequesting] = useState(false);
    const contentRef = useRef(null);

    const activeEvent = EVENT_TYPES.find(e => e.id === activeId);

    useEffect(() => {
        API.get("/alumni/events/my-requests")
            .then(r => {
                const map = {};
                (r.data.data || []).forEach(req => { map[req.eventTypeId] = req; });
                setRequests(map);
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
    }, [activeId]);

    async function handleRequest() {
        if (!user) return;
        setRequesting(true);
        try {
            const res = await API.post("/alumni/events/request", {
                eventTypeId: activeId,
                eventLabel: activeEvent.label,
            });
            setRequests(prev => ({ ...prev, [activeId]: res.data.data }));
            toast.success("Request sent! Admin will contact you to schedule.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send request.");
        } finally {
            setRequesting(false);
        }
    }

    const requestCount = Object.keys(requests).length;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .evroot * { font-family: 'DM Sans', sans-serif; }
        .evroot h1 { font-family: 'Sora', sans-serif; }
        @keyframes cardIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes panelIn { from{opacity:0;transform:translateX(6px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .evside::-webkit-scrollbar{width:3px}
        .evside::-webkit-scrollbar-thumb{background:#DDE0FF;border-radius:4px}
      `}</style>

            <div className="evroot w-full max-w-full overflow-x-hidden">

                <EventsBanner requestCount={requestCount} />

                {/* Mobile tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3 lg:hidden" style={{ scrollbarWidth: "none" }}>
                    {EVENT_TYPES.map(e => (
                        <button key={e.id} onClick={() => setActiveId(e.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 border transition-all"
                            style={activeId === e.id
                                ? { background: ORANGE, color: "#fff", borderColor: ORANGE }
                                : { background: "#fff", color: "#6B7280", borderColor: "#DDE0FF" }
                            }
                        >
                            <span>{e.icon}</span>
                            <span className="hidden sm:inline">{e.label}</span>
                        </button>
                    ))}
                </div>

                {/* 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 items-start">

                    {/* Sticky sidebar */}
                    <div className="hidden lg:block sticky top-4 evside" style={{ maxHeight: "calc(100vh - 110px)", overflowY: "auto" }}>
                        <EventsSidebar active={activeId} setActive={setActiveId} requests={requests} />
                    </div>

                    {/* Main */}
                    <div className="min-w-0" ref={contentRef}>
                        {activeEvent && (
                            <div key={activeId} style={{ animation: "panelIn 0.28s ease" }}>

                                {/* Header row */}
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                                                style={{ color: activeEvent.color, background: activeEvent.bg, borderColor: activeEvent.border }}>
                                                {activeEvent.icon} Events
                                            </span>
                                            <svg width="12" height="12" fill="none" viewBox="0 0 12 12" className="text-gray-300">
                                                <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>

                                    {!activeEvent.isGuidelines && requests[activeId] && (() => {
                                        const s = STATUS[requests[activeId].status];
                                        return (
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border shrink-0"
                                                style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                                {s.icon} {s.label}
                                            </span>
                                        );
                                    })()}
                                </div>

                                {/* Guidelines panel */}
                                {activeEvent.isGuidelines ? (
                                    <div className="flex flex-col gap-3">
                                        <div style={cardStyle}>
                                            <div className="px-5 py-5 flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                                                    style={{ background: "#F0FFF4", borderColor: "#C6F6D5" }}>
                                                    📋
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-bold mb-0.5" style={{ color: "#2D8A4E" }}>
                                                        {activeEvent.subtitle}
                                                    </p>
                                                    <p className="font-black text-[#0D1240] text-base leading-snug mb-1">Events Guidelines</p>
                                                    <p className="text-[12.5px] text-gray-500 leading-relaxed">{activeEvent.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {activeEvent.guidelines.map((g, i) => (
                                                <GuidelineCard key={i} item={g} index={i} />
                                            ))}
                                        </div>

                                        <ParticipationNotice />
                                    </div>
                                ) : (
                                    <RequestCard
                                        evt={activeEvent}
                                        request={requests[activeId]}
                                        onRequest={handleRequest}
                                        requesting={requesting}
                                    />
                                )}

                                {/* Mobile sidebar */}
                                <div className="mt-4 lg:hidden">
                                    <EventsSidebar active={activeId} setActive={setActiveId} requests={requests} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}