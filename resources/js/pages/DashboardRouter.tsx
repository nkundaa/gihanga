import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CustomerDashboard from "./Dashboard";

export default function DashboardRouter() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "seller") {
    return <Navigate to="/seller" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <CustomerDashboard />;
}

