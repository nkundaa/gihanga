import { Canvas, useFrame } from "@react-three/fiber";
import { motion, AnimatePresence, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { ArrowLeft, ArrowRight, Compass, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";
import { heroImages } from "../data/catalog";

// We combine high-quality featured ads containing real stores & products
const ads = [
  {
    id: "01",
    title: "ATELIER SILK CO-ORD",
    subtitle: "Inzuki Atelier",
    description: "Premium silk matching pieces cut and finished in Kigali's heart.",
    price: "RWF 68,000",
    image: heroImages.clothes,
    route: "/product/atelier-silk-co-ord",
    badge: "Limited Drop"
  },
  {
    id: "02",
    title: "KIGALI LEATHER LOAFER",
    subtitle: "Milles Collines Shoes",
    description: "Hand-finished genuine leather classics made slowly with pride.",
    price: "RWF 92,000",
    image: heroImages.shoes,
    route: "/product/kigali-leather-loafer",
    badge: "Hand Crafted"
  },
  {
    id: "03",
    title: "NYARUTARAMA MINI TOTE",
    subtitle: "Kigali Carry",
    description: "Premium signature accessories crafted for considered commutes.",
    price: "RWF 74,000",
    image: heroImages.bags,
    route: "/product/nyarutarama-mini-tote",
    badge: "Most Wished"
  }
];

export default function Welcome() {
  const navigate = useNavigate();
  const reduceMotion = Boolean(useReducedMotion());
  const [activeIdx, setActiveIdx] = useState(0);
  const [transitioning, setTransitioning] = useState<string | null>(null);
  const [introStep, setIntroStep] = useState(0);

  // Auto slide interval for the interactive center ad showcase
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ads.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setIntroStep(3);
      return;
    }
    const t1 = setTimeout(() => setIntroStep(1), 100);
    const t2 = setTimeout(() => setIntroStep(2), 900);
    const t3 = setTimeout(() => setIntroStep(3), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduceMotion]);

  // Mouse move parameters for subtle luxury depth parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduceMotion) return undefined;
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener("mousemove", handleMove as any, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove as any);
  }, [reduceMotion]);

  const springX = useSpring(mousePos.x, { stiffness: 70, damping: 20 });
  const springY = useSpring(mousePos.y, { stiffness: 70, damping: 20 });

  const handleChoice = (route: string) => {
    setTransitioning(route);
    setTimeout(() => {
      navigate(route);
    }, 1100);
  };

  const currentAd = ads[activeIdx];

  return (
    <div className="relative flex h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#070709] text-white select-none">
      {/* Absolute Cinematic Page Exit Transition */}
      <AnimatePresence>
        {transitioning ? (
          <motion.div
            className="absolute inset-0 z-50 bg-[#070709]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </AnimatePresence>

      {/* Atmospheric Cinematic Lighting Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/85" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,7,9,0.85)_40%,rgba(7,7,9,0.98)_95%)]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(191,215,241,0.12),transparent_45%)]" />
        {/* Soft colorful orbs */}
        <div aria-hidden className="luxury-orb left-[15%] top-[15%] h-80 w-80 bg-[#BFD7F1]/08" />
        <div aria-hidden className="luxury-orb right-[15%] bottom-[15%] h-96 w-96 bg-[#FFD5EA]/05 [animation-delay:2.5s]" />
      </div>

      {/* 3D Particle Canvas */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-10 opacity-30"><WelcomeScene /></div>

      {/* Giant Typography watermark behind the center ad */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={introStep >= 1 ? { opacity: 0.045, scale: 1 } : {}}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{
            x: useSpring(useMemo(() => springX.get() * 0.4, [springX]), { stiffness: 90, damping: 28 }),
            y: useSpring(useMemo(() => springY.get() * 0.4, [springY]), { stiffness: 90, damping: 28 }),
          }}
          className="font-display text-[15vw] font-black tracking-[-0.08em] text-white leading-none whitespace-nowrap select-none"
        >
          GIHANGA
        </motion.div>
      </div>

      {/* Top Header - Symmetrical Logo and Location Pin */}
      <header className="relative z-20 w-full px-6 py-6 sm:px-10 sm:py-8 flex justify-between items-center">
        <AnimatePresence>
          {introStep >= 2 ? (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <img src="/images/logo.png" alt="" className="h-12 w-auto sm:h-14" />
              <span className="font-display text-2xl font-black tracking-[-0.06em] text-white sm:text-3xl">GIHANGA</span>
            </motion.div>
          ) : <div />}
        </AnimatePresence>

        <AnimatePresence>
          {introStep >= 2 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#BFD7F1] bg-white/5 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/10 shadow-lg"
            >
              <Compass className="h-4 w-4" /> Kigali, Rwanda
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      {/* Main Layout containing Symmetrical Journeys on either side of the sliding ad */}
      <main className="relative z-20 my-auto w-full max-w-7xl mx-auto px-6 sm:px-8 grid gap-8 lg:grid-cols-3 lg:items-center">
        
        {/* Left Side: Journey Actions */}
        <div className="flex flex-col items-start gap-5 max-w-sm lg:pr-6">
          <div className="overflow-hidden py-1">
            <AnimatePresence>
              {introStep >= 3 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.4em] text-[#BFD7F1]"
                >
                  <Sparkles className="h-4 w-4" />
                  KIGALI EDITORIAL
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {introStep >= 3 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 w-full"
              >
                <JourneyActionRow
                  number="01"
                  label="Start Shopping"
                  description="Shop the curated product catalog."
                  onClick={() => handleChoice("/shop")}
                />
                <JourneyActionRow
                  number="02"
                  label="Explore Stores"
                  description="Meet Kigali's verified boutiques."
                  onClick={() => handleChoice("/stores")}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Center: Large Sliding Ad Showcase */}
        <div className="flex justify-center py-4">
          <AnimatePresence>
            {introStep >= 3 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[360px] overflow-hidden rounded-[2.6rem] border border-white/15 bg-white/5 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-white/5">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentAd.id}
                      src={currentAd.image}
                      alt={currentAd.title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 0.85, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Subtle vignette over sliding ad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

                  {/* Corner Badge */}
                  <span className="absolute left-4 top-4 rounded-full bg-[#111111]/85 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-widest text-[#BFD7F1] backdrop-blur-sm border border-white/10">
                    {currentAd.badge}
                  </span>
                </div>

                {/* Ad Content Area */}
                <div className="mt-5 px-1 pb-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentAd.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45 }}
                    >
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#BFD7F1]">{currentAd.subtitle}</p>
                      <h3 className="mt-1.5 font-display text-2xl font-black leading-tight tracking-tight text-white line-clamp-1">{currentAd.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-white/60 line-clamp-2">{currentAd.description}</p>
                      
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <span className="font-display text-lg font-black text-white">{currentAd.price}</span>
                        <button
                          type="button"
                          onClick={() => handleChoice(currentAd.route)}
                          className="rounded-full bg-[#BFD7F1] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#111111] transition hover:bg-white"
                        >
                          Shop Now
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Manual Navigation Arrows over the ad */}
                <div className="absolute right-6 top-8 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveIdx((prev) => (prev - 1 + ads.length) % ads.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition hover:bg-white hover:text-black"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIdx((prev) => (prev + 1) % ads.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition hover:bg-white hover:text-black"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Right Side: Seller Actions & Manifesto Description */}
        <div className="flex flex-col items-start lg:items-end gap-5 max-w-sm lg:pl-6 text-left lg:text-right">
          <div className="overflow-hidden py-1">
            <AnimatePresence>
              {introStep >= 3 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.4em] text-[#FFD5EA] lg:flex-row-reverse"
                >
                  <Sparkles className="h-4 w-4" />
                  PARTNERSHIP ACCESS
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {introStep >= 3 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 w-full"
              >
                <JourneyActionRow
                  number="03"
                  label="Become a Seller"
                  description="Register your boutique storefront."
                  onClick={() => handleChoice("/sell")}
                  alignRight
                />
                <JourneyActionRow
                  number="04"
                  label="Our Manifesto"
                  description="Learn about our verification layer."
                  onClick={() => handleChoice("/about")}
                  alignRight
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Luxury Footer */}
      <footer className="relative z-20 w-full px-6 py-6 sm:px-10 sm:py-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/45 sm:flex-row">
        <AnimatePresence>
          {introStep >= 3 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
            >
              <p>© 2026 GIHANGA. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="transition hover:text-white">Privacy</a>
                <a href="#" className="transition hover:text-white">Terms</a>
                <a href="#" className="transition hover:text-white">Support</a>
              </div>
            </motion.div>
          ) : <div />}
        </AnimatePresence>
      </footer>
    </div>
  );
}

function JourneyActionRow({
  number,
  label,
  description,
  onClick,
  alignRight = false
}: {
  number: string;
  label: string;
  description: string;
  onClick: () => void;
  alignRight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-4 w-full p-4.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:scale-[1.03] hover:border-white/20",
        alignRight ? "flex-row-reverse text-right" : "text-left"
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[0.7rem] font-black text-[#111111] transition duration-500 group-hover:bg-[#BFD7F1]">
        {number}
      </span>
      <div>
        <p className="font-display text-base font-black tracking-tight text-white group-hover:text-[#BFD7F1] transition">{label}</p>
        <p className="mt-1 text-xs text-white/60">{description}</p>
      </div>
    </button>
  );
}

function WelcomeScene() {
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
