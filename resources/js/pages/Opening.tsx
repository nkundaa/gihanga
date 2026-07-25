import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as THREE from "three";
import {
  BadgeCheck, Compass, Footprints, Gem, Search, Shirt, ShoppingBag, Sparkles, Star, Store as StoreIcon, Truck, UserPlus, X,
} from "lucide-react";
import { cn } from "../utils/cn";
import { categories as mockCategories, heroImages, products as mockProducts, stores as mockStores, formatRwf, type Product, type Store, type Category } from "../data/catalog";
import { MagneticButton, ProductCard, SectionHeader, StoreCard } from "../components/ui";
import Seo from "../components/Seo";

const shopCategories = [
  { slug: "men", title: "Men's Fashion", image: heroImages.street, icon: Shirt },
  { slug: "women", title: "Women's Fashion", image: heroImages.clothes, icon: Shirt },
  { slug: "shoes", title: "Shoes", image: heroImages.shoes, icon: Footprints },
  { slug: "bags", title: "Bags", image: heroImages.bags, icon: ShoppingBag },
  { slug: "accessories", title: "Accessories", image: heroImages.accessories, icon: Gem },
];

const whyItems = [
  { title: "Trusted Fashion Stores", copy: "Shop from verified boutiques.", icon: BadgeCheck },
  { title: "Easy Shopping", copy: "Find everything in one place.", icon: ShoppingBag },
  { title: "Fast Delivery", copy: "Receive products quickly within Kigali.", icon: Truck },
  { title: "Local Businesses", copy: "Support fashion stores in your city.", icon: Star },
];

export default function Opening() {
  const reduceMotion = Boolean(useReducedMotion());
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const clothesProduct = mockProducts.find((p) => p.category === "clothes") || mockProducts[0];
  const shoesProduct = mockProducts.find((p) => p.category === "shoes") || mockProducts[1];

  return (
    <div className="overflow-x-hidden bg-[#FAF9F5] text-[#14171F]">
      <Seo title="GIHANGA MARKET - Discover Fashion from Kigali's Best Stores" description="Shop clothes, shoes, bags, and accessories from trusted local fashion stores in Kigali, Rwanda." />

      <HeroSection clothesProduct={clothesProduct} shoesProduct={shoesProduct} />

      <CategoriesSection />

      <FeaturedProductsSection />

      <FeaturedStoresSection />

      <WhyChooseSection />

      <CtaSection />

      <FooterSection />
    </div>
  );
}

function HeroSection({ clothesProduct, shoesProduct }: { clothesProduct: Product; shoesProduct: Product }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Categories", to: "/shop" },
    { label: "Stores", to: "/stores" },
    { label: "New Arrivals", to: "/shop?sort=newest" },
    { label: "Deals", to: "/shop?tag=sale" },
    { label: "About", to: "/about" },
  ];

  return (
    <section ref={containerRef} className="relative flex min-h-[90svh] flex-col justify-between overflow-x-hidden bg-[#14171F] text-white lg:min-h-[100svh]">
      <div aria-hidden className="absolute inset-0 h-full w-full">
        <motion.img
          src={heroImages.hero} alt="" className="h-full w-full object-cover" loading="eager"
          initial={reduceMotion ? false : { scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/90" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(191,215,241,0.18),transparent_40%),radial-gradient(circle_at_75%_75%,rgba(255,213,234,0.15),transparent_40%)]" />
        <div aria-hidden className="luxury-orb left-[10%] top-[15%] h-64 w-60 bg-[#2C5A82]/20" />
        <div aria-hidden className="luxury-orb right-[12%] top-[30%] h-80 w-80 bg-[#2C5A82]/15 [animation-delay:1s]" />
        <div aria-hidden className="absolute inset-0 hidden opacity-70 lg:block">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
            <ParticleField />
            <Orb position={[-2.6, 1.2, 0]} scale={0.75} color="#2C5A82" />
            <Orb position={[2.2, -0.8, -0.6]} scale={1.05} color="#2C5A82" />
          </Canvas>
        </div>
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-2 sm:gap-3">
          <img src="/images/logo.png" alt="" className="h-8 w-auto sm:h-10" />
          <span className="font-display text-sm font-black tracking-[-0.06em] text-white sm:text-xl">GIHANGA</span>
        </motion.div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link, i) => (
            <motion.div key={link.label} initial={reduceMotion ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}>
              <Link to={link.to} className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-white/70 transition hover:text-white lg:text-[0.6rem]">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div className="flex items-center gap-1.5 sm:gap-2" initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
            <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white sm:h-9 sm:w-9" aria-label="Search">
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <Link to="/sell" className="hidden lg:flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.4rem] font-bold uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm transition hover:bg-[#2C5A82] hover:text-[#14171F] lg:px-3.5 lg:text-[0.5rem]">
              <StoreIcon className="h-3 w-3" /> Become a Seller
            </Link>
            <Link to="/login" className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[0.45rem] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm transition hover:bg-white hover:text-[#14171F] sm:px-4 sm:py-2 sm:text-[0.5rem]">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-[#2C5A82] px-3 py-1.5 text-[0.45rem] font-bold uppercase tracking-[0.15em] text-[#14171F] transition hover:bg-white sm:px-4 sm:py-2 sm:text-[0.5rem]">
              Create Account
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[0.4rem] font-black uppercase tracking-[0.15em] text-[#2C5A82] backdrop-blur-xl lg:px-3 lg:py-1.5 lg:text-[0.5rem]">
              <Compass className="h-2 w-2 lg:h-2.5 lg:w-2.5" /> Kigali, Rwanda
            </span>
            <button type="button" onClick={() => setNavOpen(!navOpen)} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 lg:hidden">
              <div className="flex flex-col gap-1"><span className={cn("block h-0.5 w-5 bg-current transition", navOpen && "rotate-45 translate-y-1.5")} /><span className={cn("block h-0.5 w-5 bg-current transition", navOpen && "opacity-0")} /><span className={cn("block h-0.5 w-5 bg-current transition", navOpen && "-rotate-45 -translate-y-1.5")} /></div>
            </button>
          </motion.div>

        {navOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 right-0 top-full border-t border-white/10 bg-[#14171F]/95 backdrop-blur-xl px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setNavOpen(false)} className="text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition hover:text-white">{link.label}</Link>
              ))}
              <hr className="border-white/10" />
              <Link to="/sell" onClick={() => setNavOpen(false)} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-center text-xs font-bold text-white/70">
                <StoreIcon className="h-3.5 w-3.5" /> Become a Seller
              </Link>
              <Link to="/login" onClick={() => setNavOpen(false)} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center text-xs font-bold text-white">Login</Link>
              <Link to="/register" onClick={() => setNavOpen(false)} className="rounded-full bg-[#2C5A82] px-4 py-2 text-center text-xs font-bold text-[#14171F]">Create Account</Link>
            </nav>
          </motion.div>
        )}
      </header>

      {searchOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-[#14171F]/80 backdrop-blur-md" onClick={() => setSearchOpen(false)}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute left-1/2 top-24 w-full max-w-xl -translate-x-1/2 px-4" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => { e.preventDefault(); navigate(`/shop?search=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); }} className="overflow-hidden rounded-[1.5rem] border border-white/30 bg-white/10 backdrop-blur-2xl">
              <div className="flex items-center gap-3 px-5 py-4">
                <Search className="h-5 w-5 text-white/60" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products, stores, brands..." className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40" autoFocus />
                <button type="button" onClick={() => setSearchOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:bg-white/20 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div className="max-w-3xl">
            <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#2C5A82] backdrop-blur-xl sm:gap-2 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Kigali • Verified Fashion
              </span>
            </motion.div>

            <h1 className="mt-3 font-display text-[clamp(1.3rem,5.5vw,6rem)] font-black leading-[0.9] tracking-[-0.08em] text-white sm:mt-6">
              <motion.span initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="block">
                GIHANGA
              </motion.span>
              <motion.span initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }} className="block font-black">
                MARKET
              </motion.span>
            </h1>

            <motion.p className="mt-2 max-w-xl text-xs leading-6 text-white/80 sm:mt-6 sm:text-base sm:leading-8"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              Online Marketplace built in Rwanda.
            </motion.p>

            <motion.div className="mt-4 flex flex-col gap-2 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <MagneticButton to="/shop" variant="gold" className="w-full justify-center px-4 py-3 text-xs min-h-12 sm:w-auto sm:px-6 sm:py-4 sm:text-sm">
                Shop Now
              </MagneticButton>
              <MagneticButton to="/shop" variant="ghost" className="w-full justify-center px-4 py-3 text-xs min-h-12 sm:w-auto sm:px-6 sm:py-4 sm:text-sm">
                Explore Products
              </MagneticButton>
              <MagneticButton to="/stores" variant="secondary" className="w-full justify-center px-4 py-3 text-xs min-h-12 sm:w-auto sm:px-6 sm:py-4 sm:text-sm">
                Browse Stores
              </MagneticButton>
            </motion.div>
          </div>

          <div className="relative hidden h-[500px] items-center justify-center lg:flex">
            <motion.div
              className="absolute left-[5%] top-[10%] z-20 w-64 overflow-hidden rounded-[2.2rem] border border-white/20 bg-white/10 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link to={`/product/${clothesProduct.slug}`} className="block group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                  <img src={clothesProduct.images[0]} alt={clothesProduct.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#14171F]/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#2C5A82] backdrop-blur-sm">In Stock</span>
                </div>
                <div className="mt-3">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#2C5A82]">{clothesProduct.storeName}</p>
                  <h3 className="mt-1 font-display text-base font-black tracking-tight text-white line-clamp-1">{clothesProduct.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-display text-sm font-black text-white">{formatRwf(clothesProduct.price)}</p>
                    <button type="button" onClick={() => navigate(`/product/${clothesProduct.slug}`)} className="rounded-full bg-[#2C5A82] px-3.5 py-1.5 text-xs font-bold text-[#14171F] transition hover:bg-white">Shop Now</button>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              className="absolute right-[5%] bottom-[10%] z-10 w-60 overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Link to={`/product/${shoesProduct.slug}`} className="block group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                  <img src={shoesProduct.images[0]} alt={shoesProduct.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#14171F]/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#2C5A82] backdrop-blur-sm">Verified</span>
                </div>
                <div className="mt-3">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#2C5A82]">{shoesProduct.storeName}</p>
                  <h3 className="mt-1 font-display text-base font-black tracking-tight text-white line-clamp-1">{shoesProduct.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-display text-sm font-black text-white">{formatRwf(shoesProduct.price)}</p>
                    <button type="button" onClick={() => navigate(`/product/${shoesProduct.slug}`)} className="rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#2C5A82] hover:text-[#14171F]">Shop</button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="relative z-20 flex w-full flex-col items-center justify-between gap-1 border-t border-white/10 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/45 sm:flex-row sm:px-6 sm:py-8 sm:text-xs lg:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>© 2026 GIHANGA. All rights reserved.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="py-2 transition hover:text-white">Privacy</a>
          <a href="#" className="py-2 transition hover:text-white">Terms</a>
          <span className="hidden text-white/25 sm:inline">|</span>
          <button type="button" onClick={() => navigate("/home")} className="py-2 transition hover:text-white cursor-pointer">Enter</button>
        </motion.div>
      </footer>
    </section>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i += 1) { positions[i * 3] = (Math.random() - 0.5) * 8; positions[i * 3 + 1] = (Math.random() - 0.5) * 5; positions[i * 3 + 2] = (Math.random() - 0.5) * 4; }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.035 + mouse.x * 0.08;
    ref.current.rotation.x = mouse.y * 0.045;
  });
  return (<points ref={ref} geometry={geometry}><pointsMaterial color="#2C5A82" size={0.025} transparent opacity={0.55} depthWrite={false} /></points>);
}

function Orb({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.18;
    ref.current.rotation.y = clock.elapsedTime * 0.16;
  });
  return (<mesh ref={ref} position={position} scale={scale}><sphereGeometry args={[1, 32, 32]} /><meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} /></mesh>);
}

function CategoriesSection() {
  return (
    <section className="relative overflow-x-hidden bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Shop by category" title={<>Browse what <span className="font-editorial text-[#2C5A82]">you love</span>.</>} className="max-w-2xl" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {shopCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} to={`/shop?category=${cat.slug}`} data-reveal
                className="group relative min-h-[8rem] overflow-hidden rounded-[1.2rem] border border-black/[0.08] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)] transition duration-500 hover:-translate-y-1 sm:min-h-[14rem] lg:min-h-[18rem] lg:rounded-[2rem]">
                <img src={cat.image} alt={cat.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/82" />
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-xl transition group-hover:scale-110 sm:left-5 sm:top-5 sm:h-12 sm:w-12">
                  <Icon className="h-3 w-3 sm:h-5 sm:w-5" strokeWidth={1.8} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white sm:p-4 lg:p-6">
                  <h3 className="font-display text-sm font-black tracking-[-0.06em] sm:text-xl lg:text-2xl">{cat.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const featured = useMemo(() => mockProducts.slice(0, 8), []);
  return (
    <section className="relative overflow-x-hidden bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#FAF9F5] to-white" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader eyebrow="Featured products" title={<>Trending <span className="font-editorial text-[#2C5A82]">now</span>.</>} copy="Discover the pieces that Kigali is shopping right now." />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <Link key={product.slug} to={`/product/${product.slug}`} data-reveal
              className="group block rounded-xl border border-black/[0.08] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="aspect-[1/1] overflow-hidden rounded-t-xl">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-2.5 sm:p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#909090] truncate">{product.storeName}</p>
                <h3 className="mt-0.5 text-xs font-bold leading-tight truncate sm:text-sm">{product.name}</h3>
                <p className="mt-1 text-xs font-black sm:text-sm">{formatRwf(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedStoresSection() {
  const featured = mockStores.filter((s) => s.verified).slice(0, 4);
  return (
    <section className="relative overflow-x-hidden bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Featured stores" title={<>Verified <span className="font-editorial text-[#2C5A82]">boutiques</span>.</>} className="max-w-2xl" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => <StoreCard key={s.slug} store={s} />)}
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section className="relative overflow-x-hidden bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div aria-hidden className="luxury-orb -left-24 top-20 h-72 w-72 bg-[#2C5A82]/20" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader eyebrow="Why choose GIHANGA MARKET" title={<>The best way to <span className="font-editorial text-[#2C5A82]">shop local</span>.</>} align="center" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item) => (
            <article key={item.title} data-reveal
              className="group rounded-[1.5rem] border border-black/[0.08] bg-[#FAF9F5] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:bg-white sm:rounded-[2rem] sm:p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14171F] text-[#2C5A82] transition duration-500 group-hover:rotate-3 group-hover:scale-110 sm:h-14 sm:w-14 sm:rounded-2xl">
                <item.icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 font-display text-xl font-black tracking-[-0.06em] sm:mt-8 sm:text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6D6D6D] sm:mt-4 sm:text-base sm:leading-7">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="overflow-x-hidden bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div data-reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#14171F] p-5 text-white shadow-[0_36px_120px_rgba(0,0,0,0.18)] sm:rounded-[2.8rem] sm:p-12">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(191,215,241,0.26),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(255,213,234,0.12),transparent_32%)]" />
        <div aria-hidden className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10" />
        <div aria-hidden className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#2C5A82]/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.36em] text-[#2C5A82]">Become a seller</p>
            <h2 className="mt-3 max-w-4xl font-display text-[clamp(1.8rem,6vw,7rem)] font-black leading-[0.88] tracking-[-0.08em] sm:mt-5">Own a <span className="font-editorial text-[#2C5A82]">Fashion Store</span>?</h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="mb-5 max-w-md text-sm leading-7 text-white/70 sm:mb-7 sm:text-lg sm:leading-8">Open your online store and reach more customers across Kigali.</p>
            <MagneticButton to="/sell" variant="gold" className="w-full justify-center px-8 py-4 sm:w-auto">Start Selling</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-black/[0.06] bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/images/logo.png" alt="" className="h-8 w-auto" />
              <span className="font-display text-lg font-black tracking-[-0.06em]">GIHANGA</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6D6D6D] max-w-xs">Discover and shop from verified fashion stores across Kigali, Rwanda.</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2C5A82]">Marketplace</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {[["Shop", "/shop"], ["Stores", "/stores"], ["Categories", "/shop"], ["About", "/about"]].map(([l, t]) => (
                <Link key={l} to={t} className="text-sm font-bold uppercase tracking-[0.12em] text-[#6D6D6D] transition hover:text-[#14171F]">{l}</Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2C5A82]">Support</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {[["Help Center", "/contact"], ["Contact", "/contact"], ["Privacy Policy", "/"], ["Terms", "/"]].map(([l, t]) => (
                <Link key={l} to={t} className="text-sm font-bold uppercase tracking-[0.12em] text-[#6D6D6D] transition hover:text-[#14171F]">{l}</Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2C5A82]">Social Media</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {["Instagram", "Facebook", "TikTok"].map((s) => (
                <a key={s} href="#" className="text-sm font-bold uppercase tracking-[0.12em] text-[#6D6D6D] transition hover:text-[#14171F]">{s}</a>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#909090]">© 2026 GIHANGA. All rights reserved.</p>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#909090]">Made in Kigali, Rwanda</p>
        </div>
      </div>
    </footer>
  );
}


