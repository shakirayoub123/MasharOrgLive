import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

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
                    <FaWhatsapp size={28} color="#fff" />
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
                                <FaWhatsapp size={24} color="#fff" />
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
