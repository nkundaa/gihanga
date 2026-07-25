import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";
import Seo from "../components/Seo";

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
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#F8F9FA] px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:pb-0 lg:pt-32">
      <Seo title="Create Account - Gihanga Market" description="Join GIHANGA as a customer and discover verified fashion boutiques in Kigali." />
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#111111]/[0.08] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(17,17,17,0.06)]">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#5BA3CF]/10">
              <UserPlus className="h-7 w-7 text-[#5BA3CF]" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-black tracking-[-0.05em] text-[#111111]">Create account</h1>
            <p className="mt-2 text-sm text-[#666666]">Join GIHANGA as a customer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-4 text-sm text-[#EF4444]">
                {error}
              </div>
            )}

            <Input
              label="Full name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Baptiste Mugabo"
            />

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@example.com"
            />

            <Input
              label="Phone (optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250 788 000 000"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />

            <Input
              label="Confirm password"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
            />

            <Button type="submit" variant="primary" fullWidth loading={busy} size="lg">
              {busy ? "Creating account" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#666666]">
            Already have an account?{" "}
            <Link to="/login" className="py-1 font-bold text-[#111111] underline-grow">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


