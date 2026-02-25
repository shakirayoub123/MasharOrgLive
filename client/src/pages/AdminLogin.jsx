import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function AlumniLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/alumni");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="
            w-[661px] max-w-[95vw]
            bg-white
            rounded-[12px]
            pb-[24px]
            flex flex-col
            gap-[48px]
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
              Alumni Login
            </h1>
          </div>

          {/* Body */}
          <div className="px-8 sm:px-12 py-10">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 font-poppins text-[16px]">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-6 mb-6">
              <label className="font-poppins text-[20px] leading-[16px] tracking-[0.5px]">
                Email ID :
              </label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[52px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[20px] tracking-[0.5px] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-6 mb-4">
              <label className="font-poppins text-[20px] leading-[16px] tracking-[0.5px]">
                Password:
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[52px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[20px] tracking-[0.5px] focus:outline-none"
              />
            </div>

            {/* Register */}
            <p className="font-poppins text-[16px] leading-[30px] tracking-[0.5px] text-gray-600 mb-3">
              If you have not registered before,{" "}
              <Link
                to="/alumni-register"
                className="text-[#0F1C80] cursor-pointer hover:underline"
              >
                click here to register
              </Link>
            </p>

            {/* Forgot password */}
            <p className="font-poppins text-[16px] leading-[20px] tracking-[0.5px] text-[#0F1C80] cursor-pointer mb-10">
              Forgot password?
            </p>

            {/* Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#0F1C80] text-white font-poppins text-[20px] px-14 py-3 rounded-2xl hover:bg-[#0C1766] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
