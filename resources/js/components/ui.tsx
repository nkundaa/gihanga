import { motion, useReducedMotion, useMotionValue } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../utils/cn";
import { formatRwf, type Product, type Store } from "../data/catalog";
import { useCart } from "../context/CartContext";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.36em] text-[#BFD7F1]", className)}>
      <span className="h-px w-8 bg-[#BFD7F1]" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div data-reveal className={cn("mx-auto max-w-3xl", align === "center" && "text-center", className)}>
      <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
      <h2 className="mt-3 sm:mt-4 font-display text-[clamp(1.6rem,5vw,5.9rem)] font-black leading-[0.9] tracking-[-0.075em] text-[#111111]">{title}</h2>
      {copy ? <p className={cn("mt-3 sm:mt-4 text-sm leading-6 text-[#666666] sm:text-lg sm:leading-8", align === "center" && "mx-auto max-w-2xl")}>{copy}</p> : null}
    </div>
  );
}

type MagneticVariant = "dark" | "light" | "berry" | "ghost" | "mauve";

export function MagneticButton({
  href,
  to,
  children,
  variant = "dark",
  className,
  onClick,
  type = "button",
  disabled,
}: {
  href?: string;
  to?: string;
  children: ReactNode;
  variant?: MagneticVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.34);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 sm:px-8 sm:py-4 min-h-12 font-bold tracking-[-0.01em] transition-[border-radius,box-shadow,background,color] duration-500 hover:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFD7F1] focus-visible:ring-offset-2",
    disabled && "pointer-events-none opacity-50",
    variant === "dark" && "bg-[#111111] text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]",
    variant === "light" && "border border-black/10 bg-white text-[#111111] shadow-[0_16px_45px_rgba(0,0,0,0.08)]",
    variant === "berry" && "bg-[#BFD7F1] text-[#111111] shadow-[0_18px_50px_rgba(191,215,241,0.32)]",
    variant === "mauve" && "bg-[#FFD5EA] text-[#111111] shadow-[0_18px_50px_rgba(255,213,234,0.36)]",
    variant === "ghost" && "border border-white/25 bg-white/10 text-white backdrop-blur-xl",
    className
  );

  const content = (
    <>
      <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="relative z-10">{children}</span>
      <ArrowUpRight className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick}>
        <motion.span className={classes} style={{ x, y }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
          {content}
        </motion.span>
      </Link>
    );
  }

  if (href) {
    const isHash = href.startsWith("#");
    const handleClick = isHash
      ? () => { document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" }); onClick?.(); }
      : onClick;
    return (
      <motion.button type="button" onClick={handleClick} onMouseMove={handleMove} onMouseLeave={handleLeave} className={classes} style={{ x, y }}>
        {content}
      </motion.button>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ x, y }} className={classes}>
      {content}
    </motion.button>
  );
}

export function ProductCard({ product, variant = "default" }: { product: Product; variant?: "default" | "editorial" }) {
  const { addItem } = useCart();
  const reduceMotion = Boolean(useReducedMotion());
  const tilt = useMotionValue("perspective(900px) rotateX(0deg) rotateY(0deg)");

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion || variant === "editorial") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.set(`perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`);
  };

  const handleLeave = () => {
    tilt.set("perspective(900px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <motion.article
      data-reveal
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.07)] transition-shadow duration-500 hover:shadow-[0_30px_110px_rgba(0,0,0,0.12)]",
        variant === "editorial" && "rounded-[2.4rem]"
      )}
      style={{ transform: reduceMotion ? "none" : tilt }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#F8F9FA]">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
        {product.discount ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#111111] px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white">{product.discount}</span>
        ) : null}
        {product.tag ? (
          <span className="absolute right-2 top-2 rounded-full bg-[#FFD5EA] px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#111111]">{product.tag}</span>
        ) : null}
        <span className="pointer-events-none absolute inset-x-2 bottom-2 flex min-h-12 sm:min-h-0 items-center justify-center rounded-full bg-white/90 px-3 py-3 sm:py-2 text-center text-xs font-bold text-[#111111] opacity-0 backdrop-blur-xl transition duration-500 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <Link to={`/store/${product.storeSlug}`} className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#111111]/60 underline-grow">
            {product.storeName}
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#111111]">
            <Star className="h-4 w-4 fill-[#BFD7F1] text-[#BFD7F1]" /> {product.rating.toFixed(1)}
          </span>
        </div>
        <Link to={`/product/${product.slug}`} className="mt-1.5 font-display text-[clamp(0.875rem,2.5vw,1.5rem)] font-black leading-tight tracking-[-0.02em] text-[#111111] sm:text-2xl">
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-[clamp(0.875rem,2.5vw,1.5rem)] font-black tracking-[-0.04em] text-[#111111] sm:text-2xl">{formatRwf(product.price)}</p>
            {product.originalPrice ? <p className="text-[0.6rem] text-[#666666] line-through">{formatRwf(product.originalPrice)}</p> : null}
          </div>
          <button
            type="button"
            aria-label={`Add ${product.name} to bag`}
            onClick={() => addItem(product)}
            className="flex h-12 w-12 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white transition hover:bg-[#BFD7F1] hover:text-[#111111]"
          >
            <ArrowUpRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      to={`/store/${store.slug}`}
      data-reveal
      className="group relative block overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_110px_rgba(0,0,0,0.12)] sm:rounded-[2.4rem]"
    >
      <div className="relative h-36 overflow-hidden sm:h-56">
        <img src={store.cover} alt={`${store.name} boutique`} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70" />
        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#111111] backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-[#BFD7F1]" />
          Verified
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">{store.category}</p>
        <h3 className="mt-1 font-display text-[clamp(0.875rem,2.5vw,1.5rem)] font-black tracking-[-0.05em] text-[#111111] sm:text-2xl">{store.name}</h3>
        <p className="mt-1 text-xs text-[#666666]">{store.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-bold text-[#111111]">
            <Star className="h-4 w-4 fill-[#BFD7F1] text-[#BFD7F1]" /> {store.rating.toFixed(1)}
          </span>
          <span className="text-[#666666]">{store.productCount} pieces</span>
          <span className="text-[#666666]">{store.location}</span>
        </div>
      </div>
    </Link>
  );
}

export function Breadcrumb({ items }: { items: Array<{ label: string; to?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#666666]">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="underline-grow text-[#111111]/60 transition hover:text-[#111111]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#111111]">{item.label}</span>
          )}
          {index < items.length - 1 ? <span className="text-[#111111]/30">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

export function EmptyState({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-[2.4rem] border border-dashed border-black/10 bg-white/60 px-6 py-20 text-center">
      <span className="font-editorial text-6xl text-[#BFD7F1]">∅</span>
      <div>
        <h3 className="font-display text-2xl font-black tracking-[-0.05em]">{title}</h3>
        <p className="mt-3 max-w-md text-[#666666]">{copy}</p>
      </div>
      {action}
    </div>
  );
}
