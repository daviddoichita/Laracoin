<?php

namespace App\Events;

use App\Models\PriceComparison;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PriceComparisonUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PriceComparison $priceComparison;

    /**
     * Create a new event instance.
     */
    public function __construct(PriceComparison $priceComparison)
    {
        $this->priceComparison = $priceComparison;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
