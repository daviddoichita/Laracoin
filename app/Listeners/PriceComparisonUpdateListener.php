<?php

namespace App\Listeners;

use App\Events\PriceComparisonUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use function Illuminate\Log\log;

class PriceComparisonUpdateListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PriceComparisonUpdated $event): void
    {
        log($event->priceComparison);
    }
}
