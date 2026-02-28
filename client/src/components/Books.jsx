import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArrowButton from "../components/Arrowbutton";

// TEMP book covers
import book1 from "../assets/book1.jpg";
import book2 from "../assets/book2.jpg";
import book3 from "../assets/book3.jpg";
import book4 from "../assets/book4.jpg";
import book5 from "../assets/book5.jpg";
import heroImg from "../assets/herobooks.png";

const heroImages = [heroImg, book1, book2, book3, book4, book5];

const sections = [
    { label: "ARTICLES", path: "/articles" },
    { label: "BOOKS", path: "/books" },
    { label: "VIDEOS", path: "/videos" },
    { label: "EVENTS", path: "/events" },
];

const books = [
    {
        title: "Coaching in Islamic Culture: The Principles and Practice of Ershad",
        author: "Raj'a Allaho, Christian van Nieuwerburgh",
        description:
            "A groundbreaking exploration of how coaching can be practiced in ways that honor Islamic values, cultural norms, and spiritual depth. Built around the complete Ershad coaching framework, the book integrates modern coaching science with principles rooted in faith, dignity, and intentional human development.",
        image: book1,
        url: "https://www.amazon.com/Coaching-Islamic-Culture-Principles-Professional/dp/0367103109/",
    },
    {
        title: "An Introduction to Coaching Skills: A Practical Guide (Third Edition)",
        author: "Christian van Nieuwerburgh",
        description:
            "A clear, structured, and highly practical guide to foundational coaching skills. Designed for beginners, new coaches, and leaders who want to integrate coaching conversations into their daily work, this book breaks down the core competencies of effective coaching with simplicity and clarity.",
        image: book2,
        url: "https://www.amazon.com/Introduction-Coaching-Skills-Practical-Guide/dp/1529710545/",
    },
    {
        title: "An Introduction to Coaching Skills: A Practical Guide (Second Edition)",
        author: "Christian van Nieuwerburgh",
        description:
            "A foundational, easy-to-follow introduction to the essential skills every coach needs. This edition walks readers through the “how-to” of coaching with practical examples, reflective activities, and real coaching scenarios.",
        image: book3,
        url: "https://www.amazon.com/Introduction-Coaching-Skills-Practical-Guide/dp/1473975816/",
    },
    {
        title: "Mentoring with a Coaching Attitude",
        author: "Sylviane Cannio, Cicero Carvalho & Fisher Yu",
        description:
            "A modern and global exploration of mentoring that goes far beyond traditional advice-giving. This book positions mentoring as a learning alliance where both mentor and mentee develop through curiosity, openness, and shared dialogue.",
        image: book4,
        url: "https://www.amazon.com/Mentoring-Coaching-Attitude-Sylviane-Cannio/dp/0335252079/",
    },
    {
        title: "Radical Listening: The Art of True Connection",
        author: "Christian van Nieuwerburgh & Robert Biswas-Diener",
        description:
            "A transformative guide to listening not as a passive skill, but as an act of connection, presence, and meaning-making. The book introduces six powerful competencies that deepen understanding and strengthen human relationships.",
        image: book5,
        url: "https://www.amazon.com/Radical-Listening-Art-True-Connection/dp/1523007192/",
    },
];
const Books = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentHero, setCurrentHero] = useState(0);

    const currentIndex = sections.findIndex(
        (s) => s.path === location.pathname
    );

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
                    alt="Books Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <h1 className="relative z-10 text-5xl font-semibold tracking-wide">
                    {sections[currentIndex]?.label || "BOOKS"}
                </h1>

                <button
                    onClick={goPrev}
                    className="absolute left-3 md:left-6 z-20 bg-black/40 hover:bg-black/60 p-2 md:p-3 rounded-full transition"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={goNext}
                    className="absolute right-3 md:right-6 z-20 bg-black/40 hover:bg-black/60 p-2 md:p-3 rounded-full transition"
                >
                    <ChevronRight size={24} />
                </button>
            </header>

            {/* ================= PAGE HEADING ================= */}
            {/*<section className="pt-16 md:pt-24 pb-12 md:pb-16 text-center">*/}
            {/*    <h2 className="font-spartan font-medium leading-[1.15] text-[36px] md:text-[46px] lg:text-[52px]">*/}
            {/*        Books*/}
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

            {/* ================= BOOK LIST ================= */}
            <section className="py-12 sm:py-16 lg:py-24 px-6">
                <div className="max-w-[1200px] mx-auto space-y-10 md:space-y-20">
                    {books.map((book, index) => (
                        <div
                            key={index}
                            className="group flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 items-center sm:items-start"
                        >
                            {/* Book Cover */}
                            <div className="w-full max-w-[120px] sm:max-w-[160px] md:max-w-[224px] flex-shrink-0 mx-auto sm:mx-0">
                                <div className="aspect-[3/4] md:aspect-[4/5]">
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="w-full h-full object-cover rounded-lg shadow-md"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-3 max-w-full md:max-w-[720px] text-center sm:text-left">
                                <h2 className="font-semibold text-[17px] md:text-[22px] leading-snug text-[#0F1C80] group-hover:text-[#F39300] transition">
                                    {book.title}
                                </h2>

                                <p className="text-[#0F1C80] font-medium text-[14px] md:text-[16px]">
                                    {book.author}
                                </p>

                                <p className="text-gray-700 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] line-clamp-3 md:line-clamp-4">
                                    {book.description}{" "}
                                    <span className="text-[#0F1C80] font-medium cursor-pointer">
              Read more…
            </span>
                                </p>

                                <div className="pt-2 flex justify-center sm:justify-start">
                                    <ArrowButton
                                        text="View Book Details"
                                        onClick={() =>
                                            window.open(book.url, "_blank", "noopener,noreferrer")
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Books;
