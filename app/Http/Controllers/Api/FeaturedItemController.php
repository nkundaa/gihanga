<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeaturedItem;
use App\Models\Product;
use App\Models\Store;
use App\Http\Resources\ProductListResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeaturedItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = FeaturedItem::active()->get();

        $products = [];
        $stores = [];

        foreach ($items as $item) {
            if ($item->type === 'product') {
                $product = Product::with(['store', 'category', 'primaryImage'])->find($item->item_id);
                if ($product) $products[] = $product;
            } elseif ($item->type === 'store') {
                $store = Store::withCount(['products', 'followers'])->find($item->item_id);
                if ($store) $stores[] = $store;
            }
        }

        return response()->json([
            'featured_products' => ProductListResource::collection(collect($products)),
            'featured_stores' => $stores,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:product,store',
            'item_id' => 'required|integer',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'position' => 'integer|min:0',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('featured', 'public');
        }

        $item = FeaturedItem::create($data);

        return response()->json(['featured_item' => $item], 201);
    }

    public function destroy(FeaturedItem $featuredItem): JsonResponse
    {
        $featuredItem->delete();
        return response()->json(['message' => 'Featured item removed']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:featured_items,id',
            'items.*.position' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            FeaturedItem::where('id', $item['id'])->update(['position' => $item['position']]);
        }

        return response()->json(['message' => 'Order updated']);
    }
}
