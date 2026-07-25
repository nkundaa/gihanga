import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { categories as mockCategories, products as mockProducts } from "../data/catalog";
import { api } from "../api";
import { cn } from "../utils/cn";
import { Button, ProductCard, ProductCardSkeleton } from "../components/ui";
import Seo from "../components/Seo";
import type { Product } from "../data/catalog";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const store = params.get("store") ?? "all";
  const searchParam = params.get("search") ?? "";
  const sortParam = params.get("sort") ?? "newest";
  const minPriceParam = params.get("min_price");
  const maxPriceParam = params.get("max_price");
  const ratingParam = params.get("rating");
  const colorParam = params.get("color");
  const sizeParam = params.get("size");
  const [query, setQuery] = useState(searchParam);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState(sortParam);

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(minPriceParam ?? "");
  const [maxPrice, setMaxPrice] = useState(maxPriceParam ?? "");
  const [rating, setRating] = useState(ratingParam ?? "");
  const [color, setColor] = useState(colorParam ?? "");
  const [size, setSize] = useState(sizeParam ?? "");

  useEffect(() => {
    setLoading(true);
    api.products.list({
      category: category === "all" ? undefined : category,
      store: store === "all" ? undefined : store,
      search: query || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      rating: rating || undefined,
      color: color || undefined,
      size: size || undefined,
      sort: sort || undefined,
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
      if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
      if (rating) list = list.filter((p) => p.rating >= Number(rating));
      if (size) list = list.filter((p) => p.sizes?.includes(size));
      if (color) list = list.filter((p) => p.colors?.includes(color));
      if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
      if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
      if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
      setProducts(list);
    }).finally(() => setLoading(false));

    api.categories.list().then((res) => setCategories(res.categories)).catch(() => {});
  }, [category, store, query, sort, minPrice, maxPrice, rating, color, size]);

  const uniqueStores = useMemo(() => Array.from(new Set(products.map((p) => p.storeName))).sort(), [products]);

  const setCategory = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("category"); else next.set("category", value);
    setParams(next);
  };

  const hasActiveFilters = category !== "all" || store !== "all" || query !== "" || minPrice !== "" || maxPrice !== "" || rating !== "" || color !== "" || size !== "" || sort !== "newest";
  const clearFilters = () => { setCategory("all"); setQuery(""); setMinPrice(""); setMaxPrice(""); setRating(""); setColor(""); setSize(""); setSort("newest"); setParams(new URLSearchParams()); };

  return (
    <div className="bg-[#FAF9F5]">
      <Seo title="Shop - Gihanga Market" path="/shop" description="Browse clothing, shoes, bags and accessories from verified stores across Kigali. Shop the Gihanga market for premium fashion in Rwanda." />
      <section className="relative flex min-h-[20svh] items-center overflow-hidden bg-[#14171F] py-6 text-white sm:py-12 md:min-h-[40vh] pt-20">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,215,241,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,213,234,0.16),transparent_30%)]" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#2C5A82] sm:text-xs sm:tracking-[0.42em]">The GIHANGA shop</p>
          <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-8">
            <h1 className="max-w-4xl font-display text-[clamp(1.3rem,5vw,5.2rem)] font-black uppercase leading-[0.94] tracking-[-0.08em]">
              <span className="block">The <span className="font-editorial normal-case text-[#2C5A82]">edit</span></span>
              <span className="block text-stroke text-white">of Kigali</span>
            </h1>
            <p className="max-w-sm text-xs leading-6 text-white/70 sm:text-sm sm:leading-normal">
              A curated shop of verified boutiques across the city. Filter by category, search by name.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="sticky top-[72px] z-30 bg-[#FAF9F5] pb-4 pt-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#6D6D6D]"><SlidersHorizontal className="h-4 w-4" /> Category</span>
                <FilterChip label="All" active={category === "all"} onClick={() => setCategory("all")} />
                {categories.map((c) => (
                  <FilterChip key={c.slug} label={c.title} active={category === c.slug} onClick={() => setCategory(c.slug)} />
                ))}
              </div>
              <button type="button" onClick={() => setShowFilters(!showFilters)} className={cn("rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition", showFilters ? "border-[#2C5A82] bg-[#2C5A82] text-[#14171F]" : "border-black/10 bg-white text-[#6D6D6D] hover:border-black/30")}>
                <SlidersHorizontal className="mr-1.5 inline h-3.5 w-3.5" /> Filters
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Search</span>
                <input
                  id="search-shop"
                  name="search"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pieces or stores"
                  className="w-full min-w-0 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82] sm:w-72"
                />
              </label>
              <select
                id="store-filter"
                name="store"
                autoComplete="off"
                value={store}
                onChange={(e) => {
                  const next = new URLSearchParams(params);
                  if (e.target.value === "all") next.delete("store"); else next.set("store", e.target.value);
                  setParams(next);
                }}
                className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#14171F] outline-none transition focus:border-[#2C5A82] sm:w-auto"
              >
                <option value="all">All stores</option>
                {uniqueStores.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-8">
            {showFilters ? (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#6D6D6D]">Price range</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-[#6D6D6D]">From</label>
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="mt-2 min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-[#6D6D6D]">To</label>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="1,000,000" className="mt-2 min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.28em] text-[#6D6D6D]">Min rating</label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)} className="mt-2 min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]">
                      <option value="">Any</option>
                      <option value="4">4+ stars</option>
                      <option value="3">3+ stars</option>
                      <option value="2">2+ stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.28em] text-[#6D6D6D]">Color</label>
                    <select value={color} onChange={(e) => setColor(e.target.value)} className="mt-2 min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]">
                      <option value="">All</option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                      <option value="Brown">Brown</option>
                      <option value="Pink">Pink</option>
                      <option value="Purple">Purple</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.28em] text-[#6D6D6D]">Size</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)} className="mt-2 min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]">
                      <option value="">All</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.28em] text-[#6D6D6D]">Sort by</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-2 min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]">
                      <option value="newest">Newest</option>
                      <option value="popular">Popular</option>
                      <option value="price_asc">Price: Low-High</option>
                      <option value="price_desc">Price: High-Low</option>
                      <option value="rating">Best Rating</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <motion.p key={`${category}-${store}-${query}-${products.length}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-[#6D6D6D]">
                    {products.length} {products.length === 1 ? "piece" : "pieces"}
                  </motion.p>
                  {hasActiveFilters ? (
                    <button type="button" onClick={clearFilters} className="text-xs font-bold uppercase tracking-[0.2em] text-[#14171F] underline-grow">
                      Clear filters
                    </button>
                  ) : null}
                </div>

                {products.length === 0 ? (
                  <div className="rounded-[2.4rem] border border-dashed border-black/10 bg-white/60 px-6 py-20 text-center">
                    <p className="font-editorial text-6xl text-[#2C5A82]">∅</p>
                    <p className="mt-4 font-display text-2xl font-black tracking-[-0.04em]">No pieces match yet — try a different category</p>
                    <Button variant="primary" className="mt-6 px-6 py-3 text-sm" onClick={clearFilters}>Reset</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
                    {products.map((p) => <ProductCard key={p.slug} product={p} />)}
                  </div>
                )}
              </>
            )}
          </div>
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
        "rounded-full border px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.15em] transition sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]",
        active ? "border-[#2C5A82] bg-[#2C5A82] text-[#14171F]" : "border-black/10 bg-white text-[#14171F] hover:border-black/30"
      )}
    >
      {label}
    </button>
  );
}


