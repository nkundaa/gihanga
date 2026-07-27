import { User, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="bg-[#FAF9F5] pb-16">
      <Seo title="Profile - Gihanga Market" path="/profile" description="Manage your profile" />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.36em] text-[#2C5A82]">Account</p>
          <h1 className="mt-3 font-display text-[clamp(1.5rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">Profile</h1>
          <div className="mt-8 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#14171F] text-white">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="font-display text-xl font-black">{user?.name || "Guest"}</p>
                <p className="text-sm text-[#6D6D6D] capitalize">{user?.role || "visitor"}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4 border-t border-black/10 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-[#2C5A82]" />
                <span>{user?.email || "Not signed in"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-[#2C5A82]" />
                <span>{user?.phone || "Not provided"}</span>
              </div>
            </div>
            {!user && (
              <div className="mt-6 flex gap-3">
                <MagneticButton to="/login" variant="primary" className="min-h-12 px-6 py-3 text-sm">Sign in</MagneticButton>
                <MagneticButton to="/register" variant="secondary" className="min-h-12 px-6 py-3 text-sm">Create account</MagneticButton>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
