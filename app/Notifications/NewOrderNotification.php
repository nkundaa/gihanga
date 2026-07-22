<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Order $order
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $items = $this->order->items->map(fn($i) => [
            'product' => $i->product_name,
            'quantity' => $i->quantity,
            'price' => $i->price,
        ]);

        return [
            'order_number' => $this->order->order_number,
            'customer_name' => $this->order->customer_name,
            'customer_phone' => $this->order->customer_phone,
            'customer_address' => $this->order->customer_address,
            'total' => $this->order->total,
            'payment_method' => $this->order->payment_method,
            'items' => $items,
            'message' => $this->order->customer_name . ' paid ' . number_format($this->order->total) . ' RWF for ' . $items->first()['product'] . ($items->count() > 1 ? ' and ' . ($items->count() - 1) . ' more items' : ''),
        ];
    }
}
