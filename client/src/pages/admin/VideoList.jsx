import { useState, useEffect, useCallback } from "react";
import { Plus, Play, Pencil, Trash2, Search, MoreVertical, AlertTriangle, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ── Delete Modal ──
function DeleteModal({ video, onConfirm, onCancel, loading }) {
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
                            <p className="text-sm font-bold text-slate-800">Delete this video?</p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                <span className="font-semibold text-slate-700">"{video?.heading}"</span> will be permanently removed and no longer visible to alumni.
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
                            : <><Trash2 size={14} />Delete Video</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Video Card ──
function VideoCard({ video, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md hover:border-slate-200 transition-all duration-200">
            {/* Thumbnail */}
            <div className="aspect-video bg-slate-900 overflow-hidden relative">
                <iframe
                    className="w-full h-full pointer-events-none"
                    src={`https://www.youtube.com/embed/${video.videoId}?controls=0`}
                    title={video.heading}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />

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
                                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-40 py-1">
                                    <button onClick={() => { setMenuOpen(false); onEdit(video); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                        <Pencil size={14} />Edit Video
                                    </button>
                                    <button onClick={() => { setMenuOpen(false); onDelete(video); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 size={14} />Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* YouTube badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    <Play size={10} fill="currentColor" />
                    YouTube
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h2 className="text-base font-black text-indigo-900 leading-snug mb-2 line-clamp-2">{video.heading}</h2>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{video.description}</p>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex items-center justify-between">
                {video.createdAt && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(video.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                )}
                <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors ml-auto"
                >
                    <Play size={11} fill="currentColor" />
                    Watch
                </a>
            </div>
        </div>
    );
}

// ── Skeleton ──
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="aspect-video bg-slate-100" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 rounded-lg w-5/6" />
            </div>
            <div className="px-5 pb-5 flex justify-between items-center">
                <div className="h-3 bg-slate-100 rounded-lg w-20" />
                <div className="h-7 w-16 bg-slate-100 rounded-lg" />
            </div>
        </div>
    );
}

// ── Empty State ──
function EmptyState({ onCreateClick }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 px-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <Video size={34} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-1">No videos yet</h3>
            <p className="text-sm text-slate-400 font-medium text-center max-w-xs mb-6">
                Publish your first video to make it visible to alumni.
            </p>
            <button onClick={onCreateClick} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200">
                <Plus size={16} />Upload Video
            </button>
        </div>
    );
}

// ── Main ──
export default function VideoList() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // GET /api/v1/admin/videos
    const fetchVideos = useCallback(async (searchTerm = "") => {
        setFetching(true);
        try {
            const { data } = await axios.get("/api/admin/videos", {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const all = data.data || [];
            // Client-side search filter (adjust to server-side if your API supports it)
            setVideos(
                searchTerm
                    ? all.filter((v) => v.heading.toLowerCase().includes(searchTerm.toLowerCase()))
                    : all
            );
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch videos.");
        } finally {
            setFetching(false);
        }
    }, [adminToken]);

    useEffect(() => { fetchVideos(search); }, [search, fetchVideos]);

    // Debounce search 400ms
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    // DELETE /api/v1/admin/videos/:id
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/admin/video/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Video deleted successfully.");
            setDeleteTarget(null);
            fetchVideos(search);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete video.");
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
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Videos</h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {fetching ? "Loading..." : `${videos.length} video${videos.length !== 1 ? "s" : ""} published`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/upload-video")}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200 self-start sm:self-auto"
                    >
                        <Plus size={16} />Upload Video
                    </button>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex-shrink-0">All Videos</p>
                        <div className="relative sm:ml-auto sm:w-72">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search videos..."
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
                            ) : videos.length > 0 ? (
                                videos.map((v) => (
                                    <VideoCard
                                        key={v._id}
                                        video={v}
                                        onEdit={(v) => navigate(`/admin/videos/edit/${v._id}`)}
                                        onDelete={setDeleteTarget}
                                    />
                                ))
                            ) : search ? (
                                <div className="col-span-full py-16 flex flex-col items-center gap-2 text-center">
                                    <Search size={28} className="text-slate-300" />
                                    <p className="text-sm font-bold text-slate-500">No videos match your search</p>
                                    <p className="text-xs text-slate-400">Try a different keyword</p>
                                </div>
                            ) : (
                                <EmptyState onCreateClick={() => navigate("/admin/upload-video")} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {deleteTarget && (
                <DeleteModal
                    video={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}
        </>
    );
}