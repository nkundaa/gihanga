import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3, CheckCircle2, ChevronDown, Eye, LayoutDashboard, Package, Search,
  ShoppingBag, Store, TrendingUp, Truck, Users,
} from "lucide-react";
import { cn } from "../utils/cn";
import { formatRwf, getAdminStats as mockGetAdminStats, mockOrders, products as mockProducts, stores as mockStores, type OrderStatus, type AdminStats as AdminStatsType, type Order } from "../data/catalog";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

type AdminTab = "dashboard" | "products" | "stores" | "orders";

const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "stores", label: "Stores", icon: Store },
  { id: "orders", label: "Orders", icon: ShoppingBag },
];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function Admin() {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 lg:pt-28">
      <div className="mx-auto flex max-w-7xl px-5 pb-24 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-28 space-y-1">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Admin</p>
            <div className="pt-4">
              <Link to="/" className="flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#666666] transition hover:text-[#111111]">
                <Eye className="h-4 w-4" /> View site
              </Link>
            </div>
            {!isAdmin ? (
              <p className="px-4 py-3 text-xs text-[#666666]">Sign in as admin to manage.</p>
            ) : null}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-black tracking-[-0.05em] capitalize sm:text-3xl">Admin</h1>
              <p className="mt-1 text-sm text-[#666666]">GIHANGA administration panel</p>
            </div>
          </div>

          {!isAdmin ? (
            <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/60 px-6 py-20 text-center">
              <p className="font-editorial text-6xl text-[#BFD7F1]">🔒</p>
              <h2 className="mt-4 font-display text-2xl font-black tracking-[-0.04em]">Admin access required</h2>
              <p className="mt-2 text-sm text-[#666666]">Please sign in with an admin account to access this panel.</p>
              <Link to="/login" className="mt-6 inline-flex rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white">Sign in</Link>
            </div>
          ) : (
            <AdminPanel />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<typeof mockProducts>([]);
  const [stores, setStores] = useState<typeof mockStores>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchDashboard = async () => {
      try {
        const res = await api.admin.stats();
        setStats(res.stats);
        setRecentOrders(res.recentOrders);
      } catch {
        setStats(mockGetAdminStats());
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await api.admin.products();
        setProducts(res.products);
      } catch {
        setProducts(mockProducts);
      }
    };

    const fetchStores = async () => {
      try {
        const res = await api.admin.stores();
        setStores(res.stores);
      } catch {
        setStores(mockStores);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await api.admin.orders();
        setOrders(res.orders);
      } catch {
        setOrders(mockOrders);
      }
    };

    Promise.all([fetchDashboard(), fetchProducts(), fetchStores(), fetchOrders()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BFD7F1] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn("rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition", tab === t.id ? "border-[#111111] bg-[#111111] text-white" : "border-black/10 bg-white text-[#666666] hover:border-black/30")}
          >
            <t.icon className="mr-1.5 inline h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && stats ? <DashboardTab stats={stats} recentOrders={recentOrders} /> : null}
      {tab === "products" && <ProductsTab products={products} />}
      {tab === "stores" && <StoresTab stores={stores} />}
      {tab === "orders" && <OrdersTab orders={orders} />}
    </>
  );
}

function DashboardTab({ stats, recentOrders }: { stats: AdminStatsType; recentOrders: Order[] }) {
  const cards = [
    { label: "Total Revenue", value: formatRwf(stats.totalRevenue), icon: TrendingUp, color: "bg-[#111111] text-[#BFD7F1]" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-[#BFD7F1] text-[#111111]" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Truck, color: "bg-[#FFD5EA] text-[#111111]" },
    { label: "Products", value: stats.totalProducts, icon: Package, color: "bg-[#111111] text-[#BFD7F1]" },
    { label: "Stores", value: stats.totalStores, icon: Store, color: "bg-[#BFD7F1] text-[#111111]" },
    { label: "Active Stores", value: stats.activeStores, icon: Users, color: "bg-[#FFD5EA] text-[#111111]" },
    { label: "Avg Rating", value: stats.averageRating.toFixed(1), icon: BarChart3, color: "bg-[#111111] text-[#BFD7F1]" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <article key={c.label} className="rounded-[2rem] border border-black/[0.08] bg-white p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", c.color)}>
              <c.icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <p className="mt-5 font-display text-2xl font-black tracking-[-0.04em] sm:text-3xl">{c.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#666666]">{c.label}</p>
          </article>
        ))}
      </div>

      <div className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BFD7F1]">Recent orders</p>
        <h2 className="mt-3 font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">Latest transactions</h2>
        <div className="mt-6 space-y-3">
          {recentOrders.slice(0, 4).map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-[#F8F9FA] p-4">
              <div>
                <p className="font-display text-base font-black tracking-[-0.02em]">{order.id}</p>
                <p className="text-sm text-[#666666]">{order.customer} · {order.storeName}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em]", statusColors[order.status])}>{order.status}</span>
                <span className="font-display font-black">{formatRwf(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products }: { products: typeof mockProducts }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    let list = products.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.storeName.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [category, query, products]);

  const cats = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={cn("rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] transition", category === c ? "border-[#111111] bg-[#111111] text-white" : "border-black/10 bg-white text-[#666666] hover:border-black/30")}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666666]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full sm:w-64 rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#BFD7F1]" />
        </label>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.08] text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#666666]">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Store</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06]">
            {filtered.map((p) => (
              <tr key={p.slug} className="transition hover:bg-[#F8F9FA]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                    <div>
                      <Link to={`/product/${p.slug}`} className="font-display text-base font-black tracking-[-0.02em] hover:text-[#BFD7F1]">{p.name}</Link>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#666666]">{p.storeName}</td>
                <td className="px-5 py-4"><span className="rounded-full border border-black/10 bg-[#F8F9FA] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em]">{p.category}</span></td>
                <td className="px-5 py-4 font-display font-black">{formatRwf(p.price)}</td>
                <td className="px-5 py-4 text-[#666666]">{p.rating.toFixed(1)}</td>
                <td className="px-5 py-4">
                  {p.featured ? <span className="rounded-full bg-[#BFD7F1] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#111111]">Featured</span> : <span className="text-[#666666]">Active</span>}
                </td>
                <td className="px-5 py-4">
                  <Link to={`/product/${p.slug}`} className="text-[#BFD7F1] transition hover:text-[#111111]"><Eye className="h-4 w-4" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="p-8 text-center text-sm text-[#666666]">No products match that search.</p> : null}
      </div>
      <p className="text-xs font-bold text-[#666666]">{filtered.length} product{filtered.length === 1 ? "" : "s"}</p>
    </div>
  );
}

function StoresTab({ stores }: { stores: typeof mockStores }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return stores;
    const q = query.toLowerCase();
    return stores.filter((s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q));
  }, [query, stores]);

  return (
    <div className="space-y-6">
      <label className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666666]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stores..." className="w-full sm:w-64 rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#BFD7F1]" />
      </label>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <article key={s.slug} className="rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4">
              <img src={s.avatar} alt={s.name} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link to={`/store/${s.slug}`} className="font-display text-lg font-black tracking-[-0.03em] hover:text-[#BFD7F1]">{s.name}</Link>
                  {s.verified ? <CheckCircle2 className="h-4 w-4 shrink-0 text-[#BFD7F1]" /> : null}
                </div>
                <p className="text-xs text-[#666666]">{s.location} · {s.category}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-[#666666]">
              <span>{s.productCount} products</span>
              <span>{s.rating.toFixed(1)} rating</span>
              <span>Since {s.founded}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link to={`/store/${s.slug}`} className="flex-1 rounded-full border border-black/10 bg-[#F8F9FA] py-2 text-center text-xs font-bold transition hover:bg-[#111111] hover:text-white">View</Link>
              <Link to="/contact" className="flex-1 rounded-full border border-black/10 bg-[#F8F9FA] py-2 text-center text-xs font-bold transition hover:bg-[#111111] hover:text-white">Contact</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [statusFilter, orders]);

  const statuses: Array<OrderStatus | "all"> = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button key={s} type="button" onClick={() => setStatusFilter(s)} className={cn("rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] transition", statusFilter === s ? "border-[#111111] bg-[#111111] text-white" : "border-black/10 bg-white text-[#666666] hover:border-black/30")}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <button type="button" onClick={() => setExpanded(expanded === order.id ? null : order.id)} className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left">
              <div className="flex items-center gap-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", order.payment === "mobile_money" ? "bg-[#BFD7F1]/20" : "bg-[#FFD5EA]/30")}>
                  {order.payment === "mobile_money" ? <Truck className="h-4 w-4 text-[#111111]" /> : <BarChart3 className="h-4 w-4 text-[#111111]" />}
                </div>
                <div>
                  <p className="font-display text-base font-black tracking-[-0.02em]">{order.id}</p>
                  <p className="text-sm text-[#666666]">{order.customer} · {order.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em]", statusColors[order.status])}>{order.status}</span>
                <span className="font-display font-black">{formatRwf(order.total)}</span>
                <ChevronDown className={cn("h-4 w-4 text-[#666666] transition", expanded === order.id ? "rotate-180" : "")} />
              </div>
            </button>

            {expanded === order.id ? (
              <div className="border-t border-black/[0.08] px-5 pb-5 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#BFD7F1]">Customer</p>
                    <p className="mt-2 text-sm font-bold">{order.customer}</p>
                    <p className="text-sm text-[#666666]">{order.phone}</p>
                    <p className="text-sm text-[#666666]">{order.email}</p>
                    <p className="mt-2 text-sm text-[#666666]">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#BFD7F1]">Payment</p>
                    <p className="mt-2 text-sm font-bold capitalize">{order.payment.replace("_", " ")}</p>
                    <p className="text-sm text-[#666666]">{order.storeName}</p>
                    <div className="mt-3 flex gap-2">
                      <select className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold outline-none" defaultValue={order.status}>
                        {statuses.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <p className="mt-6 mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#BFD7F1]">Items</p>
                <div className="space-y-2">
                  {order.lines.map((line, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-[#F8F9FA] p-3">
                      <img src={line.image} alt={line.productName} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">{line.productName}</p>
                          <p className="text-xs text-[#666666]">Qty {line.quantity}{line.size ? ` · ${line.size}` : ""}{line.color ? ` · ${line.color}` : ""}</p>
                        </div>
                        <p className="text-sm font-bold">{formatRwf(line.price * line.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end border-t border-black/10 pt-4">
                  <div className="space-y-1 text-right text-sm">
                    <div className="flex justify-between gap-8"><span className="text-[#666666]">Subtotal</span><span className="font-bold">{formatRwf(order.subtotal)}</span></div>
                    <div className="flex justify-between gap-8"><span className="text-[#666666]">Delivery</span><span className="font-bold">{order.delivery === 0 ? "Free" : formatRwf(order.delivery)}</span></div>
                    <div className="flex justify-between gap-8 border-t border-black/10 pt-1"><span className="font-display font-black">Total</span><span className="font-display font-black">{formatRwf(order.total)}</span></div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
