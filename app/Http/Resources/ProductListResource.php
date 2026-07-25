<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'price' => (float) $this->price,
            'original_price' => (float) $this->original_price,
            'discount' => $this->discount,
            'rating' => (float) $this->rating,
            'reviews_count' => (int) $this->reviews_count,
            'thumbnail' => $this->getThumbnailUrl(),
            'store_name' => $this->store?->name,
            'store_slug' => $this->store?->slug,
            'category' => $this->category?->title,
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'tags' => $this->when($this->relationLoaded('tags'), fn() => $this->tags->pluck('name')->toArray()),
        ];
    }

    protected function getThumbnailUrl(): ?string
    {
        if ($this->relationLoaded('productImages')) {
            $thumb = $this->productImages->firstWhere('is_thumbnail', true)
                ?? $this->productImages->first();
            if ($thumb) {
                return asset('storage/' . $thumb->path);
            }
        }
        if (is_array($this->images) && !empty($this->images)) {
            return asset('storage/' . $this->images[0]);
        }
        return null;
    }
}
