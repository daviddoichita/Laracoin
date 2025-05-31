<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Str;

class UserBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'crypto_id',
        'balance',
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

    public function fromTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'from_uuid');
    }

    public function toTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'target_uuid');
    }
}
