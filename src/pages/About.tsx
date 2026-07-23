import { BadgeCheck, Compass, ShieldCheck, ShoppingBag, Store, Truck } from "lucide-react";
import { heroImages } from "../data/catalog";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

const values = [
  { title: "Verified, always", copy: "Every boutique on GIHANGA is personally reviewed. No noise, no fakes, no guesswork.", icon: BadgeCheck },
  { title: "Designed for Kigali", copy: "Delivery, payments and discovery are built around how Kigali actually shops.", icon: Compass },
  { title: "Buyer protection", copy: "Clear standards, transparent pricing, and support that has your back.", icon: ShieldCheck },
];

const customerSteps = [
  { icon: ShoppingBag, title: "Browse", copy: "Discover verified boutiques and curated pieces from Kigali." },
  { icon: ShoppingBag, title: "Add to bag", copy: "Build your order across one or multiple stores." },
  { icon: ShieldCheck, title: "Pay securely", copy: "Card and Mobile Money checkout built for Rwanda." },
  { icon: Compass, title: "Share location", copy: "Send your delivery pin in a tap." },
  { icon: Truck, title: "Track live", copy: "Watch your rider approach on a live map." },
  { icon: BadgeCheck, title: "Rate & review", copy: "Rate the store and the rider after delivery." },
];

const vendorSteps = [
  { icon: Store, title: "Create store", copy: "Claim your boutique profile and verify authenticity." },
  { icon: ShoppingBag, title: "Upload products", copy: "Add catalog, pricing, sizes, colors and photography." },
  { icon: BadgeCheck, title: "Receive orders", copy: "Real-time notifications with buyer delivery details." },
  { icon: ShieldCheck, title: "Prepare package", copy: "Pack and hand over to a verified GIHANGA rider." },
  { icon: Truck, title: "Deliver", copy: "Rider handles last-mile delivery with live tracking." },
  { icon: BadgeCheck, title: "Get paid", copy: "Funds settled to your Mobile Money or bank account." },
];

const timeline = [
  { year: "2024", title: "Founded in Kigali", copy: "GIHANGA starts as a small network of verified fashion boutiques." },
  { year: "2025", title: "Marketplace launch", copy: "Phase one introduces the discovery experience and verified store directory." },
  { year: "2026", title: "Commerce & delivery", copy: "Secure checkout, Mobile Money and live rider tracking roll out across Kigali." },
  { year: "2027", title: "Pan-Rwanda", copy: "Expansion to secondary cities and regional delivery corridors." },
];

export default function About() {
  return (
    <div className="overflow-x-hidden bg-[#F8F9FA]">
      <Seo title="About - Gihanga Market" path="/about" description="Learn about GIHANGA, Rwanda's premium fashion marketplace connecting customers with verified fashion stores across Kigali." />
      <section className="relative overflow-hidden bg-[#111111] px-4 pb-12 pt-36 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-44">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(191,215,241,0.2),transparent_32%),radial-gradient(circle_at_82%_80%,rgba(255,213,234,0.18),transparent_30%)]" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:text-xs sm:tracking-[0.42em]">About GIHANGA</p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(1.5rem,7vw,8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] sm:mt-6">
            A premium <span className="font-editorial normal-case text-[#BFD7F1]">home</span><br />for Kigali <span className="text-stroke text-white">fashion</span>.
          </h1>
          <p className="mt-4 max-w-2xl font-editorial text-xl leading-snug text-white/80 sm:mt-8 sm:text-3xl">
            GIHANGA exists to give Rwandan fashion a digital home worthy of its makers — a marketplace that feels as considered, calm and confident as the boutiques it represents.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div data-reveal className="grid grid-cols-2 gap-4">
            <div className="col-span-2 overflow-hidden rounded-[2rem]">
              <img src={heroImages.atelierOne} alt="Fashion atelier" className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-[2rem]">
              <img src={heroImages.atelierTwo} alt="Designer at work" className="aspect-[3/4] w-full object-cover" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-[2rem]">
              <img src={heroImages.atelierThree} alt="Studio portrait" className="aspect-[3/4] w-full object-cover" loading="lazy" />
            </div>
          </div>
          <div data-reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Our story</p>
            <h2 className="mt-5 font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">
              Fashion deserves better <span className="font-editorial text-[#BFD7F1]">marketplaces</span>.
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-[#666666]">
              <p>Kigali has always had extraordinary boutiques. What it hasn't had — until now — is a digital experience that matches the quality of the physical ones.</p>
              <p>We are building GIHANGA as a premium layer for Rwanda's fashion economy: verified stores, considered product presentation, secure payments, and delivery you can actually watch arrive.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton to="/shop" variant="dark" className="min-h-12 px-6 py-3 text-sm">Explore the shop</MagneticButton>
              <MagneticButton to="/stores" variant="light" className="min-h-12 px-6 py-3 text-sm">Meet the boutiques</MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Our values</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">Three principles, <span className="font-editorial text-[#BFD7F1]">non-negotiable</span>.</h2>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <article key={v.title} data-reveal className="rounded-[2.4rem] border border-black/[0.08] bg-[#F8F9FA] p-8">
                <p className="font-editorial text-5xl text-[#BFD7F1]">0{i + 1}</p>
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-[#BFD7F1]">
                  <v.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-6 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">{v.title}</h3>
                <p className="mt-3 leading-7 text-[#666666]">{v.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">How it works</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">One premium flow for <span className="font-editorial text-[#BFD7F1]">buyers</span> and <span className="font-editorial text-[#BFD7F1]">sellers</span>.</h2>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <div data-reveal>
              <h3 className="font-display text-2xl font-black tracking-[-0.05em] sm:text-3xl">Customer journey</h3>
              <ol className="mt-6 space-y-4">
                {customerSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-5 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-black text-[#BFD7F1]">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="flex items-center gap-2 font-display text-lg font-black tracking-[-0.03em]"><s.icon className="h-4 w-4 text-[#BFD7F1]" /> {s.title}</p>
                      <p className="mt-1 text-sm text-[#666666]">{s.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div data-reveal>
              <h3 className="font-display text-2xl font-black tracking-[-0.05em] sm:text-3xl">Vendor journey</h3>
              <ol className="mt-6 space-y-4">
                {vendorSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-5 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-black text-[#BFD7F1]">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="flex items-center gap-2 font-display text-lg font-black tracking-[-0.03em]"><s.icon className="h-4 w-4 text-[#BFD7F1]" /> {s.title}</p>
                      <p className="mt-1 text-sm text-[#666666]">{s.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Roadmap</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">Where we are <span className="font-editorial text-[#BFD7F1]">going</span>.</h2>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <article key={t.year} data-reveal className="relative overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA] p-6">
                <p className="font-editorial text-6xl text-[#BFD7F1]">{t.year}</p>
                <p className="mt-4 font-display text-xl font-black tracking-[-0.03em]">{t.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#666666]">{t.copy}</p>
                {i === timeline.length - 1 ? <span className="absolute right-5 top-5 h-2 w-2 animate-pulse rounded-full bg-[#BFD7F1]" /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FA] px-4 pb-24 sm:px-6 lg:px-8">
        <div data-reveal className="mx-auto max-w-7xl overflow-hidden rounded-[2.8rem] bg-[#111111] px-8 py-16 text-white lg:px-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h2 className="font-display text-[clamp(1.5rem,5vw,5.5rem)] font-black leading-[0.9] tracking-[-0.07em]">
              Ready to <span className="font-editorial text-[#BFD7F1]">join</span> the marketplace?
            </h2>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <MagneticButton to="/sell" variant="berry" className="min-h-12 px-7 py-4">Open your store</MagneticButton>
              <MagneticButton to="/shop" variant="ghost" className="min-h-12 px-7 py-4">Start shopping</MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
