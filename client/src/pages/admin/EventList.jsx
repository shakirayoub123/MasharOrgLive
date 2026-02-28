import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, MapPin, Clock, Users, Pencil, Trash2, Search, MoreVertical, AlertTriangle, Video, X, Mail, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { resolveAssetUrl } from "../../utils/baseUrl";

// ── Delete Modal ──
function DeleteModal({ event, onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Confirm Delete</p>
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Delete this event?</p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                <span className="font-semibold text-slate-700">"{event?.eventName}"</span> will be permanently removed and no longer visible to alumni.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-red-200">
                        {loading
                            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</>
                            : <><Trash2 size={14} />Delete Event</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

function resolveImage(img) {
    return resolveAssetUrl(img);
}

// ── Registrations Modal ──
function RegistrationsModal({ event, onClose }) {
    const alumni = event?.registeredAlumni || [];
    const pct = event.capacity > 0 ? Math.round((alumni.length / event.capacity) * 100) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Registrations</p>
                        <p className="text-sm font-bold text-slate-700 mt-1 line-clamp-1">{event.eventName}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Capacity Bar */}
                <div className="px-6 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">
                            {alumni.length} / {event.capacity} registered
                        </span>
                        <span className={`text-xs font-black ${pct > 80 ? "text-orange-600" : "text-indigo-600"}`}>
                            {pct}%
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${pct > 80 ? "bg-orange-500" : "bg-indigo-500"}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>

                {/* Alumni List */}
                <div className="p-6 pt-3 max-h-[50vh] overflow-y-auto">
                    {alumni.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Users size={28} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-500">No registrations yet</p>
                            <p className="text-xs text-slate-400 mt-1">Alumni will appear here when they register.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {alumni.map((a, idx) => (
                                <div key={a._id || idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm flex-shrink-0">
                                        {(a.full_name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{a.full_name}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate">
                                                <Mail size={10} className="flex-shrink-0" />
                                                {a.email}
                                            </span>
                                            {a.course && (
                                                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate">
                                                    <GraduationCap size={10} className="flex-shrink-0" />
                                                    {a.course}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">#{idx + 1}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Helpers ──
function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
}

// ── Event Card ──
function EventCard({ event, onEdit, onDelete, onViewRegistrations }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const regCount = event.registeredAlumni?.length || event.registeredCount || 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col">
            {/* Image */}
            <div className="h-48 bg-slate-100 overflow-hidden relative flex-shrink-0">
                {event.image ? (
                    <img
                        src={resolveImage(event.image)}
                        alt={event.eventName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = ""; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Calendar size={32} className="text-slate-300" />
                    </div>
                )}

                {/* Date badge */}
                {event.eventDate && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                            {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                    </div>
                )}

                {/* Platform badge */}
                {event.platform && (
                    <div className="absolute top-3 right-12 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-sm flex items-center gap-1">
                        <Video size={10} className={event.platform === "zoom" ? "text-blue-600" : "text-teal-600"} />
                        <span className={`text-[10px] font-black ${event.platform === "zoom" ? "text-blue-600" : "text-teal-600"}`}>
                            {event.platform === "zoom" ? "Zoom" : "Meet"}
                        </span>
                    </div>
                )}

                {/* Action Menu */}
                <div className="absolute top-3 right-3">
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                            className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <MoreVertical size={15} />
                        </button>
                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-48 py-1">
                                    <button onClick={() => { setMenuOpen(false); onViewRegistrations(event); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                        <Users size={14} />View Registrations
                                    </button>
                                    <button onClick={() => { setMenuOpen(false); onEdit(event); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                        <Pencil size={14} />Edit Event
                                    </button>
                                    <button onClick={() => { setMenuOpen(false); onDelete(event); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 size={14} />Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-base font-black text-indigo-900 leading-snug mb-3 line-clamp-2">{event.eventName}</h2>

                <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Clock size={13} className="text-indigo-400 flex-shrink-0" />
                        <span>{formatTime(event.eventTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <MapPin size={13} className="text-indigo-400 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Users size={13} className="text-indigo-400 flex-shrink-0" />
                        <span>Capacity: {event.capacity}</span>
                    </div>
                </div>
            </div>

            {/* Footer — Registration count button */}
            <div className="px-5 pb-5">
                <button
                    onClick={() => onViewRegistrations(event)}
                    className={`w-full text-xs font-bold py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-2 ${regCount > 0
                            ? "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                        }`}
                >
                    <Users size={13} />
                    {regCount > 0
                        ? `${regCount} Registered — View List`
                        : "No Registrations Yet"}
                </button>
            </div>
        </div>
    );
}

// ── Skeleton ──
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-100" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
                <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
            </div>
            <div className="px-5 pb-5">
                <div className="h-9 bg-slate-100 rounded-xl w-full" />
            </div>
        </div>
    );
}

// ── Empty State ──
function EmptyState({ onCreateClick }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 px-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <Calendar size={34} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-1">No events yet</h3>
            <p className="text-sm text-slate-400 font-medium text-center max-w-xs mb-6">
                Publish your first event to make it visible to alumni.
            </p>
            <button onClick={onCreateClick} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200">
                <Plus size={16} />Create Event
            </button>
        </div>
    );
}

// ── Main ──
export default function EventList() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [regTarget, setRegTarget] = useState(null);

    // GET /api/admin/events
    const fetchEvents = useCallback(async (searchTerm = "") => {
        setFetching(true);
        try {
            const { data } = await axios.get("/api/admin/events", {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const all = data.events || [];
            setEvents(
                searchTerm
                    ? all.filter((e) =>
                        e.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.location?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    : all
            );
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch events.");
        } finally {
            setFetching(false);
        }
    }, [adminToken]);

    useEffect(() => { fetchEvents(search); }, [search, fetchEvents]);

    // Debounce 400ms
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    // DELETE /api/admin/events/:id
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/admin/events/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Event deleted successfully.");
            setDeleteTarget(null);
            fetchEvents(search);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete event.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Events</h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {fetching ? "Loading..." : `${events.length} event${events.length !== 1 ? "s" : ""} published`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/upload-event")}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200 self-start sm:self-auto"
                    >
                        <Plus size={16} />Create Event
                    </button>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex-shrink-0">All Events</p>
                        <div className="relative sm:ml-auto sm:w-72">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {fetching ? (
                                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : events.length > 0 ? (
                                events.map((event) => (
                                    <EventCard
                                        key={event._id}
                                        event={event}
                                        onEdit={(e) => navigate(`/admin/events/edit/${e._id}`)}
                                        onDelete={setDeleteTarget}
                                        onViewRegistrations={setRegTarget}
                                    />
                                ))
                            ) : search ? (
                                <div className="col-span-full py-16 flex flex-col items-center gap-2 text-center">
                                    <Search size={28} className="text-slate-300" />
                                    <p className="text-sm font-bold text-slate-500">No events match your search</p>
                                    <p className="text-xs text-slate-400">Try a different name or location</p>
                                </div>
                            ) : (
                                <EmptyState onCreateClick={() => navigate("/admin/upload-event")} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {deleteTarget && (
                <DeleteModal
                    event={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}

            {regTarget && (
                <RegistrationsModal
                    event={regTarget}
                    onClose={() => setRegTarget(null)}
                />
            )}
        </>
    );
}