<?php

use App\Events\OrderCreated;
use App\Events\PriceComparisonUpdated;
use App\Events\PriceRecordCreated;
use App\Listeners\OrderCreatedListener;
use App\Models\Crypto;
use App\Models\Order;
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
        $today = now()->startOfDay();
        $priceRecord = PriceRecord::where('pair_id', $priceComparison->id)
            ->whereDate('created_at', $today)
            ->whereTime('created_at', '00:00:01')
            ->first();

        if (!$priceRecord) {
            $priceRecord = PriceRecord::where('pair_id', $priceComparison->id)
                ->orderBy('created_at', 'asc')
                ->first();
        }

        $current = $priceRecord ? $priceRecord->price : $priceComparison->price;

        $curr = $priceComparison->price;
        $percent = rand(-2, 2);
        $adjust = ($percent / 100) * $curr;
        $new = $curr + $adjust;

        $priceUpdatePercentage = abs($current - $new) / (($current + $new) / 2);

        if ($new < $current) {
            $priceUpdatePercentage *= -1;
        }

        $priceComparison->price = $new;
        $priceComparison->last_update = $priceUpdatePercentage;
        $priceComparison->save();

        event(new PriceComparisonUpdated($priceComparison));
    }
})->everyThirtySeconds();

Schedule::call(function () {
    $orders = Order::where('status', 'pending')->get();

    foreach ($orders as $order) {
        $orderCreatedListener = new OrderCreatedListener;
        $orderCreatedListener->handle(new OrderCreated($order, Crypto::find($order->purchased_id), Crypto::find($order->sold_id)));
    }
})->everyMinute();
