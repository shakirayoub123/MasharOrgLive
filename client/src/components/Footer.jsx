import React, { useState } from "react";
import { FaInstagram, FaFacebookF, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdLocationOn } from "react-icons/md";
import logoFooter from "../assets/masharWhiteFinal.svg";
import { Link } from "react-router-dom";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <footer className="bg-primary text-white">

            {/* TOP SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[50px] pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.4fr_1.4fr] gap-10 lg:gap-12 xl:gap-16">

                    {/* COL 1 — Logo + Description + Socials */}
                    <div className="flex flex-col items-center sm:items-start">

                        {/* Logo + Text */}
                        {/* Logo + Text */}
                        <div className="flex items-start gap-6 sm:gap-7 lg:gap-8">
                            {/* Logo */}
                            <img
                                src={logoFooter}
                                alt="Mashar Logo"
                                className="h-[70px] sm:h-[85px] lg:h-[120px] object-contain flex-shrink-0"
                            />

                            {/* Text + Socials — same height as logo */}
                            <div className="flex flex-col justify-between h-[70px] sm:h-[85px] lg:h-[120px]">
                                <p className="text-[13px] text-left leading-[1.8] opacity-80 max-w-[320px]">
                                    Your partner in accredited coaching, leadership, and growth with impact
                                </p>

                                {/* Social Icons */}
                                <div className="flex gap-3">
                                    {[
                                        { icon: FaFacebookF, url: "https://www.facebook.com/masharcoaching" },
                                        { icon: FaXTwitter, url: "https://x.com/Rajathecoach" },
                                        { icon: FaInstagram, url: "https://www.instagram.com/masharcoaching/" },
                                        { icon: FaLinkedin, url: "https://www.linkedin.com/in/raja-allaho/" },
                                    ].map(({ icon: Icon, url }, i) => (

                                        <a
                                            key={i}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                            style={{ background: "#FFFFFF" }}
                                        >
                                            <Icon className="text-black text-[16px]" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>


                    </div>


                    {/* COL 2 — Quick Links */}
                    <div>
                        <h3 className="text-[16px] sm:text-[17px] font-semibold mb-5 sm:mb-6">Quick Links</h3>
                        <ul className="flex leading-[15px] flex-col gap-3 sm:gap-3.5">
                            {[
                                { label: "Home", to: "/" },
                                { label: "Our Signature", to: "/ourSignature" },
                                { label: "Programs", to: "/explorePrograms" },
                                { label: "Leadership Hub", to: "/leadership-hub" },
                                { label: "Let's Talk", to: "/lets-talk" },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link
                                        to={item.to}
                                        className="text-[13px]  sm:text-[14px] opacity-70 hover:opacity-100 hover:text-secondary transition duration-300"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 3 — Contact */}
                    <div>
                        <h3 className="text-[16px] sm:text-[17px] font-semibold mb-5 sm:mb-6">Contact</h3>
                        <ul className="flex flex-col gap-4 sm:gap-5">
                            {[
                                { icon: FaPhoneAlt, iconSize: 13, text: "+965 222 811 97" },
                                { icon: MdEmail, iconSize: 15, text: "info@mashar.org" },
                                { icon: MdLocationOn, iconSize: 15, text: "Kuwait City, Kuwait" },
                            ].map(({ icon: Icon, iconSize, text }, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    {/* Icon pill — filled circle like screenshot */}
                                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-[1px]">
                                        <Icon size={iconSize} className="text-black" />
                                    </span>
                                    <span className="text-[13px] sm:text-[14px] opacity-70 leading-[30px]">
                                        {text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 4 — Newsletter */}
                    <div>
                        <h3 className="text-[16px] sm:text-[17px] font-semibold mb-4 sm:mb-5 leading-[1.4] max-w-[180px]">
                            Subscribe To Our Newsletter
                        </h3>

                        {/* Email Input — outlined style like screenshot */}
                        <input
                            type="email"
                            placeholder="Email"

                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={submitted}
                            className="
    w-full
    bg-transparent
    border border-white/30
    rounded-md
    px-4
    py-2.5 sm:py-3
    text-white
    placeholder-white/50
    text-[13px] sm:text-[14px]
    mt-2
    focus:outline-none
    focus:border-white/60
    transition duration-300
    disabled:opacity-60
  "
                        />

                        {/* Subscribe Button — outlined style like screenshot */}
                        <button
                            onClick={() => {
                                if (!email) return;
                                setSubmitted(true);
                                setTimeout(() => setSubmitted(false), 3000);
                            }}

                            disabled={submitted}
                            className="
    w-full
    mt-3
    border border-white/30
    bg-transparent
    text-white
    rounded-md
    py-2.5 sm:py-3
    text-[12px] sm:text-[13px]
    font-semibold
    tracking-[0.08em]
    uppercase
    hover:bg-white/10
    transition duration-300
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
                        >
                            Subscribe Now
                        </button>


                        {submitted && (
                            <div className="mt-2 text-[13px] text-[#f39300] font-medium flex items-center gap-1 whitespace-nowrap">
                                ✓ Successfully submitted. Thank you!
                            </div>
                        )}


                    </div>

                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-white/20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[13px] opacity-60">
                        © 2026 Mashar. All Rights Reserved.
                    </span>
                    <div className="flex items-center gap-5 text-[13px] opacity-60">
                        <a href="#" className="hover:text-secondary hover:opacity-100 transition duration-300">
                            Privacy Policy
                        </a>
                        <span className="opacity-40">|</span>
                        <a href="#" className="hover:text-secondary hover:opacity-100 transition duration-300">
                            Terms & Conditions
                        </a>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;