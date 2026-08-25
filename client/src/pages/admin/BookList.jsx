import { useState, useEffect, useCallback } from "react";
import { Plus, BookOpen, Pencil, Trash2, Search, AlertTriangle, ShoppingBag, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { resolveAssetUrl } from "../../utils/baseUrl";

function resolveImage(img) {
    return resolveAssetUrl(img);
}

// ── Delete Modal ──
function DeleteModal({ book, onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
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
                            <p className="text-sm font-bold text-slate-800">Delete this book?</p>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                <span className="font-semibold text-slate-700">"{book?.heading}"</span> will be permanently removed and no longer visible to alumni.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                    <button onClick={onConfirm} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-black rounded-xl transition-all">
                        {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</> : <><Trash2 size={14} />Delete Book</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Book Card ──
function BookCard({ book, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">

            {/* Cover — plain white/light-grey bg, image floats with shadow */}
            <div className="relative bg-slate-50 flex items-center justify-center p-4 flex-shrink-0 h-[200px]">
                {book.cover_image ? (
                    <img
                        src={resolveImage(book.cover_image)}
                        alt={book.heading}
                        className="h-full w-auto object-contain drop-shadow-md group-hover:scale-[1.03] transition-transform duration-500 rounded-sm"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
                    />
                ) : (
                    <div className="h-44 w-32 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                        <BookOpen size={36} className="text-slate-300" />
                    </div>
                )}

                {/* 3-dot menu */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                            className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all border border-slate-100"
                        >
                            <MoreVertical size={14} />
                        </button>
                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden w-40 py-1">
                                    <button onClick={() => { setMenuOpen(false); onEdit(book); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                        <Pencil size={13} />Edit Book
                                    </button>
                                    <button onClick={() => { setMenuOpen(false); onDelete(book); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 size={13} />Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mx-5" />

            {/* Content */}
            <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
                <h2 className="text-[15px] font-black text-slate-900 leading-snug line-clamp-2 mb-1">
                    {book.heading}
                </h2>
                <p className="text-[13px] font-bold text-indigo-500 mb-3 line-clamp-1">
                    {book.author}
                </p>
                <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-5">
                    {book.description}
                </p>

                {/* Button — matches "Upload Book" indigo */}
                <a
                    href={book.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg shadow-indigo-200"
                >
                    <ShoppingBag size={14} />
                    Buy on Amazon
                </a>
            </div>
        </div>
    );
}

// ── Skeleton ──
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col">
            <div className="bg-slate-100 flex-shrink-0 h-[200px]" />
            <div className="px-5 pt-4 pb-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
                <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                <div className="h-3 bg-slate-100 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 rounded-lg w-4/5" />
                <div className="h-10 bg-indigo-50 rounded-xl w-full mt-2" />
            </div>
        </div>
    );
}

// ── Empty State ──
function EmptyState({ onCreateClick }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 px-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <BookOpen size={34} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-1">No books yet</h3>
            <p className="text-sm text-slate-400 font-medium text-center max-w-xs mb-6">
                Publish your first book to make it visible to alumni.
            </p>
            <button onClick={onCreateClick} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200">
                <Plus size={16} />Upload Book
            </button>
        </div>
    );
}

// ── Main ──
export default function BookList() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchBooks = useCallback(async (searchTerm = "") => {
        setFetching(true);
        try {
            const { data } = await axios.get("/api/admin/books", {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const all = data.books || [];
            setBooks(
                searchTerm
                    ? all.filter((b) =>
                        b.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.author?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    : all
            );
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch books.");
        } finally {
            setFetching(false);
        }
    }, [adminToken]);

    useEffect(() => { fetchBooks(search); }, [search, fetchBooks]);

    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/admin/books/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Book deleted successfully.");
            setDeleteTarget(null);
            fetchBooks(search);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete book.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-8 pb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Books</h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {fetching ? "Loading..." : `${books.length} book${books.length !== 1 ? "s" : ""} published`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/upload-book")}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200 self-start sm:self-auto"
                    >
                        <Plus size={16} />Upload Book
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex-shrink-0">All Books</p>
                        <div className="relative sm:ml-auto sm:w-72">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {fetching ? (
                                Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : books.length > 0 ? (
                                books.map((book) => (
                                    <BookCard
                                        key={book._id}
                                        book={book}
                                        onEdit={(b) => navigate(`/admin/books/edit/${b._id}`)}
                                        onDelete={setDeleteTarget}
                                    />
                                ))
                            ) : search ? (
                                <div className="col-span-full py-16 flex flex-col items-center gap-2 text-center">
                                    <Search size={28} className="text-slate-300" />
                                    <p className="text-sm font-bold text-slate-500">No books match your search</p>
                                    <p className="text-xs text-slate-400">Try a different title or author name</p>
                                </div>
                            ) : (
                                <EmptyState onCreateClick={() => navigate("/admin/upload-book")} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {deleteTarget && (
                <DeleteModal
                    book={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}
        </>
    );
}