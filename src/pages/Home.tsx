import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, Store, MapPin, BadgeCheck, ChevronRight } from "lucide-react";
import { useTranslation } from "../context/i18n";
import { cn } from "../utils/cn";
import { categories as mockCategories, products as mockProducts, stores as mockStores, formatRwf, type Product, type Store, type Category } from "../data/catalog";
import { api } from "../api";
import { Button, ProductCard, ProductCardSkeleton, StoreCard } from "../components/ui";
import Seo from "../components/Seo";

const iconByCategory: Record<string, string> = {
  shoes: "👟",
  clothes: "👔",
  accessories: "💎",
  bags: "👜",
  watches: "⌚",
  sportswear: "🏃",
};

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.products.list({}).then(r => r.products).catch(() => mockProducts),
      api.categories.list().then(r => r.categories).catch(() => mockCategories),
      api.stores.list().then(r => r.stores).catch(() => mockStores.slice(0, 3)),
    ]).then(([p, c, s]) => {
      setProducts(p);
      setCategories(c);
      setStores(s);
    }).finally(() => setLoading(false));
  }, []);

  const todaysPicks = products.filter(p => p.featured).slice(0, 6);
  const nearbyProducts = products.filter(p => p.category === "clothes" || p.category === "shoes").slice(0, 4);
  const topStores = stores.filter(s => s.verified).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <Seo title="GIHANGA - Buy and sell fashion in Kigali" path="/" description="The easiest marketplace in Rwanda. Browse, shop, or start selling in minutes." />

      {/* Hero + Search */}
      <section className="relative bg-[#14171F] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-[clamp(1.5rem,5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.06em] text-white">
            {t("home.hero.title")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
            {t("home.hero.subtitle")}
          </p>
          <form onSubmit={handleSearch} className="mx-auto mt-6 max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-xl focus-within:border-[#2C5A82] focus-within:bg-white/20 transition">
              <Search className="ml-3 h-5 w-5 shrink-0 text-white/50" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t("home.search")}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/40"
              />
              <Button type="submit" variant="primary" size="sm" className="shrink-0 px-5 py-3 text-xs">
                {t("nav.search")}
              </Button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-[#2C5A82]" /> 6+ {t("home.stores")}</span>
            <span className="inline-flex items-center gap-1"><Store className="h-3 w-3 text-[#2C5A82]" /> 2,200+ {t("home.products")}</span>
            <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3 text-[#2C5A82]" /> 4.8★ {t("home.rating")}</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black tracking-[-0.05em] sm:text-2xl">{t("home.categories")}</h2>
            <Link to="/shop" className="text-xs font-bold text-[#2C5A82] underline-grow">{t("nav.shop")} →</Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
            {(categories.length > 0 ? categories : mockCategories).map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-black/[0.08] bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <span className="text-2xl sm:text-3xl">{iconByCategory[cat.slug] || "🛍️"}</span>
                <span className="text-[0.55rem] font-black uppercase tracking-[0.12em] text-[#6D6D6D] sm:text-[0.6rem]">{cat.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Picks */}
      <section className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black tracking-[-0.05em] sm:text-2xl">{t("home.todaysPicks")}</h2>
            <Link to="/shop" className="text-xs font-bold text-[#2C5A82] underline-grow">{t("nav.shop")} →</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : todaysPicks.map((p) => <ProductCard key={p.slug} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* Nearby Products */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black tracking-[-0.05em] sm:text-2xl">{t("home.nearby")}</h2>
            <Link to="/shop" className="text-xs font-bold text-[#2C5A82] underline-grow">{t("nav.shop")} →</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : nearbyProducts.map((p) => <ProductCard key={p.slug} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* Top Stores */}
      <section className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black tracking-[-0.05em] sm:text-2xl">{t("home.topStores")}</h2>
            <Link to="/stores" className="text-xs font-bold text-[#2C5A82] underline-grow">{t("nav.stores")} →</Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {topStores.map((s) => <StoreCard key={s.slug} store={s} />)}
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl bg-[#14171F] px-6 py-10 text-center sm:px-12 sm:py-16">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(44,90,130,0.3),transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-black tracking-[-0.05em] text-white sm:text-4xl">{t("home.sellCta")}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/70">{t("home.sellCtaSub")}</p>
              <Button to="/sell" variant="primary" className="mt-6 min-h-12 px-8 py-3 text-sm">
                {t("home.startSelling")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
