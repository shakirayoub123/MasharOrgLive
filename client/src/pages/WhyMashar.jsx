// App.js

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHash } from "../utils/scrollToHash";
import { motion, useAnimation } from "framer-motion";

// For local image, place image_622ebd.jpg in the src folder
import teamMashar from "../assets/WhyMasharUpdated.jpeg";
import curvedLine from "../assets/CurvedLine.png";
import ComBinedImg from "../assets/GroupCombinedNew.png";
import whyMashar from "../assets/MasharWhy.jpg";
import whyMasharCircle from "../assets/why-mashar-circle.svg";
import CardIcon1 from "../assets/CardIconsOne.png";
import CardIcon2 from "../assets/CardIconTwo.png";
import CardIcon3 from "../assets/CardIconsThree.png";
import CornorGroup from "../assets/CornorGroup.png";
import founder from "../assets/foundernew.jpg";
import skull1 from "../assets/skull1.svg";
import skull2 from "../assets/skull2.svg";
import eqa from "../assets/eqa.svg";
import one from "../assets/one.svg";
import SEO from "../components/SEO";
import persona from "../assets/persona.svg";
import ArrowButton from "../components/Arrowbutton";
import ImageMagick from "../assets/WhyMasharHero.jpeg";
import GlobalSection from "../components/logos2.jsx";

const WhyMashar = () => {
    const location = useLocation();

    useEffect(() => {
        scrollToHash(location.hash, 120);
    }, [location.hash]);

    const openCalendly = () => {
        console.log("clicked"); // ✅ WILL PRINT
        window.open(
            "https://calendly.com/raja-20/15min?month=2026-01",
            "_blank",
            "noopener,noreferrer",
        );
    };
    const createCard = (
        frontContent,
        backContent,
        frontBg,
        backBg,
        height = "400px",
    ) => {
        const controls = useAnimation();
        const [isFront, setIsFront] = useState(true);
        const [hovered, setHovered] = useState(false);
        const [isAnimating, setIsAnimating] = useState(false);

        const handleHover = async (hoverState) => {
            if (isAnimating || hovered === hoverState) return;
            setHovered(hoverState);
            setIsAnimating(true);

            // collapse
            await controls.start({
                scaleX: 0.01,
                transition: { duration: 0.25, ease: "easeInOut" },
            });

            // swap content/background
            setIsFront(!hoverState);

            // expand
            await controls.start({
                scaleX: 1,
                transition: { duration: 0.25, ease: "easeInOut" },
            });

            setIsAnimating(false);
        };

        return (
            <motion.div
                className="w-full max-w-[350px] sm:max-w-[350px] lg:max-w-[400px] min-h-[280px] sm:min-h-[350px] flex flex-col items-center justify-center rounded-xl shadow-lg cursor-pointer relative overflow-hidden"
                animate={controls}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
                whileHover={{
                    background:
                        "linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                    background: isFront
                        ? frontBg
                        : "radial-gradient(120% 120% at 50% 0%, #F3F6FF 0%, #ECEFFF 45%, #FFFFFF 100%)",
                    height: height,
                }}
            >

                <div
                    className="absolute inset-0 flex flex-col items-center justify-center w-full h-full px-8"
                // style={{ pointerEvents: "none" }}
                >
                    {isFront ? frontContent : backContent}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="font-spartan">
            <SEO
                title="Why Mashar | The Mashar Difference"
                description="Learn why Mashar is the leading global network designed to connect brilliant minds across industries for growth and collective opportunity."
            />
            {/* Header Section */}
            <header className="relative h-[200px]  sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-center text-white text-center p-8">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${whyMashar})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/30" />
                </div>

                {/* Content */}
                <div className="relative z-10 tracking-wider text-center px-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-semibold tracking-[0.5px] font-spartan mb-4">
                        WHY MASHAR
                    </h1>
                </div>
            </header>

            {/* Roots Run Deep Section */}
            <section id="roots" className="bg-white px-6 sm:px-10 lg:px-16 xl:px-24 pt-[40px] sm:pt-[100px] lg:pt-[140px] pb-[40px]">
                <div className="max-w-7xl mx-auto">

                    {/* 👇 collapse earlier for zoom safety */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* Left Content */}
                        <div className="w-full max-w-[620px] min-w-0">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-spartan font-medium leading-tight mb-8">
                                Our <span className="text-[#f39300]">Roots</span>{" "}
                                <span className="relative inline-block text-[#0f1c80]">
                                    Run Deep
                                    <img
                                        src={curvedLine}
                                        alt="curve"
                                        className="absolute left-0 -bottom-3 w-[240px]"
                                    />
                                </span>
                            </h2>

                            <p className="text-[17px] text-[#0F1C80] leading-[28px] mb-6">
                                Our story is grounded in a legacy of authentic, impact driven leadership
                                and transformation.
                            </p>

                            <p className="text-[16px] leading-[28px] text-gray-800 mb-2">
                                Founded in 2014, Mashar began with a simple, powerful belief:
                            </p>

                            <p className="font-poppins text-[16px] font-medium leading-[24px] tracking-[0.5px] text-[#f39300] mb-6">
                                “Great leadership starts with self awareness and cultural alignment”.
                            </p>

                            <p className="text-[16px] leading-[28px] text-gray-800 mb-6">
                                We were the first firm in the GCC to launch a bilingual Certified
                                Professional Coaching & Mentoring Program pioneering a unique blend of
                                global standards and regional values.
                            </p>

                            <p className="text-[16px] leading-[28px] text-gray-800 mb-6">
                                Over the years, we’ve partnered with thousands of leaders and organizations
                                across the Middle East, helping them grow with clarity, purpose, and
                                lasting impact.
                            </p>

                            <p className="text-[16px] leading-[28px] text-gray-800">
                                Since 2017, Mashar continues to deliver programs that are interactive,
                                culturally relevant, and transformative.
                            </p>
                        </div>

                        {/* Right Image */}
                        <div className="w-full flex justify-center lg:justify-end min-w-0 h-full">
                            <div className="w-full max-w-[560px] h-full rounded-[28px] overflow-hidden">
                                <img
                                    src={teamMashar}
                                    alt="Our Roots"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section id="mission" className="bg-white md:py-[120px] text-center relative">
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-[300px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
                {/* Heading */}
                <h2 className="md:text-5xl text-3xl font-medium font-spartan mb-4 leading-snug relative">
                    <span className="text-black">Rooted in </span>
                    <span className="text-[#0F1C80]">Values</span>{" "}

                    {/* Built for with curved line - Desktop only */}
                    <span className="hidden md:inline-block relative pb-4">
                        <span className="text-black">Built for&nbsp;</span>
                        <img
                            src={curvedLine}
                            alt=""
                            className="absolute bottom-0 left-[-17px] w-[280px] pointer-events-none"
                        />
                    </span>

                    {/* Built for - Mobile only (no underline) */}
                    <span className="md:hidden text-black">Built for &nbsp;</span>

                    {/* Transformation with curved line - Mobile only */}
                    <span className="md:hidden relative inline-block pb-[10px]">
                        <span className="text-[#F39300]">Transformation</span>

                    </span>

                    {/* Transformation - Desktop only (no underline) */}
                    <span className="hidden md:inline text-[#F39300]">Transformation</span>
                </h2>
                <p className="max-w-[720px] mx-auto font-poppins text-sm sm:text-base leading-relaxed sm:leading-[26px] tracking-[0.4px] text-[#1A1A1A] mb-10 sm:mb-14 lg:mb-20 px-2">
                    Just like a tree thrives with strong roots, Mashar empowers
                    individuals and organizations to grow with clarity, connection, and
                    resilience.
                </p>

                {/* Cards */}
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 px-4 sm:px-0">
                    {/* Vision */}
                    <div className="bg-[#F1F1F1] rounded-[20px] px-6 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16 text-center cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0px_18px_50px_rgba(0,0,0,0.12)]">
                        <h3 className="text-[22px] sm:text-[26px] lg:text-[36px] font-spartan font-semibold text-[#0F1C80] mb-4 sm:mb-6">
                            Our Vision
                        </h3>
                        <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-center text-[#1A1A1A]">
                            To shape future ready  leaders who lead with purpose, compassion,
                            and cultural insight becoming the Middle East’s most trusted
                            force in leadership development.
                        </p>

                    </div>

                    {/* Mission */}
                    <div className="bg-[#F1F1F1] rounded-[20px] px-6 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16 text-center cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0px_18px_50px_rgba(0,0,0,0.12)]">
                        <h3 className="text-[22px] sm:text-[26px] lg:text-[36px] font-spartan font-semibold text-[#0F1C80] mb-4 sm:mb-6">
                            Our Mission
                        </h3>
                        <p className="font-poppins font-normal text-[15px] leading-[30px] tracking-[0.5px] text-center text-[#1A1A1A]">
                            We co create learning experiences that strengthen the human side
                            of leadership; empowering individuals, teams, and organizations to
                            grow with clarity, trust, and impact.
                        </p>
                    </div>
                </div>
            </section>

            {/* our values Section */}
            <section className="relative h-[430px] flex flex-col justify-center items-center text-white text-center p-8">
                <div
                    className="absolute inset-0 bg-cover"
                    style={{
                        backgroundImage: `url(${ImageMagick})`,
                        backgroundPosition: "center 10%",
                        filter: "blur(0.3px)",
                    }}
                />



            </section>

            {/* Goals Section */}
            <div className="relative pt-20 overflow-hidden">
                <div className="container mx-auto">
                    {/* Heading + Animation */}
                    <div className="relative flex justify-center items-center mb-12">
                        {/* Centered: "Our Goals" */}
                        <div className="text-center z-10 mt-12 sm:mt-0">
                            <h2 className="md:text-5xl text-3xl font-medium font-spartan mb-4 leading-snug relative inline-block">
                                <span className="text-black">Our </span>
                                <span className="text-[#f39300]">Goals</span>

                                {/* Curved underline */}
                                <img
                                    src={curvedLine}
                                    alt="curve"
                                    className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-[220px] md:w-[300px] h-auto pointer-events-none"
                                />
                            </h2>

                        </div>

                        <div className="absolute  top-5  left-0 z-0  pointer-events-none">
                            <div
                                className="absolute rounded-full"
                                style={{
                                    position: "absolute",
                                    width: "155px",
                                    height: "155px",
                                    top: "-50px",
                                    left: "50px",
                                    opacity: 0.05,
                                    borderWidth: "11px",
                                    borderStyle: "solid",
                                    borderColor: "#EB8F03",
                                    borderRadius: "100px",
                                    boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                                }}
                            ></div>

                            <div
                                className="absolute rounded-full"
                                style={{
                                    position: "absolute",
                                    width: "190px",
                                    height: "145px",
                                    top: "-85px",
                                    left: "-25px",
                                    transform: "rotate(-233.73deg)",
                                    opacity: 0.05,
                                    borderWidth: "11px",
                                    borderStyle: "solid",
                                    borderColor: "#EB8F03",
                                    borderRadius: "100px",
                                    boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="sm:mx-11 md:mx-0 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Card 1 */}
                        <div
                            className="group bg-[#EDEDED] rounded-[22px] px-10 py-16 text-center cursor-pointer transition-all duration-700 ease-in-out transform hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0px_18px_50px_rgba(0,0,0,0.14)] hover:bg-[linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)] will-change-transform"
                        >
                            <div
                                className="w-[114px]  mx-auto mb-8 bg-white rounded-full
      flex items-center justify-center
      transition-all duration-300 group-hover:scale-105"
                            >
                                <img src={CardIcon1} alt="Icon" className="w-[114px] h-[114px]" />
                            </div>

                            <h3
                                className="text-[#0F1C80] text-[22px] font-semibold mb-5 leading-snug
      transition-colors duration-300 group-hover:text-[#F39300]"
                            >
                                Culturally Aligned <br /> Coaching
                            </h3>

                            <p className="text-[16px] leading-[28px] text-[#1A1A1A]">
                                Expand the reach of executive coaching by aligning practices
                                with local culture.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div
                            className="group bg-[#EDEDED] rounded-[22px] px-10 py-16 text-center cursor-pointer transition-all duration-700 ease-in-out transform hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0px_18px_50px_rgba(0,0,0,0.14)] hover:bg-[linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)] will-change-transform"
                        >
                            <div
                                className="w-[114px]  mx-auto mb-8 bg-white rounded-full
      flex items-center justify-center
      transition-all duration-300 group-hover:scale-105"
                            >
                                <img src={CardIcon2} alt="Icon" className="w-[114px] h-[114px]" />
                            </div>

                            <h3
                                className="text-[#0F1C80] text-[22px] font-semibold mb-5 leading-snug
      transition-colors duration-300 group-hover:text-[#F39300]"
                            >
                                A Thriving Coaching <br /> Community
                            </h3>

                            <p className="text-[16px] leading-[28px] text-[#1A1A1A]">
                                Build a community of culturally attuned professional coaches and
                                mentors.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div
                            className="group bg-[#EDEDED] rounded-[22px] px-10 py-16 text-center cursor-pointer transition-all duration-700 ease-in-out transform hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0px_18px_50px_rgba(0,0,0,0.14)] hover:bg-[linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)] will-change-transform"
                        >
                            <div
                                className="w-[114px]  mx-auto mb-8 bg-white rounded-full
      flex items-center justify-center
      transition-all duration-300 group-hover:scale-105"
                            >
                                <img src={CardIcon3} alt="Icon" className="w-[114px] h-[114px]" />
                            </div>

                            <h3
                                className="text-[#0F1C80] text-[22px] font-semibold mb-5 leading-snug
      transition-colors duration-300 group-hover:text-[#F39300]"
                            >
                                Innovative, Practical <br /> Solutions
                            </h3>

                            <p className="text-[16px] leading-[28px] text-[#1A1A1A]">
                                Design innovative, practical solutions that meet evolving
                                organizational needs.
                            </p>
                        </div>
                    </div>
                </div>
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />

            </div>

            {/* Founder Section */}
            <div className="relative  mb-16">
                <div className="absolute  top-5  left-[80px] z-0  pointer-events-none">
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: "138.76px",
                            height: "136.43px",
                            top: "-19.51px",
                            left: "-9.76px",
                            opacity: 0.1,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgba(15, 28, 128, 0.4)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px rgba(43, 52, 118, 0.3)",
                        }}
                    />

                    <div
                        className="absolute rounded-full"
                        style={{
                            width: "170.73px",
                            height: "126.57px",
                            top: "-47px",
                            left: "-78px",
                            transform: "rotate(-233.73deg)",
                            opacity: 0.1,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgba(15, 28, 128, 0.4)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px rgba(43, 52, 118, 0.3)",
                        }}
                    />
                </div>
            </div>

            {/* team section */}
            <section id="team" className="bg-white px-6 sm:px-10 lg:px-16 xl:px-24 pt-[40px] sm:pt-[100px] lg:pt-[140px] pb-[40px]">
                <div className="relative container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-10 px-5 lg:px-0">

                    {/* Left Side */}
                    <div className="lg:w-[45%] relative z-10 text-center lg:text-left">
                        <div className="relative inline-block">
                            <h2 className="md:text-5xl text-3xl font-medium font-spartan mb-4 leading-snug relative inline-block">
                                <span className="text-black">Our </span>
                                <span className="text-[#f39300]">Team</span>

                                <img
                                    src={curvedLine}
                                    alt="curve"
                                    className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-[220px] md:w-[300px]"
                                />
                            </h2>
                        </div>

                        <p className="mt-6 md:text-[16px] leading-[28px] text-gray-800">
                            We are a regional network of certified coaches, facilitators, and mentors
                            with international accreditation and a passion for leadership growth.
                            Together, we bring proven methods and cultural insight to support leaders
                            across the Middle East.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="lg:w-[55%] flex items-center">
                        <div className="w-full max-w-[581px] aspect-[581/537]">
                            <img
                                src={ComBinedImg}
                                alt="Our team collaboration"
                                className="w-full h-full object-cover rounded-3xl"
                            />
                        </div>
                    </div>

                </div>
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
                <div className="container mx-auto max-w-5xl md:pb-[48px]  md:px-60 lg:px-0 p-9">
                    <div className="flex mt-10 flex-col 1140:flex-row items-center justify-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8 relative">
                        {/* Left Side - Founder Image */}
                        <div className="h-[420px] 1140:w-[380px] text-center mt-8 1140:text-left flex-shrink-0 1140:border-r-[1.4px]  border-[#181A6C] ">
                            <div className="relative">
                                <img
                                    src={founder}
                                    alt="Mrs. Raja'a Yousef Allaho"
                                    className="w-72 h-72 rounded-full object-cover mx-auto mt-4 1140:mx-0 shadow-md"
                                />
                            </div>
                            <h3 className="mt-8 text-[22px] font-medium mb-2 font-poppins tracking-wide text-[#181A6C]">
                                Raja Allaho
                            </h3>
                            <p className="font-poppins text-[16px] font-light leading-[26px] tracking-wide mb-10 text-[#1A1A1A]">
                                Founder of Mashar
                                <br />
                                Executive, Team &amp; Mentor Coach
                            </p>
                        </div>

                        {/* Right Side - Bio */}
                        <div className="w-full lg:w-2/3 pt-14">
                            <h2 className="md:text-5xl text-3xl font-medium font-spartan mb-4 leading-snug relative inline-block">
                                Meet <span className="text-[#0f1c80]">Our Founder</span> &{" "}
                                <span className="text-[#f39300] relative md:leading-[50px]  ">
                                    <br className="md:block hidden" />
                                    Lead Coach
                                </span>
                            </h2>

                            <blockquote className="font-poppins text-[16px] font-semibold leading-[24px] mb-2 tracking-[0.5px] text-[#0F1C80]">
                                “Coaching is more than my profession — it is my calling.”
                            </blockquote>

                            <p className="mb-4 font-poppins text-sm">
                                With over 25 years in leadership development, Raja'a has:
                            </p>

                            {/* Achievements List */}
                            <ul className="space-y-0 font-poppins text-sm">
                                {[
                                    "Trained and mentored 500+ certified coaches",
                                    "Founded the Middle East’s first bilingual Coaching & Mentoring Academy",
                                    "Earned accreditations from ICF, EMCC, and leading global institutes",
                                    "Served as ICF Kuwait Chapter Leader and co-faculty at Henley Business School",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex  items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-9 h-9 mr-3 flex-shrink-0"
                                            viewBox="0 0 42 42"
                                            fill="none"
                                        >
                                            <path
                                                d="M8.75 25.375C8.75 25.375 11.375 25.375 14.875 31.5C14.875 31.5 24.6033 15.4577 33.25 12.25"
                                                stroke="#0f1c80"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Certifications */}
                            <p className="mt-6 font-poppins text-sm">
                                She is also certified in GEDI, TAWDI, Psychological Safety, and
                                Team Coaching  bringing global science into culturally aligned
                                leadership practices.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <GlobalSection />

            {/* Certifications Section */}
            <div className="min-h-screen">
                <section className="max-w-[70rem] mx-auto px-4 pt-16 ">
                    <h2 className="relative md:text-5xl text-3xl font-spartan font-medium text-center text-[#2B3476] mb-8">
                        <span className="relative inline-block tracking-wide">
                            Accredited. Certified. Globally{" "}
                            <span className="text-[#f39300] relative inline-block">
                                Recognized
                            </span>
                            <img
                                src={curvedLine}
                                alt="curve"
                                className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[220px] h-[12px]"
                            />
                        </span>
                    </h2>


                    <p className="text-center text-[16px] text-[#000000] font-poppins mt-10 mb-12">
                        At Mashar, accreditation is more than a credential it’s a
                        commitment to excellence, accountability, and impact. Our
                        certifications represent global best practices, regional relevance,
                        and ethical responsibility. Each accreditation ensures that our
                        programs are effective, culturally attuned, and rooted in science.
                        Trusted by leaders across the region.
                    </p>

                    <div>
                        <div className="flex justify-center mt-16 gap-8 max-w-6xl mx-auto 645:flex-row flex-col items-center">
                            {/* Card 1 */}
                            {createCard(
                                <>
                                    <div className="bg-white w-[220px] h-[180px] p-2 flex items-center justify-center rounded-3xl mb-4">
                                        <img src={one} alt="front" className="h-36 object-contain" />
                                    </div>
                                    <p className="text-[21px] font-spartan text-[#0F1C80] font-medium text-center tracking-wide">
                                        ICF Coaching Accreditation
                                    </p>
                                </>,
                                <div className="leading-snug text-center sm:text-left">
                                    <h1 className="text-[20px] sm:text-[26px] lg:text-[22px]
        mb-2
        text-[#f39300]
        font-spartan font-semibold">
                                        ICF Coaching Accreditation
                                    </h1>

                                    <p className="font-spartan text-[#2B3476]
        text-[16px] sm:text-xl
        mb-4 sm:mb-6">
                                        Setting the Global Standard for Leadership coaching
                                    </p>

                                    <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-[#1A1A1A] max-w-[520px] mb-3">
                                        The world’s leading authority on professional coaching, empowering internal coaches, professionals, consultants, and leaders to deepen their skills and embrace coaching as a leadership approach.
                                        Ready to elevate your coaching career and leadership impact?
                                    </p>

                                    <div className="w-full flex justify-center sm:justify-start">
                                        <ArrowButton text="Explore Our ICF-Certified Program" textSize="14px" />
                                    </div>
                                </div>,
                                "#EEEEEE", // default background (image shows through)
                                "radial-gradient(120% 120% at 50% 0%, #F3F6FF 0%, #ECEFFF 45%, #FFFFFF 100%)",
                                "500px",
                            )}
                            {/* Card 2 */}
                            {createCard(
                                <>
                                    <div className="bg-white w-[220px] h-[180px] flex items-center justify-center rounded-3xl mb-4">

                                        <img
                                            src={eqa}
                                            alt="Persona Global logo"
                                            className="h-36 object-contain"
                                        />
                                    </div>
                                    <p className="text-[21px] text-[#0F1C80] font-spartan font-medium text-center tracking-wide">
                                        EMCC Mentoring Accreditation{" "}
                                    </p>
                                </>,
                                <div>
                                    <div className="leading-relaxed w-[350px] sm:w-full mx-auto px-4 sm:px-0 overflow-x-hidden">
                                        <h1 className="text-[22px] mb-2 sm:text-[26px] lg:text-[22px] text-[#f39300] font-spartan font-semibold">
                                            ICF Coaching Accreditation
                                        </h1>

                                        <p className="font-spartan text-[#2B3476] text-xl mb-6">
                                            Setting the Global Standard for Leadership Coaching
                                        </p>

                                        <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-[#1A1A1A] max-w-[520px] mb-3">
                                            The world’s leading authority on professional coaching, empowering internal
                                            coaches, professionals, consultants, and leaders to deepen their skills and
                                            embrace coaching as a leadership approach. <br /> &nbsp;
                                        </p>

                                        <div className="w-full flex justify-center sm:justify-start">
                                            <ArrowButton text="Explore Our ICF-Certified Program" textSize="12px sm:16px" />
                                        </div>
                                    </div></div>,
                                "#EEEEEE", // default background (image shows through)
                                "radial-gradient(120% 120% at 50% 0%, #F3F6FF 0%, #ECEFFF 45%, #FFFFFF 100%)",
                                "500px",
                            )}
                        </div>

                    </div>
                    <h2 className="relative md:pt-[64px] text-3xl lg:text-5xl font-spartan font-medium text-center mb-8 mt-20">
                        <span className="relative inline-block tracking-wide">

                            Global Tools for{" "}
                            <span className="text-[#2B3476]">Human-Centered &nbsp;</span>
                            <span className="text-[#f39300]">Leadership</span>
                        </span>
                        {/* SVG underline */}
                        <img
                            src={curvedLine}
                            alt="curve"
                            className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-[229px] h-[14px]"
                        />
                    </h2>

                    <div className="flex justify-center mt-16 gap-8 mx-auto max-w-6xl 645:flex-row flex-col items-center">
                        {/* Card 1 */}
                        {createCard(
                            // Front content
                            <>
                                <div className="bg-white w-55 h-40 flex items-center justify-center rounded-3xl mb-4">
                                    <img
                                        src={skull1}
                                        alt="front"
                                        className="h-[100px] w-[120px] object-contain"
                                    />
                                    <img
                                        src={skull2}
                                        alt="front"
                                        className="h-[100px] w-[120px] object-contain"
                                    />

                                </div>

                                <p className="font-poppins text-center text-[#0F1C80]">
                                    <span className="block font-medium md:text-[16px] sm:text-[18px] leading-[36px] tracking-[0.5px] whitespace-nowrap">
                                        Academy of Brain Based Leadership
                                    </span>

                                    <span className="block font-normal text-[14px] leading-[30px] tracking-[0.5px] whitespace-nowrap">
                                        Certified Facilitator
                                    </span>
                                </p>

                            </>,
                            // Back content
                            <div>
                                <h1 className="font-poppins font-medium text-[24px] leading-[30px] tracking-[0.5px] text-[#F39300] mb-4">
                                    Academy of Brain Based Leadership
                                </h1>

                                <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-[#2B3476]">
                                    Certified Facilitator
                                </p>

                                <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-[#1A1A1A] max-w-[520px]">
                                    Neuroscience based programs on Psychological Safety, helping leaders and teams
                                    build trust, reduce threat responses, and thrive in high performance environments.
                                </p>

                            </div>,
                            "#EEEEEE", // default background (image shows through)
                            "radial-gradient(120% 120% at 50% 0%, #F3F6FF 0%, #ECEFFF 45%, #FFFFFF 100%)",
                            "350px",
                        )}

                        {/* Card 2 */}
                        {createCard(
                            <>
                                <div className="bg-white w-55 h-40 flex items-center justify-center rounded-3xl mb-4">
                                    <img
                                        src={persona}
                                        alt="Persona Global logo"
                                        className="w-[220px] object-contain"
                                    />

                                </div>

                                <p className="font-poppins text-center text-[#0F1C80]">
                                    <span className="block font-medium text-[18px] leading-[36px] tracking-[0.5px] whitespace-nowrap">
                                        Persona Global
                                    </span>
                                    <span className="block font-normal text-[14px] leading-[30px] tracking-[0.5px] whitespace-nowrap">
                                        Certified Facilitator
                                    </span>
                                </p>

                            </>,
                            <div className="">
                                <h1 className="font-poppins font-medium text-[24px] leading-[30px] tracking-[0.5px] text-[#F39300] mb-4">
                                    Persona Global
                                </h1>

                                <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-[#2B3476]">
                                    Certified Partner
                                </p>

                                <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-[#1A1A1A] max-w-[520px]">
                                    Behavioral tools used in 70+ countries, adapted for cultural relevance to improve
                                    communication, leadership, and emotional intelligence.
                                </p>

                            </div>,
                            "#EEEEEE", // default background (image shows through)
                            "radial-gradient(120% 120% at 50% 0%, #F3F6FF 0%, #ECEFFF 45%, #FFFFFF 100%)",
                            "350px",
                        )}
                    </div>
                </section>
            </div>

            {/* lets grow together Section */}
            <div className="font-spartan relative pb-16 md:mt-24 flex  justify-center items-center text-center  overflow-hidden">
                <div className="absolute top-[-25px] left-1">
                    <img
                        src={whyMasharCircle}
                        alt="Background Decorative"
                        className="w-[100px]"
                    />
                </div>

                <div className="relative z-10 p-6 max-w-4xl">
                    <h2 className="relative text-3xl lg:text-5xl font-spartan font-medium text-center mb-8 mt-20">
                        Let’s <span className="text-[#0f1c80]">Grow</span>{" "}
                        <span className="relative inline-block text-[#f39300]">
                            Together
                            <img
                                src={curvedLine}
                                alt="curve"
                                className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-[229px] h-[12px]"
                            />
                        </span>
                    </h2>

                    {/* At Mashar text */}
                    <p className="font-poppins font-normal text-[15px] leading-[30px] text-[#000000] tracking-[0.5px] text-center mb-6">
                        At Mashar, we don’t just build skills we nurture purpose,
                        leadership, and well being that last. Because true transformation
                        begins with people.
                    </p>
                    <p className="font-poppins font-medium text-[32px] leading-[42px] tracking-[0.5px] text-[#3B3B3B] text-center mb-4">
                        Ready to grow with purpose?
                    </p>

                    {/* Let’s start */}
                    <p className="font-poppins mt-2 font-normal text-[16px] leading-[30px] tracking-[0.5px] text-center mb-10">
                        Let’s start your leadership journey together.
                    </p>

                    {/* CTA */}
                    <div className="relative inline-flex items-center">
                        <ArrowButton
                            text="Book a Discovery Call"
                            onClick={openCalendly}
                            textSize="16px"
                        />
                    </div>

                </div>
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
            </div>
        </div>
    );
};

export default WhyMashar;
