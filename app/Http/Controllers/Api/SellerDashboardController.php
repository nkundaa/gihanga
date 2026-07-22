<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerDashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $store = $request->user()->seller?->store;

        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $products = Product::where('store_id', $store->id);
        $orders = Order::where('store_id', $store->id);

        return response()->json([
            'stats' => [
                'totalProducts' => $products->count(),
                'activeProducts' => (clone $products)->where('is_active', true)->count(),
                'totalOrders' => $orders->count(),
                'pendingOrders' => (clone $orders)->whereIn('status', ['pending', 'confirmed'])->count(),
                'totalRevenue' => (clone $orders)->whereNotIn('status', ['cancelled'])->sum('total'),
                'averageRating' => $store->rating,
            ],
            'store' => $store,
            'recentOrders' => (clone $orders)->with('user', 'items')
                ->latest()
                ->take(5)
                ->get(),
            'products' => (clone $products)->with('category')->latest()->get(),
        ]);
    }

    public function orders(Request $request): JsonResponse
    {
        $store = $request->user()->seller?->store;

        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $orders = Order::with('user', 'items')
            ->where('store_id', $store->id)
            ->latest()
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function updateProduct(Request $request, Product $product): JsonResponse
    {
        $store = $request->user()->seller?->store;

        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'original_price' => 'sometimes|nullable|numeric|min:0',
            'tag' => 'sometimes|nullable|string',
            'badge' => 'sometimes|nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $product->update($validated);

        return response()->json(['product' => $product->fresh()]);
    }

    public function updateStore(Request $request): JsonResponse
    {
        $store = $request->user()->seller?->store;

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
}
