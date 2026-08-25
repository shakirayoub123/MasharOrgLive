import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import logoMashar from "../assets/masharBlackFinal.svg";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [language, setLanguage] = useState("EN");

    const languages = [
        { code: "EN", label: "EN" },
        { code: "AR", label: "AR" },
    ];

    return (
        <div className="w-full font-poppins bg-white">
            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto flex justify-between items-center md:px-6 py-0 relative">

                {/* Logo */}
                <NavLink to="/" className="flex items-center">
                    <img
                        src={logoMashar}
                        alt="Mashar Logo"
                        className="w-28 md:w-[150px] lg:w-[170px] h-auto object-contain -mt-2 md:-mt-4"
                    />
                </NavLink>

                {/* Hamburger Icon for Mobile */}
                <button
                    className="text-primary text-2xl lg:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-6 xl:gap-8 font-regular text-[15px] xl:text-[16px] text-gray-800">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? "text-secondary" : "hover:text-secondary transition-colors"}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/whyMashar" className={({ isActive }) => isActive ? "text-secondary" : "hover:text-secondary transition-colors"}>
                            Why Mashar
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/ourSignature" className={({ isActive }) => isActive ? "text-secondary" : "hover:text-secondary transition-colors"}>
                            Our Signature
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/explorePrograms" className={({ isActive }) => isActive ? "text-secondary" : "hover:text-secondary transition-colors"}>
                            Explore Programs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/leadership-hub" className={({ isActive }) => isActive ? "text-secondary" : "hover:text-secondary transition-colors"}>
                            Leadership Hub
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/lets-talk" className={({ isActive }) => isActive ? "text-secondary" : "hover:text-secondary transition-colors"}>
                            Let's Talk
                        </NavLink>
                    </li>
                </ul>

                {/* Right Section (Desktop) */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                    <NavLink
                        to="/alumni-login"
                        className="px-6 py-2 border border-secondary text-secondary rounded-full font-regular text-sm xl:text-base hover:bg-secondary hover:text-white transition-all duration-300"
                    >
                        Alumni Login
                    </NavLink>

                    {/* Language Dropdown */}
                    <div className="relative">


                        {langOpen && (
                            <div className="absolute top-full right-0 mt-2 w-auto bg-white py-2 z-[60] shadow-md">
                                {languages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        className="px-4 py-2 hover:text-secondary cursor-pointer text-sm text-gray-700 transition-colors"
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setLangOpen(false);
                                        }}
                                    >
                                        {lang.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`absolute z-50 top-full left-0 w-full bg-white shadow-lg flex flex-col items-start gap-4 p-6 font-poppins text-[16px] font-medium text-primary transition-all duration-300 lg:hidden ${menuOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-4"
                        }`}
                >
                    <NavLink to="/" onClick={() => setMenuOpen(false)} className="hover:text-secondary w-full">Home</NavLink>
                    <NavLink to="/whyMashar" onClick={() => setMenuOpen(false)} className="hover:text-secondary w-full">Why Mashar</NavLink>
                    <NavLink to="/ourSignature" onClick={() => setMenuOpen(false)} className="hover:text-secondary w-full">Our Signature</NavLink>
                    <NavLink to="/explorePrograms" onClick={() => setMenuOpen(false)} className="hover:text-secondary w-full">Explore Programs</NavLink>
                    <NavLink to="/leadership-hub" onClick={() => setMenuOpen(false)} className="hover:text-secondary w-full">Leadership Hub</NavLink>
                    <NavLink to="/lets-talk" onClick={() => setMenuOpen(false)} className="hover:text-secondary w-full">Let's Talk</NavLink>

                    <div className="flex flex-col gap-4 mt-4 pt-4 border-t w-full">
                        <NavLink
                            to="/alumni-login"
                            onClick={() => setMenuOpen(false)}
                            className="px-6 py-2 border-2 border-secondary text-secondary rounded-full font-semibold text-center hover:bg-secondary hover:text-white transition-all"
                        >
                            Alumni Login
                        </NavLink>

                        {/* Mobile Language Selector */}
                        <div className="flex flex-col gap-2">
                            <div
                                className="flex items-center justify-center gap-1 text-primary font-semibold py-2 cursor-pointer"
                                onClick={() => setLangOpen(!langOpen)}
                            >
                                <span>{language === "EN" ? "English" : "Arabic"}</span>
                                <ChevronDown size={18} className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`} />
                            </div>

                            {langOpen && (
                                <div className="flex flex-col items-center gap-2 pb-2">
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.code}
                                            className={`text-sm cursor-pointer ${language === lang.code ? "text-secondary font-bold" : "text-gray-600"}`}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setLangOpen(false);
                                            }}
                                        >
                                            {lang.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Navbar;