import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {Toaster} from "react-hot-toast";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { admin } = useAuth();

    // Handle sidebar preference
    useEffect(() => {
        const saved = localStorage.getItem("admin_sidebar_collapsed");
        if (saved) setCollapsed(JSON.parse(saved));
    }, []);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("admin_sidebar_collapsed", JSON.stringify(newState));
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Toaster />

            {/* Sidebar */}
            <Toaster />
            <AdminSidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                closeMobile={() => setMobileOpen(false)}
            />

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Navbar */}
                <AdminNavbar
                    admin={admin}
                    toggleSidebar={toggleSidebar}
                    openMobile={() => setMobileOpen(true)}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
                    {/* Subtle background gradient for depth */}
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none -z-10 opacity-50"></div>

                    <div className="mx-auto animate-in fade-in duration-500">
                        <Outlet context={{ admin }} />
                    </div>
                </main>
            </div>
        </div>
    );
}
