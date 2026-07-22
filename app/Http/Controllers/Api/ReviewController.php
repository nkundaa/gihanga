<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(string $productSlug): JsonResponse
    {
        $product = Product::where('slug', $productSlug)->firstOrFail();

        return response()->json([
            'reviews' => $product->reviews()->with('user')->latest()->get(),
        ]);
    }

    public function store(Request $request, string $productSlug): JsonResponse
    {
        $product = Product::where('slug', $productSlug)->firstOrFail();

        $hasPurchased = OrderItem::where('product_id', $product->id)
            ->whereHas('order', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id)
                  ->where('status', 'delivered');
            })->exists();

        if (!$hasPurchased) {
            return response()->json(['message' => 'You must purchase this product before reviewing it.'], 403);
        }

        $alreadyReviewed = Review::where('product_id', $product->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json(['message' => 'You have already reviewed this product.'], 409);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'text' => 'nullable|string|max:1000',
            'size' => 'nullable|string|max:20',
            'color' => 'nullable|string|max:20',
        ]);

        $review = $product->reviews()->create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        $product->forceFill([
            'rating' => round($product->reviews()->avg('rating'), 1),
            'reviews_count' => $product->reviews()->count(),
        ])->save();

        return response()->json([
            'review' => $review->load('user'),
        ], 201);
    }
}
