<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delivery extends Model
{
    protected $fillable = [
        'order_id', 'delivery_status', 'driver_name', 'driver_phone',
        'driver_photo', 'vehicle_type', 'vehicle_plate',
        'pickup_at', 'estimated_delivery_at', 'delivered_at',
        'tracking_history', 'location_updates', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'pickup_at' => 'datetime',
            'estimated_delivery_at' => 'datetime',
            'delivered_at' => 'datetime',
            'tracking_history' => 'array',
            'location_updates' => 'array',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
