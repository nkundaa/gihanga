import { CheckCircle2, Sparkles } from "lucide-react";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

const plans = [
  {
    name: "Starter",
    emoji: "🌱",
    price: "Free",
    note: "No monthly fee",
    features: ["3 products/day", "Store page", "Basic analytics", "Basic product videos"],
    highlight: "8% commission",
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    emoji: "🚀",
    price: "RWF 9,900",
    note: "Per month",
    features: ["10 products/day", "Premium store page", "Advanced analytics", "Full product videos", "Basic marketing tools", "3 staff accounts", "Email & Chat support"],
    highlight: "6% commission",
    cta: "Choose Growth",
    featured: true,
  },
  {
    name: "Business",
    emoji: "💼",
    price: "RWF 28,765",
    note: "Per month",
    features: ["50 products/day", "Premium store page", "Premium analytics", "Full product videos", "Advanced marketing", "10 staff accounts", "Homepage promotion", "Priority support"],
    highlight: "4% commission",
    cta: "Choose Business",
    featured: false,
  },
  {
    name: "Enterprise",
    emoji: "👑",
    price: "RWF 89,700",
    note: "Per month",
    features: ["Unlimited products", "Premium+ store page", "Enterprise analytics", "Full product videos", "Dedicated marketing", "Unlimited staff", "Hero banner placement", "VIP support"],
    highlight: "2% commission",
    cta: "Contact us",
    featured: false,
  },
];

export default function Plans() {
  return (
    <div className="overflow-x-hidden bg-[#F8F9FA]">
      <Seo title="Plans - Gihanga Market" path="/plans" description="Choose the right plan for your fashion store on GIHANGA marketplace. Start selling in Kigali today." />
      <section className="relative overflow-hidden bg-[#111111] px-4 pb-16 pt-36 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-44">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(191,215,241,0.18),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(255,213,234,0.12),transparent_32%)]" />
        <div aria-hidden className="luxury-orb left-[5%] top-[15%] h-80 w-80 bg-[#BFD7F1]/15" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:gap-3 sm:text-xs sm:tracking-[0.42em]">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Pricing plans
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(1.5rem,7vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] sm:mt-6">
            Choose your <span className="font-editorial normal-case text-[#BFD7F1]">plan</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:mt-8 sm:text-base sm:leading-normal">
            Start free and scale as you grow. No hidden fees, no long-term contracts.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center" data-reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Plans</p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">Pricing that <span className="font-editorial text-[#BFD7F1]">grows</span> with you.</h2>
            <p className="mt-5 text-base leading-7 text-[#666]">All plans include identity verification, fraud protection, and secure payouts.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <article key={p.name} data-reveal className={`relative rounded-[2.4rem] p-7 transition hover:-translate-y-1 sm:p-8 ${p.featured ? "bg-[#111111] text-white shadow-[0_30px_110px_rgba(0,0,0,0.18)]" : "border border-black/[0.08] bg-white"}`}>
                {p.featured ? <span className="absolute right-5 top-5 rounded-full bg-[#BFD7F1] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#111]">Most popular</span> : null}
                <p className="text-2xl">{p.emoji}</p>
                <p className={`mt-3 text-xs font-black uppercase tracking-[0.28em] ${p.featured ? "text-[#BFD7F1]" : "text-[#666]"}`}>{p.name}</p>
                <p className="mt-4 font-display text-3xl font-black tracking-[-0.06em] sm:text-4xl">{p.price}</p>
                <p className={`mt-1 text-sm ${p.featured ? "text-white/70" : "text-[#666]"}`}>{p.note}</p>
                <p className={`mt-6 rounded-xl px-3 py-1.5 text-center text-xs font-black uppercase tracking-[0.18em] ${p.featured ? "bg-white/10 text-[#BFD7F1]" : "bg-[#F0F4F8] text-[#555]"}`}>{p.highlight}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-[#BFD7F1]" : "text-[#111]"}`} />
                      <span className={p.featured ? "text-white/85" : "text-[#555]"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <MagneticButton to="/sell-apply" variant={p.featured ? "berry" : "light"} className="min-h-12 mt-8 w-full justify-center px-5 py-3 text-sm">
                  {p.cta}
                </MagneticButton>
              </article>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-[#111111] px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">
            Ready to start <span className="font-editorial text-[#BFD7F1]">selling</span>?
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70">Join Kigali's premium fashion marketplace. Get verified in minutes.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton to="/sell-apply" variant="berry" className="min-h-12 px-8 py-4">Apply to sell</MagneticButton>
            <MagneticButton to="/sell" variant="ghost" className="min-h-12 px-8 py-4">Learn more</MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
