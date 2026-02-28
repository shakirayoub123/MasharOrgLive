import React, { useState, useEffect, useRef } from "react";
import {
    Search, MessageSquare, Send, MoreVertical,
    CheckCheck, Phone, Video, Info, ChevronLeft, Sparkles
} from "lucide-react";
import socket from "../../utils/socket";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AVATAR_COLORS = [
    ["#6366f1", "#4f46e5"],
    ["#8b5cf6", "#7c3aed"],
    ["#06b6d4", "#0891b2"],
    ["#10b981", "#059669"],
    ["#f59e0b", "#d97706"],
    ["#ef4444", "#dc2626"],
    ["#ec4899", "#db2777"],
];

function getAvatarColor(name = "") {
    if (!name || name.length === 0) return AVATAR_COLORS[0];
    const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
}

export default function AdminInbox() {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const { admin, adminToken } = useAuth();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const selectedConvRef = useRef(null);

    useEffect(() => {
        selectedConvRef.current = selectedConv;
    }, [selectedConv]);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const joinAdminRoom = () => {
            if (admin) {
                console.log("🏠 Admin joining admin room");
                socket.emit("join_admin");
            }
        };

        if (socket.connected) {
            joinAdminRoom();
        } else {
            socket.on("connect", joinAdminRoom);
        }

        fetchConversations();

        const handleReceive = (message) => {

            const currentSelected = selectedConvRef.current;
            if (currentSelected && message.conversationId?.toString() === currentSelected._id?.toString()) {
                console.log("✅ Message belongs to open conversation — adding to UI");
                setMessages(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].text === message.text && prev[prev.length - 1].createdAt === (message.sentAt || message.createdAt)) {
                        console.log("⚠️ Duplicate message blocked");
                        return prev;
                    }
                    return [...prev, {
                        text: message.text,
                        senderModel: message.senderModel,
                        createdAt: message.sentAt || message.createdAt,
                        incoming: message.senderModel === "Alumni"
                    }];
                });
            } else {
                console.log("ℹ️ Message is for a different/no conversation — only updating sidebar preview");
            }

            updateConversationListPreview({
                text: message.text,
                senderModel: message.senderModel,
                createdAt: message.sentAt || message.createdAt,
                conversationId: message.conversationId,
            });
        };

        socket.on("receiveMessage", handleReceive);

        return () => {
            socket.off("connect", joinAdminRoom);
            socket.off("receiveMessage", handleReceive);
        };
    }, [admin]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get("/api/admin/conversations", {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setConversations(res.data.data.conversations || []);
        } catch {
            toast.error("Failed to load conversations");
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conv) => {
        try {
            const conversationId = conv._id;

            const res = await axios.get(`/api/admin/chat/${conversationId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });

            setMessages(res.data.data.messages || []);

            socket.emit("joinConversation", conversationId);

            setConversations(prev => prev.map(c =>
                c._id === conv._id ? { ...c, unreadCount: { admin: 0 } } : c
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectConv = (conv) => {
        setSelectedConv(conv);
        fetchMessages(conv);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedConv || sending) return;

        setSending(true);
        try {
            const conversationId = selectedConv._id;

            // ✅ fixed event name + payload shape
            socket.emit("sendMessage", {
                conversationId,
                senderId: admin.id,
                senderType: "admin",
                text: inputText,
            });

            setInputText("");
            updateConversationListPreview({
                text: inputText,
                senderModel: "Admin",
                createdAt: new Date().toISOString(),
                conversationId
            });
        } catch {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const updateConversationListPreview = (message) => {
        setConversations(prev => {
            const index = prev.findIndex(c => c._id === message.conversationId);
            if (index === -1) return prev;
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                lastMessage: {
                    text: message.text,
                    sender: message.senderModel,
                    createdAt: message.createdAt,
                    incoming: false
                },
                updatedAt: message.createdAt,
                unreadCount: {
                    admin: message.senderModel === "Alumni"
                        ? (updated[index].unreadCount?.admin || 0) + 1
                        : (updated[index].unreadCount?.admin || 0)
                }
            };

            return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTime = (date) => {
        if (!date) return "";
        const now = new Date();
        const d = new Date(date);
        if (now.toDateString() === d.toDateString())
            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (now - d < 7 * 24 * 60 * 60 * 1000)
            return d.toLocaleDateString([], { weekday: "short" });
        return d.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    const filteredConversations = conversations.filter(c =>
        c.alumni?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.alumni?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount?.admin || 0), 0);

    return (
        <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
            className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">

            {/* Sidebar */}
            <div className={`flex-shrink-0 w-[360px] border-r border-slate-100 flex flex-col bg-white transition-all duration-300 ${selectedConv ? "hidden md:flex" : "flex w-full"}`}>
                <div className="px-6 pt-7 pb-5 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inbox</h2>
                            {totalUnread > 0 && (
                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[11px] font-bold rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </div>
                        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
                            <Sparkles size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input type="text" placeholder="Search alumni..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400 text-slate-700"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2">
                    {loading ? (
                        <div className="p-4 space-y-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex gap-3 p-3 animate-pulse">
                                    <div className="w-11 h-11 bg-slate-100 rounded-2xl flex-shrink-0" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-3.5 bg-slate-100 rounded-lg w-2/5" />
                                        <div className="h-3 bg-slate-100 rounded-lg w-3/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        <div className="px-2 space-y-0.5">
                            {filteredConversations.map(conv => {
                                const name = conv.alumni?.name || "";
                                const colors = getAvatarColor(name);
                                const isActive = selectedConv?._id === conv._id;
                                const hasUnread = (conv.unreadCount?.admin || 0) > 0;
                                return (
                                    <button key={conv._id} onClick={() => handleSelectConv(conv)}
                                        className={`w-full px-3 py-3 flex gap-3 rounded-2xl transition-all duration-200 text-left
                                            ${isActive ? "bg-indigo-50 border border-indigo-100" : "hover:bg-slate-50 border border-transparent"}`}>
                                        <div className="relative flex-shrink-0">
                                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                                                style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
                                                {name.charAt(0).toUpperCase() || "?"}
                                            </div>
                                            {conv.isOnline && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline justify-between gap-1 mb-0.5">
                                                <p className={`text-sm truncate ${hasUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                                                    {name || "Unknown"}
                                                </p>
                                                <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">
                                                    {formatTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-xs truncate ${hasUnread ? "text-slate-700 font-semibold" : "text-slate-400 font-normal"}`}>
                                                    {conv.lastMessage?.sender === "Admin" && (
                                                        <span className="text-indigo-400 font-bold mr-1">You:</span>
                                                    )
                                                    }
                                                    {conv.lastMessage.text || <span className="italic text-slate-300">No messages yet</span>}
                                                </p>
                                                {hasUnread && (
                                                    <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-md shadow-indigo-200">
                                                        {conv.unreadCount.admin > 9 ? "9+" : conv.unreadCount.admin}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                                <MessageSquare size={28} />
                            </div>
                            <p className="text-sm font-semibold text-slate-400">No conversations found</p>
                            <p className="text-xs text-slate-300 mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-slate-50/30 overflow-hidden ${selectedConv ? "" : "hidden md:flex"}`}>
                {selectedConv ? (
                    <>
                        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedConv(null)}
                                    className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100">
                                    <ChevronLeft size={20} />
                                </button>
                                {(() => {
                                    const name = selectedConv.alumni?.name || "";
                                    const colors = getAvatarColor(name);
                                    return (
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm"
                                                style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
                                                {name.charAt(0).toUpperCase() || "?"}
                                            </div>
                                            {selectedConv.isOnline && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                                            )}
                                        </div>
                                    );
                                })()}
                                <div>
                                    <h3 className="font-bold text-slate-900 text-[15px] leading-tight">
                                        {selectedConv.alumni?.name || "Unknown"}
                                    </h3>
                                    <p className="text-[11px] font-medium flex items-center gap-1.5 mt-0.5">
                                        {selectedConv.isOnline
                                            ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /><span className="text-emerald-500">Online</span></>
                                            : <span className="text-slate-400">Alumni · {selectedConv.alumni?.email}</span>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Phone size={17} /></button>
                                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Video size={17} /></button>
                                <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"><Info size={17} /></button>
                                <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"><MoreVertical size={17} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                            <div className="flex justify-center mb-2">
                                <span className="px-4 py-1.5 bg-white text-[10px] font-bold text-slate-400 border border-slate-200 rounded-full uppercase tracking-widest shadow-sm">
                                    Secure Support Channel
                                </span>
                            </div>
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 text-indigo-300">
                                        <MessageSquare size={22} />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-400">No messages yet</p>
                                    <p className="text-xs text-slate-300 mt-1">Start the conversation below</p>
                                </div>
                            )}
                            {messages.map((msg, i) => {
                                const isMe = msg.senderModel === "Admin" || msg.incoming === false
                                const prevMsg = messages[i - 1];
                                const showDateSep = !prevMsg || new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();
                                return (
                                    <React.Fragment key={i}>
                                        {showDateSep && i !== 0 && (
                                            <div className="flex justify-center my-2">
                                                <span className="px-3 py-1 bg-white text-[10px] font-bold text-slate-400 border border-slate-200 rounded-full uppercase tracking-wider shadow-sm">
                                                    {new Date(msg.createdAt).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                                                <div className={`px-4 py-3 text-sm leading-relaxed ${isMe
                                                    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-md shadow-indigo-200/40"
                                                    : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm"
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                    {isMe && <CheckCheck size={12} className="text-indigo-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="px-6 py-4 bg-white border-t border-slate-100 flex-shrink-0">
                            <form onSubmit={handleSend} className="flex items-center gap-3">
                                <input ref={inputRef} type="text"
                                    value={inputText} onChange={e => setInputText(e.target.value)}
                                    placeholder={`Message ${selectedConv.alumniId?.name?.split(" ")[0] || "alumni"}...`}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-slate-800 placeholder:text-slate-400"
                                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
                                />
                                <button type="submit" disabled={!inputText.trim() || sending}
                                    className="w-11 h-11 flex items-center justify-center bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0">
                                    <Send size={17} className={sending ? "opacity-50" : ""} />
                                </button>
                            </form>
                            <p className="text-center text-[10px] text-slate-300 font-medium mt-2.5">Press Enter to send · Shift+Enter for new line</p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5 text-indigo-200 shadow-inner">
                            <MessageSquare size={36} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Support Dashboard</h3>
                        <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
                            Select a conversation from the sidebar to start supporting your alumni community.
                        </p>
                        {totalUnread > 0 && (
                            <div className="mt-5 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                <span className="text-sm font-semibold text-indigo-600">
                                    {totalUnread} unread message{totalUnread > 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}