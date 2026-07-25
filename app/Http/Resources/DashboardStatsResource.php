<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_orders' => (int) $this->total_orders,
            'total_revenue' => (float) $this->total_revenue,
            'total_products' => (int) $this->total_products,
            'total_customers' => (int) $this->total_customers,
            'total_stores' => (int) $this->total_stores,
            'pending_orders' => (int) $this->pending_orders,
            'pending_reviews' => (int) $this->pending_reviews,
        ];
    }
}
