import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { scrollToHash } from "../utils/scrollToHash";
import whyMashar from "../assets/letsTalkBg.jpeg";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebookF, FaLinkedin, FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { MdLocationOn, MdMessage, MdPhone } from "react-icons/md";
import aeroplane from "../assets/aeroplane.gif";
import CustomSelect from "../components/Select";
import ArrowButton from "../components/Arrowbutton";
import CurvedLine from "../assets/CurvedLine.png";
import gif from "../assets/gif2.gif";
import circle from "../assets/ellipseorange.svg";
import LeftCornorGroup from "../assets/LeftCornorGroup.png";
import SEO from "../components/SEO";

export default function LetsTalk() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [openIndex, setOpenIndex] = useState(0);
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organization: "",
        service: "",
        message: ""
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Scroll to section when navigated with a hash (e.g. #contact, #faq)
    useEffect(() => {
        scrollToHash(location.hash, 120);
    }, [location.hash]);

    const openCalendly = () => {
        window.open(
            "https://calendly.com/raja-20/15min?month=2026-01",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            await axios.post("/api/public/contact", formData);
            setFormSubmitted(true);
            setTimeout(() => {
                setFormSubmitted(false);
                setFormData({ name: "", email: "", phone: "", organization: "", service: "", message: "" });
            }, 6000);
        } catch (err) {
            console.error(err);
            setErrorMsg("Sorry, our system encountered an error. Please try again.");
        } finally {
            setLoading(false);
        }
    };


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
        },
    ];
    const whyContactCards = [
        {
            title: "ICF & EMCC\nAccredited Excellence",
            description:
                "International coaching and mentoring standards delivered by certified facilitators",
        },
        {
            title: "Regional\nIntelligence",
            description:
                "Methodologies designed for GCC leadership realities,\n not imported or generic models",
        },
        {
            title: "Evidence Based\nInsight",
            description:
                "TAWDI (10 minutes) and GEDI (20 minutes) provide clarity before significant development investments",
        },
        {
            title: "Consultative\nPartnership",
            description:
                "We don’t sell programs. We work with you to identify what leaders and teams actually need",
        },
    ];

    const toggleFAQ = (index) =>
        setOpenIndex(openIndex === index ? null : index);

    return (
        <div className="relative overflow-hidden">
            <SEO
                title="Let's Talk | Mashar"
                description="Connect with Mashar to discuss opportunities, partnerships, and how we can achieve a stronger tomorrow together."
            />

            {/* ================= HERO ================= */}
            <header className="relative h-[200px]  sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-center text-white text-center p-8">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${whyMashar})` }}
                />

                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to bottom, rgba(43,52,118,0.26), rgba(43,52,118,0.20))",
                    }}
                />

                <h1 className="relative z-10 text-3xl sm:text-4xl lg:text-[52px] font-semibold font-spartan tracking-wide">
                    LET’S TALK
                </h1>
            </header>


            {/* ================= CONTACT ================= */}
            <section id="contact" className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 py-16 grid grid-cols-1 md:grid-cols-2 gap-14">

                {/* LEFT */}
                <div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl md:text-[46px] font-medium font-spartan leading-tight">
                            <span>Let’s Start the </span>

                            <span className="relative inline-block text-secondary pt-7 pb-6">
                                Conversation!
                                <img
                                    src={CurvedLine}
                                    alt="curve"
                                    className="absolute  sm:left-[65%] left-[50%] -translate-x-1/2 bottom-0 w-[160px] sm:w-[200px] md:w-[149px] h-[15px]"
                                />
                            </span>
                        </h2>

                        <img src={aeroplane} alt="" className="w-20 sm:w-28" />
                    </div>

                    <p className="mt-6 text-sm leading-7 max-w-xl font-poppins">
                        We’d love to hear from you. Whether you’re exploring our programs,
                        looking for a tailored solution, or simply curious about how Mashar
                        can support your growth.
                    </p>

                    <div className="mt-10 space-y-4 text-sm font-poppins">
                        {[
                            { icon: <MdLocationOn />, text: "Kuwait City, Kuwait" },
                            { icon: <MdPhone />, text: "+965 9903 4310", href: "tel:+96599034310" },
                            { icon: <MdMessage />, text: "info@mashar.org", href: "mailto:info@mashar.org" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full text-white bg-secondary hover:scale-110">
                                    {item.icon}
                                </span>
                                {item.href ? (
                                    <a href={item.href} className="hover:underline">
                                        {item.text}
                                    </a>
                                ) : (
                                    item.text
                                )}
                            </div>
                        ))}
                        {/* Decorative orange orbit */}
                        <div className="absolute right-[800px] top-[920px]  pointer-events-none">
                            {/* Big orange circle */}
                            <div className="relative w-20 h-20">
                                <img src={gif} className="absolute bottom-2 right-[107px] w-11" />

                                {/* Second image - bottom right */}
                                <img
                                    src={circle}
                                    className="absolute bottom-[5px] right-[140px] w-8"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex gap-4 mt-8 justify-center sm:justify-start">
                        {[
                            {
                                icon: FaFacebookF,
                                url: "https://www.facebook.com/masharcoaching",
                                label: "Facebook",
                            },
                            {
                                icon: FaXTwitter,
                                url: "https://x.com/Rajathecoach",
                                label: "X (Twitter)",
                            },
                            {
                                icon: FaInstagram,
                                url: "https://www.instagram.com/masharcoaching/",
                                label: "Instagram",
                            },
                            {
                                icon: FaLinkedin,
                                url: "https://www.linkedin.com/in/raja-allaho/",
                                label: "LinkedIn",
                            },
                        ].map(({ icon: Icon, url, label }, i) => (
                            <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-white bg-secondary hover:scale-110"
                            >
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>

                {/*RIGHT*/}
                {formSubmitted ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14247B] mb-6">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#14247B] mb-2">
                            Thank you!
                        </h2>

                        <p className="text-base sm:text-[16px] text-gray-600">
                            Your message has been received. <br />
                            Our team will be in touch shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name*"
                            required
                            className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email*"
                            required
                            className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder="Organization"
                            className="w-full border-b p-2 text-sm focus:outline-none focus:border-primary"
                        />

                        <CustomSelect
                            placeholder="Select Service"
                            onChange={(val) => setFormData({ ...formData, service: val })}
                            options={[
                                "Coaching",
                                "Training",
                                "Mentoring & Supervision",
                                "Assessments",
                                "Custom Solutions",
                                "General Inquiry",
                            ]}
                        />

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Message"
                            className="w-full border rounded-lg p-3 text-sm"
                        />

                        <ArrowButton
                            type="submit"
                            text={loading ? "Sending..." : "Submit"}
                            className="h-[50px]"
                            textSize="16px"
                        />
                    </form>
                )}

            </section>

            {/* why contact  */}
            {/* ================= WHY CONTACT US ================= */}
            <section className="py-24 px-4 md:px-7 lg:px-24 text-center relative">
                {/* Background Rings */}
                <div className="absolute top-5 left-0 z-0 pointer-events-none">
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: "138.76px",
                            height: "136.43px",
                            top: "37.49px",
                            left: "31.24px",
                            opacity: 0.1,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgb(15, 28, 128)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    />
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: "170.73px",
                            height: "126.57px",
                            top: "16px",
                            left: "-36px",
                            transform: "rotate(-233.73deg)",
                            opacity: 0.1,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "rgb(15, 28, 128)",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    />
                </div>

                {/* Title */}
                <h2 className="font-spartan font-medium leading-[1.15] text-[36px] md:text-[46px] lg:text-[52px] mb-10">
                    <span className="relative inline-block pb-8">
                        Why <span className="text-secondary">Contact Us</span>

                        <img
                            src={CurvedLine}
                            alt="curve"
                            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[160px] mb-2 sm:w-[200px] md:w-[229px] h-[12px]"
                        />
                    </span>
                </h2>


                {/* Cards */}
                <div className="max-w-[1400px] mt-6 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10 px-4 sm:px-6 lg:px-0">
                    {whyContactCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-[#F2F2F2] rounded-2xl lg:rounded-[16px] px-6 sm:px-8 py-10 sm:py-12 text-center flex flex-col items-center transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-lg cursor-pointer min-h-[280px] sm:min-h-[300px]"
                        >
                            <h3 className="text-[#0F1C80] text-[18px] font-semibold mb-4  sm:mb-4 whitespace-pre-line leading-tight min-h-[60px] sm:min-h-[70px] flex items-center justify-center">
                                {card.title}
                            </h3>

                            <p className="whitespace-pre-line font-poppins font-normal text-[clamp(14px,1.6vw,17px)] leading-[1.75] sm:leading-[1.875] tracking-[0.03125em] text-center text-[#1A1A1A] max-w-[260px]">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
                {/* CTA */}
                <div className="flex justify-center mt-4 lg-mt-20 relative z-10">
                    <ArrowButton text="Book a Discovery Call"
                        textSize={window.innerWidth < 640 ? "12px" : "16px"}
                        className="!px-6 mt-4 w-fit max-w-full"
                        onClick={openCalendly}
                    />
                </div>
            </section>



            {/* ================= MAP ================= */}
            <div id="map" className="scroll-mt-24 w-full px-4 sm:px-10 lg:px-16 mt-20">
                <iframe
                    title="Mashar Coaching, Training and Consultation - Kuwait"
                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl shadow-lg border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.0230935876776!2d47.9674274!3d29.3673493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf8311a7d00795%3A0x614a9276c8caecaa!2sMashar%20Coaching%2C%20Training%20and%20Consultation!5e0!3m2!1sen!2sus!4v1700000000000"
                />
            </div>



            {/* ================= FAQ ================= */}
            <section id="faq" className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 py-20">
                <h2 className="text-2xl sm:text-3xl lg:text-[46px] font-medium text-center font-spartan mb-12">
                    <span>Frequently </span>

                    <span className="relative inline-block text-secondary pt-7 pb-6 sm:pb-10">
                        Asked Questions
                        <img
                            src={CurvedLine}
                            alt="curve"
                            className="absolute left-[50px] -translate-x-1/2 bottom-0 w-[160px] sm:w-[200px] md:w-[209px] h-[15px]"
                        />
                    </span>
                </h2>

                <div className="space-y-4 max-w-4xl mx-auto">
                    {faqs.map((faq, i) => (
                        <div key={i} className="rounded-xl overflow-hidden shadow">
                            <button
                                onClick={() => toggleFAQ(i)}
                                className={`w-full flex justify-between items-center p-5 text-left font-poppins text-sm sm:text-base ${openIndex === i
                                    ? "bg-primary text-white"
                                    : "bg-[#2B347608] text-primary"
                                    }`}
                            >
                                {faq.question}
                                <ChevronDown
                                    className={`transition-transform ${openIndex === i ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="p-5 bg-[#2B347608] text-sm leading-relaxed"
                                    >
                                        {faq.answer}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>
            <div className="absolute -bottom-20 left-0">
                <img
                    src={LeftCornorGroup}
                    alt="Circle 1"
                    className="w-[30px] sm:w-[110px]"
                />
            </div>

        </div>
    );
}
