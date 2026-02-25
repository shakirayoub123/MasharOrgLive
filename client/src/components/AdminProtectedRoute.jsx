import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = () => {
    const { isAdminAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
                <div className="w-16 h-16 border-4 border-[#0F1C80] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default AdminProtectedRoute;
