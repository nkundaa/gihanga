<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePromotionRequest;
use App\Models\Promotion;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Promotion::with('store')->active();

        if ($storeSlug = $request->store) {
            $store = Store::where('slug', $storeSlug)->first();
            if ($store) $query->where('store_id', $store->id);
        }

        return response()->json([
            'promotions' => $query->latest()->get(),
        ]);
    }

    public function store(StorePromotionRequest $request): JsonResponse
    {
        $store = $request->user()->seller->store;

        $data = $request->validated();
        $data['store_id'] = $store->id;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('promotions', 'public');
        }

        $promotion = Promotion::create($data);

        return response()->json(['promotion' => $promotion], 201);
    }

    public function show(Promotion $promotion): JsonResponse
    {
        $promotion->load('store');
        return response()->json(['promotion' => $promotion]);
    }

    public function update(StorePromotionRequest $request, Promotion $promotion): JsonResponse
    {
        $this->authorizeStore($request, $promotion);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('promotions', 'public');
        }

        $promotion->update($data);

        return response()->json(['promotion' => $promotion]);
    }

    public function destroy(Request $request, Promotion $promotion): JsonResponse
    {
        $this->authorizeStore($request, $promotion);
        $promotion->delete();

        return response()->json(['message' => 'Promotion deleted']);
    }

    private function authorizeStore(Request $request, Promotion $promotion): void
    {
        if ($request->user()->isAdmin()) return;
        abort_unless(
            $request->user()->isSeller() && $promotion->store_id === $request->user()->seller->store->id,
            403
        );
    }
}
