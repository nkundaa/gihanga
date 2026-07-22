<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

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

    public function storeProduct(Request $request): JsonResponse
    {
        $store = $request->user()->seller?->store;

        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'tag' => 'nullable|string',
            'badge' => 'nullable|string',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
            'colors' => 'nullable|array',
            'colors.*' => 'string',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ]);

        $slug = Str::slug($validated['name']);
        $baseSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $product = Product::create([
            'store_id' => $store->id,
            'slug' => $slug,
            ...$validated,
        ]);

        return response()->json(['product' => $product->fresh()->load('category')], 201);
    }

    public function destroyProduct(Request $request, Product $product): JsonResponse
    {
        $store = $request->user()->seller?->store;

        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted']);
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

        return response()->json(['notifications' => $notifications]);
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
        $store = $request->user()->seller?->store;

        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        return response()->json([
            'products' => Product::where('store_id', $store->id)->with('category')->latest()->get(),
        ]);
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
