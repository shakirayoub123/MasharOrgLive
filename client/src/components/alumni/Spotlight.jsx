import { useState, useEffect } from "react";
import { Header } from "./CardHeader";
import axios from "axios";

export default function Spotlight() {
  const [spotlights, setSpotlights] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotlights = async () => {
      try {
        const res = await axios.get("/api/v1/spotlights");
        const active = (res.data.spotlights || []).filter((s) => s.active);
        setSpotlights(active);
      } catch {
        // silently fail — keep empty state
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlights();
  }, []);

  // Auto-rotate every 6 seconds if multiple spotlights
  useEffect(() => {
    if (spotlights.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % spotlights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [spotlights.length]);

  const s = spotlights[current];

  return (
    <div className="bg-white rounded-xl border p-6">
      <Header
        title="✨ Alumni Spotlight"
        desc="Celebrating the impact of our alumni community"
        link="See more"
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl p-5 animate-pulse">
          <div className="flex gap-3 items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-white/10 rounded-full" />
              <div className="h-2 w-40 bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-white/10 rounded-full" />
            <div className="h-2 bg-white/10 rounded-full w-4/5" />
            <div className="h-2 bg-white/10 rounded-full w-3/5" />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && spotlights.length === 0 && (
        <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl p-5 text-center">
          <p className="text-white/40 text-sm italic">No spotlights available yet.</p>
        </div>
      )}

      {/* Spotlight Card */}
      {!loading && s && (
        <div
          key={s._id}
          className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl p-5 text-white relative overflow-hidden"
          style={{ animation: "fadeSlide 0.4s ease" }}
        >
          <style>{`
                        @keyframes fadeSlide {
                            from { opacity: 0; transform: translateY(6px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>

          {/* Decorative star */}
          <div className="absolute right-3 -top-4 text-[80px] text-[#C9A84C]/10">★</div>

          <div className="flex gap-3 items-center mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-black shrink-0"
              style={{
                background: `linear-gradient(135deg, ${s.gradientFrom || "#C9A84C"}, ${s.gradientTo || "#2A6B7C"})`,
              }}
            >
              {s.initials}
            </div>
            <div>
              <p className="font-serif text-[#C9A84C]">{s.name}</p>
              <p className="text-xs text-white/50">
                {[s.role, s.location, s.batch].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <p className="text-sm italic text-white/80 leading-relaxed">"{s.quote}"</p>

          {/* Dot indicators — only show if multiple */}
          {spotlights.length > 1 && (
            <div className="flex gap-1.5 mt-4 justify-end">
              {spotlights.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current
                      ? "w-4 h-1.5 bg-[#C9A84C]"
                      : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}