import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { categories as mockCategories, products as mockProducts } from "../data/catalog";
import { api } from "../api";
import { cn } from "../utils/cn";
import { MagneticButton, ProductCard } from "../components/ui";
import Seo from "../components/Seo";
import type { Product } from "../data/catalog";

type Sort = "featured" | "low" | "high" | "rating";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const store = params.get("store") ?? "all";
  const searchParam = params.get("search") ?? "";
  const [sort, setSort] = useState<Sort>("featured");
  const [query, setQuery] = useState(searchParam);
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const sortMap: Record<string, string | undefined> = {
      featured: undefined,
      low: "price_asc",
      high: "price_desc",
      rating: "top_rated",
    };
    api.products.list({
      category: category === "all" ? undefined : category,
      store: store === "all" ? undefined : store,
      search: query || undefined,
      sort: sortMap[sort],
      min_price: priceRange.min,
      max_price: priceRange.max,
    }).then((res) => {
      setProducts(res.products);
      if (res.priceRange) setPriceRange(res.priceRange);
    }).catch(() => {
      let list = mockProducts.slice();
      if (category !== "all") list = list.filter((p) => p.category === category);
      if (store !== "all") list = list.filter((p) => p.storeName === store);
      if (query.trim()) {
        const q = query.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q));
      }
      setProducts(list);
    }).finally(() => setLoading(false));

    api.categories.list().then((res) => setCategories(res.categories)).catch(() => {});
  }, [category, store, query, sort]);

  const uniqueStores = useMemo(() => Array.from(new Set(products.map((p) => p.storeName))).sort(), [products]);

  const setCategory = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("category"); else next.set("category", value);
    setParams(next);
  };

  const hasActiveFilters = category !== "all" || store !== "all" || query !== "";
  const clearFilters = () => { setCategory("all"); setQuery(""); setParams(new URLSearchParams()); };

  return (
    <div className="bg-[#F8F9FA]">
      <Seo title="Shop - Gihanga Market" path="/shop" description="Browse clothing, shoes, bags and accessories from verified stores across Kigali. Shop the Gihanga market for premium fashion in Rwanda." />
      <section className="relative flex min-h-[30svh] items-center overflow-hidden bg-[#111111] py-10 text-white sm:py-12 md:min-h-[40vh] pt-28">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,215,241,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,213,234,0.16),transparent_30%)]" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:text-xs sm:tracking-[0.42em]">The GIHANGA shop</p>
          <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-8">
            <h1 className="max-w-4xl font-display text-[clamp(1.3rem,5vw,5.2rem)] font-black uppercase leading-[0.94] tracking-[-0.08em]">
              <span className="block">The <span className="font-editorial normal-case text-[#BFD7F1]">edit</span></span>
              <span className="block text-stroke text-white">of Kigali</span>
            </h1>
            <p className="max-w-sm text-xs leading-6 text-white/70 sm:text-sm sm:leading-normal">
              A curated shop of verified boutiques across the city. Filter by category, search by name, sort by price or rating.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#666666]"><SlidersHorizontal className="h-4 w-4" /> Category</span>
              <FilterChip label="All" active={category === "all"} onClick={() => setCategory("all")} />
              {categories.map((c) => (
                <FilterChip key={c.slug} label={c.title} active={category === c.slug} onClick={() => setCategory(c.slug)} />
              ))}
            </div>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className={cn("rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition", showFilters ? "border-[#BFD7F1] bg-[#BFD7F1] text-[#111111]" : "border-black/10 bg-white text-[#666666] hover:border-black/30")}>
              <SlidersHorizontal className="mr-1.5 inline h-3.5 w-3.5" /> Filters
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Search</span>
                <input
                  id="search-shop"
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pieces or stores"
                  className="w-full min-w-0 rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none transition focus:border-[#BFD7F1] sm:w-72"
                />
              </label>
              <select
                id="store-filter"
                name="store"
                value={store}
                onChange={(e) => {
                  const next = new URLSearchParams(params);
                  if (e.target.value === "all") next.delete("store"); else next.set("store", e.target.value);
                  setParams(next);
                }}
                className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#111111] outline-none transition focus:border-[#BFD7F1] sm:w-auto"
              >
                <option value="all">All stores</option>
                {uniqueStores.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs font-black uppercase tracking-[0.28em] text-[#666666] sm:inline">Sort</span>
              {([
                ["featured", "Featured"],
                ["low", "Price ↑"],
                ["high", "Price ↓"],
                ["rating", "Top rated"],
              ] as Array<[Sort, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSort(value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] transition sm:px-4 sm:py-2 sm:text-xs",
                    sort === value ? "border-[#111111] bg-[#111111] text-white" : "border-black/10 bg-white text-[#111111] hover:border-black/30"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {showFilters ? (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Price range</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-[#666666]">Min: {priceRange.min.toLocaleString()} RWF</label>
                  <input type="range" min={priceRange.min} max={priceRange.max} step={5000} value={priceRange.min} className="mt-2 w-full accent-[#111111]" readOnly />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-[#666666]">Max: {priceRange.max.toLocaleString()} RWF</label>
                  <input type="range" min={priceRange.min} max={priceRange.max} step={5000} value={priceRange.max} className="mt-2 w-full accent-[#111111]" readOnly />
                </div>
              </div>
            </motion.div>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BFD7F1] border-t-transparent" />
            </div>
          ) : (
            <>
          <div className="flex items-baseline justify-between">
            <motion.p key={`${category}-${store}-${query}-${products.length}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-[#666666]">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </motion.p>
            {hasActiveFilters ? (
              <button type="button" onClick={clearFilters} className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111] underline-grow">
                Clear filters
              </button>
            ) : null}
          </div>

          {products.length === 0 ? (
            <div className="rounded-[2.4rem] border border-dashed border-black/10 bg-white/60 px-6 py-20 text-center">
              <p className="font-editorial text-6xl text-[#BFD7F1]">∅</p>
              <p className="mt-4 font-display text-2xl font-black tracking-[-0.04em]">No pieces match those filters.</p>
              <MagneticButton variant="berry" className="mt-6 px-6 py-3 text-sm" onClick={clearFilters}>Reset</MagneticButton>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
          </>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition",
        active ? "border-[#BFD7F1] bg-[#BFD7F1] text-[#111111]" : "border-black/10 bg-white text-[#111111] hover:border-black/30"
      )}
    >
      {label}
    </button>
  );
}
