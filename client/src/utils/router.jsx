import { createBrowserRouter } from "react-router-dom";

// ── Layouts & Guards ──
import App from "../App";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import AlumniLayout from "../components/layout/AlumniLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// ── Public Pages ──
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

// ── Auth Pages ──
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AlumniLogin from "../pages/AluminiLogin.jsx";
import AlumniRegister from "../pages/AlumniRegister.jsx";
import SetPassword from "../pages/SetPassword.jsx";

// ── Admin Pages ──
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";
import AdminAlumniApproval from "../pages/admin/AdminAlumniApproval.jsx";
import AdminBadgeRequests from "../pages/admin/AdminBadgeRequests.jsx";
import AdminBadgeManagement from "../pages/admin/AdminBadgeManagement.jsx";
import AluminiList from "../pages/admin/AluminiList.jsx";
import AdminInbox from "../pages/admin/AdminInbox.jsx";
import AdminSpotlight from "../pages/admin/AdminSpotlight.jsx";
import ArticleList from "../pages/admin/ArticleList.jsx";
import UploadArticle from "../pages/admin/UploadArticles.jsx";
import EditArticle from "../pages/admin/EditArticle.jsx";
import VideoList from "../pages/admin/VideoList.jsx";
import UploadVideos from "../pages/admin/UploadVideos.jsx";
import UploadBooks from "../pages/admin/UploadBooks.jsx";
import UploadEvents from "../pages/admin/UploadEvents.jsx";
import AdminDiscussion from "../pages/admin/AdminDiscussion.jsx";
import AdminSubscribers from "../pages/admin/AdminSubscribers.jsx";

// ── Alumni Pages ──
import AlumniDashboard from "../components/alumni/AlumniDashboard.jsx";
import Discussion from "../components/alumni/Discussions.jsx";
import EventsCalendar from "../components/alumni/EventsCalendar.jsx";
import AlumniDirectory from "../pages/alumni/AluminiDirectory.jsx";
import Profile from "../pages/alumni/Profile.jsx";
import Notifications from "../components/alumni/Notifications.jsx";
import ResourcesSection from "../pages/alumni/Resourcessection.jsx";
import BookList from "../pages/admin/BookList.jsx";
import EventList from "../pages/admin/EventList.jsx";
import Spotlight from "../components/alumni/Spotlight.jsx";
import ProgramsSection from "../components/alumni/ProgramsSection.jsx";
import EventsSection from "../components/alumni/EventsSection.jsx";
import AlumniEngagement from "../components/alumni/AlumniEngagement.jsx";
import ArticleDetail from "../pages/alumni/ArticleDetail.jsx";
import Activity from "../pages/alumni/Activity.jsx";
import ContactUs from "../components/alumni/ContactUs.jsx";
import AdminProgramsManager from "../components/admin/AdminProgramsManager.jsx";
import AdminProgramsList from "../components/admin/AdminProgramsList.jsx";
import AdminEngagementSubmissions from "../components/admin/AdminEngagementSubmissions.jsx";
import AdminEventRequests from "../components/admin/AdminEventRequests.jsx";
import AdminContactRequests from "../components/admin/AdminContactRequests.jsx";

// ─────────────────────────────────────────────
const browserRoutes = createBrowserRouter([
  // ── 🌐 Public Website ──────────────────────
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
      { path: "our-signature", element: <OurSignature /> },
      { path: "leadership-hub", element: <LeadershipHub /> },
      { path: "lets-talk", element: <LetsTalk /> },
      { path: "articles", element: <Articles /> },
      { path: "videos", element: <Videos /> },
      { path: "books", element: <Books /> },
      { path: "events", element: <Events /> },
    ],
  },

  // ── 🔐 Auth Pages ──────────────────────────
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/alumni-login", element: <AlumniLogin /> },
  { path: "/alumni-register", element: <AlumniRegister /> },
  { path: "/set-password", element: <SetPassword /> },

  // ── 🛡️ Admin Panel ─────────────────────────
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
      { path: "profile", element: <AdminProfile /> },

      // Alumni Management
      { path: "alumni-approval", element: <AdminAlumniApproval /> },
      { path: "badge-requests", element: <AdminBadgeRequests /> },
      { path: "badge-management", element: <AdminBadgeManagement /> },
      { path: "alumni-list", element: <AluminiList /> },
      { path: "messages", element: <AdminInbox /> },
      { path: "spotlight", element: <AdminSpotlight /> },

      // Articles
      { path: "articles", element: <ArticleList /> },
      { path: "upload-article", element: <UploadArticle /> },
      { path: "articles/edit/:id", element: <EditArticle /> },

      // Videos
      { path: "videos", element: <VideoList /> },
      { path: "videos/edit/:id", element: <UploadVideos /> },
      { path: "upload-video", element: <UploadVideos /> },

      // Books
      { path: "books", element: <BookList /> },
      { path: "upload-book", element: <UploadBooks /> },
      { path: "books/edit/:id", element: <UploadBooks /> },

      // Events
      { path: "events", element: <EventList /> },
      { path: "events/edit/:id", element: <UploadEvents /> },
      { path: "upload-event", element: <UploadEvents /> },
      // Discussion moderation
      { path: "discussion", element: <AdminDiscussion /> },
      { path: "programs", element: <AdminProgramsList /> },
      { path: "programs/upload", element: <AdminProgramsManager /> },

      // Engagement
      { path: "engage", element: <AdminEngagementSubmissions /> },
      { path: "event/requests", element: <AdminEventRequests /> },
      { path: "contact/requests", element: <AdminContactRequests /> },
      { path: "subscribers", element: <AdminSubscribers /> },



    ],
  },

  // ── 🎓 Alumni Panel ─────────────────────────
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
      { path: "activity", element: <Activity /> },
      { path: "calendar", element: <EventsCalendar /> },
      { path: "directory", element: <AlumniDirectory /> },
      { path: "profile", element: <Profile /> },
      { path: "resources", element: <ResourcesSection /> },
      { path: "notifications", element: <Notifications /> },
      { path: "resourcessection", element: <ResourcesSection /> },
      { path: "spotlight", element: <Spotlight /> },
      { path: "programs", element: <ProgramsSection /> },
      { path: "events", element: <EventsSection /> },
      { path: "engage", element: <AlumniEngagement /> },
      { path: "contact", element: <ContactUs /> },
      { path: "article/:id", element: <ArticleDetail /> },


    ],
  },
]);

export default browserRoutes;
