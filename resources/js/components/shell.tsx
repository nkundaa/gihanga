import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, LogIn, LogOut, Mail, MapPinned, Menu, Minus, Phone, Plus, Search, ShoppingBag, Trash2, User, X } from "lucide-react";
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
      initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -10, filter: "blur(8px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
  const { openCart, count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/40 bg-white/80 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
      >
        <Link to="/" className="group flex items-center gap-3" aria-label="GIHANGA home">
          <img src="/images/logo.png" alt="" className="h-12 w-auto sm:h-14" />
          <span className="font-display text-xl font-black tracking-[-0.06em] text-[#111111] sm:text-2xl">GIHANGA</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#111111] transition hover:bg-[#111111] hover:text-white"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#111111] transition hover:bg-[#111111] hover:text-white"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFD5EA] px-1 text-[0.65rem] font-black text-[#111111]">
                {wishlistCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label="Open shopping bag"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#111111] transition hover:bg-[#111111] hover:text-white"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#BFD7F1] px-1 text-[0.65rem] font-black text-[#111111]">
                {count}
              </span>
            ) : null}
          </button>

          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenu(!userMenu)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#111111] transition hover:bg-[#111111] hover:text-white"
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#111111] transition hover:bg-[#111111] hover:text-white"
            >
              <LogIn className="h-5 w-5" />
            </Link>
          )}

          <MagneticButton to="/shop" variant="dark" className="hidden px-5 py-3 text-sm sm:inline-flex">
            Shop Now
          </MagneticButton>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#111111] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#111111]/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            className="fixed left-1/2 top-20 z-[70] w-full max-w-xl -translate-x-1/2 px-4"
          >
            <form onSubmit={handleSearch} className="overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-[0_30px_110px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
              <div className="flex items-center gap-3 px-5 py-4">
                <Search className="h-5 w-5 text-[#666666]" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces, stores, categories..."
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#666666]/50"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#666666] transition hover:bg-[#111111] hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[2rem] border border-white/40 bg-white/92 p-5 shadow-2xl backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0, y: -16, clipPath: "inset(0 0 100% 0 round 2rem)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 2rem)" }}
            exit={{ opacity: 0, y: -16, clipPath: "inset(0 0 100% 0 round 2rem)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-1">
              {links.map((link, index) => (
                <motion.div key={link.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-semibold transition",
                        isActive ? "bg-black/[0.04] text-[#111111]" : "text-[#111111] hover:bg-black/[0.04]"
                      )
                    }
                  >
                    {link.label}
                    <ArrowRight className="h-5 w-5 text-[#BFD7F1]" />
                  </NavLink>
                </motion.div>
              ))}
            </div>
            <div className="mt-5">
              <MagneticButton to="/shop" variant="berry" className="w-full justify-center px-5 py-4">
                Shop Now
              </MagneticButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#F8F9FA] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BFD7F1]">Your bag</p>
                <h2 className="font-display text-xl font-black tracking-[-0.05em] sm:text-2xl">{count} item{count === 1 ? "" : "s"}</h2>
              </div>
              <button type="button" onClick={closeCart} aria-label="Close cart" className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition hover:bg-[#111111] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="font-editorial text-7xl text-[#BFD7F1]">∅</span>
                  <p className="mt-4 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Your bag is empty</p>
                  <p className="mt-2 text-sm text-[#666666]">Discover pieces from Kigali's verified boutiques.</p>
                  <MagneticButton to="/shop" variant="dark" className="mt-6 px-6 py-3 text-sm" onClick={closeCart}>
                    Browse shop
                  </MagneticButton>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => (
                    <li key={line.key} className="flex gap-4 rounded-2xl bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                      <img src={line.product.images[0]} alt={line.product.name} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-base font-black leading-tight tracking-[-0.03em]">{line.product.name}</p>
                            <p className="mt-1 text-xs text-[#666666]">{line.product.storeName}{line.size ? ` · ${line.size}` : ""}{line.color ? ` · ${line.color}` : ""}</p>
                          </div>
                          <button type="button" aria-label="Remove item" onClick={() => removeItem(line.key)} className="text-[#666666] transition hover:text-[#111111]">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-full border border-black/10">
                            <button type="button" aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center transition hover:text-[#BFD7F1]" onClick={() => setQuantity(line.key, line.quantity - 1)}>
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{line.quantity}</span>
                            <button type="button" aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center transition hover:text-[#BFD7F1]" onClick={() => setQuantity(line.key, line.quantity + 1)}>
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="font-display text-base font-black">{formatRwf(line.product.price * line.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 ? (
              <div className="border-t border-black/10 bg-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#666666]">Subtotal</span>
                  <span className="font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">{formatRwf(subtotal)}</span>
                </div>
                <p className="mt-2 text-xs text-[#666666]">Delivery, taxes and Mobile Money checkout available in upcoming phases.</p>
                <MagneticButton to="/checkout" variant="berry" className="mt-4 w-full justify-center px-6 py-4" onClick={closeCart}>
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
    <footer className="relative overflow-hidden bg-[#111111] px-5 py-16 text-white sm:px-6 lg:px-8">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BFD7F1]/40 to-transparent" />
      <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="" className="h-14 w-auto sm:h-16" />
              <span className="font-display text-2xl font-black tracking-[-0.08em] text-white sm:text-3xl">GIHANGA</span>
            </Link>
            <p className="mt-5 max-w-md leading-7 text-white/60">
              Rwanda's premium fashion marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali.
            </p>
            <form className="mt-8 flex flex-col sm:flex-row max-w-md gap-2 sm:gap-0 overflow-hidden rounded-2xl sm:rounded-full border border-white/15 bg-white/8 sm:p-1 backdrop-blur-xl" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter" className="sr-only">Email address</label>
              <input id="newsletter" type="email" placeholder="Email for launch updates" className="min-w-0 flex-1 bg-transparent px-4 py-3 sm:py-0 text-sm text-white outline-none placeholder:text-white/40" />
              <button type="submit" className="w-full sm:w-auto rounded-full bg-white px-5 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#BFD7F1]">Join</button>
            </form>
          </div>

          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="Explore" items={[{ label: "Shop", to: "/shop" }, { label: "Stores", to: "/stores" }, { label: "Plans", to: "/plans" }, { label: "Why GIHANGA", to: "/why-gihanga" }, { label: "Sell", to: "/sell-apply" }]} />
            <FooterColumn title="Categories" items={[{ label: "Shoes", to: "/shop?category=shoes" }, { label: "Clothes", to: "/shop?category=clothes" }, { label: "Bags", to: "/shop?category=bags" }, { label: "Accessories", to: "/shop?category=accessories" }]} />
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Contact</h3>
              <ul className="mt-5 space-y-4 text-sm text-white/60">
                <li className="flex gap-3"><MapPinned className="h-5 w-5 text-[#BFD7F1]" /> Kigali, Rwanda</li>
                <li className="flex gap-3"><Mail className="h-5 w-5 text-[#BFD7F1]" /> hello@gihanga.rw</li>
                <li className="flex gap-3"><Phone className="h-5 w-5 text-[#BFD7F1]" /> +250 788 000 000</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Newsletter</h3>
              <p className="mt-5 text-sm text-white/55">The Kigali edit, every Thursday. New stores, drops and stories.</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 GIHANGA. All rights reserved.</p>
          <div className="flex gap-3 sm:gap-5">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <a href="/#/contact" className="transition hover:text-white">Support</a>
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
      <h3 className="text-sm font-black uppercase tracking-[0.28em] text-[#BFD7F1]">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-white/60">
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
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#BFD7F1]" />
          {toast}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
