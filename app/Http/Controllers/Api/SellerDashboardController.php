<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Notifications\NewOrderNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\DB;

class SellerDashboardController extends Controller
{
    private function getStore(Request $request)
    {
        $store = $request->user()->seller?->store;
        if (!$store) {
            return null;
        }
        return $store;
    }

    public function stats(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $products = Product::where('store_id', $store->id);
        $orders = Order::where('store_id', $store->id);
        $now = now();

        $todaySales = (clone $orders)->whereDate('created_at', $now)->whereNotIn('status', ['cancelled'])->sum('total');
        $yesterdaySales = (clone $orders)->whereDate('created_at', $now->copy()->subDay())->whereNotIn('status', ['cancelled'])->sum('total');
        $weekSales = (clone $orders)->whereBetween('created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->whereNotIn('status', ['cancelled'])->sum('total');
        $monthSales = (clone $orders)->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year)->whereNotIn('status', ['cancelled'])->sum('total');
        $yearSales = (clone $orders)->whereYear('created_at', $now->year)->whereNotIn('status', ['cancelled'])->sum('total');

        $totalRevenue = (clone $orders)->whereNotIn('status', ['cancelled', 'refunded'])->sum('total');
        $pendingRevenue = (clone $orders)->whereIn('status', ['pending', 'confirmed', 'processing'])->sum('total');
        $refunds = (clone $orders)->where('status', 'refunded')->sum('total');
        $cancelledTotal = (clone $orders)->where('status', 'cancelled')->sum('total');
        $averageOrderValue = $orders->whereNotIn('status', ['cancelled'])->count() > 0
            ? $totalRevenue / $orders->whereNotIn('status', ['cancelled'])->count()
            : 0;
        $conversionRate = 0;

        $orderStatusCounts = [
            'new' => (clone $orders)->where('status', 'pending')->count(),
            'processing' => (clone $orders)->where('status', 'processing')->count(),
            'ready' => (clone $orders)->where('status', 'confirmed')->count(),
            'shipped' => (clone $orders)->where('status', 'shipped')->count(),
            'delivered' => (clone $orders)->where('status', 'delivered')->count(),
            'cancelled' => (clone $orders)->where('status', 'cancelled')->count(),
            'refunded' => (clone $orders)->where('status', 'refunded')->count(),
        ];

        $topProducts = (clone $products)->withCount(['orderItems as sold_count' => function ($q) {
            $q->select(DB::raw('COALESCE(SUM(quantity), 0)'));
        }])->orderByDesc('sold_count')->take(5)->get();

        $lowStock = (clone $products)->where('stock_quantity', '>', 0)
            ->whereColumn('stock_quantity', '<=', 'low_stock_alert')
            ->where('is_active', true)
            ->take(5)->get();

        $outOfStock = (clone $products)->where('stock_quantity', '<=', 0)->where('is_active', true)->count();

        $recentReviews = Review::whereHas('product', fn($q) => $q->where('store_id', $store->id))
            ->with('product', 'user')
            ->latest()
            ->take(5)
            ->get();

        $newCustomers = (clone $orders)->where('created_at', '>=', $now->copy()->subDays(30))
            ->distinct('user_id')->count('user_id');

        $averageRating = (clone $products)->avg('rating') ?? 0;

        $draftProducts = (clone $products)->where('visibility', 'draft')->count();
        $hiddenProducts = (clone $products)->where('visibility', 'hidden')->count();

        return response()->json([
            'stats' => [
                'totalProducts' => $products->count(),
                'activeProducts' => (clone $products)->where('is_active', true)->count(),
                'totalOrders' => $orders->count(),
                'pendingOrders' => (clone $orders)->whereIn('status', ['pending', 'confirmed'])->count(),
                'totalRevenue' => $totalRevenue,
                'averageRating' => round($averageRating, 1),
                'todaySales' => $todaySales,
                'yesterdaySales' => $yesterdaySales,
                'weekSales' => $weekSales,
                'monthSales' => $monthSales,
                'yearSales' => $yearSales,
                'pendingRevenue' => $pendingRevenue,
                'refunds' => $refunds,
                'cancelledTotal' => $cancelledTotal,
                'averageOrderValue' => round($averageOrderValue, 0),
                'conversionRate' => $conversionRate,
                'newCustomers30d' => $newCustomers,
                'outOfStock' => $outOfStock,
                'draftProducts' => $draftProducts,
                'hiddenProducts' => $hiddenProducts,
                'lowStockCount' => $lowStock->count(),
            ],
            'orderStatusCounts' => $orderStatusCounts,
            'store' => $store,
            'recentOrders' => (clone $orders)->with('user', 'items')
                ->latest()->take(5)->get(),
            'products' => (clone $products)->with('category')->latest()->get(),
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStock,
            'recentReviews' => $recentReviews,
        ]);
    }

    public function revenue(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $period = $request->period ?? 'monthly';
        $orders = Order::where('store_id', $store->id)->whereNotIn('status', ['cancelled', 'refunded']);

        if ($period === 'daily') {
            $revenue = (clone $orders)
                ->select(DB::raw("strftime('%Y-%m-%d', created_at) as date"), DB::raw('SUM(total) as total'))
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')->orderBy('date')->get();
        } elseif ($period === 'weekly') {
            $revenue = (clone $orders)
                ->select(DB::raw("strftime('%Y-%W', created_at) as date"), DB::raw('SUM(total) as total'))
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('date')->orderBy('date')->get();
        } elseif ($period === 'yearly') {
            $revenue = (clone $orders)
                ->select(DB::raw("strftime('%Y', created_at) as date"), DB::raw('SUM(total) as total'))
                ->groupBy('date')->orderBy('date')->get();
        } else {
            $revenue = (clone $orders)
                ->select(DB::raw("strftime('%Y-%m', created_at) as date"), DB::raw('SUM(total) as total'))
                ->where('created_at', '>=', now()->subYear())
                ->groupBy('date')->orderBy('date')->get();
        }

        return response()->json([
            'revenue' => $revenue,
            'period' => $period,
            'total' => (clone $orders)->sum('total'),
        ]);
    }

    public function orders(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $query = Order::with('user', 'items')->where('store_id', $store->id);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->get();

        return response()->json(['orders' => $orders]);
    }

    public function customers(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $customers = Order::where('store_id', $store->id)
            ->with('user')
            ->select('user_id', DB::raw('COUNT(*) as order_count'), DB::raw('SUM(total) as total_spent'))
            ->groupBy('user_id')
            ->orderByDesc('order_count')
            ->get()
            ->map(fn($o) => [
                'user' => $o->user,
                'order_count' => $o->order_count,
                'total_spent' => (float)($o->total_spent ?? 0),
            ]);

        return response()->json(['customers' => $customers]);
    }

    public function wallet(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $totalRevenue = Order::where('store_id', $store->id)->whereIn('status', ['delivered'])->sum('total');
        $pendingRevenue = Order::where('store_id', $store->id)->whereIn('status', ['pending', 'confirmed', 'processing', 'shipped'])->sum('total');
        $commission = round($totalRevenue * 0.05, 0);
        $available = $totalRevenue - $commission;

        return response()->json([
            'wallet' => [
                'availableBalance' => $available,
                'pendingBalance' => $pendingRevenue,
                'totalEarned' => $totalRevenue,
                'commissionDeducted' => $commission,
                'nextPayoutDate' => now()->addDays(7)->format('Y-m-d'),
            ],
        ]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();
        $notifications = $user->notifications()
            ->latest()
            ->take(50)
            ->get()
            ->map(fn(DatabaseNotification $n) => [
                'id' => $n->id,
                'type' => class_basename($n->type),
                'data' => $n->data,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications->count(),
        ]);
    }

    public function markNotificationRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        $notification->markAsRead();
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllNotificationsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function storeProducts(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        return response()->json([
            'products' => Product::where('store_id', $store->id)->with('category')->latest()->get(),
        ]);
    }

    public function updateStore(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'tagline' => 'sometimes|nullable|string|max:255',
            'bio' => 'sometimes|nullable|string',
            'category' => 'sometimes|nullable|string',
            'location' => 'sometimes|nullable|string',
            'hours' => 'sometimes|nullable|string',
            'founded' => 'sometimes|nullable|string',
            'cover' => 'sometimes|nullable|string',
            'avatar' => 'sometimes|nullable|string',
            'accent' => 'sometimes|nullable|string',
            'payment_number' => 'sometimes|nullable|string|max:50',
            'payment_provider' => 'sometimes|nullable|in:mtn,airtel,mixx_by_bank,cash',
        ]);

        $store->update($validated);

        return response()->json(['store' => $store->fresh()]);
    }

    public function export(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $type = $request->type ?? 'sales';
        $data = [];

        if ($type === 'sales') {
            $data = Order::where('store_id', $store->id)
                ->with('items')
                ->latest()
                ->get()
                ->toArray();
        } elseif ($type === 'products') {
            $data = Product::where('store_id', $store->id)
                ->with('category')
                ->latest()
                ->get()
                ->toArray();
        }

        return response()->json(['data' => $data, 'type' => $type]);
    }
}