import { motion, useReducedMotion, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star, Heart, ShoppingBag, Check, ChevronDown, X, AlertCircle, Loader2, Trash2, Plus, Minus, Eye, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { type MouseEvent, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type ButtonHTMLAttributes, useState, useId, forwardRef } from "react";
import { cn } from "../utils/cn";
import { formatRwf, type Product, type Store } from "../data/catalog";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// ============================================================
// BUTTON SYSTEM
// ============================================================

type ButtonVariant = "primary" | "secondary" | "gold" | "text" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

type ButtonAsButton = ButtonBaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & { href?: never; to?: never };
type ButtonAsLink = ButtonBaseProps & { to: string; onClick?: () => void } & Omit<ButtonHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;
type ButtonAsExternal = ButtonBaseProps & { href: string; onClick?: () => void } & Omit<ButtonHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternal;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#14171F] text-white shadow-[0_4px_20px_rgba(20,23,31,0.2)] hover:shadow-[0_8px_32px_rgba(20,23,31,0.3)] hover:-translate-y-0.5 active:scale-[0.97] border border-transparent",
  secondary:
    "bg-white text-[#14171F] border border-[#14171F]/20 hover:border-[#2C5A82] hover:text-[#2C5A82] shadow-[0_2px_12px_rgba(20,23,31,0.06)] hover:shadow-[0_8px_32px_rgba(44,90,130,0.15)] hover:-translate-y-0.5 active:scale-[0.97]",
  gold:
    "bg-[#C6912E] text-white shadow-[0_4px_24px_rgba(198,145,46,0.3)] hover:shadow-[0_8px_40px_rgba(198,145,46,0.4)] hover:-translate-y-0.5 active:scale-[0.97] border border-transparent",
  text:
    "bg-transparent text-[#14171F] hover:text-[#2C5A82] active:scale-[0.97] border border-transparent",
  ghost:
    "bg-transparent text-[#14171F] border border-[#14171F]/10 hover:bg-[#FAF9F5] hover:border-[#14171F]/20 active:scale-[0.97]",
  danger:
    "bg-white text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444] shadow-[0_2px_12px_rgba(239,68,68,0.06)] hover:shadow-[0_8px_32px_rgba(239,68,68,0.2)] hover:-translate-y-0.5 active:scale-[0.97]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs gap-1.5 min-h-[36px]",
  md: "px-6 py-3 text-sm gap-2 min-h-[48px]",
  lg: "px-8 py-4 text-base gap-2.5 min-h-[56px]",
};

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", children, className, disabled, loading, icon, iconRight, fullWidth, ...rest } = props;

  const classes = cn(
    "group relative inline-flex items-center justify-center font-bold tracking-[-0.01em] rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C5A82] focus-visible:ring-offset-2",
    variantClasses[variant],
    sizeClasses[size],
    (disabled || loading) && "pointer-events-none opacity-50",
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span className="relative">{children}</span>
      {iconRight ? <span className="shrink-0">{iconRight}</span> : variant !== "text" ? (
        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      ) : null}
    </>
  );

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} onClick={(props as ButtonAsLink).onClick} className={classes}>
        {content}
      </Link>
    );
  }

  if ("href" in props && props.href) {
    return (
      <a href={props.href} onClick={(props as ButtonAsExternal).onClick} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  const { variant: _v, size: _s, children: _c, className: _cl, disabled: _d, loading: _l, icon: _i, iconRight: _ir, fullWidth: _fw, ...buttonRest } = props as ButtonAsButton;

  return (
    <button type="button" disabled={disabled || loading} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

// ============================================================
// INPUT SYSTEM
// ============================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId || generatedId;

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={id} className="block text-sm font-bold text-[#14171F] mb-2">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {icon ? (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none">
              {icon}
            </div>
          ) : null}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border border-[#14171F]/15 bg-white px-4 py-3.5 text-sm text-[#14171F] outline-none transition-all duration-200 placeholder:text-[#999999] focus:border-[#2C5A82] focus:shadow-[0_0_0_3px_rgba(91, 163, 207,0.15)]",
              icon && "pl-11",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
              props.disabled && "bg-[#FAF9F5] cursor-not-allowed opacity-60",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="flex items-center gap-1.5 mt-1.5 text-xs text-[#EF4444]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-[#999999]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

// ============================================================
// SELECT SYSTEM
// ============================================================

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId || generatedId;

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={id} className="block text-sm font-bold text-[#14171F] mb-2">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full appearance-none rounded-xl border border-[#14171F]/15 bg-white px-4 py-3.5 pr-11 text-sm text-[#14171F] outline-none transition-all duration-200 focus:border-[#2C5A82] focus:shadow-[0_0_0_3px_rgba(91, 163, 207,0.15)]",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
              props.disabled && "bg-[#FAF9F5] cursor-not-allowed opacity-60",
              className
            )}
            {...props}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999] pointer-events-none" />
        </div>
        {error ? (
          <p className="flex items-center gap-1.5 mt-1.5 text-xs text-[#EF4444]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

// ============================================================
// BADGE
// ============================================================

type BadgeVariant = "gold" | "black" | "white" | "blue" | "ink" | "success" | "warning" | "error" | "outline";

export function Badge({ children, variant = "black", className, dot }: { children: ReactNode; variant?: BadgeVariant; className?: string; dot?: boolean }) {
  const classes: Record<BadgeVariant, string> = {
    gold: "bg-[#C6912E]/10 text-[#C6912E]",
    black: "bg-[#14171F] text-white",
    blue: "bg-[#2C5A82]/10 text-[#2C5A82]",
    ink: "bg-[#14171F]/10 text-[#14171F]",
    white: "bg-white text-[#14171F] border border-[#14171F]/10",
    success: "bg-[#22C55E]/10 text-[#22C55E]",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
    error: "bg-[#EF4444]/10 text-[#EF4444]",
    outline: "bg-transparent text-[#14171F] border border-[#14171F]/20",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.15em]", classes[variant], className)}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

// ============================================================
// SKELETON LOADING
// ============================================================

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#14171F]/[0.08] bg-white">
      <Skeleton className="aspect-[4/5] !rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20 !rounded-full" />
        <Skeleton className="h-5 w-3/4 !rounded-md" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-24 !rounded-md" />
          <Skeleton className="h-9 w-9 !rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#14171F]/[0.08] bg-white">
      <Skeleton className="h-36 sm:h-56 !rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16 !rounded-full" />
        <Skeleton className="h-5 w-2/3 !rounded-md" />
        <Skeleton className="h-3 w-1/2 !rounded-full" />
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#14171F]/[0.08] bg-white p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 !rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20 !rounded-full" />
          <Skeleton className="h-7 w-32 !rounded-md" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-24 !rounded-full" />
    </div>
  );
}

// ============================================================
// MAGNETIC BUTTON (Backward Compatibility)
// Maps old variant names to the new Button system
// ============================================================

const magneticVariantMap: Record<string, ButtonVariant> = {
  dark: "primary",
  light: "secondary",
  berry: "gold",
  ghost: "ghost",
  mauve: "secondary",
} as const;

export function MagneticButton(props: Record<string, any>) {
  const { variant, ...rest } = props;
  const mappedVariant = variant ? (magneticVariantMap[variant as string] || variant) : "primary";
  return <Button variant={mappedVariant as ButtonVariant} {...rest} />;
}

// ============================================================
// EYEBROW & SECTION HEADER
// ============================================================

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.36em] text-[#2C5A82]", className)}>
      <span className="h-px w-8 bg-[#2C5A82]" />
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
      <h2 className="mt-3 sm:mt-4 font-display text-[clamp(1.6rem,5vw,5.9rem)] font-black leading-[0.9] tracking-[-0.075em] text-[#14171F]">{title}</h2>
      {copy ? <p className={cn("mt-3 sm:mt-4 text-sm leading-6 text-[#6D6D6D] sm:text-lg sm:leading-8", align === "center" && "mx-auto max-w-2xl")}>{copy}</p> : null}
    </div>
  );
}

// ============================================================
// RATING
// ============================================================

export function Rating({ value, size = "sm" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };
  const textMap = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <span className="inline-flex items-center gap-1 font-bold text-[#14171F]">
      <Star className={cn(sizeMap[size], "fill-[#2C5A82] text-[#2C5A82]")} />
      <span className={textMap[size]}>{value.toFixed(1)}</span>
    </span>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================

export function ProductCard({ product, variant = "default" }: { product: Product; variant?: "default" | "editorial" }) {
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const reduceMotion = Boolean(useReducedMotion());
  const tilt = useMotionValue("perspective(900px) rotateX(0deg) rotateY(0deg)");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlistAnim, setWishlistAnim] = useState(false);

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    setWishlistAnim(true);
    setTimeout(() => setWishlistAnim(false), 600);
  };

  const isWishlisted = hasItem(product.slug);

  return (
    <motion.article
      data-reveal
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-xl border border-[#14171F]/[0.08] bg-white shadow-[0_4px_24px_rgba(20,23,31,0.06)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(20,23,31,0.1)] hover:-translate-y-1",
        variant === "editorial" && "rounded-[2.4rem]"
      )}
      style={{ transform: reduceMotion ? "none" : tilt }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#FAF9F5]">
        {!imgLoaded && <Skeleton className="absolute inset-0 !rounded-none" />}
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "h-full w-full object-cover transition-all duration-700 group-hover:scale-105",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {product.discount ? (
              <Badge variant="black">{product.discount}</Badge>
            ) : null}
            {product.tag ? (
              <Badge variant="gold">{product.tag}</Badge>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_2px_12px_rgba(20,23,31,0.1)] transition-all duration-300 hover:scale-110",
              isWishlisted && "bg-[#2C5A82]"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isWishlisted ? "fill-white text-white" : "text-[#14171F]",
                wishlistAnim && "animate-[heartBeat_0.6s_ease-in-out]"
              )}
            />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 translate-y-4 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#14171F]/90 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md">
            <Eye className="h-3.5 w-3.5" /> Quick view
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <Link to={`/store/${product.storeSlug}`} className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#14171F]/60 underline-grow">
            {product.storeName}
          </Link>
          <Rating value={product.rating} size="sm" />
        </div>

        <Link to={`/product/${product.slug}`} className="mt-1.5 font-display text-[clamp(0.875rem,2.5vw,1.5rem)] font-black leading-tight tracking-[-0.02em] text-[#14171F] sm:text-2xl">
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-[clamp(0.875rem,2.5vw,1.5rem)] font-black tracking-[-0.04em] text-[#14171F] sm:text-2xl">{formatRwf(product.price)}</p>
            {product.originalPrice ? (
              <p className="text-[0.6rem] text-[#999999] line-through">{formatRwf(product.originalPrice)}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={`Add ${product.name} to bag`}
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="flex h-12 w-12 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#14171F] text-white transition-all duration-300 hover:bg-[#2C5A82] hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================
// STORE CARD
// ============================================================

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      to={`/store/${store.slug}`}
      data-reveal
      className="group relative block overflow-hidden rounded-xl border border-[#14171F]/[0.08] bg-white shadow-[0_4px_24px_rgba(20,23,31,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(20,23,31,0.12)]"
    >
      <div className="relative h-36 overflow-hidden sm:h-56">
        <img
          src={store.cover}
          alt={`${store.name} boutique`}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70" />
        <div className="absolute left-4 top-4">
          <Badge variant="gold" dot>Verified</Badge>
        </div>
        {store.avatar ? (
          <div className="absolute -bottom-6 left-4">
            <div className="h-14 w-14 rounded-xl border-2 border-white bg-white shadow-[0_4px_16px_rgba(20,23,31,0.12)] overflow-hidden">
              <img src={store.avatar} alt={`${store.name} logo`} className="h-full w-full object-cover" />
            </div>
          </div>
        ) : null}
      </div>
      <div className={cn("p-4", store.avatar && "pt-10")}>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2C5A82]">{store.category}</p>
        <h3 className="mt-1 font-display text-[clamp(0.875rem,2.5vw,1.5rem)] font-black tracking-[-0.05em] text-[#14171F] sm:text-2xl">{store.name}</h3>
        <p className="mt-1 text-xs text-[#6D6D6D]">{store.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <Rating value={store.rating} size="sm" />
          <span className="text-[#6D6D6D]">{store.productCount} pieces</span>
          <span className="text-[#6D6D6D]">{store.location}</span>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// DASHBOARD CARD
// ============================================================

export function DashboardCard({
  icon,
  value,
  label,
  description,
  trend,
  trendLabel,
  className,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  description?: string;
  trend?: "up" | "down";
  trendLabel?: string;
  className?: string;
}) {
  return (
    <div
      data-reveal-scale
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[#14171F]/[0.08] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(20,23,31,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(20,23,31,0.08)] hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF9F5] text-[#14171F] transition-colors duration-300 group-hover:bg-[#2C5A82] group-hover:text-white">
          {icon}
        </div>
        {trend ? (
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.1em]",
            trend === "up" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"
          )}>
            {trendLabel || (trend === "up" ? "+" : "-")}
          </span>
        ) : null}
      </div>
      <p className="mt-4 font-display text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[#14171F]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[#14171F]">{label}</p>
      {description ? <p className="mt-0.5 text-xs text-[#999999]">{description}</p> : null}
    </div>
  );
}

// ============================================================
// BREADCRUMB
// ============================================================

export function Breadcrumb({ items }: { items: Array<{ label: string; to?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#6D6D6D]">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="underline-grow text-[#14171F]/60 transition hover:text-[#14171F]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#14171F]">{item.label}</span>
          )}
          {index < items.length - 1 ? <span className="text-[#14171F]/30">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

export function EmptyState({
  icon,
  title,
  copy,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  copy: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-6 rounded-xl border border-dashed border-[#14171F]/10 bg-white/60 px-6 py-16 sm:py-20 text-center", className)}>
      {icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2C5A82]/10 text-[#2C5A82]">
          {icon}
        </div>
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2C5A82]/10">
          <span className="font-editorial text-3xl text-[#2C5A82]">∅</span>
        </div>
      )}
      <div>
        <h3 className="font-display text-2xl font-black tracking-[-0.05em] text-[#14171F]">{title}</h3>
        <p className="mt-3 max-w-md text-[#6D6D6D]">{copy}</p>
      </div>
      {action}
    </div>
  );
}

// ============================================================
// MODAL / DIALOG
// ============================================================

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-[#14171F]/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          >
            <div className={cn("relative w-full max-w-lg rounded-xl bg-white shadow-[0_24px_80px_rgba(20,23,31,0.2)] max-h-[90vh] overflow-y-auto", className)}>
              {title ? (
                <div className="flex items-center justify-between border-b border-[#14171F]/10 px-6 py-4">
                  <h3 className="font-display text-lg font-black tracking-[-0.03em] text-[#14171F]">{title}</h3>
                  <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#FAF9F5] transition">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

// ============================================================
// TREND INDICATOR
// ============================================================

export function TrendIndicator({ value, direction, className }: { value: string; direction: "up" | "down"; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs font-bold",
      direction === "up" ? "text-[#22C55E]" : "text-[#EF4444]",
      className
    )}>
      {direction === "up" ? (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M6 2L10 6H8V10H4V6H2L6 2Z" fill="currentColor"/></svg>
      ) : (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M6 10L2 6H4V2H8V6H10L6 10Z" fill="currentColor"/></svg>
      )}
      {value}
    </span>
  );
}

// ============================================================
// AVATAR
// ============================================================

export function Avatar({ src, name, size = "md", className }: { src?: string; name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeMap = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={cn("relative overflow-hidden rounded-full bg-[#14171F] text-white font-bold flex items-center justify-center shrink-0", sizeMap[size], className)}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : initials}
    </div>
  );
}

// ============================================================
// STATUS BADGE (for tables, orders, etc.)
// ============================================================

type StatusType = "pending" | "active" | "completed" | "cancelled" | "approved" | "rejected" | "suspended" | "shipped" | "delivered" | "processing";

const statusConfig: Record<StatusType, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pending", variant: "gold" },
  active: { label: "Active", variant: "blue" },
  completed: { label: "Completed", variant: "ink" },
  cancelled: { label: "Cancelled", variant: "outline" },
  approved: { label: "Approved", variant: "blue" },
  rejected: { label: "Rejected", variant: "error" },
  suspended: { label: "Suspended", variant: "outline" },
  shipped: { label: "Shipped", variant: "blue" },
  delivered: { label: "Delivered", variant: "ink" },
  processing: { label: "Processing", variant: "gold" },
};

export function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  const config = statusConfig[status] || { label: status, variant: "outline" as BadgeVariant };
  return <Badge variant={config.variant} dot className={className}>{config.label}</Badge>;
}

// ============================================================
// CONFIRM DIALOG
// ============================================================

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  confirmVariant = "danger",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-[#6D6D6D] leading-6">{message}</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

// ============================================================
// QUANTITY SELECTOR
// ============================================================

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const btnSize = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="inline-flex items-center rounded-full border border-[#14171F]/15 bg-white overflow-hidden">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        className={cn("flex items-center justify-center transition text-[#14171F] hover:text-[#2C5A82] disabled:opacity-30 disabled:cursor-not-allowed", btnSize)}
        onClick={() => onChange(value - 1)}
      >
        <Minus className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
      <span className={cn("w-10 sm:w-12 text-center font-bold", textSize)}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        className={cn("flex items-center justify-center transition text-[#14171F] hover:text-[#2C5A82] disabled:opacity-30 disabled:cursor-not-allowed", btnSize)}
        onClick={() => onChange(value + 1)}
      >
        <Plus className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
    </div>
  );
}

// ============================================================
// TABLE
// ============================================================

export function Table({ headers, children, className }: { headers: string[]; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-[#14171F]/[0.08]", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#14171F]/[0.08] bg-[#FAF9F5]">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3.5 text-left text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#6D6D6D] first:pl-5 last:pr-5">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#14171F]/[0.06]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={cn("px-4 py-3 text-sm text-[#14171F] first:pl-5 last:pr-5", className)}>
      {children}
    </td>
  );
}

// ============================================================
// SELLER / ADMIN STAT CARD
// ============================================================

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  className,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: "up" | "down";
  trendLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-[#14171F]/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(20,23,31,0.04)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(20,23,31,0.08)]",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FAF9F5]">
          {icon}
        </div>
        {trend ? (
          <TrendIndicator value={trendLabel || ""} direction={trend} />
        ) : null}
      </div>
      <p className="mt-3 font-display text-2xl font-black tracking-[-0.04em] text-[#14171F]">{value}</p>
      <p className="mt-0.5 text-xs text-[#6D6D6D]">{label}</p>
    </div>
  );
}

// ============================================================
// SIZE / COLOR PICKER
// ============================================================

export function SizePicker({
  sizes,
  selected,
  onChange,
  label,
}: {
  sizes: string[];
  selected?: string;
  onChange: (size: string) => void;
  label?: string;
}) {
  return (
    <div>
      {label ? <p className="text-sm font-bold text-[#14171F] mb-2">{label}</p> : null}
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={cn(
              "flex h-10 min-w-[40px] items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-all duration-200",
              selected === size
                ? "border-[#14171F] bg-[#14171F] text-white"
                : "border-[#14171F]/15 bg-white text-[#14171F] hover:border-[#14171F]/40 hover:bg-[#FAF9F5]"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColorPicker({
  colors,
  selected,
  onChange,
  label,
}: {
  colors: Array<{ name: string; hex: string }>;
  selected?: string;
  onChange: (name: string) => void;
  label?: string;
}) {
  return (
    <div>
      {label ? <p className="text-sm font-bold text-[#14171F] mb-2">{label}</p> : null}
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onChange(color.name)}
            aria-label={color.name}
            title={color.name}
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200 ring-offset-2",
              selected === color.name ? "ring-2 ring-[#14171F] scale-110" : "hover:scale-105"
            )}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
      {selected ? <p className="mt-1.5 text-xs text-[#6D6D6D]">{selected}</p> : null}
    </div>
  );
}

// ============================================================
// TOOLTIP (Simple CSS-based)
// ============================================================

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <div className="group/tooltip relative">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg bg-[#14171F] px-3 py-1.5 text-xs text-white opacity-0 transition-all duration-200 group-hover/tooltip:opacity-100 translate-y-1 group-hover/tooltip:translate-y-0">
        {content}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#14171F]" />
      </div>
    </div>
  );
}


