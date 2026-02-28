import { useNavigate, useLocation } from "react-router-dom";
import ArrowButton from "../components/Arrowbutton";
import EmailDownloadModal from "../Models/EmailDownloadModal.jsx";

import SelfCoaching from "../assets/Self‑Coaching for Complex Leadership Challenges_compressed.pdf";
import Communicating from "../assets/Communicating Effectively Through Disagreement1.pdf";
import HowGreat from "../assets/How Great Leaders Communicate With Impact_compressed.pdf";
import MakingTheShift from "../assets/Making the Shift to Executive Leadership_compressed.pdf";
import UnderStanding from "../assets/Understanding Defensive Behaviors at Work_compressed.pdf"

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🔹 TEMP images
import img1 from "../assets/article1.jpg";
import img2 from "../assets/article2.jpg";
import img3 from "../assets/article3.jpg";
import img4 from "../assets/article4.jpg";
import img5 from "../assets/article5.jpg";
import heroArticles from "../assets/heroArticles.png";

const heroImages = [heroArticles, img1, img2, img3, img4, img5];

const sections = [
    { label: "ARTICLES", path: "/articles" },
    { label: "BOOKS", path: "/books" },
    { label: "VIDEOS", path: "/videos" },
    { label: "EVENTS", path: "/events" },
];

const articles = [
    {
        title: "Understanding Defensive Behaviors at Work",
        slug: "defensive-behaviors-at-work",
        description:
            "Teams often shut down or react defensively when psychological safety is low. This piece explains how fear and uncertainty shape behavior and what leaders can notice when trust begins to erode.",
        image: img1,
        pdf: UnderStanding,
    },
    {
        title: "Communicating Effectively Through Disagreement",
        slug: "communicating-through-disagreement",
        description:
            "Disagreement does not damage teams, but poor communication does. This piece shows how thoughtful language choices reduce tension and help conversations return to collaboration and shared understanding.",
        image: img2,
        pdf: Communicating,
    },
    {
        title: "How Great Leaders Communicate With Impact",
        slug: "leaders-communicate-with-impact",
        description:
            "Clear communication is a defining leadership skill. This piece highlights practical ways leaders can speak with presence and influence while strengthening trust and credibility.",
        image: img3,
        pdf: HowGreat,
    },
    {
        title: "Self-Coaching for Complex Leadership Challenges",
        slug: "self-coaching-leadership-challenges",
        description:
            "Complex challenges require more than quick answers. This piece explores how leaders can slow down, reflect, and coach themselves through uncertainty.",
        image: img4,
        pdf: SelfCoaching,
    },
    {
        title: "Making the Shift to Executive Leadership",
        slug: "shift-to-executive-leadership",
        description:
            "Moving from manager to executive requires a fundamental shift in thinking, identity, and influence.",
        image: img5,
        pdf: MakingTheShift,
    },
];

const Articles = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentHero, setCurrentHero] = useState(0);

    // 🔹 EMAIL MODAL STATE
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedName, setSelectedName] = useState("");

    /* ================= HERO IMAGE SLIDE ================= */
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

    /* ================= ROUTE NAVIGATION ================= */
    const currentIndex = sections.findIndex(
        (s) => s.path === location.pathname
    );

    const goNextRoute = () => {
        const next =
            currentIndex === sections.length - 1 ? 0 : currentIndex + 1;
        navigate(sections[next].path);
        nextHeroImage();
    };

    const goPrevRoute = () => {
        const prev =
            currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        navigate(sections[prev].path);
        prevHeroImage();
    };

    return (
        <div className="font-spartan bg-white">

            {/* ================= HERO ================= */}
            <header className="relative h-[200px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center text-white text-center p-8">
                <img
                    src={heroImages[currentHero]}
                    alt="Articles Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />

                <h1 className="relative z-10 text-5xl font-semibold tracking-wide">
                    {sections[currentIndex]?.label || "ARTICLES"}
                </h1>

                <button
                    onClick={goPrevRoute}
                    className="absolute left-6 z-20 bg-black/40 hover:bg-black/60 p-3 rounded-full"
                >
                    <ChevronLeft size={28} />
                </button>

                <button
                    onClick={goNextRoute}
                    className="absolute right-6 z-20 bg-black/40 hover:bg-black/60 p-3 rounded-full"
                >
                    <ChevronRight size={28} />
                </button>
            </header>

            {/* ================= CONTENT ================= */}
            <section className="py-12 sm:py-16 lg:py-24 px-6">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                    {articles.map((article, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(`/articles/${article.slug}`)}
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer flex flex-col"
                        >
                            <div className="h-[220px] overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>

                            <div className="p-7 flex flex-col flex-grow">
                                <h3 className="text-[18px] font-semibold mb-4 text-[#0F1C80] group-hover:text-[#f39300]">
                                    {article.title}
                                </h3>

                                <p className="text-[14px] leading-[26px] text-gray-700 mb-8">
                                    {article.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ArrowButton
                                            text=""
                                            textSize="12px sm:16px"
                                            className="!px-10 h-[50px]"
                                            onClick={() => {
                                                setSelectedPdf(article.pdf);
                                                setSelectedName(`${article.slug}.pdf`);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    </div>
                                    {/* like button removed for public articles */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= EMAIL DOWNLOAD MODAL ================= */}
            <EmailDownloadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pdf={selectedPdf}
                fileName={selectedName}
            />
        </div>
    );
};

export default Articles;
