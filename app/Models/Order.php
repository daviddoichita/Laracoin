<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_balance_id',
        'sold_id',
        'purchased_id',
        'order_type',
        'total_amount',
        'filled',
        'price',
        'status',
    ];

    public function userBalance(): BelongsTo
    {
        return $this->belongsTo(UserBalance::class);
    }

    public function sold(): BelongsTo
    {
        return $this->belongsTo(Crypto::class, 'sold_id');
    }

    public function purchased(): BelongsTo
    {
        return $this->belongsTo(Crypto::class, 'purchased_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
