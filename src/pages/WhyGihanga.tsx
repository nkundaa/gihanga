import { BadgeCheck, BarChart3, ShieldCheck, Sparkles, Store, Truck } from "lucide-react";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

const benefits = [
  { icon: Store, title: "Premium storefront", copy: "A boutique page designed like an editorial spread — not a generic catalog row." },
  { icon: ShieldCheck, title: "Verified badge", copy: "Authenticity and quality signals that build customer trust from day one." },
  { icon: Truck, title: "Managed delivery", copy: "Kigali-first rider network with live tracking, handled for you." },
  { icon: BarChart3, title: "Insights & analytics", copy: "Understand your customers with clear product and order performance data." },
  { icon: BadgeCheck, title: "Buyer protection", copy: "A trust layer that reduces returns and builds long-term loyalty." },
  { icon: Sparkles, title: "Marketing reach", copy: "Be featured in the GIHANGA edit, drops and newsletter." },
];

export default function WhyGihanga() {
  return (
    <div className="overflow-x-hidden bg-[#F8F9FA]">
      <Seo title="Why Gihanga Market" path="/why-gihanga" description="Discover why GIHANGA is Rwanda's trusted fashion marketplace. Verified stores, secure payments, and fast delivery in Kigali." />
      <section className="relative overflow-hidden bg-[#111111] px-4 pb-16 pt-36 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-44">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(191,215,241,0.2),transparent_32%),radial-gradient(circle_at_70%_80%,rgba(255,213,234,0.15),transparent_32%)]" />
        <div aria-hidden className="luxury-orb left-[8%] top-[25%] h-80 w-80 bg-[#BFD7F1]/15" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:gap-3 sm:text-xs sm:tracking-[0.42em]">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Why GIHANGA
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(1.5rem,7vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] sm:mt-6">
            Why <span className="font-editorial normal-case text-[#BFD7F1]">GIHANGA</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:mt-8 sm:text-base sm:leading-normal">
            Kigali's premium fashion marketplace — built for local boutiques, designed for growth.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton to="/sell-apply" variant="berry" className="min-h-12 w-full justify-center px-7 py-4 sm:w-auto">Apply to sell</MagneticButton>
            <MagneticButton to="/plans" variant="ghost" className="min-h-12 w-full justify-center px-7 py-4 sm:w-auto">View plans</MagneticButton>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center" data-reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Benefits</p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">Everything your boutique <span className="font-editorial text-[#BFD7F1]">needs</span></h2>
            <p className="mt-5 text-base leading-7 text-[#666]">From storefront to delivery — we handle the platform so you can focus on fashion.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <article key={b.title} data-reveal className="group rounded-[2.4rem] border border-black/[0.08] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(0,0,0,0.08)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111111] text-[#BFD7F1] transition group-hover:rotate-3 group-hover:scale-110">
                  <b.icon className="h-7 w-7" strokeWidth={1.8} />
                </div>
                <h3 className="mt-6 font-display text-2xl font-black tracking-[-0.04em]">{b.title}</h3>
                <p className="mt-3 leading-7 text-[#666]">{b.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center" data-reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Kigali-first</p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">Built for <span className="font-editorial text-[#BFD7F1]">Kigali</span></h2>
            <p className="mt-6 text-base leading-7 text-[#666] mx-auto max-w-2xl">
              Every feature is designed around Kigali's fashion community — local rider network, Mobile Money payments, and a marketplace that connects boutiques with customers across Gasabo, Kicukiro, and Nyarugenge.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 text-center sm:grid-cols-3" data-reveal>
            <div className="rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA] p-8">
              <p className="font-editorial text-5xl text-[#BFD7F1]">30+</p>
              <p className="mt-3 font-display text-lg font-black">Boutiques</p>
              <p className="mt-1 text-sm text-[#666]">Verified sellers across Kigali</p>
            </div>
            <div className="rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA] p-8">
              <p className="font-editorial text-5xl text-[#BFD7F1]">1 hr</p>
              <p className="mt-3 font-display text-lg font-black">Delivery</p>
              <p className="mt-1 text-sm text-[#666]">Average drop‑off time in Kigali</p>
            </div>
            <div className="rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA] p-8">
              <p className="font-editorial text-5xl text-[#BFD7F1]">100%</p>
              <p className="mt-3 font-display text-lg font-black">Verified</p>
              <p className="mt-1 text-sm text-[#666]">Every boutique goes through identity verification</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111111] px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">
            Ready to join <span className="font-editorial text-[#BFD7F1]">GIHANGA</span>?
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70">Start selling on Kigali's premium fashion marketplace today.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton to="/sell-apply" variant="berry" className="min-h-12 px-8 py-4">Apply to sell</MagneticButton>
            <MagneticButton to="/plans" variant="ghost" className="min-h-12 px-8 py-4">View plans</MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
