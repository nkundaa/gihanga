<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = $request->user()->cart()->with('product.store')->get();

        return response()->json([
            'items' => $items,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
            'quantity' => 'integer|min:1',
        ]);

        $existing = $request->user()->cart()
            ->where('product_id', $validated['product_id'])
            ->where('size', $validated['size'] ?? null)
            ->where('color', $validated['color'] ?? null)
            ->first();

        if ($existing) {
            $existing->increment('quantity', $validated['quantity'] ?? 1);
            $item = $existing;
        } else {
            $item = $request->user()->cart()->create($validated);
        }

        return response()->json([
            'item' => $item->load('product.store'),
        ], 201);
    }

    public function update(Request $request, Cart $cart): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validated['quantity'] === 0) {
            $cart->delete();
            return response()->json(['message' => 'Item removed']);
        }

        $cart->update($validated);

        return response()->json([
            'item' => $cart->fresh()->load('product.store'),
        ]);
    }

    public function destroy(Cart $cart): JsonResponse
    {
        $cart->delete();

        return response()->json(['message' => 'Item removed']);
    }

    public function clear(Request $request): JsonResponse
    {
        $request->user()->cart()->delete();

        return response()->json(['message' => 'Cart cleared']);
    }
}
