<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'category_id' => $this->category_id,
            'brand_id' => $this->brand_id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'price' => (float) $this->price,
            'original_price' => (float) $this->original_price,
            'discount_price' => $this->sale_price ? (float) $this->sale_price : null,
            'discount' => $this->discount,
            'rating' => (float) $this->rating,
            'reviews_count' => (int) $this->reviews_count,
            'wishlists_count' => (int) $this->when($this->relationLoaded('wishlists'), $this->wishlists->count()),
            'stock_quantity' => (int) $this->stock_quantity,
            'status' => $this->is_active ? 'active' : 'inactive',
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'images' => $this->getImageUrls(),
            'tags' => $this->when($this->relationLoaded('tags'), fn() => $this->tags->pluck('name')->toArray()),
            'featured' => (bool) $this->featured,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'store' => [
                'name' => $this->store?->name,
                'slug' => $this->store?->slug,
            ],
            'category' => [
                'name' => $this->category?->title,
            ],
        ];
    }

    protected function getImageUrls(): array
    {
        if ($this->relationLoaded('productImages') && $this->productImages->isNotEmpty()) {
            return $this->productImages->map(fn($img) => asset('storage/' . $img->path))->toArray();
        }
        if (is_array($this->images)) {
            return array_map(fn($path) => asset('storage/' . $path), $this->images);
        }
        return [];
    }
}
