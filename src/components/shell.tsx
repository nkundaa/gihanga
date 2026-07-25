import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Home, LayoutDashboard, LogIn, LogOut, Mail, MapPinned, Menu, MessageSquare, Minus, Package, Phone, Plus, Search, Shield, ShoppingBag, Store, Trash2, User, UserPlus, X, BadgePercent, Bell, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { formatRwf } from "../data/catalog";
import { Button, QuantitySelector } from "./ui";

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

// ============================================================
// PREMIUM NAVIGATION
// ============================================================

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
  const headerRef = useRef<HTMLElement>(null);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isAuthenticated
    ? [
        { label: "Shop", to: "/shop" },
        { label: "Categories", to: "/shop" },
        { label: "Stores", to: "/stores" },
        { label: "Deals", to: "/shop?tag=sale" },
      ]
    : [
        { label: "Home", to: "/" },
        { label: "Shop", to: "/shop" },
        { label: "Categories", to: "/shop" },
        { label: "Stores", to: "/stores" },
        { label: "About", to: "/about" },
      ];

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
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || !isHomePage
          ? "bg-white/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(20,23,31,0.06)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2 sm:gap-3" aria-label="GIHANGA home">
          <img src="/images/logo.png" alt="" className={cn("h-8 w-auto sm:h-12 transition-all duration-500", (scrolled || !isHomePage) && "sm:h-10")} />
          <span className={cn(
            "font-display text-lg sm:text-2xl font-black tracking-[-0.06em] transition-all duration-500",
            (scrolled || !isHomePage) ? "text-[#14171F]" : "text-white"
          )}>GIHANGA</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-semibold transition-all duration-300 underline-grow",
                  isActive
                    ? (scrolled || !isHomePage) ? "text-[#14171F]" : "text-white"
                    : (scrolled || !isHomePage) ? "text-[#14171F]/60 hover:text-[#14171F]" : "text-white/70 hover:text-white"
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
            className={cn(
              "flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300",
              (scrolled || !isHomePage)
                ? "border border-[#14171F]/10 text-[#14171F] hover:bg-[#14171F] hover:text-white"
                : "border border-white/20 text-white hover:bg-white hover:text-[#14171F]"
            )}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className={cn(
                  "relative hidden lg:flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300",
                  (scrolled || !isHomePage)
                    ? "border border-[#14171F]/10 text-[#14171F] hover:bg-[#14171F] hover:text-white"
                    : "border border-white/20 text-white hover:bg-white hover:text-[#14171F]"
                )}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C5A82] px-1 text-[0.5rem] font-black text-white sm:h-5 sm:min-w-5 sm:text-[0.65rem]">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={openCart}
                aria-label="Open shopping bag"
                className={cn(
                  "relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300",
                  (scrolled || !isHomePage)
                    ? "border border-[#14171F]/10 text-[#14171F] hover:bg-[#14171F] hover:text-white"
                    : "border border-white/20 text-white hover:bg-white hover:text-[#14171F]"
                )}
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {count > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C5A82] px-1 text-[0.5rem] font-black text-white sm:h-5 sm:min-w-5 sm:text-[0.65rem]">
                    {count}
                  </span>
                ) : null}
              </button>
              <div ref={userMenuRef} className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setUserMenu(!userMenu)}
                  className={cn(
                    "flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300",
                    (scrolled || !isHomePage)
                      ? "border border-[#14171F]/10 text-[#14171F] hover:bg-[#14171F] hover:text-white"
                      : "border border-white/20 text-white hover:bg-white hover:text-[#14171F]"
                  )}
                  aria-label="User menu"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <AnimatePresence>
                  {userMenu ? (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-[#14171F]/10 bg-white shadow-[0_20px_60px_rgba(20,23,31,0.12)]"
                    >
                      <div className="border-b border-[#14171F]/10 p-4">
                        <p className="font-display text-base font-black tracking-[-0.02em]">{user?.name}</p>
                        <p className="mt-0.5 text-xs text-[#6D6D6D] capitalize">{user?.role}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                          <LayoutDashboard className="h-4 w-4 text-[#2C5A82]" /> Dashboard
                        </Link>
                        <Link to="/orders" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                          <Package className="h-4 w-4 text-[#2C5A82]" /> Orders
                        </Link>
                        <Link to="/messages" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                          <MessageSquare className="h-4 w-4 text-[#2C5A82]" /> Messages
                        </Link>
                        <Link to="/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                          <User className="h-4 w-4 text-[#2C5A82]" /> Profile
                        </Link>
                        {user?.role === "customer" ? (
                          <Link to="/seller" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                            <Store className="h-4 w-4 text-[#2C5A82]" /> Open Seller Dashboard
                          </Link>
                        ) : null}
                        {user?.role === "seller" ? (
                          <>
                            <Link to="/seller" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                              <Store className="h-4 w-4 text-[#2C5A82]" /> Seller panel
                            </Link>
                            <Link to="/?switch=customer" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                              <ShoppingBag className="h-4 w-4 text-[#2C5A82]" /> Switch to Shopping
                            </Link>
                          </>
                        ) : null}
                        {user?.role === "admin" ? (
                          <>
                            <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                              <Shield className="h-4 w-4 text-[#2C5A82]" /> Admin panel
                            </Link>
                            <Link to="/?switch=customer" onClick={() => setUserMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF9F5]">
                              <ShoppingBag className="h-4 w-4 text-[#2C5A82]" /> Switch to Shopping
                            </Link>
                          </>
                        ) : null}
                        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#EF4444] transition hover:bg-[#FEF2F2]">
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/sell"
                className={cn(
                  "hidden lg:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] transition-all duration-300 sm:text-[0.55rem]",
                  (scrolled || !isHomePage)
                    ? "border border-[#14171F]/10 text-[#14171F] hover:bg-[#14171F] hover:text-white"
                    : "border border-white/20 text-white hover:bg-white hover:text-[#14171F]"
                )}
              >
                <Store className="h-3 w-3" /> Become a Seller
              </Link>
              <Link
                to="/login"
                className={cn(
                  "flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300",
                  (scrolled || !isHomePage)
                    ? "border border-[#14171F]/10 text-[#14171F] hover:bg-[#14171F] hover:text-white"
                    : "border border-white/20 text-white hover:bg-white hover:text-[#14171F]"
                )}
              >
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </>
          )}

          <Button to="/shop" variant="primary" size="sm" className="hidden lg:inline-flex px-5 py-2.5 text-xs">
            Shop Now
          </Button>
          <button
            type="button"
            className={cn(
              "flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full lg:hidden transition-all duration-300",
              (scrolled || !isHomePage)
                ? "border border-[#14171F]/10 text-[#14171F] hover:bg-[#14171F] hover:text-white"
                : "border border-white/20 text-white hover:bg-white hover:text-[#14171F]"
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#14171F]/60 backdrop-blur-sm"
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-20 z-[70] w-full max-w-xl -translate-x-1/2 px-4"
          >
            <form onSubmit={handleSearch} className="overflow-hidden rounded-xl border border-[#14171F]/10 bg-white shadow-[0_24px_80px_rgba(20,23,31,0.2)] backdrop-blur-2xl">
              <div className="flex items-center gap-3 px-5 py-4">
                <Search className="h-5 w-5 text-[#6D6D6D]" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces, stores, categories..."
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#909090]"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#FAF9F5] transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-[#14171F]/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              ref={null}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#14171F]/10 px-4 py-3">
                <span className="font-display text-lg font-black tracking-[-0.06em] text-[#14171F]">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#14171F]/10 text-[#14171F] transition hover:bg-[#14171F] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation links">
                <div className="grid gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div key={link.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          cn(
                            "flex min-h-12 items-center justify-between rounded-lg px-3 py-3 text-base font-semibold transition",
                            isActive ? "bg-[#2C5A82]/10 text-[#14171F]" : "text-[#14171F] hover:bg-[#FAF9F5]"
                          )
                        }
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                        <ChevronRight className="h-5 w-5 text-[#2C5A82]" />
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-5">
                  <Button to="/shop" variant="gold" className="w-full justify-center py-4" onClick={() => setOpen(false)}>
                    Shop Now
                  </Button>
                </div>
              </nav>
              <div className="border-t border-[#14171F]/10 p-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14171F] text-white">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-black text-[#14171F] truncate">{user?.name}</p>
                        <p className="text-xs text-[#6D6D6D] capitalize truncate">{user?.role}</p>
                      </div>
                      <button type="button" onClick={() => { handleLogout(); setOpen(false); }} className="shrink-0 text-sm font-semibold text-[#EF4444] min-h-11 px-2">
                        <LogOut className="h-4 w-4 sm:hidden" />
                        <span className="hidden sm:inline">Sign out</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/dashboard" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[#14171F]/10 bg-white py-2 text-center text-xs font-bold uppercase tracking-[0.15em] transition hover:bg-[#14171F] hover:text-white">Dashboard</Link>
                      <Link to="/profile" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[#14171F]/10 bg-white py-2 text-center text-xs font-bold uppercase tracking-[0.15em] transition hover:bg-[#14171F] hover:text-white">Profile</Link>
                      {user?.role === "customer" ? (
                        <Link to="/seller" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[#14171F]/10 bg-white py-2 text-center text-xs font-bold uppercase tracking-[0.15em] transition hover:bg-[#14171F] hover:text-white">Sell</Link>
                      ) : (
                        <Link to="/" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[#14171F]/10 bg-white py-2 text-center text-xs font-bold uppercase tracking-[0.15em] transition hover:bg-[#14171F] hover:text-white">Shop</Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-[#14171F] transition hover:bg-[#FAF9F5]">
                      <LogIn className="h-5 w-5 text-[#2C5A82]" /> Sign in
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 rounded-lg bg-[#2C5A82] px-3 py-3 text-base font-semibold text-[#14171F] transition hover:bg-[#14171F] hover:text-white">
                      <UserPlus className="h-5 w-5" /> Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

// ============================================================
// MOBILE BOTTOM NAVIGATION
// ============================================================

export function BottomNav() {
  const { count, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const hidePaths = ["/login", "/register", "/seller", "/admin", "/forgot-password"];
  if (hidePaths.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;
  if (location.pathname === "/") return null;

  const navItems = [
    { label: "Home", to: "/", icon: Home, badge: null },
    { label: "Shop", to: "/shop", icon: Search, badge: null },
    { label: "Wishlist", to: "/wishlist", icon: Heart, badge: wishlistCount },
    { label: "Orders", to: "/orders", icon: Package, badge: null },
    { label: "Cart", to: null, icon: ShoppingBag, badge: count, action: openCart },
  ];

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 block border-t border-[#14171F]/10 bg-white/90 backdrop-blur-2xl lg:hidden"
    >
      <div className="flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.to ? location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to)) : false;

          const content = (
            <div className="relative flex flex-col items-center gap-0.5 px-4 py-1.5">
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive ? "text-[#2C5A82]" : "text-[#14171F]/60")} />
                {(item.badge ?? 0) > 0 ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C5A82] px-1 text-[0.45rem] font-black text-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={cn("text-[0.5rem] font-bold uppercase tracking-[0.1em]", isActive ? "text-[#2C5A82]" : "text-[#14171F]/60")}>
                {item.label}
              </span>
            </div>
          );

          if (item.action) {
            return (
              <button key={item.label} type="button" onClick={item.action} aria-label={item.label}>
                {content}
              </button>
            );
          }

          return (
            <Link key={item.label} to={item.to!} aria-label={item.label}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================
// PREMIUM CART DRAWER
// ============================================================

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#14171F]/60 backdrop-blur-sm"
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
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#FAF9F5] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#14171F]/10 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#2C5A82]">Your bag</p>
                <h2 className="font-display text-xl font-black tracking-[-0.05em] sm:text-2xl">{count} item{count === 1 ? "" : "s"}</h2>
              </div>
              <button type="button" onClick={closeCart} aria-label="Close cart" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#14171F]/10 transition hover:bg-[#14171F] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2C5A82]/10">
                    <ShoppingBag className="h-8 w-8 text-[#2C5A82]" />
                  </div>
                  <p className="mt-4 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Your bag is empty</p>
                  <p className="mt-2 text-sm text-[#6D6D6D]">Discover pieces from Kigali's verified boutiques.</p>
                  <Button to="/shop" variant="primary" size="md" className="mt-6" onClick={closeCart}>
                    Browse shop
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {lines.map((line) => (
                    <motion.li
                      key={line.key}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 rounded-lg bg-white p-3 shadow-[0_2px_12px_rgba(20,23,31,0.06)]"
                    >
                      <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-[#FAF9F5]">
                        <img src={line.product.images[0]} alt={line.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-display text-sm font-black leading-tight tracking-[-0.03em] truncate">{line.product.name}</p>
                            <p className="mt-0.5 text-xs text-[#6D6D6D] truncate">
                              {line.product.storeName}
                              {line.size ? ` Â· ${line.size}` : ""}
                              {line.color ? ` Â· ${line.color}` : ""}
                            </p>
                          </div>
                          <button type="button" aria-label="Remove item" onClick={() => removeItem(line.key)} className="shrink-0 text-[#909090] hover:text-[#EF4444] transition p-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QuantitySelector
                            value={line.quantity}
                            onChange={(val) => setQuantity(line.key, val)}
                            size="sm"
                          />
                          <p className="font-display text-base font-black tracking-[-0.03em]">{formatRwf(line.product.price * line.quantity)}</p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 ? (
              <div className="border-t border-[#14171F]/10 bg-white px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6D6D6D]">Subtotal</span>
                  <span className="font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">{formatRwf(subtotal)}</span>
                </div>
                <p className="text-xs text-[#6D6D6D]">Delivery calculated at checkout. Mobile Money available.</p>
                <Button to="/checkout" variant="primary" className="w-full justify-center" onClick={closeCart}>
                  Checkout
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

// ============================================================
// PREMIUM FOOTER
// ============================================================

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#14171F] px-4 py-10 sm:px-6 lg:px-8">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2C5A82]/40 to-transparent" />
      <div aria-hidden className="noise-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/images/logo.png" alt="" className="h-8 w-auto sm:h-12" />
              <span className="font-display text-xl font-black tracking-[-0.08em] text-white sm:text-3xl">GIHANGA</span>
            </Link>
            <p className="mt-2 max-w-md text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">
              Rwanda's premium fashion marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali.
            </p>
            <form className="mt-5 flex flex-col sm:flex-row max-w-md gap-2 overflow-hidden rounded-xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-xl" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter-footer" className="sr-only">Email address</label>
              <input id="newsletter-footer" type="email" autoComplete="email" placeholder="Email for launch updates" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-white/40 sm:px-4 sm:text-sm" />
              <button type="submit" className="w-full rounded-lg bg-[#2C5A82] px-4 py-2.5 text-xs font-bold text-[#14171F] transition hover:bg-[#1C3C57] sm:w-auto sm:px-5 sm:text-sm">Join</button>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-6 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="Explore" items={[{ label: "Shop", to: "/shop" }, { label: "Stores", to: "/stores" }, { label: "Plans", to: "/plans" }, { label: "Why GIHANGA", to: "/why-gihanga" }, { label: "Sell", to: "/sell-apply" }]} />
            <FooterColumn title="Categories" items={[{ label: "Shoes", to: "/shop?category=shoes" }, { label: "Clothes", to: "/shop?category=clothes" }, { label: "Bags", to: "/shop?category=bags" }, { label: "Accessories", to: "/shop?category=accessories" }]} />
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#2C5A82] sm:text-sm sm:tracking-[0.28em]">Contact</h3>
              <ul className="mt-3 space-y-2 text-xs text-white/60 sm:mt-5 sm:space-y-3 sm:text-sm">
                <li className="flex min-h-11 items-center justify-center gap-2 sm:justify-start"><MapPinned className="h-3.5 w-3.5 shrink-0 text-[#2C5A82] sm:h-5 sm:w-5" /> Kicukiro, Kigali, Rwanda</li>
                <li className="flex min-h-11 items-center justify-center gap-2 sm:justify-start"><Mail className="h-3.5 w-3.5 shrink-0 text-[#2C5A82] sm:h-5 sm:w-5" /> gihangamarket@gmail.com</li>
                <li className="flex min-h-11 items-center justify-center gap-2 sm:justify-start"><Phone className="h-3.5 w-3.5 shrink-0 text-[#2C5A82] sm:h-5 sm:w-5" /> +250 799 576 704</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#2C5A82] sm:text-sm sm:tracking-[0.28em]">Newsletter</h3>
              <p className="mt-3 text-xs text-white/55 sm:mt-5 sm:text-sm">The Kigali edit, every Thursday. New stores, drops and stories.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-8 sm:text-sm">
          <p>Copyright 2026 GIHANGA. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="flex min-h-11 items-center transition hover:text-white">Privacy</a>
            <a href="#" className="flex min-h-11 items-center transition hover:text-white">Terms</a>
            <a href="/#/contact" className="flex min-h-11 items-center transition hover:text-white">Support</a>
            <Link to="/admin" className="flex min-h-11 items-center transition hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#2C5A82] sm:text-sm sm:tracking-[0.28em]">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-xs text-white/60 sm:mt-5 sm:space-y-3 sm:text-sm">
        {items.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className="flex min-h-11 items-center justify-center sm:justify-start transition hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================

export function Toast() {
  const { toast } = useCart();
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="fixed bottom-20 lg:bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-[#14171F]/10 bg-white px-5 py-3 text-sm font-bold text-[#14171F] shadow-[0_12px_40px_rgba(20,23,31,0.18)]"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#2C5A82]" />
          {toast}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}


