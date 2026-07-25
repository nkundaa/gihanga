<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDeliveryRequest;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function show(Order $order): JsonResponse
    {
        $delivery = $order->delivery;

        if (!$delivery) {
            return response()->json(['message' => 'No delivery record found'], 404);
        }

        return response()->json(['delivery' => $delivery]);
    }

    public function update(StoreDeliveryRequest $request, Order $order): JsonResponse
    {
        $delivery = $order->delivery ?? Delivery::create(['order_id' => $order->id]);

        $delivery->update($request->validated());

        if ($request->delivery_status === 'delivered') {
            $delivery->update(['delivered_at' => now()]);
            $order->update(['order_status' => 'delivered']);
        }

        return response()->json(['delivery' => $delivery->fresh()]);
    }

    public function track(Order $order): JsonResponse
    {
        $delivery = $order->delivery;

        if (!$delivery) {
            return response()->json(['message' => 'No delivery in progress'], 404);
        }

        return response()->json([
            'delivery' => $delivery,
            'order' => [
                'status' => $order->order_status,
                'payment_status' => $order->payment_status,
            ],
        ]);
    }

    public function updateLocation(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $delivery = $order->delivery;
        if (!$delivery) {
            return response()->json(['message' => 'No delivery record'], 404);
        }

        $updates = $delivery->location_updates ?? [];
        $updates[] = [
            'lat' => $request->lat,
            'lng' => $request->lng,
            'timestamp' => now()->toIso8601String(),
        ];

        $delivery->update(['location_updates' => $updates]);

        return response()->json(['location_updates' => $updates]);
    }
}
