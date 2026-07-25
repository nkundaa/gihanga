<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => (int) $this->rating,
            'comment' => $this->text,
            'size' => $this->size,
            'color' => $this->color,
            'user' => $this->when($this->relationLoaded('user'), fn() => [
                'name' => $this->user->name,
                'avatar' => $this->user->avatar ? asset('storage/' . $this->user->avatar) : null,
            ]),
            'created_at' => $this->created_at,
        ];
    }
}
