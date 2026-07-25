import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Bell, ChevronDown, ChevronRight, Clock, Heart, Home, LogOut, MapPin, MessageSquare,
  Package, Search, Settings, ShoppingBag, ShoppingCart, Star, Store, Truck, User, X, Eye, Plus, Minus, Check,
  AlertTriangle, Menu, Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { formatRwf, type Product, type Order, type Store as StoreType } from "../data/catalog";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Seo from "../components/Seo";

const categories = [
  { slug: "clothes", label: "Women", image: "/images/clothes.jpg" },
  { slug: "shoes", label: "Shoes", image: "/images/shoes.jpg" },
  { slug: "bags", label: "Bags", image: "/images/bagsTote.jpg" },
  { slug: "accessories", label: "Accessories", image: "/images/accessories.jpg" },
  { slug: "sportswear", label: "Sportswear", image: "/images/sportswear.jpg" },
  { slug: "watches", label: "Watches", image: "/images/watches.jpg" },
];

const carouselSlides = [
  { title: "New Arrivals", subtitle: "Fresh drops from Kigali's top ateliers", image: "/images/clothes.jpg", link: "/shop?sort=newest" },
  { title: "Flash Sale", subtitle: "Up to 40% off selected pieces", image: "/images/shoes.jpg", link: "/shop?tag=sale" },
  { title: "Featured Stores", subtitle: "Discover verified boutiques near you", image: "/images/boutiqueWindow.jpg", link: "/stores" },
  { title: "Weekend Collection", subtitle: "Curated looks for every occasion", image: "/images/streetTwo.jpg", link: "/shop" },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function CustomerDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items: wishlistItems, toggleItem, hasItem } = useWishlist();
  const { count: cartCount, addItem } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [activity, setActivity] = useState<Array<Record<string, unknown>>>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const carouselTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([
      api.products.list({ take: 20 }).then((res) => setProducts(res.products)).catch(() => {}),
      api.dashboard.stats().then((res) => setOrders(res.recentOrders)).catch(() => {}),
      api.dashboard.stores().then((res) => setStores(res.stores as StoreType[])).catch(() => {}),
      api.dashboard.activity().then((res) => setActivity(res.activity)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    carouselTimer.current = setInterval(() => {
      setCarouselIdx((i) => (i + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(carouselTimer.current);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); setShowSearch(false); return; }
    try {
      const res = await api.products.list({ search: q, take: 5 });
      setSearchResults(res.products);
      setShowSearch(true);
    } catch { setShowSearch(false); }
  };

  const trending = products.filter((p) => p.rating >= 4.8).slice(0, 8);
  const newArrivals = [...products].reverse().slice(0, 8);
  const flashDeals = products.filter((p) => p.salePrice && p.salePrice < p.price).slice(0, 6);
  const recentlyViewed = products.slice(0, 8);
  const recommended = products.filter((p) => p.featured).slice(0, 8);

  const pendingOrders = orders.filter((o) => !["delivered", "cancelled", "refunded"].includes(o.status));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <Seo title="Dashboard - GIHANGA MARKET" path="/" description="Discover premium fashion from Kigali's finest boutiques." />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] text-[#D4AF37] text-sm font-black">G</div>
            <span className="hidden font-display text-base font-black tracking-[-0.03em] sm:block">GIHANGA</span>
          </Link>

          <div ref={searchRef} className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
            <input
              value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products, stores or brands..."
              className="h-10 w-full rounded-full border border-black/10 bg-[#F8F8F8] pl-10 pr-4 text-sm outline-none transition focus:border-[#D4AF37] focus:bg-white"
              onFocus={() => searchQuery.length >= 2 && setShowSearch(true)}
            />
            <AnimatePresence>
              {showSearch && searchResults.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl">
                  {searchResults.map((p) => (
                    <Link key={p.slug} to={`/product/${p.slug}`} onClick={() => setShowSearch(false)} className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#F8F8F8]">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#F8F8F8]">
                        <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{p.name}</p>
                        <p className="text-xs text-[#999]">{p.storeName}</p>
                      </div>
                      <p className="font-display text-sm font-black">{formatRwf(p.price)}</p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: "Shop", to: "/shop" },
              { label: "Categories", to: "/shop" },
              { label: "Stores", to: "/stores" },
              { label: "Deals", to: "/shop?tag=sale" },
            ].map((n) => (
              <Link key={n.label} to={n.to} className="rounded-full px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#666666] transition hover:bg-[#F8F8F8] hover:text-[#111111]">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link to="/wishlist" className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F8F8F8]">
              <Heart className="h-4.5 w-4.5" />
              {wishlistItems.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[0.4rem] font-bold text-white">{wishlistItems.length}</span>}
            </Link>
            <Link to="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F8F8F8]">
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[0.4rem] font-bold text-white">{cartCount}</span>}
            </Link>
            <Link to="/orders" className="flex h-9 w-9 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F8F8F8]">
              <Package className="h-4.5 w-4.5" />
            </Link>
            <button type="button" onClick={() => navigate("/messages")} className="flex h-9 w-9 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F8F8F8]">
              <MessageSquare className="h-4.5 w-4.5" />
            </button>
            <button type="button" onClick={() => setShowNotifPanel(!showNotifPanel)} className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F8F8F8]">
              <Bell className="h-4.5 w-4.5" />
              {activity.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[0.4rem] font-bold text-white">{activity.length}</span>}
            </button>
            <div ref={userMenuRef} className="relative">
              <button type="button" onClick={() => setShowUserMenu(!showUserMenu)} className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111111] bg-[#F8F8F8] overflow-hidden text-[0.55rem] font-bold">
                {user?.name?.[0] ?? "U"}
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl">
                    <div className="border-b border-black/[0.06] px-4 py-3">
                      <p className="text-sm font-bold truncate">{user?.name}</p>
                      <p className="text-xs text-[#999] truncate">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      {[
                        { label: "Dashboard", icon: Home, link: "/" },
                        { label: "My Orders", icon: ShoppingBag, link: "/orders" },
                        { label: "Wishlist", icon: Heart, link: "/wishlist" },
                        { label: "Saved Addresses", icon: MapPin, link: "/profile" },
                        { label: "Settings", icon: Settings, link: "/profile" },
                        { label: "Open Seller Dashboard", icon: Store, link: "/seller" },
                        { label: "Help Center", icon: MessageSquare, link: "/contact" },
                      ].map((i) => (
                        <Link key={i.label} to={i.link} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#666666] transition hover:bg-[#F8F8F8] hover:text-[#111111]">
                          <i.icon className="h-4 w-4" /> {i.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-black/[0.06] p-1.5">
                      <button type="button" onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button type="button" onClick={() => setShowMobileNav(!showMobileNav)} className="flex h-9 w-9 items-center justify-center rounded-full text-[#666666] lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setShowMobileNav(false)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-black/[0.06] p-4">
                <span className="text-sm font-bold">Menu</span>
                <button type="button" onClick={() => setShowMobileNav(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="p-3 space-y-1">
                {["Shop", "Categories", "Stores", "Deals", "Shop All"].map((l) => (
                  <Link key={l} to={l === "Shop All" ? "/shop" : l === "Stores" ? "/stores" : l === "Deals" ? "/shop?tag=sale" : "/shop"} onClick={() => setShowMobileNav(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-[#666666] transition hover:bg-[#F8F8F8] hover:text-[#111111]">
                    {l} <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
              <div className="border-t border-black/[0.06] p-3">
                <Link to="/profile" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition hover:bg-[#F8F8F8]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-[#D4AF37] text-[0.5rem] font-bold">{user?.name?.[0] ?? "U"}</div>
                  {user?.name ?? "Account"}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

            {/* Hero / Welcome Section */}
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-[#D4AF37] text-lg font-black">
                    {user?.name?.[0] ?? "C"}
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                      {greeting}, {user?.name?.split(" ")[0] ?? "Shopper"} 👋
                    </h1>
                    <p className="mt-0.5 text-sm text-[#999]">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <p className="mt-3 text-base text-[#666666]">Discover today's newest fashion in Kigali.</p>
              </div>

              {/* Carousel */}
              <div className="relative w-full lg:w-96 h-44 overflow-hidden rounded-2xl bg-[#F8F8F8]">
                <AnimatePresence mode="wait">
                  <motion.div key={carouselIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                    <img src={carouselSlides[carouselIdx].image} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-20">
                      <p className="text-sm font-black text-white">{carouselSlides[carouselIdx].title}</p>
                      <p className="mt-0.5 text-xs text-white/80">{carouselSlides[carouselIdx].subtitle}</p>
                    </div>
                    <Link to={carouselSlides[carouselIdx].link} className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#111111] transition hover:bg-white">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-2 left-4 flex gap-1.5">
                  {carouselSlides.map((_, i) => (
                    <button key={i} type="button" onClick={() => setCarouselIdx(i)} className={cn("h-1.5 rounded-full transition", i === carouselIdx ? "w-5 bg-[#D4AF37]" : "w-1.5 bg-white/60")} />
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            {recentlyViewed.length > 0 && (
              <Section title="Continue Shopping" link="/shop">
                <HorizontalScroll>
                  {recentlyViewed.map((p) => (
                    <PremiumProductCard key={p.slug} product={p} onWishlist={toggleItem} isWishlisted={hasItem(p.slug)} onAddToCart={() => addItem(p, { quantity: 1 })} />
                  ))}
                </HorizontalScroll>
              </Section>
            )}

            {/* Recommended For You */}
            {recommended.length > 0 && (
              <Section title="Recommended For You" subtitle="Curated pieces based on your style" link="/shop">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {recommended.slice(0, 10).map((p) => (
                    <PremiumProductCard key={p.slug} product={p} onWishlist={toggleItem} isWishlisted={hasItem(p.slug)} onAddToCart={() => addItem(p, { quantity: 1 })} />
                  ))}
                </div>
              </Section>
            )}

            {/* Trending In Kigali */}
            {trending.length > 0 && (
              <Section title="Trending In Kigali" subtitle="Most popular fashion pieces right now" link="/shop?sort=popular">
                <HorizontalScroll>
                  {trending.map((p) => (
                    <PremiumProductCard key={p.slug} product={p} onWishlist={toggleItem} isWishlisted={hasItem(p.slug)} onAddToCart={() => addItem(p, { quantity: 1 })} />
                  ))}
                </HorizontalScroll>
              </Section>
            )}

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
              <Section title="New Arrivals" subtitle="Fresh drops added today" link="/shop?sort=newest">
                <HorizontalScroll>
                  {newArrivals.map((p) => (
                    <PremiumProductCard key={p.slug} product={p} onWishlist={toggleItem} isWishlisted={hasItem(p.slug)} onAddToCart={() => addItem(p, { quantity: 1 })} />
                  ))}
                </HorizontalScroll>
              </Section>
            )}

            {/* Flash Deals */}
            {flashDeals.length > 0 && (
              <Section title="Flash Deals" subtitle="Limited-time offers" link="/shop?tag=sale">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {flashDeals.map((p) => (
                    <div key={p.slug} className="group relative rounded-2xl bg-[#F8F8F8] overflow-hidden">
                      <Link to={`/product/${p.slug}`} className="block">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        {p.salePrice && p.price && (
                          <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2.5 py-0.5 text-[0.5rem] font-bold text-white">
                            -{Math.round((1 - p.salePrice / p.price) * 100)}%
                          </div>
                        )}
                        <div className="absolute top-2 right-2 rounded-full bg-[#D4AF37]/90 px-2 py-0.5 text-[0.45rem] font-bold text-white flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Limited
                        </div>
                      </Link>
                      <div className="p-3">
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[#999]">{p.storeName}</p>
                        <p className="mt-0.5 text-sm font-bold truncate">{p.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-display text-base font-black">{formatRwf(p.salePrice ?? p.price)}</span>
                          {p.salePrice && p.originalPrice && (
                            <span className="text-xs text-[#999] line-through">{formatRwf(p.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Categories */}
            <Section title="Categories" subtitle="Browse by category" link="/shop">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((cat) => (
                  <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="group relative h-40 overflow-hidden rounded-2xl bg-[#F8F8F8]">
                    <img src={cat.image} alt={cat.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-sm font-black text-white">{cat.label}</p>
                      <p className="mt-0.5 text-[0.55rem] text-white/70 uppercase tracking-[0.15em] font-bold">Shop now</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Featured Stores */}
            {stores.length > 0 && (
              <Section title="Featured Stores" subtitle="Verified boutiques in Kigali" link="/stores">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {stores.slice(0, 6).map((s) => (
                    <Link key={s.slug} to={`/store/${s.slug}`} className="group rounded-2xl border border-black/[0.06] bg-white p-5 text-center transition hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-[#F8F8F8]">
                        <img src={s.avatar} alt={s.name} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-3 text-sm font-bold truncate">{s.name}</p>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                        <span className="text-xs text-[#666666]">{Number(s.rating).toFixed(1)}</span>
                      </div>
                      {s.verified && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/10 px-2.5 py-0.5 text-[0.45rem] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                          <Check className="h-3 w-3" /> Verified
                        </span>
                      )}
                      <div className="mt-3 rounded-full border border-black/10 px-3 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#666666] transition group-hover:bg-[#111111] group-hover:text-white">
                        Visit Store
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {/* My Orders Summary */}
            {orders.length > 0 && (
              <Section title="My Orders" subtitle="Recent purchases" link="/orders">
                <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
                  {orders.slice(0, 3).map((o) => (
                    <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-5 py-4 transition hover:bg-[#F8F8F8] last:border-0">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F8F8]">
                          <Package className="h-5 w-5 text-[#666666]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">Order #{o.id} · {o.storeName}</p>
                          <p className="text-xs text-[#999]">{o.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={cn("rounded-full border px-2.5 py-0.5 text-[0.45rem] font-bold uppercase tracking-[0.15em]", statusColors[o.status] ?? "")}>{o.status}</span>
                        <span className="font-display text-sm font-black">{formatRwf(o.total)}</span>
                        <ChevronRight className="h-4 w-4 text-[#999]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {/* Wishlist Preview */}
            {wishlistItems.length > 0 && (
              <Section title="Saved For Later" subtitle={`${wishlistItems.length} items in your wishlist`} link="/wishlist">
                <HorizontalScroll>
                  {wishlistItems.slice(0, 8).map((p) => (
                    <PremiumProductCard key={p.slug} product={p} onWishlist={toggleItem} isWishlisted={true} onAddToCart={() => addItem(p, { quantity: 1 })} />
                  ))}
                </HorizontalScroll>
              </Section>
            )}

            {/* Recently Viewed */}
            {products.length > 0 && (
              <Section title="Recently Viewed" subtitle="Pieces you've checked out" link="/shop">
                <HorizontalScroll>
                  {products.slice(0, 8).reverse().map((p) => (
                    <PremiumProductCard key={p.slug} product={p} onWishlist={toggleItem} isWishlisted={hasItem(p.slug)} onAddToCart={() => addItem(p, { quantity: 1 })} />
                  ))}
                </HorizontalScroll>
              </Section>
            )}

            {/* Recommended Stores */}
            {stores.length > 0 && (
              <Section title="You Might Also Like" subtitle="Stores similar to your favorites" link="/stores">
                <HorizontalScroll>
                  {stores.map((s) => (
                    <Link key={s.slug} to={`/store/${s.slug}`} className="group min-w-[200px] rounded-2xl border border-black/[0.06] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                          <img src={s.avatar} alt={s.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{s.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                            <span className="text-[0.55rem] text-[#666666]">{Number(s.rating).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-[0.55rem] text-[#999] line-clamp-2">{s.bio}</p>
                      <div className="mt-3 flex items-center justify-between">
                        {s.verified && <span className="text-[0.4rem] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">Verified</span>}
                        <span className="text-[0.4rem] font-bold uppercase tracking-[0.15em] text-[#666666] group-hover:text-[#111111]">Follow +</span>
                      </div>
                    </Link>
                  ))}
                </HorizontalScroll>
              </Section>
            )}

          </div>

          {/* Footer */}
          <footer className="border-t border-black/[0.06] bg-[#F8F8F8]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
                <div>
                  <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#999] mb-4">Company</p>
                  <div className="space-y-2.5">
                    {["About", "Contact", "Careers"].map((l) => (
                      <Link key={l} to={`/${l.toLowerCase()}`} className="block text-sm font-bold text-[#666666] transition hover:text-[#111111]">{l}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#999] mb-4">Shopping</p>
                  <div className="space-y-2.5">
                    {["Categories", "Stores", "Deals"].map((l) => (
                      <Link key={l} to={`/${l.toLowerCase()}`} className="block text-sm font-bold text-[#666666] transition hover:text-[#111111]">{l}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#999] mb-4">Support</p>
                  <div className="space-y-2.5">
                    {["Help Center", "Returns", "FAQs"].map((l) => (
                      <Link key={l} to="#" className="block text-sm font-bold text-[#666666] transition hover:text-[#111111]">{l}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#999] mb-4">Legal</p>
                  <div className="space-y-2.5">
                    {["Privacy Policy", "Terms", "Cookies"].map((l) => (
                      <Link key={l} to="#" className="block text-sm font-bold text-[#666666] transition hover:text-[#111111]">{l}</Link>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                  <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#999] mb-4">Stay Connected</p>
                  <div className="flex gap-2 mb-4">
                    {["IG", "FB", "TT", "X"].map((s) => (
                      <Link key={s} to="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-black/10 text-[0.5rem] font-bold transition hover:bg-[#111111] hover:text-white">{s}</Link>
                    ))}
                  </div>
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#666666] mb-2">Newsletter</p>
                  <div className="flex">
                    <input placeholder="Your email" className="h-10 flex-1 rounded-l-full border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[#D4AF37]" />
                    <button type="button" className="flex h-10 items-center rounded-r-full bg-[#111111] px-4 text-[0.5rem] font-bold text-white tracking-[0.15em] uppercase transition hover:bg-[#333]">Subscribe</button>
                  </div>
                </div>
              </div>
              <div className="mt-10 border-t border-black/[0.06] pt-6 text-center">
                <p className="text-[0.55rem] text-[#999]">&copy; {new Date().getFullYear()} GIHANGA MARKET. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>

        {/* Right Activity Panel */}
        <AnimatePresence>
          {showNotifPanel && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="hidden lg:block border-l border-black/[0.06] bg-white overflow-hidden">
              <div className="w-80">
                <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Activity</p>
                  <button type="button" onClick={() => setShowNotifPanel(false)}><X className="h-4 w-4 text-[#999]" /></button>
                </div>
                <div className="p-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                  {activity.length === 0 ? (
                    <p className="py-8 text-center text-sm text-[#999]">No recent activity.</p>
                  ) : (
                    activity.slice(0, 8).map((a, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-[#F8F8F8] p-3">
                        <div className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", a.type === "order" ? "bg-[#D4AF37]" : "bg-[#D4AF37]")} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold">{a.message as string}</p>
                          <p className="text-[0.5rem] text-[#999] mt-0.5">{a.created_at as string}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {pendingOrders.length > 0 && (
                    <div className="rounded-xl border border-black/[0.06] p-3">
                      <p className="text-[0.5rem] font-black uppercase tracking-[0.18em] text-[#D4AF37] mb-2">Active Deliveries</p>
                      <p className="text-xs font-bold">{pendingOrders.length} order{pendingOrders.length > 1 ? "s" : ""} in progress</p>
                      <Link to="/orders" className="mt-2 inline-flex text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#111111]">Track now <ChevronRight className="h-3 w-3" /></Link>
                    </div>
                  )}
                  {flashDeals.length > 0 && (
                    <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-3">
                      <p className="text-[0.5rem] font-black uppercase tracking-[0.18em] text-[#D4AF37] mb-2">Flash Deals</p>
                      <p className="text-xs font-bold">{flashDeals.length} deals ending soon</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-black/[0.06] bg-white/95 backdrop-blur-xl py-1.5 lg:hidden">
        {[
          { label: "Home", icon: HomeIcon, link: "/" },
          { label: "Search", icon: SearchIcon, action: () => document.querySelector<HTMLInputElement>("input[placeholder*='Search']")?.focus() },
          { label: "Wishlist", icon: HeartIcon, link: "/wishlist", count: wishlistItems.length },
          { label: "Cart", icon: BagIcon, link: "/cart", count: cartCount },
          { label: "Profile", icon: UserIcon, link: "/profile" },
        ].map((item) => (
          item.link ? (
            <Link key={item.label} to={item.link} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <div className="relative">
                <item.icon className="h-5 w-5 text-[#999]" />
                {item.count ? <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#111111] text-[0.35rem] font-bold text-white">{item.count}</span> : null}
              </div>
              <span className="text-[0.4rem] font-bold uppercase tracking-[0.12em] text-[#999]">{item.label}</span>
            </Link>
          ) : (
            <button key={item.label} type="button" onClick={item.action} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <item.icon className="h-5 w-5 text-[#999]" />
              <span className="text-[0.4rem] font-bold uppercase tracking-[0.12em] text-[#999]">{item.label}</span>
            </button>
          )
        ))}
      </nav>
    </div>
  );
}

/* Section wrapper */
function Section({ title, subtitle, link, children }: { title: string; subtitle?: string; link?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-black tracking-[-0.04em]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-[#999]">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link} className="flex items-center gap-1 text-xs font-bold text-[#666666] transition hover:text-[#111111]">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/* Horizontal scroll container */
function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };
  return (
    <div className="group relative">
      <button type="button" onClick={() => scroll("left")} className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg opacity-0 transition group-hover:opacity-100 hover:bg-white lg:flex items-center justify-center">
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {children}
      </div>
      <button type="button" onClick={() => scroll("right")} className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg opacity-0 transition group-hover:opacity-100 hover:bg-white lg:flex items-center justify-center">
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* Premium Product Card */
function PremiumProductCard({ product, onWishlist, isWishlisted, onAddToCart }: { product: Product; onWishlist: (product: Product) => void; isWishlisted: boolean; onAddToCart: () => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="group relative min-w-[180px] max-w-[220px] flex-1 snap-start">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F8F8F8]">
          {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-[#F0F0F0]" />}
          <img
            src={product.images[0]} alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={cn("h-full w-full object-cover transition duration-700 group-hover:scale-105", imgLoaded ? "opacity-100" : "opacity-0")}
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2.5 py-0.5 text-[0.45rem] font-bold text-white">
              -{discount}%
            </div>
          )}
          {product.tag && !discount && (
            <div className="absolute top-2 left-2 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[0.45rem] font-bold text-white">
              {product.tag}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
      </Link>

      {/* Hover actions */}
      <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 transition group-hover:opacity-100">
        <button type="button" onClick={(e) => { e.preventDefault(); onWishlist(product); }} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white">
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-red-500 text-red-500" : "text-[#666666]")} />
        </button>
        <button type="button" onClick={(e) => { e.preventDefault(); setShowQuickView(true); }} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white">
          <Eye className="h-4 w-4 text-[#666666]" />
        </button>
      </div>

      <div className="mt-2.5 px-0.5">
        <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#999]">{product.storeName}</p>
        <p className="mt-0.5 text-sm font-bold truncate">{product.name}</p>
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
          <span className="text-[0.6rem] text-[#666666]">{product.rating.toFixed(1)}</span>
          <span className="text-[0.5rem] text-[#999]">({product.reviews})</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="font-display text-base font-black">{formatRwf(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#999] line-through">{formatRwf(product.originalPrice)}</span>
          )}
        </div>
        <button type="button" onClick={(e) => { e.preventDefault(); onAddToCart(); }} className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-2.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]">
          <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowQuickView(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="flex max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="hidden w-1/2 bg-[#F8F8F8] sm:block">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex w-full flex-col justify-center p-6 sm:w-1/2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#999]">{product.storeName}</p>
                    <h3 className="mt-1 font-display text-xl font-black tracking-[-0.04em]">{product.name}</h3>
                  </div>
                  <button type="button" onClick={() => setShowQuickView(false)}><X className="h-5 w-5 text-[#999]" /></button>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={cn("h-4 w-4", s <= Math.round(product.rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#ddd]")} />
                  ))}
                  <span className="ml-1 text-sm text-[#666666]">{product.rating.toFixed(1)} ({product.reviews})</span>
                </div>
                <p className="mt-3 text-sm text-[#666666] line-clamp-3">{product.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-display text-2xl font-black">{formatRwf(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#999] line-through">{formatRwf(product.originalPrice)}</span>
                  )}
                </div>
                <div className="mt-6 flex gap-2">
                  <Link to={`/product/${product.slug}`} onClick={() => setShowQuickView(false)} className="flex-1 rounded-full border border-black/10 py-3 text-center text-[0.5rem] font-bold uppercase tracking-[0.15em] transition hover:bg-[#F8F8F8]">
                    View Details
                  </Link>
                  <button type="button" onClick={() => { onAddToCart(); setShowQuickView(false); }} className="flex-1 rounded-full bg-[#111111] py-3 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]">
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* SVG icons for mobile nav */
function HomeIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function SearchIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function HeartIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
}
function BagIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
}
function UserIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

