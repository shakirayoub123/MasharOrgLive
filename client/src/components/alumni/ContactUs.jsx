import { useState, useEffect } from "react";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const NAVY = "#0F1C80";
const ORANGE = "#F38900";

// ─── TAB CONFIG ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "support", label: "Connect With Us", icon: "🛟" },
  { id: "request", label: "Get Support", icon: "📝" },
  { id: "team", label: "Team", icon: "👥" },
  { id: "faqs", label: "FAQs", icon: "❓" },
];

// ─── SUBJECT OPTIONS (for Send Us a Message) ──────────────────────────────────
const SUBJECT_OPTIONS = [
  "General Inquiry",
  "My Alumni Account",
  "Login & Password Support",
  "Profile Update Request",
  "Alumni Badge & Certification",
  "Events & Webinars",
  "Learning Resources",
  "Community & Networking",
  "Volunteer or Contribute",
  "Partnership Opportunity",
  "Technical Support",
  "Feedback & Suggestions",
  "Report an Issue",
  "Other",
];

// ─── TEAM DATA ────────────────────────────────────────────────────────────────
const TEAM = [
  { name: "Mashar Support", role: "General Enquiries", email: "team@mashar.org", avatar: "🛟", color: NAVY },
  { name: "Programs Team", role: "Learning & Development", email: "programs@mashar.com", avatar: "🎓", color: "#6B46C1" },
  { name: "Events Team", role: "Events & Sessions", email: "events@mashar.com", avatar: "📅", color: ORANGE },
  { name: "Admin Team", role: "Account & Access", email: "admin@mashar.com", avatar: "🔐", color: "#2D8A4E" },
];

// ─── FAQ DATA ─────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "How do I update my profile information?", a: "Navigate to 'My Profile' from the sidebar. Click on any field to edit it, then save your changes." },
  { q: "How can I register for an event?", a: "Go to the 'Events' section, choose the event type you're interested in, and click 'Request to Join'. The admin will contact you to schedule." },
  { q: "How do I access learning resources?", a: "Visit the 'Learning Center' from the sidebar to browse available programs, modules, and resources uploaded by the admin team." },
  { q: "Who can I contact for technical issues?", a: "Use the 'Get Support' tab on this page to describe your issue, or email team@mashar.org directly." },
  { q: "How do I request a badge?", a: "Click the 'My Badges' button at the bottom of the sidebar. Select a badge and click 'Request Badge'. Admin will review and approve your request." },
  { q: "Can I change my password?", a: "Yes — go to 'My Profile' and look for the password/security section to update your credentials." },
  { q: "How do I join the alumni directory?", a: "Your profile is automatically listed in the directory once your account is approved by the admin." },
  { q: "What are Peer Coaching Circles?", a: "Small group coaching sessions (4–6 alumni) facilitated by a peer. Request to join via the Events section." },
];

// ─── SUPPORT CHANNELS ─────────────────────────────────────────────────────────
const CHANNELS = [
  { label: "Email Support", desc: "Get a response within 24 hours", icon: "📧", value: "team@mashar.org", color: NAVY, bg: "#EEF0FF", border: "#DDE0FF" },
  { label: "WhatsApp", desc: "Quick replies during business hours", icon: "💬", value: "+1(613)261-3210", color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5" },
  { label: "Office Hours", desc: "Sunday – Thursday", icon: "🕐", value: "9:00 AM – 5:00 PM (GST)", color: ORANGE, bg: "#FFF4E0", border: "#FFE4B0" },
];

// ─── NAVY TOP BAR ─────────────────────────────────────────────────────────────
function NavyTopBar() {
  return <div style={{ height: 3, background: NAVY, width: "100%" }} />;
}

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ animation: "cardIn 0.3s ease both", animationDelay: `${index * 0.05}s` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
            style={{ background: "#EEF0FF", color: NAVY, fontWeight: 800 }}>
            {index + 1}
          </span>
          <span className="text-sm font-bold text-[#0D1240] leading-snug">{faq.q}</span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className="shrink-0 text-slate-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? 200 : 0, opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-4 pl-[3.75rem]">
          <p className="text-[13px] text-gray-500 leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPORT FORM ─────────────────────────────────────────────────────────────
function SupportForm({ onSubmitted }) {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: "", otherSubject: "", message: "" });
  const isOther = form.subject === "Other";

  async function handleSubmit(e) {
    e.preventDefault();
    const finalSubject = isOther ? form.otherSubject.trim() : form.subject;
    if (!finalSubject || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    try {
      await API.post("/alumni/contact/request", { subject: finalSubject, type: "general", details: form.message });
      toast.success("Your message has been sent! We'll get back to you soon.");
      setForm({ subject: "", otherSubject: "", message: "" });
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Subject *</label>
        <div className="relative">
          <select
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value, otherSubject: e.target.value === "Other" ? form.otherSubject : "" })}
            className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:border-[#F38900] transition-all cursor-pointer"
            style={{ "--tw-ring-color": `${ORANGE}33` }}
          >
            <option value="" disabled>Select a subject</option>
            {SUBJECT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {isOther && (
          <input
            value={form.otherSubject}
            onChange={e => setForm({ ...form, otherSubject: e.target.value })}
            placeholder="Please specify your subject"
            autoFocus
            className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-[#F38900] transition-all"
            style={{ "--tw-ring-color": `${ORANGE}33`, animation: "cardIn 0.2s ease both" }}
          />
        )}
      </div>
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Message *</label>
        <textarea
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          rows={5}
          placeholder="Share your question, request, or details here..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all resize-none"
        />
      </div>
      {/* CTA — orange */}
      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-black text-white transition-all duration-200 relative overflow-hidden"
        style={{
          background: sending ? `${ORANGE}88` : ORANGE,
          boxShadow: sending ? "none" : `0 6px 18px ${ORANGE}55`,
          cursor: sending ? "not-allowed" : "pointer",
        }}
      >
        {!sending && <span className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-white/20" />}
        {sending
          ? <><svg style={{ width: 14, height: 14, animation: "spin 0.85s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Sending…</>
          : <><span>📩</span>Send Message</>
        }
      </button>
    </form>
  );
}

// ─── REQUEST FORM ─────────────────────────────────────────────────────────────
function RequestForm({ onSubmitted }) {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ type: "general-enquiries", details: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.details.trim()) {
      toast.error("Please provide details for your request.");
      return;
    }
    setSending(true);
    try {
      await API.post("/alumni/contact/request", form);
      toast.success("Request submitted! Our team will review it shortly.");
      setForm({ type: "general-enquiries", details: "" });
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Request Type</label>
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none transition-all"
        >
          <option value="general-enquiries">General Enquiries</option>
          <option value="technical-support">Technical Support</option>
          <option value="account-access">Account & Access</option>
          <option value="events-sessions">Events & Alumni Sessions</option>
          <option value="programs-learning">Programs & Learning</option>
          <option value="feedback-suggestions">Feedback & Suggestions</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Details *</label>
        <textarea
          value={form.details}
          onChange={e => setForm({ ...form, details: e.target.value })}
          rows={5}
          placeholder="Please describe what you need in detail…"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all resize-none"
        />
      </div>
      {/* CTA — orange */}
      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-black text-white transition-all duration-200 relative overflow-hidden"
        style={{
          background: sending ? `${ORANGE}88` : ORANGE,
          boxShadow: sending ? "none" : `0 6px 18px ${ORANGE}55`,
          cursor: sending ? "not-allowed" : "pointer",
        }}
      >
        {!sending && <span className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-white/20" />}
        {sending
          ? <><svg style={{ width: 14, height: 14, animation: "spin 0.85s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Submitting…</>
          : <><span>📋</span>Submit</>
        }
      </button>
    </form>
  );
}

// ─── TYPE / STATUS LABELS ─────────────────────────────────────────────────────
const TYPE_LABELS = {
  "general-enquiries": "General Enquiries",
  "technical-support": "Technical Support",
  "account-access": "Account & Access",
  "events-sessions": "Events & Alumni Sessions",
  "programs-learning": "Programs & Learning",
  "feedback-suggestions": "Feedback & Suggestions",
  certificate: "Certificate Request", letter: "Recommendation Letter", transcript: "Transcript",
  access: "Access / Permissions", "data-update": "Profile Update", other: "Other",
  general: "General Enquiry", technical: "Technical Issue", account: "Account & Access",
  events: "Events & Sessions", programs: "Programs & Learning", feedback: "Feedback",
};
const STATUS_CFG = {
  pending: { label: "Pending", color: ORANGE, bg: "#FFF4E0", border: "#FFE4B0", icon: "⏳" },
  approved: { label: "Approved", color: "#2D8A4E", bg: "#F0FFF4", border: "#C6F6D5", icon: "✅" },
  rejected: { label: "Rejected", color: "#E53E3E", bg: "#FFF5F5", border: "#FED7D7", icon: "❌" },
};

// ─── MY REQUESTS LIST ─────────────────────────────────────────────────────────
function MyRequestsList({ requests }) {
  if (!requests.length) return (
    <div className="text-center py-8">
      <p className="text-sm text-gray-400">No requests submitted yet.</p>
    </div>
  );
  return (
    <div className="space-y-2 mt-5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Requests</p>
      {requests.map((req, i) => {
        const s = STATUS_CFG[req.status] || STATUS_CFG.pending;
        return (
          <div key={req._id} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3"
            style={{ animation: "cardIn 0.25s ease both", animationDelay: `${i * 0.04}s` }}>
            <span className="text-lg">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0D1240] truncate">
                {req.subject ? `${req.subject} ` : ""}
                <span className="text-xs font-normal text-gray-500">({TYPE_LABELS[req.type] || req.type})</span>
              </p>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{req.details}</p>
              {req.adminNote && (
                <p className="text-[11px] text-gray-500 mt-1 bg-slate-50 rounded-lg px-2 py-1 border border-slate-100">
                  💬 Admin: {req.adminNote}
                </p>
              )}
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0"
              style={{ color: s.color, background: s.bg, borderColor: s.border }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ContactUs() {
  const [activeTab, setActiveTab] = useState("support");
  const [myRequests, setMyRequests] = useState([]);

  function loadMyRequests() {
    API.get("/alumni/contact/my-requests")
      .then(r => setMyRequests(r.data.data || []))
      .catch(() => { });
  }

  useEffect(() => { loadMyRequests(); }, []);

  return (
    <>
      <style>{`
        .ctroot { min-height: 80vh; }
        @keyframes cardIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes panelIn { from{opacity:0;transform:translateX(6px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div className="ctroot w-full max-w-full overflow-x-hidden">

        {/* ── BANNER — left gradient border ──────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden mb-6"
          style={{
            border: `1px solid #DDE0FF`,
            borderLeft: `4px solid transparent`,
            backgroundImage: `linear-gradient(135deg, #EEF0FF 0%, #E5E8FF 55%, #FFF4E0 100%), linear-gradient(to bottom, ${NAVY}, ${ORANGE})`,
            backgroundOrigin: `border-box`,
            backgroundClip: `padding-box, border-box`,
          }}>
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border-2 border-[#0F1C80]/5 pointer-events-none" />
          <div className="absolute right-14 -bottom-8 w-28 h-28 rounded-full bg-[#F38900]/5 pointer-events-none" />

          <div className="relative px-7 py-6">
            <div className="inline-flex items-center gap-1.5 bg-[#0F1C80]/8 border border-[#0F1C80]/15 rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F1C80]" />
              <span className="text-[9px] font-black text-[#0F1C80] uppercase tracking-[1.2px]">Mashar Alumni Support</span>
            </div>
            <h1 className="font-black text-[#0D1240] text-2xl leading-tight mb-2">Contact Us 📬</h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              Have a question, need support, or want to make a request? We're here to help. <br /> Reach out through any of the channels below.
            </p>
          </div>
        </div>

        {/* ── TABS — orange active ────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: "none" }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shrink-0 border transition-all duration-200"
              style={activeTab === tab.id
                ? { background: ORANGE, color: "#fff", borderColor: ORANGE, boxShadow: `0 4px 14px ${ORANGE}44` }
                : { background: "#fff", color: "#6B7280", borderColor: "#DDE0FF" }
              }
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── CONTENT ─────────────────────────────────────────────────── */}
        <div key={activeTab} style={{ animation: "panelIn 0.28s ease" }}>

          {/* ── GET SUPPORT ─────────────────────────────────────────── */}
          {activeTab === "support" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CHANNELS.map((ch, i) => (
                  <div key={ch.label}
                    className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-all overflow-hidden"
                    style={{ borderColor: ch.border, animation: `cardIn 0.3s ease both`, animationDelay: `${i * 0.07}s` }}
                  >
                    <NavyTopBar />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: ch.bg, border: `1px solid ${ch.border}` }}>
                      {ch.icon}
                    </div>
                    <div>
                      <p className="font-black text-[#0D1240] text-sm">{ch.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{ch.desc}</p>
                    </div>
                    <p className="text-xs font-bold mt-auto" style={{ color: ch.color }}>{ch.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                style={{ animation: "cardIn 0.35s ease both", animationDelay: "0.15s" }}>
                <NavyTopBar />
                <div className="px-6 py-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: "#FFF4E0", border: "1px solid #FFE4B0" }}>📧</div>
                    <div>
                      <h2 className="font-black text-[#0D1240] text-base">Send Us a Message</h2>
                      <p className="text-[11px] text-gray-400">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  <SupportForm onSubmitted={loadMyRequests} />
                </div>
              </div>

              <MyRequestsList requests={myRequests} />
            </div>
          )}

          {/* ── REQUEST FORM ─────────────────────────────────────────── */}
          {activeTab === "request" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              style={{ animation: "cardIn 0.3s ease both" }}>
              <NavyTopBar />
              <div className="px-6 py-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "#EEF0FF", border: "1px solid #DDE0FF" }}>📝</div>
                  <div>
                    <h2 className="font-black text-[#0D1240] text-base">Submit a Request</h2>
                    <p className="text-[11px] text-gray-400">Send enquiries, support requests, feedback, or alumni-related questions through the form below.</p>
                  </div>
                </div>
                <RequestForm onSubmitted={loadMyRequests} />
                <MyRequestsList requests={myRequests} />
              </div>
            </div>
          )}

          {/* ── TEAM ─────────────────────────────────────────────────── */}
          {activeTab === "team" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM.map((member, i) => (
                <div key={member.name}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  style={{ animation: "cardIn 0.3s ease both", animationDelay: `${i * 0.07}s` }}>
                  <NavyTopBar />
                  <div className="px-5 py-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                      style={{ background: `${member.color}12`, borderColor: `${member.color}30` }}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#0D1240] text-sm leading-snug">{member.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{member.role}</p>
                      <a href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-bold transition-colors"
                        style={{ color: member.color }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 11 11">
                          <path d="M1.5 3l4 2.5L9.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="1" y="2" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── FAQs ─────────────────────────────────────────────────── */}
          {activeTab === "faqs" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "#EEF0FF", border: "1px solid #DDE0FF" }}>❓</div>
                <div>
                  <h2 className="font-black text-[#0D1240] text-base">Frequently Asked Questions</h2>
                  <p className="text-[11px] text-gray-400">{FAQS.length} common questions answered</p>
                </div>
              </div>
              {FAQS.map((faq, i) => (
                <FaqItem key={i} faq={faq} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}