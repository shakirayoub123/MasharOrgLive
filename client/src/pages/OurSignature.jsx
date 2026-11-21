import whyMashar from "../assets/FinalSign.jpeg";
import teamMashar from "../assets/OurSignMiddle.jpeg";
import ourSignProgramm from "../assets/ourprogfinal.png";
import signitureGif from "../assets/aeb7d238c48df99c249a74c95e829285332bc6d1.gif";
import squareAnimation from "../assets/squareAnimation.gif";
import gediLogo from "../assets/gedi.png";
import tawdiLogo from "../assets/tawdi.png";
import StepsNew from "../components/steps";
import oursigimage from "../assets/OurSignMiddle.jpeg";
import OurSignMiddle from "../assets/OurSignMiddle2.jpeg";
import frame2297_3 from "../assets/handshake.png";
import curvedLine from "../assets/CurvedLine.png";
import CircularGroupCenter from "../assets/CircularGroupCenter.png";
import solarCupStar from "../assets/solar_cup-star-bold.svg";
import lucideDna from "../assets/VectorOrg.png";
import solarCupStar1 from "../assets/solar_cup-star-bold (1).svg";
import sigicon from "../assets/sigicon.svg";
import trophyBlue from "../assets/trophy-blue.svg";
import netwotkgif from "../assets/netwotkgif.gif";
import lockGif from "../assets/lock.gif";
import ArrowButton from "../components/Arrowbutton";
import React from "react";
import CurvedLine from "../assets/CurvedLine.png";
import CornorGroup from "../assets/CornorGroup.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { scrollToHash } from "../utils/scrollToHash";
import SEO from "../components/SEO";

export default function OurSignature() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        scrollToHash(location.hash, 120);
    }, [location.hash]);

    const openCalendly = () => {
        console.log("clicked"); // ✅ WILL PRINT
        window.open(
            "https://calendly.com/raja-20/15min?month=2026-01",
            "_blank",
            "noopener,noreferrer"
        );
    };
    return (
        <div className="overflow-hidden">
            <SEO
                title="Our Signature Programs | Mashar"
                description="Discover our premier coaching and leadership programs that transform human insights into modern leadership."
            />
            {/* Header Section */}
            <header className="relative h-[200px]  sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-center text-white text-center p-8">
                <div
                    className="absolute inset-0 bg-cover"
                    style={{ backgroundImage: `url(${whyMashar})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/30" />
                </div>
                <div className="relative z-10 tracking-wider text-center px-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-semibold tracking-[0.5px] font-spartan mb-4">
                        OUR SIGNATURE
                    </h1>
                </div>
            </header>
            {/* Our Signature Approach */}
            <section id="approach" className="bg-white px-6 sm:px-10 lg:px-16 xl:px-24 pt-[40px] sm:pt-[100px] lg:pt-[140px] pb-[40px] relative overflow-hidden">

                {/* corner decoration */}
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />

                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* Left Content */}
                        <div className="w-full max-w-[620px] lg:pt-[50px] min-w-0">
                            <h2 className="text-3xl md:text-5xl lg:text-5xl font-spartan font-medium leading-tight mb-4">
                                Our{" "}
                                <span className="relative inline-block text-[#f39300] pb-4">
                                    Signature
                                    <img
                                        src={curvedLine}
                                        alt="curve"
                                        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[200px] md:w-[240px]"
                                    />
                                </span>{" "}
                                <span className="text-[#0f1c80]">
                                    Approach
                                </span>
                            </h2>


                            {/* Highlight line */}
                            <p className="text-[17px] text-[#0F1C80] leading-[28px] mb-6">
                                The Mashar Method: Where Insight Meets Impact
                            </p>

                            {/* Body */}
                            <p className="text-[16px] leading-[28px] text-gray-800 mb-6">
                                Transformation at Mashar is personal, purposeful, and deeply human.
                                We blend global standards with cultural intelligence to create learning
                                experiences that truly last.
                            </p>

                            {/* CTA */}
                            <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
                                <ArrowButton
                                    text="Explore Our Signature Experience"
                                    textSize="14px"
                                    onClick={() => {
                                        navigate("/explorePrograms");
                                        window.scrollTo(0, 0);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="w-full flex justify-center lg:justify-end min-w-0 h-full">
                            <div className="relative w-full max-w-[560px] aspect-[560/520] rounded-[28px] overflow-hidden">
                                <img
                                    src={teamMashar}
                                    alt="Our Signature Approach"
                                    className="w-full h-full object-cover"
                                />

                                {/* Decorative accent */}
                                <img
                                    src={squareAnimation}
                                    alt=""
                                    className="absolute -top-6 -left-6 w-20 h-20 rotate-45 opacity-40 pointer-events-none"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/*                <div className="relative">*/}
            {/*            {" "}*/}
            {/*            <img*/}
            {/*                src={CornorGroup}*/}
            {/*                alt="corner decoration"*/}
            {/*                className="absolute right-0 top-[700px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"*/}
            {/*            />*/}
            {/*            <section className="bg-white md:pb-[18px] px-4 sm:px-6 lg:px-[100px]  sm:pt-[100px] lg:pt-[140px] pb-[10px] overflow-x-hidden">*/}
            {/*                <div className="max-w-[1600px] mx-auto">*/}
            {/*                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-start">*/}
            {/*                        /!* Left Content *!/*/}
            {/*                        <div className="relative pt-8 sm:pt-12 w-full min-w-0">*/}
            {/*                            <div className="w-full max-w-[620px] min-w-0">*/}
            {/*                                <h2 className="text-3xl md:text-5xl lg:text-5xl font-spartan font-medium leading-tight mb-8">*/}
            {/*                                    Our <span className="text-[#f39300]">Signature</span>{" "}*/}
            {/*                                    <span className="relative inline-block text-[#0f1c80]">*/}
            {/*  Approach*/}
            {/*  <img*/}
            {/*      src={curvedLine}*/}
            {/*      alt="curve"*/}
            {/*      className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[240px]"*/}
            {/*  />*/}
            {/*</span>*/}
            {/*                                </h2>*/}
            {/*                            </div>*/}

            {/*                            /!* Highlight line *!/*/}
            {/*                            <p className="font-poppins font-medium text-[clamp(0.875rem,1.8vw,1.125rem)] leading-[1.6] tracking-[0.5px] text-[#0f1c80] pb-[10px] max-w-[600px]">*/}
            {/*                                The Mashar Method: Where Insight Meets Impact*/}
            {/*                            </p>*/}

            {/*                            /!* Body copy *!/*/}
            {/*                            <p className="text-[clamp(0.875rem,1.6vw,1rem)] leading-[1.8] text-gray-800 mb-6 max-w-[600px]">*/}
            {/*                                Transformation at Mashar is Personal, purposeful, and deeply human. We blend global standards with cultural intelligence to create learning experiences that truly lasts.*/}
            {/*                            </p>*/}

            {/*                            /!* CTA *!/*/}
            {/*                            <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">*/}
            {/*                                <ArrowButton*/}
            {/*                                    text="Explore Our Signature Experiance"*/}
            {/*                                    textSize="clamp(0.75rem, 1.5vw, 1rem)"*/}
            {/*                                    className="!px-6 sm:!px-8 lg:!px-10 !py-3 sm:!py-4"*/}
            {/*                                    onClick={() => (window.location.href = "/explorePrograms")}*/}
            {/*                                />*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        /!* Right Image *!/*/}
            {/*                        <div className="flex mt-5 lg:mt-0 justify-center lg:justify-end w-full min-w-0">*/}
            {/*                            <div className="relative w-full max-w-[90vw] lg:max-w-[560px] aspect-[560/520] rounded-[20px] sm:rounded-[28px] overflow-hidden">*/}
            {/*                                <img*/}
            {/*                                    src={teamMashar}*/}
            {/*                                    alt="Our Signature Approach"*/}
            {/*                                    className="w-full h-full object-cover"*/}
            {/*                                />*/}

            {/*                                /!* Decorative accent *!/*/}
            {/*                                <img*/}
            {/*                                    src={squareAnimation}*/}
            {/*                                    alt=""*/}
            {/*                                    className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 md:-top-10 md:-left-10 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 rotate-45 opacity-40 pointer-events-none"*/}
            {/*                                />*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </section>*/}
            {/*        </div>*/}
            {/* our method */}
            <section id="method" className="px-6 md:px-12 md:py-[70px] py-16 bg-white flex flex-col md:flex-row items-center gap-24 mx-auto max-w-7xl">
                {/* LEFT: Images */}
                <div className="relative  flex justify-start z-20">
                    <img
                        src={frame2297_3}
                        alt="Team Collaboration"
                        className="rounded-xl w-[300px] md:w-[480px] "
                    />
                    {/* Right: Animation (absolutely positioned) */}
                    <div className="hidden md:block absolute -right-[120%] top-96 -mt-16 lg:-mt-24 opacity-65">
                        <img
                            src={squareAnimation}
                            alt="Goals Animation"
                            className="w-40 h-40 object-contain rotate-45"
                        />
                    </div>
                </div>

                {/* RIGHT: Text Content */}
                <div className="md:w-1/2 text-center relative md:text-left z-10">
                    {/* Background Rings (Top Left) */}
                    <div className="absolute  top-5  left-0 z-0  pointer-events-none">
                        <div
                            className="absolute rounded-full"
                            style={{
                                position: "absolute",
                                width: "138.76px",
                                height: "136.43px",
                                top: " -101.51px",
                                left: " -96.76px",
                                opacity: 0.04,
                                borderWidth: "11px",
                                borderStyle: "solid",
                                borderColor: "#f39300",
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
                                top: "-124px",
                                left: "-169px",
                                transform: "rotate(-233.73deg)",
                                opacity: 0.04,
                                borderWidth: "11px",
                                borderStyle: "solid",
                                borderColor: "#f39300",
                                borderRadius: "100px",
                                boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                            }}
                        ></div>
                    </div>
                    <h2 className="text-3xl md:text-[46px] font-medium mb-8 leading-tight font-spartan relative inline-block">
                        Why <span className="text-primary">Our Method</span>
                        <br />
                        <span className="text-secondary relative inline-block">
                            Stand Apart
                            {/* Curved underline */}
                            <img
                                src={curvedLine}
                                alt="curve"
                                className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-[140px] md:w-[180px] lg:w-[220px]"
                            />
                        </span>
                    </h2>

                    <p className="font-poppins text-[14px] mb-6">
                        Mashar’s methodology isn’t one-size-fits-all — it’s a living
                        framework, scientifically grounded, culturally adaptable, and
                        emotionally intelligent.
                        <br />
                        <br /> Whether we’re working with C-suite leaders, high-potential
                        teams, or major change initiatives, our approach is:
                    </p>

                    <ul className="text-left">
                        <li className="flex  items-start gap-3">
                            {/* Icon */}
                            <span>
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
                            {/* Text Block */}
                            <p className="font-poppins text-[16px]">Globally Validated</p>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="">
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
                            <p className="   font-poppins text-[16px] ">Locally Relevant</p>
                        </li>

                        <li className="flex  items-start gap-3">
                            <span className="">
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
                            <p className="font-poppins text-[16px]  ">
                                Deeply Human-Centered
                            </p>
                        </li>
                    </ul>

                    <p className="font-poppins text-[14px] mt-6">
                        We don’t just facilitate learning we transform mindsets, enhance capability, and activate potential.
                    </p>

                    {/*<div className="relative inline-flex items-center ml-12 mt-10">*/}
                    {/*    <ArrowButton text="START YOUR GROWTH" textSize="16px" />{" "}*/}
                    {/*</div>*/}
                </div>
            </section>
            {/*  how we work */}
            <section id="how" className="px-6 md:px-16 lg:px-24 py-12 mx-auto max-w-7xl">
                {/* Title */}
                <div className="text-left mb-4 font-spartan">
                    <h2 className="text-3xl md:text-[46px] font-medium mb-8 leading-tight font-spartan relative inline-block">
                        How We{" "}
                        <span className="text-[#f39300] relative inline-block">
                            Work
                            <svg
                                className="absolute left-[-42px] bottom-[-20px] w-[calc(100%+54px)] h-[20px] overflow-visible"
                                viewBox="0 0 250 60"
                                preserveAspectRatio="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient
                                        id="curveGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop offset="54.8%" stopColor="#000000" />
                                        <stop offset="54.81%" stopColor="#0038F0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,50 Q125,0 250,50"
                                    stroke="url(#curveGradient)"
                                    strokeWidth="15"
                                    fill="transparent"
                                    strokeLinecap="round"
                                />
                            </svg>{" "}
                        </span>
                    </h2>
                </div>

                {/* Description */}
                <p className="max-w-lg font-poppins font-normal text-[16px] leading-[30px] tracking-[0.5px] text-left mb-12">
                    At Mashar, insight becomes action. Our approach blends ICF coaching
                    competencies, neuroscience, and adult learning theory to turn
                    development into real results. Every journey is tailored because no
                    two growth paths are the same.
                </p>

                <p className="font-poppins font-medium text-[14px] leading-[24px] tracking-[0.5px] text-[#0f1c80] mb-8 max-w-[520px]">This is how meaningful growth begins and how it lasts.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* Left Cards */}
                    <div className="space-y-5 tracking-wide">
                        {/* Card 1 */}
                        <div className="relative rounded-lg shadow-md px-6 py-8 flex gap-4 items-center border-l-4 border-primary cursor-pointer transition-all duration-700 ease-in-out transform  hover:border-secondary hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0px_18px_50px_rgba(0,0,0,0.14)] hover:bg-[linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)] will-change-transform">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(269.6deg,#FFFFFF_0.35%,rgba(70,86,206,0.3)_99.65%)]">
                            </div>

                            {/* Content */}
                            <div className="relative flex gap-4 items-center group cursor-pointer">
                                <div className="bg-[#E2E2E5] rounded-full p-3">
                                    <img src={solarCupStar} alt="ICF" className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="group-hover:text-[#f39000] font-medium text-[#0F1C80] font-poppins text-[14px] mb-1 transition-colors duration-300  group-hover:font-normal">
                                        ICF Core Competencies
                                    </h4>
                                    <p className="text-[14px] font-poppins">
                                        Professional coaching standards
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative rounded-lg shadow-md px-6 py-8 flex gap-4 items-center border-l-4 border-primary cursor-pointer transition-all duration-700 ease-in-out transform  hover:border-secondary hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0px_18px_50px_rgba(0,0,0,0.14)] hover:bg-[linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)] will-change-transform">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(269.6deg,#FFFFFF_0.35%,rgba(70,86,206,0.3)_99.65%)]"></div>

                            {/* Content */}
                            <div className="relative flex gap-4 items-center group cursor-pointer">
                                <div className="bg-[#E2E2E5] rounded-full p-3">
                                    <img src={lucideDna} alt="Neuroscience" className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="group-hover:text-[#f39000] font-medium text-[#0F1C80] font-poppins text-[14px] mb-1 transition-colors duration-300  group-hover:font-normal">
                                        NeuroScience
                                    </h4>
                                    <p className="text-[14px] font-poppins">
                                        Brain based learning principles
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative rounded-lg shadow-md px-6 py-8 flex gap-4 items-center border-l-4 border-primary cursor-pointer transition-all duration-700 ease-in-out transform  hover:border-secondary hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0px_18px_50px_rgba(0,0,0,0.14)] hover:bg-[linear-gradient(279.6deg,#FFFFFF_0.39%,rgba(15,28,128,0.15)_99.69%)] will-change-transform">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(269.6deg,#FFFFFF_0.35%,rgba(70,86,206,0.3)_99.65%)]"></div>

                            {/* Content */}
                            <div className="relative flex gap-4 items-center group cursor-pointer">
                                <div className="bg-[#E2E2E5] rounded-full p-3">
                                    <img
                                        src={solarCupStar1}
                                        alt="Adult Learning"
                                        className="w-8 h-8"
                                    />
                                </div>
                                <div>
                                    <h4 className="group-hover:text-[#f39000] font-medium text-[#0F1C80] font-poppins text-[14px] mb-1 transition-colors duration-300  group-hover:font-normal">
                                        Adult Learning Theory
                                    </h4>
                                    <p className="text-[14px] font-poppins">
                                        Evidence based education methods
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Floating Circles */}
                    <div className="relative w-full h-[400px]">
                        <div className="absolute  top-5  left-0 z-0  pointer-events-none">
                            <div
                                className="absolute rounded-full"
                                style={{
                                    position: "absolute",
                                    width: "130.76px",
                                    height: "130.43px",
                                    top: " -199.51px",
                                    left: "49.24px",
                                    opacity: 0.04,
                                    borderWidth: "11px",
                                    borderStyle: "solid",
                                    borderColor: "#f39300",
                                    borderRadius: "100px",
                                    boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                                }}
                            ></div>

                            <div
                                className="absolute rounded-full"
                                style={{
                                    position: "absolute",
                                    width: "162.73px",
                                    height: "119.57px",
                                    top: "-223px",
                                    left: "-21px",
                                    transform: "rotate(-233.73deg)",
                                    opacity: 0.04,
                                    borderWidth: "11px",
                                    borderStyle: "solid",
                                    borderColor: "#f39300",
                                    borderRadius: "100px",
                                    boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                                }}
                            ></div>
                        </div>

                        {/*<div className="absolute right-16 -top-16 -mt-16 lg:-mt-24 opacity-65">*/}
                        {/*    <img*/}
                        {/*        src={squareAnimation}*/}
                        {/*        alt="Goals Animation"*/}
                        {/*        className="w-36 h-36 object-contain rotate-45"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/* Circle 1 */}
                        <div className="absolute top-0 left-28 flex flex-col items-center border-conic-b">
                            <div className="bg-[#0F1C80] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-md animate-float-fast">
                                <img src={sigicon} alt="icon" className="w-6 h-6" />
                            </div>
                        </div>
                        {/* Circle 2 */}
                        <div className="absolute top-10 right-12 flex flex-col items-center border-conic-b">
                            <div className="bg-[#F39500] text-white w-20 h-20 flex items-center justify-center rounded-full shadow-md animate-float">
                                <img src={trophyBlue} alt="icon" className="w-8 h-8" />
                            </div>
                        </div>
                        {/* Circle 3 */}
                        <div className="absolute top-28 left-40 flex flex-col items-center border-conic-b">
                            <div className="bg-[#0F1C80] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-md animate-float">
                                <img src={lucideDna} alt="icon" className="w-6 h-6" />
                            </div>
                        </div>
                        {/* Circle 4 */}
                        <div className="absolute top-28 left-10 flex flex-col items-center border-conic-b">
                            <div className="bg-[#F39500] text-white w-20 h-20 flex items-center justify-center rounded-full shadow-md animate-float">
                                <img src={trophyBlue} alt="icon" className="w-8 h-8" />
                            </div>
                        </div>
                        {/* Circle 5 */}
                        <div className="absolute top-64 left-12 flex flex-col items-center border-conic-b">
                            <div className="bg-[#0F1C80] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-md animate-float-fast">
                                <img src={lucideDna} alt="icon" className="w-6 h-6" />
                            </div>
                        </div>
                        {/* Circle 6 */}
                        <div className="absolute bottom-16 right-32 flex flex-col items-center border-conic-b">
                            <div className="bg-[#0F1C80] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-md animate-float-slow">
                                <img src={lucideDna} alt="icon" className="w-6 h-6" />
                            </div>
                        </div>
                        {/* Circle 7 */}
                        <div className="absolute bottom-36 left-60 flex flex-col items-center border-conic-b">
                            <div className="bg-[#F39500] text-white w-20 h-20 flex items-center justify-center rounded-full shadow-md animate-float-fast">
                                <img src={trophyBlue} alt="icon" className="w-8 h-8" />
                            </div>
                        </div>
                        {/* Circle 8 */}
                        <div className="absolute bottom-36 right-10 flex flex-col items-center border-conic-b">
                            <div className="bg-[#0F1C80] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-md animate-float-slow">
                                <img src={sigicon} alt="icon" className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* growth path */}
            <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 py-12 sm:py-16 mb-12 sm:mb-20 lg:mb-28">
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="hidden md:block absolute right-[-256px] top-[-80px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />

                {/* Heading Wrapper */}
                <div className="relative flex justify-center items-center mb-2 sm:mb-4 text-center">

                    {/* Decorative GIF – desktop only */}
                    <img
                        src={netwotkgif}
                        alt=""
                        className="hidden lg:block w-[120px] m-l[150px] lg:left-[110px] absolute left-0 top-1/2 -translate-y-1/2 opacity-70"
                    />

                    <h2 className="text-3xl md:text-[46px] font-medium font-spartan mb-6 leading-tight text-center">
                        <span className="relative inline-block">
                            Our{" "}
                            <span className="text-primary">5-Step</span>{" "}
                            <span className="text-secondary">Growth Plan</span>

                            <img
                                src={CurvedLine}
                                alt="curve"
                                className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-[229px] h-[12px] opacity-100"
                            />
                        </span>
                    </h2>
                    {/* Background Rings – desktop only */}
                    <div className="hidden lg:block absolute right-0 top-[270px] -translate-y-1/2 pointer-events-none">
                        <img src={CircularGroupCenter} alt="" className="block w-[320px] xl:w-[360px] h-auto opacity-90" />
                    </div>

                </div>
                <div className="flex justify-center">
                    <p className="text-sm sm:text-base font-poppins text-center  overflow-hidden text-ellipsis">
                        A systematic approach to transformation that ensures lasting change.
                    </p>
                </div>

                {/* Steps */}
                <div className="mt-6 sm:mt-10">
                    <StepsNew />
                </div>
            </div>
            {/* img */}
            <section className="relative h-[450px] flex flex-col justify-center items-center text-white text-center p-8">
                <div
                    className="absolute inset-0 bg-cover"
                    style={{
                        backgroundImage: `url(${OurSignMiddle})`,
                        backgroundPosition: "50% 20%",
                    }}
                />



            </section>
            {/* tools unlock */}
            <section id="tools" className="relative py-16 sm:py-20 px-4 sm:px-8 lg:px-24">
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="hidden md:block absolute right-0 top-[800px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    {/* Heading */}
                    <div className="relative flex flex-col items-center mb-10 sm:mb-14">
                        {/* Lock – desktop only */}
                        <img
                            src={lockGif}
                            alt=""
                            className="hidden lg:block absolute -left-32 top-1/2 -translate-y-1/2 w-20 opacity-80"
                        />

                        <h2 className="text-2xl sm:text-3xl lg:text-[46px] font-medium font-spartan leading-tight">
                            Tools that Unlock{" "}
                            <span className="text-secondary relative inline-block">
                                Insight
                            </span>
                        </h2>

                        {/* SVG underline (auto-scaling) */}
                        <svg
                            className="mt-4 w-40 sm:w-56 lg:w-62"
                            height="23"
                            viewBox="0 0 250 60"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                {/* Rounded corner mask */}
                                <clipPath id="roundedClip">
                                    <rect x="0" y="0" width="250" height="60" rx="12" ry="12" />
                                </clipPath>

                                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="54.8%" stopColor="#000000" />
                                    <stop offset="54.81%" stopColor="#0f1c80" />
                                </linearGradient>
                            </defs>

                            <g clipPath="url(#roundedClip)">
                                <path
                                    d="M0,50 Q125,0 250,50"
                                    stroke="url(#curveGradient)"
                                    strokeWidth="15"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>

                    </div>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base font-poppins text-center mb-12 max-w-xl sm:whitespace-nowrap">
                        We diagnose before we design, using globally validated assessments
                    </p>



                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1200px] mx-auto">
                        {/* GEDI Card */}
                        <div className="group bg-[#F1F1F1] w-full max-w-[572px] h-auto md:h-[395px] rounded-[12px] shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_18px_40px_rgba(0,0,0,0.18)] mx-auto">
                            <div className="md:h-[55%] px-6 sm:px-8 py-8 sm:py-10 text-center bg-[#F1F1F1] group-hover:bg-[linear-gradient(135deg,#EEF1FF_0%,#FFFFFF_70%)] transition-all duration-300 flex flex-col justify-center items-center">
                                <img src={gediLogo} alt="GEDI Certified Partner" className="w-[120px] md:h-[115px] mt-[-20px] mb-[-15px] sm:w-[153px]  p-[10px] object-contain" />
                                <h3 className="font-poppins font-semibold text-[#0F1C80] text-[18px] sm:text-[22px] leading-snug transition-colors duration-300 group-hover:text-[#F39300]">
                                    Executive Team Engagement & Performance Diagnostic.
                                </h3>
                            </div>
                            <div className="md:h-[45%] bg-[#121F7A] px-6 sm:px-8 py-6 text-center flex items-center">
                                <p className="text-white font-poppins text-[14px] sm:text-[15px] leading-relaxed w-full">
                                    A 20 minute tool revealing how executive teams engage, lead, and perform.
                                    <br /> See what’s helping or hindering your leadership team.
                                </p>
                            </div>
                        </div>

                        <div className="group bg-[#F1F1F1] w-full max-w-[572px] h-auto md:h-[395px] rounded-[12px] shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_18px_40px_rgba(0,0,0,0.18)] mx-auto">
                            <div className="md:h-[55%] px-6 sm:px-8 py-8 sm:py-10 text-center bg-[#F1F1F1] group-hover:bg-[linear-gradient(135deg,#EEF1FF_0%,#FFFFFF_70%)] transition-all duration-300 flex flex-col justify-center items-center">
                                <img src={tawdiLogo} alt="TAWDI Certified Partner" className="w-[120px] sm:w-[153px] h-auto p-[10px] mb-[10px] object-contain" />
                                <h3 className="font-poppins font-semibold text-[#0F1C80] text-[18px] sm:text-[22px] leading-snug transition-colors duration-300 group-hover:text-[#F39300]">
                                    Team Thinking, Communication & <br /> Collaboration Diagnostic.
                                </h3>
                            </div>
                            <div className="md:h-[45%] bg-[#121F7A] px-6 sm:px-8 py-6 text-center flex items-center">
                                <p className="text-white font-poppins text-[14px] sm:text-[15px] leading-relaxed w-full">
                                    A 10 minute tool mapping team patterns, communication, collaboration & strengths.
                                    <br /> Because knowing how your team thinks is the first step to changing how it works.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-center lg:pt-[50px] mt-[18px]">
                        <ArrowButton
                            text="Explore Our Assessment Tools"
                            textSize="16px"
                            onClick={() => {
                                navigate("/explorePrograms");
                                window.scrollTo(0, 0);
                            }}
                        />

                    </div>
                </div>
            </section>
            {/* Philosophy */}
            <section id="philosophy" className="w-full py-16 px-6 md:px-16 text-center relative">
                {/* Background Rings (Top Left) */}
                <div className="absolute  top-5  left-0 z-0  pointer-events-none">
                    <div
                        className="absolute rounded-full"
                        style={{
                            position: "absolute",
                            width: "124.76px",
                            height: "121.43px",
                            top: "87.49px",
                            left: "155.24px",
                            opacity: 0.05,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "#f39300",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    ></div>

                    <div
                        className="absolute rounded-full"
                        style={{
                            position: "absolute",
                            width: "155.73px",
                            height: "113.57px",
                            top: "63px",
                            left: "87px",
                            transform: "rotate(-233.73deg)",
                            opacity: 0.05,
                            borderWidth: "11px",
                            borderStyle: "solid",
                            borderColor: "#f39300",
                            borderRadius: "100px",
                            boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",
                        }}
                    ></div>
                </div>
                {/* Heading */}
                {/*      <h2 className="text-3xl md:text-[46px] font-medium font-spartan mb-12">*/}
                {/*          Our Learning{" "}*/}
                {/*          <span className="text-[#f39300] relative">*/}
                {/*  Philosophy{" "}*/}
                {/*              <img*/}
                {/*                  src={curvedLine}*/}
                {/*                  alt="curve"*/}
                {/*                  className="absolute mt-2 left-1/2 -translate-x-1/2 -bottom-4 w-[140px] md:w-[180px] lg:w-[220px]"*/}
                {/*              />*/}
                {/*              {" "}*/}
                {/*</span>*/}
                {/*      </h2>*/}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-medium font-spartan mb-10 leading-tight text-center">
                    <span className="relative inline-block">
                        Our Learning{" "}
                        <span className="text-secondary">Philosophy</span>

                        <img
                            src={CurvedLine}
                            alt="curve"
                            className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
                        />
                    </span>
                </h2>
                <p className="max-w-6xl mx-auto text-center font-poppins text-[16px] leading-[30px] text-[#1A1A1A] mb-20">
                    We don’t just develop skills. We shape the inner life of leaders. Leadership begins from within, and real learning goes beyond the course.
                    <br />
                    <span>
                        Our model ignites a journey of <span className="font-semibold">discovery, mastery, and lasting behavioral change.</span>
                    </span>
                </p>


                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Card 1 */}
                    <div className="rounded-xl px-4 py-16 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg bg-[#EFEFEF] font-poppins text-center group hover:bg-white">
                        <h3 className="font-semibold text-[20px] mb-3 text-primary group-hover:text-secondary">
                            Self Awareness
                        </h3>
                        <p className="text-[17px] tracking-wide">
                            Lead authentically by knowing your values.
                        </p>
                    </div>

                    {/* Card 2 (gray background) */}
                    <div className="rounded-xl shadow-md px-4  py-16  transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg bg-[#EFEFEF] font-poppins text-center group">
                        <h3 className="font-semibold text-[20px] mb-3  text-primary group-hover:text-secondary">
                            Cultural Intelligence
                        </h3>
                        <p className="text-[17px] tracking-wide ">
                            Honor context and embrace diversity
                        </p>
                    </div>

                    {/* Card 3 (gray background) */}
                    <div className="rounded-xl px-4 py-16 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg bg-[#EFEFEF] font-poppins text-center group hover:bg-white">
                        <h3 className="font-semibold text-[20px] mb-3   text-primary group-hover:text-secondary ">
                            Experiential Learning
                        </h3>
                        <p className="text-[17px] tracking-wide ">
                            60% structured learning <br />40% applied practice.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="rounded-xl shadow-md px-4  py-16  transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg bg-[#EFEFEF] font-poppins text-center group">
                        <h3 className="font-semibold text-[20px] mb-3  text-primary group-hover:text-secondary">
                            Purpose & Integrity
                        </h3>
                        <p className="text-[17px] tracking-wide ">
                            Lead with joy, serve with ethics.
                        </p>
                    </div>
                </div>
            </section>
            <section className="relative md:mt-[140px] md:mb-[140px]  text-center flex flex-col items-center">
                <img
                    src={CornorGroup}
                    alt="corner decoration"
                    className="absolute right-0 top-[300px] -translate-y-1/2 w-[80px] h-[200px] pointer-events-none z-0"
                />
                {/* Heading */}

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-medium font-spartan mb-10 leading-tight text-center">
                    <span className="relative inline-block">
                        Curious About <span className="text-secondary">the Mashar Way?</span>
                        <img src={CurvedLine} alt="curve" className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100" />
                    </span>
                </h2>


                {/* Subtitle */}
                <p className="max-w-6xl mx-auto text-center font-poppins text-[16px] leading-[30px] text-[#1A1A1A] mb-[18px]">
                    Let’s co-create a path that inspires the best version of you
                    professionally and personally.
                </p>

                {/* Button */}
                <div className="flex justify-center">
                    <ArrowButton text="Start Your Growth" textSize="16px"
                        onClick={() => {
                            navigate("/explorePrograms");
                            window.scrollTo(0, 0);
                        }}

                    />
                </div>
            </section>
            ;{/* signature programs */}
            <section id="programs" className="px-6 md:px-12 py-16 relative bg-white flex flex-col md:flex-row items-center gap-8 mx-auto max-w-7xl">
                {/* Circle + Square Animation together */}
                <div className="absolute top-0 -left-20 z-0 pointer-events-none">
                    <div className="relative w-[166px] h-[166px]">
                        {/* Orange Circle */}
                        {/*<div*/}
                        {/*    className="absolute inset-0 rounded-full"*/}
                        {/*    style={{*/}
                        {/*        opacity: 0.2,*/}
                        {/*        borderWidth: "11px",*/}
                        {/*        borderStyle: "solid",*/}
                        {/*        borderColor: "#f39300",*/}
                        {/*        borderRadius: "100px",*/}
                        {/*        boxShadow: "0px 4px 16px 0px rgb(43, 52, 118)",*/}
                        {/*    }}*/}
                        {/*></div>*/}

                        {/* Square Animation centered inside */}
                        {/*<img*/}
                        {/*    src={squareAnimation}*/}
                        {/*    alt="Goals Animation"*/}
                        {/*    className="absolute top-1/2 left-1/2 w-36 h-36 -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-60"*/}
                        {/*/>*/}
                    </div>
                </div>

                {/* LEFT: Images */}
                <div className="relative flex justify-start">
                    <img
                        src={ourSignProgramm}
                        alt="Team Collaboration"
                        className="w-[220px] sm:w-[300px] md:w-[520px] max-h-[380px] sm:max-h-[550px] object-cover mb-4 rounded-[24px]"

                    />
                </div>

                {/* RIGHT: Text Content */}
                <div className="md:w-1/2 text-center md:text-left relative">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-medium font-spartan mb-10 leading-tight text-center">
                        <span className="relative inline-block">
                            Our Signature <span className="text-secondary">Programs</span>
                            <img src={CurvedLine} alt="curve" className="absolute left-[185px] -translate-x-1/2 -bottom-6 w-[139px] h-[15px] opacity-100" />
                        </span>
                    </h2>
                    <p className="mt-8 mb-1 max-w-2xl text-[15px] md:text-[16px] font-poppins text-gray-700">Our Signature programs bring our methodology and philosophy to life delivering customized, measurable, and high impact experiences.
                    </p>
                    <ul className="text-left leading-[52px]">
                        <li className="flex items-start gap-6">
                            {/* Icon */}
                            <span className=" text-[#0f1c80]">
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
                            {/* Text Block */}
                            <p className="font-poppins text-[16px]">
                                An Authentic Leadership Journey
                            </p>
                        </li>

                        <li className="flex items-start gap-6">
                            <span className=" text-[#0f1c80]">
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
                            <p className="   font-poppins text-[16px]">
                                Leading Through Teams
                            </p>
                        </li>

                        <li className="flex  items-start gap-6">
                            <span className="  text-[#0f1c80] ">
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
                            <p className="   font-poppins text-[16px]">Coach with Impact</p>
                        </li>

                        <li className="flex  items-start gap-6">
                            <span className="  text-[#0f1c80]">
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
                            <p className="   font-poppins text-[16px] ">
                                {" "}
                                360° Culture Reset
                            </p>
                        </li>

                        <li className="flex  items-start gap-6">
                            <span className="  text-[#0f1c80]">
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
                            <p className="   font-poppins text-[16px]">
                                {" "}
                                Cultural Intelligence for Impact
                            </p>
                        </li>
                    </ul>
                    {/* Right: Animation (absolutely positioned) */}
                    <div className="absolute -right-1 top-[125px] opacity-65">
                        <img
                            src={squareAnimation}
                            alt="Goals Animation"
                            className="w-36 h-36 object-contain rotate-45"
                        />
                    </div>
                    <p className="mt-6 mb-10 max-w-2xl text-[15px] md:text-[16px] font-poppins text-gray-700">These aren’t off-the-shelf topics. They’re signature experiences, uniquely crafted to catalyze real change.
                    </p>
                </div>
            </section>
            {/* lets design*/}
            <div className="md:mt-[140px] md:mb-[140px] mb-10 font-spartan relative flex bg-white justify-center items-center text-center  overflow-hidden">
                <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-medium font-spartan mb-10 leading-tight text-center">
                        <span className="relative inline-block">
                            Let’s Design {" "}
                            <span className="text-primary">The Transformation </span>{" "}
                            <span className="text-secondary"> You Need</span>

                            <img
                                src={CurvedLine}
                                alt="curve"
                                className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[229px] h-[12px] opacity-100"
                            />
                        </span>
                    </h2>

                    {/* Subheading */}
                    <p
                        className="max-w-6xl mx-auto text-center font-poppins text-[16px] leading-[30px] text-[#1A1A1A] mb-[18px]"
                    >
                        Whether you’re equipping leaders, building teams, or reshaping
                        culture we’ll create a path that’s tailored, measurable, and
                        aligned with your suggests.
                    </p>

                    {/* Primary CTA for Transformation */}
                    <div className="mb-10 mt-2">
                        <ArrowButton
                            text="Book a Discovery Call"
                            className="!px-8 !py-3.5 text-[14px] sm:text-[15px]"
                            onClick={openCalendly}
                        />
                    </div>

                    {/* Dual Track Cards: The 2 Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full text-left items-stretch">
                        {/* Section 1: Coaching & Mentoring Network */}
                        <div className="bg-[#f9fafb] hover:bg-white border border-gray-100 hover:border-[#f39300]/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 group h-full">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f39300]/10 text-[#d97f00] text-[11px] sm:text-[12px] font-semibold mb-4">
                                    <span>Coaches &amp; Mentors</span>
                                </div>
                                <div className="min-h-[64px] flex items-start">
                                    <h3 className="text-xl sm:text-2xl font-bold font-spartan text-[#1e2554] mb-3 leading-snug">
                                        Join the Mashar Coaching &amp; Mentoring Network
                                    </h3>
                                </div>
                                <p className="font-poppins text-gray-600 text-[13.5px] sm:text-[14px] leading-relaxed mb-6 min-h-[72px]">
                                    We welcome professional coaches and mentors who would like to bring their expertise to Mashar’s programs and client engagements.
                                </p>
                            </div>
                            <div className="pt-2">
                                <ArrowButton
                                    text="Join Our Network"
                                    variant="orange"
                                    className="!px-5 !py-2.5 sm:!px-6 sm:!py-3 !text-[13.5px] sm:!text-[15px]"
                                    onClick={() => {
                                        navigate("/join-our-team");
                                        window.scrollTo(0, 0);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Section 2: Partner With Mashar */}
                        <div className="bg-[#f9fafb] hover:bg-white border border-gray-100 hover:border-[#0f1c80]/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 group h-full">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f1c80]/10 text-[#0f1c80] text-[11px] sm:text-[12px] font-semibold mb-4">
                                    <span>Partners &amp; Organizations</span>
                                </div>
                                <div className="min-h-[64px] flex items-start">
                                    <h3 className="text-xl sm:text-2xl font-bold font-spartan text-[#1e2554] mb-3 leading-snug">
                                        Partner With Mashar
                                    </h3>
                                </div>
                                <p className="font-poppins text-gray-600 text-[13.5px] sm:text-[14px] leading-relaxed mb-6 min-h-[72px]">
                                    We welcome professionals and organizations in coaching, mentoring, and leadership development to explore how we can bring Mashar’s programs to new markets together.
                                </p>
                            </div>
                            <div className="pt-2">
                                <ArrowButton
                                    text="Become a Partner"
                                    variant="outline"
                                    className="!px-5 !py-2.5 sm:!px-6 sm:!py-3 !text-[13.5px] sm:!text-[15px]"
                                    onClick={() => {
                                        navigate("/become-partner");
                                        window.scrollTo(0, 0);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
