<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerStatistic extends Model
{
    protected $fillable = [
        'store_id', 'date', 'views', 'visitors', 'orders',
        'products_sold', 'revenue', 'commission', 'payout',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'revenue' => 'decimal:2',
            'commission' => 'decimal:2',
            'payout' => 'decimal:2',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
