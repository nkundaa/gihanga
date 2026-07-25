<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id);
        $totalOrders = (clone $orders)->count();
        $completedOrders = (clone $orders)->where('status', 'delivered')->count();
        $pendingOrders = (clone $orders)->whereIn('status', ['pending', 'confirmed', 'processing'])->count();
        $totalSpent = (clone $orders)->whereNotIn('status', ['cancelled', 'refunded'])->sum('total');

        $recentOrders = (clone $orders)->with('store', 'items')
            ->latest()
            ->take(5)
            ->get();

        $wishlistCount = 0;
        if ($user->wishlistProducts) {
            $wishlistCount = $user->wishlistProducts()->count();
        }

        return response()->json([
            'stats' => [
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
                'pendingOrders' => $pendingOrders,
                'totalSpent' => $totalSpent,
                'wishlistCount' => $wishlistCount,
            ],
            'recentOrders' => $recentOrders,
            'user' => $user,
        ]);
    }

    public function recommendations(Request $request): JsonResponse
    {
        $products = Product::with('store')
            ->where('is_active', true)
            ->where('visibility', 'published')
            ->inRandomOrder()
            ->take(12)
            ->get();

        return response()->json(['products' => $products]);
    }

    public function favoriteStores(Request $request): JsonResponse
    {
        $user = $request->user();

        $stores = Store::where('is_active', true)
            ->inRandomOrder()
            ->take(6)
            ->get();

        return response()->json(['stores' => $stores]);
    }

    public function recentActivity(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with('store')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn($o) => [
                'type' => 'order',
                'message' => "Order #{$o->order_number} is {$o->status}",
                'status' => $o->status,
                'created_at' => $o->created_at->diffForHumans(),
            ]);

        $reviews = Review::where('user_id', $user->id)
            ->with('product')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($r) => [
                'type' => 'review',
                'message' => "You reviewed {$r->product->name}",
                'rating' => $r->rating,
                'created_at' => $r->created_at->diffForHumans(),
            ]);

        $activity = $orders->concat($reviews)->sortByDesc('created_at')->values()->take(15);

        return response()->json(['activity' => $activity]);
    }
}