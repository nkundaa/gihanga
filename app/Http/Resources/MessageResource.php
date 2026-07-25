<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender' => $this->when($this->relationLoaded('user'), fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar ? asset('storage/' . $this->user->avatar) : null,
            ]),
            'content' => $this->content,
            'attachments' => $this->getAttachmentUrls(),
            'is_read' => (bool) $this->is_read,
            'created_at' => $this->created_at,
        ];
    }

    protected function getAttachmentUrls(): array
    {
        if (!is_array($this->attachments)) {
            return [];
        }
        return array_map(fn($path) => asset('storage/' . $path), $this->attachments);
    }
}
