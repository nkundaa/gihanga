import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import * as THREE from "three";
import { Compass, Sparkles } from "lucide-react";
import { heroImages, products } from "../data/catalog";
import { MagneticButton } from "../components/ui";

export default function Opening() {
  const navigate = useNavigate();
  const reduceMotion = Boolean(useReducedMotion());

  const clothesProduct = products.find((p) => p.category === "clothes") || products[0];
  const shoesProduct = products.find((p) => p.category === "shoes") || products[1];

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <>
    <Seo title="Gihanga Market" description="GIHANGA is Rwanda's premium fashion marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali. Shop the Gihanga market today." />
    <div className="relative flex h-[100svh] flex-col justify-between overflow-hidden bg-[#111111] text-white select-none">
      <div aria-hidden className="absolute inset-0">
        <motion.img
          src={heroImages.hero}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          initial={reduceMotion ? false : { scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/90" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(191,215,241,0.18),transparent_40%),radial-gradient(circle_at_75%_75%,rgba(255,213,234,0.15),transparent_40%)]" />
        <div aria-hidden className="luxury-orb left-[10%] top-[15%] h-64 w-60 bg-[#BFD7F1]/20" />
        <div aria-hidden className="luxury-orb right-[12%] top-[30%] h-80 w-80 bg-[#FFD5EA]/15 [animation-delay:1s]" />
        <div aria-hidden className="absolute inset-0 hidden opacity-70 lg:block"><OpeningScene /></div>
      </div>

      <header className="relative z-20 flex items-center justify-between px-5 py-4 sm:px-10 sm:py-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <img src="/images/logo.png" alt="" className="h-12 w-auto sm:h-14" />
          <span className="font-display text-lg font-black tracking-[-0.06em] text-white sm:text-2xl">GIHANGA</span>
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#BFD7F1] backdrop-blur-xl shadow-lg sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-[0.25em]"
        >
          <Compass className="h-3 w-3 sm:h-4 sm:w-4" /> Kigali, Rwanda
        </motion.div>
      </header>

      <main className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 sm:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div className="max-w-3xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#BFD7F1] backdrop-blur-xl sm:gap-2 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Kigali • Verified Fashion
              </span>
            </motion.div>

            <h1 className="mt-4 font-display text-[clamp(1.5rem,6vw,6rem)] font-black leading-[0.9] tracking-[-0.08em] text-white sm:mt-6">
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Discover Rwanda's
              </motion.span>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="block text-stroke text-white font-black"
              >
                Marketplace
              </motion.span>
            </h1>

            <motion.p
              className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:mt-6 sm:text-base sm:leading-8"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Shop trending products, explore trusted stores, and connect with sellers across Rwanda.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <MagneticButton to="/shop" variant="berry" className="w-full justify-center px-6 py-4 text-sm sm:w-auto" onClick={() => handleNav("/shop")}>
                🛒 Shop Now
              </MagneticButton>
              <MagneticButton to="/stores" variant="ghost" className="w-full justify-center px-6 py-4 text-sm sm:w-auto" onClick={() => handleNav("/stores")}>
                🏬 Explore Stores
              </MagneticButton>
              <MagneticButton to="/sell" variant="mauve" className="w-full justify-center px-6 py-4 text-sm sm:w-auto" onClick={() => handleNav("/sell")}>
                📦 Sell With GIHANGA
              </MagneticButton>
            </motion.div>
          </div>

          <div className="relative hidden h-[500px] items-center justify-center lg:flex">
            <motion.div
              className="absolute left-[5%] top-[10%] z-20 w-64 overflow-hidden rounded-[2.2rem] border border-white/20 bg-white/10 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                <img src={clothesProduct.images[0]} alt={clothesProduct.name} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-[#111111]/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#BFD7F1] backdrop-blur-sm">
                  In Stock
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#BFD7F1]">{clothesProduct.storeName}</p>
                <h3 className="mt-1 font-display text-base font-black tracking-tight text-white line-clamp-1">{clothesProduct.name}</h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="font-display text-sm font-black text-white">{clothesProduct.price.toLocaleString()} RWF</p>
                  <button type="button" onClick={() => handleNav(`/product/${clothesProduct.slug}`)} className="rounded-full bg-[#BFD7F1] px-3.5 py-1.5 text-xs font-bold text-[#111111] transition hover:bg-white">
                    Shop Now
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-[5%] bottom-[10%] z-10 w-60 overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                <img src={shoesProduct.images[0]} alt={shoesProduct.name} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-[#111111]/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#FFD5EA] backdrop-blur-sm">
                  Verified
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#FFD5EA]">{shoesProduct.storeName}</p>
                <h3 className="mt-1 font-display text-base font-black tracking-tight text-white line-clamp-1">{shoesProduct.name}</h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="font-display text-sm font-black text-white">{shoesProduct.price.toLocaleString()} RWF</p>
                  <button type="button" onClick={() => handleNav(`/product/${shoesProduct.slug}`)} className="rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#FFD5EA] hover:text-[#111111]">
                    Shop
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 flex w-full flex-col items-center justify-between gap-2 border-t border-white/10 px-5 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:flex-row sm:px-10 sm:py-8 sm:text-xs">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>© 2026 GIHANGA. All rights reserved.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="transition hover:text-white">Privacy</a>
          <a href="#" className="transition hover:text-white">Terms</a>
          <span className="hidden text-white/25 sm:inline">|</span>
          <button type="button" onClick={() => handleNav("/home")} className="transition hover:text-white cursor-pointer">Enter</button>
        </motion.div>
      </footer>
    </div>
    </>
  );
}

function OpeningScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ParticleField />
      <Orb position={[-2.6, 1.2, 0]} scale={0.75} color="#BFD7F1" />
      <Orb position={[2.2, -0.8, -0.6]} scale={1.05} color="#FFD5EA" />
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
      <pointsMaterial color="#BFD7F1" size={0.025} transparent opacity={0.55} depthWrite={false} />
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
