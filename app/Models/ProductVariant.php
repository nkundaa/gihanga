<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'sku',
        'barcode',
        'price',
        'sale_price',
        'stock',
        'weight',
        'image',
        'attributes',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'attributes' => 'array',
            'sort_order' => 'integer',
            'price' => 'integer',
            'sale_price' => 'integer',
            'stock' => 'integer',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}