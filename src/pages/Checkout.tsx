import { useState } from "react";
import { CheckCircle2, CreditCard, Lock, MapPin, Smartphone, Truck, Wallet } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/i18n";
import { formatRwf } from "../data/catalog";
import { api } from "../api";
import { cn } from "../utils/cn";
import { Button, Skeleton } from "../components/ui";

type PaymentMethod = "mobile_money" | "card" | "cod";

export default function Checkout() {
  const { lines, subtotal, count, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [payment, setPayment] = useState<PaymentMethod>("mobile_money");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });

  const [guestMode, setGuestMode] = useState(() => !!localStorage.getItem("guest_checkout"));
  const enableGuest = () => { localStorage.setItem("guest_checkout", "1"); setGuestMode(true); };

  const delivery = 0;
  const total = subtotal + delivery;

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      setError("Please fill in your name, phone, and delivery address.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.orders.create({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        customer_address: form.address,
        delivery_notes: form.notes || null,
        payment_method: payment,
      });
      clearCart();
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

  if (count === 0 && !submitted) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-4 text-center pt-28 lg:pt-32">
        <p className="font-editorial text-5xl text-[#2C5A82]">∅</p>
        <h1 className="font-display text-2xl font-black">{t("cart.empty")}</h1>
        <Button to="/shop" variant="gold" className="min-h-12 px-6 py-3 text-sm">{t("cart.browse")}</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-4 text-center pt-28 lg:pt-32">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2C5A82]">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-2xl font-black tracking-[-0.05em]">Order confirmed!</h1>
        <p className="max-w-sm text-sm text-[#6D6D6D]">You will receive a confirmation via SMS and email.</p>
        <div className="flex gap-3">
          <Button to="/shop" variant="primary" className="min-h-12 px-6 py-3 text-sm">{t("nav.shop")}</Button>
          <Button to="/" variant="secondary" className="min-h-12 px-6 py-3 text-sm">Home</Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !guestMode) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-4 text-center pt-28 lg:pt-32">
        <h1 className="font-display text-2xl font-black">{t("checkout.title")}</h1>
        <p className="max-w-sm text-sm text-[#6D6D6D]">Sign in for faster checkout or continue as a guest.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="/login" variant="gold" className="min-h-12 px-6 py-3 text-sm">{t("nav.signIn")}</Button>
          <Button to="/register" variant="primary" className="min-h-12 px-6 py-3 text-sm">{t("nav.createAccount")}</Button>
        </div>
        <div className="mt-4 w-full max-w-sm border-t border-black/10 pt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#6D6D6D]">{t("checkout.guest")}</p>
          <Button variant="secondary" className="min-h-12 w-full justify-center px-6 py-3 text-sm" onClick={enableGuest}>
            {t("checkout.guest")}
          </Button>
          <p className="mt-2 text-xs text-[#909090]">{t("checkout.guestInfo")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 sm:pb-24">
        <h1 className="font-display text-[clamp(1.3rem,4vw,3rem)] font-black tracking-[-0.06em]">{t("checkout.title")}</h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Form - all on one page */}
          <div className="space-y-6">
            {/* Shipping */}
            <div className="rounded-xl border border-black/[0.08] bg-white p-5">
              <h2 className="font-display text-base font-black">{t("checkout.shipping")}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D]">{t("checkout.fullName")}</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#2C5A82]" placeholder="Jean Baptiste Mugabo" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D]">{t("checkout.phone")}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#2C5A82]" placeholder="+250 788 000 000" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D]">{t("checkout.email")}</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#2C5A82]" placeholder="jean@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D]">{t("checkout.address")}</label>
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#2C5A82]" placeholder="Kacyiru, KG 123 St, Kigali" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D]">Delivery notes</label>
                  <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="min-h-12 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#2C5A82]" placeholder="Landmark, instructions..." />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-black/[0.08] bg-white p-5">
              <h2 className="font-display text-base font-black">{t("checkout.payment")}</h2>
              <p className="mt-1 text-sm text-[#6D6D6D]">Choose your payment method.</p>
              <div className="mt-4 grid gap-2">
                <PaymentOption
                  icon={<Smartphone className="h-5 w-5" />}
                  label={t("checkout.mtn")}
                  sublabel="MTN Mobile Money"
                  selected={payment === "mobile_money"}
                  onClick={() => setPayment("mobile_money")}
                />
                <PaymentOption
                  icon={<Smartphone className="h-5 w-5" />}
                  label={t("checkout.airtel")}
                  sublabel="Airtel Money"
                  selected={payment === "airtel_money"}
                  onClick={() => setPayment("airtel_money")}
                />
                <PaymentOption
                  icon={<CreditCard className="h-5 w-5" />}
                  label={t("checkout.card")}
                  sublabel="Visa, Mastercard"
                  selected={payment === "card"}
                  onClick={() => setPayment("card")}
                />
                <PaymentOption
                  icon={<Wallet className="h-5 w-5" />}
                  label={t("checkout.cod")}
                  sublabel="Pay on delivery"
                  selected={payment === "cod"}
                  onClick={() => setPayment("cod")}
                />
              </div>
              <div className="mt-4 rounded-xl border border-[#2C5A82]/20 bg-[#2C5A82]/5 p-3 text-xs">
                <div className="flex items-center gap-2 text-[0.55rem] font-black uppercase tracking-[0.15em] text-[#2C5A82]">
                  <Lock className="h-3.5 w-3.5 shrink-0" /> {t("checkout.secure")}
                </div>
                <p className="mt-1 text-[#6D6D6D]">Encrypted (AES-256). We never store full card numbers or PINs.</p>
              </div>
            </div>

            {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

            <Button variant="gold" className="min-h-12 w-full justify-center py-3 text-sm" onClick={placeOrder} disabled={submitting}>
              {submitting ? "Placing order..." : t("checkout.placeOrder")}
            </Button>
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-black/[0.08] bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2C5A82]">{t("checkout.orderSummary")}</p>
              <div className="mt-3 space-y-3 divide-y divide-black/[0.08]">
                {lines.map((line) => (
                  <div key={line.key} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{line.product.name}</p>
                      <p className="text-xs text-[#6D6D6D]">Qty {line.quantity}{line.size ? ` · ${line.size}` : ""}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold">{formatRwf(line.product.price * line.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1.5 border-t border-black/10 pt-3 text-sm">
                <div className="flex justify-between"><span className="text-[#6D6D6D]">{t("checkout.subtotal")}</span><span className="font-bold">{formatRwf(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[#6D6D6D]">{t("checkout.delivery")}</span><span className="font-bold">{t("checkout.free")}</span></div>
                <div className="flex justify-between border-t border-black/10 pt-2"><span className="font-display font-black">{t("checkout.total")}</span><span className="font-display font-black">{formatRwf(total)}</span></div>
              </div>
              <div className="mt-4 rounded-xl bg-[#FAF9F5] p-3 text-xs">
                <div className="flex items-center gap-2 font-bold"><Truck className="h-4 w-4 text-[#2C5A82]" /> Free Kigali delivery</div>
                <p className="mt-1 text-[#6D6D6D]">Kicukiro, Kacyiru, Remera, Kimihurura, Nyarutarama. 24-48h.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ icon, label, sublabel, selected, onClick }: { icon: React.ReactNode; label: string; sublabel: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex items-center gap-3 rounded-xl border p-4 text-left transition min-h-[3.5rem]", selected ? "border-[#2C5A82] bg-[#2C5A82]/10" : "border-black/10 bg-white hover:border-black/30")}>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", selected ? "bg-[#14171F] text-[#2C5A82]" : "bg-[#FAF9F5] text-[#6D6D6D]")}>{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs text-[#6D6D6D]">{sublabel}</p>
      </div>
      {selected && <CheckCircle2 className="ml-auto shrink-0 h-5 w-5 text-[#2C5A82]" />}
    </button>
  );
}
