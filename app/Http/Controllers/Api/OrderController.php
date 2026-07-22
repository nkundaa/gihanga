<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()->with('items', 'store')->latest()->get();

        return response()->json(['orders' => $orders]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|string|email|max:255',
            'customer_address' => 'required|string',
            'delivery_notes' => 'nullable|string',
            'payment_method' => 'required|in:mobile_money,card',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $cartItems = $request->user()->cart()->with('product.store')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $subtotal = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
        $delivery = 0;
        $total = $subtotal + $delivery;
        $orderNumber = 'GH-' . now()->format('Y') . '-' . str_pad(Order::max('id') + 1 ?? 1, 4, '0', STR_PAD_LEFT);

        $order = Order::create([
            'order_number' => $orderNumber,
            'user_id' => $request->user()->id,
            'store_id' => $cartItems->first()->product->store_id,
            'status' => 'pending',
            'subtotal' => $subtotal,
            'delivery' => $delivery,
            'total' => $total,
            ...$validated,
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
                'size' => $item->size,
                'color' => $item->color,
                'image' => ($item->product->images ?? [])[0] ?? null,
            ]);
        }

        Payment::create([
            'order_id' => $order->id,
            'method' => $validated['payment_method'],
            'amount' => $total,
            'status' => 'pending',
            'transaction_id' => 'TXN-' . strtoupper(bin2hex(random_bytes(8))),
        ]);

        $request->user()->cart()->delete();

        return response()->json([
            'order' => $order->load('items', 'payment', 'store'),
        ], 201);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        $user = $request->user();
        if ($order->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'order' => $order->load('items', 'payment', 'store'),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json([
            'order' => $order->fresh()->load('items', 'payment'),
        ]);
    }
}
