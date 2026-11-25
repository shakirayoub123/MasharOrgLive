import { useNavigate, useLocation } from "react-router-dom";
import WhyMashar from "../assets/FinalLeadership.jpeg";
import article from "../assets/stash_article-solid.svg";
import video from "../assets/video.svg";
import books from "../assets/books.png";
import ArrowButton from "../components/Arrowbutton";
import React, { useEffect } from "react";
import { scrollToHash } from "../utils/scrollToHash";
import SEO from "../components/SEO";

const cardData = [
    {
        id: "articles",
        title: "Articles",
        description:
            "Stay ahead with insightful reads on leadership, team dynamics, and personal growth. Our articles bring you practical strategies and fresh perspectives to navigate the challenges of today and tomorrow.",
        button: "Read the Latest Insights",
        icon: article,
        route: "/articles",
    },
    {
        id: "books",
        title: "Books",
        description:
            "Discover a selection of books that inspire purposeful leadership, deepen emotional intelligence, and strengthen cultural awareness. Each title is chosen to help you grow as a future ready leader.",
        button: "Explore Our Library",
        icon: books,
        route: "/books",
    },
    {
        id: "videos",
        title: "Videos",
        description:
            "Watch talks, training highlights, and expert tips from Mashar's coaches and partners. Learn anywhere, anytime, and turn insight into action for lasting leadership growth, and influence.",
        button: "Watch & Learn",
        icon: video,
        route: "/videos",
    },
];

const LeadershipHub = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to card when hash is present (e.g. #articles, #videos, #events)
    useEffect(() => {
        scrollToHash(location.hash, 120);
    }, [location.hash]);

    return (
        <div className="font-spartan bg-white">
            <SEO
                title="Leadership Hub | Mashar"
                description="Stay ahead with insightful reads on leadership, team dynamics, and personal growth in Mashar's Leadership Hub."
            />

            {/* HERO */}
            <header className="relative h-[200px] sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-center text-white text-center p-8">
                <div
                    className="absolute inset-0 bg-cover"
                    style={{ backgroundImage: `url(${WhyMashar})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/30" />
                </div>
                <div className="relative z-10 tracking-wider text-center px-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-semibold tracking-[0.5px] font-spartan mb-4">
                        LEADERSHIP HUB
                    </h1>
                </div>
            </header>

            {/* CONTENT */}
            <section className="py-12 sm:py-16 lg:py-24 px-6">
                <div className="max-w-[1400px] mx-auto">

                    {/* Heading */}
                    <div className="text-center mb-20">
                        <h2 className="font-spartan font-medium leading-[1.15] text-[36px] md:text-[46px] lg:text-[52px]">
                            Learn<span className="text-primary">. Grow.</span>{" "}
                            <span className="text-secondary">Lead.</span>
                        </h2>

                        <div className="flex justify-center mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="20" viewBox="0 0 240 20" fill="none">
                                <defs>
                                    <linearGradient id="learnGrowCurve" gradientUnits="userSpaceOnUse" x1="4" y1="0" x2="236" y2="0">
                                        <stop offset="0%" stopColor="#1E40FF" />
                                        <stop offset="12%" stopColor="#000000" />
                                        <stop offset="88%" stopColor="#000000" />
                                        <stop offset="100%" stopColor="#1E40FF" />
                                    </linearGradient>
                                </defs>
                                <path d="M4 14 C80 2 160 2 236 14" stroke="url(#learnGrowCurve)" strokeWidth="6" strokeLinecap="round" fill="none" />
                            </svg>
                        </div>

                        <p className="mt-6 text-[16px] text-gray-700 max-w-[900px] mx-auto">
                            A curated space for leaders, coaches, and teams to explore trusted resources that inspire growth, deepen insight, and shape the way leaders grow.
                            From practical articles to inspiring videos — Mashar's Knowledge Hub helps you lead with purpose and evolve with confidence.
                        </p>
                    </div>

                    {/* Cards — each has its own id for hash navigation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1300px] mx-auto">
                        {cardData.map((card, index) => (
                            <div
                                id={card.id}
                                key={index}
                                onClick={() => navigate(card.route)}
                                className="
                                    bg-[#EEEEEE]
                                    px-6 py-8 sm:px-8 sm:py-12
                                    rounded-3xl
                                    flex flex-col
                                    items-center
                                    text-center
                                    cursor-pointer
                                    hover:shadow-lg
                                    transition-all
                                    duration-300
                                    min-h-[420px] sm:min-h-[480px]
                                    max-w-[580px]
                                    mx-auto
                                    w-full
                                    scroll-mt-24
                                "
                            >
                                <div className="w-32 h-32 mb-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <img src={card.icon} alt={card.title} className="w-16 h-16" />
                                </div>

                                <h3 className="text-2xl font-medium text-[#0F1C80] mb-6 tracking-wide">
                                    {card.title}
                                </h3>

                                <p className="font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-center text-[#1A1A1A] mb-auto px-4">
                                    {card.description}
                                </p>

                                <div onClick={(e) => e.stopPropagation()} className="mt-8">
                                    <ArrowButton
                                        text={card.button}
                                        onClick={() => navigate(card.route)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
};

export default LeadershipHub;