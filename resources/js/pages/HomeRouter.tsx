import { useAuth } from "../context/AuthContext";
import Opening from "./Opening";
import CustomerDashboard from "./Dashboard";
import SellerDashboard from "./SellerDashboard";
import Admin from "./Admin";

export default function HomeRouter() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5BA3CF] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Opening />;
  }

  if (user?.role === "seller") {
    return <SellerDashboard />;
  }

  if (user?.role === "admin") {
    return <Admin />;
  }

  return <CustomerDashboard />;
}


