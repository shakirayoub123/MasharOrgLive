import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";

const NewsletterPopup = ({ isOpen, onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 👇 Get the form data
        const form = formRef.current;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            await axios.post("/api/subscribers/subscribe", data);
            setSubmitted(true);
            form.reset();
        } catch (error) {
            console.error("Subscription error:", error);
            alert(error?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
            onClick={onClose}
        >
            {/* MODAL */}
            <div
                className="
          relative
          w-full
          max-w-[660px]
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-xl
          font-spartan
        "
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="
            absolute
            top-4
            right-4
            w-9
            h-9
            rounded-full
            border-[1.5px]
            border-[#2B3476]
            flex
            items-center
            justify-center
            z-10
            hover:bg-gray-50
            transition
          "
                >
                    <X className="text-[#2B3476] w-4 h-4" strokeWidth={2.5} />
                </button>

                {/* ================= SUCCESS STATE ================= */}
                {submitted ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14247B] mb-6">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#14247B] mb-2">
                            Thank you
                        </h2>

                        <p className="text-base sm:text[16px] text-gray-600">
                            Your Future Ready Leadership Toolkit is on its way to your inbox
                        </p>
                    </div>
                ) : (
                    /* ================= FORM STATE ================= */
                    <div className="px-6 sm:px-10 py-8 sm:py-10">
                        <h2 className="text-center text-3xl sm:text-4xl font-medium">
                            Welcome To <span className="text-[#F39300]">Mashar</span>
                        </h2>

                        <p className="mt-2 text-center text-[16px] font-semibold text-[#0F1C80]">
                            Where Leadership Grows with Purpose, Clarity and Impact.
                        </p>

                        <p className="font-poppins mt-2 text-[14px] leading-relaxed mb-2 text-center">
                            We're reimagining leadership for a world that's changing fast.
                            <br />
                            Join our leadership community and receive early access to new <br />
                            programs, a free Future Ready Leadership Toolkit, and exclusive <br />
                            insights shared first.
                        </p>

                        {/* FORM */}
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="mt-4 flex flex-col gap-4"
                        >
                            <input
                                type="text"
                                name="user_name"
                                placeholder="Full Name"
                                required
                                className="w-full rounded-lg border border-[#0F1C80] px-4 py-3 text-sm"
                            />

                            <input
                                type="email"
                                name="user_email"
                                placeholder="Email Address"
                                required
                                className="w-full rounded-lg border border-[#0F1C80] px-4 py-3 text-sm"
                            />

                            <input
                                type="text"
                                name="company"
                                placeholder="Company"
                                className="w-full rounded-lg border border-[#0F1C80] px-4 py-3 text-sm"
                            />

                            <label className="flex items-start gap-3 text-[15px] text-gray-900">
                                <input type="checkbox" className="mt-1 h-4 w-4" />
                                <span>
                  Yes, I’d like to receive leadership insights and updates from Mashar.
                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0F1C80] py-3 sm:py-4 text-base sm:text-lg font-medium text-white transition hover:bg-[#0c1766] disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    "Download the Toolkit"
                                )}
                            </button>
                        </form>

                        <p className="mt-5 text-center text-[8px] sm:text-[10px] text-gray-600">
                            Your data is respected. Unsubscribe anytime.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterPopup;
