import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role = "alumni" }) {
  const { isAuthenticated, isAdminAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-poppins text-slate-600 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (role === "admin") {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin-login" replace />;
    }
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/alumni-login" replace />;
    }
  }

  return children;
}
