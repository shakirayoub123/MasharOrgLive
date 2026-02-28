import { useState, useRef, useEffect } from "react";
import { Upload, X, Calendar, MapPin, Clock, Users, Loader2, Video, Link2, UserCheck } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { resolveAssetUrl } from "../../utils/baseUrl";

function resolveImage(img) {
    return resolveAssetUrl(img);
}

// ─── Platform selector card ────────────────────────────────────────────────────
function PlatformSelector({ value, onChange }) {
    const opts = [
        {
            id: "zoom",
            label: "Zoom",
            desc: "zoom.us/j/…",
            activeBorder: "border-blue-400",
            activeBg: "bg-blue-50",
            activeText: "text-blue-700",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#2D8CFF" />
                    <path d="M4 8.5C4 7.67 4.67 7 5.5 7h9C15.33 7 16 7.67 16 8.5v7c0 .83-.67 1.5-1.5 1.5h-9C4.67 17 4 16.33 4 15.5v-7zm12 2.5 4-2.5v7L16 13v-2z" fill="white" />
                </svg>
            ),
        },
        {
            id: "meet",
            label: "Google Meet",
            desc: "meet.google.com/…",
            activeBorder: "border-teal-400",
            activeBg: "bg-teal-50",
            activeText: "text-teal-700",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#00897B" />
                    <path d="M6 8h7v3.5l3-2.5v6l-3-2.5V16H6V8z" fill="white" />
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {opts.map((o) => (
                <button
                    key={o.id}
                    type="button"
                    onClick={() => onChange(o.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left
                        ${value === o.id
                            ? `${o.activeBorder} ${o.activeBg}`
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                        }`}
                >
                    {o.icon}
                    <div>
                        <p className={`text-xs font-black ${value === o.id ? o.activeText : "text-slate-700"}`}>
                            {o.label}
                        </p>
                        <p className="text-[10px] text-slate-400">{o.desc}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}

// ─── Platform badge (used in preview) ─────────────────────────────────────────
function PlatformBadge({ platform }) {
    if (!platform) return null;
    const isZoom = platform === "zoom";
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black
            ${isZoom ? "bg-blue-50 text-blue-600" : "bg-teal-50 text-teal-600"}`}>
            <Video size={10} />
            {isZoom ? "Zoom" : "Google Meet"}
        </span>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function UploadEvents() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        eventName: "",
        eventDate: "",
        eventTime: "",
        platform: "zoom",
        meetingLink: "",
        location: "Virtual – Zoom",
        host: "",
        description: "",
        capacity: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const imageFileRef = useRef();

    // ── Auto-fill location label when platform switches ──
    const setPlatform = (p) => {
        setForm((f) => ({
            ...f,
            platform: p,
            location: p === "zoom" ? "Virtual – Zoom" : "Virtual – Google Meet",
            meetingLink: "",          // clear stale link
        }));
    };

    // ── Load existing event when editing ──
    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            try {
                const { data } = await axios.get(`/api/admin/events/${id}`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                const e = data.event;
                setForm({
                    eventName: e.eventName || "",
                    eventDate: e.eventDate || "",
                    eventTime: e.eventTime || "",
                    platform: e.platform || "zoom",
                    meetingLink: e.meetingLink || "",
                    location: e.location || "",
                    host: e.host || "",
                    description: e.description || "",
                    capacity: e.capacity?.toString() || "",
                });
                if (e.image) setPreview(resolveImage(e.image));
            } catch {
                toast.error("Failed to load event.");
                navigate("/admin/events");
            } finally {
                setFetching(false);
            }
        })();
    }, [id, isEdit, adminToken, navigate]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Please select an image file.");
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        imageFileRef.current.value = "";
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short", year: "numeric", month: "short", day: "numeric",
        });
    };

    const formatTimeForDisplay = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ── Validation ──
        if (!form.eventName.trim() || !form.eventDate || !form.eventTime ||
            !form.location.trim() || !form.description.trim() || !form.capacity)
            return toast.error("Please fill in all required fields.");

        if (!form.meetingLink.trim())
            return toast.error("Please enter the meeting link.");

        if (form.platform === "zoom" && !form.meetingLink.includes("zoom.us"))
            return toast.error("Enter a valid Zoom link (zoom.us/…)");

        if (form.platform === "meet" && !form.meetingLink.includes("meet.google"))
            return toast.error("Enter a valid Google Meet link (meet.google.com/…)");

        if (!form.host.trim())
            return toast.error("Please enter the host / speaker name.");

        if (!isEdit && !image)
            return toast.error("Please upload an event image.");

        const capacityNum = parseInt(form.capacity);
        if (isNaN(capacityNum) || capacityNum <= 0)
            return toast.error("Please enter a valid capacity number.");

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("eventName", form.eventName);
            fd.append("eventDate", form.eventDate);
            fd.append("eventTime", form.eventTime);
            fd.append("platform", form.platform);
            fd.append("meetingLink", form.meetingLink);
            fd.append("location", form.location);
            fd.append("host", form.host);
            fd.append("description", form.description);
            fd.append("capacity", form.capacity);
            if (image) fd.append("image", image);

            if (isEdit) {
                await axios.put(`/api/admin/events/${id}`, fd, {
                    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "multipart/form-data" },
                });
                toast.success("Event updated successfully!");
            } else {
                await axios.post("/api/admin/events", fd, {
                    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "multipart/form-data" },
                });
                toast.success("Event published successfully!");
            }

            navigate("/admin/events");
        } catch (err) {
            toast.error(err?.response?.data?.message || `Failed to ${isEdit ? "update" : "publish"} event.`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={28} className="animate-spin text-indigo-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">

            {/* ── Page header ── */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                    {isEdit ? "Edit Event" : "Alumni Events"}
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                    {isEdit
                        ? "Update the event details below."
                        : "Create and publish a new virtual event visible to alumni."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* ══ FORM ══ */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Event Details</p>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* ── Event Image ── */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">
                                Event Image {!isEdit && <span className="text-red-500">*</span>}
                                {isEdit && (
                                    <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">
                                        (leave unchanged to keep current)
                                    </span>
                                )}
                            </label>
                            {preview ? (
                                <div className="relative rounded-xl overflow-hidden group">
                                    <img src={preview} alt="Preview" className="w-full h-52 object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={removeImage}
                                            className="bg-white text-slate-800 rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                                            <X size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button type="button" onClick={() => imageFileRef.current.click()}
                                    className="w-full h-52 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                        <Calendar size={22} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                                            Click to upload image
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                                    </div>
                                </button>
                            )}
                            <input ref={imageFileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        </div>

                        {/* ── Event Name ── */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Event Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Annual Alumni Networking Night"
                                value={form.eventName}
                                onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                                maxLength={120}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.eventName.length}/120</p>
                        </div>

                        {/* ── Date & Time ── */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.eventDate}
                                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={form.eventTime}
                                    onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* ── Platform ── */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">
                                Platform <span className="text-red-500">*</span>
                            </label>
                            <PlatformSelector value={form.platform} onChange={setPlatform} />
                        </div>

                        {/* ── Meeting Link ── */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Meeting Link <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="url"
                                    placeholder={form.platform === "zoom"
                                        ? "https://zoom.us/j/123456789?pwd=…"
                                        : "https://meet.google.com/abc-defg-hij"}
                                    value={form.meetingLink}
                                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1.5">
                                {form.platform === "zoom"
                                    ? "Paste the full Zoom invite link — alumni will be taken here when they click Join."
                                    : "Paste the Google Meet link — alumni will be taken here when they click Join."}
                            </p>
                        </div>

                        {/* ── Location label ── */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Location Label <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="e.g. Virtual – Zoom"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    maxLength={100}
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.location.length}/100</p>
                        </div>

                        {/* ── Host & Capacity (side by side) ── */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                    Host / Speaker <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <UserCheck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Dr. Jane Smith"
                                        value={form.host}
                                        onChange={(e) => setForm({ ...form, host: e.target.value })}
                                        maxLength={80}
                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                    Capacity <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        placeholder="e.g. 150"
                                        value={form.capacity}
                                        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                        min="1"
                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Description ── */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Write a detailed description of the event..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">
                                {form.description.length}/500
                            </p>
                        </div>

                    </div>

                    {/* ── Actions ── */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/events")}
                            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isEdit ? "Saving..." : "Publishing..."}
                                </>
                            ) : (
                                <>
                                    <Upload size={15} />
                                    {isEdit ? "Save Changes" : "Publish Event"}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* ══ LIVE PREVIEW ══ */}
                <div className="space-y-3 lg:sticky lg:top-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Live Preview</p>

                    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 max-w-sm">

                        {/* Banner */}
                        <div className="h-52 bg-slate-100 overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Event" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Calendar size={32} className="text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">No Image</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-5 space-y-3">

                            {/* Platform badge */}
                            <PlatformBadge platform={form.platform} />

                            {/* Title */}
                            <h2 className="text-base font-black text-indigo-900 leading-snug min-h-[1.5rem]">
                                {form.eventName || (
                                    <span className="text-slate-300">Event name will appear here</span>
                                )}
                            </h2>

                            {/* Meta */}
                            <div className="flex flex-col gap-1.5">
                                {form.eventDate && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Calendar size={13} className="text-indigo-400 flex-shrink-0" />
                                        <span>{formatDateForDisplay(form.eventDate)}</span>
                                    </div>
                                )}
                                {form.eventTime && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Clock size={13} className="text-indigo-400 flex-shrink-0" />
                                        <span>{formatTimeForDisplay(form.eventTime)}</span>
                                    </div>
                                )}
                                {form.location && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <MapPin size={13} className="text-indigo-400 flex-shrink-0" />
                                        <span>{form.location}</span>
                                    </div>
                                )}
                                {form.host && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <UserCheck size={13} className="text-indigo-400 flex-shrink-0" />
                                        <span>{form.host}</span>
                                    </div>
                                )}
                                {form.capacity && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Users size={13} className="text-indigo-400 flex-shrink-0" />
                                        <span>Capacity: {form.capacity}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-600 leading-relaxed min-h-[2.5rem] pt-3 border-t border-slate-100">
                                {form.description || (
                                    <span className="text-slate-300">
                                        Your description will show up here once you start typing...
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-5">
                            <div className="w-full bg-indigo-600 text-white text-sm font-bold py-2.5 rounded-xl text-center">
                                Register Now
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium">
                        This is how your event card will appear to alumni.
                    </p>
                </div>
            </div>
        </div>
    );
}
