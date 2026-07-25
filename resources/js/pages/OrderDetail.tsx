import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, CreditCard, MapPin, Package, Phone, Truck } from "lucide-react";
import { api } from "../api";
import { cn } from "../utils/cn";
import { formatRwf, type Order } from "../data/catalog";
import { MagneticButton, EmptyState } from "../components/ui";
import Seo from "../components/Seo";

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.orders.show(Number(id)).then((res) => setOrder(res.order)).catch(() => setError("Order not found.")).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="overflow-x-hidden bg-[#F8F9FA] pt-24 lg:pt-28">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState title="Order not found" copy="This order may have been removed or doesn't exist." action={<MagneticButton to="/dashboard" variant="gold" className="min-h-12 px-6 py-3 text-sm">Back to dashboard</MagneticButton>} />
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="overflow-x-hidden bg-[#F8F9FA] pt-24 lg:pt-28">
      <Seo title={`Order #${order.id} - Gihanga Market`} path={`/orders/${order.id}`} description="Track your GIHANGA order." />
      <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#666666] transition hover:text-[#111111]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </Link>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.36em] text-[#D4AF37]">Order</p>
              <h1 className="mt-2 font-display text-[clamp(1.4rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">#{order.id}</h1>
              <p className="mt-1 text-sm text-[#666666]">{order.createdAt}</p>
            </div>
            <span className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${statusColors[order.status] ?? ""}`}>{order.status}</span>
          </div>
        </div>

        {isCancelled ? (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-bold text-red-700">This order has been cancelled.</p>
          </div>
        ) : (
          <div className="mb-8 rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">Tracking</p>
            <h2 className="mt-3 font-display text-lg font-black tracking-[-0.04em]">Order progress</h2>
            <div className="mt-6">
              <div className="flex items-start justify-between">
                {statusSteps.map((step, i) => {
                  const isActive = i <= currentStepIndex;
                  const isLast = i < statusSteps.length - 1;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full transition", isActive ? "bg-[#111111] text-[#D4AF37]" : "bg-[#F8F9FA] text-[#666666]")}>
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <p className={cn("mt-2 text-[0.55rem] font-bold uppercase tracking-[0.15em] sm:text-xs", isActive ? "text-[#111111]" : "text-[#666666]")}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="relative mt-2 h-1 rounded-full bg-[#F8F9FA]">
                <div className="absolute left-0 top-0 h-full rounded-full bg-[#111111] transition-all" style={{ width: `${Math.max(0, currentStepIndex) / (statusSteps.length - 1) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">Delivery</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-bold">{order.customer}</p>
                  <p className="text-xs text-[#666666]">{order.address}</p>
                  {order.deliveryNotes ? <p className="text-xs text-[#666666]">Note: {order.deliveryNotes}</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <p className="text-sm">{order.phone}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">Payment</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <p className="text-sm font-bold capitalize">{order.payment?.replace("_", " ") ?? "N/A"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                <p className="text-sm">{order.storeName}</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">Items</p>
          <div className="mt-4 space-y-3">
            {order.lines?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl bg-[#F8F9FA] p-4">
                <img src={item.image} alt={item.productName} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{item.productName}</p>
                    <p className="text-xs text-[#666666]">Qty {item.quantity}{item.size ? ` · ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}</p>
                  </div>
                  <p className="text-sm font-bold shrink-0">{formatRwf(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end border-t border-black/10 pt-4">
            <div className="space-y-1 text-right text-sm">
              <div className="flex justify-between gap-8"><span className="text-[#666666]">Subtotal</span><span className="font-bold">{formatRwf(order.subtotal)}</span></div>
              <div className="flex justify-between gap-8"><span className="text-[#666666]">Delivery</span><span className="font-bold">{order.delivery === 0 ? "Free" : formatRwf(order.delivery)}</span></div>
              <div className="flex justify-between gap-8 border-t border-black/10 pt-1"><span className="font-display font-black">Total</span><span className="font-display font-black">{formatRwf(order.total)}</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

