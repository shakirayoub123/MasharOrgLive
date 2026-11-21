import React, { useEffect } from "react";
import { X, Download, ExternalLink, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarViewModal({
    isOpen,
    onClose,
    pdfUrl,
    fileName = "Mashar Training Program Calendar 2026-2027.pdf"
}) {
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0c122c]/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 z-10">
                {/* Header */}
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-b border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f39300]/10 text-[#f39300] flex items-center justify-center flex-shrink-0">
                            <CalendarIcon size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-spartan font-bold text-[15px] sm:text-[18px] text-[#1e2554] truncate leading-tight">
                                Mashar Training Program Calendar 2026–2027
                            </h3>
                            <p className="font-poppins text-[11px] sm:text-[12.5px] text-gray-500 truncate hidden xs:block">
                                Preview upcoming cohorts, schedules, and certification journeys
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                        {/* Open in full tab (optional) */}
                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 hover:border-[#1e2554] text-[#1e2554] font-poppins text-xs font-medium transition-colors"
                            title="Open in new tab"
                        >
                            <ExternalLink size={14} />
                            <span>Full Tab</span>
                        </a>

                        {/* Download button */}
                        <a
                            href={pdfUrl}
                            download={fileName}
                            className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#f39300] hover:bg-[#d97f00] text-white font-poppins font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
                        >
                            <Download size={15} />
                            <span>Download PDF</span>
                        </a>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black flex items-center justify-center transition-colors ml-1"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer Body */}
                <div className="flex-1 bg-gray-100 relative overflow-hidden">
                    <object
                        data={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <iframe
                            src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                            className="w-full h-full border-0"
                            title="Mashar Training Program Calendar 2026-2027"
                        >
                            <div className="flex flex-col items-center justify-center p-6 text-center h-full bg-white">
                                <CalendarIcon size={48} className="text-[#f39300] mb-3" />
                                <h4 className="font-spartan font-bold text-lg text-[#1e2554] mb-1">
                                    Mashar Training Calendar 2026–2027
                                </h4>
                                <p className="font-poppins text-sm text-gray-600 max-w-md mb-5">
                                    Your browser doesn't preview PDFs directly inline. Click below to view in a full tab or download the file.
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <a
                                        href={pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-[#1e2554] text-white rounded-full font-poppins text-sm font-semibold hover:bg-[#151a3d] transition-colors"
                                    >
                                        Open in New Tab
                                    </a>
                                    <a
                                        href={pdfUrl}
                                        download={fileName}
                                        className="px-5 py-2.5 bg-[#f39300] text-white rounded-full font-poppins text-sm font-semibold hover:bg-[#d97f00] transition-colors"
                                    >
                                        Download PDF
                                    </a>
                                </div>
                            </div>
                        </iframe>
                    </object>
                </div>
            </div>
        </div>
    );
}

