import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import Announcements from "./Announcements";
import Spotlight from "./Spotlight";
import Notifications from "./Notifications";
import EventsCalendar from "./EventsCalendar";
import LatestResources from "./LatestResources";
import RecentDiscussions from "./RecentDiscussions.jsx";

export default function AlumniDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .alumni-dashboard { font-family: 'DM Sans', sans-serif; }
      `}</style>
      <div className="alumni-dashboard space-y-5">
        {/* ── HERO ── */}
        <HeroSection />

        {/* ── WELCOME STRIP ── */}
        <section
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #DDE0FF",
            padding: "22px 26px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(15,28,128,.05)",
          }}
        >
          <div className="card-side-gradient" />
          {/* decorative quote mark */}
          <div
            style={{
              position: "absolute",
              right: 20,
              top: -10,
              fontSize: 110,
              lineHeight: 1,
              color: "#EEF0FF",
              fontFamily: "'Sora', serif",
              userSelect: "none",
              pointerEvents: "none",
              fontWeight: 900,
            }}
          >
            "
          </div>
          {/* decorative ring */}
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -30,
              width: 130,
              height: 130,
              borderRadius: "50%",
              border: "2px solid rgba(243,137,0,.08)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#EEF0FF",
                border: "1px solid #DDE0FF",
                borderRadius: 20,
                padding: "3px 12px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#0F1C80",
                }}
              />
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: "#0F1C80",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                Your Lifelong Coaching Home
              </span>
            </div>
            <p
              style={{
                fontSize: "clamp(14px, 2vw, 16px)",
                fontWeight: 700,
                color: "#0D1240",
                lineHeight: 1.55,
                margin: "0 0 10px",
              }}
            >
              Welcome to Mashar Alumni Network
              <br />
              The region's most vibrant community of certified coaches, mentors, and professionals.
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Whether you're looking to collaborate, ask a question, explore opportunities, or give back: This is your space.
              <br /><br />
              <span style={{ fontStyle: "italic", fontWeight: 600 }}>“The Mashar Alumni Community is shaped by how its members show up for others.”</span>
            </p>
          </div>
        </section>
        <RecentDiscussions />
        <EventsCalendar />

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-5">

            <Spotlight />
            <LatestResources
              onNavigate={(tab) => navigate(`/alumni/resources?tab=${tab}`)}
            />
          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="space-y-5">
            <Notifications />
          </div>
        </div>
      </div>
    </>
  );
}
