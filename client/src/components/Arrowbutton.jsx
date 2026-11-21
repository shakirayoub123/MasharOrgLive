import React from "react";
import { ArrowRight } from "lucide-react";

const ArrowButton = ({
                         text,
                         textSize = "16px",
                         fontWeight = "400",
                         className = "",
                         arrowColor = "#0f1c80",
                         variant = "primary", // "primary" | "orange" | "outline"
                         onClick,
                         type = "button",
                     }) => {
    const isOrange = variant === "orange" || className.includes("bg-[#f39300]") || className.includes("bg-secondary");
    const isOutline = variant === "outline";

    return (
        <button
            type={type}
            onClick={onClick}
            className={`group relative inline-flex w-fit items-center gap-2 sm:gap-4 px-4 py-2 sm:px-6 sm:py-3 rounded-full overflow-hidden transition-all duration-300 ${
                isOutline
                    ? "text-[#1e2554] hover:text-white bg-white hover:bg-[#1e2554] border-2 border-[#1e2554] shadow-sm"
                    : isOrange
                        ? "text-white bg-[#f39300] hover:bg-[#d97f00] shadow-md"
                        : "text-white bg-[#0f1c80] shadow-md"
            } ${className}`}
        >
            {/* Hover Gradient Overlay */}
            {!isOutline && (
                <div className={`absolute right-0 top-0 h-full w-[100px] sm:w-[120px] bg-gradient-to-r from-transparent ${isOrange ? "to-[#b86a00]" : "to-[#C05600]"} opacity-0 group-hover:opacity-100 transition-opacity`} />
            )}

            {/* Text */}
            <span
                className="relative z-10 font-spartan whitespace-nowrap text-[14px] sm:text-[16px]"
                style={{ fontWeight }}
            >
                {text}
            </span>

            {/* Arrow */}
            <div className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 rotate-[-45deg] group-hover:rotate-0 ${
                isOutline
                    ? "bg-[#1e2554] group-hover:bg-white text-white group-hover:text-[#1e2554]"
                    : "bg-white"
            }`}>
                <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-colors duration-500 ${
                        isOutline
                            ? "text-white group-hover:text-[#1e2554]"
                            : isOrange
                                ? "text-[#f39300] group-hover:text-[#b86a00]"
                                : "text-[#0f1c80] group-hover:text-[#EB8F03]"
                    }`}
                />
            </div>
        </button>
    );
};

export default ArrowButton;
