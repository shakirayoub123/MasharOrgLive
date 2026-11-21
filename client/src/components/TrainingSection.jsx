import ArrowButton from "./Arrowbutton";
import trainingHeaderImg from "../assets/TraningFinal.jpeg";
import eqaIcon from "../assets/eqa.svg";
import personaIcon from "../assets/persona.svg";
import brainIcon from "../assets/brain.png";
import humanWorksIcon from "../assets/humanb.png";
import group1851 from "../assets/GroupBG.png";
import CurvedLine from "../assets/CurvedLine.png";
import CornorGroup from "../assets/CornorGroup.png";
import React from "react";
import {useNavigate} from "react-router-dom";

const TrainingSection = () => {
    const navigate = useNavigate(); // ✅ CORRECT PLACE

    const openCalendly = () => {
        console.log("clicked"); // ✅ WILL PRINT
        window.open(
            "https://calendly.com/raja-20/15min?month=2026-01",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const trainingPrograms = [
        {
            title: "Leader as a Coach",
            subtitle: "ICF accredited | 3-day immersive workshop",
            icon: eqaIcon,
            description:
                "Equips leaders and HR professionals with foundational coaching skills to drive a culture of feedback and growth.",
            points: [
                "For: Team leaders, senior managers, HR professionals",
                "You'll gain: Practical coaching techniques, feedback culture, foundational ICF hours",
            ],
            button: "DOWNLOAD PROGRAM PDF",
        },
        {
            title: "Personal Leadership",
            subtitle: "20-hour blended journey + 5 coaching sessions",
            icon: personaIcon,
            description:
                "Strengthen your inner leadership through values alignment, emotional intelligence, and resilience.",
            points: [
                "For: Managers, rising leaders, professionals at a turning point",
                "You'll gain: Self awareness, values clarity, and a roadmap for impact",
            ],
            button: "DOWNLOAD PROGRAM PDF",
        },
        {
            title: "Present. Speak. Influence",
            subtitle: "5-day communication mastery with immersive tech",
            icon: personaIcon,
            description:
                "Master high-stakes presentation, negotiation, and executive presence using cutting-edge simulation tools.",
            points: [
                "For: Mid to senior-level professionals, public facing roles",
                "You'll gain: Persuasive communication, confidence, and influence",
            ],
            button: "DOWNLOAD PROGRAM PDF",
        },
        {
            title: "Psychological Safety & Ethics",
            subtitle: "Neuroscience based with S.A.F.E.T.Y.™ model",
            icon: brainIcon,
            description:
                "Create high-trust environments, reduce cognitive stress, and unlock happier, more creative teams.",
            points: [
                "For: Teams in high-stakes environments, transformation leaders",
                "You'll gain: Safety insights, bias management, trust building",
            ],
            button: "DOWNLOAD PROGRAM PDF",
        },
        {
            title: "Human WorksX",
            subtitle: "3 day research-backed transformative workshop",
            icon: humanWorksIcon,
            description:
                "Lead people-first cultures that prioritize well-being without sacrificing performance.",
            points: [
                "For: Executives, HR leaders, culture shapers",
                "You'll gain: Empathy-led leadership and people strategy",
            ],
            button: "DOWNLOAD PROGRAM PDF",
        },
        {
            title: "Resilient Emotional Capability",
            subtitle: "3-day intensive workshop + 3 coaching sessions",
            icon: personaIcon,
            description:
                "Build emotional agility to navigate today’s challenges with confidence and grace.",
            points: [
                "For: Frontline leaders, stressed teams, customer-facing roles",
                "You'll gain: Resilience, emotional regulation, energy management",
            ],
            button: "DOWNLOAD PROGRAM PDF",
        },
    ];

    return (
        <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
            {/* Top Section */}
            <section className="bg-white px-6 sm:px-10 lg:px-16 xl:px-[150px] pt-[40px] sm:pt-[100px] lg:pb-[100px] lg:pt-[40px] pb-[40px] relative overflow-hidden">

                {/* corner decoration */}
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />

                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* LEFT IMAGE — UNCHANGED */}
                        {/* LEFT IMAGE */}
                        <div className="relative w-full  min-w-0">
                            <img
                                src={trainingHeaderImg}
                                alt="Training Programs"
                                className="w-full h-[280px] sm:h-[380px] lg:h-[517px] object-cover rounded-2xl"
                            />
                        </div>

                        {/* RIGHT CONTENT — UNCHANGED */}
                        <div className="flex flex-col justify-center w-full max-w-[560px] min-w-0">

                            <h2 className="font-spartan font-medium leading-[1.15] text-[clamp(28px,4.5vw,52px)] mb-6 sm:mb-8 lg:mb-6 relative z-10">
                                <span className="text-black">Training </span>
                                <span className="relative inline-block text-secondary pb-4">
            Programs
            <img
                src={CurvedLine}
                alt="curve"
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[190px]"
            />
          </span>
                            </h2>

                            <h3 className="text-[#0F1C80] text-[18px] font-poppins font-medium mb-6">
                                Unlock Potential. Bloom as a Leader.
                            </h3>

                            <p className="text-[16px] font-poppins font-medium leading-[30px] text-black mb-4">
                                Workshops that blend research, culture, and practice to prepare leaders
                                for tomorrow.
                            </p>

                            <p className="text-[14px] font-poppins leading-[28px] text-black mb-10">
                                Whether you're developing leadership skills or strengthening emotional
                                agility, each experience prepares you for tomorrow demands.
                            </p>

                            <ArrowButton
                                text="Book a Discovery Call"
                                textSize="16px"
                                className="!px-8 !py-3 w-fit"
                                onClick={openCalendly}
                            />
                        </div>

                    </div>
                </div>
            </section>

                {/* Training Cards */}
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                        {trainingPrograms.map((program, index) => (
                            <div
                                key={index}
                                className="
          bg-[#EEEEEE]
          rounded-xl
          p-5 sm:p-6 lg:p-6 xl:p-7
          flex flex-col
          justify-between
          cursor-pointer
          transition-all duration-300 ease-out
          hover:-translate-y-2
          hover:shadow-[0px_18px_50px_rgba(0,0,0,0.12)]
          min-h-[430px]
        "
                            >
                            <div className="flex-1 flex flex-col">
                                <img
                                    src={program.icon}
                                    alt=""
                                    className="w-20 sm:w-24 lg:w-20  flex-shrink-0"
                                />

                                <h4 className="text-xl sm:text-2xl font-spartan mb-3 sm:mb-4 leading-snug font-medium">
                                    {program.title}
                                </h4>

                                <p className="text-[#0f1c80] font-poppins font-normal text-sm sm:text-base leading-relaxed tracking-wide mb-4 sm:mb-5">
                                    {program.subtitle}
                                </p>

                                <p className="text-[#000000] font-poppins font-normal text-[14px] leading-[25px] tracking-wide mb-5 sm:mb-6">
                                    {program.description}
                                </p>

                                <ul className="space-y-2.5 sm:space-y-3 font-poppins text-sm text-[#000000] mt-auto">
                                    {program.points.map((point, idx) => (
                                        <li key={idx} className="flex gap-2.5 sm:gap-3 items-start leading-relaxed">
                                            <span className="text-[#0f1c80] font-bold flex-shrink-0 mt-1">✓</span>
                                            <span className="flex-1">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-8 flex items-center justify-center">
                <ArrowButton
                    text="Let's Discuss Your Challenges"
                    textSize="14px"
                    className="!px-10"
                    onClick={() => {
                        navigate("/lets-talk");
                        window.scrollTo(0, 0);
                    }}
                />
            </div>

        </section>
    );
};

export default TrainingSection;
