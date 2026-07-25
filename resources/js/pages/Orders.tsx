import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../api";
import { cn } from "../utils/cn";
import { formatRwf, type Order } from "../data/catalog";
import { MagneticButton, EmptyState } from "../components/ui";
import Seo from "../components/Seo";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statuses = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [params, setParams] = useSearchParams();
  const statusFilter = params.get("status") ?? "all";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.orders.list().then((res) => setOrders(res.orders)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="overflow-x-hidden bg-[#FAF9F5] pt-24 lg:pt-28">
      <Seo title="Orders - Gihanga Market" path="/orders" description="Your GIHANGA orders." />
      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6D6D6D] transition hover:text-[#14171F]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </Link>
          <h1 className="mt-4 font-display text-[clamp(1.4rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">My orders</h1>
          <p className="mt-2 text-[#6D6D6D]">Track and manage all your purchases.</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button key={s} type="button" onClick={() => { const next = new URLSearchParams(); if (s !== "all") next.set("status", s); setParams(next); }}
              className={cn("min-h-11 rounded-full border px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] transition", statusFilter === s ? "border-[#14171F] bg-[#14171F] text-white" : "border-black/10 bg-white text-[#6D6D6D] hover:border-black/30")}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C5A82] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No orders found" copy={statusFilter !== "all" ? `No orders with status "${statusFilter}".` : "You haven't placed any orders yet."}
            action={<MagneticButton to="/shop" variant="gold" className="min-h-12 px-6 py-3 text-sm">Browse shop</MagneticButton>} />
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white p-5 transition hover:bg-[#FAF9F5]">
                <div className="min-w-0">
                  <p className="font-display text-base font-black tracking-[-0.02em] truncate">Order #{order.id}</p>
                  <p className="text-sm text-[#6D6D6D] truncate">{order.createdAt} · {order.storeName} · {order.lines?.length ?? 0} item{(order.lines?.length ?? 0) !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] ${statusColors[order.status] ?? ""}`}>{order.status}</span>
                  <span className="font-display font-black">{formatRwf(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


