import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartDrawer, Footer, Navigation, PageTransition, ScrollRestoration, Toast } from "./components/shell";
import Opening from "./pages/Opening";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Sell from "./pages/Sell";
import SellApply from "./pages/SellApply";
import Plans from "./pages/Plans";
import WhyGihanga from "./pages/WhyGihanga";
import Checkout from "./pages/Checkout";
import Editorial from "./pages/Editorial";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";

function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const attach = () => {
      document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) => observer.observe(el));
    };

    attach();

    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);
}

function AnimatedRoutes() {
  const location = useLocation();
  useRevealObserver();

  const isOpening = location.pathname === "/";
  const authPages = ["/login", "/register"];

  const showShell = !isOpening && !authPages.includes(location.pathname);

  return (
    <>
      <ScrollRestoration />
      {showShell ? <Navigation /> : null}
      <AnimatePresence mode="wait">
        <PageTransition routeKey={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Opening />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/store/:slug" element={<StoreDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/sell-apply" element={<SellApply />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/why-gihanga" element={<WhyGihanga />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/editorial" element={<Editorial />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Opening />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      {showShell ? <Footer /> : null}
      {showShell ? <CartDrawer /> : null}
      {showShell ? <Toast /> : null}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <BrowserRouter>
          <div className="min-h-screen overflow-x-hidden bg-[#F8F9FA] text-[#111111]">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}
