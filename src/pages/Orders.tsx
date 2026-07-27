import { Package } from "lucide-react";
import { mockOrders } from "../data/catalog";
import { MagneticButton, StatusBadge } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { formatRwf } from "../data/catalog";
import Seo from "../components/Seo";

export default function Orders() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-6 px-4 text-center">
        <Package className="h-12 w-12 text-[#2C5A82]" />
        <h1 className="font-display text-3xl font-black">Sign in to view orders</h1>
        <MagneticButton to="/login" variant="primary" className="min-h-12 px-6 py-3 text-sm">Sign in</MagneticButton>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] pb-16">
      <Seo title="Orders - Gihanga Market" path="/orders" description="View your orders" />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.36em] text-[#2C5A82]">History</p>
          <h1 className="mt-3 font-display text-[clamp(1.5rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">Orders</h1>
          <div className="mt-8 space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-black">{order.id}</p>
                    <p className="text-sm text-[#6D6D6D]">{order.createdAt} · {order.lines.length} item{order.lines.length > 1 ? "s" : ""}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
                  {order.lines.map((line) => (
                    <div key={line.productSlug} className="flex items-center justify-between text-sm">
                      <span className="text-[#6D6D6D]">{line.productName} × {line.quantity}</span>
                      <span className="font-bold">{formatRwf(line.price * line.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
                  <span className="font-display text-lg font-black">Total</span>
                  <span className="font-display text-lg font-black">{formatRwf(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
