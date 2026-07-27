import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Store } from "lucide-react";
import { Button } from "../components/ui";
import { api } from "../api";
import Seo from "../components/Seo";

const STORAGE_KEY = "gihanga_seller_draft";

export default function SellApply() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", storeName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [successStore, setSuccessStore] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.name || saved.phone || saved.email || saved.storeName) {
          setForm(saved);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch {}
  }, [form]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[\d\s+\-()]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.storeName.trim()) e.storeName = "Store name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");

    try {
      const password = Math.random().toString(36).slice(-12);
      await api.auth.register({
        name: form.name,
        email: form.email,
        password,
        password_confirmation: password,
        phone: form.phone,
        role: "seller",
        store_name: form.storeName,
        business_name: form.storeName,
      });
      setSuccessStore(form.storeName);
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (id: string) =>
    `min-h-12 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
      errors[id] ? "border-red-400 focus:border-red-500" : "border-black/10 focus:border-[#2C5A82]"
    } bg-white`;

  const labelCls = "mb-1.5 block text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#888]";

  return (
    <div className="bg-[#FAF9F5]">
      <Seo title="Sell - Gihanga Market" path="/sell-apply" description="Apply to sell on GIHANGA" />
      <section className="relative bg-[#14171F] px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8 lg:pb-16 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 text-[0.55rem] font-black uppercase tracking-[0.25em] text-[#2C5A82]">
            <ShieldCheck className="h-3 w-3" /> Start selling
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(1.5rem,6vw,5rem)] font-black leading-[0.88] tracking-[-0.08em]">
            Open your store on <span className="font-editorial text-[#2C5A82]">GIHANGA</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Enter your details below. We'll create your seller account and guide you through the rest.</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 sm:py-16">
        <div className="mx-auto max-w-lg">
          {submitted ? (
            <div className="rounded-xl border border-black/[0.08] bg-white p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <p className="mt-4 font-display text-xl font-black">Store created!</p>
              <p className="mt-2 text-sm text-[#6D6D6D]">
                <span className="font-bold text-[#2C5A82]">{successStore}</span> has been registered.
              </p>
              <p className="mt-1 text-xs text-[#888]">We've sent login details to your email. You can now complete your store profile — add your logo, banner, payment info, and verify your identity.</p>
              <div className="mt-6 flex flex-col gap-2">
                <Button to="/login" variant="gold" className="min-h-12 w-full justify-center py-3 text-sm">Sign in to your store</Button>
                <Button to="/" variant="secondary" className="min-h-12 w-full justify-center py-3 text-sm">Back to home</Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2C5A82] text-xs font-black text-white">01</span>
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#2C5A82]"><Store className="h-3.5 w-3.5" /> Store details</span>
              </div>
              <p className="mb-6 text-sm text-[#6D6D6D]">Start with the basics. You can add your business documents, payment details, and store media later from your dashboard.</p>

              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Your full name *</label>
                  <input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls("name")} placeholder="Jean Baptiste Mugabo" />
                  {errors.name && <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Phone *</label>
                    <input id="phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls("phone")} placeholder="+250 7XX XXX XXX" />
                    {errors.phone && <p className="mt-1 text-xs font-bold text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls("email")} placeholder="you@example.com" />
                    {errors.email && <p className="mt-1 text-xs font-bold text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Store name *</label>
                  <input id="storeName" value={form.storeName} onChange={e => setForm({ ...form, storeName: e.target.value })} className={inputCls("storeName")} placeholder="As customers will see it" />
                  {errors.storeName && <p className="mt-1 text-xs font-bold text-red-500">{errors.storeName}</p>}
                </div>
              </div>

              {apiError && <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600">{apiError}</div>}

              <div className="mt-6 rounded-xl bg-[#FAF9F5] p-3 text-xs text-[#6D6D6D]">
                <p className="font-bold text-[#14171F]">What happens next?</p>
                <ul className="mt-2 space-y-1">
                  <li>• We'll create your seller account and send login details to your email</li>
                  <li>• Sign in to complete your store profile (logo, banner, description)</li>
                  <li>• Add your mobile money payout details</li>
                  <li>• Complete KYC/KYB verification to start selling</li>
                </ul>
              </div>

              <Button variant="gold" className="mt-6 min-h-12 w-full justify-center py-3 text-sm" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating your store..." : "Create your store"}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
