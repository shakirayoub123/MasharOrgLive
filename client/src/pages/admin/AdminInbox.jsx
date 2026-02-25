import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    MessageSquare,
    Send,
    User,
    Clock,
    Filter,
    MoreVertical,
    CheckCheck,
    Phone,
    Video,
    Info,
    ChevronLeft,
    Sparkles
} from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000", {
    withCredentials: true,
    autoConnect: false
});

export default function AdminInbox() {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const { admin, adminToken } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.connect();
        fetchConversations();

        socket.on("receive_message", (message) => {
            if (selectedConv && message.conversationId === selectedConv._id) {
                setMessages((prev) => [...prev, message]);
            }
            updateConversationListPreview(message);
        });

        return () => {
            socket.off("receive_message");
            socket.disconnect();
        };
    }, [selectedConv]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get("/api/v1/chat/conversations", {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setConversations(res.data.conversations || []);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load conversations");
        }
    };

    const fetchMessages = async (conv) => {
        try {
            const res = await axios.get(`/api/v1/chat/history/${conv.alumniId._id}`);
            setMessages(res.data.messages || []);
            socket.emit("join_room", conv._id);

            await axios.put(`/api/v1/chat/read/${conv.alumniId._id}`, { role: "Admin" });

            setConversations(prev => prev.map(c =>
                c._id === conv._id ? { ...c, unreadCount: { ...c.unreadCount, admin: 0 } } : c
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectConv = (conv) => {
        setSelectedConv(conv);
        fetchMessages(conv);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedConv) return;

        const messageData = {
            alumniId: selectedConv.alumniId._id,
            text: inputText,
            senderId: admin.id,
            senderModel: "Admin"
        };

        try {
            const res = await axios.post("/api/v1/chat/message", messageData);
            const savedMessage = res.data.message;

            socket.emit("send_message", {
                ...savedMessage,
                conversationId: selectedConv._id,
                alumniId: selectedConv.alumniId._id
            });

            setMessages((prev) => [...prev, savedMessage]);
            setInputText("");
            updateConversationListPreview(savedMessage);
        } catch (err) {
            toast.error("Failed to send message");
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
                    createdAt: message.createdAt
                },
                updatedAt: message.createdAt,
                unreadCount: {
                    ...updated[index].unreadCount,
                    admin: message.senderModel === "Alumni" ? (updated[index].unreadCount.admin + 1) : updated[index].unreadCount.admin
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
        if (now.toDateString() === d.toDateString()) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const filteredConversations = conversations.filter(c =>
        c.alumniId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.alumniId?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-indigo-100/40 overflow-hidden font-poppins">
            {/* Sidebar: Conv List */}
            <div className={`w-[400px] border-r border-slate-100 flex flex-col bg-slate-50/20 backdrop-blur-xl transition-all duration-300 ${selectedConv ? 'hidden md:flex' : 'flex w-full'}`}>
                <div className="p-8 border-b border-slate-100 bg-white/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Inbox</h2>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Sparkles size={18} />
                        </div>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find member..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 border border-slate-100 rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-600 transition-all font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                    {loading ? (
                        <div className="p-5 space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-4 animate-pulse p-4">
                                    <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
                                        <div className="h-3 bg-slate-200 rounded-lg w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv._id}
                                onClick={() => handleSelectConv(conv)}
                                className={`w-full p-4 flex gap-4 rounded-[24px] transition-all duration-300 group relative ${selectedConv?._id === conv._id ? 'bg-white shadow-xl shadow-indigo-100/50 scale-[1.02] z-10' : 'hover:bg-white/60'}`}
                            >
                                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-lg shadow-sm transition-transform duration-500 ${selectedConv?._id === conv._id ? 'bg-indigo-600 text-white rotate-6' : 'bg-white text-indigo-600 group-hover:scale-110'}`}>
                                    {conv.alumniId?.name.charAt(0)}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className={`font-bold text-[15px] truncate transition-colors ${selectedConv?._id === conv._id ? 'text-indigo-600' : 'text-slate-800'}`}>
                                            {conv.alumniId?.name}
                                        </p>
                                        <span className="text-[10px] text-slate-400 font-bold tracking-tighter">
                                            {formatTime(conv.lastMessage?.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`text-[12px] truncate leading-snug ${conv.unreadCount.admin > 0 ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}`}>
                                        {conv.lastMessage?.sender === "Admin" && <span className="text-indigo-500 font-extrabold mr-1">You:</span>}
                                        {conv.lastMessage?.text || "No interactions yet"}
                                    </p>
                                </div>
                                {conv.unreadCount.admin > 0 && (
                                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[11px] text-white font-black shadow-lg shadow-indigo-600/30 scale-110 animate-in zoom-in duration-300">
                                        {conv.unreadCount.admin}
                                    </div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-[30px] flex items-center justify-center mb-6 text-slate-300">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-sm font-bold text-slate-400">Silence in the inbox...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-white overflow-hidden transition-all duration-500 ${selectedConv ? 'translate-x-0' : 'translate-x-4 md:translate-x-0'}`}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm z-20">
                            <div className="flex items-center gap-5">
                                <button
                                    onClick={() => setSelectedConv(null)}
                                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black shadow-xl shadow-indigo-200">
                                        {selectedConv.alumniId?.name.charAt(0)}
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-[17px] tracking-tight leading-tight">{selectedConv.alumniId?.name}</h3>
                                    <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-2 mt-1">
                                        Verified Alumni
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-2 mr-4">
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-2xl transition-all"><Phone size={20} /></button>
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-2xl transition-all"><Video size={20} /></button>
                                </div>
                                <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><Info size={20} /></button>
                                <div className="w-px h-8 bg-slate-100 mx-1"></div>
                                <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20 custom-scrollbar">
                            <div className="flex justify-center mb-8">
                                <span className="bg-white px-5 py-2 rounded-2xl text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm uppercase tracking-[0.2em]">
                                    Secure Support Channel
                                </span>
                            </div>

                            {messages.map((msg, i) => {
                                const isMe = msg.senderModel === "Admin";
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                            <div className={`px-5 py-4 text-[14px] leading-relaxed shadow-sm transition-all ${isMe
                                                ? 'bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 text-white rounded-[24px] rounded-tr-none shadow-indigo-200/50'
                                                : 'bg-white text-slate-800 border border-slate-100 rounded-[24px] rounded-tl-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <div className={`flex items-center gap-2 mt-2 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-tighter">
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                                {isMe && <CheckCheck size={14} className="text-indigo-400" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
                            <form onSubmit={handleSend} className="relative flex items-center gap-4">
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder={`Send message to ${selectedConv.alumniId?.name.split(' ')[0]}...`}
                                        className="w-full bg-slate-100/50 border border-slate-200 rounded-[24px] pl-6 pr-6 py-4.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-800"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="p-4.5 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all group overflow-hidden relative"
                                >
                                    <Send size={24} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-700">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 bg-indigo-50 text-indigo-200 rounded-[40px] flex items-center justify-center animate-pulse">
                                <MessageSquare size={60} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-2xl flex items-center justify-center text-indigo-600 animate-bounce">
                                <Sparkles size={20} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Support Dashboard</h3>
                        <p className="text-slate-500 max-w-sm text-[15px] leading-relaxed font-medium">
                            Select a conversation to start helping our alumni community. All messages are archived for security.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
