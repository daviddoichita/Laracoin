<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PriceComparison extends Model
{
    use HasFactory;

    protected $table = 'price_comparison';

    protected $fillable = [
        'main_id',
        'child_id',
        'pair_symbol',
        'price',
        'last_update'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public function mainCrypto(): BelongsTo
    {
        return $this->belongsTo(Crypto::class, 'main_id');
    }

    public function childCrypto(): BelongsTo
    {
        return $this->belongsTo(Crypto::class, 'child_id');
    }

    public function priceRecord(): HasMany
    {
        return $this->hasMany(PriceComparison::class);
    }
}
