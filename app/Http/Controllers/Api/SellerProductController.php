<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductTag;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SellerProductController extends Controller
{
    private function getStore(Request $request)
    {
        $store = $request->user()->seller?->store;
        if (!$store) {
            return null;
        }
        return $store;
    }

    public function index(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $products = Product::where('store_id', $store->id)
            ->with('category', 'brand', 'tags', 'variants', 'productImages')
            ->latest()
            ->get();

        return response()->json(['products' => $products]);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->load('category', 'brand', 'tags', 'variants', 'productImages');

        return response()->json(['product' => $product]);
    }

    public function store(Request $request): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store) {
            return response()->json(['message' => 'No store found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'short_description' => 'nullable|string|max:300',
            'full_description' => 'nullable|string',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'sale_start' => 'nullable|date',
            'sale_end' => 'nullable|date|after_or_equal:sale_start',
            'tax_class' => 'nullable|string|in:taxable,tax_exempt,digital_goods',
            'sku' => 'nullable|string|unique:products,sku',
            'barcode' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
            'low_stock_alert' => 'nullable|integer|min:0',
            'allow_backorders' => 'nullable|string|in:yes,no,notify',
            'tag' => 'nullable|string',
            'badge' => 'nullable|string',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
            'colors' => 'nullable|array',
            'colors.*' => 'string',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'video_url' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'package_type' => 'nullable|string',
            'shipping_class' => 'nullable|string',
            'estimated_delivery' => 'nullable|string',
            'free_shipping' => 'nullable|boolean',
            'pickup_available' => 'nullable|boolean',
            'visibility' => 'nullable|string|in:draft,published,private,scheduled,hidden',
            'scheduled_at' => 'nullable|date',
            'featured' => 'nullable|boolean',
            'recommended' => 'nullable|boolean',
            'flash_sale' => 'nullable|boolean',
            'warranty' => 'nullable|string',
            'return_policy' => 'nullable|string',
            'min_order' => 'nullable|integer|min:1',
            'max_order' => 'nullable|integer|min:1',
            'seo_title' => 'nullable|string|max:70',
            'seo_description' => 'nullable|string|max:160',
            'seo_keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_image' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'variants' => 'nullable|array',
            'variants.*.sku' => 'nullable|string',
            'variants.*.barcode' => 'nullable|string',
            'variants.*.price' => 'nullable|numeric|min:0',
            'variants.*.sale_price' => 'nullable|numeric|min:0',
            'variants.*.stock' => 'nullable|integer|min:0',
            'variants.*.weight' => 'nullable|string',
            'variants.*.image' => 'nullable|string',
            'variants.*.attributes' => 'nullable|array',
            'variants.*.sort_order' => 'nullable|integer',
        ]);

        $slug = Str::slug($validated['name']);
        $baseSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }
        $validated['slug'] = $slug;

        if (!isset($validated['visibility'])) {
            $validated['visibility'] = 'draft';
        }

        $product = Product::create([
            'store_id' => $store->id,
            ...$validated,
        ]);

        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tagSlug = Str::slug($tagName);
                $tag = ProductTag::firstOrCreate(
                    ['slug' => $tagSlug],
                    ['name' => $tagName]
                );
                $tagIds[] = $tag->id;
            }
            $product->tags()->sync($tagIds);
        }

        if (!empty($validated['variants'])) {
            foreach ($validated['variants'] as $v) {
                $product->variants()->create($v);
            }
        }

        $product->load('category', 'brand', 'tags', 'variants');

        return response()->json(['product' => $product], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'short_description' => 'sometimes|nullable|string|max:300',
            'full_description' => 'sometimes|nullable|string',
            'description' => 'sometimes|nullable|string',
            'category_id' => 'sometimes|nullable|exists:categories,id',
            'brand_id' => 'sometimes|nullable|exists:brands,id',
            'price' => 'sometimes|numeric|min:0',
            'original_price' => 'sometimes|nullable|numeric|min:0',
            'sale_price' => 'sometimes|nullable|numeric|min:0',
            'sale_start' => 'sometimes|nullable|date',
            'sale_end' => 'sometimes|nullable|date|after_or_equal:sale_start',
            'tax_class' => 'sometimes|nullable|string|in:taxable,tax_exempt,digital_goods',
            'sku' => 'sometimes|nullable|string|unique:products,sku,' . $product->id,
            'barcode' => 'sometimes|nullable|string',
            'stock_quantity' => 'sometimes|nullable|integer|min:0',
            'low_stock_alert' => 'sometimes|nullable|integer|min:0',
            'allow_backorders' => 'sometimes|nullable|string|in:yes,no,notify',
            'tag' => 'sometimes|nullable|string',
            'badge' => 'sometimes|nullable|string',
            'sizes' => 'sometimes|nullable|array',
            'sizes.*' => 'string',
            'colors' => 'sometimes|nullable|array',
            'colors.*' => 'string',
            'images' => 'sometimes|nullable|array',
            'images.*' => 'string',
            'video_url' => 'sometimes|nullable|string',
            'weight' => 'sometimes|nullable|numeric|min:0',
            'length' => 'sometimes|nullable|numeric|min:0',
            'width' => 'sometimes|nullable|numeric|min:0',
            'height' => 'sometimes|nullable|numeric|min:0',
            'package_type' => 'sometimes|nullable|string',
            'shipping_class' => 'sometimes|nullable|string',
            'estimated_delivery' => 'sometimes|nullable|string',
            'free_shipping' => 'sometimes|nullable|boolean',
            'pickup_available' => 'sometimes|nullable|boolean',
            'visibility' => 'sometimes|nullable|string|in:draft,published,private,scheduled,hidden',
            'scheduled_at' => 'sometimes|nullable|date',
            'featured' => 'sometimes|nullable|boolean',
            'recommended' => 'sometimes|nullable|boolean',
            'flash_sale' => 'sometimes|nullable|boolean',
            'is_active' => 'sometimes|boolean',
            'warranty' => 'sometimes|nullable|string',
            'return_policy' => 'sometimes|nullable|string',
            'min_order' => 'sometimes|nullable|integer|min:1',
            'max_order' => 'sometimes|nullable|integer|min:1',
            'seo_title' => 'sometimes|nullable|string|max:70',
            'seo_description' => 'sometimes|nullable|string|max:160',
            'seo_keywords' => 'sometimes|nullable|string',
            'canonical_url' => 'sometimes|nullable|string',
            'og_image' => 'sometimes|nullable|string',
            'tags' => 'sometimes|nullable|array',
            'tags.*' => 'string',
            'variants' => 'sometimes|nullable|array',
            'variants.*.id' => 'sometimes|integer',
            'variants.*.sku' => 'sometimes|nullable|string',
            'variants.*.barcode' => 'sometimes|nullable|string',
            'variants.*.price' => 'sometimes|nullable|numeric|min:0',
            'variants.*.sale_price' => 'sometimes|nullable|numeric|min:0',
            'variants.*.stock' => 'sometimes|nullable|integer|min:0',
            'variants.*.weight' => 'sometimes|nullable|string',
            'variants.*.image' => 'sometimes|nullable|string',
            'variants.*.attributes' => 'sometimes|nullable|array',
            'variants.*.sort_order' => 'sometimes|nullable|integer',
        ]);

        if (isset($validated['name'])) {
            $slug = Str::slug($validated['name']);
            $baseSlug = $slug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $validated['slug'] = $slug;
        }

        $product->update($validated);

        if (isset($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tagSlug = Str::slug($tagName);
                $tag = ProductTag::firstOrCreate(
                    ['slug' => $tagSlug],
                    ['name' => $tagName]
                );
                $tagIds[] = $tag->id;
            }
            $product->tags()->sync($tagIds);
        }

        if (isset($validated['variants'])) {
            $existingIds = $product->variants()->pluck('id')->toArray();
            $incomingIds = [];
            foreach ($validated['variants'] as $v) {
                if (isset($v['id'])) {
                    $variant = ProductVariant::find($v['id']);
                    if ($variant && $variant->product_id === $product->id) {
                        $variant->update($v);
                        $incomingIds[] = $variant->id;
                    }
                } else {
                    $variant = $product->variants()->create($v);
                    $incomingIds[] = $variant->id;
                }
            }
            $toDelete = array_diff($existingIds, $incomingIds);
            if (!empty($toDelete)) {
                ProductVariant::whereIn('id', $toDelete)->delete();
            }
        }

        $product->load('category', 'brand', 'tags', 'variants', 'productImages');

        return response()->json(['product' => $product]);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }

    public function uploadImages(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'images' => 'required|array|max:20',
            'images.*' => 'image|mimes:jpeg,png,webp|max:10240',
        ]);

        $product = Product::findOrFail($request->product_id);
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $uploaded = [];
        foreach ($request->file('images') as $img) {
            $path = $img->store('products/' . $product->id, 'public');
            $image = ProductImage::create([
                'product_id' => $product->id,
                'path' => $path,
                'sort_order' => ProductImage::where('product_id', $product->id)->count(),
            ]);
            $uploaded[] = $image;
        }

        return response()->json(['images' => $uploaded], 201);
    }

    public function reorderImages(Request $request): JsonResponse
    {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:product_images,id',
            'images.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->images as $img) {
            ProductImage::where('id', $img['id'])->update(['sort_order' => $img['sort_order']]);
        }

        return response()->json(['message' => 'Images reordered']);
    }

    public function setThumbnail(Request $request): JsonResponse
    {
        $request->validate([
            'image_id' => 'required|exists:product_images,id',
        ]);

        $image = ProductImage::findOrFail($request->image_id);
        $product = $image->product;
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        ProductImage::where('product_id', $product->id)->update(['is_thumbnail' => false]);
        $image->update(['is_thumbnail' => true]);

        return response()->json(['message' => 'Thumbnail updated', 'image' => $image]);
    }

    public function publish(Request $request, Product $product): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->update([
            'visibility' => 'published',
            'is_active' => true,
        ]);

        return response()->json(['message' => 'Product published', 'product' => $product->fresh()]);
    }

    public function archive(Request $request, Product $product): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->update([
            'visibility' => 'hidden',
            'is_active' => false,
        ]);

        return response()->json(['message' => 'Product archived', 'product' => $product->fresh()]);
    }

    public function duplicate(Request $request, Product $product): JsonResponse
    {
        $store = $this->getStore($request);
        if (!$store || $product->store_id !== $store->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $newProduct = $product->replicate();
        $newProduct->name = $product->name . ' (Copy)';
        $slug = Str::slug($newProduct->name);
        $baseSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }
        $newProduct->slug = $slug;
        $newProduct->visibility = 'draft';
        $newProduct->is_active = false;
        $newProduct->save();

        return response()->json(['product' => $newProduct->fresh()->load('category', 'brand', 'tags')], 201);
    }

    public function brands(Request $request): JsonResponse
    {
        return response()->json([
            'brands' => Brand::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function storeBrand(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
        ]);

        $brand = Brand::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return response()->json(['brand' => $brand], 201);
    }
}