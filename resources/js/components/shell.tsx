import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Home, LogOut, Mail, MapPinned, Menu, Minus, Phone, Plus, Search, ShoppingBag, Trash2, User, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { formatRwf } from "../data/catalog";
import { MagneticButton } from "./ui";

const links = [
  { label: "Shop", to: "/shop" },
  { label: "Stores", to: "/stores" },
  { label: "Editorial", to: "/editorial" },
  { label: "Sell", to: "/sell" },
  { label: "Plans", to: "/plans" },
  { label: "Contact", to: "/contact" },
];

const bottomNav = [
  { label: "Home", to: "/home", icon: Home },
  { label: "Search", to: "/shop", icon: Search },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Cart", to: "/checkout", icon: ShoppingBag },
  { label: "Profile", to: "/login", icon: User },
];

export function ScrollRestoration() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export function PageTransition({ children, routeKey }: { children: ReactNode; routeKey: string }) {
  const reduceMotion = Boolean(useReducedMotion());
  return (
    <motion.div
      key={routeKey}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openCart, count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, searchOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/home" className="flex items-center gap-2 sm:gap-3" aria-label="GIHANGA home">
            <img src="/images/logo.png" alt="" className="h-9 w-auto sm:h-12" />
            <span className="font-display text-lg font-black tracking-[-0.06em] text-[#111111] sm:text-xl">GIHANGA</span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-semibold transition",
                    isActive ? "text-[#111111]" : "text-[#111111]/60 hover:text-[#111111]"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/5"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/5"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[0.55rem] font-black text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="Open shopping bag"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/5"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111111] px-1 text-[0.55rem] font-black text-white">
                  {count}
                </span>
              ) : null}
            </button>

            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/5"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {userMenu ? (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                    >
                      <div className="border-b border-black/10 p-4">
                        <p className="font-display text-base font-black tracking-[-0.02em]">{user?.name}</p>
                        <p className="mt-0.5 text-xs text-[#666666] capitalize">{user?.role}</p>
                      </div>
                      <div className="p-2">
                        {user?.role === "admin" ? (
                          <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-[#F8F9FA]">
                            Admin panel
                          </Link>
                        ) : null}
                        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-[#F8F9FA]">
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Sign in"
                className="relative hidden h-11 w-11 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/5 sm:flex"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#111111] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#111111]/60 backdrop-blur-md"
              onClick={() => setSearchOpen(false)}
              aria-hidden
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="absolute left-0 right-0 top-16 z-50 px-4 pb-4"
            >
              <form onSubmit={handleSearch} className="overflow-hidden rounded-2xl border border-white/40 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <Search className="h-5 w-5 shrink-0 text-[#999]" />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pieces, stores, categories..."
                    className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#999]"
                  />
                  {searchQuery ? (
                    <button type="button" onClick={() => setSearchQuery("")} className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-[#999]">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {open ? (
            <motion.div
              className="absolute left-0 right-0 top-16 mx-4 overflow-hidden rounded-2xl border border-black/8 bg-white/95 shadow-2xl backdrop-blur-2xl lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-4">
                {links.map((link, index) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition",
                          isActive ? "bg-black/[0.04] text-[#111111]" : "text-[#111111]/80 hover:bg-black/[0.03]"
                        )
                      }
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              {!isAuthenticated ? (
                <div className="border-t border-black/8 p-4">
                  <Link to="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3.5 text-sm font-bold text-white transition hover:bg-[#111111]/90">
                    <User className="h-4 w-4" /> Sign in
                  </Link>
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/8 bg-white/95 backdrop-blur-xl lg:hidden" aria-label="Bottom navigation">
        <div className="mx-auto flex max-w-lg items-center justify-around py-1">
          {bottomNav.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to || (to === "/home" && location.pathname === "/");
            const isCart = label === "Cart";
            const isWishlist = label === "Wishlist";
            return (
              <Link
                key={label}
                to={to}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition",
                  isActive ? "text-[#111111]" : "text-[#999] hover:text-[#111111]"
                )}
                aria-label={label}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {(isCart && count > 0) ? (
                    <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#111111] px-0.5 text-[0.45rem] font-black text-white">
                      {count}
                    </span>
                  ) : null}
                  {(isWishlist && wishlistCount > 0) ? (
                    <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#D4AF37] px-0.5 text-[0.45rem] font-black text-white">
                      {wishlistCount}
                    </span>
                  ) : null}
                </span>
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.08em]">{label}</span>
                {isActive ? (
                  <motion.div layoutId="bottomNav" className="absolute -top-1 h-0.5 w-5 rounded-full bg-[#111111]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, setQuantity, subtotal, count } = useCart();
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#111111]/50 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#F8F9FA] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6 sm:py-5">
              <div>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Your bag</p>
                <h2 className="mt-0.5 font-display text-xl font-black tracking-[-0.05em] sm:text-2xl">{count} item{count === 1 ? "" : "s"}</h2>
              </div>
              <button type="button" onClick={closeCart} aria-label="Close cart" className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition hover:bg-[#111111] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="font-editorial text-6xl text-[#D4AF37]">∅</span>
                  <p className="mt-4 font-display text-xl font-black tracking-[-0.04em]">Your bag is empty</p>
                  <p className="mt-2 text-sm text-[#666]">Discover pieces from Kigali's verified boutiques.</p>
                  <MagneticButton to="/shop" variant="dark" className="mt-6 px-6 py-3 text-sm" onClick={closeCart}>
                    Browse shop
                  </MagneticButton>
                </div>
              ) : (
                <ul className="space-y-3">
                  {lines.map((line) => (
                    <li key={line.key} className="flex gap-3 rounded-xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                      <img src={line.product.images[0]} alt={line.product.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-display text-sm font-black leading-tight tracking-[-0.02em]">{line.product.name}</p>
                            <p className="mt-0.5 text-[0.65rem] text-[#666]">{line.product.storeName}{line.size ? ` · ${line.size}` : ""}{line.color ? ` · ${line.color}` : ""}</p>
                          </div>
                          <button type="button" aria-label="Remove item" onClick={() => removeItem(line.key)} className="shrink-0 text-[#999] transition hover:text-[#111]">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-full border border-black/10">
                            <button type="button" aria-label="Decrease quantity" className="flex h-7 w-7 items-center justify-center transition hover:text-[#D4AF37]" onClick={() => setQuantity(line.key, line.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold">{line.quantity}</span>
                            <button type="button" aria-label="Increase quantity" className="flex h-7 w-7 items-center justify-center transition hover:text-[#D4AF37]" onClick={() => setQuantity(line.key, line.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-display text-sm font-black">{formatRwf(line.product.price * line.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 ? (
              <div className="border-t border-black/10 bg-white px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">Subtotal</span>
                  <span className="font-display text-xl font-black tracking-[-0.04em]">{formatRwf(subtotal)}</span>
                </div>
                <p className="mt-1.5 text-[0.65rem] text-[#999]">Delivery calculated at checkout</p>
                <MagneticButton to="/checkout" variant="dark" className="mt-3 w-full justify-center py-3.5 text-sm" onClick={closeCart}>
                  Checkout
                </MagneticButton>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111111] px-5 py-14 text-white sm:px-6 lg:px-8">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <Link to="/home" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="" className="h-12 w-auto sm:h-14" />
              <span className="font-display text-2xl font-black tracking-[-0.08em] text-white sm:text-3xl">GIHANGA</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
              Rwanda's premium fashion marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali.
            </p>
            <form className="mt-6 flex max-w-md flex-col gap-2 sm:flex-row sm:gap-0 sm:overflow-hidden sm:rounded-full sm:border sm:border-white/15 sm:bg-white/8 sm:p-1 sm:backdrop-blur-xl" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter" className="sr-only">Email address</label>
              <input id="newsletter" type="email" placeholder="Email for launch updates" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 sm:border-0 sm:bg-transparent sm:py-0" />
              <button type="submit" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#D4AF37] sm:rounded-full sm:px-5 sm:py-2.5">Join</button>
            </form>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="Explore" items={[{ label: "Shop", to: "/shop" }, { label: "Stores", to: "/stores" }, { label: "Plans", to: "/plans" }, { label: "Why GIHANGA", to: "/why-gihanga" }, { label: "Sell", to: "/sell-apply" }]} />
            <FooterColumn title="Categories" items={[{ label: "Shoes", to: "/shop?category=shoes" }, { label: "Clothes", to: "/shop?category=clothes" }, { label: "Bags", to: "/shop?category=bags" }, { label: "Accessories", to: "/shop?category=accessories" }]} />
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">Contact</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li className="flex gap-3"><MapPinned className="h-5 w-5 shrink-0 text-[#D4AF37]" /> Kigali, Rwanda</li>
                <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-[#D4AF37]" /> hello@gihanga.rw</li>
                <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-[#D4AF37]" /> +250 788 000 000</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">Newsletter</h3>
              <p className="mt-4 text-sm text-white/55">The Kigali edit, every Thursday. New stores, drops and stories.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 GIHANGA. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-5">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <Link to="/contact" className="transition hover:text-white">Support</Link>
            <Link to="/admin" className="transition hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-white/60">
        {items.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className="transition hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Toast() {
  const { toast } = useCart();
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-black/8 bg-[#111111] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_40px_rgba(0,0,0,0.2)] lg:bottom-8"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#D4AF37]" />
          {toast}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
