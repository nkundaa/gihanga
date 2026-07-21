<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'store_id',
        'category_id',
        'slug',
        'name',
        'description',
        'price',
        'original_price',
        'rating',
        'reviews_count',
        'tag',
        'badge',
        'sizes',
        'colors',
        'images',
        'featured',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sizes' => 'array',
            'colors' => 'array',
            'images' => 'array',
            'featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getDiscountAttribute()
    {
        if ($this->original_price && $this->original_price > $this->price) {
            $percent = round((($this->original_price - $this->price) / $this->original_price) * 100);
            return "-{$percent}%";
        }
        return null;
    }
}
