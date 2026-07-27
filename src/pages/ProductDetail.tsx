import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, Heart, MapPin, ShieldCheck, Star, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "../utils/cn";
import { formatRwf, products as mockProducts, getProduct as mockGetProduct, getReviews as mockGetReviews, type Product, type Review } from "../data/catalog";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTranslation } from "../context/i18n";
import { Breadcrumb, Button, ProductCard, Skeleton } from "../components/ui";
import Seo from "../components/Seo";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [fromStore, setFromStore] = useState<Product[]>([]);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const { t } = useTranslation();
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
        setFromStore(mockProducts.filter((item) => item.storeSlug === p.storeSlug && item.slug !== p.slug).slice(0, 3));
        setProductReviews(mockGetReviews(slug));
      }
      setLoading(false);
    };

    api.products.show(slug).then((res) => {
      setProduct(res.product);
      setFromStore(res.storeProducts);
      setLoading(false);
    }).catch(fallback);

    api.products.reviews(slug).then((res) => {
      setProductReviews(res.reviews);
    }).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#FAF9F5] px-4 py-8 sm:px-6 lg:px-8 pt-28 lg:pt-32">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Skeleton className="aspect-[4/5] !rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 !rounded-full" />
            <Skeleton className="h-12 w-3/4 !rounded-md" />
            <Skeleton className="h-10 w-40 !rounded-md" />
            <Skeleton className="h-20 w-full !rounded-xl" />
            <Skeleton className="h-12 w-full !rounded-full" />
            <Skeleton className="h-12 w-full !rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-4 text-center pt-28 lg:pt-32">
        <p className="font-editorial text-6xl text-[#2C5A82]">404</p>
        <h1 className="font-display text-3xl font-black">Piece not found.</h1>
        <Button to="/shop" variant="primary" className="min-h-12 px-6 py-3 text-sm">{t("nav.shop")}</Button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] pt-20 lg:pt-24">
      <Seo title={`${product.name} - Gihanga Market`} path="/product" description={product.description} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("nav.shop"), to: "/shop" }, { label: product.storeName, to: `/store/${product.storeSlug}` }, { label: product.name }]} />
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24">
        {/* Images */}
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-white">
            <img src={product.images[activeImage]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
            {product.discount ? (
              <span className="absolute left-4 top-4 rounded-full bg-[#14171F] px-3 py-1.5 text-xs font-black text-white">{product.discount}</span>
            ) : null}
            <button
              type="button"
              aria-label={hasItem(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleItem(product)}
              className={cn("absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:scale-110", hasItem(product.slug) && "bg-[#2C5A82]")}
            >
              <Heart className={cn("h-4 w-4", hasItem(product.slug) ? "fill-white text-white" : "text-[#14171F]")} />
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn("overflow-hidden rounded-xl border transition", activeImage === i ? "border-[#14171F]" : "border-black/10 hover:border-black/30")}
                >
                  <img src={img} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {/* Title */}
          <h1 className="font-display text-[clamp(1.3rem,4vw,3rem)] font-black leading-[0.95] tracking-[-0.05em]">{product.name}</h1>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-3">
            <p className="font-display text-[clamp(1.3rem,4vw,2.5rem)] font-black tracking-[-0.05em]">{formatRwf(product.price)}</p>
            {product.originalPrice && (
              <>
                <p className="text-sm text-[#6D6D6D] line-through">{formatRwf(product.originalPrice)}</p>
                <span className="rounded-full bg-[#FF6B6B]/10 px-2.5 py-0.5 text-[0.6rem] font-black text-[#FF6B6B]">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Rating + Verified + Store */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 font-bold"><Star className="h-4 w-4 fill-[#2C5A82] text-[#2C5A82]" /> {product.rating.toFixed(1)}</span>
            <span className="inline-flex items-center gap-1 text-[#22C55E] text-xs font-bold"><BadgeCheck className="h-3.5 w-3.5" /> {t("product.verified")}</span>
            <Link to={`/store/${product.storeSlug}`} className="text-xs font-bold text-[#14171F]/60 underline-grow">{product.storeName}</Link>
          </div>

          {/* Delivery Info */}
          <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-black/10 bg-white p-3 text-xs">
            <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-[#2C5A82]" /> Kigali: 24-48h</span>
            <span className="text-black/20">|</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#2C5A82]" /> Kicukiro, Kacyiru, Remera</span>
            <span className="text-black/20">|</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#2C5A82]" /> {t("product.inStock")}</span>
          </div>

          {/* Size */}
          {product.sizes && (
            <div className="mt-4">
              <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D]">{t("product.sizes") || "Size"}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)}
                    className={cn("min-h-10 min-w-10 rounded-full border px-3 text-xs font-bold transition", size === s ? "border-[#14171F] bg-[#14171F] text-white" : "border-black/10 bg-white text-[#14171F] hover:border-black/30")}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D]">{t("product.color") || "Color"} · {color ?? product.colors[0]}</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => {
                  const swatch = c === "Berry" ? "#2C5A82" : c === "Mauve" ? "#2C5A82" : "#14171F";
                  return (
                    <button key={c} type="button" onClick={() => setColor(c)} aria-label={c}
                      className={cn("min-h-10 min-w-10 rounded-full border transition", color === c ? "border-[#14171F] ring-2 ring-[#14171F]/20 ring-offset-2" : "border-black/10")}
                      style={{ backgroundColor: swatch }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Buy Now + Add to Cart */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button variant="gold" className="min-h-12 w-full justify-center px-5 py-3 text-sm sm:flex-1" onClick={() => addItem(product, { size, color })}>
              {t("product.addToCart")}
            </Button>
            <Button variant="primary" className="min-h-12 w-full justify-center px-5 py-3 text-sm sm:flex-1" onClick={() => addItem(product, { size, color })}>
              {t("product.buyNow")}
            </Button>
          </div>

          {/* Description */}
          <details className="mt-4 rounded-xl border border-black/10 bg-white">
            <summary className="min-h-11 flex cursor-pointer items-center px-4 font-display text-sm font-black tracking-[-0.03em]">
              {t("product.description")}
            </summary>
            <p className="border-t border-black/10 px-4 py-3 text-sm leading-6 text-[#6D6D6D]">{product.description}</p>
          </details>

          {/* Trust items */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#6D6D6D]">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#2C5A82]" /> Buyer protection</span>
            <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-[#2C5A82]" /> Free Kigali delivery</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {productReviews.length > 0 && <ProductReviews reviews={productReviews} />}

      {/* More From This Store */}
      {fromStore.length > 0 && (
        <section className="border-t border-black/[0.08] bg-white px-4 py-10 sm:px-6 lg:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-[#2C5A82]">{t("product.moreFromStore")}</p>
                <h2 className="mt-1 font-display text-lg font-black tracking-[-0.06em] sm:text-2xl">{product.storeName}</h2>
              </div>
              <Link to={`/store/${product.storeSlug}`} className="text-xs font-bold underline-grow min-h-11 inline-flex items-center">{t("nav.stores")} →</Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {fromStore.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProductReviews({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation();
  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  return (
    <section id="reviews-section" className="px-4 py-10 sm:px-6 lg:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#2C5A82]">{t("product.reviews")}</p>
            <h2 className="mt-1 font-display text-lg font-black tracking-[-0.06em] sm:text-2xl">{avgRating.toFixed(1)} stars</h2>
            <p className="text-sm text-[#6D6D6D]">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-black/[0.08] bg-white p-5">
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.name} className="h-9 w-9 shrink-0 rounded-full object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="font-display text-sm font-black truncate">{review.name}</p>
                  <p className="text-xs text-[#6D6D6D]">{review.date}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-[#2C5A82] text-[#2C5A82]" : "text-[#2C5A82]/30")} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#6D6D6D]">{review.text}</p>
              {review.size && <span className="mt-2 inline-block rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[0.55rem] font-bold">{review.size}</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
