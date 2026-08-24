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
import book6 from "../assets/mosicBook.jpeg";
import heroImg from "../assets/herobooks.png";

const heroImages = [heroImg, book1, book2, book3, book4, book5, book6];

const sections = [
    { label: "ARTICLES", path: "/articles" },
    { label: "BOOKS", path: "/books" },
    { label: "VIDEOS", path: "/videos" },
    { label: "EVENTS", path: "/events" },
];

const books = [
    {
        title: "Coaching in Islamic Culture: The Principles and Practice of Ershad",
        author: "Raja Allaho & Christian van Nieuwerburgh",
        description: "A groundbreaking exploration of how coaching can be practiced in ways that honor Islamic values, cultural norms, and spiritual depth. Built around the complete Ershad coaching framework, the book integrates modern coaching science with principles rooted in faith, dignity, and intentional human development.",
        masharRecommends: "Written by Mashar’s founder, Raja’a Allaho, in collaboration with global coaching expert Christian van Nieuwerburgh, this book fills a long-standing gap in the coaching field. It provides a culturally aligned model for leadership and coaching in the GCC—one that respects identity, strengthens trust, and supports human growth without compromising faith or tradition.",
        keyThemes: [
            "Coaching aligned with Islamic values",
            "Ershad: a complete, culturally grounded coaching model",
            "Human development through faith, reflection, and intention",
            "Practical applications for leaders, coaches, and educators",
            "Integrating spirituality and professionalism in leadership practice"
        ],
        image: book1,
        url: "https://www.amazon.com/Coaching-Islamic-Culture-Principles-Professional/dp/0367103109/",
    },
    {
        title: "An Introduction to Coaching Skills: A Practical Guide (Updated Third Edition)",
        author: "Christian van Nieuwerburgh",
        description: "A clear, structured, and highly practical guide to foundational coaching skills. Designed for beginners, new coaches, and leaders who want to integrate coaching conversations into their daily work, this book breaks down the core competencies of effective coaching with simplicity and clarity. With over 70 real coaching videos, it bridges theory with practice.",
        masharRecommends: "Christian van Nieuwerburgh is one of the most respected voices in modern coaching — and a long-time collaborator with Mashar. This book is ideal for leaders and aspiring coaches who want to master essential skills: listening, questioning, presence, and creating a safe, supportive space for growth. It’s also a perfect companion for participants in Mashar’s Certified Professional Coach Program (CPCP).",
        keyThemes: [
            "Core coaching competencies explained step-by-step",
            "Real coaching examples and demonstrations",
            "Powerful questioning and active listening techniques",
            "Building trust and structure in coaching conversations",
            "Ideal foundation for new coaches and leaders"
        ],
        image: book2,
        url: "https://www.amazon.com/Introduction-Coaching-Skills-Practical-Guide/dp/1529710545/",
    },
    {
        title: "An Introduction to Coaching Skills: A Practical Guide (Second Edition)",
        author: "Christian van Nieuwerburgh",
        description: "A foundational, easy-to-follow introduction to the essential skills every coach needs. This edition walks readers through the “how-to” of coaching with practical examples, downloadable templates, reflective activities, and over 70 real coaching videos — making it one of the most accessible starting points for anyone entering the coaching profession.",
        masharRecommends: "Christian van Nieuwerburgh’s work is deeply aligned with Mashar’s approach to building capable, ethical, and culturally aware coaches. This book gives emerging coaches the confidence to begin practicing core skills — listening, questioning, contracting, presence — with clarity and structure. It is an ideal companion for trainees in Mashar’s coaching certification programs or leaders who want to integrate coaching into their management style.",
        keyThemes: [
            "Step-by-step introduction to coaching essentials",
            "Real coaching videos and sample sessions",
            "Practical templates to use with clients",
            "Common challenges and how to navigate them",
            "Guidance on developing and sustaining coaching competence"
        ],
        image: book3,
        url: "https://www.amazon.com/Introduction-Coaching-Skills-Practical-Guide/dp/1473975816/",
    },
    {
        title: "Mentoring with a Coaching Attitude",
        author: "Sylviane Cannio, Cicero Carvalho & Fisher Yu",
        description: "A modern and global exploration of mentoring that goes far beyond traditional “advice-giving.” This book positions mentoring as a learning alliance — a mutual, reflective partnership where both mentor and mentee develop through curiosity, openness, and shared dialogue. Blending practical tools with cross-cultural insights, it highlights the essential skills mentors need today: active listening, powerful questioning, feedback, and experimentation.",
        masharRecommends: "Mashar champions developmental relationships built on trust, humility, and cultural intelligence — exactly what this book advocates. Its coaching-infused approach to mentoring aligns perfectly with how leadership grows in the GCC: through relationships rooted in respect, wisdom, and continuous learning. This book is especially valuable for organizations building internal mentoring programs or leaders transitioning into roles where they guide and develop others.",
        keyThemes: [
            "Modern mentoring as a two-way learning partnership",
            "Coaching attitudes: listening, questioning, reflection, action",
            "How mentoring strengthens values and leadership across generations",
            "Cross-cultural perspectives from mentors around the world",
            "Practical models for academic, corporate, and professional settings"
        ],
        image: book4,
        url: "https://www.amazon.com/Mentoring-Coaching-Attitude-Sylviane-Cannio/dp/0335252079/",
    },
    {
        title: "Radical Listening: The Art of True Connection",
        author: "Christian van Nieuwerburgh & Robert Biswas-Diener",
        description: "A transformative guide to listening not as a passive skill, but as an act of connection, presence, and meaning-making. Moving beyond traditional “active listening,” the book introduces six powerful competencies that deepen understanding and strengthen human relationships — essential for leaders, coaches, and teams navigating today’s distracted, fast-moving world.",
        masharRecommends: "Radical listening lies at the heart of effective coaching and leadership. This book expands the definition of listening into a practice that aligns beautifully with Gulf leadership values: respect, patience, humility, and genuine attentiveness. Its competencies support leaders in building trust, reducing conflict, and fostering psychological safety — skills essential in every organizational culture.",
        keyThemes: [
            "Listening as a co-created experience",
            "Six coaching-aligned competencies: Noticing, Quieting, Accepting, Acknowledging, Questioning, Interjecting",
            "Reducing distraction and increasing presence",
            "Deepening emotional connection and clarity",
            "Transforming communication within teams and leadership relationships"
        ],
        image: book5,
        url: "https://www.amazon.com/Radical-Listening-Art-True-Connection/dp/1523007192/",
    },
    {
        title: "Mosaic Leadership: African, Asian, Middle Eastern and Indigenous Perspectives",
        author: "Edited by Jonathan Passmore, Badri Bajaj & Mongezi Makhalima",
        description: "A pioneering collection that brings together leadership perspectives from African, Asian, Middle Eastern, and Indigenous traditions to broaden the global understanding of leadership beyond a single cultural worldview. Through diverse voices and practical models, the book explores how culture, ethics, identity, and lived experience shape effective leadership across different societies.",
        masharRecommends: "Mosaic Leadership represents an important contribution to contemporary leadership thinking by presenting culturally grounded approaches that complement established Western leadership theories. Mashar's founder, Raja'a Allaho, contributed Chapter 23 – ERSHAD Leadership Coaching Model, introducing a values-based coaching framework rooted in Islamic leadership principles that integrates ethics, alignment, intentional action, and human development.",
        keyThemes: [
            "Global perspectives on leadership across cultures",
            "Leadership beyond Western-centric models",
            "The ERSHAD Leadership Coaching Model as a values-based coaching framework",
            "Ethical, culturally grounded leadership development",
            "Leadership through alignment, responsibility, and intentional action",
            "Practical insights from international leadership scholars and practitioners"
        ],
        masharContribution: "Chapter 23: ERSHAD Leadership Coaching Model\nWritten by Raja'a Allaho, the chapter introduces the ERSHAD Leadership Coaching Model, a guidance-based coaching framework that develops leaders through four interconnected phases—Discovery, Intention, Pathways, and Effort—while emphasizing ethical partnership, alignment between values and behaviour, and intentional leadership development.",
        recommendedFor: [
            "Executive coaches",
            "Leadership development professionals",
            "HR and Learning & Development leaders",
            "Organizational development practitioners",
            "Researchers and students of global leadership",
            "Professionals interested in culturally grounded coaching and leadership"
        ],
        image: book6,
        url: "https://www.amazon.com/Mosaic-Leadership-African-Indigenous-Perspectives/dp/1394365136",
    },
];
const Books = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentHero, setCurrentHero] = useState(0);
    const [expandedBooks, setExpandedBooks] = useState({});

    const toggleExpand = (index) => {
        setExpandedBooks((prev) => ({ ...prev, [index]: !prev[index] }));
    };

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

                                <div className="text-gray-700 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-left">
                                    <p className={`transition-all duration-300 ${expandedBooks[index] ? '' : 'line-clamp-4'}`}>
                                        {book.description}
                                    </p>

                                    {expandedBooks[index] && book.masharRecommends && (
                                        <div className="mt-4 flex flex-col gap-3 animate-fade-in">
                                            <p><strong>Why Mashar Recommends It:</strong> {book.masharRecommends}</p>

                                            {book.keyThemes && (
                                                <div>
                                                    <strong>Key Themes:</strong>
                                                    <ul className="list-disc pl-5 mt-1">
                                                        {book.keyThemes.map((theme, i) => (
                                                            <li key={i}>{theme}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {book.masharContribution && (
                                                <div>
                                                    <strong>Mashar Contribution:</strong>
                                                    <p className="mt-1 whitespace-pre-line">{book.masharContribution}</p>
                                                </div>
                                            )}

                                            {book.recommendedFor && (
                                                <div>
                                                    <strong>Recommended For:</strong>
                                                    <ul className="list-disc pl-5 mt-1">
                                                        {book.recommendedFor.map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => toggleExpand(index)}
                                    className="text-[#0F1C80] font-medium text-[14px] md:text-[16px] self-start mt-1 hover:underline focus:outline-none"
                                >
                                    {expandedBooks[index] ? "Read less" : "Read more..."}
                                </button>

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
