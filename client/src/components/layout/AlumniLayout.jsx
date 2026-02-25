import { Outlet, useNavigate } from "react-router-dom";
import AlumniSidebar from "./AlumniSidebar";
import AlumniNavbar from "./AlumniNavbar";
import ChatWidget from "../chat/ChatWidget";
import { useState, useEffect } from "react";
import API from "../../utils/api";

export default function AlumniLayout() {

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // remember sidebar
  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved) setCollapsed(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(collapsed));
  }, [collapsed]);

  // fetch logged user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/alumni/me");
        setUser(res.data.alumni);
      } catch (err) {
        localStorage.removeItem("alumni_token");
        navigate("/alumni-login");
      }
    };

    fetchUser();
  }, [navigate]);

  // loader
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F4EC]">

      <AlumniSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1">

        <AlumniNavbar
          user={user}
          toggleSidebar={() => setCollapsed(!collapsed)}
          openMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-7 relative">
          <Outlet context={{ user }} />
          {/* Chat Widget for Alumni */}
          <ChatWidget />
        </main>

      </div>
    </div>
  );
}
