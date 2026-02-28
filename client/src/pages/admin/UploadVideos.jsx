import { useState, useEffect } from "react";
import { Upload, X, Play, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function UploadVideo() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({ heading: "", description: "", youtubeUrl: "" });
    const [videoId, setVideoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    // ── Load existing video when editing ──
    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            try {
                const { data } = await axios.get(`/api/admin/video/${id}`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                const v = data.data || data;
                setForm({
                    heading: v.heading || "",
                    description: v.description || "",
                    youtubeUrl: v.youtubeUrl || "",
                });
                if (v.videoId) setVideoId(v.videoId);
            } catch {
                toast.error("Failed to load video.");
                navigate("/admin/videos");
            } finally {
                setFetching(false);
            }
        })();
    }, [id, isEdit, adminToken, navigate]);

    const extractYoutubeId = (url) => {
        if (!url.trim()) { setVideoId(null); return null; }
        let vid = null;
        if (url.includes("youtube.com/watch")) vid = url.match(/[?&]v=([^&]+)/)?.[1];
        else if (url.includes("youtu.be/")) vid = url.match(/youtu\.be\/([^?]+)/)?.[1];
        else if (url.includes("youtube.com/embed/")) vid = url.match(/embed\/([^?]+)/)?.[1];
        else if (url.includes("youtube.com/v/")) vid = url.match(/\/v\/([^?]+)/)?.[1];
        setVideoId(vid || null);
        return vid;
    };

    const handleYoutubeUrlChange = (e) => {
        const url = e.target.value;
        setForm({ ...form, youtubeUrl: url });
        extractYoutubeId(url);
    };

    const removeVideo = () => {
        setForm({ ...form, youtubeUrl: "" });
        setVideoId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.heading.trim() || !form.description.trim()) return toast.error("Please fill in all fields.");
        if (!form.youtubeUrl.trim() || !videoId) return toast.error("Please enter a valid YouTube video URL.");

        setLoading(true);
        try {
            const payload = {
                heading: form.heading,
                description: form.description,
                youtubeUrl: form.youtubeUrl,
                videoId,
            };

            if (isEdit) {
                await axios.put(`/api/admin/video/${id}`, payload, {
                    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
                });
                toast.success("Video updated successfully!");
            } else {
                await axios.post("/api/admin/video", payload, {
                    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
                });
                toast.success("Video published successfully!");
            }

            navigate("/admin/videos");
        } catch (err) {
            toast.error(err?.response?.data?.message || `Failed to ${isEdit ? "update" : "publish"} video.`);
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
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                    {isEdit ? "Edit Video" : "Alumni Videos"}
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                    {isEdit ? "Update the video details below." : "Create and publish a new video visible to alumni."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Video Details</p>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* YouTube URL */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                YouTube URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                value={form.youtubeUrl}
                                onChange={handleYoutubeUrlChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            {!videoId && form.youtubeUrl && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                                    <AlertCircle size={14} />
                                    <span>Invalid YouTube URL. Please check and try again.</span>
                                </div>
                            )}
                            {videoId && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                    <Play size={14} />
                                    <span>Valid YouTube video detected</span>
                                </div>
                            )}
                        </div>

                        {/* Heading */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Heading <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Leadership Insights for Alumni"
                                value={form.heading}
                                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                                maxLength={120}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.heading.length}/120</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Write a short description of the video..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                maxLength={2000}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.description.length}/2000</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/videos")}
                            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !videoId}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200"
                        >
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isEdit ? "Saving..." : "Publishing..."}</>
                            ) : (
                                <><Upload size={15} />{isEdit ? "Save Changes" : "Publish Video"}</>
                            )}
                        </button>
                    </div>
                </form>

                {/* Live Preview */}
                <div className="space-y-3 lg:sticky lg:top-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Live Preview</p>

                    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 max-w-sm">
                        <div className="aspect-video bg-slate-900 overflow-hidden relative group">
                            {videoId ? (
                                <>
                                    {/* Use thumbnail in preview too — cleaner than iframe */}
                                    <img
                                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                        alt={form.heading || "YouTube thumbnail"}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                            <Play size={18} fill="currentColor" className="text-red-600 ml-0.5" />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeVideo}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Play size={48} className="text-slate-500 mx-auto mb-3" />
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No Video Selected</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <h2 className="text-lg font-black text-indigo-900 leading-snug mb-3 min-h-[2rem]">
                                {form.heading || <span className="text-slate-300">Video title will appear here</span>}
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed min-h-[3rem]">
                                {form.description || <span className="text-slate-300">Your description will show up here once you start typing...</span>}
                            </p>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-white bg-red-600 px-4 py-2.5 rounded-xl justify-center shadow-lg shadow-red-200">
                                <Play size={14} fill="currentColor" />
                                <span>Watch on YouTube</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium">
                        This is how your video card will appear to alumni.
                    </p>
                </div>
            </div>
        </div>
    );
}