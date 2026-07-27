import { LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-6 px-4 text-center">
        <LayoutDashboard className="h-12 w-12 text-[#2C5A82]" />
        <h1 className="font-display text-3xl font-black">Sign in to view dashboard</h1>
        <MagneticButton to="/login" variant="primary" className="min-h-12 px-6 py-3 text-sm">Sign in</MagneticButton>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] pb-16">
      <Seo title="Dashboard - Gihanga Market" path="/dashboard" description="Your dashboard" />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.36em] text-[#2C5A82]">Overview</p>
          <h1 className="mt-3 font-display text-[clamp(1.5rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">Dashboard</h1>
          <p className="mt-2 text-[#6D6D6D]">Welcome back, {user?.name || "Guest"}.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2C5A82]">Orders</p>
              <p className="mt-2 font-display text-3xl font-black">0</p>
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2C5A82]">Wishlist</p>
              <p className="mt-2 font-display text-3xl font-black">0</p>
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2C5A82]">Account</p>
              <p className="mt-2 font-display text-3xl font-black capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
