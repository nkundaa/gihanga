<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StoreFollower;
use App\Http\Resources\StoreResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreFollowerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $stores = $request->user()->followedStores()
            ->withCount(['products', 'followers'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'stores' => StoreResource::collection($stores),
            'total' => $stores->total(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['store_id' => 'required|exists:stores,id']);

        $exists = StoreFollower::where('user_id', $request->user()->id)
            ->where('store_id', $request->store_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already following this store'], 409);
        }

        StoreFollower::create([
            'user_id' => $request->user()->id,
            'store_id' => $request->store_id,
        ]);

        Store::where('id', $request->store_id)->increment('followers_count');

        return response()->json(['message' => 'Store followed'], 201);
    }

    public function destroy(Request $request, Store $store): JsonResponse
    {
        $deleted = StoreFollower::where('user_id', $request->user()->id)
            ->where('store_id', $store->id)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Not following this store'], 404);
        }

        $store->decrement('followers_count');

        return response()->json(['message' => 'Store unfollowed']);
    }

    public function check(Request $request, Store $store): JsonResponse
    {
        $following = StoreFollower::where('user_id', $request->user()->id)
            ->where('store_id', $store->id)
            ->exists();

        return response()->json(['following' => $following]);
    }
}
