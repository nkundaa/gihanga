import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MagneticButton } from "../components/ui";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      await register({ name, email, password, password_confirmation: confirm, phone: phone || undefined });
      navigate("/home");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      const msg = data ? Object.values(data).flat().join(" ") : "Registration failed. Try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-5 pt-28 sm:pt-32">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-black/[0.08] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
          <div className="mb-8 text-center">
            <UserPlus className="mx-auto h-8 w-8 text-[#BFD7F1]" />
            <h1 className="mt-4 font-display text-2xl font-black tracking-[-0.05em]">Create account</h1>
            <p className="mt-2 text-sm text-[#666666]">Join GIHANGA as a customer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Full name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="Jean Baptiste Mugabo" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="jean@example.com" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Phone (optional)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="+250 788 000 000" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="Min 8 characters" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Confirm password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="Repeat your password" />
            </div>

            <MagneticButton type="submit" variant="berry" disabled={busy} className="w-full justify-center px-6 py-4">
              {busy ? "Creating account…" : "Create account"}
            </MagneticButton>
          </form>

          <p className="mt-6 text-center text-sm text-[#666666]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#111111] underline-grow">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
