import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Upload, Plus, Check, X, Loader2, ChevronRight,
    ChevronDown, FileText, Image, BookOpen, List,
    GraduationCap, FolderOpen, Layers, Eye, Trash2,
    ArrowLeft, Film, AlignLeft, Pencil,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";

const cardStyle = {
    background: "#FFFFFF",
    borderRadius: 16,
    border: `1px solid #E2E8F0`,
    borderLeft: `4px solid transparent`,
    backgroundImage: `linear-gradient(white, white), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
    backgroundOrigin: `border-box`,
    backgroundClip: `padding-box, border-box`,
    boxShadow: "0 1px 4px rgba(15,28,128,.05)",
    overflow: "hidden",
};

function useAdminAxios() {
    const { adminToken } = useAuth();
    const headers = () => ({ Authorization: `Bearer ${adminToken}` });
    return {
        get: (url) => axios.get(`/api${url}`, { headers: headers() }),
        post: (url, data, cfg = {}) => axios.post(`/api${url}`, data, { ...cfg, headers: { ...headers(), ...cfg.headers } }),
        patch: (url, data) => axios.patch(`/api${url}`, data, { headers: headers() }),
        delete: (url) => axios.delete(`/api${url}`, { headers: headers() }),
    };
}

const ICONS = ["📁", "🎓", "👥", "✍️", "🔥", "🎙️", "📋", "🌱", "🏆", "📚", "🔍", "💡", "🤝", "⭐", "🏛️", "🧠", "🌍", "🎯", "🔬", "🏅", "🧩", "🌟"];

// ─── LESSON CONTENT TYPES ─────────────────────────────────────────────────────
const CONTENT_TYPES = [
    { id: "text", label: "Text / Rich Content", icon: <AlignLeft size={15} />, color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF" },
    { id: "pdf", label: "PDF Document", icon: <FileText size={15} />, color: "#F38900", bg: "#FFF4E0", border: "#FFE4B0" },
    { id: "image", label: "Image", icon: <Image size={15} />, color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5" },
    { id: "video", label: "Video URL / Embed", icon: <Film size={15} />, color: "#6B46C1", bg: "#FAF5FF", border: "#E9D8FD" },
    { id: "mixed", label: "Mixed Content", icon: <Layers size={15} />, color: "#0F1C80", bg: "#EEF0FF", border: "#DDE0FF" },
];

// ─── STEP BADGE ───────────────────────────────────────────────────────────────
function StepBadge({ n, label, active }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: active ? ORANGE : "#EEF0FF", color: active ? "#fff" : NAVY }}>
                {n}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[1.2px]"
                style={{ color: active ? ORANGE : "#9CA3AF" }}>{label}</span>
        </div>
    );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
function SectionCard({ section, sIdx, moduleId, programId, api, onUpdate, onDelete }) {
    const [expanded, setExpanded] = useState(true);
    const [showAddLesson, setShowLesson] = useState(false);
    const [lessonLabel, setLessonLabel] = useState("");
    const [lessonText, setLessonText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [lessonUrl, setLessonUrl] = useState("");
    const [editingLesson, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const imgRef = useRef(null);
    const pdfRef = useRef(null);

    const lessons = section.lessons || [];

    async function saveLesson() {
        if (!lessonLabel.trim()) return;
        setSaving(true);
        try {
            const isEdit = !!editingLesson;
            const lid = editingLesson?._id || editingLesson?.id;

            let r;
            if (imageFile || pdfFile) {
                const fd = new FormData();
                if (imageFile) fd.append("image", imageFile);
                if (pdfFile) fd.append("pdf", pdfFile);
                fd.append("programId", programId);
                fd.append("moduleId", moduleId);
                fd.append("sectionId", section._id || section.id);
                fd.append("label", lessonLabel.trim());
                fd.append("text", lessonText.trim());
                fd.append("videoUrl", lessonUrl.trim());

                if (isEdit) {
                    r = await api.patch(`/admin/programs/${programId}/modules/${moduleId}/sections/${section._id || section.id}/lessons/${lid}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
                } else {
                    r = await api.post("/admin/programs/lessons/upload-combined", fd, { headers: { "Content-Type": "multipart/form-data" } });
                }
            } else {
                const payload = { label: lessonLabel.trim(), text: lessonText.trim(), videoUrl: lessonUrl.trim() };
                if (isEdit) {
                    r = await api.patch(`/admin/programs/${programId}/modules/${moduleId}/sections/${section._id || section.id}/lessons/${lid}`, payload);
                } else {
                    r = await api.post(`/admin/programs/${programId}/modules/${moduleId}/sections/${section._id || section.id}/lessons`, payload);
                }
            }

            const newLessonData = r.data.data;
            let updatedLessons;
            if (isEdit) {
                updatedLessons = lessons.map(l => (l._id === lid || l.id === lid) ? newLessonData : l);
            } else {
                updatedLessons = [...lessons, newLessonData];
            }

            onUpdate({ ...section, lessons: updatedLessons });
            resetLesson();
            toast.success(isEdit ? "Lesson updated!" : "Lesson added!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save lesson.");
        } finally { setSaving(false); }
    }

    function startEdit(lesson) {
        setEditing(lesson);
        setLessonLabel(lesson.label);
        setLessonText(lesson.text || "");
        setLessonUrl(lesson.videoUrl || "");
        setImageFile(null);
        setPdfFile(null);
        setShowLesson(true);
        setExpanded(true);
    }

    function resetLesson() {
        setLessonLabel(""); setLessonText(""); setImageFile(null); setPdfFile(null);
        setLessonUrl(""); setEditing(null); setShowLesson(false);
    }

    async function deleteLesson(lIdx) {
        const lesson = lessons[lIdx];
        const lid = lesson?._id || lesson?.id;
        if (!lid) {
            // lesson not yet persisted, just remove from local state
            onUpdate({ ...section, lessons: lessons.filter((_, i) => i !== lIdx) });
            return;
        }
        const sid = section._id || section.id;
        try {
            await api.delete(`/admin/programs/${programId}/modules/${moduleId}/sections/${sid}/lessons/${lid}`);
            onUpdate({ ...section, lessons: lessons.filter((_, i) => i !== lIdx) });
            toast.success("Lesson removed.");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete lesson.");
        }
    }

    return (
        <div className="rounded-2xl border border-[#DDE0FF] overflow-hidden bg-white"
            style={{ animation: "fadeUp .2s ease both" }}>
            {/* Section header */}
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                style={{ background: "#EEF0FF" }}
                onClick={() => setExpanded(v => !v)}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                    style={{ background: NAVY, color: "#fff" }}>
                    {sIdx + 1}
                </div>
                <p className="flex-1 text-sm font-black text-[#0D1240]">{section.label}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#DDE0FF", color: NAVY }}>
                    {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                </span>
                <button onClick={e => { e.stopPropagation(); onDelete(); }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-red-300 hover:bg-red-50 hover:text-red-500 transition-all ml-1">
                    <Trash2 size={12} />
                </button>
                <ChevronDown size={14} className="text-gray-400 transition-transform"
                    style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
            </div>

            {expanded && (
                <div className="p-4 space-y-2">
                    {/* Lessons list */}
                    {lessons.map((lesson, lIdx) => (
                        <div key={lesson._id || lIdx}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all hover:border-[#0F1C80]/30 group"
                            style={{ borderColor: "#DDE0FF", background: "#F8F9FF" }}>
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                style={{
                                    background: CONTENT_TYPES.find(c => c.id === lesson.type)?.bg || "#EEF0FF",
                                    color: CONTENT_TYPES.find(c => c.id === lesson.type)?.color || NAVY
                                }}>
                                {CONTENT_TYPES.find(c => c.id === lesson.type)?.icon}
                            </div>
                            <span className="flex-1 text-xs font-semibold text-[#0D1240] truncate">{lesson.label}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase"
                                style={{
                                    background: CONTENT_TYPES.find(c => c.id === lesson.type)?.bg || "#EEF0FF",
                                    color: CONTENT_TYPES.find(c => c.id === lesson.type)?.color || NAVY
                                }}>
                                {lesson.type}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(lesson)}
                                    className="w-5 h-5 rounded flex items-center justify-center text-blue-400 hover:text-blue-600 transition-all"
                                    title="Edit Lesson">
                                    <Pencil size={11} />
                                </button>
                                <button onClick={() => deleteLesson(lIdx)}
                                    className="w-5 h-5 rounded flex items-center justify-center text-red-300 hover:text-red-500 transition-all"
                                    title="Delete Lesson">
                                    <X size={11} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add/Edit lesson form */}
                    {showAddLesson ? (
                        <div className="rounded-xl border border-[#DDE0FF] p-4 space-y-3 mt-2"
                            style={{ background: "#F5F6FF" }}>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest">
                                    {editingLesson ? "Edit Lesson" : "New Lesson"}
                                </p>
                                {editingLesson && (
                                    <span className="text-[8px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase">Editing</span>
                                )}
                            </div>

                            <input value={lessonLabel} onChange={e => setLessonLabel(e.target.value)}
                                placeholder="Lesson title…"
                                className="w-full px-3 py-2 rounded-xl border border-[#DDE0FF] text-sm text-[#0D1240] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 focus:border-[#0F1C80]" />

                            {/* Content inputs combined */}
                            <div className="space-y-3 pt-1 border-t border-[#DDE0FF]">
                                <textarea value={lessonText} onChange={e => setLessonText(e.target.value)}
                                    placeholder="Lesson content / description (optional)…"
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-xl border border-[#DDE0FF] text-sm text-[#0D1240] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20 resize-none" />

                                <input value={lessonUrl} onChange={e => setLessonUrl(e.target.value)}
                                    placeholder="YouTube / Vimeo URL or embed link (optional)…"
                                    className="w-full px-3 py-2 rounded-xl border border-[#DDE0FF] text-sm text-[#0D1240] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20" />

                                <div className="grid grid-cols-2 gap-2">
                                    {/* Image Upload */}
                                    <div>
                                        <input ref={imgRef} type="file" accept="image/*" className="hidden"
                                            onChange={e => setImageFile(e.target.files[0])} />
                                        <button onClick={() => imgRef.current?.click()}
                                            className="w-full flex flex-col items-center justify-center gap-1 py-2 rounded-xl border-2 border-dashed text-[10px] font-bold transition-all"
                                            style={imageFile || editingLesson?.imageUrl
                                                ? { borderColor: "#2D8A4E", background: "#F0FFF4", color: "#2D8A4E" }
                                                : { borderColor: "#DDE0FF", background: "white", color: "#6B7280" }}>
                                            <Image size={12} />
                                            {imageFile ? "Image Selected" : editingLesson?.imageUrl ? "Change Image" : "Add Image"}
                                        </button>
                                        {imageFile && <p className="text-[8px] text-center mt-1 truncate text-green-600">{imageFile.name}</p>}
                                    </div>

                                    {/* PDF Upload */}
                                    <div>
                                        <input ref={pdfRef} type="file" accept="application/pdf" className="hidden"
                                            onChange={e => setPdfFile(e.target.files[0])} />
                                        <button onClick={() => pdfRef.current?.click()}
                                            className="w-full flex flex-col items-center justify-center gap-1 py-2 rounded-xl border-2 border-dashed text-[10px] font-bold transition-all"
                                            style={pdfFile || editingLesson?.pdfUrl
                                                ? { borderColor: "#F38900", background: "#FFF4E0", color: "#F38900" }
                                                : { borderColor: "#DDE0FF", background: "white", color: "#6B7280" }}>
                                            <FileText size={12} />
                                            {pdfFile ? "PDF Selected" : editingLesson?.pdfUrl ? "Change PDF" : "Add PDF"}
                                        </button>
                                        {pdfFile && <p className="text-[8px] text-center mt-1 truncate text-orange-600">{pdfFile.name}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button onClick={saveLesson} disabled={saving || !lessonLabel.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all"
                                    style={{ background: saving ? `${ORANGE}88` : ORANGE, boxShadow: saving ? "none" : `0 4px 14px ${ORANGE}44` }}>
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : editingLesson ? <Check size={14} /> : <Plus size={14} />}
                                    {saving ? "Saving…" : editingLesson ? "Update Lesson" : "Add Lesson"}
                                </button>
                                <button onClick={resetLesson}
                                    className="px-4 rounded-xl border border-[#DDE0FF] text-gray-400 hover:bg-gray-50 transition-all">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowLesson(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-xs font-black transition-all mt-1"
                            style={{ borderColor: "#DDE0FF", color: NAVY }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDE0FF"; e.currentTarget.style.color = NAVY; }}>
                            <Plus size={13} /> Add Lesson
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── MODULE EDITOR PANEL ──────────────────────────────────────────────────────
function ModuleEditor({ program, module, api, onBack, onModuleUpdate }) {
    const [sections, setSections] = useState(module.sections || []);
    const [newSecLabel, setNewSecLabel] = useState("");
    const [addingSection, setAdding] = useState(false);
    const [creating, setCreating] = useState(false);
    const pid = program._id || program.id;
    const mid = module._id || module.id;

    async function createSection() {
        if (!newSecLabel.trim()) return;
        setCreating(true);
        try {
            const r = await api.post(`/admin/programs/${pid}/modules/${mid}/sections`, { label: newSecLabel.trim() });
            const newSec = { ...r.data.data, lessons: [] };
            const updated = [...sections, newSec];
            setSections(updated);
            onModuleUpdate({ ...module, sections: updated });
            toast.success(`Section "${newSec.label}" created.`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create section.");
        } finally { setNewSecLabel(""); setAdding(false); setCreating(false); }
    }

    function updateSection(idx, updated) {
        const arr = sections.map((s, i) => i === idx ? updated : s);
        setSections(arr);
        onModuleUpdate({ ...module, sections: arr });
    }

    function deleteSection(idx) {
        const arr = sections.filter((_, i) => i !== idx);
        setSections(arr);
        onModuleUpdate({ ...module, sections: arr });
        toast.success("Section removed.");
    }

    return (
        <div style={{ animation: "panelIn .25s ease" }}>
            {/* Breadcrumb back */}
            <button onClick={onBack}
                className="flex items-center gap-2 text-xs font-black mb-4 transition-all"
                style={{ color: NAVY }}
                onMouseEnter={e => e.currentTarget.style.color = ORANGE}
                onMouseLeave={e => e.currentTarget.style.color = NAVY}>
                <ArrowLeft size={14} /> Back to Programs
            </button>

            {/* Module header */}
            <div style={cardStyle} className="mb-4">
                <div className="px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                        style={{ background: "#EEF0FF", borderColor: "#DDE0FF" }}>
                        {program.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: ORANGE }}>{program.label}</p>
                        <h2 className="font-black text-[#0D1240] text-base leading-snug">{module.label}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{sections.length} section{sections.length !== 1 ? "s" : ""} · {sections.reduce((a, s) => a + (s.lessons?.length || 0), 0)} lessons</p>
                    </div>
                    <div className="text-2xl">📚</div>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-3 mb-3">
                {sections.map((sec, sIdx) => (
                    <SectionCard
                        key={sec._id || sec.id || sIdx}
                        section={sec} sIdx={sIdx}
                        moduleId={mid} programId={pid} api={api}
                        onUpdate={updated => updateSection(sIdx, updated)}
                        onDelete={() => deleteSection(sIdx)}
                    />
                ))}
            </div>

            {/* Add section */}
            {addingSection ? (
                <div className="rounded-2xl border border-[#DDE0FF] p-4 space-y-3" style={{ background: "#F5F6FF" }}>
                    <p className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest">New Section</p>
                    <div className="flex gap-2">
                        <input value={newSecLabel} onChange={e => setNewSecLabel(e.target.value)} autoFocus
                            placeholder="Section name…"
                            className="flex-1 px-3 py-2.5 rounded-xl border border-[#DDE0FF] text-sm text-[#0D1240] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20"
                            onKeyDown={e => e.key === "Enter" && createSection()} />
                        <button onClick={createSection} disabled={!newSecLabel.trim() || creating}
                            className="px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all"
                            style={{ background: ORANGE, opacity: creating ? 0.6 : 1 }}>
                            {creating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        </button>
                        <button onClick={() => { setAdding(false); setNewSecLabel(""); }}
                            className="px-3 py-2.5 rounded-xl border border-[#DDE0FF] text-gray-400 hover:bg-gray-50">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setAdding(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed text-sm font-black transition-all"
                    style={{ borderColor: "#DDE0FF", color: NAVY }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDE0FF"; e.currentTarget.style.color = NAVY; }}>
                    <Plus size={14} /> Add Section
                </button>
            )}
        </div>
    );
}

// ─── PROGRAMS LIST VIEW ───────────────────────────────────────────────────────
function ProgramsList({ programs, loading, api, onUpdate, onCreate, onDelete }) {
    const [showNewProg, setShowNewProg] = useState(false);
    const [newProgIcon, setNewProgIcon] = useState("📁");
    const [newProgLabel, setNewProgLabel] = useState("");
    const [creating, setCreating] = useState(false);
    const [expandedProg, setExpandedProg] = useState({});
    const [showNewMod, setShowNewMod] = useState({});
    const [newModLabels, setNewModLabels] = useState({});

    async function createProgram() {
        if (!newProgLabel.trim()) return;
        setCreating(true);
        try {
            const r = await api.post("/admin/programs", { icon: newProgIcon, label: newProgLabel.trim() });
            onCreate({ ...r.data.data, modules: [] });
            toast.success("Program created!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create program.");
        } finally { setNewProgLabel(""); setShowNewProg(false); setCreating(false); }
    }

    async function deleteProgram(e, prog) {
        e.stopPropagation();
        if (!window.confirm(`Delete program "${prog.label}"? This will remove all modules, sections and lessons inside it.`)) return;
        const pid = prog._id || prog.id;
        try {
            await api.delete(`/admin/programs/${pid}`);
            onDelete(pid);
            toast.success("Program deleted.");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete program.");
        }
    }

    async function deleteModule(e, prog, mod) {
        e.stopPropagation();
        if (!window.confirm(`Delete module "${mod.label}"?`)) return;
        const pid = prog._id || prog.id;
        const mid = mod._id || mod.id;
        try {
            await api.delete(`/admin/programs/${pid}/modules/${mid}`);
            const updated = { ...prog, modules: (prog.modules || []).filter(m => (m._id || m.id) !== mid) };
            onUpdate(updated);
            toast.success("Module deleted.");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete module.");
        }
    }

    async function createModule(prog) {
        const pid = prog._id || prog.id;
        const label = newModLabels[pid]?.trim();
        if (!label) return;
        try {
            const r = await api.post(`/admin/programs/${pid}/modules`, { label });
            const newMod = { ...r.data.data, sections: [] };
            onUpdate({ ...prog, modules: [...(prog.modules || []), newMod] });
            toast.success("Module created!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create module.");
        } finally {
            setNewModLabels(p => ({ ...p, [pid]: "" }));
            setShowNewMod(p => ({ ...p, [pid]: false }));
        }
    }

    if (loading) return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} style={cardStyle} className="animate-pulse">
                    <div className="px-5 py-5 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-48" />
                            <div className="h-3 bg-gray-100 rounded w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-3">
            {programs.map((prog, pi) => {
                const pid = prog._id || prog.id;
                const isExpanded = expandedProg[pid];
                const modules = prog.modules || [];

                return (
                    <div key={pid} style={cardStyle}>
                        {/* Program header */}
                        <div className="px-5 py-4 flex items-center gap-4 cursor-pointer select-none"
                            onClick={() => setExpandedProg(p => ({ ...p, [pid]: !p[pid] }))}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                                style={{ background: "#EEF0FF", borderColor: "#DDE0FF" }}>
                                {prog.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-[#0D1240] text-sm leading-snug">{prog.label}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{modules.length} module{modules.length !== 1 ? "s" : ""}</p>
                            </div>
                            <span className="text-[9px] font-black px-2 py-1 rounded-full"
                                style={{ background: "#EEF0FF", color: NAVY, border: `1px solid #DDE0FF` }}>
                                {modules.reduce((a, m) => a + (m.sections?.length || 0), 0)} sections
                            </span>
                            <button onClick={e => deleteProgram(e, prog)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                title="Delete program">
                                <Trash2 size={13} />
                            </button>
                            <ChevronDown size={16} className="text-gray-300 transition-transform"
                                style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </div>

                        {/* Modules */}
                        {isExpanded && (
                            <div className="px-5 pb-5 space-y-2 border-t border-[#EEF0FF] pt-4">
                                {modules.map((mod, mi) => {
                                    const modId = mod._id || mod.id;
                                    return (
                                        <div key={modId}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all"
                                            style={{ borderColor: "#DDE0FF", background: "#F8F9FF" }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.background = "#FFF9F0"; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDE0FF"; e.currentTarget.style.background = "#F8F9FF"; }}
                                            onClick={() => onCreate(null, prog, mod)}>
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                                                style={{ background: "#DDE0FF", color: NAVY }}>{mi + 1}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-[#0D1240] truncate">{mod.label}</p>
                                                <p className="text-[10px] text-gray-400">
                                                    {(mod.sections || []).length} sections · {(mod.sections || []).reduce((a, s) => a + (s.lessons?.length || 0), 0)} lessons
                                                </p>
                                            </div>
                                            <button onClick={e => deleteModule(e, prog, mod)}
                                                className="w-6 h-6 rounded-lg flex items-center justify-center text-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                                title="Delete module">
                                                <Trash2 size={12} />
                                            </button>
                                            <span className="text-[10px] font-black text-[#0F1C80] flex items-center gap-1">
                                                Edit <ChevronRight size={12} />
                                            </span>
                                        </div>
                                    );
                                })}

                                {/* Add module */}
                                {showNewMod[pid] ? (
                                    <div className="flex gap-2 mt-2">
                                        <input value={newModLabels[pid] || ""} autoFocus
                                            onChange={e => setNewModLabels(p => ({ ...p, [pid]: e.target.value }))}
                                            placeholder="Module name…"
                                            className="flex-1 px-3 py-2 rounded-xl border border-[#DDE0FF] text-sm text-[#0D1240] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20"
                                            onKeyDown={e => e.key === "Enter" && createModule(prog)} />
                                        <button onClick={() => createModule(prog)}
                                            className="px-4 py-2 rounded-xl text-sm font-black text-white"
                                            style={{ background: ORANGE }}>
                                            <Check size={14} />
                                        </button>
                                        <button onClick={() => setShowNewMod(p => ({ ...p, [pid]: false }))}
                                            className="px-3 py-2 rounded-xl border border-[#DDE0FF] text-gray-400 hover:bg-gray-50">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setShowNewMod(p => ({ ...p, [pid]: true }))}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-xs font-black transition-all"
                                        style={{ borderColor: "#DDE0FF", color: NAVY }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDE0FF"; e.currentTarget.style.color = NAVY; }}>
                                        <Plus size={12} /> Add Module
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* New program */}
            {showNewProg ? (
                <div style={cardStyle}>
                    <div className="px-5 py-5 space-y-3">
                        <p className="text-[10px] font-black text-[#0F1C80] uppercase tracking-widest">New Program</p>
                        <div className="flex flex-wrap gap-1.5">
                            {ICONS.map(ic => (
                                <button key={ic} onClick={() => setNewProgIcon(ic)}
                                    className="w-8 h-8 rounded-lg border text-base flex items-center justify-center transition-all"
                                    style={newProgIcon === ic
                                        ? { borderColor: ORANGE, background: "#FFF4E0", boxShadow: `0 0 0 2px ${ORANGE}33` }
                                        : { borderColor: "#DDE0FF", background: "white" }}>
                                    {ic}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={newProgLabel} onChange={e => setNewProgLabel(e.target.value)} autoFocus
                                placeholder="Program name…"
                                className="flex-1 px-3 py-2.5 rounded-xl border border-[#DDE0FF] text-sm text-[#0D1240] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1C80]/20"
                                onKeyDown={e => e.key === "Enter" && createProgram()} />
                            <button onClick={createProgram} disabled={!newProgLabel.trim() || creating}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all"
                                style={{ background: ORANGE, opacity: creating ? 0.6 : 1 }}>
                                {creating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create
                            </button>
                            <button onClick={() => { setShowNewProg(false); setNewProgLabel(""); }}
                                className="px-3 py-2.5 rounded-xl border border-[#DDE0FF] text-gray-400 hover:bg-gray-50">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowNewProg(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed text-sm font-black transition-all"
                    style={{ borderColor: "#DDE0FF", color: NAVY }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; e.currentTarget.style.background = "#FFFAF0"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDE0FF"; e.currentTarget.style.color = NAVY; e.currentTarget.style.background = ""; }}>
                    <Plus size={15} /> Create New Program
                </button>
            )}
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminProgramsManager() {
    const api = useAdminAxios();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingModule, setEditing] = useState(null); // { program, module }

    useEffect(() => {
        api.get("/admin/programs")
            .then(r => setPrograms((r.data.data || []).map((p, i) => ({ ...p }))))
            .catch(() => setPrograms([]))
            .finally(() => setLoading(false));
    }, []);

    function handleProgramCreate(newProg, prog, mod) {
        // If called with prog+mod, open module editor
        if (prog && mod) { setEditing({ program: prog, module: mod }); return; }
        if (newProg) setPrograms(prev => [...prev, newProg]);
    }

    function handleProgramUpdate(updated) {
        setPrograms(prev => prev.map(p => (p._id || p.id) === (updated._id || updated.id) ? updated : p));
    }

    function handleProgramDelete(pid) {
        setPrograms(prev => prev.filter(p => (p._id || p.id) !== pid));
    }

    function handleModuleUpdate(updatedModule) {
        if (!editingModule) return;
        const updatedProg = {
            ...editingModule.program,
            modules: (editingModule.program.modules || []).map(m =>
                (m._id || m.id) === (updatedModule._id || updatedModule.id) ? updatedModule : m
            ),
        };
        setPrograms(prev => prev.map(p => (p._id || p.id) === (updatedProg._id || updatedProg.id) ? updatedProg : p));
        setEditing({ program: updatedProg, module: updatedModule });
    }

    const totalModules = programs.reduce((a, p) => a + (p.modules?.length || 0), 0);
    const totalSections = programs.reduce((a, p) => a + (p.modules || []).reduce((b, m) => b + (m.sections?.length || 0), 0), 0);
    const totalLessons = programs.reduce((a, p) => a + (p.modules || []).reduce((b, m) => b + (m.sections || []).reduce((c, s) => c + (s.lessons?.length || 0), 0), 0), 0);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .pmroot * { font-family: 'DM Sans', sans-serif; }
                .pmroot h1 { font-family: 'Sora', sans-serif; }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes panelIn { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:translateX(0)} }
                @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>

            <div className="pmroot w-full max-w-full px-2 pb-12">

                {/* Banner */}
                <div className="relative rounded-2xl overflow-hidden mb-6"
                    style={{
                        border: `1px solid #DDE0FF`,
                        borderLeft: `4px solid transparent`,
                        backgroundImage: `linear-gradient(135deg, #EEF0FF 0%, #E5E8FF 55%, #FFF4E0 100%), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
                        backgroundOrigin: `border-box`,
                        backgroundClip: `padding-box, border-box`,
                    }}>
                    <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border-2 border-[#0F1C80]/5 pointer-events-none" />
                    <div className="relative flex items-center justify-between gap-4 px-7 py-6">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-1.5 bg-[#0F1C80]/8 border border-[#0F1C80]/15 rounded-full px-3 py-1 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0F1C80]" />
                                <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px]">Admin · Program Manager</span>
                            </div>
                            <h1 className="font-black text-[#0D1240] text-2xl leading-tight mb-2">Programs &amp; Curriculum</h1>
                            <p className="text-sm text-gray-500 mb-4 max-w-sm">
                                Build programs → modules → sections → lessons with text, PDFs, images and videos.
                            </p>
                            <div className="flex gap-5 flex-wrap">
                                {[
                                    { n: programs.length, l: "Programs" },
                                    { n: totalModules, l: "Modules" },
                                    { n: totalSections, l: "Sections" },
                                    { n: totalLessons, l: "Lessons" },
                                ].map(({ n, l }) => (
                                    <div key={l}>
                                        <p className="text-xl font-black text-[#0F1C80] leading-none">{n}</p>
                                        <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">{l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:flex shrink-0 flex-col items-center text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-[#DDE0FF] p-4 w-40">
                            <span className="text-2xl mb-1.5">🏗️</span>
                            <p className="text-xs font-black text-[#0D1240] mb-1 leading-tight">LMS Builder</p>
                            <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">Programs → Modules → Sections → Lessons</p>
                            <div className="w-full py-2 rounded-xl text-xs font-black text-white text-center"
                                style={{ background: NAVY }}>
                                4 Level Deep
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps indicator */}
                {!editingModule && (
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                        <StepBadge n="1" label="Create Program" active={true} />
                        <ChevronRight size={12} className="text-gray-300" />
                        <StepBadge n="2" label="Add Modules" active={true} />
                        <ChevronRight size={12} className="text-gray-300" />
                        <StepBadge n="3" label="Edit → Sections" active={false} />
                        <ChevronRight size={12} className="text-gray-300" />
                        <StepBadge n="4" label="Add Lessons" active={false} />
                    </div>
                )}

                {/* Main content */}
                {editingModule ? (
                    <ModuleEditor
                        program={editingModule.program}
                        module={editingModule.module}
                        api={api}
                        onBack={() => setEditing(null)}
                        onModuleUpdate={handleModuleUpdate}
                    />
                ) : (
                    <ProgramsList
                        programs={programs}
                        loading={loading}
                        api={api}
                        onUpdate={handleProgramUpdate}
                        onCreate={handleProgramCreate}
                        onDelete={handleProgramDelete}
                    />
                )}
            </div>
        </>
    );
}