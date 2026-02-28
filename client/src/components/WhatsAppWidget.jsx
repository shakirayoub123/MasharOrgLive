import React, { useEffect, useState } from "react";

export default function WhatsAppWidget({ phone = "971501234567", message = "Hello! I need help with Mashar.", autoShowDelay = null }) {
    const [open, setOpen] = useState(false);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("whatsapp_widget_seen");
        if (hasSeen) {
            setSeen(true);
            return;
        }

        // Only auto-show when a positive delay is provided.
        if (autoShowDelay && typeof autoShowDelay === "number" && autoShowDelay > 0) {
            const t = setTimeout(() => setOpen(true), autoShowDelay);
            return () => clearTimeout(t);
        }

        // otherwise do nothing — widget will open only on user click
    }, [autoShowDelay]);

    const openWhatsApp = () => {
        const phoneNormalized = phone.replace(/[^0-9]/g, "");
        const url = `https://wa.me/${phoneNormalized}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        markSeen();
    };

    const markSeen = () => {
        setOpen(false);
        setSeen(true);
        localStorage.setItem("whatsapp_widget_seen", "1");
    };

    return (
        <>
            {/* Floating button */}
            <div className="fixed z-40 right-6 bottom-6 md:right-8 md:bottom-8 flex items-end">
                <button
                    aria-label="WhatsApp"
                    onClick={openWhatsApp}
                    className="bg-secondary hover:scale-105 transition-transform shadow-lg text-white rounded-full w-14 h-14 flex items-center justify-center"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.01.03C6.47.03 1.8 3.94.53 9.02c-.7 2.5-.35 5.08.98 7.42L0 24l7.8-1.95c2.26 1.22 4.83 1.86 7.45 1.86h.01c5.55 0 10.21-3.9 11.48-8.98.62-2.2.48-4.49-.21-6.51z" fill="#fff" />
                        <path d="M17.6 14.95c-.32-.16-1.88-.93-2.18-1.03-.3-.1-.52-.16-.74.16-.22.32-.86 1.03-1.06 1.24-.2.21-.4.23-.74.08-.32-.16-1.36-.5-2.59-1.6-.96-.86-1.6-1.93-1.78-2.26-.18-.33-.02-.51.13-.67.14-.14.32-.36.48-.54.16-.18.21-.3.32-.5.1-.2.05-.37-.03-.53-.08-.16-.74-1.78-1.02-2.43-.27-.64-.55-.55-.74-.56l-.63-.01c-.21 0-.54.08-.82.37-.27.28-1.04 1.01-1.04 2.46 0 1.45 1.06 2.85 1.21 3.05.15.2 2.09 3.2 5.06 4.49 3.01 1.3 3.01.87 3.55.82.54-.05 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.3-.2-.62-.36z" fill="#fff" />
                    </svg>
                </button>
            </div>

            {/* Modal popup */}
            {open && !seen && (
                <div className="fixed z-50 inset-0 flex items-end md:items-center justify-center p-6 pointer-events-auto">
                    <div className="absolute inset-0 bg-black/40" onClick={markSeen} />
                    <div className="relative w-full max-w-sm bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <button aria-label="Close" onClick={markSeen} className="absolute top-3 right-3 text-gray-500">×</button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.01.03C6.47.03 1.8 3.94.53 9.02c-.7 2.5-.35 5.08.98 7.42L0 24l7.8-1.95c2.26 1.22 4.83 1.86 7.45 1.86h.01c5.55 0 10.21-3.9 11.48-8.98.62-2.2.48-4.49-.21-6.51z" fill="#fff" />
                                    <path d="M17.6 14.95c-.32-.16-1.88-.93-2.18-1.03-.3-.1-.52-.16-.74.16-.22.32-.86 1.03-1.06 1.24-.2.21-.4.23-.74.08-.32-.16-1.36-.5-2.59-1.6-.96-.86-1.6-1.93-1.78-2.26-.18-.33-.02-.51.13-.67.14-.14.32-.36.48-.54.16-.18.21-.3.32-.5.1-.2.05-.37-.03-.53-.08-.16-.74-1.78-1.02-2.43-.27-.64-.55-.55-.74-.56l-.63-.01c-.21 0-.54.08-.82.37-.27.28-1.04 1.01-1.04 2.46 0 1.45 1.06 2.85 1.21 3.05.15.2 2.09 3.2 5.06 4.49 3.01 1.3 3.01.87 3.55.82.54-.05 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.3-.2-.62-.36z" fill="#fff" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">Connect on WhatsApp</h3>
                                <p className="text-sm text-gray-600 mt-1">Chat with us for quick help and inquiries.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button onClick={openWhatsApp} className="flex-1 bg-secondary text-white rounded-md py-2 font-semibold">Open WhatsApp</button>
                            <button onClick={markSeen} className="flex-1 border border-gray-200 rounded-md py-2">Dismiss</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
