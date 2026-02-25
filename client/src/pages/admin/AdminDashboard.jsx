import React from "react";
import {
    Users,
    UserCheck,
    UserPlus,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Activity
} from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8 pb-12">
            {/* ── Header Section ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back. Here's what's happening with the Mashar network today.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                        Download Report
                    </button>
                    <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all">
                        View Analytics
                    </button>
                </div>
            </div>

            {/* ── Quick Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="text-indigo-600" />}
                    label="Total Alumni"
                    value="1,284"
                    trend="+12%"
                    trendType="up"
                    color="indigo"
                />
                <StatCard
                    icon={<UserCheck className="text-emerald-600" />}
                    label="Approved Members"
                    value="952"
                    trend="+5.2%"
                    trendType="up"
                    color="emerald"
                />
                <StatCard
                    icon={<UserPlus className="text-amber-600" />}
                    label="Pending Sync"
                    value="48"
                    trend="-2.4%"
                    trendType="down"
                    color="amber"
                />
                <StatCard
                    icon={<Activity className="text-rose-600" />}
                    label="Active This Week"
                    value="312"
                    trend="+18%"
                    trendType="up"
                    color="rose"
                />
            </div>

            {/* ── Main Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-lg">System Activity</h3>
                        <button className="text-indigo-600 text-xs font-bold hover:underline">View All History</button>
                    </div>
                    <div className="p-8 flex-1 space-y-6">
                        <ActivityItem
                            icon={<UserPlus size={18} />}
                            title="New Registration"
                            desc="Shakir Ayoub submitted a registration for Batch 2024"
                            time="2 mins ago"
                            color="indigo"
                        />
                        <ActivityItem
                            icon={<CheckCircle size={18} />}
                            title="Member Approved"
                            desc="Administrative account approved Ali Khan's profile"
                            time="45 mins ago"
                            color="emerald"
                        />
                        <ActivityItem
                            icon={<Clock size={18} />}
                            title="OTP Request"
                            desc="System generated verification code for admin@mashar.com"
                            time="1 hour ago"
                            color="slate"
                        />
                        <ActivityItem
                            icon={<Calendar size={18} />}
                            title="Event Updated"
                            desc="Annual Alumni Meetup 2026 details were modified"
                            time="3 hours ago"
                            color="amber"
                        />
                    </div>
                </div>

                {/* Sync Status Card */}
                <div className="bg-[#0F172A] text-white rounded-3xl shadow-2xl shadow-indigo-900/10 p-8 flex flex-col items-center text-center justify-center space-y-6 relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                    <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                        <TrendingUp size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-2">Network Growth</h4>
                        <p className="text-slate-400 text-sm leading-relaxed px-4">
                            Your network expanded by 24% compared to last month. Keep optimizing your sync strategies.
                        </p>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/20">
                        Run Data Sync
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── UI Components ── */

function StatCard({ icon, label, value, trend, trendType, color }) {
    const colorStyles = {
        indigo: "bg-indigo-100/50 text-indigo-600",
        emerald: "bg-emerald-100/50 text-emerald-600",
        amber: "bg-amber-100/50 text-amber-600",
        rose: "bg-rose-100/50 text-rose-600"
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${colorStyles[color]}`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-extrabold px-2 py-1 rounded-lg ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                    {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1">{label}</p>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h2>
            </div>
        </div>
    );
}

function ActivityItem({ icon, title, desc, time, color }) {
    const colorStyles = {
        indigo: "bg-indigo-100 text-indigo-600",
        emerald: "bg-emerald-100 text-emerald-600",
        amber: "bg-amber-100 text-amber-600",
        slate: "bg-slate-100 text-slate-600"
    };

    return (
        <div className="flex gap-5 group cursor-default">
            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-colors ${colorStyles[color]}`}>
                {icon}
            </div>
            <div className="flex-1 border-b border-slate-50 pb-4 group-last:border-0">
                <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-[14px] font-bold text-slate-800">{title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{time}</span>
                </div>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CheckCircle({ size }) {
    return <UserCheck size={size} />;
}
