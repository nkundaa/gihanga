<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedItem extends Model
{
    protected $fillable = [
        'type', 'item_id', 'title', 'subtitle', 'image', 'position', 'status',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active')->orderBy('position');
    }
}
