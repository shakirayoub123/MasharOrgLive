import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArrowButton from "../components/Arrowbutton";

// Images
import img1 from "../assets/video1.jpg";
import img2 from "../assets/video2.jpg";
import img3 from "../assets/video3.jpg";
import heroImg from "../assets/videoHero.png";

const openCalendly = () => {
    window.open(
        "https://calendly.com/raja-20/15min?month=2026-01",
        "_blank",
        "noopener,noreferrer"
    );
};

const heroImages = [heroImg, img1, img2, img3];

const sections = [
    { label: "ARTICLES", path: "/articles" },
    { label: "BOOKS", path: "/books" },
    { label: "VIDEOS", path: "/videos" },
    { label: "EVENTS", path: "/events" },
];

const videos = [
    {
        title: "GEDI — Global Executive Dynamics Inventory",
        description:
            "GEDI offers senior leaders a clear and insightful picture of their executive impact across four leadership dimensions.",
        deeper:
            "Speak with a Mashar consultant to understand which path best supports your leadership journey.",
        image: img1,
        slug: "gedi",
        url: "https://www.youtube.com/watch?v=IVt2I2lHewE",
    },
    {
        title: "TAWDI — Team & Workplace Dynamics Inventory",
        description:
            "TAWDI reveals the interpersonal patterns shaping your team’s performance.",
        deeper:
            "Our Mashar consultants can guide you toward the right assessment or coaching pathway.",
        image: img2,
        slug: "tawdi",
        url: "https://www.youtube.com/watch?v=7pGyx7_Zslg",
    },
    {
        title: "What Is Coaching? — ICF",
        description:
            "A clear explanation of what coaching truly is according to the International Coaching Federation.",
        deeper:
            "Explore whether professional coaching is the right next step for your development journey.",
        image: img3,
        slug: "what-is-coaching",
        url: "https://www.youtube.com/watch?v=Yi367FBm8Ik",
    },
];

const WatchVideo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentHero, setCurrentHero] = useState(0);

    /* ================= ROUTE INDEX ================= */
    const currentIndex = sections.findIndex(
        (s) => s.path === location.pathname
    );

    /* ================= HERO IMAGE ================= */
    const prevHeroImage = () => {
        setCurrentHero((prev) =>
            prev === 0 ? heroImages.length - 1 : prev - 1
        );
    };

    const nextHeroImage = () => {
        setCurrentHero((prev) =>
            prev === heroImages.length - 1 ? 0 : prev + 1
        );
    };

    /* ================= ROUTE NAV ================= */
    const goPrev = () => {
        const prev =
            currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        navigate(sections[prev].path);
        prevHeroImage();
    };

    const goNext = () => {
        const next =
            currentIndex === sections.length - 1 ? 0 : currentIndex + 1;
        navigate(sections[next].path);
        nextHeroImage();
    };

    return (
        <div className="bg-white font-spartan">

            {/* ================= HERO ================= */}
            <header className="relative h-[200px]  sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-center text-white text-center p-8">
                <img
                    src={heroImages[currentHero]}
                    alt="Videos Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />

                <h1 className="relative z-10 text-5xl font-semibold tracking-wide">
                    {sections[currentIndex]?.label || "VIDEOS"}
                </h1>

                {/* LEFT ARROW */}
                <button
                    onClick={goPrev}
                    className="absolute left-6 z-20 bg-black/40 hover:bg-black/60 p-3 rounded-full transition"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* RIGHT ARROW */}
                <button
                    onClick={goNext}
                    className="absolute right-6 z-20 bg-black/40 hover:bg-black/60 p-3 rounded-full transition"
                >
                    <ChevronRight size={28} />
                </button>
            </header>

            {/* ================= HEADING ================= */}
            {/*<section className="pt-16 md:pt-24 pb-12 md:pb-16 text-center">*/}
            {/*    <h2 className="font-spartan font-medium leading-[1.15] text-[36px] md:text-[46px] lg:text-[52px]">*/}
            {/*        Videos*/}
            {/*    </h2>*/}

            {/*    <div className="flex justify-center mt-2">*/}
            {/*        <svg width="240" height="20" viewBox="0 0 240 20">*/}
            {/*            <defs>*/}
            {/*                <linearGradient id="articlesCurveGradient">*/}
            {/*                    <stop offset="0%" stopColor="#1E40FF" />*/}
            {/*                    <stop offset="12%" stopColor="#000" />*/}
            {/*                    <stop offset="88%" stopColor="#000" />*/}
            {/*                    <stop offset="100%" stopColor="#1E40FF" />*/}
            {/*                </linearGradient>*/}
            {/*            </defs>*/}
            {/*            <path*/}
            {/*                d="M4 14 C80 2 160 2 236 14"*/}
            {/*                stroke="url(#articlesCurveGradient)"*/}
            {/*                strokeWidth="7"*/}
            {/*                strokeLinecap="round"*/}
            {/*                fill="none"*/}
            {/*            />*/}
            {/*        </svg>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/* ================= CONTENT ================= */}
            <section className="py-12 sm:py-16 lg:py-24 px-6">
                <div className="max-w-[1200px] mx-auto space-y-32">
                    {videos.map((video, index) => (
                        <div
                            key={index}
                            className="group flex flex-col lg:flex-row gap-20 items-start"
                        >
                            {/* Thumbnail */}
                            <div
                                className="relative w-full lg:w-[450px] h-[340px] cursor-pointer"
                                onClick={() =>
                                    window.open(video.url, "_blank", "noopener,noreferrer")
                                }
                            >
                                <img
                                    src={video.image}
                                    alt={video.title}
                                    className="w-full h-full object-cover rounded-2xl shadow-md group-hover:brightness-95 transition"
                                />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl text-[#0F1C80] text-2xl group-hover:scale-110 transition">
                                        ▶
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="max-w-[560px]">
                                <h3 className="text-[26px] font-semibold text-[#0F1C80] mb-4 group-hover:text-[#f39300] transition">
                                    {video.title}
                                </h3>

                                <p className="text-gray-700 leading-[30px] mb-2">
                                    {video.description}
                                </p>

                                <p className="text-[#0F1C80] font-medium mb-2">
                                    Ready to Go Deeper?
                                </p>

                                <p className="text-gray-700 leading-[28px] mb-5">
                                    {video.deeper}
                                </p>

                                <ArrowButton
                                    text="Continue the Conversation"
                                    onClick={openCalendly}
                                />
                                {/* like button removed for public videos */}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default WatchVideo;
