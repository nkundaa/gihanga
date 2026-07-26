import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";
import Seo from "../components/Seo";

type FieldErrors = Record<string, string>;

const validate = (f: { name: string; email: string; phone: string; password: string; confirm: string }): FieldErrors => {
  const e: FieldErrors = {};
  if (!f.name.trim()) e.name = "Full name is required";
  if (!f.email.trim()) e.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address";
  if (f.phone && !/^[\d\s\+\-\(\)]{7,}$/.test(f.phone)) e.phone = "Enter a valid phone number";
  if (!f.password) e.password = "Password is required";
  else if (f.password.length < 8) e.password = "Password must be at least 8 characters";
  if (f.password !== f.confirm) e.confirm = "Passwords do not match";
  return e;
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => { const n = { ...p }; delete n[e.target.name]; return n; });
    if (serverError) setServerError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
    const fieldErrors = validate(form);
    if (fieldErrors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: fieldErrors[e.target.name] }));
    else setErrors((p) => { const n = { ...p }; delete n[e.target.name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true });
    if (Object.keys(fieldErrors).length > 0) return;
    setBusy(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, password_confirmation: form.confirm, phone: form.phone || undefined });
      navigate("/home");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      const msg = data ? Object.values(data).flat().join(" ") : "Registration failed. Try again.";
      setServerError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#FAF9F5] px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:pb-0 lg:pt-32">
      <Seo title="Create Account - Gihanga Market" description="Join GIHANGA as a customer and discover verified fashion boutiques in Kigali." />
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#14171F]/[0.08] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,23,31,0.06)]">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2C5A82]/10">
              <UserPlus className="h-7 w-7 text-[#2C5A82]" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-black tracking-[-0.05em] text-[#14171F]">Create account</h1>
            <p className="mt-2 text-sm text-[#6D6D6D]">Join GIHANGA as a customer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {serverError && (
              <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-4 text-sm text-[#EF4444]">
                {serverError}
              </div>
            )}

            <Input
              label="Full name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Jean Baptiste Mugabo"
              error={touched.name ? errors.name : undefined}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="jean@example.com"
              error={touched.email ? errors.email : undefined}
            />

            <Input
              label="Phone (optional)"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+250 788 000 000"
              error={touched.phone ? errors.phone : undefined}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Min 8 characters"
              error={touched.password ? errors.password : undefined}
            />

            <Input
              label="Confirm password"
              name="confirm"
              type="password"
              required
              value={form.confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Repeat your password"
              error={touched.confirm ? errors.confirm : undefined}
            />

            <Button type="submit" variant="primary" fullWidth loading={busy} size="lg">
              {busy ? "Creating account" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6D6D6D]">
            Already have an account?{" "}
            <Link to="/login" className="py-1 font-bold text-[#14171F] underline-grow">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


