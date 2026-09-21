import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import whyMashar from "../assets/letsTalkBg.jpeg";
import CurvedLine from "../assets/CurvedLine.png";
import ArrowButton from "../components/Arrowbutton";
import CustomSelect from "../components/Select";

export default function BecomePartner() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        website: "",
        partnershipType: "",
        region: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.partnershipType || !form.region) {
            toast.error("Please fill in all required fields including selections.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/public/partner/request", form);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setForm({
                    firstName: "", lastName: "", email: "", phone: "",
                    company: "", jobTitle: "", website: "", partnershipType: "",
                    region: "", message: "",
                });
            }, 5000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="relative overflow-hidden font-poppins">
            {/* ================= HERO ================= */}
            <header className="relative h-[200px] sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-center text-white text-center p-8">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${whyMashar})` }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to bottom, rgba(43,52,118,0.26), rgba(43,52,118,0.20))",
                    }}
                />
                <h1 className="relative z-10 text-3xl sm:text-4xl lg:text-[52px] font-semibold font-spartan tracking-wide uppercase">
                    Become a Partner
                </h1>
            </header>

            {/* ================= CONTACT ================= */}
            <section className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 py-16 grid grid-cols-1 md:grid-cols-2 gap-14">

                {/* LEFT */}
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-[46px] font-medium font-spartan leading-tight mb-6">
                        Join our global<br />
                        <span className="relative inline-block text-secondary pt-2 pb-6">
                            Network
                            <img
                                src={CurvedLine}
                                alt="curve"
                                className="absolute left-[50%] -translate-x-1/2 bottom-0 w-[160px] sm:w-[200px] h-[15px]"
                            />
                        </span>
                    </h2>

                    <p className="mt-6 text-base leading-7 max-w-xl font-poppins text-gray-700">
                        Join our global network of leadership experts, consultants, and educational institutions. Together, we can transform human capability and organisational performance.
                    </p>

                    <ul className="mt-8 space-y-4 text-sm font-poppins text-gray-700">
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full text-white bg-primary mt-0.5 text-xs">✓</span>
                            Access to world-class leadership curricula.
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full text-white bg-primary mt-0.5 text-xs">✓</span>
                            Dedicated support, training, and certification.
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full text-white bg-primary mt-0.5 text-xs">✓</span>
                            Expand your service offerings to enterprise clients.
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full text-white bg-primary mt-0.5 text-xs">✓</span>
                            Competitive revenue-sharing models.
                        </li>
                    </ul>

                </div>

                {/* RIGHT - FORM */}
                {submitted ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center h-full border border-gray-100 rounded-2xl bg-gray-50/50">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14247B] mb-6">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#14247B] mb-2 font-spartan">
                            Request Received!
                        </h2>
                        <p className="text-base sm:text-[16px] text-gray-600 font-poppins leading-relaxed">
                            Thank you for your interest in partnering with Mashar.<br />
                            Our team will review your information and get back to you shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input required name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name*" className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary transition-colors" />
                            <input required name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name*" className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary transition-colors" />
                            <input required name="company" value={form.company} onChange={handleChange} placeholder="Company Name*" className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary transition-colors" />
                            <input required name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title*" className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary transition-colors" />
                            <input required name="email" value={form.email} onChange={handleChange} placeholder="Business Email*" type="email" className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary transition-colors" />
                            <input required name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number*" type="tel" className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary transition-colors" />
                            <input name="website" value={form.website} onChange={handleChange} placeholder="Company Website (Optional)" type="url" className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary transition-colors sm:col-span-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <CustomSelect
                                placeholder="Partnership Type*"
                                options={[
                                    "Reseller",
                                    "Delivery Partner",
                                    "Consulting Partner",
                                    "Strategic Alliance",
                                    "Other"
                                ]}
                                value={form.partnershipType}
                                onChange={(val) => setForm(f => ({ ...f, partnershipType: val }))}
                            />

                            <CustomSelect
                                placeholder="Region*"
                                options={[
                                    "North America",
                                    "Europe / UK",
                                    "Middle East",
                                    "Asia Pacific",
                                    "Africa",
                                    "Latin America",
                                    "Global"
                                ]}
                                value={form.region}
                                onChange={(val) => setForm(f => ({ ...f, region: val }))}
                            />
                        </div>

                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Tell us briefly about your organisation and how you envision partnering with Mashar..."
                            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary resize-none mt-4"
                        />

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-[50px] w-[140px] bg-secondary hover:bg-orange-500 text-white rounded-full font-bold flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-[16px]"
                            >
                                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Submit"}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}
