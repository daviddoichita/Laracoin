<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'crypto_id',
        'balance',
        'locked_balance',
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function crypto(): BelongsTo
    {
        return $this->belongsTo(Crypto::class);
    }
}
