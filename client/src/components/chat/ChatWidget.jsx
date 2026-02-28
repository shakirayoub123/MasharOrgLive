import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minus, Maximize2 } from "lucide-react";
import socket from "../../utils/socket";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// ─── THEME ────────────────────────────────────────────────────────────────────
const NAVY   = "#0F1C80";
const ORANGE = "#F38900";

export default function ChatWidget() {
    const [isOpen,          setIsOpen]          = useState(false);
    const [isMinimized,     setIsMinimized]     = useState(false);
    const [messages,        setMessages]        = useState([]);
    const [inputText,       setInputText]       = useState("");
    const [unreadCount,     setUnreadCount]     = useState(0);
    const [conversationId,  setConversationId]  = useState(null);
    const { user } = useAuth();
    const token = localStorage.getItem("alumni_token");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            if (!socket.connected) socket.connect();
            fetchHistory();
        }
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener("open_chat_widget", handleOpenChat);
        return () => window.removeEventListener("open_chat_widget", handleOpenChat);
    }, [user, isOpen]);

    useEffect(() => {
        const onMessage = (message) => {
            const normalized = {
                text:        message.text,
                senderModel: message.senderModel,
                createdAt:   message.sentAt || message.createdAt,
            };
            setMessages((prev) => {
                if (prev.length > 0 &&
                    prev[prev.length - 1].text      === normalized.text &&
                    prev[prev.length - 1].createdAt === normalized.createdAt) return prev;
                return [...prev, normalized];
            });
            if (!isOpen || isMinimized) {
                if (normalized.senderModel === "Admin") setUnreadCount(p => p + 1);
            }
        };
        socket.on("receiveMessage", onMessage);
        return () => socket.off("receiveMessage", onMessage);
    }, [isOpen, isMinimized]);

    useEffect(() => {
        if (isOpen && !isMinimized && unreadCount > 0) setUnreadCount(0);
    }, [isOpen, isMinimized]);

    useEffect(() => {
        if (conversationId) socket.emit("joinConversation", conversationId);
    }, [conversationId]);

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`/api/alumni/chat`, { headers: { Authorization: `Bearer ${token}` } });
            setConversationId(res.data.data.conversation._id);
            setMessages(res.data.data.messages || []);
        } catch (err) {
            if (err.response?.status === 404) {
                try {
                    const r = await axios.post(`/api/alumni/chat`, {}, { headers: { Authorization: `Bearer ${token}` } });
                    setConversationId(r.data.data.conversation._id);
                    setMessages([]);
                } catch (e) { console.error("Failed to create conversation", e); }
            } else { console.error("Failed to fetch chat history", err); }
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        socket.emit("sendMessage", {
            conversationId,
            senderId:   user._id,
            senderType: "alumni",
            text:       inputText.trim(),
        });
        setInputText("");
    };

    if (!user) return null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .cw-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
                .cw-scrollbar { scrollbar-width: thin; scrollbar-color: #DDE0FF transparent; }
                .cw-scrollbar::-webkit-scrollbar { width: 4px; }
                .cw-scrollbar::-webkit-scrollbar-thumb { background: #DDE0FF; border-radius: 4px; }
                .cw-input::placeholder { color: #9CA3AF; }
                .cw-input:focus { outline: none; border-color: ${NAVY}; box-shadow: 0 0 0 3px rgba(15,28,128,.1); }
                .cw-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
                @keyframes cw-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
                @keyframes cw-pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
                @keyframes cw-fadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes cw-pop    { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
            `}</style>

            <div className="cw-root" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>

                {/* ── FAB BUTTON ── */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            width: 60, height: 60, borderRadius: "50%", border: "none",
                            background: `linear-gradient(135deg,${NAVY} 0%,#1A2EA0 100%)`,
                            color: "#fff", cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            boxShadow: `0 8px 28px rgba(15,28,128,.38)`,
                            transition: "transform .2s, box-shadow .2s",
                            animation: "cw-pop .3s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = `0 12px 32px rgba(15,28,128,.45)`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";   e.currentTarget.style.boxShadow = `0 8px 28px rgba(15,28,128,.38)`; }}
                    >
                        <MessageCircle size={26} />
                        {unreadCount > 0 && (
                            <span style={{
                                position: "absolute", top: -3, right: -3,
                                width: 20, height: 20, borderRadius: "50%",
                                background: ORANGE, border: "2px solid #fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 9, fontWeight: 800, color: "#fff",
                                animation: "cw-bounce 1s ease infinite",
                            }}>{unreadCount}</span>
                        )}
                    </button>
                )}

                {/* ── CHAT WINDOW ── */}
                {isOpen && (
                    <div style={{
                        background: "#fff", borderRadius: 20,
                        boxShadow: "0 16px 48px rgba(15,28,128,.18)",
                        border: "1px solid #DDE0FF",
                        display: "flex", flexDirection: "column",
                        overflow: "hidden",
                        width: isMinimized ? 260 : 370,
                        height: isMinimized ? 62 : 500,
                        transition: "width .25s ease, height .25s ease",
                        animation: "cw-fadein .25s ease",
                    }}>

                        {/* ── HEADER ── */}
                        <div style={{
                            background: `linear-gradient(135deg,${NAVY} 0%,#1A2EA0 100%)`,
                            padding: "13px 16px", display: "flex",
                            alignItems: "center", justifyContent: "space-between",
                            flexShrink: 0, position: "relative", overflow: "hidden",
                        }}>
                            {/* Decorative ring */}
                            <div style={{
                                position: "absolute", right: -20, top: -20, width: 100, height: 100,
                                borderRadius: "50%", border: "2px solid rgba(255,255,255,.08)", pointerEvents: "none",
                            }} />

                            {/* Brand */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: ORANGE,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 900, fontSize: 15, color: "#fff",
                                    fontFamily: "'Sora', sans-serif",
                                    boxShadow: `0 3px 10px rgba(243,137,0,.35)`,
                                }}>M</div>
                                <div style={{ lineHeight: 1.2 }}>
                                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: "#fff" }}>Mashar Support</p>
                                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#6EE7B7", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7", animation: "cw-pulse 1.8s ease infinite", display: "inline-block" }} />
                                        Active Now
                                    </p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div style={{ display: "flex", gap: 4, position: "relative" }}>
                                {[
                                    { icon: isMinimized ? <Maximize2 size={14}/> : <Minus size={14}/>, action: () => setIsMinimized(v => !v) },
                                    { icon: <X size={14}/>, action: () => setIsOpen(false) },
                                ].map(({ icon, action }, i) => (
                                    <button key={i} onClick={action} style={{
                                        width: 28, height: 28, border: "none", borderRadius: 8, cursor: "pointer",
                                        background: "rgba(255,255,255,.12)", color: "#fff",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "background .15s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.24)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}
                                    >{icon}</button>
                                ))}
                            </div>
                        </div>

                        {/* Orange accent stripe */}
                        <div style={{ height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})`, flexShrink: 0 }} />

                        {/* ── MESSAGES ── */}
                        {!isMinimized && (
                            <>
                                <div className="cw-scrollbar" style={{
                                    flex: 1, overflowY: "auto", padding: "16px 14px",
                                    background: "#EEF0FF", display: "flex", flexDirection: "column", gap: 10,
                                }}>
                                    {/* Chat started pill */}
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                                        <span style={{
                                            fontSize: 9.5, fontWeight: 800, color: "#9CA3AF",
                                            background: "#fff", padding: "3px 12px", borderRadius: 20,
                                            border: "1px solid #DDE0FF", letterSpacing: "0.8px", textTransform: "uppercase",
                                        }}>Chat Started</span>
                                    </div>

                                    {messages.map((msg, i) => {
                                        const isMe = msg.senderModel === "Alumni" || msg.incoming === false;
                                        return (
                                            <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                                                <div style={{
                                                    maxWidth: "78%", padding: "9px 13px", fontSize: 13,
                                                    lineHeight: 1.6, borderRadius: 14,
                                                    borderTopRightRadius: isMe ? 4  : 14,
                                                    borderTopLeftRadius:  isMe ? 14 : 4,
                                                    background: isMe
                                                        ? `linear-gradient(135deg,${NAVY} 0%,#1A2EA0 100%)`
                                                        : "#fff",
                                                    color: isMe ? "#fff" : "#0D1240",
                                                    boxShadow: isMe
                                                        ? "0 3px 12px rgba(15,28,128,.25)"
                                                        : "0 1px 4px rgba(15,28,128,.08)",
                                                    border: isMe ? "none" : "1px solid #DDE0FF",
                                                }}>
                                                    {msg.text}
                                                    <p style={{
                                                        fontSize: 9, marginTop: 4, fontWeight: 700,
                                                        textTransform: "uppercase", letterSpacing: "0.4px",
                                                        color: isMe ? "rgba(255,255,255,.55)" : "#9CA3AF",
                                                    }}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* ── INPUT ── */}
                                <form onSubmit={handleSend} style={{
                                    padding: "12px 14px", borderTop: "1px solid #DDE0FF",
                                    background: "#fff", display: "flex", gap: 8, alignItems: "center", flexShrink: 0,
                                }}>
                                    <input
                                        className="cw-input"
                                        type="text"
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        placeholder="Type your message…"
                                        style={{
                                            flex: 1, background: "#EEF0FF",
                                            border: "1.5px solid #DDE0FF", borderRadius: 10,
                                            padding: "9px 13px", fontSize: 13, color: "#0D1240",
                                            transition: "border-color .15s, box-shadow .15s",
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="cw-send-btn"
                                        disabled={!inputText.trim()}
                                        style={{
                                            width: 38, height: 38, border: "none", borderRadius: 10,
                                            background: `linear-gradient(135deg,${NAVY},#1A2EA0)`,
                                            color: "#fff", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            boxShadow: `0 4px 12px rgba(15,28,128,.28)`,
                                            transition: "transform .15s, box-shadow .15s",
                                            flexShrink: 0,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}