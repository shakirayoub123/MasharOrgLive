import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minus, Maximize2 } from "lucide-react";
import socket from "../../utils/socket";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [conversationId, setConversationId] = useState(null);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            // Connect once — AlumniNavbar already joins the personal room;
            // just add the receive_message listener here.
            if (!socket.connected) socket.connect();

            fetchHistory();

            const onMessage = (message) => {
                setMessages((prev) => [...prev, message]);
                // Increment unread count if chat is closed or minimized
                if (!isOpen || isMinimized) {
                    if (message.senderModel === "Admin") {
                        setUnreadCount(prev => prev + 1);
                    }
                }
            };

            socket.on("receive_message", onMessage);

            return () => {
                socket.off("receive_message", onMessage);
                // Do NOT disconnect — AlumniNavbar owns the lifecycle
            };
        }
    }, [user]); // Only re-run when user changes, not on every open/close

    // Handle marking as read when opening
    useEffect(() => {
        if (isOpen && !isMinimized && unreadCount > 0) {
            setUnreadCount(0);
            if (user) {
                axios.put(`/api/v1/chat/read/${user.id}`, { role: "Alumni" }).catch(console.error);
            }
        }
    }, [isOpen, isMinimized, unreadCount, user]); // Added user to dependencies

    useEffect(() => {
        if (conversationId) {
            socket.emit("join_room", conversationId);
        }
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`/api/v1/chat/history/${user.id}`);
            setMessages(res.data.messages || []);
            setConversationId(res.data.conversationId);

            // Clear unread count for alumni - This logic is now handled by the new useEffect
            // if (res.data.conversationId) {
            //     await axios.put(`/api/v1/chat/read/${user._id}`, { role: "Alumni" });
            // }

            // Calculate initial unread (sent by admin after last alumni message)
            // Or we can just trust the backend count if we added it to the response
            // For now let's just use the server's unreadCount if available
            // but the GET /history doesn't return unreadCount yet. 
            // I'll leave it as is for now or add it later.
        } catch (err) {
            console.error("Failed to fetch chat history", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messageData = {
            alumniId: user.id,
            text: inputText,
            senderId: user.id,
            senderModel: "Alumni"
        };

        try {
            // 1. Save to DB
            const res = await axios.post("/api/v1/chat/message", messageData);
            const savedMessage = res.data.message;
            setConversationId(res.data.conversationId);

            // 2. Emit via Socket
            socket.emit("send_message", {
                ...savedMessage,
                conversationId: res.data.conversationId,
                alumniId: user.id
            });

            setMessages((prev) => [...prev, savedMessage]);
            setInputText("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-poppins">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 hover:scale-110 active:scale-95 transition-all group"
                >
                    <MessageCircle size={30} className="group-hover:rotate-12 transition-transform" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold animate-bounce">
                            {unreadCount}
                        </span>
                    )}
                </button>
            ) : (
                <div className={`bg-white rounded-[24px] shadow-2xl shadow-slate-300 border border-slate-100 flex flex-col transition-all duration-300 overflow-hidden ${isMinimized ? 'h-16 w-64' : 'h-[500px] w-[380px]'}`}>
                    {/* Header */}
                    <div className="bg-[#0F172A] p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">M</div>
                            <div className="leading-tight">
                                <p className="text-sm font-bold">Mashar Support</p>
                                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Active Now
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 custom-scrollbar">
                                <div className="flex flex-col items-center justify-center py-4 mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Chat Started</p>
                                </div>

                                {messages.map((msg, i) => {
                                    const isMe = msg.senderModel === "Alumni";
                                    return (
                                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isMe
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                                }`}>
                                                {msg.text}
                                                <p className={`text-[9px] mt-1 font-bold uppercase ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
                                <div className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                    <button
                                        type="submit"
                                        className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
