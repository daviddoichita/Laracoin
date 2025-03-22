<?php

use App\Models\PriceComparison;
use App\Models\PriceRecord;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

use function Illuminate\Log\log;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('telescope:prune')->daily();

Schedule::call(function () {
    $priceComparisonArray = PriceComparison::all();

    foreach ($priceComparisonArray as $priceComparison) {
        PriceRecord::create([
            'pair_id' => $priceComparison->id,
            'price' => $priceComparison->price
        ]);
    }
})->everyFiveMinutes();