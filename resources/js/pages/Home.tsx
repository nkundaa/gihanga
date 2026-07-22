import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Eye,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { cn } from "../utils/cn";
import { categories as mockCategories, products as mockProducts, stores as mockStores, type Product, type Store, type Category } from "../data/catalog";
import { api } from "../api";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatRwf } from "../data/catalog";
import Seo from "../components/Seo";

const MOBILE_BREAKPOINT = 768;

const allCategories: Array<{ slug: string; label: string }> = [
  { slug: "all", label: "All" },
  { slug: "shoes", label: "Shoes" },
  { slug: "clothes", label: "Clothes" },
  { slug: "bags", label: "Bags" },
  { slug: "accessories", label: "Accessories" },
  { slug: "watches", label: "Watches" },
  { slug: "sportswear", label: "Sportswear" },
];

export default function Home() {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>(mockProducts);
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>(mockCategories);
  const [fetchedStores, setFetchedStores] = useState<Store[]>(mockStores);

  useEffect(() => {
    api.products.list({}).then((res) => {
      if (res.products.length > 0) setFetchedProducts(res.products);
    }).catch(() => {});
    api.categories.list().then((res) => {
      if (res.categories.length > 0) setFetchedCategories(res.categories);
    }).catch(() => {});
    api.stores.list().then((res) => {
      if (res.stores.length > 0) setFetchedStores(res.stores);
    }).catch(() => {});
  }, []);

  const featured = fetchedProducts.filter((p) => p.featured);
  const trending = fetchedProducts.filter((p) => p.category === "clothes" || p.category === "shoes");
  const newArrivals = [...fetchedProducts].reverse();
  const bestSellers = [...fetchedProducts].sort((a, b) => b.reviews - a.reviews);

  return (
    <>
      <Seo title="GIHANGA — Rwanda's Premium Fashion Marketplace" path="/home" description="Shop verified fashion boutiques in Kigali. Discover clothing, shoes, bags and accessories from Rwanda's premium fashion marketplace." />
      <Hero products={featured} />
      <SearchBar />
      <CategoryChips categories={fetchedCategories} />
      <FeaturedProducts products={featured} />
      <TrendingProducts products={trending} />
      <StoreSection stores={fetchedStores} />
      <NewArrivals products={newArrivals} />
      <BestSellers products={bestSellers} />
      <CtaBanner />
    </>
  );
}

function Hero({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 900);

  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / vh - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [reduceMotion, vh]);

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, vh], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, vh * 0.6], [1, 0]);
  const yOffset = useTransform(scrollY, [0, vh], [0, 60]);

  const heroProduct = products[0];
  const heroBg = heroProduct?.images[0] ?? "/images/hero-bg.jpg";

  return (
    <section ref={containerRef} className="relative flex h-dvh min-h-[600px] items-center justify-center overflow-hidden bg-[#111111]">
      <motion.div style={{ scale: heroScale }} className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </motion.div>

      <div className="noise-layer pointer-events-none absolute inset-0" />

      <motion.div
        style={{ opacity: heroOpacity, y: yOffset }}
        className="relative z-10 mx-auto max-w-2xl px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md"
        >
          <Sparkles className="h-3 w-3 text-[#D4AF37]" /> Premium Fashion Marketplace
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.2rem,8vw,5rem)] font-black leading-[0.92] tracking-[-0.06em] text-white"
        >
          Discover<br />
          <span className="text-[#D4AF37]">Rwanda's Finest</span><br />
          Fashion
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/70 sm:text-base"
        >
          Shop verified boutiques, exclusive collections, and premium fashion pieces from Kigali's finest stores.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            to="/shop"
            className="inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 text-sm font-bold text-[#111111] shadow-lg shadow-[#D4AF37]/25 transition-all hover:bg-[#D4AF37]/90 hover:shadow-xl hover:shadow-[#D4AF37]/30 active:scale-[0.97]"
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/stores"
            className="inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.97]"
          >
            Explore Stores
          </Link>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
        onClick={() => window.scrollTo({ top: vh, behavior: "smooth" })}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return mockProducts
      .filter((p) => p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <div className="relative z-20 -mt-6 px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "mx-auto max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all",
          focused ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/20 shadow-[0_10px_50px_rgba(212,175,55,0.12)]" : "border-black/10"
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-[#999]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search products, stores, categories..."
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#bbb]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-[#999] transition hover:bg-black/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          ) : null}
        </div>
      </form>

      {suggestions.length > 0 && focused ? (
        <div className="mx-auto mt-1 max-w-2xl overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
          {suggestions.map((p) => (
            <Link
              key={p.slug}
              to={`/product/${p.slug}`}
              onClick={() => setQuery("")}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-black/[0.03]"
            >
              <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#111111]">{p.name}</p>
                <p className="text-[0.65rem] text-[#999]">{p.storeName} · {formatRwf(p.price)}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#D4AF37]" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CategoryChips({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const chips = useMemo(() => {
    const slugs = new Set(categories.map((c) => c.slug));
    return allCategories.filter((c) => c.slug === "all" || slugs.has(c.slug));
  }, [categories]);

  return (
    <section className="px-4 pt-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]">
          {chips.map((chip) => (
            <button
              key={chip.slug}
              type="button"
              onClick={() => {
                setActive(chip.slug);
                navigate(chip.slug === "all" ? "/shop" : `/shop?category=${chip.slug}`);
              }}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all",
                active === chip.slug
                  ? "bg-[#111111] text-white shadow-lg shadow-black/10"
                  : "bg-black/[0.04] text-[#666] hover:bg-black/[0.08] hover:text-[#111]"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, linkTo, linkLabel }: { title: string; subtitle?: string; linkTo?: string; linkLabel?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {subtitle ? (
          <p className="mb-1.5 text-[0.6rem] font-black uppercase tracking-[0.28em] text-[#D4AF37]">{subtitle}</p>
        ) : null}
        <h2 className="font-display text-2xl font-black tracking-[-0.05em] text-[#111111] sm:text-3xl">{title}</h2>
      </div>
      {linkTo ? (
        <Link to={linkTo} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D4AF37] transition hover:text-[#111111]">
          {linkLabel ?? "View all"} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {products.map((product, i) => (
        <ProductCardMobile key={product.slug} product={product} index={i} />
      ))}
    </div>
  );
}

function ProductCardMobile({ product, index }: { product: Product; index: number }) {
  const { toggleItem, hasItem } = useWishlist();
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f0f0f0]">
          {!imageLoaded && !imgError ? (
            <div className="absolute inset-0 bg-[#e8e8e8] animate-pulse" />
          ) : null}
          {!imgError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImgError(true)}
              className={cn(
                "h-full w-full object-cover transition duration-700 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#e8e8e8] text-[0.65rem] text-[#999]">{product.name[0]}</div>
          )}

          {product.discount ? (
            <span className="absolute left-2 top-2 rounded-full bg-[#111111] px-2.5 py-1 text-[0.55rem] font-black uppercase tracking-[0.15em] text-white">
              {product.discount}
            </span>
          ) : null}

          <div className="absolute right-2 top-2 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); toggleItem(product); }}
              aria-label={hasItem(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-xl transition",
                hasItem(product.slug) ? "bg-[#D4AF37] text-white shadow-md" : "bg-white/80 text-[#111111] shadow-md hover:bg-white"
              )}
            >
              <Heart className={cn("h-4 w-4", hasItem(product.slug) && "fill-white")} />
            </button>
          </div>
        </div>

        <div className="mt-2.5 space-y-1 px-0.5">
          <p className="truncate text-xs font-semibold text-[#999] uppercase tracking-[0.12em]">{product.storeName}</p>
          <p className="truncate text-sm font-bold text-[#111111]">{product.name}</p>
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-black text-[#111111]">{formatRwf(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-xs text-[#999] line-through">{formatRwf(product.originalPrice)}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[0.6rem] font-bold text-[#666]">{Number(product.rating).toFixed(1)}</span>
            </div>
            <span className="text-[0.55rem] text-[#bbb]">({product.reviews})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="px-4 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Featured Pieces" subtitle="Curated for you" linkTo="/shop" linkLabel="Shop all" />
        <div className="mt-5">
          <ProductGrid products={products.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}

function TrendingProducts({ products }: { products: Product[] }) {
  const display = useMemo(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [products]);

  if (display.length === 0) return null;
  return (
    <section className="px-4 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Trending Now" subtitle="Most wanted" linkTo="/shop?sort=rating" linkLabel="See more" />
        <div className="mt-5">
          <ProductGrid products={display} />
        </div>
      </div>
    </section>
  );
}

function StoreSection({ stores }: { stores: Store[] }) {
  if (stores.length === 0) return null;
  return (
    <section className="px-4 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Verified Boutiques" subtitle="Trusted stores" linkTo="/stores" linkLabel="All stores" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.slice(0, 3).map((store) => (
            <StoreCardMobile key={store.slug} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoreCardMobile({ store }: { store: Store }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/store/${store.slug}`} className="group block overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="relative h-36 overflow-hidden sm:h-44">
          <img src={store.cover} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex items-center gap-2">
              <img src={store.avatar} alt={store.name} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-md" />
              <div className="text-white">
                <p className="text-sm font-bold leading-tight">{store.name}</p>
                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white/70">{store.category}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 text-xs text-[#666]">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
              {Number(store.rating).toFixed(1)}
            </span>
            <span>{store.productCount} pieces</span>
            <span className="hidden sm:inline">{store.location}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] transition group-hover:text-[#111]">
            Visit <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="px-4 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="New Arrivals" subtitle="Fresh drops" linkTo="/shop" linkLabel="View all" />
        <div className="mt-5">
          <ProductGrid products={products.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}

function BestSellers({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="px-4 pt-10 pb-28 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Best Sellers" subtitle="Customer favorites" linkTo="/shop?sort=rating" linkLabel="View all" />
        <div className="mt-5">
          <ProductGrid products={products.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#111111] px-5 py-16 sm:px-6 sm:py-20">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.12),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.08),transparent_50%)]" />
      <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.32em] text-[#D4AF37]">Sell on GIHANGA</p>
        <h2 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-[-0.06em] text-white sm:text-5xl">
          Turn your fashion<br />into a <span className="text-[#D4AF37]">boutique</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60">
          Join Rwanda's premium fashion marketplace. List your products, reach Kigali's style-conscious customers, and grow your brand.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/sell-apply" className="inline-flex h-13 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 text-sm font-bold text-[#111111] shadow-lg transition-all hover:bg-[#D4AF37]/90 active:scale-[0.97]">
            Start selling <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/plans" className="inline-flex h-13 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-white/20 px-8 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-[0.97]">
            View plans
          </Link>
        </div>
      </div>
    </section>
  );
}
