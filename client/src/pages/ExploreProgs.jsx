import React, { useEffect, useRef, useState } from "react";
import teamMashar from "../assets/LeadershipHubHero.jpeg";
import WhyMashar from "../assets/FinalPrograms.jpeg";
import whyMasharCircle from "../assets/why-mashar-circle.svg";
import TestimonialsSlider from "../components/TestimonialsSlider";
import LeadersSection from "../components/logos";
import TrainingSection from "../components/TrainingSection";
import CoachingPrograms from "../components/CoachingPrograms.jsx";
import MentoringSupervision from "../components/MentoringSupervision.jsx";
import AssessmentToolsSection from "../components/AssessmentToolsSection.jsx";
import CustomSolutions from "../components/CustomSolutions.jsx";
import curvedLine from "../assets/CurvedLine.png";
import { useLocation } from "react-router-dom";
import SEO from "../components/SEO";

const ExplorePrograms = () => {
    const [activeTab, setActiveTab] = useState("training");
    const location = useLocation();
    useEffect(() => {
        if (location.state?.targetTab) {
            setActiveTab(location.state.targetTab);

            // wait for DOM + tab render
            setTimeout(() => {
                programsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 200);
        }
    }, [location.state]);
    const programsRef = useRef(null);

    return (
        <div className="font-spartan overflow-hidden">
            <SEO
                title="Explore Programs | Mashar"
                description="Explore Mashar's rigorous training methodology and targeted programs designed to grow your skillset and capacity for leading the future."
            />

            {/* ================= HEADER ================= */}
            <header className="relative h-[200px]  sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-center text-white text-center p-8">
                <div
                    className="absolute inset-0 bg-cover bg-top"
                    style={{ backgroundImage: `url(${WhyMashar})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/30" />
                </div>

                <div className="relative z-10 tracking-wider text-center px-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-semibold tracking-[0.5px] font-spartan mb-4">
                        EXPLORE PROGRAMS
                    </h1>
                </div>
            </header>

            {/* ================= CONFIDENCE / IMPACT SECTION ================= */}
            {/* ================= CONFIDENCE / IMPACT SECTION ================= */}
            <section className="w-full bg-white py-16 sm:py-20">
                <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">

                        {/* Image */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-[440px] aspect-[440/450] rounded-[24px] overflow-hidden shrink-0">
                                <img
                                    src={teamMashar}
                                    alt="Leadership discussion"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="max-w-[560px] mt-8 lg:mt-0">
                            <h2 className="font-spartan font-medium leading-[1.15] text-[clamp(30px,4.5vw,48px)] mb-8">
                                <span className="text-black">Lead with </span>
                                <span className="text-[#1A2A8A]">Confidence.</span>
                                <br />
                                <span className="text-[#1A2A8A]">Create Lasting </span>
                                <span className="relative inline-block text-[#F39300]">
                                    Impact
                                    {/* Curved underline */}
                                    <img
                                        src={curvedLine}
                                        alt="curve"
                                        className="absolute left-1/2 -translate-x-1/2 -bottom-3 sm:-bottom-4 xl:h-[15px] w-[180px] sm:w-[220px]"
                                    />
                                </span>
                            </h2>

                            <p className="font-poppins text-[15px] sm:text-[15px] leading-[1.85] tracking-[0.025em] text-[#222] mb-6">
                                At Mashar, we don&apos;t believe in off the shelf solutions. Every program is
                                co created around people, culture, and purpose blending science,
                                cultural insight, and real world application to spark lasting change.
                            </p>

                            <p className="font-poppins text-[15px] sm:text-[15px] leading-[1.85] tracking-[0.025em] text-[#222]">
                                Whether you&apos;re looking for leadership coaching, team alignment, or
                                high impact training, our programs meet you where you are and take you
                                where you want to grow.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= TABS ================= */}
            <section ref={programsRef} className="relative bg-[#F2F2F2] pt-8 pb-28">

                {/* ===== TABS (BOTTOM-ALIGNED) ===== */}
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-full z-30">
                    <div className="w-[95vw] sm:w-[90vw] mx-auto">
                        <div className="bg-[#0f1c80] rounded-[18px] shadow-[0px_14px_40px_rgba(0,0,0,0.2)] p-2">

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                {[
                                    { key: "training", label: "TRAINING PROGRAMS" },
                                    { key: "coaching", label: "COACHING PROGRAMS" },
                                    { key: "mentoring", label: "MENTORING & SUPERVISION" },
                                    { key: "assessment", label: "ASSESSMENT TOOLS" },
                                    { key: "custom", label: "CUSTOM SOLUTIONS" },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`
                h-[54px] sm:h-[64px]
                text-[11px] sm:text-[13px] lg:text-[14px]
                tracking-wider
                font-medium
                text-white
                rounded-[12px]
                transition-all
                duration-300
                px-1
                ${activeTab === tab.key ? "bg-[#f39300]" : "bg-white/10 hover:bg-white/20"}
              `}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

            </section>

            {/* ================= DYNAMIC PROGRAM SECTIONS ================= */}
            {activeTab === "training" && <TrainingSection />}
            {activeTab === "coaching" && <CoachingPrograms />}
            {activeTab === "mentoring" && <MentoringSupervision />}
            {activeTab === "assessment" && <AssessmentToolsSection />}
            {activeTab === "custom" && <CustomSolutions />}

            {/* ================= TESTIMONIALS ================= */}
            <section className=" md:pt-[100px] bg-white text-center">
                <h2 className="font-spartan font-medium leading-[1.15] text-[36px] md:text-[46px] lg:text-[46px] mb-10">
                    <span className="text-black">What Our </span>
                    <span className="text-[#f39300]">Clients Say</span>

                    {/* Curved underline */}
                    <img
                        src={curvedLine}
                        alt="curve"
                        className="relative left-1/2 -translate-x-1/2 -bottom-5 w-[160px] md:w-[200px] lg:w-[230px]"
                    />
                </h2>

                <p className=" font-poppins text-[16px] leading-[30px] text-[#1A1A1A] mb-6">Real results. Real voices.</p>
                <TestimonialsSlider />
            </section>

            {/* ================= LOGOS ================= */}
            <section className="pb-20">
                <LeadersSection />
            </section>

        </div>
    );
};

export default ExplorePrograms;
