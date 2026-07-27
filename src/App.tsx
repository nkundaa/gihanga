import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { I18nProvider } from "./context/i18n";
import { BottomNav, CartDrawer, Footer, Navigation, ScrollRestoration, Toast } from "./components/shell";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Sell from "./pages/Sell";
import SellApply from "./pages/SellApply";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";

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

function AppLayout() {
  useRevealObserver();
  const location = useLocation();

  const hideShell = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <ScrollRestoration />
      {!hideShell && <Navigation />}
      <div className={!hideShell ? "pt-[72px] sm:pt-[80px]" : ""}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/store/:slug" element={<StoreDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/sell-apply" element={<SellApply />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      {!hideShell && <Footer />}
      {!hideShell && <BottomNav />}
      {!hideShell && <CartDrawer />}
      {!hideShell && <Toast />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <I18nProvider>
          <BrowserRouter>
            <div className="min-h-screen overflow-x-hidden bg-[#FAF9F5] text-[#14171F] pb-16 lg:pb-0">
              <AppLayout />
            </div>
          </BrowserRouter>
          </I18nProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}
