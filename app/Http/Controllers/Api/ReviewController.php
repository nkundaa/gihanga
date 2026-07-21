<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        $product->update([
            'rating' => $product->reviews()->avg('rating'),
            'reviews_count' => $product->reviews()->count(),
        ]);

        return response()->json([
            'review' => $review->load('user'),
        ], 201);
    }
}
