<?php

namespace App\Events;

use App\Models\PriceRecord;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

use function Illuminate\Log\log;

class PriceRecordCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public PriceRecord $priceRecord)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        $channels = [];

        $intervals = ['5m', '15m', '30m', '1h'];
        $createdAt = $this->priceRecord->created_at;
        $currentMinute = (int) $createdAt->format('i');

        foreach ($intervals as $interval) {
            switch ($interval) {
                case '5m':
                    if ($currentMinute % 5 !== 0) continue 2;
                    break;
                case '15m':
                    if ($currentMinute % 15 !== 0) continue 2;
                    break;
                case '30m':
                    if ($currentMinute % 30 !== 0) continue 2;
                    break;
                case '1h':
                    if ($currentMinute !== 0) continue 2;
                    break;
                default:
            }
            $channels[] = new Channel('Prices.Pair.' . $this->priceRecord->pair_id . '.' . $interval);
        }

        return $channels;
    }
}
