import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { heroImages, products, stores } from "../data/catalog";
import { Eyebrow, MagneticButton, ProductCard } from "../components/ui";
import { cn } from "../utils/cn";

type EditorialEntry = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  spread: "full" | "half" | "tall";
};

const entries: EditorialEntry[] = [
  { id: "e1", title: "The Kigali Edit", subtitle: "Curated looks from the city's finest boutiques", image: heroImages.boutiqueWindow, spread: "full" },
  { id: "e2", title: "Silk Season", subtitle: "Lightweight layers for Kigali's warm evenings", image: heroImages.clothes, spread: "half" },
  { id: "e3", title: "Footwear Focus", subtitle: "Hand-finished shoes made in Kigali ateliers", image: heroImages.shoes, spread: "half" },
  { id: "e4", title: "The Minimalist", subtitle: "Clean lines, neutral tones, effortless polish", image: heroImages.boutiqueMono, spread: "tall" },
  { id: "e5", title: "Evening Luxe", subtitle: "Silk, leather and signature accessories for after dark", image: heroImages.boutiqueRack, spread: "half" },
  { id: "e6", title: "Street & Studio", subtitle: "Sportswear meets tailoring on Kigali streets", image: heroImages.street, spread: "half" },
  { id: "e7", title: "The Carry Collection", subtitle: "Bags crafted for the modern commute", image: heroImages.bagsTote, spread: "full" },
];

const featuredStore = stores[0];
const featuredProduct = products[0];

export default function Editorial() {
  return (
    <div className="bg-[#F8F9FA]">
      <section className="relative overflow-hidden bg-[#111111] px-5 pb-12 pt-36 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-44">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(191,215,241,0.18),transparent_40%),radial-gradient(circle_at_50%_70%,rgba(255,213,234,0.12),transparent_40%)]" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl">
          <Eyebrow className="text-white/80">Visual storytelling</Eyebrow>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(1.5rem,7vw,8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] sm:mt-6">
            The <span className="font-editorial normal-case text-[#BFD7F1]">editorial</span><br /><span className="text-stroke text-white">lookbook</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 sm:mt-6 sm:text-lg sm:leading-8">
            Curated visual stories from Kigali's fashion scene. Discover new drops, seasonal inspirations and boutique stories.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <MagneticButton to="/shop" variant="berry" className="w-full justify-center px-6 py-3 text-sm sm:w-auto" onClick={() => {}}>Shop the edit</MagneticButton>
            <MagneticButton to="/stores" variant="ghost" className="w-full justify-center px-6 py-3 text-sm sm:w-auto" onClick={() => {}}>Explore boutiques</MagneticButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {entries.map((entry) => (
              <article
                key={entry.id}
                data-reveal
                className={cn(
                  "group relative overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)]",
                  entry.spread === "full" ? "sm:col-span-2 sm:row-span-1" : "",
                  entry.spread === "tall" ? "sm:row-span-2" : "",
                  entry.spread === "half" ? "" : ""
                )}
              >
                <div className={cn("relative overflow-hidden", entry.spread === "full" ? "aspect-[1/1] sm:aspect-[3/1]" : entry.spread === "tall" ? "aspect-[3/4] sm:aspect-[3/5]" : "aspect-[3/4] sm:aspect-[4/5]")}>
                  <img src={entry.image} alt={entry.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Editorial</p>
                    <h2 className="mt-2 font-display text-xl font-black leading-tight tracking-[-0.04em] sm:text-2xl">{entry.title}</h2>
                    <p className="mt-2 text-sm text-white/80">{entry.subtitle}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Featured boutique</p>
              <h2 className="mt-3 font-display text-[clamp(1.4rem,4.5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.06em]">Behind the <span className="font-editorial text-[#BFD7F1]">atelier</span></h2>
            </div>
            <Link to={`/store/${featuredStore.slug}`} className="group inline-flex items-center gap-2 text-sm font-bold underline-grow">
              Visit {featuredStore.name} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div data-reveal className="grid overflow-hidden rounded-[2.8rem] border border-black/[0.08] bg-[#F8F9FA] shadow-[0_30px_110px_rgba(0,0,0,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[20rem] overflow-hidden">
              <img src={featuredStore.cover} alt={featuredStore.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">{featuredStore.category} · {featuredStore.location}</p>
              <h3 className="mt-4 font-display text-3xl font-black leading-[0.9] tracking-[-0.06em] sm:text-4xl">{featuredStore.name}</h3>
              <p className="mt-4 text-[#666666] leading-relaxed">{featuredStore.bio}</p>
              <div className="mt-6 flex gap-3">
                <MagneticButton to={`/store/${featuredStore.slug}`} variant="dark" className="px-6 py-3 text-sm">Visit boutique</MagneticButton>
                <MagneticButton to={`/product/${featuredProduct.slug}`} variant="light" className="px-6 py-3 text-sm">Featured piece</MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FA] px-5 py-16 sm:py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">From the edit</p>
              <h2 className="mt-3 font-display text-[clamp(1.4rem,4.5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.06em]">Curated <span className="font-editorial text-[#BFD7F1]">pieces</span></h2>
            </div>
            <Link to="/shop" className="group inline-flex items-center gap-2 text-sm font-bold underline-grow">
              Shop all <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      <section className="bg-[#111111] px-5 py-12 text-white sm:py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <Sparkles className="mx-auto h-8 w-8 text-[#BFD7F1]" />
          <h2 className="mt-6 font-display text-[clamp(1.5rem,4.5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.06em]">
            New drops every <span className="font-editorial text-[#BFD7F1]">Thursday</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/70">
            The Kigali edit lands weekly. Sign up for the newsletter to get first access to new collections, exclusive drops and boutique stories.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton to="/contact" variant="berry" className="px-6 py-3 text-sm">Get the edit</MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
