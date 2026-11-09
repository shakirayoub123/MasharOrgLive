import React from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import ArrowButton from "../components/Arrowbutton";

/* ───────────── DATA ───────────── */
const MONTHS_2026 = ["September", "October", "November", "December"];
const MONTHS_2027 = ["January", "March", "April", "May", "June"];

const COLORS = {
    gray: "#8f99ab",
    orange: "#f39300",
    steel: "#4a6894",
    dark: "#1e2b52",
    teal: "#134e4e",
};

// dates order: Sep, Oct, Nov, Dec | Jan, Mar, Apr, May, Jun  ("" = empty cell)
const SECTIONS = [
    {
        title: "Coaching",
        cert: "icf",
        rows: [
            { name: ["Leader", "As A Coach"], dur: ["3 Days", "15 Hours"], bar: "gray", dates: ["15-17", "13-15", "3-5", "1-3", "", "16-18", "", "4-6", "8-10"] },
            { name: ["Coaching", "Essentials"], dur: ["5 Days", "30 Hours"], bar: "orange", dates: ["6-10", "", "8-12", "", "", "21-25", "", "", "13-17"] },
            { name: ["Coaching", "Certificates"], dur: ["5 Days", "30 Hours"], bar: "orange", dates: ["20-24", "", "22-26", "", "", "", "11-15", "", "27- 1"] },
        ],
    },
    {
        title: "Mentoring",
        cert: "emcc",
        rows: [
            { name: ["Mentoring", "Foundation"], dur: ["3 Days", "15 Hours"], bar: "steel", dates: ["", "6-8", "", "", "11-13", "", "6-8", "", "8-10"] },
            { name: ["Mentoring", "Practitioner"], dur: ["5 Days", "30 Hours"], bar: "steel", dates: ["", "18-22", "", "", "17-21", "", "25-29", "", "20-24"] },
        ],
    },
    {
        title: "Leadership & Management",
        cert: "persona",
        rows: [
            { name: ["Personal", "Leadership"], dur: ["5 Days", "25 Hours"], bar: "gray", dates: ["", "25-29", "", "13-17", "", "21-25", "", "9-13", ""] },
            { name: ["Speak, Present &", "influence"], dur: ["3 Days", "15 Hours"], bar: "dark", dates: ["15-17", "27-29", "17-19", "8-10", "", "16-18", "", "", "8-10"] },
        ],
    },
];

const ATTENDEES = [
    { program: "Leader as a Coach", who: "Seniors, Supervisors, Team Leaders & Managers", bar: "gray" },
    { program: "Personal Leadership", who: "All career levels seeking foundational leadership mastery", bar: "gray" },
    { program: "Mentor Foundation", who: "Seniors, Team Leaders, TPL & Managers", bar: "steel" },
    { program: "Mentor Practitioner", who: "Mentor Foundation graduates pursuing advanced mastery", bar: "steel" },
    { program: "Coaching Essentials", who: "Seniors, HR, Training Professionals, Team Leaders & Managers", bar: "orange" },
    { program: "Coaching Certificates", who: "Coaching Essentials graduates preparing for ICF credentials", bar: "orange" },
    { program: "Present, Speak & Influence More", who: "Professionals & leaders at all levels", bar: "teal" },
];

/* ───────────── BADGES ───────────── */
const CertBadge = ({ type }) => {
    if (type === "icf") {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#18785e] to-[#204c77] border-2 border-[#1a385c] flex items-center justify-center text-white font-bold text-[18px] shadow-sm">
                    1
                </div>
                <span className="text-[10px] font-semibold text-[#1f3d7a] mt-1 tracking-wider uppercase">ICF</span>
            </div>
        );
    }
    if (type === "emcc") {
        return (
            <div className="text-center font-poppins">
                <span className="font-bold text-[#1f3d7a] text-[13px] tracking-wide block leading-none">EMCC</span>
                <span className="block font-normal text-[7.5px] text-gray-500 leading-tight mt-0.5">European Mentoring &amp;<br />Coaching Council</span>
                <span className="text-[#f39300] tracking-[3px] text-[10px] block leading-none mt-1">• • • • •</span>
            </div>
        );
    }
    return (
        <div className="text-center">
            <span className="font-serif italic font-bold text-[#2a67b0] text-[17px]">Persona</span>
            <span className="block text-[8px] font-semibold text-gray-500 uppercase tracking-widest">Global</span>
        </div>
    );
};

/* ───────────── COMPONENT ───────────── */
const MasharCalendar = () => {
    const navigate = useNavigate();

    const openCalendly = () => {
        window.open(
            "https://calendly.com/raja-20/15min?month=2026-01",
            "_blank",
            "noopener,noreferrer"
        );
    };

    // column tint alternates
    const tone = (i) => (i % 2 === 0 ? "mc-col-navy" : "mc-col-light");

    return (
        <div className="bg-white min-h-screen font-poppins pb-16">
            <SEO
                title="Public Training Program Schedule (2026–2027) | Mashar"
                description="Mashar Public Training Program Schedule for Coaching (ICF), Mentoring (EMCC), and Leadership & Management."
            />
            <style>{CSS}</style>

            {/* ═════ 1. BRANDED PAGE HEADER ═════ */}
            <header className="pt-10 md:pt-14 pb-8 px-6 md:px-12 text-center max-w-4xl mx-auto">
                <span className="inline-block text-[12px] sm:text-[13px] font-semibold tracking-[2px] uppercase text-[#f39300] bg-orange-50 border border-orange-200/60 px-4 py-1.5 rounded-full mb-3.5 shadow-sm">
                    2026 – 2027 Academic Year
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-spartan text-[#222b60] leading-tight mb-4">
                    Public Training <span className="text-[#f39300]">Program Schedule</span>
                </h1>
                <p className="text-[15px] sm:text-[16px] text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Internationally accredited cohorts in Coaching (ICF), Mentoring (EMCC), and Leadership Development designed for the realities of our region.
                </p>
            </header>

            {/* ═════ 2. SCHEDULE TABLE CONTAINER ═════ */}
            <main className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
                <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm bg-white">
                    {/* Table Header Bar */}
                    <div className="bg-[#223567] text-white py-5 px-6 text-center">
                        <h2 className="font-spartan font-bold text-[22px] sm:text-[26px] tracking-wide">
                            Mashar Public Training Program Schedule
                        </h2>
                        <p className="text-[13px] text-gray-200 font-normal mt-0.5 opacity-90">
                            Cohort Dates &amp; International Accreditation Pathways
                        </p>
                    </div>

                    {/* Year Labels Row */}
                    <div className="grid grid-cols-[1.53fr_1fr] bg-[#1a2950] text-white text-center font-bold text-[18px] sm:text-[22px] tracking-wide border-t border-b border-[#2b3e72]">
                        <div className="py-2.5 border-r border-[#2b3e72]">2026</div>
                        <div className="py-2.5">2027</div>
                    </div>

                    {/* Scrollable Table */}
                    <div className="overflow-x-auto">
                        <table className="mc-table">
                            <colgroup>
                                <col style={{ width: 170 }} />
                                <col style={{ width: 95 }} />
                                <col style={{ width: 110 }} />
                                {MONTHS_2026.map((m) => <col key={m} style={{ minWidth: 84 }} />)}
                                <col style={{ width: 10 }} />
                                {MONTHS_2027.map((m) => <col key={m} style={{ minWidth: 84 }} />)}
                            </colgroup>

                            <thead>
                                <tr>
                                    <th className="mc-th-prog">Program</th>
                                    <th className="mc-th-dur"><div>Duration</div><div>Days / Hours</div></th>
                                    <th className="mc-th-cert"><div>Certification</div><div>Accreditation</div></th>
                                    {MONTHS_2026.map((m, i) => (
                                        <th key={m} className={tone(i)}>{m}</th>
                                    ))}
                                    <th className="mc-gap" />
                                    {MONTHS_2027.map((m, i) => (
                                        <th key={m} className={tone(i)}>{m}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {SECTIONS.map((sec) => (
                                    <React.Fragment key={sec.title}>
                                        <tr className="mc-sec-row">
                                            <td colSpan={13}>
                                                <span className="text-[#f39300] mr-2">✦</span>
                                                {sec.title}
                                            </td>
                                        </tr>

                                        {sec.rows.map((row, r) => (
                                            <tr key={row.name.join("")} className="hover:opacity-95 transition-opacity">
                                                <td className="mc-prog" style={{ "--bar": COLORS[row.bar] }}>
                                                    <span className="font-semibold text-gray-900 block leading-tight">{row.name[0]}</span>
                                                    <span className="text-gray-700 block text-[13px]">{row.name[1]}</span>
                                                </td>
                                                <td className="mc-dur">
                                                    <span className="block font-semibold">{row.dur[0]}</span>
                                                    <span className="block text-[12px] opacity-90">{row.dur[1]}</span>
                                                </td>

                                                {r === 0 && (
                                                    <td className="mc-cert" rowSpan={sec.rows.length}>
                                                        <CertBadge type={sec.cert} />
                                                    </td>
                                                )}

                                                {row.dates.slice(0, 4).map((d, i) => (
                                                    <td key={`a${i}`} className={`${tone(i)} ${d ? "font-bold text-[15px]" : "opacity-30"}`}>
                                                        {d || "—"}
                                                    </td>
                                                ))}
                                                <td className="mc-gap" />
                                                {row.dates.slice(4).map((d, i) => (
                                                    <td key={`b${i}`} className={`${tone(i)} ${d ? "font-bold text-[15px]" : "opacity-30"}`}>
                                                        {d || "—"}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ═════ 3. WHO SHOULD ATTEND SECTION ═════ */}
                <section className="mt-16 md:mt-20">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="inline-block text-[12px] sm:text-[13px] font-semibold tracking-[2px] uppercase text-[#0f1c80] bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-3">
                            Target Audience
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-spartan text-[#222b60] mb-3">
                            Who Should <span className="text-[#f39300]">Attend?</span>
                        </h2>
                        <p className="text-[14px] sm:text-[15px] text-gray-600 max-w-xl mx-auto">
                            Identify the optimal certification track designed for your current leadership role and organizational goals.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm bg-white">
                        {/* Table Header */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] bg-[#223567] text-white font-spartan font-bold text-[17px] sm:text-[19px]">
                            <div className="py-4 px-6 md:px-8 border-b md:border-b-0 md:border-r border-[#33477a]">
                                Program Name
                            </div>
                            <div className="py-4 px-6 md:px-8">
                                Recommended Profile &amp; Role
                            </div>
                        </div>

                        {/* List Rows */}
                        <div className="divide-y divide-gray-100">
                            {ATTENDEES.map((a, idx) => (
                                <div
                                    key={a.program}
                                    className={`grid grid-cols-1 md:grid-cols-[1fr_1.6fr] items-center transition-colors hover:bg-orange-50/40 ${
                                        idx % 2 === 0 ? "bg-white" : "bg-[#fafbfe]"
                                    }`}
                                >
                                    {/* Program Name with Colored Border Indicator */}
                                    <div className="py-4 px-6 md:px-8 relative flex items-center">
                                        <span
                                            className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r"
                                            style={{ backgroundColor: COLORS[a.bar] }}
                                        />
                                        <span className="font-semibold text-[#1e2b52] text-[15px] sm:text-[16px]">
                                            {a.program}
                                        </span>
                                    </div>

                                    {/* Who Should Attend */}
                                    <div className="py-4 px-6 md:px-8 text-gray-700 text-[14px] sm:text-[15px] leading-relaxed">
                                        {a.who}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═════ 4. ENROLLMENT CALL TO ACTION ═════ */}
                <section className="mt-14 mb-8 bg-gradient-to-r from-[#fff9f4] via-[#f8f9fd] to-[#fff9f4] border border-orange-100 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
                    <span className="inline-block text-[12px] font-semibold tracking-[2px] uppercase text-[#f39300] mb-2">
                        Get Started
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-spartan text-[#222b60] mb-3">
                        Ready to Begin Your Growth Journey?
                    </h3>
                    <p className="text-[14px] sm:text-[15px] text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
                        Speak directly with a Mashar Leadership Advisor to discuss individual enrollment, group discounts, or customized cohorts for your organization.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <ArrowButton
                            text="Book a Discovery Call"
                            onClick={openCalendly}
                            textSize="15px"
                        />
                        <ArrowButton
                            text="Explore All Programs"
                            onClick={() => {
                                navigate("/explorePrograms");
                                window.scrollTo(0, 0);
                            }}
                            textSize="15px"
                            className="!bg-[#f39300] hover:!bg-[#d97f00]"
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MasharCalendar;

/* ───────────── STYLES ───────────── */
const CSS = `
.mc-table{width:100%;border-collapse:separate;border-spacing:0 4px;table-layout:fixed;min-width:980px}
.mc-table th,.mc-table td{padding:8px 6px;text-align:center;font-size:14px;vertical-align:middle}

.mc-table thead th{font-size:13.5px;font-weight:700}
.mc-col-navy{background:#2a3d72;color:#fff}
.mc-col-light{background:#eaecf1;color:#1e294b}
.mc-gap{background:transparent!important;width:10px}

.mc-th-prog{text-align:left!important;padding-left:22px!important;background:#eaecf1;color:#1e294b}
.mc-th-dur{background:#2a3d72;color:#fff;padding:0!important}
.mc-th-dur div{height:25px;line-height:25px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.25)}
.mc-th-dur div:last-child{border:0}

.mc-th-cert{background:#eaecf1;color:#1e294b;padding:0!important;font-size:12px}
.mc-th-cert div{height:25px;line-height:25px;border-bottom:1px solid #dcdfe6}
.mc-th-cert div:last-child{border:0}

.mc-sec-row td{background:#fafbfe;height:42px;font-size:15px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#1e2b52;text-align:left;padding-left:22px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb}

.mc-prog{background:#eaecf1;text-align:left!important;padding-left:20px!important;position:relative}
.mc-prog::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--bar)}

.mc-dur{background:#2a3d72;color:#fff;font-size:13.5px!important;line-height:1.2}
.mc-cert{background:#f4f5f8;vertical-align:middle}
`;
