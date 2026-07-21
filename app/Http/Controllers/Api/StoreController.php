<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'stores' => Store::withCount('products')->where('is_active', true)->get(),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $store = Store::with('products.reviews')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $others = Store::where('id', '!=', $store->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        return response()->json([
            'store' => $store,
            'otherStores' => $others,
        ]);
    }
}
