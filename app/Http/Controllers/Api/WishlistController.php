<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use App\Http\Resources\ProductListResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = $request->user()->wishlistProducts()
            ->with(['store', 'category', 'primaryImage'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'products' => ProductListResource::collection($products),
            'total' => $products->total(),
            'pages' => $products->lastPage(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Product already in wishlist'], 409);
        }

        Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        Product::where('id', $request->product_id)->increment('wishlists_count');

        return response()->json(['message' => 'Added to wishlist'], 201);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $deleted = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Product not in wishlist'], 404);
        }

        $product->decrement('wishlists_count');

        return response()->json(['message' => 'Removed from wishlist']);
    }

    public function check(Request $request, Product $product): JsonResponse
    {
        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->exists();

        return response()->json(['wishlisted' => $exists]);
    }
}
