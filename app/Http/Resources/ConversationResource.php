<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer' => $this->when($this->relationLoaded('customer'), fn() => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
                'avatar' => $this->customer->avatar ? asset('storage/' . $this->customer->avatar) : null,
            ]),
            'store' => $this->when($this->relationLoaded('store'), fn() => [
                'id' => $this->store->id,
                'name' => $this->store->name,
                'slug' => $this->store->slug,
                'avatar' => $this->store->avatar ? asset('storage/' . $this->store->avatar) : null,
            ]),
            'order_id' => $this->order_id,
            'subject' => $this->subject,
            'last_message' => new MessageResource($this->whenLoaded('lastMessage')),
            'is_closed' => (bool) $this->is_closed,
            'created_at' => $this->created_at,
            'unread_count' => $this->when($this->relationLoaded('messages'), fn() => $this->messages->where('is_read', false)->count()),
        ];
    }
}
