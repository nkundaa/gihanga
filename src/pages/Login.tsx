import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MagneticButton } from "../components/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Login failed. Check your credentials.";
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
            <LogIn className="mx-auto h-8 w-8 text-[#BFD7F1]" />
            <h1 className="mt-4 font-display text-2xl font-black tracking-[-0.05em]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#666666]">Sign in to your GIHANGA account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#BFD7F1]"
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666]">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <MagneticButton type="submit" variant="berry" disabled={busy} className="w-full justify-center px-6 py-4">
              {busy ? "Signing in…" : "Sign in"}
            </MagneticButton>
          </form>

          <p className="mt-6 text-center text-sm text-[#666666]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#111111] underline-grow">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
