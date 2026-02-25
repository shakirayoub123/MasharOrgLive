import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function AlumniRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post("http://localhost:5000/api/v1/auth/register", formData);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        {submitted ? (
          /* ── Success notification ── */
          <div
            className="
              w-[661px] max-w-[95vw]
              bg-white
              rounded-[12px]
              shadow-xl
              overflow-hidden
            "
          >
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
                Registration Submitted
              </h1>
            </div>

            <div className="px-8 sm:px-12 py-10 text-center">
              {/* Checkmark icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="font-poppins text-[22px] font-semibold text-gray-800 mb-4">
                Thank You!
              </h2>

              <p className="font-poppins text-[16px] text-gray-600 mb-2 leading-relaxed">
                Your registration has been submitted successfully.
              </p>
              <p className="font-poppins text-[16px] text-gray-600 mb-8 leading-relaxed">
                You will receive an email with a link to set your password once
                your account has been <strong>approved by the admin</strong>.
              </p>

              <Link
                to="/"
                className="inline-block bg-[#0F1C80] text-white font-poppins text-[18px] px-10 py-3 rounded-2xl hover:bg-[#0C1766] transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* ── Registration form ── */
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
                Alumni Registration
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

              {/* Info notice */}
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-6 font-poppins text-[14px]">
                Fill in your details below. After admin approval, you'll receive an email to set your password.
              </div>

              {/* Name */}
              <div className="grid grid-cols-[120px_1fr] items-center gap-6 mb-5">
                <label className="font-poppins text-[18px] leading-[16px] tracking-[0.5px]">
                  Name :
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full h-[48px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[18px] tracking-[0.5px] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-[120px_1fr] items-center gap-6 mb-5">
                <label className="font-poppins text-[18px] leading-[16px] tracking-[0.5px]">
                  Email ID :
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-[48px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[18px] tracking-[0.5px] focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div className="grid grid-cols-[120px_1fr] items-center gap-6 mb-5">
                <label className="font-poppins text-[18px] leading-[16px] tracking-[0.5px]">
                  Phone :
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[18px] tracking-[0.5px] focus:outline-none"
                />
              </div>

              {/* Batch */}
              <div className="grid grid-cols-[120px_1fr] items-center gap-6 mb-6">
                <label className="font-poppins text-[18px] leading-[16px] tracking-[0.5px]">
                  Batch :
                </label>
                <input
                  type="text"
                  name="batch"
                  placeholder="e.g. 2024"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 border-2 border-[#0F1C80] rounded-xl font-poppins text-[18px] tracking-[0.5px] focus:outline-none"
                />
              </div>

              {/* Already registered */}
              <p className="font-poppins text-[16px] leading-[30px] tracking-[0.5px] text-gray-600 mb-6">
                Already have an account?{" "}
                <Link
                  to="/alumni-login"
                  className="text-[#0F1C80] cursor-pointer hover:underline"
                >
                  Sign in here
                </Link>
              </p>

              {/* Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0F1C80] text-white font-poppins text-[20px] px-14 py-3 rounded-2xl hover:bg-[#0C1766] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Submitting..." : "Submit Registration"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
