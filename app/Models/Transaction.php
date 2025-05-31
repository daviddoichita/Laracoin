<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'crypto_id',
        'from_uuid',
        'target_uuid',
        'amount',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function crypto(): BelongsTo
    {
        return $this->belongsTo(Crypto::class);
    }

    public function from(): BelongsTo
    {
        return $this->belongsTo(UserBalance::class, 'from_uuid');
    }

    public function to(): BelongsTo
    {
        return $this->belongsTo(UserBalance::class, 'target_uuid');
    }
}
