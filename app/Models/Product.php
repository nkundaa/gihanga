<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'store_id', 'category_id', 'brand_id',
        'slug', 'name', 'short_description', 'full_description', 'description',
        'price', 'original_price', 'sale_price', 'sale_start', 'sale_end',
        'tag', 'badge', 'rating', 'reviews_count',
        'sizes', 'colors', 'images',
        'video_url', 'tax_class',
        'sku', 'barcode', 'stock_quantity', 'low_stock_alert', 'allow_backorders',
        'weight', 'length', 'width', 'height', 'package_type',
        'shipping_class', 'estimated_delivery', 'free_shipping', 'pickup_available',
        'visibility', 'scheduled_at', 'featured', 'recommended', 'flash_sale', 'is_active',
        'warranty', 'return_policy', 'min_order', 'max_order',
        'seo_title', 'seo_description', 'seo_keywords', 'canonical_url', 'og_image',
    ];

    protected function casts(): array
    {
        return [
            'sizes' => 'array',
            'colors' => 'array',
            'images' => 'array',
            'featured' => 'boolean',
            'recommended' => 'boolean',
            'flash_sale' => 'boolean',
            'is_active' => 'boolean',
            'free_shipping' => 'boolean',
            'pickup_available' => 'boolean',
            'sale_start' => 'datetime',
            'sale_end' => 'datetime',
            'scheduled_at' => 'datetime',
            'rating' => 'float',
            'reviews_count' => 'integer',
            'stock_quantity' => 'integer',
            'low_stock_alert' => 'integer',
            'min_order' => 'integer',
            'max_order' => 'integer',
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

    public function brand()
    {
        return $this->belongsTo(Brand::class);
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

    public function productImages()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function tags()
    {
        return $this->belongsToMany(ProductTag::class);
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