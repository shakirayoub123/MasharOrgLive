import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import WhyMashar from "../pages/WhyMashar";
import ExplorePrograms from "../pages/ExploreProgs";
import OurSignature from "../pages/OurSignature";
import LetsTalk from "../pages/LetsTalk";
import LeadershipHub from "../pages/leadershipHub";
import NewsletterPopup from "../pages/NewsletterPopup";
import CollapseExpandCard from "../pages/test";
import Articles from "../components/Articles.jsx";
import Videos from "../components/videos.jsx";
import Books from "../components/Books.jsx";
import Events from "../components/Events.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AlumniRegister from "../pages/AlumniRegister.jsx";
import AlumniLayout from "../components/layout/AlumniLayout.jsx";
import AlumniDashboard from "../components/alumni/AlumniDashboard.jsx";
import Discussion from "../components/alumni/Discussions.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import EventsCalendar from "../components/alumni/EventsCalendar.jsx";
import AlumniDirectory from "../pages/alumni/AluminiDirectory.jsx";
import Profile from "../pages/alumni/Profile.jsx";
import LatestResources from "../components/alumni/LatestResources.jsx";
import Messages from "../components/alumni/Messages.jsx";
import Notifications from "../components/alumni/Notifications.jsx";
import ResourcesSection from "../pages/alumni/Resourcessection.jsx";
import SetPassword from "../pages/SetPassword.jsx";
import AdminAlumniApproval from "../pages/admin/AdminAlumniApproval.jsx";
import AluminiList from "../pages/admin/AluminiList.jsx";
import AdminInbox from "../pages/admin/AdminInbox.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import AlumniLogin from "../pages/AluminiLogin.jsx";

const browserRoutes = createBrowserRouter([
  // 🌐 Public website (with App layout)
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "popup", element: <NewsletterPopup /> },
      { path: "whyMashar", element: <WhyMashar /> },
      { path: "explorePrograms", element: <ExplorePrograms /> },
      { path: "test", element: <CollapseExpandCard /> },
      { path: "ourSignature", element: <OurSignature /> },
      { path: "leadership-hub", element: <LeadershipHub /> },
      { path: "lets-talk", element: <LetsTalk /> },
      { path: "articles", element: <Articles /> },
      { path: "videos", element: <Videos /> },
      { path: "books", element: <Books /> },
      { path: "events", element: <Events /> },
      { path: "our-signature", element: <OurSignature /> },
    ],
  },

  // 🔐 Alumni Login page (no layout)
  {
    path: "/alumni-login",
    element: <AlumniLogin />,
  },

  // 🔐 Admin Login page (no layout)
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },

  // 📝 Register page (no layout)
  {
    path: "/alumni-register",
    element: <AlumniRegister />,
  },

  // 🔑 Set password page (from email link)
  {
    path: "/set-password",
    element: <SetPassword />,
  },

  // 🛡️ Admin Dashboard (Protected)
  // 🛡️ Admin Panel (Protected)
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      {
        path: "alumni-approval",
        element: <AdminAlumniApproval />,
      },
      {
        path: "alumni-list",
        element: <AluminiList />,
      },
      {
        path: "messages",
        element: <AdminInbox />,
      },
    ],
  },

  // 🎓 Alumni Panel Layout (Protected)
  {
    path: "/alumni",
    element: (
      <ProtectedRoute>
        <AlumniLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AlumniDashboard /> },
      { path: "discussion", element: <Discussion /> },
      { path: "calendar", element: <EventsCalendar /> },
      { path: "directory", element: <AlumniDirectory /> },
      { path: "profile", element: <Profile /> },
      { path: "resources", element: <LatestResources /> },
      { path: "messages", element: <Messages /> },
      { path: "notifications", element: <Notifications /> },
      { path: "resourcessection", element: <ResourcesSection /> },





    ],
  },
]);

export default browserRoutes;
