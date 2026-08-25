import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DiscoveryModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        helpTopic: "",
        challenge: "",
        receiveUpdates: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/discovery", formData);
            toast.success("Thank you! Your discovery request has been submitted.");
            onClose();
        } catch (error) {
            console.error("Error submitting form", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div
                className="
          relative
          bg-white
          w-[724px]
          h-[571px]
          max-w-[95vw]
          max-h-[95vh]
          rounded-[12px]
          shadow-2xl
          flex
          flex-col
          gap-[16px]
          pt-[24px]
          pr-[12px]
          pb-[24px]
          pl-[12px]
          overflow-y-auto
        "
            >
                {/* Close Button */}
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

                {/* CONTENT */}
                <div className="flex flex-col gap-4 px-4 sm:px-6">
                    {/* Intro */}
                    <p className="font-poppins text-[18px] leading-[28px] text-[#2B3476] font-medium">
                        Every leader, team, and organization faces moments of complexity.
                        <br />
                        At Mashar, we start by listening.
                    </p>

                    {/* Description */}
                    <div className="font-poppins text-[14px] leading-[24px] text-black">
                        <p className="">In a 15-minute discovery conversation, you'll:</p>
                        <ul className="list-disc pl-5 ">
                            <li>Share what you're currently facing.</li>
                            <li>Gain clarity on what may be holding progress back.</li>
                            <li>Explore whether Mashar's programs or tools are right for you.</li>
                        </ul>
                        <p className="pt-2">No cost. No obligation.</p>
                        <p className="md:mt-[-5px]">Just a focused conversation to help you move forward.</p>
                    </div>

                    {/* Highlight */}
                    <p className="font-poppins text-[16px] leading-[24px] text-[#2B3476] font-medium">
                        Let's talk.
                    </p>

                    {/* Form */}
                    <form className="flex flex-col gap-4 font-poppins" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name*"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-[44px] sm:h-[48px] rounded-[12px] border-[1.5px] border-[#0F1C80] px-4 text-[14px]"
                        />

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address*"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-[44px] sm:h-[48px] rounded-[12px] border-[1.5px] border-[#0F1C80] px-4 text-[14px]"
                        />

                        {/* Company (Optional) */}
                        <input
                            type="text"
                            name="company"
                            required
                            placeholder="Company*"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full h-[44px] sm:h-[48px] rounded-[12px] border-[1.5px] border-[#0F1C80] px-4 text-[14px]"
                        />

                        {/* Select */}
                        <div className="relative">
                            <select
                                name="helpTopic"
                                required
                                value={formData.helpTopic}
                                onChange={handleChange}
                                className="w-full h-[44px] sm:h-[48px] rounded-[12px] border-[1.5px] border-[#0F1C80] px-4 pr-10 text-[14px] text-gray-500 appearance-none cursor-pointer"
                            >
                                <option value="" disabled>
                                    How can we help you?
                                </option>
                                <option value="Coaching">Coaching</option>
                                <option value="Training">Training</option>
                                <option value="Mentoring & Supervision">Mentoring & Supervision</option>
                                <option value="Assessments">Assessments</option>
                                <option value="Custom Solutions">Custom Solutions</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                        </div>

                        {/* Textarea */}
                        <textarea
                            rows={3}
                            name="challenge"
                            placeholder="Your Biggest Challenge"
                            required
                            value={formData.challenge}
                            onChange={handleChange}
                            className="w-full rounded-[12px] border-[1.5px] border-[#0F1C80] px-4 py-3 text-[14px]"
                        />

                        {/* Checkbox (Optional) */}
                        <label className="flex items-start gap-3 text-[14px] cursor-pointer">
                            <input
                                type="checkbox"
                                name="receiveUpdates"
                                checked={formData.receiveUpdates}
                                onChange={handleChange}
                                className="mt-1 w-4 h-4 accent-[#0F1C80]"
                            />
                            <span>
                                Yes, I'd like to receive leadership insights and updates from Mashar.
                            </span>
                        </label>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-[46px] rounded-[999px] bg-[#14247B] text-white font-semibold text-[14px] disabled:opacity-50"
                            >
                                {loading ? "SUBMITTING..." : "SUBMIT"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

