import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, {Toaster} from "react-hot-toast";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [isLoading, setIsLoading] = useState(false);
    const { adminSendOtp, adminVerifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        setIsLoading(true);
        try {
            await adminSendOtp(email);
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter the 6-digit OTP");

        setIsLoading(true);
        try {
            await adminVerifyOtp(email, otp);
            toast.success("Logged in successfully!");
            setTimeout(() => navigate("/admin"), 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-poppins px-4">
            <Toaster />
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-[440px] w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden p-10 border border-slate-100 relative z-10 transition-all">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20 rotate-3 transition-transform hover:rotate-0 duration-300">
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        {step === 1
                            ? "Enter your email to receive a secure login code"
                            : `A 6-digit code has been sent to ${email}`}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 px-1">
                                Administrator Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@mashar.com"
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-slate-800 font-medium"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transform transition-all active:scale-[0.98] ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/30"
                                }`}
                        >
                            {isLoading ? "Requesting OTP..." : "Get Verification Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 px-1">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="······"
                                className="w-full px-5 py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 text-center text-4xl tracking-[0.4em] font-black outline-none transition-all text-slate-900"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transform transition-all active:scale-[0.98] ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/30"
                                }`}
                        >
                            {isLoading ? "Verifying..." : "Sign In to Dashboard"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-center text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors py-2"
                        >
                            ← Use different email
                        </button>
                    </form>
                )}

                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-2.5 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                    Secured by Mashar OTP
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
