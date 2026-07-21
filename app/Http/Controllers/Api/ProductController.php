<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('store')->where('is_active', true);

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->store) {
            $query->whereHas('store', fn($q) => $q->where('slug', $request->store));
        }

        if ($request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhereHas('store', fn($qq) => $qq->where('name', 'like', "%{$s}%"));
            });
        }

        if ($request->sort === 'price_asc') {
            $query->orderBy('price');
        } elseif ($request->sort === 'price_desc') {
            $query->orderByDesc('price');
        } elseif ($request->sort === 'top_rated') {
            $query->orderByDesc('rating');
        } else {
            $query->orderByDesc('created_at');
        }

        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->get();

        return response()->json([
            'products' => $products,
            'priceRange' => [
                'min' => Product::where('is_active', true)->min('price') ?? 0,
                'max' => Product::where('is_active', true)->max('price') ?? 0,
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::with('store', 'category', 'reviews.user')
            ->where('slug', $slug)
            ->firstOrFail();

        $storeProducts = $product->store->products()
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        $similar = Product::with('store')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        return response()->json([
            'product' => $product,
            'storeProducts' => $storeProducts,
            'similar' => $similar,
        ]);
    }
}
