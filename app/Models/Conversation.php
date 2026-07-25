<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = ['customer_id', 'store_id', 'order_id', 'subject', 'is_closed'];
    protected function casts(): array { return ['is_closed' => 'boolean']; }

    public function customer(): BelongsTo { return $this->belongsTo(User::class, 'customer_id'); }
    public function store(): BelongsTo { return $this->belongsTo(Store::class); }
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function messages(): HasMany { return $this->hasMany(Message::class); }
    public function lastMessage() { return $this->hasOne(Message::class)->latestOfMany(); }
}