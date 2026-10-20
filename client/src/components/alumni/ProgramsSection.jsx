import { useState, useRef, useEffect } from "react";
import API from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#0F1C80", ORANGE = "#F38900";

// Cards: NO left border gradient
const cardStyle = {
    background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0",
    boxShadow: "0 1px 4px rgba(15,28,128,.05)", overflow: "hidden",
};

function getAllLessons(prog) {
    const all = [];
    (prog.modules || []).forEach(m => (m.sections || []).forEach(s =>
        (s.lessons || []).forEach(l => all.push({ ...l, modLabel: m.label, secLabel: s.label }))
    ));
    return all;
}
function countLessons(prog) {
    return (prog.modules || []).reduce((a, m) =>
        a + (m.sections || []).reduce((b, s) => b + (s.lessons?.length || 0), 0), 0);
}

function CheckCircle({ size = 18 }) {
    return (<svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#2D8A4E" />
        <path d="M5.5 10.5l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);
}
function ChevronRight({ size = 18 }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
}

function ProgressBar({ done, total }) {
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return (<div>
        <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black" style={{ color: ORANGE }}>{done}/{total} Lessons</span>
            <span className="text-xs font-black" style={{ color: ORANGE }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#FFE4B0] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg,${ORANGE},#d67600)` }} />
        </div>
    </div>);
}

const TICON = { text: "📖", pdf: "📄", image: "🖼️", video: "🎬" };

/* ── Lesson Content ─────────────────────────────────────────────────────────── */
function LessonContent({ lesson }) {
    if (!lesson) return null;
    const hasText = !!lesson.text;
    const hasVideo = !!lesson.videoUrl;
    const hasImg = !!lesson.imageUrl || (lesson.url && (lesson.mimetype?.startsWith("image/") || lesson.url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)));
    const hasPdf = !!lesson.pdfUrl || (lesson.url && !hasImg);
    const imgSource = lesson.imageUrl || (hasImg ? lesson.url : null);
    const pdfSource = lesson.pdfUrl || (hasPdf ? lesson.url : null);

    return (<div className="space-y-6">
        {hasText && (
            <div className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap font-medium">{lesson.text}</div>
        )}
        {hasVideo && (
            <div className="rounded-2xl overflow-hidden border border-[#DDE0FF] bg-black aspect-video shadow-sm">
                {lesson.videoUrl.includes("youtube") || lesson.videoUrl.includes("youtu.be")
                    ? <iframe src={lesson.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} className="w-full h-full" allowFullScreen title={lesson.label} />
                    : lesson.videoUrl.includes("vimeo")
                        ? <iframe src={`https://player.vimeo.com/video/${lesson.videoUrl.split("/").pop()}`} className="w-full h-full" allowFullScreen title={lesson.label} />
                        : <video src={lesson.videoUrl} controls className="w-full h-full" />}
            </div>
        )}
        {hasImg && (
            <div className="rounded-2xl overflow-hidden border border-[#DDE0FF] bg-[#F8F9FF] flex justify-center p-2 shadow-sm">
                <img src={imgSource} alt={lesson.label} className="w-full max-h-[600px] object-contain rounded-xl" />
            </div>
        )}
        {hasPdf && (
            <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-[#DDE0FF] bg-gray-50 shadow-sm" style={{ height: 600 }}>
                    <iframe src={pdfSource} className="w-full h-full" title={lesson.label} />
                </div>
                <div className="flex justify-end">
                    <a href={pdfSource} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:-translate-y-0.5"
                        style={{ background: ORANGE, boxShadow: `0 4px 14px ${ORANGE}44` }}>
                        ⬇ Open & Download PDF
                    </a>
                </div>
            </div>
        )}
    </div>);
}

/* ── Lesson Detail View ─────────────────────────────────────────────────────── */
function LessonView({ lesson, allLessons, lessonIdx, completed, onComplete, onNav, onBack }) {
    const isDone = completed.has(lesson._id || lesson.id);
    const next = allLessons[lessonIdx + 1] || null;

    return (<div style={{ animation: "panelIn .25s ease" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-black mb-4 transition-all"
            style={{ color: NAVY }}
            onMouseEnter={e => e.currentTarget.style.color = ORANGE}
            onMouseLeave={e => e.currentTarget.style.color = NAVY}>← Back to Program</button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
            <div style={cardStyle}>
                <div className="px-6 py-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: ORANGE }}>{lesson.secLabel}</p>
                            <h2 className="font-black text-[#0D1240] text-xl leading-snug">{lesson.label}</h2>
                        </div>
                        {isDone ? (
                            <button onClick={() => onComplete(lesson._id || lesson.id)}
                                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black shrink-0 transition-all animate-in fade-in zoom-in duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                style={{ background: "#F0FFF4", color: "#2D8A4E", border: "1px solid #C6F6D5" }}>
                                <div className="group-hover:hidden flex items-center gap-1.5">
                                    <CheckCircle size={14} /> Completed
                                </div>
                                <div className="hidden group-hover:flex items-center gap-1.5">
                                    <span className="text-sm">↩</span> Unmark?
                                </div>
                            </button>
                        ) : (
                            <button onClick={() => onComplete(lesson._id || lesson.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all text-white shrink-0 hover:scale-105 active:scale-95 shadow-md"
                                style={{ background: ORANGE }}>
                                Mark as Complete
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">About this Lesson</p>
                    <LessonContent lesson={lesson} />
                    <div className="h-px bg-[#EEF0FF] -mx-6 my-5" />

                    {next && (
                        <div className="pt-6 border-t border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Up Next</p>
                            <button onClick={() => onNav(lessonIdx + 1)}
                                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-orange-200 hover:shadow-lg group">
                                <div className="w-12 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white border border-gray-100 group-hover:border-orange-100 transition-colors">
                                    {TICON[next.type] || "📖"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 mb-0.5 group-hover:text-orange-400 transition-colors">Lesson {lessonIdx + 2}</p>
                                    <p className="text-sm font-black text-[#0D1240] truncate">{next.label}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 border border-gray-100 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all">
                                    <ChevronRight size={16} />
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ ...cardStyle, position: "sticky", top: "1rem" }}>
                <div className="px-4 py-3 border-b border-[#EEF0FF] flex items-center justify-between">
                    <p className="font-black text-[#0D1240] text-sm">Lessons</p>
                    <span className="text-[10px] font-bold text-gray-400">{allLessons.length}</span>
                </div>
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {allLessons.map((l, i) => {
                        const active = i === lessonIdx;
                        const done = completed.has(l._id || l.id);
                        return (<button key={l._id || i} onClick={() => onNav(i)}
                            className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#EEF0FF] text-left transition-all"
                            style={active ? { background: "#FFF4E0", borderLeft: `4px solid ${ORANGE}` } : {}}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F8F9FF"; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = ""; }}>
                            <span className="text-[10px] font-black w-5 text-center shrink-0"
                                style={{ color: active ? ORANGE : "#D1D5DB" }}>{i + 1}</span>
                            <div className="w-10 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
                                style={{ background: active ? "#DDE0FF" : "#F3F4F6" }}>
                                {TICON[l.type] || "📖"}
                            </div>
                            <p className={`flex-1 text-xs leading-snug truncate ${active ? "font-black text-[#0D1240]" : "font-medium text-gray-600"}`}>{l.label}</p>
                            {done && <CheckCircle size={16} />}
                        </button>);
                    })}
                </div>
                <div className="px-4 py-3 flex gap-2">
                    <button onClick={() => lessonIdx > 0 && onNav(lessonIdx - 1)} disabled={lessonIdx === 0}
                        className="flex-1 py-2 rounded-xl text-xs font-black"
                        style={lessonIdx === 0 ? { background: "#F3F4F6", color: "#D1D5DB" } : { background: "#EEF0FF", color: NAVY }}>← Prev</button>
                    <button onClick={() => lessonIdx < allLessons.length - 1 && onNav(lessonIdx + 1)}
                        disabled={lessonIdx >= allLessons.length - 1}
                        className="flex-1 py-2 rounded-xl text-xs font-black text-white"
                        style={lessonIdx >= allLessons.length - 1 ? { background: "#D1D5DB" } : { background: NAVY }}>Next →</button>
                </div>
            </div>
        </div>
    </div>);
}

/* ── Program Overview ───────────────────────────────────────────────────────── */
function ProgramOverview({ program, completed, onSelectLesson, onBack }) {
    const [expandedMods, setExpanded] = useState({});
    const total = countLessons(program);

    return (<div style={{ animation: "panelIn .25s ease" }}>
        <button onClick={onBack}
            className="flex items-center gap-2 text-xs font-black mb-4 transition-all"
            style={{ color: NAVY }}
            onMouseEnter={e => e.currentTarget.style.color = ORANGE}
            onMouseLeave={e => e.currentTarget.style.color = NAVY}>
            ← Back to All Programs
        </button>

        {/* Hero */}
        <div className="relative rounded-[2rem] overflow-hidden mb-8 shadow-sm"
            style={{
                background: `linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)`,
                border: "1px solid #DDE0FF",
                borderLeft: `4px solid ${NAVY}`,
                minHeight: 160
            }}>
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-48 h-48 bg-orange-500/5 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />

            <div className="relative px-8 py-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-3xl">
                    {program.icon}
                </div>
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F1C80]/8 border border-[#0F1C80]/15 mb-2">
                        <span className="w-1 h-1 rounded-full bg-[#0F1C80]" />
                        <span className="text-[8px] font-black text-[#0F1C80] uppercase tracking-wider">PROGRAM OVERVIEW</span>
                    </div>
                    <h1 className="font-black text-[#0D1240] text-2xl lg:text-3xl leading-tight">{program.label}</h1>
                </div>
                <button onClick={() => {
                    const all = getAllLessons(program);
                    if (all.length) onSelectLesson(0, all);
                }} className="px-10 py-3 rounded-xl text-sm font-black text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: ORANGE, boxShadow: `0 6px 20px rgba(243,137,0,.3)` }}>
                    {completed.size > 0 ? "Continue Lesson →" : "Start Lesson →"}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
            <div className="space-y-3">
                {(program.modules || []).map((mod, mi) => {
                    const mid = mod._id || mod.id;
                    const isOpen = expandedMods[mid];
                    const modLessons = (mod.sections || []).reduce((a, s) => [...a, ...(s.lessons || [])], []);
                    const doneMod = modLessons.filter(l => completed.has(l._id || l.id)).length;

                    return (<div key={mid} style={cardStyle}>
                        <button className="w-full flex items-center gap-4 px-5 py-4 text-left"
                            onClick={() => setExpanded(p => ({ ...p, [mid]: !p[mid] }))}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black shrink-0 text-sm"
                                style={{ background: "#EEF0FF", color: NAVY }}>{mi + 1}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-[#0D1240] text-sm">{mod.label}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                    {(mod.sections || []).length} sections · {modLessons.length} lessons
                                    {doneMod > 0 && ` · ${doneMod} done`}
                                </p>
                            </div>
                            {doneMod === modLessons.length && modLessons.length > 0 && <CheckCircle size={18} />}
                            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-gray-300 shrink-0 transition-transform"
                                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>

                        {isOpen && (<div className="border-t border-[#EEF0FF]">
                            {(mod.sections || []).map((sec, si) => (<div key={sec._id || si}>
                                <div className="px-5 py-2 flex items-center gap-2" style={{ background: "#F8F9FF", borderBottom: "1px solid #EEF0FF" }}>
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: ORANGE }}>{sec.label}</span>
                                </div>
                                {(sec.lessons || []).map((lesson, li) => {
                                    const lid = lesson._id || lesson.id;
                                    const isDone = completed.has(lid);
                                    const allL = getAllLessons(program);
                                    const gIdx = allL.findIndex(l => (l._id || l.id) === lid);
                                    return (<button key={lid || li} onClick={() => onSelectLesson(gIdx, allL)}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 border-b border-[#EEF0FF] text-left transition-all hover:bg-[#F8F9FF]">
                                        <div className="w-12 h-9 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ background: "#EEF0FF" }}>
                                            {TICON[lesson.type] || "📖"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#0D1240] text-sm leading-snug">{lesson.label}</p>
                                            {lesson.text && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{lesson.text}</p>}
                                        </div>
                                        {isDone && <CheckCircle size={18} />}
                                    </button>);
                                })}
                            </div>))}
                        </div>)}
                    </div>);
                })}
            </div>

            <div className="lg:sticky lg:top-4" style={cardStyle}>
                <div className="px-5 py-5 space-y-4">
                    <ProgressBar done={completed.size} total={total} />
                </div>
            </div>
        </div>
    </div>);
}

/* ── Program Picker ─────────────────────────────────────────────────────────── */
function ProgramPicker({ programs, completed, onSelect }) {
    const totalLessons = programs.reduce((a, p) => a + countLessons(p), 0);
    const totalModules = programs.reduce((a, p) => a + (p.modules || []).length, 0);
    const totalSections = programs.reduce((a, p) =>
        a + (p.modules || []).reduce((b, m) => b + (m.sections || []).length, 0), 0);
    const donePct = totalLessons === 0 ? 0 : Math.round((completed.size / totalLessons) * 100);

    return (<div style={{ animation: "cardIn .3s ease" }}>

        {/* ── Hero Header with left-only gradient bar ── */}
        <div style={{ display: "flex", marginBottom: 20, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,28,128,.05)" }}>
            {/* Left gradient bar — fully rounded on left side */}
            <div style={{
                width: 5,
                flexShrink: 0,
                background: `linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
                borderRadius: "16px 0 0 16px",
            }} />
            {/* Content area */}
            <div className="relative flex-1 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg,#EEF0FF 0%,#E5E8FF 55%,#FFF4E0 100%)",
                    border: "1px solid #E2E8F0",
                    borderLeft: "none",
                    borderRadius: "0 16px 16px 0",
                }}>
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border-2 border-[#0F1C80]/5 pointer-events-none" />
                <div className="absolute right-16 bottom-[-50px] w-28 h-28 rounded-full border-2 border-[#F38900]/7 pointer-events-none" />

                <div className="px-8 py-7">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
                        style={{ background: "rgba(15,28,128,.08)", border: "1px solid rgba(15,28,128,.15)" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: NAVY }} />
                        <span className="text-[9px] font-black uppercase tracking-[1.2px]" style={{ color: NAVY }}>Alumni · Learning Portal</span>
                    </div>

                    <h1 className="font-black text-[#0D1240] text-2xl leading-tight mb-1">My Programs 📚</h1>
                    <p className="text-sm text-gray-500 mb-5">Continue your learning journey or explore new programs below</p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 flex-wrap">
                        {[
                            { val: programs.length, label: "Programs" },
                            { val: totalModules, label: "Modules" },
                            { val: totalSections, label: "Sections" },
                            { val: totalLessons, label: "Lessons" },
                            { val: completed.size, label: "Completed" },
                        ].map((s, i, arr) => (
                            <div key={s.label} className="flex items-center gap-6">
                                <div>
                                    <p className="text-xl font-black text-[#0D1240] leading-none">{s.val}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mt-0.5">{s.label}</p>
                                </div>
                                {i < arr.length - 1 && <div className="w-px self-stretch bg-[#DDE0FF]" />}
                            </div>
                        ))}
                    </div>

                    {/* Overall progress pill */}
                    {totalLessons > 0 && (
                        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-white border border-[#DDE0FF]">
                            <span className="text-xs text-gray-500 font-semibold">Overall progress</span>
                            <div className="w-20 h-1.5 rounded-full bg-[#FFE4B0] overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${donePct}%`, background: `linear-gradient(90deg,${ORANGE},#d67600)` }} />
                            </div>
                            <span className="text-xs font-black" style={{ color: ORANGE }}>{donePct}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Program Cards — clean, no left border */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programs.map((prog, pi) => {
                const total = countLessons(prog);
                const progDone = getAllLessons(prog).filter(l => completed.has(l._id || l.id)).length;
                const progPct = total === 0 ? 0 : Math.round((progDone / total) * 100);

                return (<button key={prog._id || pi} onClick={() => onSelect(prog)}
                    style={{
                        ...cardStyle, display: "block", textAlign: "left",
                        transition: "transform .2s,box-shadow .2s",
                        animation: "cardIn .3s ease both", animationDelay: `${pi * 0.07}s`
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,28,128,.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,28,128,.05)"; }}>
                    <div className="px-5 py-5">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                                style={{ background: "#EEF0FF", borderColor: "#DDE0FF" }}>{prog.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-[#0D1240] text-sm leading-snug mb-1">{prog.label}</p>
                                <p className="text-[10px] text-gray-400">{(prog.modules || []).length} modules · {total} lessons</p>
                            </div>
                        </div>

                        {/* Per-card progress bar */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-gray-400">{progDone}/{total} lessons done</span>
                                <span className="text-[10px] font-black" style={{ color: ORANGE }}>{progPct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#FFE4B0] overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progPct}%`, background: `linear-gradient(90deg,${ORANGE},#d67600)` }} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                                style={{ background: "#EEF0FF", color: NAVY, border: "1px solid #DDE0FF" }}>
                                {(prog.modules || []).length} Modules
                            </span>
                            <span className="text-xs font-black" style={{ color: ORANGE }}>
                                {progDone > 0 ? "Continue →" : "Start →"}
                            </span>
                        </div>
                    </div>
                </button>);
            })}
        </div>
    </div>);
}

/* ── MAIN ───────────────────────────────────────────────────────────────────── */
export default function ProgramsSection() {
    const { user } = useAuth();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeProgram, setProgram] = useState(null);
    const [activeLesson, setLesson] = useState(null);
    const [completed, setCompleted] = useState(new Set());
    const contentRef = useRef(null);

    useEffect(() => {
        API.get("/alumni/programs")
            .then(r => { const d = r.data.data || []; setPrograms(d); if (d.length === 1) setProgram(d[0]); })
            .catch(() => setPrograms([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!user) return;
        API.get("/alumni/programs/progress").then(r => {
            setCompleted(new Set((r.data.data || []).map(x => x.lessonId)));
        }).catch(() => { });
    }, [user]);

    function handleSelectLesson(idx, all) {
        setLesson({ lesson: all[idx], allLessons: all, lessonIdx: idx });
        if (contentRef.current) setTimeout(() => contentRef.current.scrollTop = 0, 50);
    }
    function handleNav(i) {
        if (!activeLesson) return;
        const { allLessons } = activeLesson;
        if (i < 0 || i >= allLessons.length) return;
        setLesson({ lesson: allLessons[i], allLessons, lessonIdx: i });
        if (contentRef.current) setTimeout(() => contentRef.current.scrollTop = 0, 50);
    }
    async function handleComplete(lid) {
        setCompleted(prev => { const n = new Set(prev); n.has(lid) ? n.delete(lid) : n.add(lid); return n; });
        try { await API.post("/alumni/programs/progress", { lessonId: lid }); } catch { }
    }

    return (<>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
            .avroot *{font-family:'DM Sans',sans-serif}.avroot h1{font-family:'Sora',sans-serif}
            @keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
            @keyframes panelIn{from{opacity:0;transform:translateX(6px)}to{opacity:1;transform:translateX(0)}}
            .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        `}</style>
        <div className="avroot w-full max-w-full overflow-x-hidden" ref={contentRef}>
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 rounded-full border-4 border-[#EEF0FF] border-t-[#0F1C80] animate-spin" />
                </div>
            ) : programs.length === 0 ? (
                <div style={cardStyle}>
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                            style={{ background: "#EEF0FF", border: "1px solid #DDE0FF" }}>📂</div>
                        <p className="font-black text-gray-600 text-base">No programs available yet</p>
                        <p className="text-sm text-gray-400 mt-1">Check back soon.</p>
                    </div>
                </div>
            ) : activeLesson ? (
                <LessonView lesson={activeLesson.lesson} allLessons={activeLesson.allLessons}
                    lessonIdx={activeLesson.lessonIdx} completed={completed}
                    onComplete={handleComplete} onNav={handleNav} onBack={() => setLesson(null)} />
            ) : activeProgram ? (
                <ProgramOverview program={activeProgram} completed={completed}
                    onSelectLesson={handleSelectLesson} onBack={() => setProgram(null)} />
            ) : (
                <ProgramPicker programs={programs} completed={completed} onSelect={p => { setProgram(p); setLesson(null); }} />
            )}
        </div>
    </>);
}