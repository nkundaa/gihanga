<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => new ProductListResource($this->whenLoaded('product')),
            'size' => $this->size,
            'color' => $this->color,
            'quantity' => (int) $this->quantity,
        ];
    }
}
