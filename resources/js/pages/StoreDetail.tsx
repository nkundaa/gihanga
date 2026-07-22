import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, Clock, MapPin, Star } from "lucide-react";
import { formatRwf, getStore as mockGetStore, products as mockProducts, stores as mockStores, type Product, type Store } from "../data/catalog";
import { api } from "../api";
import { Breadcrumb, MagneticButton, ProductCard, StoreCard } from "../components/ui";
import Seo from "../components/Seo";

export default function StoreDetail() {
  const { slug = "" } = useParams();
  const [store, setStore] = useState<Store | undefined>(undefined);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [others, setOthers] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fallback = () => {
      const s = mockGetStore(slug);
      setStore(s);
      if (s) {
        setStoreProducts(mockProducts.filter((p) => p.storeSlug === s.slug));
        setOthers(mockStores.filter((st) => st.slug !== s.slug).slice(0, 4));
      }
      setLoading(false);
    };

    api.stores.show(slug).then((res) => {
      setStore(res.store);
      setStoreProducts(res.products);
      setOthers(res.otherStores.slice(0, 4));
      setLoading(false);
    }).catch(fallback);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[80svh] items-center justify-center pt-36">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BFD7F1] border-t-transparent" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 pt-36 text-center">
        <p className="font-editorial text-6xl text-[#BFD7F1]">404</p>
        <h1 className="font-display text-4xl font-black tracking-[-0.05em]">Boutique not found.</h1>
        <MagneticButton to="/stores" variant="berry" className="px-6 py-3 text-sm">Back to stores</MagneticButton>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA]">
      <Seo title="Store - Gihanga Market" path="/store" description="View store details on GIHANGA marketplace." />
      <section className="relative overflow-hidden">
        <div className="relative h-[52vh] min-h-[24rem] overflow-hidden">
          <img src={store.cover} alt={store.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/82" />
        </div>

        <div className="absolute left-0 right-0 top-28 z-10 px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb items={[{ label: "Stores", to: "/stores" }, { label: store.name }]} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 text-white">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">
                <BadgeCheck className="h-4 w-4" /> Verified boutique · {store.category}
              </p>
              <h1 className="mt-3 font-display text-[clamp(1.6rem,6vw,7rem)] font-black leading-[0.9] tracking-[-0.08em]">{store.name}</h1>
              <p className="mt-3 max-w-xl text-white/80">{store.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-6 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <div>
                <p className="font-display text-2xl font-black">{store.rating.toFixed(1)}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">{store.reviews} reviews</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black">{store.productCount}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">pieces</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black">{store.founded}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">since</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div data-reveal>
            <h2 className="font-display text-3xl font-black tracking-[-0.05em]">About the boutique</h2>
            <p className="mt-5 text-lg leading-8 text-[#666666]">{store.bio}</p>

            <h3 className="mt-12 font-display text-2xl font-black tracking-[-0.04em]">{store.name} collection</h3>
            {storeProducts.length === 0 ? (
              <p className="mt-4 text-[#666666]">This boutique is preparing new pieces. Check back soon.</p>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {storeProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            )}
          </div>

          <aside data-reveal className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[2rem]">
              <img src={store.avatar} alt={`${store.name} atelier`} className="aspect-square w-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><MapPin className="h-5 w-5 text-[#BFD7F1]" /> <span><strong>{store.location}</strong></span></li>
                <li className="flex gap-3"><Clock className="h-5 w-5 text-[#BFD7F1]" /> <span>{store.hours}</span></li>
                <li className="flex gap-3"><Star className="h-5 w-5 fill-[#BFD7F1] text-[#BFD7F1]" /> <span>{store.rating.toFixed(1)} average rating</span></li>
              </ul>
              <MagneticButton to="/contact" variant="dark" className="mt-6 w-full justify-center px-6 py-3 text-sm">Contact boutique</MagneticButton>
            </div>
            <div className="rounded-[2rem] border border-black/[0.08] bg-[#111111] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Price range</p>
              {storeProducts.length > 0 ? (
                <p className="mt-3 font-display text-2xl font-black tracking-[-0.05em]">
                  {formatRwf(Math.min(...storeProducts.map((p) => p.price)))} — {formatRwf(Math.max(...storeProducts.map((p) => p.price)))}
                </p>
              ) : (
                <p className="mt-3 text-white/70">Contact boutique for pricing.</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-black/[0.08] bg-white px-5 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Keep browsing</p>
              <h2 className="mt-3 font-display text-3xl font-black tracking-[-0.06em] sm:text-4xl">Other <span className="font-editorial text-[#BFD7F1]">boutiques</span></h2>
            </div>
            <Link to="/stores" className="text-sm font-bold underline-grow">All stores →</Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => <StoreCard key={s.slug} store={s} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
