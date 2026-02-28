import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap, FolderOpen, FileText, Trash2, Pencil,
    Check, X, Plus, ChevronDown, ChevronRight, Loader2, AlertCircle,
    BookOpen, Layers, AlignLeft, Image, Film,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const NAVY   = "#0F1C80";
const ORANGE = "#F38900";

function useAdminAxios() {
    const { adminToken } = useAuth();
    return {
        get: (url) => axios.get(`/api${url}`, { headers: { Authorization: `Bearer ${adminToken}` } }),
        patch: (url, data) => axios.patch(`/api${url}`, data, { headers: { Authorization: `Bearer ${adminToken}` } }),
        delete: (url) => axios.delete(`/api${url}`, { headers: { Authorization: `Bearer ${adminToken}` } }),
    };
}

// Lesson type meta
const LESSON_META = {
    text:  { icon: <AlignLeft size={13}/>, color: "#0F1C80", bg: "#EEF0FF", label: "Text" },
    pdf:   { icon: <FileText  size={13}/>, color: "#F38900", bg: "#FFF4E0", label: "PDF" },
    image: { icon: <Image     size={13}/>, color: "#2D8A4E", bg: "#F0FFF4", label: "Image" },
    video: { icon: <Film      size={13}/>, color: "#6B46C1", bg: "#FAF5FF", label: "Video" },
};

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                        <AlertCircle size={16} className="text-red-500" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Confirm Delete</p>
                </div>
                <div className="px-6 py-5">
                    <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
                </div>
                <div className="px-6 pb-5 flex gap-3">
                    <button onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-red-200"
                        style={{ background: "#dc2626" }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── LESSON ROW ───────────────────────────────────────────────────────────────
function LessonRow({ lesson, index }) {
    const meta = LESSON_META[lesson.type] || LESSON_META.text;
    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl border transition-all"
             style={{ borderColor: "#E2E8F0", background: "#FAFBFF", animation: "fadeUp .15s ease both", animationDelay: `${index * 0.03}s` }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                 style={{ background: meta.bg, color: meta.color }}>
                {meta.icon}
            </div>
            <span className="flex-1 text-xs font-semibold text-slate-700 truncate">{lesson.label}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase"
                  style={{ background: meta.bg, color: meta.color }}>
                {meta.label}
            </span>
        </div>
    );
}

// ─── SECTION ROW ──────────────────────────────────────────────────────────────
function SectionRow({ section, sIdx }) {
    const [open, setOpen] = useState(false);
    const lessons = section.lessons || [];

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button onClick={() => setOpen(o => !o)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-all">
                <ChevronDown size={13} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                     style={{ background: NAVY, color: "#fff" }}>
                    {sIdx + 1}
                </div>
                <span className="flex-1 text-xs font-bold text-slate-700 truncate">{section.label}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: "#EEF0FF", color: NAVY }}>
                    {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                </span>
            </button>
            {open && lessons.length > 0 && (
                <div className="border-t border-slate-100 px-4 py-2 space-y-1.5">
                    {lessons.map((lesson, li) => (
                        <LessonRow key={lesson._id || li} lesson={lesson} index={li} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── MODULE ROW ───────────────────────────────────────────────────────────────
function ModuleRow({ program, module: mod, onDeleteModule, onRenameModule }) {
    const [open, setOpen] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [moduleName, setModuleName] = useState(mod.label);
    const [confirmDel, setConfirmDel] = useState(false);
    const sections = mod.sections || [];
    const totalLessons = sections.reduce((a, s) => a + (s.lessons?.length || 0), 0);
    const modId = mod.id || mod._id;
    const progId = program.id || program._id;

    return (
        <>
            {confirmDel && (
                <ConfirmModal
                    message={`Delete module "${mod.label}" and all its ${sections.length} section(s) and ${totalLessons} lesson(s)?`}
                    onConfirm={() => { onDeleteModule(progId, modId); setConfirmDel(false); }}
                    onCancel={() => setConfirmDel(false)}
                />
            )}

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
                <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => setOpen(o => !o)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 text-left group">
                        <ChevronDown size={15} className={`text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
                        <FolderOpen size={15} className="shrink-0" style={{ color: ORANGE }} />
                        {editingName ? (
                            <input value={moduleName} onChange={e => setModuleName(e.target.value)} autoFocus
                                onClick={e => e.stopPropagation()}
                                className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                onKeyDown={e => {
                                    if (e.key === "Enter") { onRenameModule(progId, modId, moduleName); setEditingName(false); }
                                    if (e.key === "Escape") { setModuleName(mod.label); setEditingName(false); }
                                }} />
                        ) : (
                            <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#0F1C80] transition-colors">
                                {mod.label}
                            </span>
                        )}
                    </button>

                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: "#EEF0FF", color: NAVY, border: "1px solid #DDE0FF" }}>
                        {sections.length} sec · {totalLessons} lessons
                    </span>

                    {editingName ? (
                        <div className="flex gap-1 shrink-0">
                            <button onClick={() => { onRenameModule(progId, modId, moduleName); setEditingName(false); }}
                                className="w-7 h-7 rounded-lg text-white flex items-center justify-center transition-all"
                                style={{ background: ORANGE }}>
                                <Check size={11} />
                            </button>
                            <button onClick={() => { setModuleName(mod.label); setEditingName(false); }}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                                <X size={11} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => { setEditingName(true); setOpen(true); }}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-[#0F1C80] hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-center transition-all">
                                <Pencil size={11} />
                            </button>
                            <button onClick={() => setConfirmDel(true)}
                                className="w-7 h-7 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all">
                                <Trash2 size={11} />
                            </button>
                        </div>
                    )}
                </div>

                {open && (
                    <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-3 space-y-2">
                        {sections.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-3">
                                No sections in this module yet. Go to{" "}
                                <a href="/admin/programs/manage" className="font-bold hover:underline" style={{ color: ORANGE }}>Programs Manager →</a>
                                {" "}to add sections and lessons.
                            </p>
                        ) : (
                            sections.map((sec, si) => (
                                <SectionRow key={sec._id || si} section={sec} sIdx={si} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

// ─── PROGRAM CARD ─────────────────────────────────────────────────────────────
function ProgramCard({ program, onDeleteProgram, onDeleteModule, onRenameModule, index }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [confirmDel, setConfirmDel] = useState(false);
    const progId = program.id || program._id;
    const modules = program.modules || [];
    const totalSections = modules.reduce((a, m) => a + (m.sections?.length || 0), 0);
    const totalLessons = modules.reduce((a, m) => a + (m.sections || []).reduce((b, s) => b + (s.lessons?.length || 0), 0), 0);

    return (
        <>
            {confirmDel && (
                <ConfirmModal
                    message={`Delete program "${program.label}" and all its modules, sections and lessons? This cannot be undone.`}
                    onConfirm={() => { onDeleteProgram(progId); setConfirmDel(false); }}
                    onCancel={() => setConfirmDel(false)}
                />
            )}

            <div
                className="bg-white rounded-2xl border overflow-hidden"
                style={{
                    borderColor: "#E2E8F0",
                    borderLeft: `4px solid transparent`,
                    backgroundImage: `linear-gradient(white, white), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    boxShadow: "0 1px 4px rgba(15,28,128,.05)",
                    animation: "fadeUp .25s ease both",
                    animationDelay: `${index * 0.07}s`,
                }}
            >
                {/* Program header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button onClick={() => setOpen(o => !o)}
                            className="flex items-center gap-3 flex-1 min-w-0 text-left group">
                            <div className="w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 transition-all"
                                 style={{ background: "#EEF0FF", borderColor: "#DDE0FF" }}>
                                {program.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-800 truncate group-hover:text-[#0F1C80] transition-colors">
                                    {program.label}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    {modules.length} module{modules.length !== 1 ? "s" : ""} · {totalSections} section{totalSections !== 1 ? "s" : ""} · {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => navigate("/admin/programs/manage")}
                            className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-black rounded-xl transition-all shadow-sm"
                            style={{ background: ORANGE, boxShadow: `0 4px 12px ${ORANGE}33` }}>
                            <Plus size={12} /> Manage
                        </button>
                        <button onClick={() => setConfirmDel(true)}
                            className="w-9 h-9 rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Modules list */}
                {open && (
                    <div className="p-4 space-y-2">
                        {modules.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <FolderOpen size={28} className="text-slate-200 mb-2" />
                                <p className="text-sm font-bold text-slate-400">No modules yet</p>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    Go to{" "}
                                    <button onClick={() => navigate("/admin/programs/manage")}
                                        className="font-bold hover:underline" style={{ color: ORANGE }}>
                                        Programs Manager
                                    </button>{" "}
                                    to create modules, sections and lessons.
                                </p>
                            </div>
                        ) : (
                            modules.map(mod => (
                                <ModuleRow
                                    key={mod.id || mod._id}
                                    program={program}
                                    module={mod}
                                    onDeleteModule={onDeleteModule}
                                    onRenameModule={onRenameModule}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminProgramsList() {
    const api = useAdminAxios();
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/programs")
            .then(r => setPrograms(r.data.data || []))
            .catch(() => setPrograms([]))
            .finally(() => setLoading(false));
    }, []);

    // ── Delete Program ────────────────────────────────────────────────────────
    async function handleDeleteProgram(progId) {
        try { await api.delete(`/admin/programs/${progId}`); } catch { }
        setPrograms(prev => prev.filter(p => (p.id || p._id) !== progId));
        toast.success("Program deleted.");
    }

    // ── Rename Module ─────────────────────────────────────────────────────────
    async function handleRenameModule(programId, moduleId, newLabel) {
        try { await api.patch(`/admin/programs/${programId}/modules/${moduleId}`, { label: newLabel }); } catch { }
        setPrograms(prev => prev.map(p => (p.id || p._id) === programId
            ? { ...p, modules: p.modules.map(m => (m.id || m._id) === moduleId ? { ...m, label: newLabel } : m) } : p));
        toast.success("Module renamed.");
    }

    // ── Delete Module ─────────────────────────────────────────────────────────
    async function handleDeleteModule(programId, moduleId) {
        try { await api.delete(`/admin/programs/${programId}/modules/${moduleId}`); } catch { }
        setPrograms(prev => prev.map(p => (p.id || p._id) === programId
            ? { ...p, modules: p.modules.filter(m => (m.id || m._id) !== moduleId) } : p));
        toast.success("Module deleted.");
    }

    const totalModules  = programs.reduce((a, p) => a + (p.modules?.length || 0), 0);
    const totalSections = programs.reduce((a, p) => a + (p.modules || []).reduce((b, m) => b + (m.sections?.length || 0), 0), 0);
    const totalLessons  = programs.reduce((a, p) => a + (p.modules || []).reduce((b, m) => b + (m.sections || []).reduce((c, s) => c + (s.lessons?.length || 0), 0), 0), 0);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .plroot * { font-family: 'DM Sans', sans-serif; }
                .plroot h1 { font-family: 'Sora', sans-serif; }
                @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
            `}</style>

            <div className="plroot space-y-6 pb-12">

                {/* Header banner */}
                <div className="relative rounded-2xl overflow-hidden"
                     style={{
                         border: `1px solid #DDE0FF`,
                         borderLeft: `4px solid transparent`,
                         backgroundImage: `linear-gradient(135deg, #EEF0FF 0%, #E5E8FF 55%, #FFF4E0 100%), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
                         backgroundOrigin: "border-box",
                         backgroundClip: "padding-box, border-box",
                     }}>
                    <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border-2 border-[#0F1C80]/5 pointer-events-none"/>
                    <div className="relative flex items-center justify-between gap-4 px-7 py-6">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-1.5 bg-[#0F1C80]/8 border border-[#0F1C80]/15 rounded-full px-3 py-1 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0F1C80]"/>
                                <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px]">Admin · All Programs</span>
                            </div>
                            <h1 className="font-black text-[#0D1240] text-2xl leading-tight mb-2">Programs Overview</h1>
                            <p className="text-sm text-gray-500 mb-4 max-w-md">
                                View all programs, modules, sections and lessons at a glance. Manage content from the Programs Manager.
                            </p>
                            <div className="flex gap-5 flex-wrap">
                                {[
                                    { n: programs.length, l: "Programs" },
                                    { n: totalModules,    l: "Modules" },
                                    { n: totalSections,   l: "Sections" },
                                    { n: totalLessons,    l: "Lessons" },
                                ].map(({ n, l }) => (
                                    <div key={l}>
                                        <p className="text-xl font-black leading-none" style={{ color: NAVY }}>{n}</p>
                                        <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">{l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => navigate("/admin/programs/manage")}
                                className="hidden md:flex items-center gap-2 px-5 py-3 text-white text-sm font-black rounded-xl transition-all shrink-0"
                                style={{ background: ORANGE, boxShadow: `0 6px 20px ${ORANGE}44` }}>
                            <Plus size={15} /> Programs Manager
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 size={28} className="animate-spin" style={{ color: NAVY }} />
                    </div>
                ) : programs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-24 text-center">
                        <GraduationCap size={52} className="text-slate-200 mb-4" />
                        <h2 className="text-lg font-black text-slate-600 mb-1">No programs yet</h2>
                        <p className="text-sm text-slate-400 mb-6">Create your first program to start building your curriculum.</p>
                        <button onClick={() => navigate("/admin/programs/manage")}
                            className="flex items-center gap-2 px-6 py-3 text-white text-sm font-black rounded-xl transition-all"
                            style={{ background: ORANGE, boxShadow: `0 6px 20px ${ORANGE}44` }}>
                            <Plus size={15} /> Create First Program
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {programs.map((program, i) => (
                            <ProgramCard
                                key={program.id || program._id}
                                program={program}
                                index={i}
                                onDeleteProgram={handleDeleteProgram}
                                onDeleteModule={handleDeleteModule}
                                onRenameModule={handleRenameModule}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}