<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'addresses' => $request->user()->addresses()->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'sometimes|string|max:100',
            'is_default' => 'sometimes|boolean',
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($validated['is_default'] ?? false) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = Address::create($validated);

        return response()->json(['address' => $address], 201);
    }

    public function update(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
            'city' => 'sometimes|string|max:100',
            'is_default' => 'sometimes|boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json(['address' => $address->fresh()]);
    }

    public function destroy(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted']);
    }
}