import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function SetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!token) {
            setError("Invalid or missing token. Please use the link from your email.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/v1/auth/set-password", {
                token,
                password,
            });

            // Store token and redirect to dashboard
            localStorage.setItem("alumni_token", res.data.token);
            navigate("/alumni");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to set password. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="w-[661px] max-w-[95vw] bg-white rounded-[12px] shadow-xl overflow-hidden">
                        <div className="bg-red-600 py-6">
                            <h1 className="text-white font-spartan font-semibold text-[30px] leading-[32px] tracking-[0.5px] text-center">
                                Invalid Link
                            </h1>
                        </div>
                        <div className="px-8 sm:px-12 py-10 text-center">
                            <p className="font-poppins text-[16px] text-gray-600 mb-4">
                                This link is invalid or has expired. Please contact the admin for a new set-password link.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <form
                    onSubmit={handleSubmit}
                    className="
            w-[661px] max-w-[95vw]
            bg-white
            rounded-[12px]
            pb-[24px]
            flex flex-col
            shadow-xl
            overflow-hidden
          "
                >
                    {/* Header */}
                    <div className="bg-[#0F1C80] py-6">
                        <h1
                            className="
                text-white
                font-spartan font-semibold
                text-[30px]
                leading-[32px]
                tracking-[0.5px]
                text-center
              "
                        >
                            Set Your Password
                        </h1>
                    </div>

                    {/* Body */}
                    <div className="px-8 sm:px-12 py-8">
                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 font-poppins text-[16px]">
                                {error}
                            </div>
                        )}

                        {/* Info */}
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 font-poppins text-[14px]">
                            Your account has been approved! Please set a password to access your alumni dashboard.
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-6 mb-5">
                            <label className="font-poppins text-[18px] leading-[16px] tracking-[0.5px]">
                                Password :
                            </label>
                            <input
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-[48px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[18px] tracking-[0.5px] focus:outline-none"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-6 mb-8">
                            <label className="font-poppins text-[18px] leading-[16px] tracking-[0.5px]">
                                Confirm :
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full h-[48px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[18px] tracking-[0.5px] focus:outline-none"
                            />
                        </div>

                        {/* Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#0F1C80] text-white font-poppins text-[20px] px-14 py-3 rounded-2xl hover:bg-[#0C1766] transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Setting Password..." : "Set Password & Login"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
