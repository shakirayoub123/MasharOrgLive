import { useState, useRef, useEffect } from "react";
import { Upload, X, BookOpen, ImageIcon, Link, Loader2, ShoppingBag } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { resolveAssetUrl } from "../../utils/baseUrl";

function resolveImage(img) {
    return resolveAssetUrl(img);
}

export default function UploadBooks() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({ heading: "", author: "", description: "", amazonLink: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const imageFileRef = useRef();

    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            try {
                const { data } = await axios.get(`/api/admin/books/${id}`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                const b = data.book;
                setForm({
                    heading: b.heading || "",
                    author: b.author || "",
                    description: b.description || "",
                    amazonLink: b.amazonLink || "",
                });
                if (b.cover_image) setPreview(resolveImage(b.cover_image));
            } catch {
                toast.error("Failed to load book.");
                navigate("/admin/books");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.heading.trim() || !form.author.trim() || !form.description.trim() || !form.amazonLink.trim())
            return toast.error("Please fill in all fields.");
        if (!isEdit && !image) return toast.error("Please upload a cover image.");
        if (!/^https?:\/\/.+/.test(form.amazonLink.trim()))
            return toast.error("Please enter a valid Amazon link.");

        setLoading(true);
        try {
            const data = new FormData();
            data.append("heading", form.heading);
            data.append("author", form.author);
            data.append("description", form.description);
            data.append("amazonLink", form.amazonLink);
            if (image) data.append("cover_image", image);

            if (isEdit) {
                await axios.put(`/api/admin/books/${id}`, data, {
                    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "multipart/form-data" },
                });
                toast.success("Book updated successfully!");
            } else {
                await axios.post("/api/admin/books", data, {
                    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "multipart/form-data" },
                });
                toast.success("Book published successfully!");
            }
            navigate("/admin/books");
        } catch (err) {
            toast.error(err?.response?.data?.message || `Failed to ${isEdit ? "update" : "publish"} book.`);
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
                    {isEdit ? "Edit Book" : "Alumni Books"}
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                    {isEdit ? "Update the book details below." : "Create and publish a new book visible to alumni."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Book Details</p>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Cover Image — portrait upload area */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">
                                Cover Image {!isEdit && <span className="text-red-500">*</span>}
                                {isEdit && <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">(leave unchanged to keep current)</span>}
                            </label>

                            {preview ? (
                                <div className="relative rounded-xl overflow-hidden group w-48" style={{ aspectRatio: "2/3" }}>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={removeImage} className="bg-white text-slate-800 rounded-xl px-3 py-1.5 text-xs font-black flex items-center gap-1.5 shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                                            <X size={12} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => imageFileRef.current.click()}
                                    className="w-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                    style={{ aspectRatio: "2/3" }}
                                >
                                    <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                        <ImageIcon size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <div className="text-center px-2">
                                        <p className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Upload Cover</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Portrait image</p>
                                    </div>
                                </button>
                            )}
                            <input ref={imageFileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        </div>

                        {/* Book Title */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Book Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. The Art of Leadership"
                                value={form.heading}
                                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                                maxLength={120}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.heading.length}/120</p>
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Author <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. John Smith"
                                value={form.author}
                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                maxLength={100}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.author.length}/100</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Write a short description of the book..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                 maxLength={2000}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.description.length}/2000</p>
                        </div>

                        {/* Amazon Link */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Amazon Link <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Link size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="url"
                                    placeholder="https://www.amazon.com/dp/..."
                                    value={form.amazonLink}
                                    onChange={(e) => setForm({ ...form, amazonLink: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium mt-1.5">Alumni will be redirected to this link to purchase the book.</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                        <button type="button" onClick={() => navigate("/admin/books")} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-indigo-200">
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isEdit ? "Saving..." : "Publishing..."}</>
                                : <><Upload size={15} />{isEdit ? "Save Changes" : "Publish Book"}</>
                            }
                        </button>
                    </div>
                </form>

                {/* Live Preview — portrait book card */}
                <div className="space-y-3 lg:sticky lg:top-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Live Preview</p>

                    {/* Bookstore-style preview: cover + detail side by side */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                        <div className="p-5 flex gap-5">

                            {/* Portrait cover */}
                            <div
                                className="flex-shrink-0 rounded-xl overflow-hidden shadow-md bg-slate-100"
                                style={{ width: 120, aspectRatio: "2/3" }}
                            >
                                {preview ? (
                                    <img src={preview} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
                                        <BookOpen size={28} className="text-indigo-300" />
                                    </div>
                                )}
                            </div>

                            {/* Book details */}
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Book</p>
                                <h2 className="text-base font-black text-slate-900 leading-snug mb-1">
                                    {form.heading || <span className="text-slate-300 font-normal text-sm">Title will appear here</span>}
                                </h2>
                                <p className="text-xs font-semibold text-indigo-500 mb-3">
                                    {form.author || <span className="text-slate-300 font-normal">Author name</span>}
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-4">
                                    {form.description || <span className="text-slate-300">Description will show here...</span>}
                                </p>

                                <div className="mt-4">
                                    <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-colors ${form.amazonLink ? "bg-amber-400 text-amber-900" : "bg-slate-100 text-slate-400"}`}>
                                        <ShoppingBag size={11} />
                                        {form.amazonLink ? "Buy on Amazon" : "Amazon link here"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Small card preview below */}
                        {/*<div className="px-5 pb-5">*/}
                        {/*    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Card Preview (as shown in library)</p>*/}
                        {/*    <div className="w-28 rounded-xl overflow-hidden shadow-sm border border-slate-100">*/}
                        {/*        <div className="bg-slate-100 overflow-hidden" style={{ aspectRatio: "2/3" }}>*/}
                        {/*            {preview*/}
                        {/*                ? <img src={preview} alt="Cover" className="w-full h-full object-cover" />*/}
                        {/*                : <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center"><BookOpen size={18} className="text-indigo-300" /></div>*/}
                        {/*            }*/}
                        {/*        </div>*/}
                        {/*        <div className="p-2 bg-white">*/}
                        {/*            <p className="text-[9px] font-black text-slate-900 line-clamp-2 leading-tight">{form.heading || <span className="text-slate-300">Title</span>}</p>*/}
                        {/*            <p className="text-[8px] text-indigo-400 font-semibold mt-0.5 truncate">{form.author || <span className="text-slate-300">Author</span>}</p>*/}
                        {/*            <div className={`mt-1.5 w-full text-center py-1 rounded text-[8px] font-black ${form.amazonLink ? "bg-amber-400 text-amber-900" : "bg-slate-100 text-slate-300"}`}>*/}
                        {/*                Buy on Amazon*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>

                </div>
            </div>
        </div>
    );
}