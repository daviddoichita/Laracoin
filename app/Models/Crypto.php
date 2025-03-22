<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Crypto extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'symbol'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public function userBalance(): HasMany
    {
        return $this->hasMany(UserBalance::class);
    }

    public function mainPriceComparison(): HasMany
    {
        return $this->hasMany(PriceComparison::class, 'main_id');
    }

    public function childPriceComparison(): HasMany
    {
        return $this->hasMany(PriceComparison::class, 'child_id');
    }

    public function sellOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'sold_id');
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'purchased_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
