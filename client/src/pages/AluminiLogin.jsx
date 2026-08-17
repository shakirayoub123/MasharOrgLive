import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const inputClass =
  "w-full h-[52px] px-4 border-2 border-gray-200 rounded-xl font-poppins text-[16px] text-[#0F1C80] bg-[#F3F4F6] focus:outline-none focus:border-[#0F1C80] transition";
  
const labelClass = "font-poppins text-[15px] font-medium text-gray-700 mb-2 block";

export default function AlumniLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Forgot password state
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState("");
    const [forgotError, setForgotError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await login(email, password);
            const name = res?.data?.alumni?.name || "Welcome back!";
            toast.success(res.message);
            setTimeout(() => {
                navigate("/alumni", { replace: true });
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotError("");
        setForgotMessage("");
        setForgotLoading(true);
        try {
            const res = await axios.post("/api/auth/forgot-password", { email: forgotEmail });
            setForgotMessage(res.data.message || "Reset link sent! Check your email.");
            toast.success("Reset link sent! Check your email.");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send reset link.";
            setForgotError(msg);
            toast.error(msg);
        } finally {
            setForgotLoading(false);
        }
    };

    // ── Forgot Password Modal ────────────────
    if (showForgot) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4 py-6">
                    <div className="w-full max-w-[620px] bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-1.5 bg-[#F39300]" />
                        <div className="bg-[#0F1C80] px-10 py-6">
                            <h1 className="text-white font-spartan font-semibold text-[30px] tracking-wide text-center">
                                Reset Password
                            </h1>
                            <p className="text-blue-200 font-poppins text-[14px] text-center mt-1">
                                Enter your email and we'll send you a reset link
                            </p>
                        </div>

                        <form onSubmit={handleForgotPassword} className="px-10 py-6 space-y-5">
                            {forgotMessage && (
                                <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-xl font-poppins text-[15px]">
                                    {forgotMessage}
                                </div>
                            )}
                            {forgotError && (
                                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl font-poppins text-[15px]">
                                    {forgotError}
                                </div>
                            )}

                            <div>
                                <label className={labelClass}>
                                    Email Address <span className="text-[#F39300]">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={forgotLoading || !!forgotMessage}
                                className="w-full h-[54px] bg-[#0F1C80] text-white font-poppins text-[18px] font-semibold rounded-xl hover:bg-[#0a1260] transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {forgotLoading ? "Sending..." : "Send Reset Link"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgot(false);
                                    setForgotMessage("");
                                    setForgotError("");
                                    setForgotEmail("");
                                }}
                                className="w-full font-poppins text-[15px] text-gray-500 hover:text-[#0F1C80] text-center transition"
                            >
                                ← Back to Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // ── Login Form ───────────────────────────
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <Toaster
                position="top-center"
            />            <div className="flex-1 flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-[620px] bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-1.5 bg-[#F39300]" />
                    <div className="bg-[#0F1C80] px-10 py-6">
                        <h1 className="text-white font-spartan font-semibold text-[28px] tracking-wide text-center">
                            Alumni Login
                        </h1>
                        <p className="text-blue-200 font-poppins text-[14px] text-center mt-1">
                            Welcome back to the Mashar Alumni Network
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-10 py-6 space-y-5">

                        <div>
                            <label className={labelClass}>
                                Email Address <span className="text-[#F39300]">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Password <span className="text-[#F39300]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F1C80] transition"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgot(true);
                                        setForgotEmail(email);
                                    }}
                                    className="font-poppins text-[14px] text-[#F39300] hover:underline font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[54px] bg-[#0F1C80] text-white font-poppins text-[18px] font-semibold rounded-xl hover:bg-[#0a1260] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>

                        <p className="font-poppins text-[15px] text-gray-500 text-center">
                            Don't have an account?{" "}
                            <Link to="/alumni-register" className="text-[#F39300] hover:underline font-semibold">
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}