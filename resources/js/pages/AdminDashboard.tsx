import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity, AlertTriangle, Archive, Award, Ban, BarChart3, Bell, BellDot, BookOpen, CheckCircle2,
  ChevronDown, ChevronLeft, Clock, Copy, CreditCard, DollarSign, Download, Edit3, Eye, FileText,
  Flag, Globe, Grid, HelpCircle, Home, Image, Inbox, LayoutDashboard, LifeBuoy, LogOut, Mail,
  Megaphone, Menu, MessageSquare, MinusCircle, MoreHorizontal, Package, Percent, Phone, PieChart,
  Plus, RefreshCw, Search, Send, Server, Settings, Shield, ShoppingBag, Sliders, Star, Store,
  ThumbsUp, Trash2, TrendingUp, Truck, Upload, UserCheck, UserMinus, UserPlus, Users, UsersRound,
  Wallet, X, Zap, Loader2,
} from "lucide-react";
import { cn } from "../utils/cn";
import { formatRwf, products as mockProducts, stores as mockStores, mockOrders, type Product, type Order, type OrderStatus } from "../data/catalog";
import { useAuth } from "../context/AuthContext";

type AdminView =
  | "dashboard" | "stores" | "storeApprovals" | "customers" | "sellers" | "products"
  | "orders" | "reviews" | "reports" | "content" | "promotions" | "analytics" | "settings";

interface SidebarItem { id: AdminView; label: string; icon: typeof LayoutDashboard }
interface Ticket { id: string; user: string; category: string; priority: "low" | "medium" | "high" | "critical"; status: "open" | "in_progress" | "resolved"; assigned: string; date: string }
interface ReportedProduct { id: number; name: string; image: string; seller: string; reason: string; count: number }
interface ReportedReview { id: number; content: string; customer: string; product: string; reason: string }
interface ActivityEvent { id: number; type: string; description: string; time: string }

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "stores", label: "Stores", icon: Store },
  { id: "storeApprovals", label: "Store Approvals", icon: CheckCircle2 },
  { id: "customers", label: "Customers", icon: Users },
  { id: "sellers", label: "Sellers", icon: UsersRound },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "reports", label: "Reports", icon: Flag },
  { id: "content", label: "Content", icon: Image },
  { id: "promotions", label: "Promotions", icon: Megaphone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Sliders },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  open: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unverified: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-gray-50 text-gray-600 border-gray-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-gray-50 text-gray-600 border-gray-200",
  archived: "bg-red-50 text-red-700 border-red-200",
};

const priorityIcon: Record<string, typeof AlertTriangle> = {
  low: MinusCircle, medium: AlertTriangle, high: AlertTriangle, critical: Zap,
};

const mockTickets: Ticket[] = [
  { id: "TK-001", user: "Inzuki Atelier", category: "Store Verification", priority: "high", status: "open", assigned: "Operations", date: "2026-07-25" },
  { id: "TK-002", user: "Aline Uwera", category: "Order Issue", priority: "medium", status: "in_progress", assigned: "Support", date: "2026-07-24" },
  { id: "TK-003", user: "Milles Collines", category: "Payment", priority: "critical", status: "open", assigned: "Finance", date: "2026-07-24" },
  { id: "TK-004", user: "Grace Ishimwe", category: "Account", priority: "low", status: "resolved", assigned: "Support", date: "2026-07-23" },
  { id: "TK-005", user: "Kigali Carry", category: "Product Upload", priority: "medium", status: "open", assigned: "Content", date: "2026-07-23" },
  { id: "TK-006", user: "Jean Pierre", category: "Delivery", priority: "high", status: "in_progress", assigned: "Operations", date: "2026-07-22" },
];

const mockReportedProducts: ReportedProduct[] = [
  { id: 1, name: "Atelier Silk Co-ord", image: "/images/clothes.jpg", seller: "Inzuki Atelier", reason: "Counterfeit", count: 3 },
  { id: 2, name: "Kigali Leather Loafer", image: "/images/shoes.jpg", seller: "Milles Collines Shoes", reason: "Misleading description", count: 2 },
];

const mockReportedReviews: ReportedReview[] = [
  { id: 1, content: "This product is fake, do not buy.", customer: "Unknown User", product: "Atelier Silk Co-ord", reason: "Spam" },
  { id: 2, content: "Seller never delivered. Scam.", customer: "New User 123", product: "Rem Runner", reason: "False information" },
];

const mockActivity: ActivityEvent[] = [
  { id: 1, type: "store", description: "New store registered: Isano Movement", time: "2 min ago" },
  { id: 2, type: "verification", description: "Store verified: Kigali Carry", time: "15 min ago" },
  { id: 3, type: "report", description: "Product reported: Atelier Silk Co-ord (3 reports)", time: "1 hour ago" },
  { id: 4, type: "order", description: "Large order completed: GH-2026-002 (RWF 134,000)", time: "2 hours ago" },
  { id: 5, type: "user", description: "New customer registered: Jean Pierre Mugabo", time: "3 hours ago" },
  { id: 6, type: "alert", description: "Payment failure: Milles Collines payout", time: "5 hours ago" },
  { id: 7, type: "ticket", description: "Support ticket opened: TK-001 (High priority)", time: "6 hours ago" },
  { id: 8, type: "review", description: "Review reported on product: Rem Runner", time: "8 hours ago" },
  { id: 9, type: "store", description: "Store suspended: Nyamirambo Gems (pending review)", time: "12 hours ago" },
  { id: 10, type: "order", description: "Order cancelled: GH-2026-003", time: "1 day ago" },
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getTodayString() {
  const d = new Date();
  return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getWeekRevenueData() {
  return dayNames.map((d) => ({ label: d, revenue: Math.floor(Math.random() * 400000 + 100000), orders: Math.floor(Math.random() * 40 + 10) }));
}

function getMonthlyGrowth() {
  return monthNames.slice(0, 7).map((m) => ({ label: m, revenue: Math.floor(Math.random() * 15000000 + 5000000), customers: Math.floor(Math.random() * 200 + 50), sellers: Math.floor(Math.random() * 10 + 2) }));
}

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "admin"))) {
      navigate(user?.role === "seller" ? "/seller" : user?.role === "customer" ? "/" : "/login", { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C5A82] border-t-transparent" /></div>;
  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-[#FAF9F5] font-['Inter',system-ui,sans-serif]">
      {mobileSidebar && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebar(false)} />}

      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col bg-white border-r border-black/[0.06] transition-all duration-300",
        sidebarCollapsed ? "w-[72px]" : "w-[260px]",
        mobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}>
        <div className={cn("flex h-16 items-center border-b border-black/[0.06] px-4", sidebarCollapsed ? "justify-center" : "justify-between")}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14171F] text-[10px] font-black tracking-tight text-[#2C5A82]">GM</div>
              <div>
                <p className="text-sm font-bold leading-tight">GIHANGA</p>
                <p className="text-[10px] font-semibold text-[#909090] leading-tight">Control Center</p>
              </div>
            </div>
          )}
          <button type="button" onClick={() => { setSidebarCollapsed(!sidebarCollapsed); setMobileSidebar(false) }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#909090] transition hover:bg-black/[0.04] hover:text-[#14171F]">
            <ChevronLeft className={cn("h-4 w-4 transition", sidebarCollapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setActiveView(item.id); setMobileSidebar(false) }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all mb-0.5",
                activeView === item.id
                  ? "bg-[#14171F] text-white font-semibold"
                  : "text-[#6D6D6D] hover:bg-black/[0.04] hover:text-[#14171F] font-medium",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={activeView === item.id ? 2.5 : 1.8} />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={cn("border-t border-black/[0.06] p-3", sidebarCollapsed && "flex justify-center")}>
          <button type="button" onClick={logout}
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 w-full", sidebarCollapsed && "justify-center")}>
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className={cn("flex flex-1 flex-col transition-all duration-300", sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-black/[0.06] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button type="button" onClick={() => setMobileSidebar(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6D6D6D] transition hover:bg-black/[0.04] lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909090]" strokeWidth={1.8} />
            <input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search stores, products, customers..."
              className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#FAF9F5] pl-10 pr-4 text-sm outline-none transition focus:border-[#14171F] focus:bg-white focus:ring-1 focus:ring-black/10" />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link to="/" className="flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.08] px-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6D6D6D] transition hover:bg-black/[0.04] hover:text-[#14171F]">
              <Eye className="h-3.5 w-3.5" strokeWidth={2} /> <span className="hidden sm:inline">View Site</span>
            </Link>

            <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[#6D6D6D] transition hover:bg-black/[0.04] hover:text-[#14171F]">
              <BellDot className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">3</span>
            </button>

            <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[#6D6D6D] transition hover:bg-black/[0.04] hover:text-[#14171F]">
              <Megaphone className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">1</span>
            </button>

            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6D6D6D] transition hover:bg-black/[0.04] hover:text-[#14171F]">
              <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>

            <div className="flex items-center gap-2.5 border-l border-black/[0.08] pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14171F] text-xs font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold leading-tight">{user?.name || "Administrator"}</p>
                <p className="text-[11px] text-[#909090] leading-tight">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "stores" && <StoresView />}
            {activeView === "storeApprovals" && <VerificationView />}
            {activeView === "customers" && <CustomersView />}
            {activeView === "sellers" && <SellersView />}
            {activeView === "products" && <ProductsView />}
            {activeView === "orders" && <OrdersView />}
            {activeView === "reviews" && <ReviewsView />}
            {activeView === "reports" && <ReportsView />}
            {activeView === "content" && <ContentView />}
            {activeView === "promotions" && <PromotionsView />}
            {activeView === "analytics" && <AnalyticsView />}
            {activeView === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

      <aside className="hidden xl:block w-[320px] shrink-0 border-l border-black/[0.06] bg-white p-5 overflow-y-auto max-h-screen">
        <RightPanel />
      </aside>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, trend }: { icon: typeof LayoutDashboard; label: string; value: string; sub?: string; color: string; trend?: { up: boolean; pct: string } }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", color)}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        {trend && (
          <span className={cn("flex items-center gap-0.5 text-[11px] font-bold", trend.up ? "text-emerald-600" : "text-red-500")}>
            <TrendingUp className={cn("h-3 w-3", !trend.up && "rotate-180")} strokeWidth={2.5} />
            {trend.pct}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-black tracking-[-0.03em]">{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-[#909090]">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-[#bbb]">{sub}</p>}
    </div>
  );
}

function DashboardView() {
  const stats = mockOrders.reduce((a, o) => { a.totalRevenue += o.total; return a }, { totalRevenue: 0, totalOrders: mockOrders.length, pending: mockOrders.filter(o => o.status === "pending").length, completed: mockOrders.filter(o => o.status === "delivered").length });

  const statCards = [
    { icon: Users, label: "Total Customers", value: "1,284", sub: "+48 this month", color: "bg-blue-50 text-blue-600", trend: { up: true, pct: "12.5%" } },
    { icon: UsersRound, label: "Active Sellers", value: "24", sub: `${mockStores.length} with stores`, color: "bg-purple-50 text-purple-600", trend: { up: true, pct: "8.3%" } },
    { icon: Store, label: "Verified Stores", value: String(mockStores.filter(s => s.verified).length), sub: `${mockStores.length} total registered`, color: "bg-emerald-50 text-emerald-600", trend: { up: true, pct: "16.7%" } },
    { icon: Package, label: "Products", value: String(mockProducts.length), sub: "Across all stores", color: "bg-amber-50 text-amber-600", trend: { up: true, pct: "4.2%" } },
    { icon: ShoppingBag, label: "Orders Today", value: "18", sub: formatRwf(stats.totalRevenue), color: "bg-indigo-50 text-indigo-600", trend: { up: true, pct: "22.1%" } },
    { icon: CheckCircle2, label: "Completed Orders", value: String(stats.completed), sub: `${Math.round(stats.completed / Math.max(stats.totalOrders, 1) * 100)}% completion`, color: "bg-emerald-50 text-emerald-600", trend: { up: true, pct: "5.8%" } },
    { icon: Clock, label: "Pending Orders", value: String(stats.pending), sub: "Requires attention", color: "bg-amber-50 text-amber-600", trend: { up: false, pct: "2.3%" } },
    { icon: DollarSign, label: "Monthly Revenue", value: formatRwf(stats.totalRevenue + 350000), sub: `+${formatRwf(380000)} vs last month`, color: "bg-[#14171F] text-white" },
  ];

  const weekData = getWeekRevenueData();
  const maxRevenue = Math.max(...weekData.map(d => d.revenue), 1);

  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
  const growthData = getMonthlyGrowth();
  const maxGrowth = Math.max(...growthData.map(d => d.revenue), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.03em]">{getGreeting()}, Administrator</h1>
          <p className="mt-1 text-sm text-[#6D6D6D]">Welcome to GIHANGA MARKET Control Center.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3.5 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">Marketplace Online</span>
            <span className="text-[10px] text-[#bbb]">· All Services Operational</span>
          </div>
          <span className="text-xs font-medium text-[#909090]">{getTodayString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="flex items-center gap-1.5 rounded-xl bg-[#14171F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1C3C57]">
          <CheckCircle2 className="h-3.5 w-3.5" /> Approve Store
        </button>
        <button type="button" className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold text-[#14171F] transition hover:bg-black/[0.04]">
          <Flag className="h-3.5 w-3.5" /> Review Reports
        </button>
        <button type="button" className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold text-[#14171F] transition hover:bg-black/[0.04]">
          <Image className="h-3.5 w-3.5" /> Create Banner
        </button>
        <button type="button" className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold text-[#14171F] transition hover:bg-black/[0.04]">
          <Send className="h-3.5 w-3.5" /> Send Announcement
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Revenue Overview</p>
              <p className="mt-1 text-lg font-black tracking-[-0.03em]">{formatRwf(weekData.reduce((a, d) => a + d.revenue, 0))}</p>
            </div>
            <div className="flex gap-1">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
                <button key={p} type="button" onClick={() => setChartPeriod(p)}
                  className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition", chartPeriod === p ? "bg-[#14171F] text-white" : "text-[#909090] hover:text-[#14171F]")}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {weekData.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="relative w-full flex flex-col items-center justify-end h-32">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-[#2C5A82]/60 to-[#2C5A82]/20 transition-all duration-500 hover:from-[#2C5A82] hover:to-[#2C5A82]/40" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-[#909090] opacity-0 group-hover:opacity-100 transition">{formatRwf(d.revenue)}</div>
                </div>
                <span className="text-[10px] font-semibold text-[#909090]">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-black/[0.06] pt-4">
            <div><p className="text-[11px] font-bold text-[#909090]">Total Orders</p><p className="text-base font-black">{weekData.reduce((a, d) => a + d.orders, 0)}</p></div>
            <div><p className="text-[11px] font-bold text-[#909090]">Avg Order Value</p><p className="text-base font-black">{formatRwf(Math.round(weekData.reduce((a, d) => a + d.revenue, 0) / Math.max(weekData.reduce((a, d) => a + d.orders, 0), 1)))}</p></div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Marketplace Growth</p>
              <p className="mt-1 text-lg font-black tracking-[-0.03em]">{formatCompact(growthData.reduce((a, d) => a + d.revenue, 0))}</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">+18.4%</span>
          </div>
          <div className="flex items-end gap-1 h-36">
            {growthData.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#14171F] to-[#333] transition-all duration-500" style={{ height: `${(d.revenue / maxGrowth) * 100}%` }} />
                <span className="text-[9px] font-semibold text-[#909090]">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-4 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#14171F]" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-blue-400" /> Customers</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Sellers</span>
            </div>
            <span className="font-bold text-[#909090]">{growthData.length} months</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Store Verification Queue</p>
            <button type="button" className="text-[11px] font-bold text-[#14171F] hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {mockStores.filter(s => !s.verified).length === 0 ? (
              <div className="flex items-center justify-center rounded-xl bg-emerald-50 py-6 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="mr-2 h-4 w-4" /> All stores verified
              </div>
            ) : mockStores.filter(s => !s.verified).slice(0, 3).map((s) => (
              <div key={s.slug} className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-[#FAF9F5] p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={s.avatar} alt={s.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{s.name}</p>
                    <p className="text-xs text-[#6D6D6D]">{s.location}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">Pending</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" className="flex-1 rounded-xl bg-[#14171F] py-2 text-xs font-bold text-white transition hover:bg-[#1C3C57]">Approve Selected</button>
            <button type="button" className="flex-1 rounded-xl border border-black/[0.08] py-2 text-xs font-bold text-[#14171F] transition hover:bg-black/[0.04]">Request Info</button>
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Recent Orders</p>
            <button type="button" className="text-[11px] font-bold text-[#14171F] hover:underline">View All</button>
          </div>
          <div className="space-y-2">
            {mockOrders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-black/[0.04] p-3 transition hover:bg-[#FAF9F5]">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">{o.id}</p>
                  <p className="text-[11px] text-[#6D6D6D] truncate">{o.customer} · {o.storeName}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={cn("rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]", statusColors[o.status])}>{o.status}</span>
                  <span className="text-xs font-bold">{formatRwf(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Reported Products</p>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">{mockReportedProducts.length}</span>
          </div>
          <div className="space-y-3">
            {mockReportedProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-black/[0.06] p-3">
                <img src={p.image} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <p className="text-[11px] text-[#6D6D6D]">{p.seller} · {p.count} reports</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" className="rounded-lg border border-black/[0.08] p-1.5 text-[#6D6D6D] hover:bg-black/[0.04]"><Eye className="h-3.5 w-3.5" /></button>
                  <button type="button" className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Reported Reviews</p>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">{mockReportedReviews.length}</span>
          </div>
          <div className="space-y-3">
            {mockReportedReviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-black/[0.06] p-3">
                <p className="text-xs font-bold truncate">{r.customer} on <span className="text-[#6D6D6D]">{r.product}</span></p>
                <p className="mt-1 text-[11px] text-[#6D6D6D] line-clamp-2">{r.content}</p>
                <div className="mt-2 flex gap-1.5">
                  <button type="button" className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Keep</button>
                  <button type="button" className="rounded-lg bg-red-50 px-2 py-1 text-[9px] font-bold text-red-600">Remove</button>
                  <button type="button" className="rounded-lg bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">Warn</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Support Tickets</p>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">{mockTickets.filter(t => t.status !== "resolved").length}</span>
          </div>
          <div className="space-y-2">
            {mockTickets.slice(0, 4).map((t) => {
              const PrioIcon = priorityIcon[t.priority];
              return (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-black/[0.04] p-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <PrioIcon className={cn("h-3 w-3", t.priority === "high" && "text-amber-500", t.priority === "critical" && "text-red-500", t.priority === "medium" && "text-blue-500", t.priority === "low" && "text-[#909090]")} />
                      <p className="text-xs font-bold truncate">{t.id}</p>
                    </div>
                    <p className="text-[10px] text-[#6D6D6D]">{t.user}</p>
                  </div>
                  <span className={cn("rounded-md border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]", statusColors[t.status])}>{t.status.replace("_", " ")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090]">Marketplace Activity Feed</p>
          <button type="button" className="flex items-center gap-1 text-[11px] font-bold text-[#14171F] hover:underline"><RefreshCw className="h-3 w-3" /> Refresh</button>
        </div>
        <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-black/[0.06]">
          {mockActivity.map((a, i) => (
            <div key={a.id} className="relative pb-5 last:pb-0">
              <div className={cn(
                "absolute -left-[19px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white",
                a.type === "store" ? "bg-blue-100" : a.type === "verification" ? "bg-emerald-100" : a.type === "report" ? "bg-red-100" : a.type === "order" ? "bg-indigo-100" : a.type === "user" ? "bg-purple-100" : a.type === "alert" ? "bg-amber-100" : "bg-gray-100"
              )}>
                {a.type === "store" ? <Store className="h-2.5 w-2.5 text-blue-600" /> : a.type === "verification" ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" /> : a.type === "report" ? <Flag className="h-2.5 w-2.5 text-red-600" /> : a.type === "order" ? <ShoppingBag className="h-2.5 w-2.5 text-indigo-600" /> : a.type === "user" ? <UserPlus className="h-2.5 w-2.5 text-purple-600" /> : a.type === "alert" ? <AlertTriangle className="h-2.5 w-2.5 text-amber-600" /> : <Activity className="h-2.5 w-2.5 text-gray-600" />}
              </div>
              <p className="text-sm font-medium">{a.description}</p>
              <p className="text-[11px] text-[#909090]">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoresView() {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const filtered = useMemo(() => {
    let list = mockStores.slice();
    if (filterStatus !== "all") list = list.filter(s => filterStatus === "verified" ? s.verified : !s.verified);
    if (query.trim()) { const q = query.toLowerCase(); list = list.filter(s => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) }
    return list;
  }, [query, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Store Directory</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">{filtered.length} stores</p></div>
        <button type="button" className="flex items-center gap-1.5 rounded-xl bg-[#14171F] px-4 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /> Add Store</button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 max-w-xs"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909090]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stores..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#14171F] focus:ring-1 focus:ring-black/10" /></label>
        <div className="flex gap-1">
          {["all", "verified", "unverified"].map((s) => (<button key={s} type="button" onClick={() => setFilterStatus(s)}
            className={cn("rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition", filterStatus === s ? "bg-[#14171F] text-white" : "text-[#6D6D6D] hover:bg-black/[0.04]")}>{s}</button>))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.slug} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-4">
              <img src={s.avatar} alt={s.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5"><p className="text-base font-bold truncate">{s.name}</p>{s.verified && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}</div>
                <p className="text-xs text-[#6D6D6D]">{s.location} · {s.category}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-[#909090]">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" />{s.rating}</span>
                  <span>{s.productCount} products</span>
                </div>
              </div>
              <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]", s.verified ? statusColors.verified : statusColors.unverified)}>{s.verified ? "Verified" : "Unverified"}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" className="flex-1 rounded-xl bg-[#14171F] py-2 text-xs font-bold text-white">View</button>
              <button type="button" className="flex-1 rounded-xl border border-black/[0.08] py-2 text-xs font-bold text-[#14171F]">Edit</button>
              <button type="button" className="rounded-xl border border-black/[0.08] px-3 py-2 text-[#6D6D6D]"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerificationView() {
  const unverified = mockStores.filter(s => !s.verified);
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-black tracking-[-0.03em]">Store Verification</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">{unverified.length} stores pending verification</p></div>
      {unverified.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/[0.08] bg-white py-16">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          <p className="mt-4 text-lg font-bold">All stores verified</p>
          <p className="text-sm text-[#6D6D6D]">No pending verification requests.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-black/[0.06] text-[10px] font-bold uppercase tracking-[0.15em] text-[#909090]">
              <th className="px-5 py-4">Store</th><th className="px-5 py-4">Owner</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-black/[0.04]">
              {mockStores.filter(s => !s.verified).map((s) => (
                <tr key={s.slug} className="transition hover:bg-[#FAF9F5]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-lg object-cover" /><p className="font-bold truncate max-w-[10rem]">{s.name}</p></div></td>
                  <td className="px-5 py-4 text-xs text-[#6D6D6D]">{s.name}</td>
                  <td className="px-5 py-4 text-xs text-[#6D6D6D]">{s.location}</td>
                  <td className="px-5 py-4 text-xs text-[#6D6D6D]">{getTodayString()}</td>
                  <td className="px-5 py-4"><span className={cn("rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]", statusColors.unverified)}>Pending</span></td>
                  <td className="px-5 py-4"><div className="flex gap-1"><button className="rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">Approve</button><button className="rounded-lg bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">Reject</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CustomersView() {
  const [query, setQuery] = useState("");
  const customers = [
    { id: 1, name: "Aline Uwera", email: "aline@example.com", phone: "+250 788 111 222", status: "active", orders: 6, joined: "Jan 2026" },
    { id: 2, name: "Mireille Kayitesi", email: "mireille@example.com", phone: "+250 788 333 444", status: "active", orders: 12, joined: "Mar 2025" },
    { id: 3, name: "Grace Ishimwe", email: "grace@example.com", phone: "+250 788 555 666", status: "active", orders: 8, joined: "Jun 2025" },
    { id: 4, name: "Jean Pierre Mugabo", email: "jean@example.com", phone: "+250 788 777 888", status: "active", orders: 3, joined: "Apr 2026" },
    { id: 5, name: "Diane Mukamana", email: "diane@example.com", phone: "+250 788 999 000", status: "suspended", orders: 1, joined: "Feb 2026" },
    { id: 6, name: "Sandrine Niyonzima", email: "sandrine@example.com", phone: "+250 788 111 333", status: "active", orders: 4, joined: "Nov 2025" },
  ];
  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [query]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Customers</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">{filtered.length} registered customers</p></div>
        <button type="button" className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold"><Download className="h-3.5 w-3.5" /> Export</button>
      </div>
      <label className="relative max-w-xs"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909090]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#14171F] focus:ring-1 focus:ring-black/10" /></label>
      <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-black/[0.06] text-[10px] font-bold uppercase tracking-[0.15em] text-[#909090]">
          <th className="px-5 py-4">Customer</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Orders</th><th className="px-5 py-4">Joined</th><th className="px-5 py-4">Actions</th>
        </tr></thead><tbody className="divide-y divide-black/[0.04]">
          {filtered.map((c) => (<tr key={c.id} className="transition hover:bg-[#FAF9F5]">
            <td className="px-5 py-4 font-bold">{c.name}</td>
            <td className="px-5 py-4 text-xs text-[#6D6D6D]">{c.email}</td>
            <td className="px-5 py-4 text-xs text-[#6D6D6D]">{c.phone}</td>
            <td className="px-5 py-4"><span className={cn("rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]", c.status === "active" ? statusColors.active : statusColors.suspended)}>{c.status}</span></td>
            <td className="px-5 py-4 text-xs font-bold">{c.orders}</td>
            <td className="px-5 py-4 text-xs text-[#6D6D6D]">{c.joined}</td>
            <td className="px-5 py-4"><div className="flex gap-1"><button className="rounded-lg bg-black/[0.04] px-2.5 py-1.5 text-[10px] font-bold hover:bg-black/10"><Eye className="h-3 w-3 inline mr-0.5" /> View</button><button className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-600">Suspend</button></div></td>
          </tr>))}
        </tbody></table>
      </div>
    </div>
  );
}

function SellersView() {
  const sellers = [
    { id: 1, name: "Inzuki Atelier", store: "Inzuki Atelier", status: "verified", performance: "excellent", products: 64, revenue: formatRwf(320000) },
    { id: 2, name: "Kigali Carry", store: "Kigali Carry", status: "verified", performance: "good", products: 38, revenue: formatRwf(185000) },
    { id: 3, name: "Milles Collines Shoes", store: "Milles Collines Shoes", status: "verified", performance: "excellent", products: 52, revenue: formatRwf(410000) },
    { id: 4, name: "Nyamirambo Gems", store: "Nyamirambo Gems", status: "suspended", performance: "poor", products: 92, revenue: formatRwf(125000) },
    { id: 5, name: "Isano Movement", store: "Isano Movement", status: "verified", performance: "good", products: 67, revenue: formatRwf(230000) },
    { id: 6, name: "Maison Kivu", store: "Maison Kivu", status: "verified", performance: "excellent", products: 128, revenue: formatRwf(560000) },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-black tracking-[-0.03em]">Sellers</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">{sellers.length} marketplace sellers</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((s) => (
          <div key={s.id} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between"><div><p className="text-base font-bold">{s.store}</p><p className="text-xs text-[#6D6D6D]">{s.name}</p></div>
              <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]", s.status === "verified" ? statusColors.verified : statusColors.suspended)}>{s.status}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-black/[0.04] pt-4">
              <div><p className="text-[10px] font-bold text-[#909090]">Products</p><p className="text-sm font-bold">{s.products}</p></div>
              <div><p className="text-[10px] font-bold text-[#909090]">Revenue</p><p className="text-sm font-bold">{s.revenue}</p></div>
              <div><p className="text-[10px] font-bold text-[#909090]">Performance</p><p className={cn("text-sm font-bold capitalize", s.performance === "excellent" ? "text-emerald-600" : s.performance === "good" ? "text-blue-600" : "text-red-600")}>{s.performance}</p></div>
            </div>
            <div className="mt-4 flex gap-2"><button className="flex-1 rounded-xl bg-[#14171F] py-2 text-xs font-bold text-white">View</button><button className="flex-1 rounded-xl border border-black/[0.08] py-2 text-xs font-bold text-[#14171F]">Contact</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsView() {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const cats = ["all", ...Array.from(new Set(mockProducts.map(p => p.category)))];
  const filtered = useMemo(() => {
    let list = mockProducts.slice();
    if (catFilter !== "all") list = list.filter(p => p.category === catFilter);
    if (query.trim()) { const q = query.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q)) }
    return list;
  }, [query, catFilter]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Products</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">{filtered.length} marketplace products</p></div>
        <div className="flex gap-2"><button className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold"><Upload className="h-3.5 w-3.5" /> Import</button><button className="flex items-center gap-1.5 rounded-xl bg-[#14171F] px-4 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /> Add Product</button></div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 max-w-xs"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909090]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#14171F]" /></label>
        <div className="flex gap-1 flex-wrap">{cats.map((c) => (<button key={c} type="button" onClick={() => setCatFilter(c)}
          className={cn("rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition", catFilter === c ? "bg-[#14171F] text-white" : "text-[#6D6D6D] hover:bg-black/[0.04]")}>{c === "all" ? "All" : c}</button>))}</div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-black/[0.06] text-[10px] font-bold uppercase tracking-[0.15em] text-[#909090]">
          <th className="px-5 py-4">Product</th><th className="px-5 py-4">Store</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th>
        </tr></thead><tbody className="divide-y divide-black/[0.04]">
          {filtered.map((p) => (<tr key={p.slug} className="transition hover:bg-[#FAF9F5]">
            <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" /><p className="font-bold truncate max-w-[10rem]">{p.name}</p></div></td>
            <td className="px-5 py-4 text-xs text-[#6D6D6D]">{p.storeName}</td>
            <td className="px-5 py-4"><span className="rounded-md border border-black/[0.08] bg-[#FAF9F5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]">{p.category}</span></td>
            <td className="px-5 py-4 text-sm font-bold">{formatRwf(p.price)}</td>
            <td className="px-5 py-4"><span className={cn("rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]", p.visibility === "published" ? statusColors.published : statusColors.draft)}>{p.visibility ?? "active"}</span></td>
            <td className="px-5 py-4"><div className="flex gap-1"><button className="rounded-lg bg-black/[0.04] px-2.5 py-1.5 text-[10px] font-bold hover:bg-black/10"><Eye className="h-3 w-3 inline mr-0.5" /> View</button><button className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-600"><Trash2 className="h-3 w-3 inline mr-0.5" /> Hide</button></div></td>
          </tr>))}
        </tbody></table>
      </div>
    </div>
  );
}

function OrdersView() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const statuses: Array<OrderStatus | "all"> = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const filtered = useMemo(() => statusFilter === "all" ? mockOrders : mockOrders.filter(o => o.status === statusFilter), [statusFilter]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Orders</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">{filtered.length} marketplace orders</p></div>
        <div className="flex gap-2"><button className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold"><Download className="h-3.5 w-3.5" /> Export</button></div>
      </div>
      <div className="flex flex-wrap gap-1.5">{statuses.map((s) => (<button key={s} type="button" onClick={() => setStatusFilter(s)}
        className={cn("rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition", statusFilter === s ? "bg-[#14171F] text-white" : "text-[#6D6D6D] hover:bg-black/[0.04]")}>{s}</button>))}</div>
      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0"><p className="text-sm font-bold">{o.id}</p><p className="text-xs text-[#6D6D6D]">{o.customer} · {o.storeName} · {o.createdAt}</p></div>
              <div className="flex items-center gap-3"><span className={cn("rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]", statusColors[o.status])}>{o.status}</span><span className="text-sm font-bold">{formatRwf(o.total)}</span>
                <span className="rounded-lg border border-black/[0.06] bg-[#FAF9F5] px-2 py-1 text-[9px] font-bold capitalize">{o.payment.replace("_", " ")}</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-black/[0.04] flex gap-2">
              <button className="rounded-lg bg-[#14171F] px-3 py-1.5 text-[10px] font-bold text-white">View Details</button>
              <select className="rounded-lg border border-black/[0.08] px-2 py-1.5 text-[10px] font-bold outline-none bg-white" defaultValue={o.status}>
                {statuses.filter(s => s !== "all").map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsView() {
  const [query, setQuery] = useState("");
  const allReviews = useMemo(() => mockProducts.flatMap(p => ({ product: p.name, productSlug: p.slug, ...({ id: p.slug, name: "Customer", avatar: "", rating: 4.5, date: "2026-07", text: "Great product from GIHANGA." }) })), []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-black tracking-[-0.03em]">Reviews</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">All marketplace reviews</p></div>
      <label className="relative max-w-xs"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909090]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reviews..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#14171F]" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        {mockProducts.slice(0, 6).map((p) => (
          <div key={p.slug} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3"><img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" /><p className="text-sm font-bold truncate">{p.name}</p></div>
            <div className="mt-3 flex items-center gap-2"><div className="flex items-center">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={cn("h-3 w-3", i < Math.round(p.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200")} />))}</div><span className="text-xs text-[#6D6D6D]">{p.rating} · {p.reviews} reviews</span></div>
            <div className="mt-2 text-xs text-[#6D6D6D] line-clamp-2">Customer review for {p.name}. Quality and design met expectations.</div>
            <div className="mt-3 flex gap-1.5"><button className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Keep</button><button className="rounded-lg bg-red-50 px-2 py-1 text-[9px] font-bold text-red-600">Remove</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-black tracking-[-0.03em]">Reports</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">Flagged content requiring review</p></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-4">Reported Products</p>
          {mockReportedProducts.map((p) => (<div key={p.id} className="flex items-center gap-3 mb-3 rounded-xl border border-black/[0.06] p-3">
            <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
            <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{p.name}</p><p className="text-xs text-[#6D6D6D]">{p.reason} · {p.count} reports</p></div>
            <div className="flex gap-1"><button className="rounded-lg bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">Review</button><button className="rounded-lg bg-red-50 px-2 py-1 text-[9px] font-bold text-red-600">Remove</button></div>
          </div>))}
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-4">Reported Reviews</p>
          {mockReportedReviews.map((r) => (<div key={r.id} className="mb-3 rounded-xl border border-black/[0.06] p-3">
            <p className="text-sm font-bold">{r.customer} on <span className="text-[#6D6D6D]">{r.product}</span></p><p className="text-xs text-[#6D6D6D] mt-1">{r.content}</p>
            <div className="mt-2 flex gap-1.5"><button className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Keep</button><button className="rounded-lg bg-red-50 px-2 py-1 text-[9px] font-bold text-red-600">Remove</button><button className="rounded-lg bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">Warn</button></div>
          </div>))}
        </div>
      </div>
    </div>
  );
}

function ContentView() {
  const sections = [
    { title: "Homepage Banners", count: 3, icon: Image, desc: "Current active banners on marketplace homepage" },
    { title: "Featured Stores", count: mockStores.length, icon: Store, desc: "Stores promoted on homepage" },
    { title: "Featured Products", count: mockProducts.filter(p => p.featured).length, icon: Award, desc: "Products marked as featured" },
    { title: "Categories", count: 6, icon: Grid, desc: "Product categories configured" },
    { title: "Announcements", count: 2, icon: Megaphone, desc: "Active marketplace announcements" },
    { title: "FAQs", count: 8, icon: HelpCircle, desc: "Frequently asked questions" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Content Management</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">Manage marketplace content and sections</p></div>
        <button className="flex items-center gap-1.5 rounded-xl bg-[#14171F] px-4 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /> Create Section</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <div key={s.title} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF9F5]"><s.icon className="h-5 w-5 text-[#14171F]" /></div>
              <div className="min-w-0"><p className="text-sm font-bold">{s.title}</p><p className="text-[10px] text-[#6D6D6D]">{s.count} items</p></div></div>
            <p className="mt-3 text-xs text-[#6D6D6D]">{s.desc}</p>
            <button className="mt-3 w-full rounded-xl border border-black/[0.08] py-2 text-xs font-bold transition hover:bg-black/[0.04]">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromotionsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Promotions</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">Manage marketplace campaigns and promotions</p></div>
        <button className="flex items-center gap-1.5 rounded-xl bg-[#14171F] px-4 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /> New Campaign</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[{ title: "Homepage Campaigns", icon: Image, desc: "Banner and hero section campaigns" }, { title: "Flash Sales", icon: Zap, desc: "Time-limited discount events" }, { title: "Featured Stores", icon: Store, desc: "Promoted store placements" }, { title: "Featured Categories", icon: Grid, desc: "Category spotlights" }, { title: "Push Notifications", icon: Bell, desc: "Mobile and web push campaigns" }, { title: "Email Campaigns", icon: Mail, desc: "Newsletter and promotional emails" }].map((p) => (
          <div key={p.title} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50"><p.icon className="h-5 w-5 text-amber-600" /></div><p className="text-sm font-bold">{p.title}</p></div>
            <p className="mt-3 text-xs text-[#6D6D6D]">{p.desc}</p>
            <div className="mt-4 text-[11px] font-bold text-[#909090]">Coming soon</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const revenueData = getMonthlyGrowth();
  const maxRev = Math.max(...revenueData.map(d => d.revenue), 1);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Analytics</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">Marketplace performance metrics</p></div>
        <div className="flex gap-2"><button className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold"><Download className="h-3.5 w-3.5" /> Export PDF</button><button className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold"><Download className="h-3.5 w-3.5" /> Export Excel</button></div>
      </div>
      <div className="flex gap-1">{[["7d", "7 Days"], ["30d", "30 Days"], ["90d", "90 Days"], ["1y", "1 Year"]].map(([k, l]) => (<button key={k} type="button" onClick={() => setPeriod(k as typeof period)}
        className={cn("rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition", period === k ? "bg-[#14171F] text-white" : "text-[#6D6D6D] hover:bg-black/[0.04]")}>{l}</button>))}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-4">Marketplace Revenue</p>
          <div className="flex items-end gap-1.5 h-36">
            {revenueData.map((d, i) => (<div key={i} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t-lg bg-gradient-to-t from-[#2C5A82]/60 to-[#2C5A82]/20" style={{ height: `${(d.revenue / maxRev) * 100}%` }} /><span className="text-[9px] font-semibold text-[#909090]">{d.label}</span></div>))}
          </div>
          <div className="mt-4 text-xs font-bold text-[#6D6D6D]">Total: {formatRwf(revenueData.reduce((a, d) => a + d.revenue, 0))}</div>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-4">Key Metrics</p>
          <div className="space-y-4">{[{ label: "Conversion Rate", value: "3.2%", change: "+0.4%" }, { label: "Traffic Sources", value: "Direct 45% · Organic 28% · Social 18% · Referral 9%", change: "" }, { label: "Customer Growth", value: "+48 this month", change: "+12.5%" }, { label: "Seller Growth", value: "+3 this month", change: "+8.3%" }, { label: "Top Category", value: "Clothes (928 products)", change: "32% of catalog" }, { label: "Top Store", value: "Maison Kivu", change: "RWF 560K revenue" }].map((m, i) => (<div key={i} className="flex items-center justify-between border-b border-black/[0.04] pb-2 last:border-0 last:pb-0"><span className="text-xs font-bold text-[#6D6D6D]">{m.label}</span><span className="text-sm font-bold text-right">{m.value}{m.change && <span className="ml-1.5 text-[11px] text-emerald-600">{m.change}</span>}</span></div>))}</div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const fields = [
    { section: "General", items: ["Marketplace Name: GIHANGA MARKET", "Logo: gihanga-logo.svg", "Primary Color: #14171F", "Accent Color: #2C5A82", "Languages: English, Kinyarwanda, French", "Currencies: RWF"] },
    { section: "Commerce", items: ["Payment Methods: Mobile Money, Card", "Shipping Providers: Local Courier", "Commission Rate: 8%", "Tax Configuration: 18% VAT"] },
    { section: "Communication", items: ["Email Settings: SMTP configured", "SMS Settings: Twilio connected", "Notification Settings: Push enabled"] },
    { section: "Security", items: ["Maintenance Mode: Disabled", "Two-Factor Auth: Required for admins", "Session Timeout: 60 minutes"] },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-black tracking-[-0.03em]">Settings</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">Marketplace configuration and preferences</p></div>
      <div className="space-y-6">
        {fields.map((f) => (<div key={f.section} className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-4">{f.section}</p>
          <div className="space-y-3">{f.items.map((item, i) => (<div key={i} className="flex items-center justify-between rounded-xl border border-black/[0.04] bg-[#FAF9F5] px-4 py-2.5"><span className="text-sm font-medium">{item}</span><button className="rounded-lg border border-black/[0.08] px-3 py-1 text-[10px] font-bold hover:bg-black/[0.04]">Edit</button></div>))}</div>
        </div>))}
      </div>
    </div>
  );
}

function ActivityView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-xl font-black tracking-[-0.03em]">Activity Logs</h1><p className="mt-0.5 text-sm text-[#6D6D6D]">Complete audit trail of marketplace actions</p></div>
        <button className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-bold"><Download className="h-3.5 w-3.5" /> Export Logs</button>
      </div>
      <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-black/[0.06]">
          {mockActivity.map((a) => (
            <div key={a.id} className="relative pb-5 last:pb-0">
              <div className={cn(
                "absolute -left-[19px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white",
                a.type === "store" ? "bg-blue-100" : a.type === "verification" ? "bg-emerald-100" : a.type === "report" ? "bg-red-100" : a.type === "order" ? "bg-indigo-100" : a.type === "user" ? "bg-purple-100" : a.type === "alert" ? "bg-amber-100" : "bg-gray-100"
              )}>
                {a.type === "store" ? <Store className="h-2.5 w-2.5 text-blue-600" /> : a.type === "verification" ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" /> : a.type === "report" ? <Flag className="h-2.5 w-2.5 text-red-600" /> : a.type === "order" ? <ShoppingBag className="h-2.5 w-2.5 text-indigo-600" /> : a.type === "user" ? <UserPlus className="h-2.5 w-2.5 text-purple-600" /> : a.type === "alert" ? <AlertTriangle className="h-2.5 w-2.5 text-amber-600" /> : <Activity className="h-2.5 w-2.5 text-gray-600" />}
              </div>
              <p className="text-sm font-medium">{a.description}</p>
              <p className="text-[11px] text-[#909090]">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-3">Today's Tasks</p>
        <div className="space-y-2">
          {[
            { label: "Approve pending stores", count: "2", urgent: true },
            { label: "Review product reports", count: "3", urgent: true },
            { label: "Respond to support tickets", count: "4", urgent: false },
            { label: "Review new seller applications", count: "1", urgent: false },
            { label: "Check payment failures", count: "1", urgent: true },
          ].map((t) => (
            <div key={t.label} className={cn("flex items-center justify-between rounded-xl px-3 py-2", t.urgent ? "bg-red-50" : "bg-[#FAF9F5]")}>
              <div className="flex items-center gap-2 min-w-0"><span className={cn("h-2 w-2 shrink-0 rounded-full", t.urgent ? "bg-red-500" : "bg-[#909090]")} /><span className="text-xs font-medium truncate">{t.label}</span></div>
              <span className={cn("shrink-0 ml-2 rounded-full px-2 py-0.5 text-[9px] font-bold", t.urgent ? "bg-red-100 text-red-600" : "bg-black/[0.06] text-[#6D6D6D]")}>{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-3">Urgent Reports</p>
        <div className="space-y-2">
          {mockReportedProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
              <img src={p.image} alt={p.name} className="h-8 w-8 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1"><p className="text-xs font-bold truncate">{p.name}</p><p className="text-[10px] text-red-600">{p.count} reports</p></div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-3">Support Queue</p>
        <div className="space-y-2">
          {mockTickets.filter(t => t.status !== "resolved").slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-xl bg-[#FAF9F5] p-3">
              <div className="min-w-0"><p className="text-xs font-bold truncate">{t.id} · {t.user}</p><p className="text-[10px] text-[#6D6D6D]">{t.category}</p></div>
              <span className={cn("rounded-md border px-1.5 py-0.5 text-[8px] font-bold", t.priority === "critical" ? statusColors.critical : t.priority === "high" ? statusColors.high : statusColors[t.priority])}>{t.priority}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#909090] mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Approve Store", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
            { label: "Create Banner", icon: Image, color: "bg-blue-50 text-blue-600" },
            { label: "Send Alert", icon: Bell, color: "bg-amber-50 text-amber-600" },
            { label: "View Reports", icon: Flag, color: "bg-red-50 text-red-600" },
          ].map((a) => (
            <button key={a.label} type="button" className={cn("flex flex-col items-center gap-1.5 rounded-xl border border-black/[0.06] p-3 transition hover:shadow-sm", a.color.replace("text-", "bg-").split(" ")[0] === "bg-emerald-50" ? "border-emerald-100" : a.color.includes("blue") ? "border-blue-100" : a.color.includes("amber") ? "border-amber-100" : "border-red-100")}>
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", a.color)}><a.icon className="h-4 w-4" /></div>
              <span className="text-[10px] font-bold">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-black/[0.06] bg-[#14171F] p-4">
        <p className="text-xs font-bold text-[#2C5A82]">GIHANGA MARKET</p>
        <p className="mt-1 text-[10px] text-white/60">Platform v2.0.0</p>
        <p className="text-[10px] text-white/60">All services operational</p>
        <div className="mt-3 flex gap-2"><Link to="/" className="text-[10px] font-bold text-[#2C5A82] hover:underline">Documentation</Link><span className="text-white/30">·</span><Link to="/" className="text-[10px] font-bold text-[#2C5A82] hover:underline">Support</Link></div>
      </div>
    </div>
  );
}


