import { NavLink } from "react-router-dom";

export default function AlumniSidebar({ collapsed, mobileOpen, closeMobile }) {
  return (
    <>
      {/* overlay mobile */}
      {mobileOpen && (
        <div onClick={closeMobile} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
      )}

      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-full
          bg-[#1C1C1E] text-white flex flex-col
          border-r border-yellow-500/10
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="font-serif text-2xl font-bold text-[#C9A84C]">
            {collapsed ? "M" : "Mashar"}
          </h1>
          {!collapsed && (
            <p className="text-[10px] tracking-[3px] text-white/40 uppercase">
              Alumni Network
            </p>
          )}
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto py-4 text-sm">

          <Section label="Main" collapsed={collapsed} />
          <Item to="/alumni" icon="🏠" label="Dashboard" collapsed={collapsed} />
          <Item to="/alumni/profile" icon="👤" label="My Profile" collapsed={collapsed} />
          {/* <Item to="/alumni/messages" icon="💬" label="Messages" badge="3" red collapsed={collapsed} />
          <Item to="/alumni/notifications" icon="🔔" label="Notifications" badge="5" collapsed={collapsed} /> */}

          <Section label="Community" collapsed={collapsed} />
          <Item to="/alumni/directory" icon="🧑‍🤝‍🧑" label="Alumni Directory" collapsed={collapsed} />
          <Item to="/alumni/discussion" icon="🗨️" label="Discussion" collapsed={collapsed} />

          <Item to="/alumni/events" icon="🎟️" label="Events" collapsed={collapsed} />

          <Section label="Resources" collapsed={collapsed} />
          <Item to="/alumni/resourcessection" icon="🗂️" label="Resource Library" collapsed={collapsed} />
          {/* <Item to="/alumni/learning" icon="📚" label="Learning Hub" collapsed={collapsed} /> */}
          <Item to="/alumni/calendar" icon="📅" label="Program Calendar" collapsed={collapsed} />

        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10">
          <button className="w-full py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#C9A84C] to-yellow-800 text-black">
            {collapsed ? "⬇" : "Download Badge"}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── small pieces ── */

function Section({ label, collapsed }) {
  if (collapsed) return null;
  return (
    <p className="px-6 pt-4 pb-2 text-[10px] tracking-[2px] uppercase text-white/30">
      {label}
    </p>
  );
}

function Item({ to, icon, label, badge, red, collapsed }) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        `flex items-center gap-3 px-6 py-2 border-l-2 transition
        ${isActive
          ? "text-[#C9A84C] border-[#C9A84C] bg-[#C9A84C]/10"
          : "text-white/60 border-transparent hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <span className="w-5 text-center">{icon}</span>
      {!collapsed && <span className="flex-1">{label}</span>}
      {!collapsed && badge && (
        <span className={`text-[10px] px-2 py-[2px] rounded-full font-semibold ${red ? "bg-red-600" : "bg-teal-600"}`}>
          {badge}
        </span>
      )}
    </NavLink>
  );
}