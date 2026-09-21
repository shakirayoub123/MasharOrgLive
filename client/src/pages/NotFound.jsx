import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#fbfcff] flex flex-col items-center justify-center -mt-20 font-poppins px-6 text-center">
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1a56db]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                <h1 className="text-[120px] sm:text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#0f1c80] to-[#1a56db] font-spartan mb-2" style={{ textShadow: "0px 10px 30px rgba(26, 86, 219, 0.15)" }}>
                    404
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
                    Oops! It looks like you've wandered off the path. The page you are looking for doesn't exist or has been moved.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f38900] text-white font-bold rounded-full transition-transform hover:scale-105 hover:bg-[#e07b00] hover:shadow-xl hover:shadow-orange-500/20"
                >
                    <Home size={18} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
