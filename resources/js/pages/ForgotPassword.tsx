import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock, Mail, Shield } from "lucide-react";
import { api } from "../api";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const sendResetLink = async () => {
    setSending(true); setError("");
    try {
      await api.auth.forgotPassword({ email });
      setStep("reset");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      setError(typeof data?.message === "string" ? data.message : "Failed to send reset link.");
    }
    finally { setSending(false); }
  };

  const resetPassword = async () => {
    if (password !== passwordConfirm) { setError("Passwords do not match."); return; }
    setSending(true); setError("");
    try {
      await api.auth.resetPassword({ token, email, password, password_confirmation: passwordConfirm });
      setStep("done");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      setError(typeof data?.message === "string" ? data.message : "Failed to reset password.");
    }
    finally { setSending(false); }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-4 py-20">
      <Seo title="Forgot Password - Gihanga Market" path="/forgot-password" />
      <Link to="/login" className="mb-8 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#666666] transition hover:text-[#111111]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
      </Link>

      {step === "done" ? (
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#5BA3CF]">
            <CheckCircle2 className="h-10 w-10 text-[#111111]" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-black tracking-[-0.05em]">Password reset</h1>
          <p className="mt-3 text-[#666666]">Your password has been reset successfully.</p>
          <MagneticButton to="/login" variant="gold" className="mt-8 min-h-12 w-full px-6 py-3 text-sm">Sign in with new password</MagneticButton>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="flex items-center gap-3">
            {step === "email" ? <Mail className="h-5 w-5 text-[#5BA3CF]" /> : <Shield className="h-5 w-5 text-[#5BA3CF]" />}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#5BA3CF]">Security</p>
              <h1 className="font-display text-2xl font-black tracking-[-0.04em]">Forgot password</h1>
            </div>
          </div>

          {error ? <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}

          {step === "email" ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-[#666666]">Enter your email address and we'll send you a reset token.</p>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5BA3CF]" placeholder="you@example.com" />
              </div>
              <MagneticButton variant="gold" className="min-h-12 w-full py-3 text-sm" onClick={sendResetLink} disabled={sending}>
                {sending ? "Sending…" : "Send reset link"}
              </MagneticButton>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-[#666666]">Enter the reset token from your email and choose a new password.</p>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Reset token</label>
                <input value={token} onChange={(e) => setToken(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5BA3CF]" placeholder="Paste token from email" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">New password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5BA3CF]" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Confirm password</label>
                <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5BA3CF]" />
              </div>
              <MagneticButton variant="gold" className="min-h-12 w-full py-3 text-sm" onClick={resetPassword} disabled={sending}>
                {sending ? "Resetting…" : "Reset password"}
              </MagneticButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


