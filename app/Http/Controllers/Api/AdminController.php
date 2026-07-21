<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalRevenue = Order::whereNotIn('status', ['cancelled'])->sum('total');
        $pendingOrders = Order::whereIn('status', ['pending', 'confirmed'])->count();
        $activeStores = Store::where('verified', true)->count();
        $averageRating = Store::avg('rating') ?? 0;

        return response()->json([
            'stats' => [
                'totalProducts' => Product::count(),
                'totalStores' => Store::count(),
                'totalOrders' => Order::count(),
                'totalRevenue' => $totalRevenue,
                'pendingOrders' => $pendingOrders,
                'activeStores' => $activeStores,
                'averageRating' => round($averageRating, 1),
                'totalUsers' => User::count(),
                'totalSellers' => User::where('role', 'seller')->count(),
                'totalReviews' => Review::count(),
            ],
            'recentOrders' => Order::with('user', 'items')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    public function products(): JsonResponse
    {
        return response()->json([
            'products' => Product::with('store', 'category')->latest()->get(),
        ]);
    }

    public function stores(): JsonResponse
    {
        return response()->json([
            'stores' => Store::with('seller.user')->latest()->get(),
        ]);
    }

    public function orders(): JsonResponse
    {
        return response()->json([
            'orders' => Order::with('user', 'items', 'store')->latest()->get(),
        ]);
    }

    public function users(): JsonResponse
    {
        return response()->json([
            'users' => User::with('seller')->latest()->get(),
        ]);
    }

    public function sellers(): JsonResponse
    {
        return response()->json([
            'sellers' => \App\Models\Seller::with('user', 'store')->latest()->get(),
        ]);
    }
}
