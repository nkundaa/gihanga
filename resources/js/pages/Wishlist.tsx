import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { EmptyState, ProductCard, MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

export default function Wishlist() {
  const { items, count, clearWishlist } = useWishlist();

  return (
    <div className="bg-[#F8F9FA]">
      <Seo title="Wishlist - Gihanga Market" path="/wishlist" description="Your saved fashion items on GIHANGA marketplace." />
      <section className="relative flex min-h-[25svh] items-center overflow-hidden bg-[#111111] py-10 text-white sm:py-12 sm:min-h-[30svh] pt-28">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,215,241,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,213,234,0.16),transparent_30%)]" />
        <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:text-xs sm:tracking-[0.42em]">Your wishlist</p>
          <h1 className="mt-3 max-w-5xl font-display text-[clamp(1.3rem,5vw,5.2rem)] font-black uppercase leading-[0.94] tracking-[-0.08em] sm:mt-4">
            Saved <span className="font-editorial normal-case text-[#BFD7F1]">pieces</span><br />
            <span className="text-stroke text-white">you love</span>
          </h1>
          <p className="mt-2 max-w-xl text-xs text-white/70 sm:mt-4 sm:text-sm">
            {count} {count === 1 ? "piece" : "pieces"} saved for later.
          </p>
          {count > 0 ? (
            <button type="button" onClick={clearWishlist} className="mt-3 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#BFD7F1] underline-grow sm:mt-4 sm:text-xs sm:tracking-[0.2em]">
              Clear wishlist
            </button>
          ) : null}
        </div>
      </section>

      <section className="px-5 py-12 sm:py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {count === 0 ? (
            <EmptyState
              title="Your wishlist is empty"
              copy="Start browsing and save the pieces you love."
              action={<MagneticButton to="/shop" variant="berry" className="px-6 py-3 text-sm">Browse shop</MagneticButton>}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {count > 0 ? (
        <section className="bg-white px-5 py-16 sm:py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <Heart className="mx-auto h-8 w-8 text-[#BFD7F1]" />
            <h2 className="mt-4 font-display text-2xl font-black tracking-[-0.05em]">Ready to checkout?</h2>
            <p className="mt-3 text-[#666666]">Your saved pieces are waiting. Add them to your bag and complete your order.</p>
            <div className="mt-8 flex justify-center gap-3">
              <MagneticButton to="/shop" variant="dark" className="px-6 py-3 text-sm">Continue shopping</MagneticButton>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
