import { useState } from "react";
import { Camera, CheckCircle2, ShieldCheck, Smartphone, Upload, User } from "lucide-react";
import { MagneticButton } from "../components/ui";
import { api } from "../api";

const stepRequired: Record<number, string[]> = {
  0: ["fullName", "phone", "email", "storeName", "businessName"],
  1: ["paymentNumber", "paymentProvider"],
  2: ["idFront", "idBack", "agreeVerification", "agreeSellerAgreement"],
};

type FormState = Record<string, string | boolean>;

const initialForm: FormState = {
  fullName: "", phone: "", email: "",
  storeName: "", businessName: "",
  paymentNumber: "", paymentProvider: "",
  idFront: "", idBack: "", selfie: "",
  agreeVerification: false, agreeSellerAgreement: false,
};

export default function SellApply() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.id]: value }));
    if (errors[target.id]) setErrors((prev) => { const n = { ...prev }; delete n[target.id]; return n; });
  };

  const handleFile = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileNames((prev) => ({ ...prev, [id]: file.name }));
      setForm((prev) => ({ ...prev, [id]: URL.createObjectURL(file) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.id]: true }));
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    const err = validateField(e.target.id, value as string | boolean);
    if (err) setErrors((prev) => ({ ...prev, [e.target.id]: err }));
    else setErrors((prev) => { const n = { ...prev }; delete n[e.target.id]; return n; });
  };

  const validateField = (id: string, value: string | boolean): string => {
    const v = typeof value === "string" ? value.trim() : value;
    switch (id) {
      case "fullName": return !v ? "Full name is required" : "";
      case "phone": return !v ? "Phone number is required" : !/^[\d\s\+\-\(\)]{7,}$/.test(v.toString()) ? "Enter a valid phone number" : "";
      case "email": return !v ? "Email is required" : !/^\S+@\S+\.\S+$/.test(v.toString()) ? "Enter a valid email address" : "";
      case "storeName": return !v ? "Store name is required" : "";
      case "businessName": return !v ? "Business name is required" : "";
      case "paymentNumber": return !v ? "Mobile money number is required" : !/^[\d\s\+\-\(\)]{7,}$/.test(v.toString()) ? "Enter a valid phone number" : "";
      case "paymentProvider": return !v ? "Select a mobile money provider" : "";
      case "idFront": return !v ? "Upload front of ID / Passport" : "";
      case "idBack": return !v ? "Upload back of ID / Passport" : "";
      case "agreeVerification": return !v ? "You must agree to verification" : "";
      case "agreeSellerAgreement": return !v ? "You must accept the seller agreement" : "";
      default: return "";
    }
  };

  const allRequired = (): string[] => ["fullName", "phone", "email", "storeName", "businessName", "paymentNumber", "paymentProvider", "idFront", "idBack", "agreeVerification", "agreeSellerAgreement"];

  const validateStep = (s: number): boolean => {
    const ids = stepRequired[s] || [];
    const newErrors: Record<string, string> = {};
    ids.forEach((id) => {
      const val = typeof form[id] === "boolean" ? form[id] : (form[id] as string);
      const err = validateField(id, val as string | boolean);
      if (err) newErrors[id] = err;
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(ids.map((k) => [k, true])) }));
    return Object.keys(newErrors).length === 0;
  };

  const totalSteps = Object.keys(stepRequired).length;
  const handleNext = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, totalSteps - 1)); };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setSubmitting(true);
    setApiError("");

    try {
      const password = Math.random().toString(36).slice(-12);

      await api.auth.register({
        name: form.fullName as string,
        email: form.email as string,
        password,
        password_confirmation: password,
        phone: form.phone as string,
        role: "seller",
        store_name: form.storeName as string,
        payment_number: form.paymentNumber as string,
        payment_provider: form.paymentProvider as string,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(0);
    setForm({ ...initialForm });
    setTouched({});
    setErrors({});
    setFileNames({});
    setApiError("");
  };

  const inputCls = (id: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
      touched[id] && errors[id]
        ? "border-red-400 focus:border-red-500"
        : "border-black/10 focus:border-[#BFD7F1]"
    } bg-white`;

  const labelCls = "mb-1.5 block text-[10px] font-black uppercase tracking-[0.24em] text-[#888888]";

  const renderField = (id: string, label: string, opts?: { type?: string; placeholder?: string }) => {
    const req = allRequired().includes(id);
    return (
      <div>
        <label htmlFor={id} className={labelCls}>{label} {req ? <span className="text-red-400">*</span> : null}</label>
        <input id={id} type={opts?.type || "text"} value={form[id] as string} onChange={handleChange} onBlur={handleBlur} className={inputCls(id)} placeholder={opts?.placeholder} />
        {touched[id] && errors[id] ? <p className="mt-1 text-xs font-bold text-red-500">{errors[id]}</p> : null}
      </div>
    );
  };

  const renderSelect = (id: string, label: string, options: { value: string; label: string }[]) => {
    const req = allRequired().includes(id);
    return (
      <div>
        <label htmlFor={id} className={labelCls}>{label} {req ? <span className="text-red-400">*</span> : null}</label>
        <select id={id} value={form[id] as string} onChange={handleChange} onBlur={handleBlur} className={inputCls(id)}>
          <option value="">Select provider</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {touched[id] && errors[id] ? <p className="mt-1 text-xs font-bold text-red-500">{errors[id]}</p> : null}
      </div>
    );
  };

  const renderCheckbox = (id: string, label: string) => (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#555]">
      <input id={id} type="checkbox" checked={!!form[id]} onChange={handleChange} onBlur={handleBlur} className="mt-0.5 h-4 w-4 rounded border-black/20 accent-[#BFD7F1]" />
      <span>{label}</span>
    </label>
  );

  const renderFileUpload = (id: string, label: string, icon: React.ReactNode) => {
    const req = allRequired().includes(id);
    return (
      <div>
        <label className={labelCls}>{label} {req ? <span className="text-red-400">*</span> : null}</label>
        <label htmlFor={id} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-5 text-sm transition ${touched[id] && errors[id] ? "border-red-400 bg-red-50" : "border-black/15 bg-white hover:border-[#BFD7F1] hover:bg-[#BFD7F1]/5"}`}>
          <span className="shrink-0 text-[#BFD7F1]">{icon}</span>
          <span className="text-[#888]">{fileNames[id] || "Click to upload"}</span>
          {fileNames[id] ? <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-500" /> : null}
        </label>
        <input id={id} type="file" accept="image/*" onChange={handleFile(id)} onBlur={() => setTouched((p) => ({ ...p, [id]: true }))} className="hidden" />
        {touched[id] && errors[id] ? <p className="mt-1 text-xs font-bold text-red-500">{errors[id]}</p> : null}
      </div>
    );
  };

  return (
    <div className="bg-[#F8F9FA]">
      <section className="relative overflow-hidden bg-[#111111] px-5 pb-16 pt-36 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-44">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,215,241,0.22),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(255,213,234,0.18),transparent_32%)]" />
        <div aria-hidden className="luxury-orb right-[10%] top-[20%] h-72 w-72 bg-[#BFD7F1]/20" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:gap-3 sm:text-xs sm:tracking-[0.42em]">
            <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" /> KYC/KYB verification
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(1.5rem,7vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] sm:mt-6">
            Apply to sell on <span className="font-editorial normal-case text-[#BFD7F1">GIHANGA</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:mt-8 sm:text-base sm:leading-normal">
            Three-step registration. Set up your store, add your mobile money payout details, and complete KYC verification.
          </p>
        </div>
      </section>

      <section id="form" className="px-5 py-16 sm:py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center" data-reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">
              <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" /> KYC/KYB verification
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">
              Verify to <span className="font-editorial text-[#BFD7F1]">sell</span>
            </h2>
          </div>

          <div className="mx-auto mt-14 max-w-3xl" data-reveal>
            {submitted ? (
              <div className="rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA] p-8 text-center sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="mt-5 font-display text-2xl font-black tracking-[-0.04em]">Application submitted for <span className="text-[#BFD7F1]">{form.storeName as string}</span></p>
                <p className="mt-2 text-[#666666]">A verification email has been sent to <b>{form.email as string}</b></p>
                <p className="mt-1 text-sm text-[#888]">We will verify your documents and contact you within 2 business days.</p>
                <div className="mx-auto mt-8 h-px max-w-xs bg-black/[0.06]" />
                <div className="mt-6 grid gap-3 text-left text-sm sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-3"><dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#666]">Name</dt><dd className="mt-1 font-bold">{form.fullName as string}</dd></div>
                  <div className="rounded-xl bg-white p-3"><dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#666]">Store</dt><dd className="mt-1 font-bold">{form.storeName as string}</dd></div>
                  <div className="rounded-xl bg-white p-3"><dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#666]">Phone</dt><dd className="mt-1 font-bold">{form.phone as string}</dd></div>
                </div>
                <div className="mx-auto mt-3 grid max-w-xs gap-3 text-left text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-3"><dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#666]">Payment</dt><dd className="mt-1 font-bold">{form.paymentNumber as string}</dd></div>
                  <div className="rounded-xl bg-white p-3"><dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#666]">Provider</dt><dd className="mt-1 font-bold capitalize">{form.paymentProvider as string}</dd></div>
                </div>
                <button onClick={resetForm} className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#BFD7F1] underline underline-offset-4 transition hover:text-[#111]">Submit another</button>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
                <div className="border-b border-black/[0.06] px-6 py-5 sm:px-10">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#999]">Step {step + 1} of {totalSteps}</p>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#BFD7F1]">{Math.round(((step + 1) / totalSteps) * 100)}%</p>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-[#BFD7F1]" : "bg-black/[0.08]"}`} />
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()} noValidate className="p-6 sm:p-10">
                  {step === 0 && <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BFD7F1] text-xs font-black text-[#111]">01</span>
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#BFD7F1]"><User className="h-3.5 w-3.5" /> Contact &amp; Store</span>
                    </div>
                    <div className="mt-6 space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        {renderField("fullName", "Full Name", { placeholder: "Your full name" })}
                        {renderField("phone", "Phone Number", { type: "tel", placeholder: "+250 7XX XXX XXX" })}
                      </div>
                      {renderField("email", "Email Address", { type: "email", placeholder: "you@example.com" })}
                      <div className="grid gap-5 sm:grid-cols-2">
                        {renderField("storeName", "Store Name", { placeholder: "As customers will see it" })}
                        {renderField("businessName", "Business Name", { placeholder: "Registered or trading name" })}
                      </div>
                    </div>
                  </div>}

                  {step === 1 && <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BFD7F1] text-xs font-black text-[#111]">02</span>
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#BFD7F1]"><Smartphone className="h-3.5 w-3.5" /> Mobile Money Payout</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[#666666]">Set up your mobile money payout details. This is where you will receive payments from customer orders.</p>
                    <div className="mt-6 space-y-5">
                      {renderField("paymentNumber", "Mobile Money Number", { type: "tel", placeholder: "+250 7XX XXX XXX" })}
                      {renderSelect("paymentProvider", "Mobile Money Provider", [
                        { value: "mtn", label: "MTN Mobile Money" },
                        { value: "airtel", label: "Airtel Money" },
                        { value: "mixx_by_bank", label: "Mixx by Bank" },
                        { value: "cash", label: "Cash on Delivery" },
                      ])}
                    </div>
                  </div>}

                  {step === 2 && <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BFD7F1] text-xs font-black text-[#111]">03</span>
                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#BFD7F1]"><ShieldCheck className="h-3.5 w-3.5" /> KYC/KYB Verification</span>
                    </div>
                    <div className="mt-6 space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        {renderFileUpload("idFront", "Front of ID / Passport", <Upload className="h-5 w-5" />)}
                        {renderFileUpload("idBack", "Back of ID / Passport", <Upload className="h-5 w-5" />)}
                      </div>
                      {renderFileUpload("selfie", "Selfie (Face Verification)", <Camera className="h-5 w-5" />)}
                      <div className="rounded-xl bg-[#FFF8E7] p-4 text-xs leading-6 text-[#886633]">
                        Your documents are encrypted and used only for identity verification. We never share your data.
                      </div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#888]">Agreement</p>
                      {renderCheckbox("agreeVerification", "I consent to KYC/KYB identity and business verification")}
                      {renderCheckbox("agreeSellerAgreement", "I accept the GIHANGA Seller Agreement")}
                    </div>
                  </div>}

                  {apiError ? (
                    <div className="mt-6 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600">{apiError}</div>
                  ) : null}

                  <div className="mt-10 flex items-center justify-between border-t border-black/[0.06] pt-8">
                    {step > 0 ? (
                      <button type="button" onClick={handleBack} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#666] transition hover:text-[#111]">
                        ← Back
                      </button>
                    ) : <div />}
                    {step < totalSteps - 1 ? (
                      <button type="button" onClick={handleNext} className="min-h-11 rounded-full bg-[#BFD7F1] px-8 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#111] shadow-[0_10px_30px_rgba(191,215,241,0.3)] transition hover:rounded-2xl sm:px-10 sm:py-3.5">
                        Next step →
                      </button>
                    ) : (
                      <MagneticButton type="button" variant="berry" className="px-8 py-3.5" disabled={submitting} onClick={handleSubmit}>
                        {submitting ? (
                          <span className="flex items-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Submitting…</span>
                        ) : "Submit verification"}
                      </MagneticButton>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}