import { useState, useEffect, useCallback } from "react";
import { Plus, ArrowUpRight, FileText, Pencil, Trash2, Search, MoreVertical, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function DeleteModal({ article, onConfirm, onCancel, loading }) {
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
                            <p className="text-sm font-bold text-slate-800">Delete this article?</p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                <span className="font-semibold text-slate-700">"{article?.heading}"</span> will be permanently removed and no longer visible to alumni.
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
                            : <><Trash2 size={14} />Delete Article</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

function ArticleCard({ article, onEdit, onDelete, onToggleFeatured, toggling }) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md hover:border-slate-200 transition-all duration-200">
            <div className="h-48 bg-slate-100 overflow-hidden relative">
                {article.cover_image ? (
                    <img src={article.cover_image} alt={article.heading} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mx-auto mb-2">
                                <FileText size={22} className="text-slate-400" />
                            </div>
                            <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">No Image</p>
                        </div>
                    </div>
                )}
                {/* Featured badge */}
                {article.featured && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        ✦ Featured
                    </div>
                )}
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
                                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-44 py-1">
                                    <button
                                        onClick={() => { setMenuOpen(false); onToggleFeatured(article); }}
                                        disabled={toggling}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50"
                                    >
                                        {toggling ? (
                                            <span className="w-4 h-4 border-2 border-amber-700/30 border-t-amber-700 rounded-full animate-spin" />
                                        ) : (
                                            <span className="text-lg">✦</span>
                                        )}
                                        {article.featured ? "Remove Featured" : "Mark as Featured"}
                                    </button>
                                    <button onClick={() => { setMenuOpen(false); onEdit(article); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                        <Pencil size={14} />Edit Article
                                    </button>
                                    <button onClick={() => { setMenuOpen(false); onDelete(article); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 size={14} />Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-5">
                <h2 className="text-base font-black text-indigo-900 leading-snug mb-2 line-clamp-2">{article.heading}</h2>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{article.description}</p>
            </div>
            <div className="px-5 pb-5 flex items-center justify-between">
                {article.createdAt && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                )}
                {/* Arrow opens the PDF directly — cover_image & pdf_file are full URLs from getArticleById */}
                <a href={article.pdf_file} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors ml-auto">
                    <ArrowUpRight size={16} />
                </a>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-100" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 rounded-lg w-5/6" />
            </div>
            <div className="px-5 pb-5"><div className="w-10 h-10 rounded-full bg-slate-100 ml-auto" /></div>
        </div>
    );
}

function EmptyState({ onCreateClick }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 px-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <FileText size={34} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-1">No articles yet</h3>
            <p className="text-sm text-slate-400 font-medium text-center max-w-xs mb-6">Create your first article to make it visible to alumni.</p>
            <button onClick={onCreateClick} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200">
                <Plus size={16} />Create Article
            </button>
        </div>
    );
}

export default function ArticleList() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();

    const [articles, setArticles] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    // Response: { data: { total, page, pages, data: Article[] } }
    const fetchArticles = useCallback(async (page = 1, searchTerm = "") => {
        setFetching(true);
        try {
            const { data } = await axios.get("/api/admin/articles", {
                params: { page, limit: 9, search: searchTerm },
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setArticles(data.data.data);
            setPagination({ total: data.data.total, page: data.data.page, pages: data.data.pages });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch articles.");
        } finally {
            setFetching(false);
        }
    }, [adminToken]);

    useEffect(() => { fetchArticles(1, search); }, [search, fetchArticles]);

    // Debounce search input 400ms
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/admin/article/delete/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Article deleted successfully.");
            setDeleteTarget(null);
            const newPage = articles.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
            fetchArticles(newPage, search);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete article.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleToggleFeatured = async (article) => {
        setTogglingId(article._id);
        try {
            await axios.patch(
                `/api/admin/article/${article._id}/featured`,
                { featured: !article.featured },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success(article.featured ? "Removed from featured." : "Marked as featured!");

            // Update local state
            setArticles(articles.map(a =>
                a._id === article._id ? { ...a, featured: !a.featured } : a
            ));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update featured status.");
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <>
            <div className="space-y-8 pb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Articles</h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {fetching ? "Loading..." : `${pagination.total} article${pagination.total !== 1 ? "s" : ""} published`}
                        </p>
                    </div>
                    <button onClick={() => navigate("/admin/upload-article")} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200 self-start sm:self-auto">
                        <Plus size={16} />Create Article
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex-shrink-0">All Articles</p>
                        <div className="relative sm:ml-auto sm:w-72">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search articles..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                   className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {fetching ? (
                                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : articles.length > 0 ? (
                                articles.map((a) => (
                                    <ArticleCard
                                        key={a._id}
                                        article={a}
                                        onEdit={(a) => navigate(`/admin/articles/edit/${a._id}`)}
                                        onDelete={setDeleteTarget}
                                        onToggleFeatured={handleToggleFeatured}
                                        toggling={togglingId === a._id}
                                    />
                                ))
                            ) : search ? (
                                <div className="col-span-full py-16 flex flex-col items-center gap-2 text-center">
                                    <Search size={28} className="text-slate-300" />
                                    <p className="text-sm font-bold text-slate-500">No articles match your search</p>
                                    <p className="text-xs text-slate-400">Try a different keyword</p>
                                </div>
                            ) : (
                                <EmptyState onCreateClick={() => navigate("/admin/upload-article")} />
                            )}
                        </div>

                        {!fetching && pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-400">Page {pagination.page} of {pagination.pages}</p>
                                <div className="flex items-center gap-2">
                                    <button disabled={pagination.page <= 1} onClick={() => fetchArticles(pagination.page - 1, search)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
                                    <button disabled={pagination.page >= pagination.pages} onClick={() => fetchArticles(pagination.page + 1, search)} className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {deleteTarget && <DeleteModal article={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />}
        </>
    );
}