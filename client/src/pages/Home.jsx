import { motion, AnimatePresence } from "framer-motion";
import FloatingCircle from "../components/FloatingCircle";
import CurvedLine from "../assets/CurvedLine.png";
import NewsletterPopup from "./NewsletterPopup";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronDown } from "lucide-react";
import LeadersSection from "../components/logos";
import TestimonialsSlider from "../components/TestimonialsSlider";
import squareAnimation from "../assets/squareAnimation.gif";
import { useNavigate } from "react-router-dom";

// import frame2847 from "../assets/frame-1000002847.svg";
// import frame2844 from "../assets/frame-1000002844.svg";
// import frame2845 from "../assets/frame-1000002845.svg";
import group1851 from "../assets/group-1000001851-(1).svg";
import frameImg from "../assets/HeroBannerFinal.jpeg";
import founderImg from "../assets/foundernew.jpg";
import workshop from "../assets/workshop.svg";
import leadershipIcon from "../assets/leadership-icon.svg";
import skillsIcon from "../assets/skills-icon.svg";
import teamIcon from "../assets/team-icon.svg";
import coachingIcon from "../assets/coaching-icon.svg";
import teamHomeImg from "../assets/TeamHomeSvg.png";
import heroNetworkImg from "../assets/hero network.svg";
import heroImg from "../assets/heroimg.jpg";
import component217 from "../assets/Property 1=Component 217.png";
import component216 from "../assets/Property 1=Component 216.png";
import component215 from "../assets/Property 1=Component 215.png";
import component214 from "../assets/Property 1=Component 214.png";

import statsBg from "../assets/150.png";
import ArrowButton from "../components/Arrowbutton";
import GlobalSection from "../components/logos2";
import DiscoveryModal from "../Models/DiscoveryModal.jsx";
import CornorGroup from "../assets/CornorGroup.png";
import LeftCornorGroup from "../assets/LeftCornorGroup.png";


const faqs = [
    {
        question: "What is coaching?",
        answer:
            "Coaching is a professional partnership that builds clarity, self awareness, and purposeful action.\n\nAt Mashar, coaching is both a leadership skill and a professional career, supported by globally recognised, ICF  and EMCC aligned training and accreditation. It empowers leaders, teams, and coaches to grow with confidence and create lasting impact.",
    },
    {
        question: "How do I know if coaching is right for me?",
        answer:
            "If you’re feeling stuck, seeking clarity, or looking to grow as a leader, coaching can help. Whether you’re focused on personal growth or leading teams, coaching provides the guidance and support you need to move forward with confidence.",
    },
    {
        question: "Do I need to be a manager to benefit from coaching?",
        answer:
            "Not at all. Coaching supports individuals at every stage, from emerging talent to team contributors to senior leaders. It’s about growth, clarity, and alignment, no matter your role or title.",
    },
    {
        question: "What can I expect during a coaching session?",
        answer:
            "Each session is practical and goal driven. You’ll build self awareness, strengthen key skills, and work through real situations using structured reflection and action planning. Sessions are focused, supportive, and designed to translate insight into measurable progress.",
    },
    {
        question: "How long does an engagement last?",
        answer:
            "The duration depends on the program and your goals. Individual coaching may involve a few focused sessions or extend over 3 months, while team and organizational engagements are designed around specific objectives and timelines.\n\nFor more details, visit our Programs page to explore available options.",
    },
    {
        question: "What language are the programs delivered in?",
        answer:
            "Programs are delivered in Arabic and English, making them accessible and culturally relevant across the region.",
    },
    {
        question: "Can you design a program specifically for our organization?",
        answer:
            "Yes. We specialize in tailored coaching and training aligned with your goals and culture. Whether you’re building leadership capacity, supporting change, or strengthening team dynamics, we’ll co create a program that works for you.",
    },
    {
        question: "How can coaching help my team?",
        answer:
            "Team coaching boosts collaboration, trust, and alignment. It builds problem solving skills, enhances communication, and creates more empowered, high performing teams. Leaders often see lasting improvements in morale, engagement, and results.",
    }
];


const impactData = [
    {
        title: "Leadership Excellence",
        description: (
            <p className="leading-[25px]">
                Build resilient, ethical, people first <br />
                leaders at every level
            </p>
        ),
        image: leadershipIcon,
    },
    {
        title: "Skills Development",
        description: (
            <p className="leading-[25px]">
                Create mindful, high-performing cultures<br />
                with global psychological tools
            </p>
        ),
        image: skillsIcon,
    },
    {
        title: "Team Effectiveness",
        description: (
            <p className="leading-[25px]">
                Transform groups into high impact teams <br />
                through tailored strategies
            </p>
        ),
        image: teamIcon,
    },
    {
        title: "Coaching & Mentoring",
        description: (
            <p className="leading-[25px]">
                Gain ICF and EMCC globally recognized  <br />
                credentials.
            </p>
        ),
        image: coachingIcon,
    },
];

const programs = [
    {
        title: "COACHING",
        subtitle: "Unlock Personal and Professional Clarity",
        description:
            "Support executives, teams, and groups to achieve sustainable growth and unlock personal and professional clarity.",
        buttonText: "Explore Our Coaching Journey",
        route: "/explorePrograms",
        tabKey: "coaching",
    },
    {
        title: "TRAINING",
        subtitle: "Develop skills that drive transformation.",
        description:
            "Build coaching capacity, resilience, influence, and psychological safety that elevate performance and drive transformation.",
        buttonText: "View Training Programs",
        route: "/explorePrograms",
        tabKey: "training",
    },
    {
        title: "MENTORING & SUPERVISION",
        subtitle: "Advance Your Journey As A Coach",
        description:
            "For coaches pursuing ICF/EMCC credentials to deepen reflection, strengthen ethics, and advance the growth journey.",
        buttonText: "Discover Mentoring Pathways",
        route: "/explorePrograms",
        tabKey: "mentoring",
    },
    {
        title: "ASSESSMENT",
        subtitle: "Lead with insight, backed by data",
        description:
            "Use advanced tools like GEDI and TAWDI to uncover executive leadership effectiveness and team dynamics.",
        buttonText: "Learn About Our Tools",
        route: "/explorePrograms",
        tabKey: "assessment",
    },
];

const stats = [
    { number: "15+", label: "Global Accredited Coaches" },
    { number: "750+", label: "Certified Professional Coaches" },
    { number: "2+", label: "Global Certification Programs" },
    { number: "10+", label: "Global Credentials Professional Development" },
    { number: "15+", label: "Business Client Partner" },
];

const points = [
    "Accredited by ICF and top global bodies.",
    "Pioneers in bilingual coaching (Arabic & English).",
    "Tailored solutions aligned with culture and goals.",
    "Over 20 years empowering leaders across industries.",
    "Evidence based, human centered, measurable outcomes.",
];


const images = [component217, component216, component215, component214];

const Home = () => {
    const openCalendly = () => {
        console.log("clicked"); // ✅ WILL PRINT
        window.open(
            "https://calendly.com/raja-20/15min?month=2026-01",
            "_blank",
            "noopener,noreferrer",
        );
    };
    const navigate = useNavigate(); // ✅ CORRECT PLACE
    const [openModal, setOpenModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [openIndex, setOpenIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(2);
            } else {
                setSlidesToShow(3);
            }
        };
        handleResize(); // ✅ Run once on mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    useEffect(() => {
        console.log("Newsletter effect mounted");

        const hasSeenPopup = localStorage.getItem("hasSeenNewsletterPopup");
        console.log("hasSeenPopup:", hasSeenPopup);

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                console.log("Showing newsletter popup");
                setShowPopup(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    function NextArrow(props) {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute -right-10 top-1/2 -translate-y-1/2 rounded-full p-3 "
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-[#2B3476]"
                >
                    <path d="M9 6l6 6-6 6" />
                </svg>
            </button>
        );
    }

    function PrevArrow(props) {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute -left-11 top-1/2 -translate-y-1/2   rounded-full p-3"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-[#2B3476]"
                        d="m15 6l-6 6l6 6"
                    />
                </svg>
            </button>
        );
    }

    const handleClosePopup = () => {
        setShowPopup(false);
        // Mark that user has seen the popup
        localStorage.setItem("hasSeenNewsletterPopup", "true");
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    const settingsHero = {
        dots: false,
        infinite: true,
        speed: 800, // transition speed (ms)
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500, // how long each image stays before switching
        cssEase: "ease-in-out", // smooth transition
        arrows: false,
        pauseOnHover: false,
    };

    return (
        <>
            {showPopup && (
                <NewsletterPopup isOpen={showPopup} onClose={handleClosePopup} />
            )}
            {/* hero section */}

            <section className="flex overflow-hidden flex-col 924:flex-row items-center justify-center gap-10 lg:gap-16 px-6 md:px-12 lg:px-20 py-12 lg:py-20 bg-white">
                {/* LEFT CONTENT */}
                <div className="w-full 924:max-w-[560px] sm:text-left text-center space-y-6 relative mb-[20px] 924:mb-0">
                    <div className="absolute right-2 md:-right-8 top-[90%] md:top-48  lg:-mt-150 opacity-65">
                        <img
                            src={squareAnimation}
                            alt="Goals Animation"
                            className="w-28 sm:w-32 md:w-36 h-auto object-contain rotate-[67.4deg]"
                        />
                    </div>
                    <h1 className="text-5xl md:text-5xl lg:text-6xl font-medium font-spartan leading-tight">
                        Lead with <span className="text-[#0f1c80]">Purpose</span>
                        <br />
                        Be <span className="text-[#f39300]">future ready </span>
                    </h1>

                    <p className="font-poppins font-medium text-[16px] leading-[24px] tracking-[0.5px] text-[#0f1c80] mb-8">
                        Where human insight meets modern leadership
                    </p>

                    {/* ICON LIST */}
                    <div className="space-y-2 text-left inline-block font-poppins text-[13px]">
                        <div className="flex items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                className="text-[#0F1C80]"
                            >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M1 12a11 11 0 1 0 22 0a11 11 0 0 0-22 0m3.58 2.45s-.8-.21-1.34-.37A9 9 0 0 1 3 12l.58-1.28l1.2-.37l-1.2-1.49A9.14 9.14 0 0 1 12.13 3a9.2 9.2 0 0 1 5.19 1.6l-2.36 1.3l-3.79-1.15l-1.46 2.57l1.38-1.24l.71 1.1l-1.68 1.17l-1.56.3l.06.94s-.45.46-.45.66c0 .19.56.56.56.56l1.24-.96l1.2.86l.31-1.6l1.05 3.3l-.8.4l-.92-.44l-.28-.41l-.93.3l-.58.12l-.37.64l-.61.74l-.02.94l.93.85l.65-.07l.67-.15l.43.85l.5.98l-.25.75l.69 1.8l.88-.1l.79-1.1l.93-3.35l-.8-1.59l.7-.8l.9.93l.62-.32l1.35-.97l.63.46l.6 1.1l.94-1.13l.78.16l.68 1.31s.27 0 .36-.13A9.12 9.12 0 0 1 12.14 21a9.17 9.17 0 0 1-6.87-3.07l1.11-2.08l-1.56-.59l-.24-.8z"
                                    clipRule="evenodd"
                                />
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m11-9a11 11 0 1 1-22 0a11 11 0 0 1 22 0"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="">Globally recognized</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 16 16"
                                className="text-[#0F1C80]"
                            >
                                <path
                                    fill="currentColor"
                                    d="M15.09 12.79a1 1 0 0 0-.086-1.638L15 5.33L14 6v5.15a1 1 0 0 0-.092 1.629l-.378.502a2.48 2.48 0 0 0-.53 1.498v1.222h.815a.88.88 0 0 0 .853-.664l.331-1.336v2h1v-1.21a2.5 2.5 0 0 0-.534-1.505zM8 0L0 4l8 5l8-5z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M8 10L3 6.67v1.71C3 9.29 5.94 12 8 12s5-2.71 5-3.62V6.67z"
                                />
                            </svg>
                            <span className=" ">Culturally Relevant</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                className="text-[#0F1C80]"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12.5 13.3c-.2-.5-.2-.9-.1-1.3H3V4.5l6 4l6-4v1.7c.6-.3 1.1-.3 1.4-.3c.1-.1.3-.2.5-.3v-3c.1-.9-.6-1.6-1.5-1.6H2.6C1.7 1 1 1.7 1 2.6v9.8c0 .9.7 1.6 1.6 1.6h10.3c-.2-.2-.3-.4-.4-.7M15 3L9 7L3 3zm7.6 6.9c-.2-.6-.7-.7-1-1c-.2-.3-.2-.9-.7-1.2c-.5-.4-1-.2-1.4-.3s-.7-.6-1.3-.6s-.9.4-1.3.6c-.4.1-.9-.1-1.4.3c-.5.3-.4.8-.7 1.2c-.3.3-.8.5-1 1c-.2.6.2 1 .2 1.4s-.4.8-.2 1.4s.7.7 1 1c.2.3.2.9.7 1.2c.5.4 1 .2 1.4.3s.7.6 1.3.6s.9-.4 1.3-.6c.4-.1.9.1 1.4-.3s.5-.9.7-1.2c.3-.3.8-.5 1-1c.2-.6-.2-1-.2-1.4s.4-.8.2-1.4m-4.4 4.5c-1.7 0-3-1.4-3-3s1.4-3 3-3s3 1.4 3 3s-1.3 3-3 3m1.5-3.1c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5s1.5.7 1.5 1.5m-.2 5.8l-.5 2.7l-.6 3.1l-2-1.9l-2.4 1.1l1-5.7c.4.2.9.3 1.4.3c.3.2.7.4 1 .5c.2.1.5.1.8.1c.5.1.9 0 1.3-.2m3.2 2.4l-2-.7l.4-2.2l.6-.3l.1-.1z"
                                />
                            </svg>
                            <span className=" ">ICF Accredited Excellence</span>
                        </div>
                    </div>

                    {/* BUTTON */}

                    <div
                        className="flex justify-center sm:justify-start mt-4"
                        onClick={() => {
                            navigate("/our-signature");
                            window.scrollTo(0, 0);
                        }}
                    >
                        <ArrowButton text="Start Your Journey" textSize="16px" />
                    </div>
                </div>

                {/*<img*/}
                {/*    src={CornorGroup}*/}
                {/*    alt="corner decoration"*/}
                {/*    className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"*/}
                {/*/>*/}
                {/* RIGHT IMAGE GRID */}
                <div className="w-full 924:max-w-[520px] max-w-[13rem] 410:max-w-[18rem] 500:max-w-none">
                    <div className="relative w-full max-w-sm mx-auto">
                        {/* GRID LAYOUT */}
                        <div className="grid grid-cols-[0.8fr_1fr] gap-2 items-stretch">
                            {/* LEFT ORANGE BLOCKS */}
                            <div className="flex flex-col gap-2 h-full">
                                {/* Top Orange Block */}
                                <div className="bg-[#f39300] rounded-xl px-12 py-9 text-white flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold">2K+</h3>
                                    <p className="text-[7px]  font-400">Certified Coaches</p>
                                    <p className="text-[12px] mt-1 leading-none">
                                        Empowering Growth Journeys
                                    </p>
                                </div>

                                {/* Bottom Orange Block */}
                                <div className="bg-[#f39300] rounded-xl pl-8  pr-3 py-4 text-white flex items-center gap-2 flex-1">
                                    <div className="flex-1">
                                        <h4 className="text-[12px] font-400 leading-tight">
                                            future ready
                                        </h4>
                                        <p className="text-[12px] font-400 leading-tight">
                                            Leaders
                                        </p>
                                    </div>
                                    <img
                                        src={heroNetworkImg}
                                        alt="arrow"
                                        className="w-9 h-9 object-contain"
                                    />
                                </div>
                            </div>

                            {/* RIGHT IMAGE */}
                            <div className="rounded-xl border-2 border-[#f39300] overflow-hidden h-[180px] sm:h-[254px]">
                                <Slider {...settingsHero}>
                                    {images.map((src, index) => (
                                        <div key={index}>
                                            <img
                                                src={src}
                                                alt={`Coach ${index + 1}`}
                                                className="object-cover w-full h-[180px] sm:h-[254px]"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        {/* CIRCULAR BADGE */}
                        {/* CIRCULAR BADGE */}
                        <div className="absolute -left-10 top-24 w-20 h-20 flex items-center justify-center">
                            <div className="relative w-full h-full rounded-full bg-[#0f1c80] border-[7px] border-white flex items-center justify-center">
                                {/* Rotating Text Inside Blue Circle */}
                                <svg
                                    className="absolute w-[90%] h-[90%] animate-spin-slow"
                                    viewBox="0 0 100 100"
                                >
                                    <defs>
                                        <path
                                            id="innerCirclePath"
                                            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                                        />
                                    </defs>
                                    <text
                                        fill="white"
                                        fontSize="7"
                                        fontWeight="bold"
                                        letterSpacing="2"
                                    >
                                        <textPath href="#innerCirclePath" startOffset="0%">
                                            LEAD WITH PURPOSE • LEAD WITH PURPOSE •
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        </div>

                        {/* BOTTOM IMAGE */}
                        <div className="mt-2 rounded-xl overflow-hidden h-[130px] sm:h-[144px]">
                            <img
                                src={heroImg}
                                alt="Team meeting"
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* RIGHT BLUE LABELS */}
                        <div className="absolute top-[90px] right-[-45px] flex flex-col gap-2">
                            {[
                                "ICF Accredited Excellence",
                                "Human Centered Approach",
                                "Proven Regional Impact",
                            ].map((text, i) => (
                                <div
                                    key={i}
                                    className="bg-[#0f1c80] text-white text-[10px] text-center px-3 py-2 rounded-[12px] shadow w-20"
                                >
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* evolve section */}
            <section className="px-6 md:px-10 lg:px-16 py-16 bg-white flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
                {/* LEFT: Images */}
                <div className="relative flex justify-center md:justify-start w-full md:w-1/2">
                    <img
                        src={teamHomeImg}
                        alt="Team Collaboration"
                        className="rounded-xl w-[280px] sm:w-[350px] md:w-[530px] mx-auto md:mx-0"
                    />
                    {/* Right: Animation (absolutely positioned) */}
                    <div className="absolute right-2 md:-right-2 top-[90%] md:top-96 -mt-16 lg:-mt-24 opacity-65">
                        <img
                            src={squareAnimation}
                            alt="Goals Animation"
                            className="w-28 sm:w-32 md:w-40 h-auto object-contain rotate-45"
                        />
                    </div>
                </div>

                {/* RIGHT: Text Content */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl md:text-[46px] font-medium mb-6 leading-tight font-spartan relative inline-block">
                        The World is Changing <br />
                        Are You <span className="text-primary">Ready to</span>{" "}
                        <span className="text-secondary relative inline-block">
              Evolve?
              <img
                  src={CurvedLine}
                  alt="curve"
                  className="absolute left-1/2 -translate-x-1/2  w-[250px] h-[14px] opacity-100"
              />
            </span>
                    </h2>

                    <p className="font-poppins text-[14px] mb-6">
                        Across the globe and especially in the Arab region, leaders, teams,
                        and organizations are navigating unprecedented change, mounting
                        pressure, and rising expectations. The pace of transformation is
                        accelerating, demanding a new kind of leadership.
                        <br />
                    </p>
                    <p className="font-poppins text-[14px]">
                        At Mashar, we meet you at that critical edge, empowering you with
                        the mindset, tools, and support to lead with courage, clarity, and
                        care.{" "}
                    </p>
                </div>
                <div className="absolute bottom-0 top-[1100px] left-0">
                    <img
                        src={LeftCornorGroup}
                        alt="Circle 1"
                        className="w-[30px] sm:w-[110px]"
                    />
                </div>
            </section>

            {/* human solutions  */}
            <section className="py-10 md:mb-[64px] md:mt-[64px] px-4 md:px-7 lg:px-24 text-center  relative">
                {/* Background Rings (Top Left) */}
                {/*<div className="absolute  top-5  left-0 z-0  pointer-events-none">*/}
                {/*    <div*/}
                {/*        className="absolute rounded-full"*/}
                {/*        style={{*/}
                {/*            position: "absolute",*/}
                {/*            width: "138.76px",*/}
                {/*            height: "136.43px",*/}
                {/*            top: "37.49px",*/}
                {/*            left: "31.24px",*/}
                {/*            opacity: 0.1,*/}
                {/*            borderWidth: "11px",*/}
                {/*            borderStyle: "solid",*/}
                {/*            borderColor: "rgb(15, 28, 128)",*/}
                {/*            borderRadius: "100px",*/}
                {/*            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",*/}
                {/*        }}*/}
                {/*    ></div>*/}

                {/*    <div*/}
                {/*        className="absolute rounded-full"*/}
                {/*        style={{*/}
                {/*            position: "absolute",*/}
                {/*            width: "170.73px",*/}
                {/*            height: "126.57px",*/}
                {/*            top: "16px",*/}
                {/*            left: "-36px",*/}
                {/*            transform: "rotate(-233.73deg)",*/}
                {/*            opacity: 0.1,*/}
                {/*            borderWidth: "11px",*/}
                {/*            borderStyle: "solid",*/}
                {/*            borderColor: "rgb(15, 28, 128)",*/}
                {/*            borderRadius: "100px",*/}
                {/*            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",*/}
                {/*        }}*/}
                {/*    ></div>*/}
                {/*</div>*/}
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-[500px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
                {/* Title */}
                <h2 className="text-3xl md:text-[46px] font-medium leading-snug mb-2 font-spartan">
                    Real Problems <span className="text-primary">Need Human</span>{" "}
                    <span className="text-secondary ">Solutions</span>
                </h2>

                {/* Subtext */}
                <p className="text-[15px]   max-w-xl mx-auto mb-12  font-normal font-poppins">
                    {" "}
                    Leadership today means more than strategy it requires emotional
                    strength, cultural sensitivity, and personal clarity
                </p>

                {/* 3 Columns */}
                <div className="grid grid-cols-1 881:grid-cols-3 gap-6 mb-12 max-w-[1200px] mx-auto font-poppins">
                    {/* Leaders */}
                    <div className="bg-[#E4E4E4] rounded-[12px] py-12 px-10 group transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-md hover:cursor-pointer origin-center hover:shadow-[0px_4px_15.2px_0px_#00000030]">
                        <h3 className="text-[28px] font-semibold text-primary mb-3 text-center">
                            Leaders
                        </h3>
                        <p className="text-[15px] font-normal text-center leading-relaxed">
                            Leaders face burnout,<br />overwhelm, and uncertainty.
                        </p>
                    </div>

                    {/* Teams */}
                    <div className="bg-white rounded-[12px] py-12 px-10 group transition-transform duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer origin-center hover:shadow-[0px_4px_15.2px_0px_#00000030]">
                        <h3 className="text-[28px] font-semibold text-secondary mb-3 text-center">
                            Teams
                        </h3>
                        <p className="text-[15px] font-normal text-center leading-relaxed">
                            Struggle with mistrust and<br />blocked creativity.
                        </p>
                    </div>

                    {/* Organizations */}
                    <div className="bg-[#E4E4E4] rounded-[12px] py-12 px-10 group transition-transform duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer origin-center hover:shadow-[0px_4px_15.2px_0px_#00000030]">
                        <h3 className="text-[28px] font-semibold text-primary mb-3 text-center">
                            Organizations
                        </h3>
                        <p className="text-[15px] font-normal text-center leading-relaxed">
                            Organizations fall behind when<br />old habits meet new realities.
                        </p>
                    </div>
                </div>
                <div className="relative inline-flex items-center">
                    <ArrowButton
                        text="Let’s Discuss Your Challenges"
                        textSize={window.innerWidth < 640 ? "12px" : "16px"}
                        onClick={() => setOpenModal(true)}
                    />{" "}
                </div>
            </section>

            {/* grow section */}

            <section className="relative py-12 md:py-[64px] flex items-center md:px-10 px-6 justify-center bg-white lg:px-20">
                <div className="absolute -top-9 left-0">
                    {/* First Circle */}
                    <img
                        src={group1851}
                        alt="Circle 1"
                        className="opacity-full w-[150px]"
                    />
                </div>

                <div className="grid 803:grid-cols-2 lg:gap-16 xl:gap-20 gap-8 items-center max-w-7xl mx-auto">
                    {/* Left Content */}
                    <div className="space-y-6 relative">
                        <h2 className="text-3xl md:text-[46px] font-medium mb-6 leading-tight font-spartan relative inline-block">
                                We Grow People <br /><span className="relative text-primary">Not Just</span>{" "}
                            <span className="text-secondary  inline-block">
              Skills
              <img
                  src={CurvedLine}
                  alt="curve"
                  className="absolute md:left-[220px] -translate-x-1/2  w-[180px] h-[14px] opacity-100"
              />
            </span>
                        </h2>

                        {/* Floating Animation */}
                        <div className="absolute hidden sm:block right-4 803:-right-20 -top-8 sm:-top-12 lg:-top-16 opacity-65">
                            <img
                                src={squareAnimation}
                                alt="Goals Animation"
                                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain rotate-45"
                            />
                        </div>

                        {/* Highlight Box */}
                        <div className="bg-[#E4E4E4] p-3 sm:p-4 px-4 rounded-[20px] shadow-sm w-fit font-poppins mx-auto 803:mx-0 mb-6">
                            <p className="text-xs sm:text-sm leading-snug">
                                The question is no longer "How do we grow?", but: <br />
                                <span className="text-primary font-bold">
                        "How do we grow{" "}
                                    <span className="text-secondary">Future Ready?</span>"
                    </span>
                            </p>
                        </div>

                        {/* Description Text */}
                        <p className="leading-[30px] max-w-[595px] text-[16px] font-poppins font-normal tracking-[0.5px] text-center 803:text-left mx-auto 803:mx-0">
                            At Mashar, we don't give you generic solutions. <br /> We create leadership journeys grounded in psychology, neuroscience, and cultural wisdom designed to help you grow deeply and create meaningful change.
                        </p>
                    </div>

                    {/* Right Side Circles */}
                    <div className="relative 803:flex items-center justify-center w-80 lg:w-full h-full hidden">
                        {/* Background Rings (Top Left) */}
                        <div className="absolute pointer-events-none">
                            <div
                                className="absolute rounded-full"
                                style={{
                                    position: "absolute",
                                    width: "138.76px",
                                    height: "136.43px",
                                    top: "-137.51px",
                                    left: "31.24px",
                                    opacity: 0.1,
                                    borderWidth: "11px",
                                    borderStyle: "solid",
                                    borderColor: "rgba(15, 28, 128, 0.4)",
                                    borderRadius: "100px",
                                    boxShadow: "0px 4px 16px 0px rgba(43, 52, 118, 0.3)",
                                }}
                            ></div>

                            <div
                                className="absolute rounded-full"
                                style={{
                                    position: "absolute",
                                    width: "170.73px",
                                    height: "126.57px",
                                    top: "-156px",
                                    left: "-36px",
                                    transform: "rotate(-233.73deg)",
                                    opacity: 0.1,
                                    borderWidth: "11px",
                                    borderStyle: "solid",
                                    borderColor: "rgba(15, 28, 128, 0.4)",
                                    borderRadius: "100px",
                                    boxShadow: "0px 4px 16px 0px rgba(43, 52, 118, 0.3)",
                                }}
                            ></div>
                        </div>

                        {/* Floating Circles */}
                        <FloatingCircle
                            size="125"
                            gradient="linear-gradient(180deg, #FFD166 0%, #EB8F03 100%)"
                            duration={5}
                        >
                            future ready  Growth
                        </FloatingCircle>

                        <FloatingCircle
                            size="128"
                            gradient="linear-gradient(180deg, #FFD166 0%, #EB8F03 100%)"
                            duration={8}
                        >
                            Neuroscience
                        </FloatingCircle>

                        <FloatingCircle
                            size="80"
                            gradient="linear-gradient(180deg, #FFD166 0%, #EB8F03 100%)"
                            duration={7}
                        >
                            Cultural Wisdom
                        </FloatingCircle>

                        <FloatingCircle
                            size="110"
                            gradient="linear-gradient(180deg, #FFD166 0%, #EB8F03 100%)"
                            duration={9}
                        >
                            Psychology
                        </FloatingCircle>
                    </div>
                </div>
            </section>



            <section className="xl:pt-[100px] py-6 relative overflow-hidden">
                {/* The white background helps the image look "faded" when opacity is lowered */}
                <div className="relative bg-white">
                    <img
                        src={frameImg}
                        alt="frame image"
                        className="w-full h-auto block"
                        style={{ filter: "blur(0.3px)" }}
                    />
                </div>


            </section>

            {/* Areas of impact */}
            <section className="md:pt-[125px] md:pb-[125px]">
                {/* ================= HEADING ================= */}
                <div className="relative text-center px-6  pt-12">
                    <img
                        src={CornorGroup}
                        alt="corner decoration"
                        className="absolute right-0 top-[82px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                    />
                    <h2 className="text-3xl md:text-[46px] font-medium font-spartan mb-12 leading-tight text-center">
  <span className="relative inline-block">
    Our{" "}
      <span className="text-primary">Areas of</span>{" "}
      <span className="text-secondary">Impact</span>

    <img
        src={CurvedLine}
        alt="curve"
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
    />
  </span>
                    </h2>

                    <p className="mb-10 max-w-4xl mx-auto font-poppins text-[15px] leading-7">
                        We equip leaders and teams with the skills that matter most :
                        well being, resilience, emotional intelligence, and adaptive
                        leadership.
                    </p>
                </div>

                {/* ================= SLIDER SECTION (UNCHANGED) ================= */}
                <div className="pb-10 px-6 md:px-20 lg:px-[120px] bg-white text-center relative">
                    {/* Background Rings */}
                    <div className="absolute pointer-events-none">
                        <div
                            className="absolute rounded-full"
                            style={{
                                width: "138.76px",
                                height: "136.43px",
                                top: "-19.51px",
                                left: "-19.76px",
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

                    <Slider {...settings}>
                        {impactData.map((item, index) => (
                            <div key={index} className="px-3 py-5">
                                <div className="rounded-[10px] h-[410px] py-[86px] px-[8px] bg-[#eeeeee] flex flex-col items-center text-center border group transition-all duration-500 ease-out transform hover:scale-[1.05] hover:shadow-xl cursor-pointer">
                                    <div className="w-[118px] h-[118px] mb-4 flex items-center border-none justify-center rounded-full bg-white shadow">
                                        <img src={item.image} alt={item.title} className="w-14 h-44 object-contain transition-transform duration-500 ease-out group-hover:scale-110" />
                                    </div>
                                    <h3 className="font-poppins text-[24px] font-semibold mb-4 text-primary">
                                        {item.title}
                                    </h3>
                                    <div className="font-poppins text-[14px] md:pt-2 leading-7">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            {/* inspire */}

            <section className="py-10 sm-px-6 md:px-20 md:pt-[64px] bg-white text-center ">
                <div className="absolute pointer-events-none">
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: "138.76px",
                            height: "136.43px",
                            top: "-19.51px",
                            left: "-19.76px",
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

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-medium font-spartan mb-10 leading-tight text-center">
  <span className="relative inline-block">
    Programs That{" "}
      <span className="text-primary">Inspire Real</span>{" "}
      <span className="text-secondary">Change</span>

    <img
        src={CurvedLine}
        alt="curve"
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
    />
  </span>
                </h2>


                <p className="max-w-3xl mx-auto mb-12 text-sm md:text-base leading-6">
                    We empower leaders, teams, organizations, and coaches with practical,
                    research-backed solutions rooted in cultural and human connection.
                </p>

                {/* Cards */}
                <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-12">
                    {/* Background Rings (Top Left) */}
                    <div className="grid grid-cols-1 833:grid-cols-2 gap-8">

                    {programs.map((item, index) => (
                        <div
                            key={index}
                            className="group items-center relative bg-[#eeeeee] hover:bg-[linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)] transition-all duration-1000 ease-in-out rounded-xl sm:rounded-[12px] hover:shadow-[0px_4px_8px_0px_#00000040] p-6 sm:p-8 py-16 sm:py-20 text-left flex flex-col justify-between overflow-hidden"
                        >

                            {/* gradient overlay (on card hover) */}
                            <div className="absolute inset-0 bg-black/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[12px] pointer-events-none">

                            </div>

                            {/* card content */}
                            <div className="relative z-10 text-center">
                                <h3 className="text-[32px] font-semibold font-spartan mb-2 text-primary
transition-colors duration-300 group-hover:text-[#F39300]">
                                    {item.title}
                                </h3>

                                <p className="text-black font-poppins text-[18px] font-medium mb-4">
                                    {item.subtitle}
                                </p>
                                <p className="text-[15px] leading-7 mb-6  font-poppins">
                                    {item.description}
                                </p>
                            </div>

                            <div className="group">
                                <div
                                    className="group  tracking-wide "
                                    onClick={() => {
                                        navigate(item.route, {
                                            state: { targetTab: item.tabKey },
                                        });
                                    }}
                                >
                                    <ArrowButton
                                        text={item.buttonText}
                                        textSize={window.innerWidth < 640 ? "11px" : "14px"}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            {/* founder section  */}
            <section className="py-24 px-6 md:px-[130px] bg-white font-sans relative overflow-hidden">
                {/* Background Pattern (Diagonal Lines) */}
                <div className="absolute top-0 -right-12 w-32 h-32 text-[#0b315e] rounded-full opacity-[15%] pointer-events-none overflow-hidden">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern
                                id="diagonal-lines"
                                x="0"
                                y="0"
                                width="10"
                                height="10"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
                    </svg>
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="bg-white rounded-[40px] shadow-[0px_10px_50px_rgba(0,0,0,0.1)] p-10 md:p-16 relative">
                        {/* Quote Icon */}
                        <div className="absolute top-10 left-10 text-primary opacity-90">
                            <svg
                                width="45"
                                height="35"
                                viewBox="0 0 45 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.5 0C13.5 0 9.5 3.5 7.5 8.5C6.5 11 6 13.5 6 16.5C6 24.5 10.5 30.5 17.5 32.5L19 27.5C14.5 26.5 12.5 23 12.5 18.5C12.5 17.5 12.5 16.5 13 15.5C14 16.5 15.5 17 17.5 17C21.5 17 25 13.5 25 9C25 4 21.5 0 18.5 0ZM38.5 0C33.5 0 29.5 3.5 27.5 8.5C26.5 11 26 13.5 26 16.5C26 24.5 30.5 30.5 37.5 32.5L39 27.5C34.5 26.5 32.5 23 32.5 18.5C32.5 17.5 32.5 16.5 33 15.5C34 16.5 35.5 17 37.5 17C41.5 17 45 13.5 45 9C45 4 41.5 0 38.5 0Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        {/* Testimonial Text */}
                        <div className="text-center mb-10 mt-8">
                            <p className="font-poppins text-[14px] md:text-[16px] tracking-[0.5px] leading-relaxed text-[#2e2e2e] max-w-4xl mx-auto">
                                With over 15 years of experience, I empower leaders to pursue
                                purposeful growth, lead with clarity, and embrace the journey of
                                transformation. For me, coaching is more than a profession; it
                                is a calling. Since 2007, I have dedicated myself to honing my
                                expertise, blending skills, knowledge, and insight to support
                                teams and organizations in reaching their fullest potential and
                                guiding them to live and lead with authentic purpose.
                            </p>
                        </div>

                        {/* Founder Info */}
                        <div className="flex flex-col items-center">
                            <img
                                src={founderImg}
                                alt="Raja Allaho"
                                className="w-20 h-20 object-cover rounded-full mb-4 border-2 border-gray-100 shadow-sm"
                            />
                            <h3 className="text-[22px] font-semibold font-poppins text-primary mb-1">
                                Raja Allaho
                            </h3>
                            <p className="text-[14px] font-poppins text-gray-600 mb-[-9px]">
                                Founder of Mashar
                            </p>
                            <p className="text-[14px] font-poppins text-gray-600">
                                Executive, Team & Mentor Coach
                            </p>


                        </div>
                    </div>
                </div>
            </section>

            {/* 15+ global */}

            <section
                className="py-16 px-6 relative bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${statsBg})` }}
            >
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-[#0f1c80]/20 pointer-events-none"></div>
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className="
                    w-full
                    max-w-[258px]
                    min-h-[199px]
                    bg-white/90
                    rounded-[12px]
                    flex flex-col items-center justify-center
                    text-center
                    shadow-lg
                    p-6
                    mx-auto
                    cursor-pointer transition-all duration-500 ease-out transform hover:scale-[1.05] hover:shadow-xl
                "
                            >
                                <h3 className="text-[40px] font-bold text-[#f39300] font-poppins mb-3">
                                    {item.number}
                                </h3>

                                <p className="text-[15px] font-poppins leading-snug line-clamp-2 max-w-[180px]">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* purpose driven */}

            <section className="relative mx-auto px-6 md:px-12 lg:px-[130px] max-w-7xl py-20 lg:py-[120px] gap-12 items-center">
                {/* Left Content */}
                <h2 className="text-3xl md:text-[46px] font-medium font-spartan mb-12 leading-tight text-center">
  <span className="relative inline-block">
    Purpose-Driven.{" "}
      <span className="text-primary">Baked by</span>{" "}
      <span className="text-secondary">Experience</span>

    <img
        src={CurvedLine}
        alt="curve"
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
    />
  </span>
                </h2>
                <p className="text-center font-poppins text-[16px] max-w-3xl mx-auto mb-12 text-sm md:text-base leading-6">
                    Here’s why Mashar is trusted by those who lead with heart and vision.
                </p>
                <div className="grid md:grid-cols-2 max-w-6xl ">
                    <div className="md:pt-[20px]">
                        <ul className="leading-[30px] mb-8">
                            {points.map((point, index) => (
                                <li key={index} className="flex items-start gap-[16px]">
                                    {/* ✅ Inline SVG icon */}
                                    <span className=" text-black">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="32"
                        height="32"
                        fill="none"
                        className="stroke-current"
                    >
                      <path
                          d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                                    <span className="font-poppins text-[15px] font-normal leading-[30px] tracking-[0.5px]">
  {point}
</span>
                                </li>
                            ))}
                        </ul>
                        <div
                            className=" sm:ml-[69px] group  tracking-wide "
                            onClick={() => {
                                navigate("/whyMashar");
                                window.scrollTo(0, 0);
                            }}
                        >
                            <ArrowButton text="Read Our Story" textSize="16px" />
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className=" justify-end 773:flex hidden ">
                        <img
                            src={workshop}
                            alt="Workshop"
                            className="rounded-[24px]  max-w-xs 924:max-w-sm "
                        />
                    </div>
                </div>
                <div className="absolute -bottom-0 top-[9px] left-[-250px]">
                    <img
                        src={LeftCornorGroup}
                        alt="Circle 1"
                        className="w-[30px] sm:w-[110px]"
                    />
                </div>
            </section>

            <section className=" pt-20 pb-10 text-center relative ">
                {/* Background Rings (Top Left) */}
                <div className="absolute  top-5  left-0 z-0  pointer-events-none">
                    <div
                        className="absolute rounded-full"
                        style={{
                            position: "absolute",
                            width: "138.76px",
                            height: "136.43px",
                            top: "0px",
                            left: "100px",
                            opacity: 0.05,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgb(15, 28, 128)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    ></div>

                    <div
                        className="absolute rounded-full"
                        style={{
                            position: "absolute",
                            width: "170.73px",
                            height: "126.57px",
                            top: "-10px",
                            left: "8px",
                            transform: "rotate(-233.73deg)",
                            opacity: 0.05,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgb(15, 28, 128)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    ></div>
                </div>
                {/* Heading */}
                <h2 className="text-3xl md:text-[46px] font-medium font-spartan mb-12 leading-tight text-center">
            <span className="relative inline-block">
            Accredited Certified{" "}
          <span className="text-primary">Globally</span>{" "}
           <span className="text-secondary">Recognized</span>

       <img
        src={CurvedLine}
        alt="curve"
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
        />
      </span>
                </h2>

                <GlobalSection />
            </section>

            {/* testimonials */}
            <section className="relative pt-8 sm-pb-32  px-6 md:px-10 bg-white text-center">
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-[-850px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
                <div className="mb-[50px]">
                    <h2 className="text-3xl md:text-[46px] font-medium font-spartan mb-12 leading-tight text-center">
  <span className="relative inline-block">
    Testimonials

    <img
        src={CurvedLine}
        alt="curve"
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
    />
  </span>
                </h2>

                </div>
                <TestimonialsSlider />
            </section>

            {/* frequently asked questions  */}

            <section className="relative mx-auto px-6 md:py-[84px] lg:px-[130px]   max-w-7xl py-10  gap-12 items-center">
                <div className="absolute -bottom-0 top-[9px] left-[-252px]">
                    <img
                        src={LeftCornorGroup}
                        alt="Circle 1"
                        className="w-[30px] sm:w-[110px]"
                    />
                </div>

                {/* Heading */}
                <div className="text-center mb-12 relative">
                    {/* Background Rings (Top Left) */}
                    <div className="absolute  top-5  left-0 z-0  pointer-events-none">
                        <div
                            className="absolute rounded-full"
                            style={{
                                position: "absolute",
                                width: "138.76px",
                                height: "136.43px",
                                top: "-31.51px",
                                left: "92.24px",
                                opacity: 0.04,
                                borderWidth: "11px",
                                borderStyle: "solid",
                                borderColor: "rgb(15, 28, 128)",
                                borderRadius: "100px",
                                boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                            }}
                        ></div>

                        <div
                            className="absolute rounded-full"
                            style={{
                                position: "absolute",
                                width: "170.73px",
                                height: "126.57px",
                                top: " -55px",
                                left: "17px",
                                transform: "rotate(-233.73deg)",
                                opacity: 0.04,
                                borderWidth: "11px",
                                borderStyle: "solid",
                                borderColor: "rgb(15, 28, 128)",
                                borderRadius: "100px",
                                boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                            }}
                        ></div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-[46px] font-medium font-spartan mb-12 leading-tight text-center">
  <span className="relative inline-block">
    Frequently <span className="text-primary">Asked</span>{" "}
      <span className="text-secondary">Questions</span>
    <img
        src={CurvedLine}
        alt="curve"
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
    />
  </span>
                    </h2>
                    <p className="max-w-3xl mx-auto mb-12 text-sm md:text-base leading-6">
                        Find answers to common questions about our services and discover how
                        we can support your journey to success.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-6xl space-y-3 relative">
                    {/* Background Rings (Top Left) */}
                    <div className="absolute top-5 left-[-120px] z-0 pointer-events-none">
                        <div
                            className="absolute rounded-full"
                            style={{
                                position: "absolute",
                                width: "138.76px",
                                height: "136.43px",
                                top: "150.49px",
                                left: "-28.76px",
                                opacity: 0.04,
                                borderWidth: "11px",
                                borderStyle: "solid",
                                borderColor: "rgb(15, 28, 128)",
                                borderRadius: "100px",
                                boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                            }}
                        ></div>

                        <div
                            className="absolute rounded-full"
                            style={{
                                position: "absolute",
                                width: "170.73px",
                                height: "126.57px",
                                top: "122px",
                                left: "-89px",
                                transform: "rotate(-233.73deg)",
                                opacity: 0.04,
                                borderWidth: "11px",
                                borderStyle: "solid",
                                borderColor: "rgb(15, 28, 128)",
                                borderRadius: "100px",
                                boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                            }}
                        ></div>
                    </div>

                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="relative rounded-xl overflow-hidden shadow-[0px_4px_4px_0px_#00000012]"
                        >
                            <button
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-${index}`}
                                onClick={() => toggleFAQ(index)}
                                className={`w-full flex justify-between items-center font-poppins px-5 py-4 text-left font-medium transition text-[16px] sm:text-[18px] ${
                                    openIndex === index
                                        ? "bg-primary text-white font-normal"
                                        : "bg-[#2B347608] text-primary"
                                }`}
                            >
                                <span>{faq.question}</span>

                                <ChevronDown
                                    className={`w-5 h-5 flex-shrink-0 ml-3 transform transition-transform duration-300 ${
                                        openIndex === index ? "rotate-180" : "rotate-0"
                                    }`}
                                />
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        id={`faq-${index}`}
                                        key={`content-${index}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.36, ease: "easeInOut" }}
                                        className="overflow-hidden bg-[#F8F9FB] font-poppins text-[14px] sm:text-[15px] leading-6"
                                    >
                                        <div className="px-5 py-4">{faq.answer}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* logos */}
            <section className="md:pt-[60px] md:pb-[64px] text-center relative ">
                {/* Background Rings (Top Left) */}
                <div className="absolute  top-5  left-0 z-0  pointer-events-none">
                    <div
                        className="absolute rounded-full"
                        style={{
                            position: "absolute",
                            width: "138.76px",
                            height: "136.43px",
                            top: "66.49px",
                            left: "151.24px",
                            opacity: 0.05,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgb(15, 28, 128)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    ></div>

                    <div
                        className="absolute rounded-full"
                        style={{
                            position: "absolute",
                            width: "170.73px",
                            height: "126.57px",
                            top: "46px",
                            left: "84px",
                            transform: "rotate(-233.73deg)",
                            opacity: 0.05,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgb(15, 28, 128)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    ></div>
                </div>
                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl md:text-[46px] font-medium font-spartan mb-12 leading-tight text-center">
  <span className="relative inline-block">
    Trusted by Leaders <span className="text-primary">Across the</span>{" "}
      <span className="text-secondary">Region</span>
      {/* Curved line image centered to content */}
      <img
          src={CurvedLine}
          alt="curve"
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px]"
      />
  </span>
                </h2>


                {/*<p className="font-poppins text-[15px] mb-12">*/}
                {/*    Trusted by Leaders Across the Region*/}
                {/*</p>*/}
                <LeadersSection />
            </section>
            {/* start conversation */}
            <section className="relative md:pt-[84px] md:pb-[84px] py-16 md:py-20 px-6 md:px-12 text-center text-black mb-24">
                <div className="absolute -bottom-0 top-[330px] left-0">
                    <img
                        src={LeftCornorGroup}
                        alt="Circle 1"
                        className="w-[30px] sm:w-[110px]"
                    />
                </div>

                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-[120px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
                <div className="mx-auto">
                    {/* Heading */}
                    <h2 className="text-3xl md:text-[46px] font-medium font-spartan mb-12 leading-tight text-center">
  <span className="relative inline-block">
    Start a Conversation{" "}
      <span className="text-primary">That Changes</span>{" "}
      <span className="text-secondary">Everything</span>

    <img
        src={CurvedLine}
        alt="curve"
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
    />
  </span>
                    </h2>


                    {/* Subtext */}
                    <p className="text-black text-[15px] leading-[28px] opacity-90 font-poppins max-w-3xl mx-auto text-center">
                        If you're looking to inspire transformation not just information you're in the right place.
                    </p>

                    <p className="text-black text-[15px] leading-[30px] opacity-90 font-poppins max-w-5xl mx-auto mb-10 text-center whitespace-normal md:whitespace-nowrap px-4">
                        Let’s co-create a future where people flourish, organizations evolve, and the region leads with wisdom.
                    </p>

                    {/* Button */}
                    <div className="relative inline-flex items-center group tracking-widest">
                        <ArrowButton
                            text="Book a Free Consultation"
                            textSize="16px"
                            onClick={openCalendly}
                        />
                    </div>
                </div>
            </section>

            {/* MODAL */}
            <DiscoveryModal isOpen={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
};
export default Home;
