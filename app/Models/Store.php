<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = [
        'seller_id',
        'slug',
        'name',
        'tagline',
        'bio',
        'category',
        'location',
        'cover',
        'avatar',
        'accent',
        'payment_number',
        'payment_provider',
        'hours',
        'founded',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'verified' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
