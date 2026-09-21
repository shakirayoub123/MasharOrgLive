import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Clock, MapPin, X, Users, Loader2, ChevronLeft, ChevronRight, ChevronDown,
    Search, ArrowRight, ArrowRightCircle, Globe, Award, BarChart, Calendar as CalendarIcon, AlignJustify, Plus
} from "lucide-react";
import { resolveAssetUrl } from "../utils/baseUrl";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/heroEvents.jpg";
import SEO from "./SEO";

/* ─── CONSTANTS ─── */
const NAVY = "#0f1c80";
const BLUE = "#1a56db";
const ORANGE = "#f38900";

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── HELPERS ─── */
const parseDate = (d) => new Date(d);
const formatDateFull = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};
const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
};
const sameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const eventOnDay = (ev, dayDate) => sameDay(parseDate(ev.eventDate), dayDate);

const inferTypeStyle = (eventName) => {
    const title = (eventName || "").toLowerCase();
    if (title.includes("webinar")) return { type: "Webinar", dot: "#22c55e", bg: "#dcfce7", fg: "#15803d" };
    if (title.includes("networking") || title.includes("meet")) return { type: "Networking", dot: "#f97316", bg: "#ffedd5", fg: "#c2410c" };
    if (title.includes("workshop")) return { type: "Workshop", dot: "#a855f7", bg: "#f3e8ff", fg: "#7e22ce" };
    if (title.includes("reunion")) return { type: "Reunion", dot: "#ef4444", bg: "#fee2e2", fg: "#b91c1c" };
    return { type: "Alumni Talk", dot: "#1a56db", bg: "#eff6ff", fg: "#1d4ed8" }; // Default 
};

/* ─── Register Modal ─── */
const RegisterModal = ({ event, onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", org: "", note: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!event) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await axios.post(`/api/public/events/${event._id}/register`, {
                name: form.name, email: form.email, organisation: form.org, note: form.note
            });
            setSubmitted(true);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const imgSrc = resolveAssetUrl(event.image);

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 h-[100vh] overflow-y-auto" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm fixed" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start px-6 py-5" style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})` }}>
                    <div className="flex gap-4 items-start">
                        {imgSrc && (
                            <img src={imgSrc} alt={event.eventName} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border-2 border-white/20" />
                        )}
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: ORANGE }}>{event.location}</div>
                            <h3 className="text-white font-bold text-[15px] leading-snug pr-4 font-spartan">{event.eventName}</h3>
                            <div className="mt-2 flex items-center gap-3 text-white/70 text-[12px]">
                                <span className="flex items-center gap-1">{formatDateFull(event.eventDate)}</span>
                                <span className="flex items-center gap-1"><Clock size={12} />{formatTime(event.eventTime)}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white mt-0.5 flex-shrink-0">
                        <X size={20} />
                    </button>
                </div>
                <div className="px-6 py-5">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            <h4 className="text-xl font-bold text-[#0f1c80] mb-2 font-spartan">Registration Received!</h4>
                            <p className="text-gray-500 text-sm">We'll be in touch within 24 hours to confirm your place.</p>
                            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: BLUE }}>Close</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3 font-poppins">
                            <input required type="text" placeholder="Full Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:border-[#0f1c80]" />
                            <input required type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:border-[#0f1c80]" />
                            <input type="text" placeholder="Organisation" value={form.org} onChange={e => setForm(p => ({ ...p, org: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:border-[#0f1c80]" />
                            <textarea rows={2} placeholder="Any questions or notes" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:border-[#0f1c80] resize-none" />
                            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[12px] font-medium border border-red-100">{error}</div>}
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[12px] text-gray-400 flex items-center gap-1">
                                    <Users size={12} /> <span className="font-semibold text-gray-600 ml-1">{Math.max(0, event.capacity - (event.totalRegistered || 0))}</span> seats remaining
                                </span>
                                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed" style={{ background: BLUE }}>
                                    {loading ? "Registering..." : "Register Now"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── MAIN COMPONENT ─── */
const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ event: null });
    const [hoveredEvent, setHoveredEvent] = useState(null); // Keep track for UI active state

    const now = new Date();
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [selectedDayEvents, setSelectedDayEvents] = useState(null);
    const [viewMode, setViewMode] = useState("calendar"); // calendar | list

    // Also track selected filters (mocked for UI accuracy)
    const [filterCategory, setFilterCategory] = useState("All Events");
    const [filterLocation, setFilterLocation] = useState("All Locations");
    const [searchQuery, setSearchQuery] = useState("");

    const handleSyncCalendar = (ev) => {
        if (!ev) return;
        const d = new Date(ev.eventDate);
        const dateStr = d.toISOString().replace(/-|:|\.\d+/g, "");
        const endD = new Date(d.getTime() + 2 * 60 * 60 * 1000); // 2 hrs diff
        const endStr = endD.toISOString().replace(/-|:|\.\d+/g, "");
        const getICSData = () => `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${dateStr}\nDTEND:${endStr}\nSUMMARY:${ev.eventName}\nDESCRIPTION:${ev.description || ''}\nLOCATION:${ev.location}\nEND:VEVENT\nEND:VCALENDAR`;

        const blob = new Blob([getICSData()], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", `${(ev.eventName || "event").replace(/\s/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await axios.get("/api/public/events");
                setEvents(data.events || []);
            } catch (err) {
                setError("Could not load events.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // Calendar Math - Includes trailing/leading buffer days for the 6-row grid
    const getCalendarDays = () => {
        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

        let days = [];

        // Prev month days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ dayNum: prevMonthDays - i, isCurrentMonth: false, date: new Date(viewYear, viewMonth - 1, prevMonthDays - i) });
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            days.push({ dayNum: d, isCurrentMonth: true, date: new Date(viewYear, viewMonth, d) });
        }

        // Next month days (fill out exactly 5 or 6 rows)
        const totalRows = Math.ceil(days.length / 7);
        const nextMonthNeeded = (totalRows * 7) - days.length;
        for (let i = 1; i <= nextMonthNeeded; i++) {
            days.push({ dayNum: i, isCurrentMonth: false, date: new Date(viewYear, viewMonth + 1, i) });
        }

        return days;
    };

    const calendarCells = getCalendarDays();

    // Upcoming events for the sidebar (up to 3 or 4)
    const upcomingSidebarEvents = events
        .filter(e => {
            if (selectedDayEvents) return sameDay(parseDate(e.eventDate), selectedDayEvents);
            return parseDate(e.eventDate) >= new Date().setHours(0, 0, 0, 0);
        })
        .filter(e => {
            // Apply mock filters quickly
            if (filterCategory !== "All Events" && !e.eventName.toLowerCase().includes(filterCategory.toLowerCase())) return false;
            if (filterLocation !== "All Locations" && !e.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
            if (searchQuery && !e.eventName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => parseDate(a.eventDate) - parseDate(b.eventDate))
        .slice(0, 5); // showing limited amount for standard look

    // Determine featured element for the right pane
    const featuredEvent = events.find(e => e._id === hoveredEvent) || upcomingSidebarEvents[0] || events[0];

    return (
        <div className="bg-[#fbfcff] font-poppins min-h-screen pb-12">
            <SEO
                title="Events & Seminars | Mashar"
                description="Join our global calendar of events, workshops, networking seminars, and coaching cohorts to elevate your leadership journey."
            />

            {/* HERO SECTION */}
            <header className="relative w-full h-[250px] lg:h-[350px] flex flex-col justify-center items-center overflow-hidden animate-in fade-in duration-[1000ms]">
                <img src={heroImg} className="absolute inset-0 w-full h-full object-cover animate-in zoom-in-110 duration-[3000ms] ease-out" alt="Events Calendar" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                <h1 className="relative z-10 text-white text-3xl sm:text-4xl lg:text-[42px] font-bold uppercase tracking-widest font-spartan animate-in slide-in-from-bottom-8 fade-in flex items-center gap-4 duration-1000 delay-300 fill-mode-both">
                    EVENTS CALENDAR
                </h1>
            </header>

            {/* MAIN APP CONTENT */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 mt-4">

                {/* TOP TOOLBAR */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
                    {/* Left: View Toggles */}
                    <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                        <button onClick={() => setViewMode("calendar")} className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-[13px] font-bold shadow-sm transition-all ${viewMode === 'calendar' ? 'bg-[#0f1c80] text-white' : 'text-gray-500 hover:text-[#0f1c80] hover:bg-gray-100'}`}>
                            <CalendarIcon size={14} /> Calendar View
                        </button>
                        <button onClick={() => setViewMode("list")} className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-[13px] font-bold shadow-sm transition-all ${viewMode === 'list' ? 'bg-[#0f1c80] text-white' : 'text-gray-500 hover:text-[#0f1c80] hover:bg-gray-100'}`}>
                            <AlignJustify size={14} /> List View
                        </button>
                    </div>

                    {/* Right: Dropdown Filters & Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative">
                            <select
                                value={filterCategory}
                                onChange={e => setFilterCategory(e.target.value)}
                                className="appearance-none px-4 py-2 pr-8 border border-gray-200 bg-white rounded-md text-[13px] font-medium text-gray-700 cursor-pointer min-w-[130px] hover:border-gray-300 focus:outline-none"
                            >
                                <option value="All Events">All Event Types</option>
                                <option value="Seminar">Seminars</option>
                                <option value="Workshop">Workshops</option>
                                <option value="Webinar">Webinars</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                value={filterLocation}
                                onChange={e => setFilterLocation(e.target.value)}
                                className="appearance-none px-4 py-2 pr-8 border border-gray-200 bg-white rounded-md text-[13px] font-medium text-gray-700 cursor-pointer min-w-[130px] hover:border-gray-300 focus:outline-none"
                            >
                                <option value="All Locations">All Locations</option>
                                <option value="Online">Online</option>
                                <option value="Kuwait City">Kuwait City</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="appearance-none px-4 py-2 pr-8 border border-gray-200 bg-white rounded-md text-[13px] font-medium text-gray-700 cursor-pointer min-w-[130px] hover:border-gray-300 focus:outline-none"
                            >
                                <option value="This Month">📅 This Month</option>
                                <option value="Next Month">📅 Next Month</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>

                        <button onClick={() => handleSyncCalendar(featuredEvent)} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0f1c80] hover:bg-[#1a56db] text-white rounded-md text-[13px] font-bold shadow-md transition-colors ml-2">
                            <Plus size={16} /> Add to Calendar
                        </button>
                    </div>
                </div>

                {/* Conditional View Layer */}
                {viewMode === "list" ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <h2 className="text-2xl font-bold font-spartan text-[#0f1c80]">All Events</h2>

                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search listing..."
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-[250px] pl-8 pr-4 py-2 border border-gray-200 bg-white rounded-md text-[13px] focus:outline-none focus:border-[#1a56db]" />
                            </div>
                        </div>

                        {loading ? <p className="text-gray-500 text-sm text-center py-12">Loading events...</p> : (upcomingSidebarEvents.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-12">No events match your criteria.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {upcomingSidebarEvents.map(ev => {
                                    const d = parseDate(ev.eventDate);
                                    const style = inferTypeStyle(ev.eventName);

                                    return (
                                        <div key={ev._id} className="border border-gray-100 hover:border-[#1a56db]/40 rounded-xl p-5 flex gap-5 group transition-colors shadow-sm cursor-pointer" onClick={() => setModal({ event: ev })}>
                                            <div className="flex flex-col items-center w-12 flex-shrink-0 pt-0.5">
                                                <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">{MONTHS[d.getMonth()].substring(0, 3)}</span>
                                                <span className="text-[26px] font-black text-[#0f1c80] leading-none mt-1 group-hover:text-[#1a56db]">{d.getDate()}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[16px] font-bold text-[#0f1c80] leading-tight mb-2">{ev.eventName}</h4>
                                                <div className="flex items-center gap-4 text-[12px] text-gray-500 font-medium mb-3">
                                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#1a56db]" /> {formatTime(ev.eventTime)}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#1a56db]" /> {ev.location}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider" style={{ background: style.bg, color: style.fg }}>
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} /> {style.type}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* COLUMN 1: UPCOMING EVENTS (List View mapping) */}
                        <div className="lg:col-span-4 bg-white/50 xl:pl-2 xl:pr-4 py-2">
                            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                                <h2 className="text-xl font-bold font-spartan text-[#0f1c80]">Upcoming Events</h2>
                                <button className="text-[12px] font-bold text-[#1a56db] flex items-center gap-1 hover:underline">
                                    See All <ArrowRight size={14} />
                                </button>
                            </div>

                            {loading ? <p className="text-gray-500 text-sm">Loading...</p> : upcomingSidebarEvents.length === 0 ? (
                                <p className="text-gray-500 text-sm">No upcoming events found.</p>
                            ) : (
                                <div className="space-y-1">
                                    {upcomingSidebarEvents.map((ev, idx) => {
                                        const d = parseDate(ev.eventDate);
                                        const isHovered = hoveredEvent === ev._id;
                                        const style = inferTypeStyle(ev.eventName);

                                        return (
                                            <div key={ev._id}
                                                onMouseEnter={() => setHoveredEvent(ev._id)}
                                                onMouseLeave={() => setHoveredEvent(null)}
                                                onClick={() => setModal({ event: ev })}
                                                className={`flex gap-5 cursor-pointer rounded-xl p-3 items-center group transition-colors ${isHovered ? 'bg-white shadow-md border border-gray-100' : 'hover:bg-white'} border border-transparent`}>

                                                {/* Left Date Block */}
                                                <div className="flex flex-col items-center w-10 flex-shrink-0">
                                                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: style.dot }}>{MONTHS[d.getMonth()].substring(0, 3)}</span>
                                                    <span className="text-[22px] font-black text-[#0f1c80] leading-none mt-0.5">{d.getDate()}</span>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1">
                                                    <h4 className="text-[14px] font-bold text-[#0f1c80] leading-snug mb-1 group-hover:text-[#1a56db] transition-colors">{ev.eventName}</h4>
                                                    <p className="text-[12px] text-gray-500 font-medium mb-1.5">{ev.location} • {formatTime(ev.eventTime)}</p>
                                                    <div className="inline-block px-2.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider" style={{ background: style.bg, color: style.fg }}>
                                                        {style.type}
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <div className="text-gray-300 group-hover:text-[#1a56db] pr-1">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* COLUMN 2: CALENDAR WIDGET */}
                        <div className="lg:col-span-5 bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden p-6 flex flex-col items-center">

                            {/* Header nav */}
                            <div className="flex items-center justify-between w-full mb-6">
                                <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                                <h2 className="text-[17px] font-bold text-[#0f1c80] font-spartan">{MONTHS[viewMonth]} {viewYear}</h2>
                                <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={20} /></button>
                            </div>

                            {/* Grid container */}
                            <div className="w-full mb-6">
                                <div className="grid grid-cols-7 mb-4">
                                    {DAYS.map(d => (
                                        <div key={d} className="text-center text-[12px] font-medium text-gray-400">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-4">
                                    {calendarCells.map((cell, i) => {
                                        const dayEvents = events.filter(ev => eventOnDay(ev, cell.date));
                                        const isSelected = (selectedDayEvents && sameDay(selectedDayEvents, cell.date)) ||
                                            (featuredEvent && featuredEvent.eventDate && sameDay(parseDate(featuredEvent.eventDate), cell.date));

                                        return (
                                            <div key={i} className="flex flex-col items-center relative h-10 cursor-pointer"
                                                onClick={() => {
                                                    if (isSelected) setSelectedDayEvents(null);
                                                    else setSelectedDayEvents(cell.date);
                                                }}
                                            >
                                                <div className={`w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-semibold transition-all ${isSelected ? 'bg-[#0f1c80] text-white shadow-md' : cell.isCurrentMonth ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-300'}`}>
                                                    {cell.dayNum}
                                                </div>
                                                {/* Event Dots */}
                                                {dayEvents.length > 0 && (
                                                    <div className="absolute -bottom-1 flex gap-1">
                                                        {dayEvents.slice(0, 3).map((ev, idx) => (
                                                            <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ background: inferTypeStyle(ev.eventName).dot }} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-gray-500 w-full pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1a56db]" /> Alumni Talk</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f97316]" /> Networking</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#22c55e]" /> Webinar</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#a855f7]" /> Workshop</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ef4444]" /> Reunion</div>
                            </div>
                        </div>

                        {/* COLUMN 3: FEATURED EVENT PANEL */}
                        <div className="lg:col-span-3">
                            {featuredEvent ? (
                                <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden group h-full">
                                    {/* Top Image Area */}
                                    <div className="relative w-full h-[190px] xl:h-[220px]">
                                        {resolveAssetUrl(featuredEvent.image) ? (
                                            <img src={resolveAssetUrl(featuredEvent.image)} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#0f1c80] to-[#1a56db] flex items-center justify-center p-8 text-center text-white/50 text-xs">No image available</div>
                                        )}
                                        {/* gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* Badges */}
                                        <div className="absolute top-4 right-4 bg-[#f38900] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                                            Featured Event
                                        </div>

                                        <div className="absolute top-4 left-4 bg-white rounded-md w-12 py-1.5 flex flex-col items-center shadow-lg">
                                            <span className="text-[10px] font-bold text-[#0f1c80] uppercase -mb-0.5">{MONTHS[parseDate(featuredEvent.eventDate).getMonth()].substring(0, 3)}</span>
                                            <span className="text-[20px] font-black text-[#0f1c80] leading-none mb-0.5">{parseDate(featuredEvent.eventDate).getDate()}</span>
                                            <span className="text-[9px] font-semibold text-gray-400">{parseDate(featuredEvent.eventDate).getFullYear()}</span>
                                        </div>

                                        {/* Floating Title Inside Banner */}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-white text-[16px] xl:text-[18px] font-bold leading-tight font-spartan">
                                                {featuredEvent.eventName}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Info Body */}
                                    <div className="p-5 xl:p-6 flex flex-col gap-4">
                                        <p className="text-[13px] text-gray-600 leading-relaxed font-medium line-clamp-3">
                                            {featuredEvent.description || "Join us for an inspiring session with distinguished alumni as they share insights on leadership, innovation, and creating impact in today's dynamic world."}
                                        </p>

                                        <div className="space-y-3 mt-1">
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <div className="w-6 flex items-center justify-center text-[#1a56db]"><Clock size={16} /></div>
                                                <span className="text-[13px] font-medium">{formatTime(featuredEvent.eventTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <div className="w-6 flex items-center justify-center text-[#1a56db]"><MapPin size={16} /></div>
                                                <span className="text-[13px] font-medium">{featuredEvent.location}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <div className="w-6 flex items-center justify-center text-[#1a56db]"><Users size={16} /></div>
                                                <span className="text-[13px] font-medium">Limited Alumni Seats</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 mt-4">
                                            <button onClick={() => setModal({ event: featuredEvent })} className="w-full bg-[#0f1c80] hover:bg-[#1a56db] text-white py-3 rounded-full text-[13px] font-bold flex justify-center items-center gap-2 transition-colors">
                                                Register Now <ArrowRight size={14} />
                                            </button>
                                            <button className="w-full border border-gray-300 hover:border-[#1a56db] hover:bg-blue-50 text-[#0f1c80] py-3 rounded-full text-[13px] font-bold flex justify-center items-center gap-2 transition-colors">
                                                <CalendarIcon size={14} /> Add to Calendar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                                    <CalendarIcon size={48} className="text-gray-200 mb-4" />
                                    <p>Select an event to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* VALUE PROPOSITION FOOTER STRIP */}
            <div className="bg-white border-t border-gray-100 py-10 px-8 relative overflow-hidden mt-6 rounded-tl-[100px] rounded-br-[100px] shadow-sm max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 items-center justify-between lg:pl-16 lg:pr-10">

                    {/* Left Quote */}
                    <div className="flex items-center gap-4">
                        <span className="text-[#1a56db] text-6xl leading-[0px] mt-6 font-serif">“</span>
                        <p className="text-[15.5px] font-medium text-gray-700 italic">"Great events create greater opportunities."</p>
                    </div>

                    {/* Right features flex */}
                    <div className="flex items-center gap-8 lg:gap-14">
                        <div className="flex flex-col items-center">
                            <h4 className="text-[20px] font-black text-[#0f1c80]">50+</h4>
                            <p className="text-[10.5px] text-gray-500 font-medium tracking-wide">Events Every Year</p>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-200 pl-8 lg:pl-14">
                            <h4 className="text-[20px] font-black text-[#0f1c80]">2K+</h4>
                            <p className="text-[10.5px] text-gray-500 font-medium tracking-wide">Alumni Engaged</p>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-200 pl-8 lg:pl-14">
                            <h4 className="text-[20px] font-black text-[#0f1c80]">15+</h4>
                            <p className="text-[10.5px] text-gray-500 font-medium tracking-wide">Countries</p>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-200 pl-8 lg:pl-14">
                            <h4 className="text-[20px] font-black text-[#0f1c80]">Countless</h4>
                            <p className="text-[10.5px] text-gray-500 font-medium tracking-wide">Connections</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* REGISTER MODAL */}
            {modal.event && (
                <RegisterModal event={modal.event} onClose={() => setModal({ event: null })} />
            )}
        </div>
    );
};

export default Events;
