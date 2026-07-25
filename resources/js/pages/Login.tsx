import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";
import Seo from "../components/Seo";

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
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#F8F9FA] px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:pb-0 lg:pt-32">
      <Seo title="Sign In - Gihanga Market" description="Sign in to your GIHANGA account to shop, manage orders, and more." />
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#111111]/[0.08] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(17,17,17,0.06)]">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <LogIn className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-black tracking-[-0.05em] text-[#111111]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#666666]">Sign in to your GIHANGA account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-4 text-sm text-[#EF4444]">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#111111]/15 bg-white px-4 py-3.5 pr-11 text-sm text-[#111111] outline-none transition-all duration-200 placeholder:text-[#999999] focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#999999] hover:text-[#111111] transition">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={busy} size="lg">
              {busy ? "Signing in" : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-xs font-bold uppercase tracking-[0.18em] text-[#666666] underline-grow">
              Forgot password?
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-[#666666]">
            Don't have an account?{" "}
            <Link to="/register" className="py-1 font-bold text-[#111111] underline-grow">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

