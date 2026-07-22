import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigation, Footer, CartDrawer, Toast, PageTransition } from "./components/shell";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const StoreDetail = lazy(() => import("./pages/StoreDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const WishlistPage = lazy(() => import("./pages/Wishlist"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Contact = lazy(() => import("./pages/Contact"));
const Sell = lazy(() => import("./pages/Sell"));
const Plans = lazy(() => import("./pages/Plans"));
const Stores = lazy(() => import("./pages/Stores"));
const Welcome = lazy(() => import("./pages/Welcome"));

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
      <div className="flex flex-col items-center gap-3">
        <img src="/images/logo.png" className="h-10 w-10 animate-pulse" alt="" />
        <p className="font-display text-sm font-black tracking-[-0.04em]">GIHANGA</p>
      </div>
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated && user?.role === "admin" ? <>{children}</> : <Navigate to="/home" />;
}

function Guest({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated ? <Navigate to="/home" /> : <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  const hideNav = location.pathname === "/welcome" || location.pathname === "/";
  const hideFooter = location.pathname === "/welcome" || location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] font-sans text-[#111111] antialiased">
      {!hideNav ? <Navigation /> : null}

      <main className={cn("flex-1", !hideNav && "pb-16 lg:pb-0")}>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/home" element={<PageTransition routeKey="home"><Home /></PageTransition>} />
              <Route path="/shop" element={<PageTransition routeKey="shop"><Shop /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition routeKey="pd"><ProductDetail /></PageTransition>} />
              <Route path="/stores" element={<PageTransition routeKey="stores"><Stores /></PageTransition>} />
              <Route path="/stores/:id" element={<PageTransition routeKey="sd"><StoreDetail /></PageTransition>} />
              <Route path="/wishlist" element={<PageTransition routeKey="wl"><Protected><WishlistPage /></Protected></PageTransition>} />
              <Route path="/checkout" element={<PageTransition routeKey="co"><Checkout /></PageTransition>} />
              <Route path="/login" element={<PageTransition routeKey="login"><Guest><Login /></Guest></PageTransition>} />
              <Route path="/register" element={<PageTransition routeKey="register"><Guest><Register /></Guest></PageTransition>} />
              <Route path="/contact" element={<PageTransition routeKey="contact"><Contact /></PageTransition>} />
              <Route path="/sell" element={<PageTransition routeKey="sell"><Sell /></PageTransition>} />
              <Route path="/plans" element={<PageTransition routeKey="plans"><Plans /></PageTransition>} />
              <Route path="/welcome" element={<PageTransition routeKey="welcome"><Welcome /></PageTransition>} />
              <Route path="/" element={<Welcome />} />
              <Route path="/admin" element={<PageTransition routeKey="admin"><AdminRoute><Admin /></AdminRoute></PageTransition>} />
              <Route path="*" element={
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
                  <span className="font-editorial text-7xl text-[#D4AF37]">404</span>
                  <p className="font-display text-xl font-black tracking-[-0.04em]">Page not found</p>
                  <a href="/home" className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4AF37]">Back home</a>
                </div>
              } />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {!hideFooter ? <Footer /> : null}
      <CartDrawer />
      <Toast />
    </div>
  );
}

import { cn } from "./utils/cn";

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
