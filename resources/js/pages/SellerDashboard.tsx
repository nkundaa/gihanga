import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity, ArrowRight, BarChart3, Bell, Calendar, CheckCircle2, ChevronDown, ChevronRight, Clock,
  Copy, CreditCard, DollarSign, Download, Eye, FileText, Gift, HelpCircle, LogOut,
  Megaphone, MessageSquare, Minus, Package, Plus, RefreshCw, Search, Settings, Shield,
  ShoppingBag, Star, Store, TrendingUp, Truck, Upload, UserCheck, Users, Wallet, X,
  Zap, AlertTriangle, Filter, Grid3X3, MoreHorizontal,
} from "lucide-react";
import { cn } from "../utils/cn";
import { formatRwf, type Product, type OrderStatus } from "../data/catalog";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Seo from "../components/Seo";

type Tab = "dashboard" | "orders" | "products" | "customers" | "messages" | "reviews" | "marketing" | "analytics" | "settings";

const sidebarNav: Array<{ id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "dashboard", label: "Dashboard", icon: Grid3X3 },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "settings", label: "Store Settings", icon: Settings },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-orange-50 text-orange-700 border-orange-200",
  "refund requested": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function SellerDashboard() {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isAuthenticated || !isSeller) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
        <div className="max-w-md rounded-2xl border border-black/[0.06] bg-white p-8 text-center shadow-lg">
          <Store className="mx-auto h-10 w-10 text-[#2C5A82]" />
          <h2 className="mt-4 font-display text-2xl font-black tracking-[-0.04em]">Seller access required</h2>
          <p className="mt-2 text-sm text-[#909090]">Sign in with a seller account to manage your store.</p>
          <Link to="/login" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#14171F] px-8 text-sm font-bold text-white transition hover:bg-[#333]">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF9F5]">
      <Seo title="Seller Dashboard - GIHANGA MARKET" path="/seller" description="Manage your store on GIHANGA MARKET." />

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-black/[0.06] bg-white transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14171F] text-[#2C5A82] text-sm font-black">G</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-display text-sm font-black tracking-[-0.02em]">{user?.name ?? "My Store"}</p>
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#2C5A82]"><CheckCircle2 className="h-2.5 w-2.5 text-white" /></span>
            </div>
            <p className="truncate text-[0.5rem] font-bold uppercase tracking-[0.18em] text-[#909090]">Verified Store</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {sidebarNav.map((item) => (
            <button key={item.id} type="button" onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition", tab === item.id ? "bg-[#14171F] text-white" : "text-[#909090] hover:bg-[#FAF9F5] hover:text-[#14171F]")}>
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-black/[0.06] p-3 space-y-0.5">
          <button type="button" onClick={() => { logout(); navigate("/login"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#909090] transition hover:bg-[#FAF9F5] hover:text-red-500">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Area */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/[0.06] bg-white/95 px-4 backdrop-blur-xl sm:px-6">
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 text-[#909090] lg:hidden">
            <MenuIcon className="h-4 w-4" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909090]" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search orders, products, customers..." className="h-10 w-full rounded-full border border-black/10 bg-[#FAF9F5] pl-10 pr-4 text-sm outline-none transition focus:border-[#2C5A82] focus:bg-white" />
          </div>

          <div className="flex items-center gap-2">
            <Link to="/seller/products/new" className="flex h-9 items-center gap-1.5 rounded-full bg-[#14171F] px-4 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]">
              <Plus className="h-3.5 w-3.5" /> Add
            </Link>
            <Link to="/messages" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#909090] transition hover:bg-[#FAF9F5] hover:text-[#14171F]">
              <MessageSquare className="h-4 w-4" />
            </Link>
            <button type="button" onClick={() => setShowNotifPanel(!showNotifPanel)} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#909090] transition hover:bg-[#FAF9F5] hover:text-[#14171F]">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[0.35rem] font-bold text-white">3</span>
            </button>
            <div ref={userMenuRef} className="relative">
              <button type="button" onClick={() => setShowUserMenu(!showUserMenu)} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#14171F] bg-[#FAF9F5] text-[0.5rem] font-bold">
                {user?.name?.[0] ?? "S"}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-xl">
                  <div className="border-b border-black/[0.06] px-4 py-3">
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-xs text-[#909090] truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: "My Account", icon: UserCheck, link: "/profile" },
                      { label: "Store Settings", icon: Settings, link: "#" },
                      { label: "Switch to Shopping", icon: ShoppingBag, link: "/?switch=customer" },
                      { label: "Support", icon: HelpCircle, link: "/contact" },
                    ].map((i) => (
                      <Link key={i.label} to={i.link} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#909090] transition hover:bg-[#FAF9F5] hover:text-[#14171F]">
                        <i.icon className="h-4 w-4" /> {i.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-black/[0.06] p-1.5">
                    <button type="button" onClick={() => { logout(); navigate("/login"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "messages" && <MessagesTab />}
          {tab === "reviews" && <ReviewsTab />}
          {tab === "marketing" && <MarketingTab />}
          {tab === "analytics" && <AnalyticsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-black/[0.06] bg-white/95 backdrop-blur-xl py-1.5 lg:hidden">
          {[
            { id: "dashboard" as Tab, label: "Dashboard", icon: Grid3X3 },
            { id: "orders" as Tab, label: "Orders", icon: ShoppingBag },
            { id: "products" as Tab, label: "Products", icon: Package },
            { id: "messages" as Tab, label: "Messages", icon: MessageSquare },
            { id: "settings" as Tab, label: "Profile", icon: Settings },
          ].map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className={cn("flex flex-col items-center gap-0.5 px-3 py-1", tab === item.id ? "text-[#14171F]" : "text-[#909090]")}>
              <item.icon className={cn("h-5 w-5", tab === item.id ? "text-[#2C5A82]" : "")} />
              <span className="text-[0.4rem] font-bold uppercase tracking-[0.12em]">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Right Notification Panel */}
      {showNotifPanel && (
        <aside className="fixed inset-y-0 right-0 z-50 w-80 border-l border-black/[0.06] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em]">Notifications</p>
            <button type="button" onClick={() => setShowNotifPanel(false)}><X className="h-4 w-4 text-[#909090]" /></button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="rounded-xl bg-[#FAF9F5] p-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#2C5A82]" />
                <div>
                  <p className="text-xs font-bold">New order received</p>
                  <p className="text-[0.5rem] text-[#909090] mt-0.5">Order #1023 needs confirmation</p>
                  <p className="text-[0.45rem] text-[#909090] mt-1">2 min ago</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#FAF9F5] p-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                <div>
                  <p className="text-xs font-bold">Low stock alert</p>
                  <p className="text-[0.5rem] text-[#909090] mt-0.5">3 products are running low</p>
                  <p className="text-[0.45rem] text-[#909090] mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#FAF9F5] p-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#2C5A82]" />
                <div>
                  <p className="text-xs font-bold">New review</p>
                  <p className="text-[0.5rem] text-[#909090] mt-0.5">★★★★★ on Atelier Silk Co-ord</p>
                  <p className="text-[0.45rem] text-[#909090] mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-black/10 p-4 text-center">
              <p className="text-xs font-bold text-[#909090]">Today's Tasks</p>
              <p className="mt-1 text-[0.5rem] text-[#909090]">2 orders to process<br />3 messages to reply</p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<{
    stats: Record<string, number | string>;
    store: Record<string, unknown>;
    orderStatusCounts: Record<string, number>;
    recentOrders: Array<Record<string, unknown>>;
    products: Product[];
    topProducts: Product[];
    lowStockProducts: Product[];
    recentReviews: Array<Record<string, unknown>>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Record<string, number | string> | null>(null);

  const fetch = () => {
    api.seller.dashboard().then(setData).catch(() => {}).finally(() => setLoading(false));
    api.seller.wallet().then((res) => setWallet(res.wallet)).catch(() => {});
  };
  useEffect(() => { fetch(); const id = setInterval(fetch, 30000); return () => clearInterval(id); }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="rounded-2xl border border-dashed border-black/10 bg-white p-12 text-center"><p className="text-sm text-[#909090]">Could not load dashboard data.</p></div>;

  const s = data.stats;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome + Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Dashboard</p>
          <h1 className="mt-1 font-display text-2xl font-black tracking-[-0.05em] sm:text-3xl">Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user?.name?.split(" ")[0] ?? "Seller"} 👋</h1>
          <p className="mt-1 text-sm text-[#909090]">Here's how your business is performing today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => navigate("/seller/products/new")} className="flex h-10 items-center gap-2 rounded-full bg-[#14171F] px-5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]"><Plus className="h-3.5 w-3.5" /> Add Product</button>
          <button type="button" onClick={() => navigate("/seller?tab=orders")} className="flex h-10 items-center gap-2 rounded-full border border-black/10 px-5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#909090] transition hover:bg-[#FAF9F5] hover:text-[#14171F]"><ShoppingBag className="h-3.5 w-3.5" /> View Orders</button>
          <button type="button" onClick={fetch} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#909090] transition hover:bg-[#FAF9F5] hover:text-[#14171F]"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Business Overview Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
        {[
          { label: "Today's Sales", value: formatRwf(Number(s.todaySales) || 0), icon: TrendingUp, color: "bg-[#14171F] text-white", sub: `Yesterday ${formatRwf(Number(s.yesterdaySales) || 0)}` },
          { label: "Revenue", value: formatRwf(Number(s.totalRevenue) || 0), icon: DollarSign, color: "bg-[#2C5A82] text-white", sub: `${s.monthSales ? formatRwf(Number(s.monthSales)) : "—"} this month` },
          { label: "Orders", value: String(s.totalOrders ?? 0), icon: ShoppingBag, color: "bg-[#14171F] text-white", sub: `${s.pendingOrders ?? 0} pending` },
          { label: "Products", value: String(s.activeProducts ?? 0), icon: Package, color: "bg-white text-[#14171F] border border-black/10", sub: `${s.totalProducts ?? 0} total` },
          { label: "Visitors", value: String(s.visitors ?? 0), icon: Eye, color: "bg-[#FAF9F5] text-[#14171F]" },
          { label: "Rating", value: String(Number(s.averageRating ?? 0).toFixed(1)), icon: Star, color: "bg-[#2C5A82]/10 text-[#2C5A82]" },
          { label: "Messages", value: String(s.unreadMessages ?? 0), icon: MessageSquare, color: "bg-white text-[#14171F] border border-black/10" },
        ].map((c) => (
          <div key={c.label} className={cn("flex items-center gap-3 rounded-xl p-4", c.color.includes("bg-") ? c.color : "bg-white")}>
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", c.color.includes("border") ? "bg-[#FAF9F5]" : c.color.includes("bg-[#14171F]") ? "bg-white/10" : c.color.includes("bg-[#2C5A82]/10") ? "bg-[#2C5A82]/10" : c.color.includes("bg-[#2C5A82]") ? "bg-white/10" : "bg-white border border-black/10")}>
              <c.icon className={cn("h-4 w-4", c.color.includes("bg-[#14171F]") ? "text-[#2C5A82]" : c.color.includes("bg-[#2C5A82]") ? "text-white" : c.color === "bg-[#FAF9F5] text-[#14171F]" ? "text-[#14171F]" : c.color.includes("bg-[#2C5A82]/") ? "text-[#2C5A82]" : "text-[#909090]")} />
            </div>
            <div className="min-w-0">
              <p className={cn("text-[0.5rem] font-bold uppercase tracking-[0.15em]", c.color.includes("text-white") ? "text-white/70" : "text-[#909090]")}>{c.label}</p>
              <p className="mt-0.5 font-display text-lg font-black tracking-[-0.03em]">{c.value}</p>
              {c.sub && <p className={cn("text-[0.4rem]", c.color.includes("text-white") ? "text-white/50" : "text-[#909090]")}>{c.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {Object.entries(data.orderStatusCounts ?? {}).map(([status, count]) => (
          <button key={status} type="button" onClick={() => navigate("/seller?tab=orders")} className="rounded-xl border border-black/[0.06] bg-white p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md">
            <p className={cn("inline-block rounded-md px-2 py-0.5 text-[0.4rem] font-bold uppercase tracking-[0.12em]", statusColors[status] ?? "bg-[#FAF9F5] text-[#909090]")}>{status}</p>
            <p className="mt-2 font-display text-xl font-black">{String(count)}</p>
          </button>
        ))}
      </div>

      {/* Revenue Chart + Wallet */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 rounded-xl border border-black/[0.06] bg-white p-5">
          <RevenueChart />
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <p className="text-[0.55rem] font-black uppercase tracking-[0.18em] text-[#909090]">Wallet</p>
          <p className="mt-1 font-display text-2xl font-black">{formatRwf(Number(wallet?.availableBalance) || 0)}</p>
          <p className="text-[0.5rem] text-[#909090]">Available balance</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs"><span className="text-[#909090]">Pending</span><span className="font-bold">{formatRwf(Number(wallet?.pendingBalance) || 0)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-[#909090]">Next payout</span><span className="font-bold">{wallet?.nextPayoutDate as string ?? "—"}</span></div>
          </div>
          <button type="button" className="mt-4 w-full rounded-full bg-[#14171F] py-2.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]">Withdraw Funds</button>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-black tracking-[-0.03em]">Recent Orders</h3>
            <button type="button" onClick={() => navigate("/seller?tab=orders")} className="text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#2C5A82]">View All</button>
          </div>
          {data.recentOrders.length === 0 ? <p className="py-6 text-center text-sm text-[#909090]">No orders yet.</p> : (
            <div className="space-y-2">
              {data.recentOrders.slice(0, 5).map((o) => (
                <div key={o.id as string} className="flex items-center justify-between rounded-lg bg-[#FAF9F5] px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">#{(o.order_number as string) ?? o.id as string}</p>
                    <p className="text-xs text-[#909090]">{(o.customer_name as string) ?? "Guest"} · {formatRwf(Number(o.total) || 0)}</p>
                  </div>
                  <span className={cn("rounded-md border px-2 py-0.5 text-[0.4rem] font-bold uppercase tracking-[0.12em]", statusColors[o.status as string] ?? "")}>{o.status as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <h3 className="mb-4 font-display text-base font-black tracking-[-0.03em]">Best Selling</h3>
          {data.topProducts.length === 0 ? <p className="py-6 text-center text-sm text-[#909090]">No data yet.</p> : (
            <div className="space-y-3">
              {data.topProducts.slice(0, 5).map((p, i) => (
                <div key={p.slug} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F5] text-[0.5rem] font-black text-[#909090]">{i + 1}</span>
                  <img src={p.images[0]} alt={p.name} className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{p.name}</p>
                    <p className="text-xs text-[#909090]">{formatRwf(p.price)} · {p.stockQuantity ?? 0} in stock</p>
                  </div>
                  <Link to={`/seller/products/edit/${p.id}`} className="shrink-0 rounded-md border border-black/10 px-2.5 py-1 text-[0.4rem] font-bold uppercase tracking-[0.12em] transition hover:bg-[#14171F] hover:text-white">Edit</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inventory Alerts + Reviews */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <h3 className="mb-4 font-display text-base font-black tracking-[-0.03em]">Inventory Alerts</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-red-600">Out of Stock</p><p className="mt-1 font-display text-xl font-black">{String(s.outOfStock ?? 0)}</p></div>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-yellow-600">Low Stock</p><p className="mt-1 font-display text-xl font-black">{String(data.lowStockProducts.length)}</p></div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-blue-600">Drafts</p><p className="mt-1 font-display text-xl font-black">{String(s.draftProducts ?? 0)}</p></div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-purple-600">Hidden</p><p className="mt-1 font-display text-xl font-black">{String(s.hiddenProducts ?? 0)}</p></div>
          </div>
          {data.lowStockProducts.length > 0 && (
            <div className="space-y-2">
              {data.lowStockProducts.slice(0, 3).map((p) => (
                <Link key={p.slug} to={`/seller/products/edit/${p.id}`} className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                    <div className="min-w-0"><p className="truncate text-sm font-bold">{p.name}</p><p className="text-xs text-amber-600">{p.stockQuantity ?? 0} remaining</p></div>
                  </div>
                  <span className="shrink-0 text-[0.4rem] font-bold uppercase tracking-[0.12em] text-amber-600">Restock</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <h3 className="mb-4 font-display text-base font-black tracking-[-0.03em]">Recent Reviews</h3>
          {data.recentReviews.length === 0 ? <p className="py-6 text-center text-sm text-[#909090]">No reviews yet.</p> : (
            <div className="space-y-3">
              {data.recentReviews.slice(0, 4).map((r) => {
                const ru = r.user as Record<string, string> | undefined;
                const rp = r.product as Record<string, unknown> | undefined;
                return (
                  <div key={r.id as string} className="flex items-start gap-3 border-b border-black/[0.06] pb-3 last:border-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF9F5] text-[0.5rem] font-bold">{ru?.name?.[0] ?? "A"}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{ru?.name ?? "Anonymous"}</p>
                        <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3 w-3", Number(r.rating) > i ? "fill-[#2C5A82] text-[#2C5A82]" : "text-[#ddd]")} />)}</div>
                      </div>
                      <p className="mt-0.5 text-xs text-[#909090]">{rp?.name as string ?? ""}</p>
                      <p className="mt-0.5 text-xs text-[#6D6D6D] line-clamp-2">{(r.text as string) ?? ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Store Performance */}
      <div className="rounded-xl border border-black/[0.06] bg-white p-5">
        <h3 className="mb-4 font-display text-base font-black tracking-[-0.03em]">Store Performance</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Visitors", value: String(s.visitors ?? 0) },
            { label: "Followers", value: String(s.followers ?? 0) },
            { label: "Conversion", value: `${s.conversionRate ?? 0}%` },
            { label: "Avg Rating", value: String(Number(s.averageRating ?? 0).toFixed(1)) },
            { label: "Repeat Rate", value: `${s.repeatCustomerRate ?? 0}%` },
            { label: "Growth", value: `${s.monthlyGrowth ?? 0}%` },
          ].map((p) => (
            <div key={p.label} className="rounded-xl bg-[#FAF9F5] p-4"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-[#909090]">{p.label}</p><p className="mt-1 font-display text-xl font-black">{p.value}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Revenue Chart ─── */
function RevenueChart() {
  const [data, setData] = useState<Array<Record<string, unknown>>>([]);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.seller.revenue(period).then((res) => setData(res.revenue)).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  const maxVal = Math.max(...data.map((r) => Number(r.total) || 0), 1);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-black tracking-[-0.03em]">Revenue</h3>
        <div className="flex gap-1 rounded-lg border border-black/10 bg-white p-0.5">
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <button key={p} type="button" onClick={() => { setLoading(true); setPeriod(p); }} className={cn("rounded-md px-2.5 py-1 text-[0.45rem] font-bold uppercase tracking-[0.12em] transition", period === p ? "bg-[#14171F] text-white" : "text-[#909090] hover:bg-[#FAF9F5]")}>{p}</button>
          ))}
        </div>
      </div>
      {loading ? <div className="flex h-40 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C5A82] border-t-transparent" /></div> : data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-[#909090]">No revenue data yet.</div>
      ) : (
        <div className="flex h-40 items-end gap-1 sm:gap-2">
          {data.map((r) => (
            <div key={r.date as string} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-[#2C5A82] transition hover:bg-[#14171F]" style={{ height: `${Math.max(4, ((Number(r.total) || 0) / maxVal) * 140)}px` }} />
              <span className="text-[0.35rem] font-bold uppercase tracking-[0.1em] text-[#909090]">{String(r.date).length > 7 ? String(r.date).slice(5) : r.date as string}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab() {
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    api.seller.orders().then((res) => setOrders(res.orders as unknown as Array<Record<string, unknown>>)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Management</p>
          <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Orders</h2>
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <button type="button" className="flex h-10 items-center gap-2 rounded-xl border border-black/10 px-4 text-xs font-bold transition hover:bg-[#FAF9F5]"><Download className="h-3.5 w-3.5" /> Export</button>
        </div>
      </div>
      {loading ? <Loader /> : (
        <div className="overflow-x-auto rounded-xl border border-black/[0.06] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] text-[0.45rem] font-black uppercase tracking-[0.18em] text-[#909090]">
                <th className="px-5 py-4">Order</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Items</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Payment</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Date</th><th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {filtered.map((o) => (
                <tr key={o.id as string} className="transition hover:bg-[#FAF9F5]">
                  <td className="px-5 py-4 font-bold">#{(o.order_number as string) ?? o.id as string}</td>
                  <td className="px-5 py-4">{(o.customer_name as string) ?? "Guest"}</td>
                  <td className="px-5 py-4 text-xs text-[#909090]">{String((o.items as Array<unknown>)?.length ?? 0)}</td>
                  <td className="px-5 py-4 font-display font-black">{formatRwf(Number(o.total) || 0)}</td>
                  <td className="px-5 py-4"><span className="rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-[0.4rem] font-bold text-green-700 uppercase tracking-[0.12em]">Paid</span></td>
                  <td className="px-5 py-4"><span className={cn("rounded-md border px-2 py-0.5 text-[0.4rem] font-bold uppercase tracking-[0.12em]", statusColors[o.status as string] ?? "")}>{o.status as string}</span></td>
                  <td className="px-5 py-4 text-xs text-[#909090]">{new Date(o.created_at as string).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <button type="button" className="rounded-md border border-black/10 px-2.5 py-1 text-[0.4rem] font-bold uppercase tracking-[0.12em] transition hover:bg-[#14171F] hover:text-white">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-8 text-center text-sm text-[#909090]">No orders found.</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.seller.products().then((res) => setProducts(res.products)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = query.trim() ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category?.toLowerCase().includes(query.toLowerCase())) : products;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Catalog</p>
          <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Products</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909090]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="h-10 w-48 rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#2C5A82]" />
          </div>
          <button type="button" className="flex h-10 items-center gap-2 rounded-xl border border-black/10 px-4 text-xs font-bold transition hover:bg-[#FAF9F5]"><Upload className="h-3.5 w-3.5" /> Import</button>
          <button type="button" onClick={() => navigate("/seller/products/new")} className="flex h-10 items-center gap-2 rounded-xl bg-[#14171F] px-5 text-xs font-bold text-white transition hover:bg-[#333]"><Plus className="h-3.5 w-3.5" /> Add Product</button>
        </div>
      </div>
      {loading ? <Loader /> : (
        <div className="overflow-x-auto rounded-xl border border-black/[0.06] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] text-[0.45rem] font-black uppercase tracking-[0.18em] text-[#909090]">
                <th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Sales</th><th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {filtered.map((p) => (
                <tr key={p.slug} className="transition hover:bg-[#FAF9F5]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" /><div className="min-w-0"><p className="truncate font-bold max-w-[12rem]">{p.name}</p><p className="text-xs text-[#909090]">SKU: {p.sku ?? "—"}</p></div></div></td>
                  <td className="px-5 py-4 text-xs text-[#909090]">{p.category}</td>
                  <td className="px-5 py-4 font-display font-black">{formatRwf(p.price)}</td>
                  <td className="px-5 py-4"><span className={cn("font-bold text-sm", (p.stockQuantity ?? 0) <= 0 ? "text-red-500" : (p.stockQuantity ?? 0) <= (p.lowStockAlert ?? 5) ? "text-amber-500" : "text-green-600")}>{p.stockQuantity ?? 0}</span></td>
                  <td className="px-5 py-4"><span className={cn("rounded-md border px-2 py-0.5 text-[0.4rem] font-bold uppercase tracking-[0.12em]", p.visibility === "published" ? "border-green-200 bg-green-50 text-green-700" : "border-amber-200 bg-amber-50 text-amber-700")}>{p.visibility ?? "draft"}</span></td>
                  <td className="px-5 py-4 text-sm font-bold">{p.sales ?? 0}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <Link to={`/seller/products/edit/${p.id}`} className="rounded-md border border-black/10 px-2.5 py-1 text-[0.4rem] font-bold uppercase tracking-[0.12em] transition hover:bg-[#14171F] hover:text-white">Edit</Link>
                      <button type="button" className="rounded-md border border-black/10 px-2 py-1 text-[#909090]"><MoreHorizontal className="h-3 w-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-8 text-center text-sm text-[#909090]">No products found.</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Inventory Tab ─── */
function InventoryTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.seller.products().then((res) => setProducts(res.products)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const outOfStock = products.filter((p) => (p.stockQuantity ?? 0) <= 0);
  const lowStock = products.filter((p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= (p.lowStockAlert ?? 5));
  const draft = products.filter((p) => p.visibility === "draft");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Stock</p>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Inventory</h2>
      </div>
      {loading ? <Loader /> : (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-5"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-red-600">Out of Stock</p><p className="mt-1 font-display text-2xl font-black">{outOfStock.length}</p></div>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-yellow-600">Low Stock</p><p className="mt-1 font-display text-2xl font-black">{lowStock.length}</p></div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-blue-600">Drafts</p><p className="mt-1 font-display text-2xl font-black">{draft.length}</p></div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-5"><p className="text-[0.5rem] font-black uppercase tracking-[0.15em] text-purple-600">Hidden</p><p className="mt-1 font-display text-2xl font-black">{products.filter((p) => p.visibility === "hidden").length}</p></div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-black/[0.06] bg-white">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-black/[0.06] text-[0.45rem] font-black uppercase tracking-[0.18em] text-[#909090]"><th className="px-5 py-4">Product</th><th className="px-5 py-4">SKU</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Alert At</th><th className="px-5 py-4" /></tr></thead>
              <tbody className="divide-y divide-black/[0.06]">
                {products.map((p) => (
                  <tr key={p.slug} className="transition hover:bg-[#FAF9F5]">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={p.images[0]} alt={p.name} className="h-8 w-8 rounded-lg object-cover" /><span className="truncate max-w-[10rem] font-bold">{p.name}</span></div></td>
                    <td className="px-5 py-4 text-xs text-[#909090]">{p.sku ?? "—"}</td>
                    <td className="px-5 py-4"><span className={cn("font-bold", (p.stockQuantity ?? 0) <= 0 ? "text-red-500" : (p.stockQuantity ?? 0) <= (p.lowStockAlert ?? 5) ? "text-amber-500" : "text-green-600")}>{p.stockQuantity ?? 0}</span></td>
                    <td className="px-5 py-4 text-xs text-[#909090]">{p.lowStockAlert ?? 5}</td>
                    <td className="px-5 py-4"><Link to={`/seller/products/edit/${p.id}`} className="rounded-md border border-black/10 px-2.5 py-1 text-[0.4rem] font-bold uppercase tracking-[0.12em] transition hover:bg-[#14171F] hover:text-white">Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Customers Tab ─── */
function CustomersTab() {
  const [customers, setCustomers] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.seller.customers().then((res) => setCustomers(res.customers)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">People</p>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Customers</h2>
      </div>
      {loading ? <Loader /> : (
        <div className="overflow-x-auto rounded-xl border border-black/[0.06] bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-black/[0.06] text-[0.45rem] font-black uppercase tracking-[0.18em] text-[#909090]"><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Orders</th><th className="px-5 py-4">Total Spent</th><th className="px-5 py-4" /></tr></thead>
            <tbody className="divide-y divide-black/[0.06]">
              {customers.map((c) => {
                const u = (c.user as Record<string, unknown>) ?? {};
                return (
                  <tr key={u.id as string} className="transition hover:bg-[#FAF9F5]">
                    <td className="px-5 py-4 font-bold">{u.name as string ?? "Anonymous"}</td>
                    <td className="px-5 py-4 text-xs text-[#909090]">{u.email as string ?? "—"}</td>
                    <td className="px-5 py-4">{String(c.order_count ?? 0)}</td>
                    <td className="px-5 py-4 font-display font-black">{formatRwf(Number(c.total_spent) || 0)}</td>
                    <td className="px-5 py-4"><button type="button" className="rounded-md border border-black/10 px-2.5 py-1 text-[0.4rem] font-bold uppercase tracking-[0.12em] transition hover:bg-[#14171F] hover:text-white">Message</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {customers.length === 0 && <p className="p-8 text-center text-sm text-[#909090]">No customers yet.</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Messages Tab ─── */
function MessagesTab() {
  const [conversations, setConversations] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.messages.conversations().then((res) => setConversations(res.conversations)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Inbox</p>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Messages</h2>
      </div>
      {loading ? <Loader /> : conversations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/10 bg-white p-12 text-center"><MessageSquare className="mx-auto h-8 w-8 text-[#909090]" /><p className="mt-3 font-display text-lg font-black tracking-[-0.03em]">No conversations yet</p><p className="mt-1 text-sm text-[#909090]">Messages from customers will appear here.</p></div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => (
            <Link key={c.id as string} to={`/messages/${c.id}`} className="flex items-center gap-4 rounded-xl border border-black/[0.06] bg-white p-4 transition hover:bg-[#FAF9F5]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF9F5] text-sm font-bold">{(c.customer_name as string)?.[0] ?? "C"}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="text-sm font-bold truncate">{(c.customer_name as string) ?? "Customer"}</p>{c.unread_count ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2C5A82] text-[0.35rem] font-bold text-white">{String(c.unread_count)}</span> : null}</div>
                <p className="truncate text-xs text-[#909090]">{(c.last_message as Record<string, string>)?.content as string ?? "No messages yet"}</p>
              </div>
              <p className="shrink-0 text-[0.5rem] text-[#909090]">{new Date(c.updated_at as string).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Reviews Tab ─── */
function ReviewsTab() {
  const [reviews, setReviews] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.seller.dashboard().then((res) => setReviews(res.recentReviews)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Feedback</p>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Reviews</h2>
      </div>
      {loading ? <Loader /> : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/10 bg-white p-12 text-center"><Star className="mx-auto h-8 w-8 text-[#909090]" /><p className="mt-3 font-display text-lg font-black tracking-[-0.03em]">No reviews yet</p><p className="mt-1 text-sm text-[#909090]">Customer reviews will appear here.</p></div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const ru = r.user as Record<string, string> | undefined;
            const rp = r.product as Record<string, unknown> | undefined;
            return (
              <div key={r.id as string} className="rounded-xl border border-black/[0.06] bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF9F5] font-bold text-sm">{ru?.name?.[0] ?? "A"}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{ru?.name ?? "Anonymous"}</p>
                      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3 w-3", Number(r.rating) > i ? "fill-[#2C5A82] text-[#2C5A82]" : "text-[#ddd]")} />)}</div>
                    </div>
                    <p className="mt-0.5 text-xs text-[#909090]">on {rp?.name as string ?? "Product"}</p>
                    <p className="mt-2 text-sm text-[#6D6D6D]">{r.text as string ?? ""}</p>
                    <button type="button" className="mt-3 rounded-md border border-black/10 px-3 py-1.5 text-[0.4rem] font-bold uppercase tracking-[0.12em] transition hover:bg-[#14171F] hover:text-white">Reply</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Marketing Tab ─── */
function MarketingTab() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Promotions</p>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Marketing</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Coupons", value: "0", icon: Gift },
          { label: "Running Campaigns", value: "0", icon: Megaphone },
          { label: "Flash Sales", value: "0", icon: Zap },
          { label: "Store Followers", value: "0", icon: Users },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-black/[0.06] bg-white p-5">
            <m.icon className="h-5 w-5 text-[#2C5A82]" />
            <p className="mt-3 font-display text-2xl font-black">{m.value}</p>
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.12em] text-[#909090]">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-dashed border-black/10 bg-white p-8 text-center">
        <Megaphone className="mx-auto h-8 w-8 text-[#2C5A82]" />
        <p className="mt-3 font-display text-xl font-black tracking-[-0.04em]">Marketing Tools</p>
        <p className="mt-1 text-sm text-[#909090]">Coupons, flash sales, and campaigns are coming soon.</p>
        <button type="button" className="mt-6 rounded-full bg-[#14171F] px-6 py-3 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]">Create Campaign</button>
      </div>
    </div>
  );
}

/* ─── Analytics Tab ─── */
function AnalyticsTab() {
  const [revenueData, setRevenueData] = useState<Array<Record<string, unknown>>>([]);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.seller.revenue(period).then((res) => setRevenueData(res.revenue)).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  const maxVal = Math.max(...revenueData.map((r) => Number(r.total) || 0), 1);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Insights</p>
          <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Analytics</h2>
        </div>
        <div className="flex gap-1 rounded-lg border border-black/10 bg-white p-0.5">
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <button key={p} type="button" onClick={() => { setLoading(true); setPeriod(p); }} className={cn("rounded-md px-3 py-1.5 text-[0.45rem] font-bold uppercase tracking-[0.12em] transition", period === p ? "bg-[#14171F] text-white" : "text-[#909090] hover:bg-[#FAF9F5]")}>{p}</button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white p-6">
        <h3 className="mb-6 font-display text-lg font-black tracking-[-0.03em]">Revenue — {period.charAt(0).toUpperCase() + period.slice(1)}</h3>
        {loading ? <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C5A82] border-t-transparent" /></div> : revenueData.length === 0 ? (
          <div className="flex flex-col items-center py-12"><BarChart3 className="h-8 w-8 text-[#909090]" /><p className="mt-3 text-sm text-[#909090]">No revenue data yet.</p></div>
        ) : (
          <div className="flex items-end gap-1 sm:gap-2" style={{ height: 220 }}>
            {revenueData.map((r) => (
              <div key={r.date as string} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-[#2C5A82] transition hover:bg-[#14171F]" style={{ height: `${Math.max(4, (Number(r.total) || 0) / maxVal * 200)}px` }} />
                <span className="text-[0.35rem] font-bold uppercase tracking-[0.1em] text-[#909090] sm:text-[0.45rem]">{String(r.date).length > 7 ? String(r.date).slice(5) : r.date as string}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button type="button" className="flex h-10 items-center gap-2 rounded-xl border border-black/10 px-5 text-xs font-bold transition hover:bg-[#FAF9F5]"><Download className="h-3.5 w-3.5" /> Download Report</button>
      </div>
    </div>
  );
}

/* ─── Settings Tab ─── */
function SettingsTab() {
  const [store, setStore] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.seller.dashboard().then((res) => setStore(res.store ?? {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Configuration</p>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Store Settings</h2>
      </div>
      {loading ? <Loader /> : (
        <div className="rounded-xl border border-black/[0.06] bg-white p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF9F5] overflow-hidden">
              <Store className="h-8 w-8 text-[#909090]" />
            </div>
            <div>
              <p className="text-lg font-black">{store.name as string ?? "My Store"}</p>
              <p className="text-sm text-[#909090]">{store.location as string ?? "Kigali, Rwanda"}</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { label: "Store Name", value: store.name as string },
              { label: "Location", value: store.location as string },
              { label: "Phone", value: store.phone as string },
              { label: "Payment Number", value: store.payment_number as string ?? "Not set" },
              { label: "Payment Provider", value: store.payment_provider as string ?? "Not set" },
              { label: "Business Hours", value: store.hours as string ?? "Mon–Sat 9:00 – 19:00" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#909090]">{f.label}</label>
                <p className="min-h-10 rounded-xl border border-black/10 bg-[#FAF9F5] px-4 py-2.5 text-sm">{f.value ?? "—"}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" className="rounded-full bg-[#14171F] px-6 py-2.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Help Tab ─── */
function HelpTab() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-[0.55rem] font-black uppercase tracking-[0.28em] text-[#2C5A82]">Support</p>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em]">Help Center</h2>
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white p-8 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-[#2C5A82]" />
        <p className="mt-4 font-display text-xl font-black tracking-[-0.04em]">How can we help you?</p>
        <p className="mt-2 text-sm text-[#909090]">Browse guides, contact support, or visit the seller community.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className="rounded-full bg-[#14171F] px-6 py-3 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]">View Guides</button>
          <button type="button" className="rounded-full border border-black/10 px-6 py-3 text-[0.5rem] font-bold uppercase tracking-[0.15em] transition hover:bg-[#FAF9F5]">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared ─── */
function Loader() {
  return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C5A82] border-t-transparent" /></div>;
}

function MenuIcon({ className }: { className?: string }) {
  return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}


