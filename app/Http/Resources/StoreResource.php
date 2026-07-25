<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'bio' => $this->bio,
            'category' => $this->category,
            'location' => $this->location,
            'cover' => $this->cover ? asset('storage/' . $this->cover) : null,
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'accent' => $this->accent,
            'rating' => $this->rating,
            'followers_count' => $this->followers_count,
            'reviews_count' => $this->reviews_count,
            'products_count' => $this->when($this->relationLoaded('products'), $this->products->count()),
            'verified' => $this->verified,
            'hours' => $this->hours,
            'founded' => $this->founded,
            'payment_number' => $this->payment_number,
            'payment_provider' => $this->payment_provider,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'seller' => [
                'id' => $this->seller?->id,
                'name' => $this->seller?->user?->name,
            ],
        ];
    }
}
