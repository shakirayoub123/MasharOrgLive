import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import Select from "react-select";
import countryList from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";

const PROGRAMS = [
    { value: "CPCP", label: "CPCP – Certified Professional Coach Program" },
    { value: "PMF",  label: "PMF – Mentoring Foundation" },
    { value: "PMP",  label: "PMP – Mentoring Practitioner" },
    { value: "Organizational", label: "Organizational Program (specify)" },
    { value: "Other", label: "Other (specify)" },
];

const YEARS = ["2025","2024","2023","2022","2021","2020","Earlier"];

const STATUSES = [
    { value: "graduate",    label: "Program Graduate" },
    { value: "certified",   label: "Certified" },
    { value: "accredited",  label: "Accredited" },
    { value: "in_progress", label: "In Progress" },
];

const inputClass =
    "w-full h-[52px] px-4 border-2 border-gray-200 rounded-xl font-poppins text-[16px] text-[#0F1C80] bg-gray-50 focus:outline-none focus:border-[#0F1C80] focus:bg-white transition";

const labelClass = "font-poppins text-[15px] font-medium text-gray-700 mb-2 block";

export default function AlumniRegister() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        country: "",
        program: "",        // FIX: was missing, needed for needsSpecify check
        course: "",         // used only when needsSpecify is true
        completion_year: "",
        completion_status: "",
        certificate: null,
        agreed: false,
        website: "",
        captchaAnswer: "",
    });
    
    const [captchaError, setCaptchaError] = useState(false);
    const [emailError, setEmailError] = useState("");
    
    // Math CAPTCHA State (idle, challenging, verified)
    const [captchaState, setCaptchaState] = useState("idle");
    const [mathCaptcha, setMathCaptcha] = useState({ num1: 0, num2: 0 });
    
    useEffect(() => {
        setMathCaptcha({
            num1: Math.floor(Math.random() * 10) + 1,
            num2: Math.floor(Math.random() * 10) + 1
        });
    }, []);

    // Auto-verify when they type the correct answer
    useEffect(() => {
        if (captchaState === "challenging" && formData.captchaAnswer) {
            if (parseInt(formData.captchaAnswer) === (mathCaptcha.num1 + mathCaptcha.num2)) {
                setCaptchaState("verified");
                setCaptchaError(false);
            }
        }
    }, [formData.captchaAnswer, mathCaptcha, captchaState]);
    const [error, setError]         = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dragOver, setDragOver]   = useState(false);

    // FIX: was using formData.program but state key didn't exist → always false
    const needsSpecify = formData.program === "Organizational" || formData.program === "Other";

    // FIX: moved inside component with useMemo to avoid recreating on every render
    const countries = useMemo(() => countryList().getData(), []);

    const formatOptionLabel = ({ label, value }) => (
        <div className="flex items-center gap-2">
            <ReactCountryFlag countryCode={value} svg style={{ width: "1.2em", height: "1.2em" }} />
            <span>{label}</span>
        </div>
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            // FIX: reset course when program changes
            ...(name === "program" && { course: "" }),
        }));
        if (name === "captchaAnswer") {
            setCaptchaError(false);
        }
        if (name === "email") {
            setEmailError("");
        }
    };

    const handleEmailBlur = () => {
        if (!formData.email) return;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        
        const disposableDomains = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'yopmail.com', 'guerrillamail.com', 'sharklasers.com', 'throwawaymail.com', 'temp-mail.org', 'tempmail.net'];
        const domain = formData.email.split('@')[1]?.toLowerCase();
        
        if (domain && disposableDomains.includes(domain)) {
            setEmailError("Disposable emails are not allowed. Please enter a valid email type.");
            return;
        }
        
        if (domain === 'gmail.com') {
            const localPart = formData.email.split('@')[0];
            if ((localPart.match(/\./g) || []).length > 2) {
                setEmailError("Please use a standard email format. Excessive dots are not allowed.");
                return;
            }
        }
    };

    const handleFile = (file) => {
        if (file) setFormData((prev) => ({ ...prev, certificate: file }));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreed) {
            setError("Please confirm you agree to Mashar's professional and ethical standards.");
            return;
        }
        
        if (emailError) {
            setError("Please fix the errors in the email field.");
            return;
        }
        
        if (captchaState !== "verified") {
            setCaptchaError(true);
            setCaptchaState("idle");
            setMathCaptcha({
                num1: Math.floor(Math.random() * 10) + 1,
                num2: Math.floor(Math.random() * 10) + 1
            });
            setFormData(prev => ({ ...prev, captchaAnswer: "" }));
            return;
        }

        setError("");
        setIsLoading(true);
        try {
            const course = needsSpecify
                ? `${formData.program} - ${formData.course}`
                : formData.program;

            await axios.post("/api/auth/register", {
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                country: formData.country,
                course,
                completion_year: formData.completion_year,
                completion_status: formData.completion_status,
                website: formData.website,
            });

            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 py-10">
                {submitted ? (
                    /* ── Success ── */
                    <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-1.5 bg-[#F39300]" />
                        <div className="bg-[#0F1C80] px-10 py-8">
                            <h1 className="text-white font-spartan font-semibold text-[30px] tracking-wide text-center">
                                Application Submitted
                            </h1>
                        </div>
                        <div className="px-12 py-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-[#F39300] bg-opacity-10 border-2 border-[#F39300]">
                                <svg className="w-10 h-10 text-[#F39300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="font-poppins text-[22px] font-semibold text-[#0F1C80] mb-3">Thank You!</h2>
                            <p className="font-poppins text-[15px] text-gray-600 leading-relaxed mb-8">
                                Your application has been submitted successfully. You'll receive an email once your account has been{" "}
                                <strong className="text-[#0F1C80]">approved by the admin</strong>.
                            </p>
                            <Link
                                to="/"
                                className="inline-block bg-[#0F1C80] text-white font-poppins text-[16px] px-10 py-3 rounded-xl hover:bg-[#0a1260] transition"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* ── Form ── */
                    <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-1.5 bg-[#F39300]" />

                        <div className="bg-[#0F1C80] px-10 py-8">
                            <h1 className="text-white font-spartan font-semibold text-[30px] tracking-wide text-center">
                                Alumni Registration
                            </h1>
                            <p className="text-blue-200 font-poppins text-[14px] text-center mt-1">
                                For graduates of Mashar programs who wish to remain connected and engaged.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-10 py-10 space-y-6">

                            {error && (
                                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl font-poppins text-[15px]">
                                    {error}
                                </div>
                            )}

                            {/* Honeypot field - visually hidden but available to bots */}
                            <div style={{ display: "none" }} aria-hidden="true">
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    tabIndex="-1"
                                    autoComplete="off"
                                />
                            </div>

                            {/* ── Section 1: Personal Info ── */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1 h-4 rounded-full bg-[#F39300]" />
                                    <p className="font-poppins text-[11px] font-semibold tracking-widest uppercase text-[#0F1C80]">
                                        Personal Information
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className={labelClass}>
                                            Full Name <span className="text-[#F39300]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder="Your full name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Email Address <span className="text-[#F39300]">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleEmailBlur}
                                            required
                                            className={`${inputClass} ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        />
                                        {emailError && (
                                            <p className="text-red-500 text-[13px] font-poppins mt-1.5">{emailError}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className={labelClass}>
                                        Phone Number <span className="text-[#F39300]">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="e.g. +971501234567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Country <span className="text-[#F39300]">*</span>
                                    </label>
                                    <Select
                                        options={countries}
                                        value={countries.find(c => c.label === formData.country) || null}
                                        onChange={(selected) =>
                                            setFormData(prev => ({ ...prev, country: selected?.label || "" }))
                                        }
                                        formatOptionLabel={formatOptionLabel}
                                        placeholder="Select your country"
                                        isSearchable
                                        maxMenuHeight={220}
                                        menuPlacement="auto"
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                height: "52px",
                                                borderRadius: "12px",
                                                border: state.isFocused ? "2px solid #0F1C80" : "2px solid #e5e7eb",
                                                boxShadow: "none",
                                            }),
                                            menu: (base) => ({ ...base, borderRadius: "12px", overflow: "hidden" }),
                                            menuList: (base) => ({ ...base, maxHeight: 220 }),
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ── Section 2: Program Details ── */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1 h-4 rounded-full bg-[#F39300]" />
                                    <p className="font-poppins text-[11px] font-semibold tracking-widest uppercase text-[#0F1C80]">
                                        Program Details
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className={labelClass}>
                                            Program Completed <span className="text-[#F39300]">*</span>
                                        </label>
                                        {/* FIX: name="program" so needsSpecify works correctly */}
                                        <select
                                            name="program"
                                            value={formData.program}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">Select a program</option>
                                            {PROGRAMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Year of Completion <span className="text-[#F39300]">*</span>
                                        </label>
                                        <select
                                            name="completion_year"
                                            value={formData.completion_year}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">Select year</option>
                                            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {needsSpecify && (
                                    <div className="mb-5">
                                        <label className={labelClass}>
                                            Please specify <span className="text-[#F39300]">*</span>
                                        </label>
                                        {/* FIX: name="course" stores the specify text, combined in submit */}
                                        <input
                                            type="text"
                                            name="course"
                                            placeholder="Enter program name"
                                            value={formData.course}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className={labelClass}>
                                        Completion Status <span className="text-[#F39300]">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        {STATUSES.map((s) => (
                                            <label
                                                key={s.value}
                                                className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl cursor-pointer transition font-poppins text-[14px] select-none ${
                                                    formData.completion_status === s.value
                                                        ? "border-[#0F1C80] bg-blue-50 text-[#0F1C80] font-semibold"
                                                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="completion_status"
                                                    value={s.value}
                                                    checked={formData.completion_status === s.value}
                                                    onChange={handleChange}
                                                    required
                                                    className="hidden"
                                                />
                                                {/* FIX: was checking formData.status (undefined) — fixed to formData.completion_status */}
                                                <span
                                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                                                        formData.completion_status === s.value
                                                            ? "border-[#F39300] bg-[#F39300]"
                                                            : "border-gray-400"
                                                    }`}
                                                >
                                                    {formData.completion_status === s.value && (
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full block" />
                                                    )}
                                                </span>
                                                {s.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── Section 3: Certificate Upload ── */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1 h-4 rounded-full bg-[#F39300]" />
                                    <p className="font-poppins text-[11px] font-semibold tracking-widest uppercase text-[#0F1C80]">
                                        Certificate Upload{" "}
                                        <span className="normal-case font-normal text-gray-400 tracking-normal">(Optional)</span>
                                    </p>
                                </div>

                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition ${
                                        dragOver ? "border-[#F39300] bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFile(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <svg
                                        className={`w-9 h-9 mx-auto mb-2 ${dragOver ? "text-[#F39300]" : "text-gray-400"}`}
                                        fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32A5.25 5.25 0 0 1 17.25 19.5H6.75Z" />
                                    </svg>
                                    {formData.certificate ? (
                                        <p className="font-poppins text-[14px] text-[#0F1C80] font-medium">
                                            ✓ {formData.certificate.name}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="font-poppins text-[15px] text-gray-600">
                                                <span className="font-semibold text-[#F39300]">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="font-poppins text-[13px] text-gray-400 mt-1">PDF, JPG, or PNG · Max 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ── Agreement checkbox ── */}
                            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer border-2 border-transparent hover:border-gray-200 transition">
                                <input
                                    type="checkbox"
                                    name="agreed"
                                    checked={formData.agreed}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                                        formData.agreed ? "bg-[#F39300] border-[#F39300]" : "border-gray-300 bg-white"
                                    }`}
                                >
                                    {formData.agreed && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <span className="font-poppins text-[14px] text-gray-600 leading-relaxed">
                                    I confirm that I have completed the selected Mashar program and agree to uphold Mashar's{" "}
                                    <strong className="text-[#0F1C80]">professional and ethical standards</strong>.
                                </span>
                            </label>

                            <p className="font-poppins text-[15px] text-gray-500 text-center">
                                Already have an account?{" "}
                                <Link to="/alumni-login" className="text-[#F39300] hover:underline font-semibold">
                                    Sign in here
                                </Link>
                            </p>

                            {/* ── Enterprise Math CAPTCHA Widget ── */}
                            <div className="flex flex-col items-center my-6">
                                <div 
                                    className={`flex items-center justify-between bg-[#f9f9f9] p-3 rounded-[3px] border shadow-sm w-[340px] transition-colors ${captchaError ? 'border-red-500' : 'border-[#d3d3d3]'} ${captchaState === 'idle' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                    onClick={() => {
                                        if (captchaState === 'idle') {
                                            setCaptchaState('challenging');
                                            setCaptchaError(false);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Checkbox Icon */}
                                        <div className={`w-7 h-7 rounded-sm border-2 flex items-center justify-center transition-colors ${
                                            captchaState === 'verified' 
                                                ? 'border-[#34a853] bg-[#34a853]' 
                                                : captchaState === 'challenging'
                                                    ? 'border-[#4a90e2] bg-white border-t-transparent animate-spin rounded-full'
                                                    : 'border-[#c1c1c1] bg-white shadow-inner'
                                        }`}>
                                            {captchaState === 'verified' && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        
                                        {/* Text/Challenge */}
                                        <div className="font-roboto text-[14px] text-[#555] tracking-wide whitespace-nowrap mt-0.5">
                                            {captchaState === 'idle' && <span>I am human</span>}
                                            {captchaState === 'verified' && <span>I am human</span>}
                                            {captchaState === 'challenging' && (
                                                <span>Solve: <span className="font-bold text-[#333] ml-1">{mathCaptcha.num1} + {mathCaptcha.num2} =</span></span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 border-l border-[#d3d3d3] pl-3 h-full">
                                        {captchaState === 'challenging' && (
                                            <input
                                                type="text"
                                                name="captchaAnswer"
                                                value={formData.captchaAnswer}
                                                onChange={handleChange}
                                                placeholder=""
                                                maxLength="2"
                                                autoFocus
                                                className="w-[42px] h-8 border border-[#c1c1c1] rounded-[2px] text-center font-roboto text-[15px] focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] transition bg-white"
                                            />
                                        )}
                                        
                                    </div>
                                    
                                    <div className="flex items-center gap-3 border-l border-[#d3d3d3] pl-3 h-full">
                                        <div className="flex flex-col items-center justify-center opacity-80 min-w-[50px]">
                                            {/* Enterprise-style logo */}
                                            <svg className="w-[22px] h-[22px] text-[#4a90e2] mb-0.5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                            </svg>
                                            <span className="text-[9px] text-[#555] font-roboto leading-none">reCAPTCHA</span>
                                            <span className="text-[8px] text-[#777] font-roboto leading-none mt-0.5">Math Check</span>
                                        </div>
                                    </div>
                                </div>
                                {captchaError && (
                                    <div className="text-red-500 text-[13px] font-poppins mt-2 text-center font-medium">
                                        Please complete the security check.
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || captchaState !== 'verified'}
                                className="w-full h-[54px] bg-[#0F1C80] text-white font-poppins text-[18px] font-semibold rounded-xl hover:bg-[#0a1260] transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Submitting..." : "Submit Application"}
                            </button>

                            <p className="font-poppins text-[13px] text-gray-400 text-center -mt-4">
                                Applications are reviewed before activation to ensure eligibility.
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}