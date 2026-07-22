import { useState } from "react";

import { CheckCircle2, CreditCard, Lock, MapPin, Smartphone, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatRwf } from "../data/catalog";
import { api } from "../api";
import { cn } from "../utils/cn";
import { MagneticButton } from "../components/ui";

type PaymentMethod = "card" | "mobile_money";

const paymentOptions: Array<{ value: PaymentMethod; label: string; icon: typeof CreditCard }> = [
  { value: "card", label: "Card Payment", icon: CreditCard },
  { value: "mobile_money", label: "Mobile Money", icon: Smartphone },
];

export default function Checkout() {
  const { lines, subtotal, count } = useCart();
  const { isAuthenticated } = useAuth();
  const [payment, setPayment] = useState<PaymentMethod>("mobile_money");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"details" | "payment" | "confirm">("details");
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [locError, setLocError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });

  const detectLocation = () => {
    if (!navigator.geolocation) { setLocError("Geolocation is not supported by your browser."); return; }
    setDetecting(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const mapsUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
        setLocation({ lat, lng, address: mapsUrl });
        setDetecting(false);
      },
      (err) => {
        setLocError(err.code === 1 ? "Location access denied. Enable GPS and try again." : "Could not detect location. Try again.");
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const placeOrder = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.orders.create({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email,
        customer_address: form.address,
        delivery_notes: form.notes || null,
        payment_method: payment,
        latitude: location?.lat ?? null,
        longitude: location?.lng ?? null,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const msg = typeof data?.message === "string" ? data.message
        : data ? Object.values(data).flat().join(". ")
        : "Failed to place order. Check your connection and try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const delivery = 0;
  const total = subtotal + delivery;

  if (count === 0 && !submitted) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 pt-36 text-center">
        <p className="font-editorial text-6xl text-[#BFD7F1]">∅</p>
        <h1 className="font-display text-3xl font-black tracking-[-0.05em]">Your bag is empty</h1>
        <p className="max-w-sm text-[#666666]">Add some pieces before checking out.</p>
        <MagneticButton to="/shop" variant="berry" className="px-6 py-3 text-sm">Browse shop</MagneticButton>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 pt-36 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#BFD7F1]">
          <CheckCircle2 className="h-10 w-10 text-[#111111]" />
        </div>
        <h1 className="font-display text-3xl font-black tracking-[-0.05em]">Order confirmed!</h1>
        <p className="max-w-sm text-[#666666]">Your order has been placed. You will receive a confirmation via SMS and email with live Google Maps tracking for your delivery.</p>
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Order summary</p>
          <p className="mt-2 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">{formatRwf(total)}</p>
          <p className="text-sm text-[#666666]">{count} item{count === 1 ? "" : "s"} · {payment === "mobile_money" ? "Mobile Money" : "Card"} payment</p>
        </div>
        <div className="flex gap-3">
          <MagneticButton to="/shop" variant="dark" className="px-6 py-3 text-sm">Continue shopping</MagneticButton>
          <MagneticButton to="/" variant="light" className="px-6 py-3 text-sm">Back to home</MagneticButton>
        </div>
        <a href="https://maps.google.com/maps?q=Kigali+Rwanda" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#BFD7F1] underline underline-offset-4 transition hover:text-[#111]">
          <MapPin className="h-3.5 w-3.5" /> Track delivery on Google Maps
        </a>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 pt-36 text-center">
        <p className="font-editorial text-6xl text-[#BFD7F1]">🔒</p>
        <h1 className="font-display text-3xl font-black tracking-[-0.05em]">Sign in to checkout</h1>
        <p className="max-w-sm text-[#666666]">You need to be signed in to place an order.</p>
        <div className="flex gap-3">
          <MagneticButton to="/login" variant="berry" className="px-6 py-3 text-sm">Sign in</MagneticButton>
          <MagneticButton to="/register" variant="dark" className="px-6 py-3 text-sm">Create account</MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] pt-28 lg:pt-32">
      <div className="mx-auto max-w-7xl px-5 pb-16 sm:pb-24 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-black uppercase tracking-[0.36em] text-[#BFD7F1]">Checkout</p>
          <h1 className="mt-3 font-display text-[clamp(1.4rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">Complete your order</h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-8">
            <div className="flex gap-3">
              {(["details", "payment", "confirm"] as const).map((s, i) => (
                <button key={s} type="button" onClick={() => setStep(s)} className={cn("flex min-h-11 min-w-11 items-center gap-2 rounded-full border px-3 py-1.5 text-[0.6rem] sm:px-4 sm:py-2 sm:text-xs font-bold uppercase tracking-[0.18em] transition", step === s ? "border-[#111111] bg-[#111111] text-white" : "border-black/10 bg-white text-[#666666]")}>
                  <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-current text-[0.5rem] sm:text-[0.55rem] font-black text-[#F8F9FA]">{i + 1}</span>
                  {s === "details" ? "Details" : s === "payment" ? "Payment" : "Confirm"}
                </button>
              ))}
            </div>

            {step === "details" && (
              <form className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8" onSubmit={(e) => e.preventDefault()}>
                <h2 className="font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Delivery details</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Full name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="Jean Baptiste Mugabo" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="+250 788 000 000" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="jean@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Delivery address</label>
                    <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="Kacyiru, KG 123 St, Kigali" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Your location</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input readOnly value={location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ""} className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1] placeholder:text-[#aaa]" placeholder="Auto-detected coordinates" />
                      <button type="button" onClick={detectLocation} disabled={detecting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-[#F8F9FA] px-4 py-3 text-sm font-bold text-[#111] transition hover:bg-[#BFD7F1]/20 hover:border-[#BFD7F1] disabled:opacity-50">
                        <MapPin className={cn("h-4 w-4 text-[#BFD7F1]", detecting && "animate-bounce")} /> {detecting ? "Detecting…" : "Detect"}
                      </button>
                    </div>
                    {locError && <p className="mt-1.5 text-xs text-red-500">{locError}</p>}
                    {location && (
                      <a href={location.address} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#BFD7F1] underline underline-offset-2 transition hover:text-[#111]">
                        <MapPin className="h-3 w-3" /> View on Google Maps
                      </a>
                    )}
                    <p className="mt-1.5 text-xs text-[#888]">Click "Detect" to auto-detect your location via GPS. The delivery rider will use this exact pin.</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Delivery notes</label>
                    <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="Landmark, gate number, instructions for the rider..." />
                  </div>
                </div>
                <MagneticButton variant="berry" className="mt-6 w-full sm:w-auto px-6 py-3 text-sm" onClick={() => setStep("payment")}>
                  Continue to payment
                </MagneticButton>
              </form>
            )}

            {step === "payment" && (
              <div className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8">
                <h2 className="font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Payment method</h2>
                <p className="mt-2 text-sm text-[#666666]">Choose your preferred payment method.</p>
                <div className="mt-6 grid gap-3">
                  {paymentOptions.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setPayment(opt.value)} className={cn("flex items-center gap-4 rounded-2xl border p-5 text-left transition", payment === opt.value ? "border-[#BFD7F1] bg-[#BFD7F1]/10" : "border-black/10 bg-white hover:border-black/30")}>
                      <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", payment === opt.value ? "bg-[#111111] text-[#BFD7F1]" : "bg-[#F8F9FA] text-[#666666]")}>
                        <opt.icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="font-display text-lg font-black tracking-[-0.03em]">{opt.label}</p>
                        <p className="text-sm text-[#666666]">{opt.value === "card" ? "Visa, Mastercard" : "MTN Mobile Money, Airtel Money"}</p>
                      </div>
                      {payment === opt.value ? <CheckCircle2 className="ml-auto h-5 w-5 text-[#BFD7F1]" /> : null}
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-black/10 bg-[#F8F9FA] p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#666666]">
                    <Lock className="h-4 w-4" /> Secure checkout
                  </div>
                  <p className="mt-2 text-sm text-[#666666]">Your payment information is encrypted and processed securely. We do not store card details.</p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <MagneticButton variant="light" className="w-full sm:w-auto px-6 py-3 text-sm" onClick={() => setStep("details")}>Back</MagneticButton>
                  <MagneticButton variant="berry" className="w-full sm:w-auto px-6 py-3 text-sm" onClick={() => setStep("confirm")}>Review order</MagneticButton>
                </div>
              </div>
            )}

            {step === "confirm" && (
              <div className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8">
                <h2 className="font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Confirm order</h2>
                <p className="mt-2 text-sm text-[#666666]">Please review your order before placing it.</p>
                {error && (
                  <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
                )}
                <div className="mt-6 space-y-4">
                  {lines.map((line) => (
                    <div key={line.key} className="flex gap-4 rounded-2xl bg-[#F8F9FA] p-4">
                      <img src={line.product.images[0]} alt={line.product.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <div>
                          <p className="font-display text-base font-black tracking-[-0.03em]">{line.product.name}</p>
                          <p className="mt-0.5 text-xs text-[#666666]">Qty {line.quantity}{line.size ? ` · ${line.size}` : ""}{line.color ? ` · ${line.color}` : ""}</p>
                        </div>
                        <p className="font-display font-black">{formatRwf(line.product.price * line.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-black/10 bg-[#F8F9FA] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Payment</p>
                  <p className="mt-1 font-display text-lg font-black tracking-[-0.03em]">{payment === "mobile_money" ? "Mobile Money" : "Card"}</p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <MagneticButton variant="light" className="w-full sm:w-auto px-6 py-3 text-sm" onClick={() => setStep("payment")}>Back</MagneticButton>
                  <MagneticButton variant="berry" className="w-full sm:w-auto px-6 py-3 text-sm" onClick={placeOrder} disabled={submitting}>
                    {submitting ? "Placing order…" : "Place order"}
                  </MagneticButton>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Order summary</p>
              <div className="mt-5 space-y-3 divide-y divide-black/[0.08]">
                {lines.map((line) => (
                  <div key={line.key} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{line.product.name}</p>
                      <p className="text-xs text-[#666666]">Qty {line.quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold">{formatRwf(line.product.price * line.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Subtotal</span>
                  <span className="font-bold">{formatRwf(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Delivery</span>
                  <span className="font-bold">{delivery === 0 ? "Free" : formatRwf(delivery)}</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2">
                  <span className="font-display text-lg font-black tracking-[-0.03em]">Total</span>
                  <span className="font-display text-lg font-black tracking-[-0.03em]">{formatRwf(total)}</span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-[#666666]">
                <Truck className="h-4 w-4 text-[#BFD7F1]" /> Free Kigali delivery included
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
