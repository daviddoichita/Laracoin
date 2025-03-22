<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceRecord extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'pair_id',
        'price'
    ];

    public function pair(): BelongsTo
    {
        return $this->belongsTo(PriceComparison::class);
    }
}
