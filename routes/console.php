<?php

use App\Events\PriceComparisonUpdated;
use App\Events\PriceRecordCreated;
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
        $priceRecord = PriceRecord::create([
            'pair_id' => $priceComparison->id,
            'price' => $priceComparison->price
        ]);

        event(new PriceRecordCreated($priceRecord));
    }
})->everyFiveMinutes();

Schedule::call(function () {
    $priceComparisonArray = PriceComparison::all();

    foreach ($priceComparisonArray as $priceComparison) {
        $current = $priceComparison->price;

        $percent = rand(-10, 10);
        $adjust = ($percent / 100) * $current;
        $new = $current + $adjust;

        $priceUpdatePercentage = abs($current - $new) / (($current + $new) / 2);

        if ($current < $new) {
            $priceUpdatePercentage *= -1;
        }

        $priceComparison->price = $new;
        $priceComparison->last_update = $priceUpdatePercentage;
        $priceComparison->save();

        event(new PriceComparisonUpdated($priceComparison));
        log($new);
    }
})->everyFiveSeconds();
