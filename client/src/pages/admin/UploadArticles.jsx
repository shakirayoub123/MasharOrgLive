import { useState, useRef } from "react";
import { Upload, X, ImageIcon, FileText, ArrowUpRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UploadArticle() {
    const { adminToken } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ heading: "", description: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);
    const imageFileRef = useRef();
    const pdfFileRef = useRef();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Please select an image file.");
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handlePdf = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== "application/pdf") return toast.error("Please select a PDF file.");
        if (file.size > 50 * 1024 * 1024) return toast.error("PDF size should be less than 50MB.");
        setPdf(file);
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        imageFileRef.current.value = "";
    };

    const removePdf = () => {
        setPdf(null);
        pdfFileRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.heading.trim() || !form.description.trim()) return toast.error("Please fill in all fields.");
        if (!image) return toast.error("Please upload a cover image.");
        if (!pdf) return toast.error("Please upload a PDF article.");

        setLoading(true);
        try {
            const data = new FormData();
            data.append("heading", form.heading);
            data.append("description", form.description);
            data.append("cover_image", image);   // ✅ matches upload.fields name
            data.append("pdf_file", pdf);         // ✅ matches upload.fields name

            await axios.post("/api/admin/article/create", data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Article published successfully!");
            navigate("/admin/articles");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to publish article.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* ── Header ── */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Alumni Articles</h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Create and publish a new article visible to alumni.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Article Details</p>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Cover Image Upload */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">
                                Cover Image <span className="text-red-500">*</span>
                            </label>

                            {preview ? (
                                <div className="relative rounded-xl overflow-hidden group">
                                    <img src={preview} alt="Preview" className="w-full h-52 object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="bg-white text-slate-800 rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <X size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => imageFileRef.current.click()}
                                    className="w-full h-52 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                        <ImageIcon size={22} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
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

                        {/* PDF Upload */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">
                                PDF Article <span className="text-red-500">*</span>
                            </label>

                            {pdf ? (
                                <div className="rounded-xl border-2 border-slate-200 p-4 bg-slate-50">
                                    <div className="flex items-center gap-3 justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                                                <FileText size={24} className="text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 truncate max-w-xs">{pdf.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{(pdf.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removePdf}
                                            className="bg-white text-slate-800 rounded-xl p-2 shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => pdfFileRef.current.click()}
                                    className="w-full border-2 border-dashed border-slate-200 rounded-xl px-6 py-8 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                        <FileText size={22} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                                            Click to upload PDF
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">PDF up to 50MB</p>
                                    </div>
                                </button>
                            )}

                            <input ref={pdfFileRef} type="file" accept="application/pdf" onChange={handlePdf} className="hidden" />
                        </div>

                        {/* Heading */}
                        <div>
                            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
                                Heading <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Understanding Defensive Behaviors at Work"
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
                                placeholder="Write a detailed description of the article..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y leading-relaxed"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 text-right">{form.description.length} characters</p>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/articles")}
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
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Upload size={15} />
                                    Publish Article
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* ── Live Preview ── */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Live Preview</p>

                    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 max-w-sm">
                        <div className="h-52 bg-slate-100 overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <ImageIcon size={32} className="text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">No Image</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <h2 className="text-lg font-black text-indigo-900 leading-snug mb-3 min-h-[2rem]">
                                {form.heading || <span className="text-slate-300">Article heading will appear here</span>}
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed min-h-[3rem]">
                                {form.description || <span className="text-slate-300">Your description will show up here once you start typing...</span>}
                            </p>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                                <ArrowUpRight size={18} />
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium">
                        This is how your article card will appear to alumni.
                    </p>
                </div>
            </div>
        </div>
    );
}