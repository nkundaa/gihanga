import { Canvas, useFrame } from "@react-three/fiber";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import {
  BadgeCheck,
  ChevronRight,
  Dumbbell,
  Footprints,
  Gem,
  Lock,
  Navigation as NavigationIcon,
  Quote,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Wallet,
} from "lucide-react";
import { cn } from "../utils/cn";
import { categories as mockCategories, heroImages, products as mockProducts, stores as mockStores, testimonials, type Product, type Store, type Category } from "../data/catalog";
import { api } from "../api";
import { Button, ProductCard, SectionHeader, StoreCard } from "../components/ui";
import Seo from "../components/Seo";

const iconByCategory: Record<string, typeof Shirt> = {
  shoes: Footprints,
  clothes: Shirt,
  accessories: Gem,
  bags: ShoppingBag,
  watches: ShoppingBag,
  sportswear: Dumbbell,
};

const whyItems = [
  { title: "Verified Stores", copy: "Every boutique is reviewed for authenticity, quality and service before selling.", icon: BadgeCheck },
  { title: "Secure Payments", copy: "Checkout-ready architecture for card and Mobile Money payments in future phases.", icon: Lock },
  { title: "Buyer Protection", copy: "Clear store standards, transparent product details and support-first policies.", icon: ShieldCheck },
  { title: "Live Tracking", copy: "A delivery experience designed around map sharing and rider visibility.", icon: NavigationIcon },
  { title: "Fast Delivery", copy: "Kigali-first operations built for quick dispatch from nearby verified stores.", icon: Truck },
  { title: "Mobile Money", copy: "Made for Rwanda's preferred payment behavior, from discovery to delivery.", icon: Wallet },
];

export default function Home() {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>(mockProducts);
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>(mockCategories);
  const [fetchedStores, setFetchedStores] = useState<Store[]>(mockStores);

  useEffect(() => {
    api.products.list({}).then((res) => {
      if (res.products.length > 0) setFetchedProducts(res.products);
    }).catch(() => {});

    api.categories.list().then((res) => {
      if (res.categories.length > 0) setFetchedCategories(res.categories);
    }).catch(() => {});

    api.stores.list().then((res) => {
      if (res.stores.length > 0) setFetchedStores(res.stores);
    }).catch(() => {});
  }, []);

  return (
    <>
      <Seo title="Home - Gihanga Market" path="/home" description="Discover verified fashion boutiques and curated pieces from Kigali on GIHANGA, Rwanda's premium fashion marketplace." />
      <Hero products={fetchedProducts} />
      <Marquee />
      <CategoriesPreview categories={fetchedCategories} />
      <TrendingPreview products={fetchedProducts} />
      <FlashSalesSection products={fetchedProducts} />
      <StoresPreview stores={fetchedStores} />
      <WhyChoose />
      <Testimonials />
      <CtaBanner />
    </>
  );
}

function Hero({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduceMotion) return undefined;
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 25,
        y: (e.clientY / window.innerHeight - 0.5) * 25,
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [reduceMotion]);

  const { scrollY } = useScroll();
  const [vh, setVh] = useState(window.innerHeight);
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const heroScale = useTransform(scrollY, [0, vh], [1, 0.9]);
  const heroOpacity = useTransform(scrollY, [0, vh * 0.7], [1, 0]);
  const yOffset = useTransform(scrollY, [0, vh], [0, 80]);

  const springX = useSpring(mousePos.x, { stiffness: 60, damping: 15 });
  const springY = useSpring(mousePos.y, { stiffness: 60, damping: 15 });

  const clothesProduct = products.find((p) => p.category === "clothes") || products[0];
  const shoesProduct = products.find((p) => p.category === "shoes") || products[1];

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-x-hidden bg-[#14171F] text-white lg:min-h-[100svh]"
    >
      <motion.div
        className="absolute inset-0 h-full w-full"
        style={{ scale: heroScale, opacity: heroOpacity, y: yOffset }}
      >
        <motion.img
          src={heroImages.hero}
          alt="Contemporary Kigali fashion marketplace"
          className="h-full w-full object-cover"
          loading="eager"
          initial={reduceMotion ? false : { scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/90" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.15),transparent_40%),radial-gradient(circle_at_75%_75%,rgba(212,175,55,0.1),transparent_40%)]" />
        <div aria-hidden className="luxury-orb left-[10%] top-[15%] h-64 w-60 bg-[#2C5A82]/15" />
        <div aria-hidden className="luxury-orb right-[12%] top-[30%] h-80 w-80 bg-[#2C5A82]/10 [animation-delay:1s]" />
        <div aria-hidden className="absolute inset-0 hidden opacity-70 lg:block"><HeroScene /></div>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:text-left">
          
          <div className="max-w-3xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.5rem] font-black uppercase tracking-[0.2em] text-[#2C5A82] backdrop-blur-xl sm:gap-2 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Kigali â€¢ Verified Fashion
              </span>
            </motion.div>

            <h1 className="mt-3 font-display text-[clamp(1.3rem,5.5vw,6rem)] font-black leading-[0.9] tracking-[-0.08em] text-white sm:mt-6">
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Browse what <span className="font-editorial text-[#2C5A82]">you</span> love
              </motion.span>
            </h1>

            <motion.p
              className="mt-2 max-w-xl text-xs leading-6 text-white/80 sm:mt-6 sm:text-base sm:leading-8"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Shop trending products, explore trusted stores, and connect with sellers across Rwanda.
            </motion.p>

            <motion.div
              className="mt-4 flex w-full flex-col gap-2 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button to="/shop" variant="primary" className="w-full justify-center px-5 py-3 text-xs sm:w-auto">
                Shop Now
              </Button>
              <Button to="/stores" variant="ghost" className="w-full justify-center px-5 py-3 text-xs sm:w-auto">
                Explore Stores
              </Button>
            </motion.div>
          </div>

          <div className="relative hidden h-[500px] items-center justify-center lg:flex">
            <motion.div
              style={{ x: springX, y: springY }}
              className="absolute left-[5%] top-[10%] z-20 w-64 overflow-hidden rounded-[2.2rem] border border-white/20 bg-white/10 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link to={`/product/${clothesProduct.slug}`} className="block group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                  <img
                    src={clothesProduct.images[0]}
                    alt={clothesProduct.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#14171F]/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#2C5A82] backdrop-blur-sm">
                    In Stock
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#2C5A82]">{clothesProduct.storeName}</p>
                  <h3 className="mt-1 font-display text-base font-black tracking-tight text-white line-clamp-1">{clothesProduct.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-display text-sm font-black text-white">{clothesProduct.price.toLocaleString()} RWF</p>
                    <span className="rounded-full bg-[#2C5A82] px-3.5 py-1.5 text-xs font-bold text-[#14171F] transition group-hover:bg-white">
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              style={{ x: useTransform(springX, (v) => -v * 0.8), y: useTransform(springY, (v) => -v * 0.8) }}
              className="absolute right-[5%] bottom-[10%] z-10 w-60 overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Link to={`/product/${shoesProduct.slug}`} className="block group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                  <img
                    src={shoesProduct.images[0]}
                    alt={shoesProduct.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#14171F]/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#2C5A82] backdrop-blur-sm">
                    Verified
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#2C5A82]">{shoesProduct.storeName}</p>
                  <h3 className="mt-1 font-display text-base font-black tracking-tight text-white line-clamp-1">{shoesProduct.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-display text-sm font-black text-white">{shoesProduct.price.toLocaleString()} RWF</p>
                    <span className="rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white transition group-hover:bg-[#2C5A82] group-hover:text-[#14171F]">
                      Shop
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ParticleField />
      <Orb position={[-2.6, 1.2, 0]} scale={0.75} color="#2C5A82" />
      <Orb position={[2.2, -0.8, -0.6]} scale={1.05} color="#2C5A82" />
    </Canvas>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.035 + mouse.x * 0.08;
    ref.current.rotation.x = mouse.y * 0.045;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#2C5A82" size={0.025} transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Orb({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.18;
    ref.current.rotation.y = clock.elapsedTime * 0.16;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
    </mesh>
  );
}

function Marquee() {
  const items = ["Verified Kigali boutiques", "Premium fashion discovery", "Live delivery tracking", "Mobile Money ready", "Buyer protection", "Luxury local commerce"];
  return (
    <section aria-label="Highlights" className="overflow-hidden border-y border-black/[0.06] bg-[#FAF9F5] py-3 sm:py-8">
      <div className="marquee-track flex w-max gap-6 whitespace-nowrap text-[0.5rem] font-bold uppercase tracking-[0.24em] text-[#14171F]/45 sm:gap-10 sm:text-sm sm:tracking-[0.32em]">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-6 sm:gap-10">
            {item}<span className="h-1.5 w-1.5 rounded-full bg-[#2C5A82]" />
          </span>
        ))}
      </div>
    </section>
  );
}

function CategoriesPreview({ categories }: { categories: Category[] }) {
  return (
    <section className="relative overflow-x-hidden bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader eyebrow="Popular categories" title={<>Six ways to <span className="font-editorial text-[#2C5A82]">shop</span> the city.</>} className="max-w-2xl" />
          <Link to="/shop" className="group inline-flex items-center gap-2 text-sm font-bold text-[#14171F] underline-grow">
            Browse the full shop <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = iconByCategory[category.slug] ?? ShoppingBag;
            return (
              <Link
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                data-reveal
                className="group relative min-h-[10rem] overflow-hidden rounded-[1.2rem] border border-black/[0.08] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)] transition duration-500 hover:-translate-y-1 sm:min-h-[18rem] lg:min-h-[24rem] lg:rounded-[2rem]"
              >
                <img src={category.image} alt={category.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/82" />
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-xl transition group-hover:scale-110 sm:left-5 sm:top-5 sm:h-12 sm:w-12">
                  <Icon className="h-3 w-3 sm:h-5 sm:w-5" strokeWidth={1.8} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white sm:p-4 lg:p-6">
                  <p className="mb-1 text-[0.45rem] font-bold uppercase tracking-[0.15em] text-[#2C5A82] sm:mb-3 sm:text-xs sm:tracking-[0.34em]">0{index + 1} Â· {category.count} pieces</p>
                  <h3 className="font-display text-sm font-black tracking-[-0.06em] sm:text-2xl lg:text-3xl">{category.title}</h3>
                  <p className="mt-0.5 text-[0.5rem] leading-3 text-white/75 sm:mt-3 sm:text-sm sm:leading-6">{category.copy}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrendingPreview({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const featured = products.filter((p) => p.featured);
  useEffect(() => {
    const id = window.setInterval(() => setActive((v) => (v + 1) % featured.length), 4200);
    return () => window.clearInterval(id);
  }, [featured.length]);
  const current = featured[active];

  return (
    <section className="relative overflow-x-hidden bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#FAF9F5] to-white" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Trending now"
          title={<>The pieces Kigali is <span className="font-editorial text-[#2C5A82]">watching</span>.</>}
          copy="Premium product cards designed for discovery first, with quick actions ready for later commerce phases."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <aside data-reveal className="relative overflow-hidden rounded-[2.4rem] bg-[#14171F] p-4 text-white shadow-[0_30px_110px_rgba(0,0,0,0.16)] sm:p-8">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(191,215,241,0.22),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(255,213,234,0.12),transparent_28%)]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                className="relative z-10 flex h-full flex-col justify-between"
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div>
                  <p className="text-[0.5rem] font-black uppercase tracking-[0.2em] text-[#2C5A82] sm:text-xs sm:tracking-[0.34em]">Auto rotating edit</p>
                  <h3 className="mt-2 font-display text-lg font-black leading-none tracking-[-0.07em] sm:mt-5 sm:text-4xl sm:leading-none lg:text-5xl">{current.name}</h3>
                  <p className="mt-2 text-xs text-white/70">A featured product spotlight that keeps the homepage alive without forcing interaction.</p>
                </div>
                <div className="mt-4 overflow-hidden rounded-xl">
                  <Link to={`/product/${current.slug}`} className="block">
                    <img src={current.images[0]} alt={current.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  </Link>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/55">From {current.storeName}</p>
                    <p className="mt-0 font-display text-base font-black tracking-[-0.06em]">{current.price.toLocaleString()} RWF</p>
                  </div>
                  <Link to={`/product/${current.slug}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#14171F] transition hover:bg-[#2C5A82]">
                    Quick View
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>

          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function FlashSalesSection({ products }: { products: Product[] }) {
  const onSale = useMemo(() => products.filter((p) => (p.originalPrice ?? 0) > 0).slice(0, 6), [products]);
  const endTime = Date.now() + 8 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(() => endTime - Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(Math.max(0, endTime - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [endTime]);

  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);

  if (onSale.length === 0) return null;

  return (
    <section className="relative overflow-x-hidden bg-gradient-to-b from-[#2C5A82]/20 via-[#FAF9F5] to-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8 lg:py-28">
      <div aria-hidden className="luxury-orb left-1/2 top-0 h-60 w-60 -translate-x-1/2 bg-[#2C5A82]/20" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Limited time offers"
            title={<>Flash <span className="font-editorial text-[#2C5A82]">sales</span> â€” hurry!</>}
            className="max-w-lg"
          />
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#2C5A82]" />
            <span className="font-mono text-lg font-black tracking-widest">
              {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
            </span>
          </div>
        </div>
        <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
          {onSale.map((p) => (
            <FlashSaleCard key={p.slug} product={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FlashSaleCard({ product }: { product: Product }) {
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 24, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
      className="group relative overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
    >
      <div className="absolute left-4 top-4 z-10 rounded-full bg-[#FF6B6B] px-3 py-1 text-xs font-black text-white">-{discount}%</div>
      <Link to={`/product/${product.slug}`}>
        <div className="overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">{product.storeName}</p>
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="mt-1 font-display text-base font-black tracking-[-0.04em] leading-tight transition hover:text-[#2C5A82]">{product.name}</h3>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-display text-lg font-black tracking-[-0.04em]">{product.price.toLocaleString()} RWF</span>
          {product.originalPrice ? (
            <span className="text-sm text-[#999] line-through">{product.originalPrice.toLocaleString()} RWF</span>
          ) : null}
        </div>
        <MagneticButton to={`/product/${product.slug}`} variant="ghost" className="mt-3 w-full justify-center py-2.5 text-xs">View Deal</MagneticButton>
      </div>
    </motion.article>
  );
}

function StoresPreview({ stores }: { stores: Store[] }) {
  const featured = stores.slice(0, 3);
  return (
    <section className="relative overflow-x-hidden bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Verified boutiques"
            title={<>Meet the makers of <span className="font-editorial text-[#2C5A82]">Kigali</span> style.</>}
            className="max-w-2xl"
          />
          <Link to="/stores" className="group inline-flex items-center gap-2 text-sm font-bold text-[#14171F] underline-grow">
            All stores <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => <StoreCard key={s.slug} store={s} />)}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="relative overflow-x-hidden bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div aria-hidden className="luxury-orb -left-24 top-20 h-72 w-72 bg-[#2C5A82]/15" />
      <div aria-hidden className="luxury-orb -right-28 bottom-20 h-80 w-80 bg-[#2C5A82]/30 [animation-delay:1s]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Why choose GIHANGA"
          title={<>Trust is <span className="font-editorial text-[#2C5A82]">designed</span> in.</>}
          copy="GIHANGA is not only a product catalog. It is a premium commerce layer for verified stores, confident customers and delivery transparency."
          align="center"
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {whyItems.map((item) => (
            <article
              key={item.title}
              data-reveal
              className="group rounded-[1.5rem] border border-black/[0.08] bg-[#FAF9F5] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:bg-white sm:rounded-[2rem] sm:p-7"
            >
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

function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setActive((v) => (v + 1) % testimonials.length), 5200);
    return () => window.clearInterval(id);
  }, []);
  const t = testimonials[active];
  return (
    <section className="relative overflow-x-hidden bg-gradient-to-b from-[#2C5A82]/30 via-[#FAF9F5] to-[#FAF9F5] px-5 py-16 sm:px-6 lg:px-8 lg:py-32">
      <div aria-hidden className="luxury-orb left-1/2 top-0 h-80 w-80 -translate-x-1/2 bg-[#2C5A82]/15" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Testimonials"
          title={<>The marketplace Kigali can <span className="font-editorial text-[#2C5A82]">trust</span>.</>}
          align="center"
        />
        <div data-reveal className="relative mx-auto mt-10 max-w-5xl sm:mt-16">
          <AnimatePresence mode="wait">
            <motion.article
              key={t.name}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white shadow-[0_28px_100px_rgba(0,0,0,0.08)] sm:rounded-[2.6rem] lg:grid lg:grid-cols-[0.8fr_1.2fr]"
              initial={{ opacity: 0, x: 70, filter: "blur(14px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -70, filter: "blur(14px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative min-h-[10rem] overflow-hidden sm:min-h-[24rem]">
                <img src={t.image} alt={t.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/42 to-transparent" />
              </div>
              <div className="flex flex-col justify-center p-4 sm:p-10 lg:p-12">
                <Quote className="h-8 w-8 text-[#2C5A82] sm:h-10 sm:w-10" />
                <div className="mt-4 flex gap-1 sm:mt-6" aria-label="5 star review">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-[#2C5A82] text-[#2C5A82] sm:h-5 sm:w-5" />)}
                </div>
                <p className="mt-4 font-display text-lg font-black leading-tight tracking-[-0.04em] text-[#14171F] sm:mt-7 sm:text-2xl sm:leading-tight lg:text-3xl">"{t.quote}"</p>
                <div className="mt-5 sm:mt-9">
                  <p className="text-base font-black text-[#14171F] sm:text-lg">{t.name}</p>
                  <p className="mt-1 text-sm text-[#6D6D6D] sm:text-base">{t.role}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-3 sm:mt-8">
            {testimonials.map((item, i) => (
              <button key={item.name} type="button" className={cn("h-2.5 rounded-full transition-all", active === i ? "w-10 bg-[#14171F]" : "w-2.5 bg-[#14171F]/20")} aria-label={`Show testimonial ${i + 1}`} onClick={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="overflow-x-hidden bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8 lg:py-32">
      <div data-reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#14171F] p-5 text-white shadow-[0_36px_120px_rgba(0,0,0,0.18)] sm:rounded-[2.8rem] sm:p-12">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(191,215,241,0.26),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(255,213,234,0.12),transparent_32%)]" />
        <div aria-hidden className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10" />
        <div aria-hidden className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#2C5A82]/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.36em] text-[#2C5A82]">Vendor invitation</p>
            <h2 className="mt-3 max-w-4xl font-display text-[clamp(1.8rem,6vw,7rem)] font-black leading-[0.88] tracking-[-0.08em] sm:mt-5">
              Start <span className="font-editorial text-[#2C5A82]">selling</span> on GIHANGA today.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="mb-5 max-w-md text-sm leading-7 text-white/70 sm:mb-7 sm:text-lg sm:leading-8">Bring your store online with a premium marketplace experience made for Kigali's fashion economy.</p>
            <MagneticButton to="/sell" variant="gold" className="w-full justify-center px-8 py-4 sm:w-auto">Create Store</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}


