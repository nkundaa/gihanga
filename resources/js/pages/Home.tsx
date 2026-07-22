import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, Eye, Heart, Search, Sparkles, Star, TrendingUp, Truck, Verified } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { products, categories, stores } from "../data/catalog";
import { MagneticButton, MobileProductCard } from "../components/ui";

const heroSlides = [
  { url: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1600&q=85", alt: "Luxury fashion boutique" },
  { url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=85", alt: "Premium clothing collection" },
  { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=85", alt: "Fashion lifestyle editorial" },
];

const categoryIcons = [
  <Sparkles key="all" className="h-5 w-5" />, <Eye key="clothes" className="h-5 w-5" />,
  <Star key="shoes" className="h-5 w-5" />, <Truck key="bags" className="h-5 w-5" />,
  <Search key="accessories" className="h-5 w-5" />, <Sparkles key="luxury" className="h-5 w-5" />,
];

const testimonials = [
  { name: "Amina K.", role: "Fashion Editor", text: "GIHANGA changed how I discover Rwandan fashion. The curation is impeccable." },
  { name: "James M.", role: "Boutique Owner", text: "Listing my store was seamless. I reach customers I never could before." },
  { name: "Grace U.", role: "Shopper", text: "Delivery in Kigali was next-day. The quality exceeded my expectations." },
];

function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={className}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </div>
  );
}

const featured = products.filter((p) => p.featured).slice(0, 4);
const trending = products.filter((p) => !p.featured).slice(0, 4);
const newest = [...products].reverse().slice(0, 4);
const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const categoryList = [{ id: "all", label: "All" }, ...categories.map((c) => ({ id: c.slug, label: c.name }))];

  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[85svh] items-end overflow-hidden sm:min-h-screen" aria-label="Hero banner">
        <AnimatePresence mode="popLayout">
          {heroSlides.map((slide, i) =>
            i === slideIndex ? (
              <motion.img
                key={slide.url}
                src={slide.url}
                alt={slide.alt}
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-[#111111]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/40 to-transparent" />

        <div className="relative z-10 w-full px-4 pb-28 sm:px-8 sm:pb-36 lg:px-12 lg:pb-44">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.28em] text-[#D4AF37] backdrop-blur-md">
              <Verified className="h-3 w-3" /> Kigali's Finest
            </span>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Rwanda's<br />
              <span className="text-[#D4AF37]">Fashion</span>&nbsp;Edit
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Curated collections from Kigali's most discerning boutiques. Verified stores, authentic luxury.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <MagneticButton to="/shop" variant="light" className="px-6 py-3 text-sm font-black tracking-[-0.02em]">
                Explore shop <ArrowRight className="ml-1.5 h-4 w-4" />
              </MagneticButton>
              <MagneticButton to="/stores" variant="outline" className="border-white/30 px-6 py-3 text-sm font-black tracking-[-0.02em] text-white">
                Boutiques
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </section>

      {/* ── Floating Search ── */}
      <div className="relative z-20 -mt-10 px-4 sm:px-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSearch}
          className="overflow-hidden rounded-2xl border border-black/8 bg-white px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:px-6 sm:py-4"
        >
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-[#999]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pieces, stores, categories..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#999] sm:text-base"
              aria-label="Search products"
            />
            <button type="submit" className="rounded-full bg-[#111111] px-4 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#D4AF37] sm:py-2">Search</button>
          </div>
        </motion.form>
      </div>

      {/* ── Category Chips ── */}
      <ScrollReveal className="mt-8 px-4 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Product categories">
          {categoryList.map((cat, i) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => { setActiveCategory(cat.id); navigate(cat.id === "all" ? "/shop" : `/shop?category=${cat.id}`); }}
              className={`category-chip flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[-0.01em] transition ${
                activeCategory === cat.id
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-black/10 bg-white text-[#666] hover:border-black/30 hover:text-[#111111]"
              }`}
            >
              {categoryIcons[i]}
              {cat.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Featured Today ── */}
      <ScrollReveal className="mt-10 px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Curated For You</span>
            <h2 className="mt-1 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Featured Today</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] transition hover:gap-2">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {featured.map((p) => (
            <MobileProductCard
              key={p.slug}
              id={p.slug}
              name={p.name}
              price={p.price}
              originalPrice={p.originalPrice}
              image={p.images[0]}
              rating={p.rating}
              storeName={p.storeName}
              badge={p.tag}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* ── Trending Boutiques ── */}
      <ScrollReveal className="mt-14 px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-[#D4AF37]"><TrendingUp className="mr-1 inline h-3 w-3" /> Trending Now</span>
            <h2 className="mt-1 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Trending Boutiques</h2>
          </div>
          <Link to="/stores" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] transition hover:gap-2">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {trending.map((p) => (
            <MobileProductCard
              key={p.slug}
              id={p.slug}
              name={p.name}
              price={p.price}
              originalPrice={p.originalPrice}
              image={p.images[0]}
              rating={p.rating}
              storeName={p.storeName}
              badge={p.tag || "Hot"}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* ── New Arrivals ── */}
      <ScrollReveal className="mt-14 px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Fresh Drop</span>
            <h2 className="mt-1 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">New Arrivals</h2>
          </div>
          <Link to="/shop?sort=newest" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] transition hover:gap-2">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {newest.map((p) => (
            <MobileProductCard
              key={p.slug}
              id={p.slug}
              name={p.name}
              price={p.price}
              originalPrice={p.originalPrice}
              image={p.images[0]}
              rating={p.rating}
              storeName={p.storeName}
              badge={p.tag || "New"}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* ── Editor's Picks Banner ── */}
      <ScrollReveal className="mt-14 px-4 sm:px-8">
        <Link
          to="/shop?editor=true"
          className="group relative flex min-h-[220px] items-end overflow-hidden rounded-2xl sm:min-h-[280px]"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85"
            alt="Editor's picks collection"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
          <div className="relative z-10 p-5 pb-6 sm:p-8 sm:pb-10">
            <span className="text-[0.5rem] font-black uppercase tracking-[0.35em] text-[#D4AF37]">Editorial</span>
            <h3 className="mt-1.5 font-display text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">Editor's Picks</h3>
            <p className="mt-1 max-w-sm text-sm text-white/60 sm:text-base">Hand-selected by our team. The finest pieces in Kigali right now.</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-[#111111]">
              View collection <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      </ScrollReveal>

      {/* ── Testimonials ── */}
      <ScrollReveal className="mt-14 px-4 sm:px-8">
        <div className="text-center">
          <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Word of mouth</span>
          <h2 className="mt-1 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Loved in Kigali</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:p-6"
            >
              <div className="flex gap-0.5 text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#444]">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F9FA] text-xs font-bold text-[#111111]">{t.name.split(" ").map((n) => n[0]).join("")}</span>
                <div>
                  <p className="text-xs font-bold">{t.name}</p>
                  <p className="text-[0.6rem] text-[#999]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Best Sellers ── */}
      <ScrollReveal className="mt-14 px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-[#D4AF37]"><Sparkles className="mr-1 inline h-3 w-3" /> Most Wanted</span>
            <h2 className="mt-1 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Best Sellers</h2>
          </div>
          <Link to="/shop?sort=popular" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] transition hover:gap-2">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {bestSellers.map((p) => (
            <MobileProductCard
              key={p.slug}
              id={p.slug}
              name={p.name}
              price={p.price}
              originalPrice={p.originalPrice}
              image={p.images[0]}
              rating={p.rating}
              storeName={p.storeName}
              badge={p.discount || p.tag}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* ── Verified Stores ── */}
      <ScrollReveal className="mt-14 px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-[#D4AF37]"><Verified className="mr-1 inline h-3 w-3" /> Verified</span>
            <h2 className="mt-1 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Verified Stores</h2>
          </div>
          <Link to="/stores" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] transition hover:gap-2">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {stores.map((store) => (
            <motion.div
              key={store.slug}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="snap-start shrink-0"
            >
              <Link
                to={`/stores/${store.slug}`}
                className="group flex w-40 flex-col items-center rounded-2xl border border-black/8 bg-white p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:w-44"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F9FA] text-lg font-black transition group-hover:bg-[#111111] group-hover:text-[#D4AF37] sm:h-20 sm:w-20 sm:text-2xl">
                  {store.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <p className="mt-2 text-xs font-bold sm:text-sm">{store.name}</p>
                <span className="mt-1 inline-flex items-center gap-0.5 text-[0.5rem] text-[#D4AF37] font-semibold"><Verified className="h-2.5 w-2.5" /> Verified</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── CTA ── */}
      <ScrollReveal className="mt-14 mb-20 px-4 sm:px-8 lg:mb-0">
        <div className="relative overflow-hidden rounded-2xl bg-[#111111] px-6 py-12 text-center sm:py-16">
          <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <h2 className="relative font-display text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">Own Kigali Style</h2>
          <p className="relative mx-auto mt-3 max-w-sm text-sm text-white/60">Discover luxury fashion from Rwanda's premier boutiques. Free delivery in Kigali.</p>
          <MagneticButton to="/shop" variant="light" className="relative mx-auto mt-6 inline-flex px-6 py-3 text-sm font-black tracking-[-0.02em]">
            Start shopping <ArrowRight className="ml-1.5 h-4 w-4" />
          </MagneticButton>
        </div>
      </ScrollReveal>
    </main>
  );
}
