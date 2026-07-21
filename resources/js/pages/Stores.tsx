import { useEffect, useMemo, useState } from "react";
import { stores as mockStores } from "../data/catalog";
import { api } from "../api";
import { cn } from "../utils/cn";
import { MagneticButton, StoreCard } from "../components/ui";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import type { Store } from "../data/catalog";

export default function Stores() {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    api.stores.list().then((res) => {
      setStores(res.stores);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const allCategories = useMemo(() => ["All", ...Array.from(new Set(stores.map((s) => s.category)))], [stores]);
  const featured = stores[0];

  const filtered = useMemo(() => {
    let list = stores.slice();
    if (filter !== "All") list = list.filter((s) => s.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q));
    }
    return list;
  }, [filter, query, stores]);

  return (
    <div className="bg-[#F8F9FA]">
      <Seo title="Stores - Gihanga Market" path="/stores" description="Explore verified fashion boutiques and stores in Kigali on GIHANGA marketplace." />
      <section className="relative flex min-h-[30svh] items-center overflow-hidden bg-[#111111] py-10 text-white sm:py-12 md:min-h-[40vh] pt-28">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(191,215,241,0.2),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(255,213,234,0.18),transparent_30%)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:text-xs sm:tracking-[0.42em]">The network</p>
          <h1 className="mt-3 max-w-5xl font-display text-[clamp(1.3rem,5vw,5.2rem)] font-black uppercase leading-[0.94] tracking-[-0.08em] sm:mt-4">
            Verified <span className="font-editorial normal-case text-[#BFD7F1]">boutiques</span><br />
            <span className="text-stroke text-white">of Kigali</span>
          </h1>
          <p className="mt-3 max-w-xl text-xs leading-6 text-white/70 sm:mt-4 sm:text-sm sm:leading-normal">
            Every store on GIHANGA is reviewed for authenticity, quality and service. Discover the boutiques shaping Kigali's fashion scene.
          </p>
        </div>
      </section>

      {featured ? (
      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <Link to={`/store/${featured.slug}`} data-reveal className="group grid overflow-hidden rounded-[2.8rem] border border-black/[0.08] bg-white shadow-[0_30px_110px_rgba(0,0,0,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[22rem] overflow-hidden">
              <img src={featured.cover} alt={featured.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#111111] backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[#BFD7F1]" /> Featured boutique
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">{featured.category} · {featured.location}</p>
              <h2 className="mt-4 font-display text-3xl font-black leading-[0.9] tracking-[-0.06em] sm:text-4xl">{featured.name}</h2>
              <p className="mt-4 max-w-md text-[#666666]">{featured.bio}</p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm font-bold text-[#111111]">
                <span>{featured.productCount} pieces</span>
                <span>{featured.rating.toFixed(1)} ★ · {featured.reviews} reviews</span>
                <span>Since {featured.founded}</span>
              </div>
              <div className="mt-8">
                <MagneticButton to={`/store/${featured.slug}`} variant="dark" className="px-6 py-3 text-sm">Visit boutique</MagneticButton>
              </div>
            </div>
          </Link>
        </div>
      </section>
      ) : null}

      <section className="px-5 pb-16 sm:pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BFD7F1] border-t-transparent" />
            </div>
          ) : (
            <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition",
                    filter === c ? "border-[#BFD7F1] bg-[#BFD7F1] text-[#111111]" : "border-black/10 bg-white text-[#111111] hover:border-black/30"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search boutiques"
              className="w-full sm:w-72 rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none transition focus:border-[#BFD7F1]"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-10 text-center text-[#666666]">No boutiques match that search yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => <StoreCard key={s.slug} store={s} />)}
            </div>
          )}
          </>
          )}
        </div>
      </section>
    </div>
  );
}
