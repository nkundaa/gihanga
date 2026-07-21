import { BadgeCheck, BarChart3, ShieldCheck, Sparkles, Store, Truck } from "lucide-react";
import { MagneticButton } from "../components/ui";

const benefits = [
  { icon: Store, title: "Premium storefront", copy: "A boutique page designed like an editorial spread — not a generic catalog row." },
  { icon: ShieldCheck, title: "Verified badge", copy: "Authenticity and quality signals that build customer trust from day one." },
  { icon: Truck, title: "Managed delivery", copy: "Kigali-first rider network with live tracking, handled for you." },
  { icon: BarChart3, title: "Insights & analytics", copy: "Understand your customers with clear product and order performance data." },
  { icon: BadgeCheck, title: "Buyer protection", copy: "A trust layer that reduces returns and builds long-term loyalty." },
  { icon: Sparkles, title: "Marketing reach", copy: "Be featured in the GIHANGA edit, drops and newsletter." },
];

const steps = [
  { n: "01", title: "Apply", copy: "Submit your boutique for review. We verify authenticity, quality and service commitment." },
  { n: "02", title: "Onboard", copy: "Claim your storefront, upload your catalog and set up payouts." },
  { n: "03", title: "Sell", copy: "Receive orders, prepare packages, hand off to a verified rider." },
  { n: "04", title: "Grow", copy: "Track performance, collect reviews and expand your reach across Kigali." },
];

export default function Sell() {
  return (
    <div className="bg-[#F8F9FA]">
      <section className="relative overflow-hidden bg-[#111111] px-5 pb-12 pt-36 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-44">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,215,241,0.22),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(255,213,234,0.18),transparent_32%)]" />
        <div aria-hidden className="luxury-orb right-[10%] top-[20%] h-72 w-72 bg-[#BFD7F1]/20" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:gap-3 sm:text-xs sm:tracking-[0.42em]">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> For boutiques
          </p>
          <h1 className="mt-4 max-w-6xl font-display text-[clamp(1.5rem,7vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] sm:mt-6">
            <span className="block">Sell on</span>
            <span className="block"><span className="font-editorial normal-case text-[#BFD7F1]">GIHANGA</span> today.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:mt-8 sm:text-base sm:leading-normal">
            Bring your store to Kigali's premium fashion marketplace. Verified, discoverable and delivered — with a digital experience that matches your physical one.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-3">
            <MagneticButton to="/plans" variant="light" className="w-full justify-center px-7 py-4 sm:w-auto">View plans</MagneticButton>
            <MagneticButton to="/sell-apply" variant="berry" className="w-full justify-center px-7 py-4 sm:w-auto">Apply to sell</MagneticButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Why GIHANGA</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">A <span className="font-editorial text-[#BFD7F1]">premium</span> home for your boutique.</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <article key={b.title} data-reveal className="group rounded-[2rem] border border-black/[0.08] bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.05)] transition hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] text-[#BFD7F1] transition group-hover:rotate-3 group-hover:scale-110">
                  <b.icon className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <h3 className="mt-6 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">{b.title}</h3>
                <p className="mt-3 leading-7 text-[#666666]">{b.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">How it works</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">Four steps to <span className="font-editorial text-[#BFD7F1]">launch</span>.</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} data-reveal className="relative overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA] p-6">
                <p className="font-editorial text-6xl text-[#BFD7F1]">{s.n}</p>
                <p className="mt-4 font-display text-2xl font-black tracking-[-0.04em]">{s.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#666666]">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111111] px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">
            Ready to <span className="font-editorial text-[#BFD7F1]">grow</span> your boutique?
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70">Kigali's premium fashion marketplace — built for local boutiques.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton to="/plans" variant="light" className="px-8 py-4">View plans</MagneticButton>
            <MagneticButton to="/sell-apply" variant="berry" className="px-8 py-4">Apply to sell</MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
