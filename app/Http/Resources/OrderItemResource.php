<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'price' => (float) $this->price,
            'quantity' => (int) $this->quantity,
            'size' => $this->size,
            'color' => $this->color,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
        ];
    }
}
