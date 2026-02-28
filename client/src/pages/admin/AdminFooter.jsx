import { Shield, Heart } from "lucide-react";

export default function AdminFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-sm">
            <div className="px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Left — branding */}
                <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                    <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <Shield size={13} className="text-white" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                        © Mashar Coaching &amp; Training {year}
                    </span>
                    <span className="text-slate-300 text-xs">|</span>
                    <a
                        href="mailto:info@mashar.org"
                        className="text-xs text-slate-400 font-medium hover:text-indigo-600 transition-colors"
                    >
                        info@mashar.org
                    </a>
                </div>

                {/* Right — status */}
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-400">All systems operational</span>
                </div>

            </div>
        </footer>
    );
}