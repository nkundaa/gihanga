<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function update(Request $request, Store $store): JsonResponse
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();
        $isOwner = $user->seller && $user->seller->store && $user->seller->store->id === $store->id;

        if (!$isAdmin && !$isOwner) {
            return response()->json(['message' => 'Unauthorized'], 403);
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
