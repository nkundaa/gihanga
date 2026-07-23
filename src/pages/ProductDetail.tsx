import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, Heart, MapPin, ShieldCheck, Star, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "../utils/cn";
import { formatRwf, products as mockProducts, getProduct as mockGetProduct, getReviews as mockGetReviews, type Product, type Review } from "../data/catalog";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Breadcrumb, MagneticButton, ProductCard } from "../components/ui";
import Seo from "../components/Seo";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [fromStore, setFromStore] = useState<Product[]>([]);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setSize(undefined);
    setColor(undefined);

    const fallback = () => {
      const p = mockGetProduct(slug);
      setProduct(p);
      if (p) {
        setRelated(mockProducts.filter((item) => item.slug !== p.slug && item.category === p.category).slice(0, 4));
        setFromStore(mockProducts.filter((item) => item.storeSlug === p.storeSlug && item.slug !== p.slug).slice(0, 3));
        setProductReviews(mockGetReviews(slug));
      }
      setLoading(false);
    };

    api.products.show(slug).then((res) => {
      setProduct(res.product);
      setRelated(res.similar);
      setFromStore(res.storeProducts);
      setLoading(false);
    }).catch(fallback);

    api.products.reviews(slug).then((res) => {
      setProductReviews(res.reviews);
    }).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[80svh] items-center justify-center pt-36">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BFD7F1] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 pt-36 text-center">
        <p className="font-editorial text-6xl text-[#BFD7F1]">404</p>
        <h1 className="font-display text-4xl font-black tracking-[-0.05em]">Piece not found.</h1>
        <MagneticButton to="/shop" variant="berry" className="px-6 py-3 text-sm">Back to shop</MagneticButton>
      </div>
    );
  }

  const storeLink = `/store/${product.storeSlug}`;

  return (
    <div className="bg-[#F8F9FA] pt-28 lg:pt-32">
      <Seo title="Product - Gihanga Market" path="/product" description="View product details on GIHANGA marketplace." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Shop", to: "/shop" }, { label: product.storeName, to: storeLink }, { label: product.name }]} />
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24">
        <div data-reveal>
          <div className="relative overflow-hidden rounded-[2.4rem] bg-white shadow-[0_30px_110px_rgba(0,0,0,0.1)]">
            <img src={product.images[activeImage]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
            {product.discount ? (
              <span className="absolute left-5 top-5 rounded-full bg-[#111111] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">{product.discount}</span>
            ) : null}
            <button type="button" aria-label={hasItem(product.slug) ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleItem(product)} className={cn("absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-xl transition", hasItem(product.slug) ? "bg-[#FFD5EA] text-[#111111]" : "bg-white/85 text-[#111111] hover:bg-[#111111] hover:text-white")}>
              <Heart className={cn("h-5 w-5", hasItem(product.slug) && "fill-[#111111]")} />
            </button>
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn("overflow-hidden rounded-2xl border transition", activeImage === i ? "border-[#111111]" : "border-black/10 hover:border-black/30")}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Link to={storeLink} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#111111]/60 underline-grow">
            <BadgeCheck className="h-4 w-4 text-[#BFD7F1]" /> {product.storeName}
          </Link>
          <h1 className="mt-4 font-display text-[clamp(1.5rem,4.5vw,4.4rem)] font-black leading-[0.92] tracking-[-0.055em]">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1 font-bold"><Star className="h-4 w-4 fill-[#BFD7F1] text-[#BFD7F1]" /> {product.rating.toFixed(1)} · {product.reviews} reviews</span>
            <span className="text-[#666666]">· {product.category}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-4 sm:mt-8">
            <p className="font-display text-xl font-black tracking-[-0.05em] sm:text-3xl">{formatRwf(product.price)}</p>
            {product.originalPrice ? <p className="text-base text-[#666666] line-through sm:text-lg">{formatRwf(product.originalPrice)}</p> : null}
          </div>

          {product.sizes ? (
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Size</p>
                <button type="button" className="text-xs font-bold underline-grow">Size guide</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-9 min-w-9 rounded-full border px-3 text-xs font-bold transition sm:h-11 sm:min-w-11 sm:px-4 sm:text-sm",
                      size === s ? "border-[#111111] bg-[#111111] text-white" : "border-black/10 bg-white text-[#111111] hover:border-black/30"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.colors && product.colors.length > 0 ? (() => {
            const palette = product.colors;
            const selected = color ?? palette[0];
            return (
              <div className="mt-4">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Color · {selected}</p>
                <div className="mt-3 flex gap-2">
                  {palette.map((c) => {
                    const swatch = c === "Berry" ? "#BFD7F1" : c === "Mauve" ? "#FFD5EA" : "#111111";
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        aria-label={c}
                        className={cn("h-9 w-9 rounded-full border transition sm:h-11 sm:w-11", selected === c ? "border-[#111111] ring-2 ring-[#111111]/20 ring-offset-2" : "border-black/10")}
                        style={{ backgroundColor: swatch }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })() : null}

          <div className="mt-4 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <MagneticButton variant="berry" className="w-full justify-center px-5 py-3 text-sm sm:flex-1" onClick={() => addItem(product, { size, color })}>
              Add to bag
            </MagneticButton>
            <MagneticButton variant="dark" className="w-full justify-center px-5 py-3 text-sm sm:flex-1" onClick={() => addItem(product, { size, color })}>
              Buy now
            </MagneticButton>
          </div>

          <ul className="mt-8 grid gap-3 border-t border-black/10 pt-6 text-sm">
            <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#BFD7F1]" /> Buyer protection on every order</li>
            <li className="flex items-center gap-3"><Truck className="h-5 w-5 text-[#BFD7F1]" /> Kigali delivery in 24–48 hours</li>
            <li className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-[#BFD7F1]" /> Sold by a verified GIHANGA boutique</li>
          </ul>

          <details className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
            <summary className="cursor-pointer font-display text-base font-black tracking-[-0.04em]">Description</summary>
            <p className="mt-2 text-sm leading-6 text-[#666666]">{product.description}</p>
          </details>
        </div>
      </div>

      {fromStore.length > 0 ? (
        <section className="border-t border-black/[0.08] bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">From the same boutique</p>
                <h2 className="mt-3 font-display text-3xl font-black tracking-[-0.06em] sm:text-4xl">More from {product.storeName}</h2>
              </div>
              <Link to={storeLink} className="text-sm font-bold underline-grow">Visit store →</Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fromStore.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#F8F9FA] px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">You may also like</p>
              <h2 className="mt-3 font-display text-3xl font-black tracking-[-0.06em] sm:text-4xl">Similar <span className="font-editorial text-[#BFD7F1]">pieces</span></h2>
            </div>
            <Link to="/shop" className="text-sm font-bold underline-grow">Shop all →</Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      <ProductReviews reviews={productReviews} />

      <section className="bg-[#111111] px-5 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-8 text-sm">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#BFD7F1]" /> Delivery in Kigali</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#BFD7F1]" /> Buyer protection</span>
          <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#BFD7F1]" /> Verified boutique</span>
          <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-[#BFD7F1]" /> 4.9 average rating</span>
        </div>
      </section>
    </div>
  );
}

function ProductReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  return (
    <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Customer reviews</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-[-0.06em] sm:text-4xl">
              {avgRating.toFixed(1)} <span className="font-editorial text-[#BFD7F1]">stars</span>
            </h2>
            <p className="mt-1 text-sm text-[#666666]">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA] p-6">
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="font-display text-base font-black tracking-[-0.02em]">{review.name}</p>
                  <p className="text-xs text-[#666666]">{review.date}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < review.rating ? "fill-[#BFD7F1] text-[#BFD7F1]" : "text-[#BFD7F1]/30")} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-[#666666]">{review.text}</p>
              {review.size || review.color ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.size ? <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold">{review.size}</span> : null}
                  {review.color ? <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold">{review.color}</span> : null}
                  <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold"><CheckCircle2 className="h-3 w-3 text-[#BFD7F1]" /> Verified purchase</span>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
