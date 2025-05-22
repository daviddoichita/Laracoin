<?php

namespace App\Events;

use App\Models\Transaction;
use Carbon\Carbon;
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

class TransactionInserted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // public int $volume24h;

    /**
     * Create a new event instance.
     */
    public function __construct(public Transaction $lastTransaction)
    {
        // $transactions24h = Transaction::with('crypto')
        //     ->where('crypto_id', '=', $this->lastTransaction->crypto_id)
        //     ->where('created_at', '>=', Carbon::now()->subDay())->get();
        // $volume = 0;
        // foreach ($transactions24h as $transaction) {
        //     $volume += $transaction->amount;
        // }
        // $this->volume24h = $volume;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new Channel('Transactions.User.Id.' . $this->lastTransaction->user_id);
    }
}
