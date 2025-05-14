<?php

namespace App\Listeners;

use App\Events\OrderCompleted;
use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\UserBalance;
use Auth;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class OrderCreatedListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    private function truncateTo8Decimals(string $number): string
    {
        return bcdiv($number, '1', 8);
    }

    /**
     * Handle the event.
     */
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;

        Log::info('Order caught ' . $order);

        $overlapingOrders = $this->getOverlappingOrders($order);

        foreach ($overlapingOrders as $overlaping) {
            $this->processOrderMatching($order, $overlaping);

            if ($order->status === 'completed') {
                break;
            }
        }

        $order->save();
    }

    private function getOverlappingOrders(Order $order)
    {
        return Order::where('status', 'pending')
            ->where('user_id', '!=', Auth::user()->id)
            ->where('order_type', $order->order_type === 'buy' ? 'sell' : 'buy')
            ->where('sold_id', $order->purchased_id)
            ->where('purchased_id', $order->sold_id)
            ->where('price', $order->price)
            ->get();
    }
    private function processOrderMatching(Order $order, Order $overlaping): void
    {
        $orderRemainingToFill = $this->truncateTo8Decimals(
            $order->order_type === 'sell'
                ? bcsub($order->sold_amount, $order->filled, 8)
                : bcsub($order->purchased_amount, $order->filled, 8)
        );

        $overlapingRemainingToFill = $this->truncateTo8Decimals(
            $overlaping->order_type === 'sell'
                ? bcsub($overlaping->sold_amount, $overlaping->filled, 8)
                : bcsub($overlaping->purchased_amount, $overlaping->filled, 8)
        );

        $remainingToFill = min($orderRemainingToFill, $overlapingRemainingToFill);

        if (bccomp($remainingToFill, '0', 8) > 0) {
            $this->updateOrderFilling($order, $overlaping, $remainingToFill);
        }
    }

    private function updateOrderFilling(Order $order, Order $overlaping, string $remainingToFill): void
    {
        $orderFillAmount = $order->order_type === 'sell'
            ? $remainingToFill
            : $this->truncateTo8Decimals(bcmul($remainingToFill, $order->price, 8));

        $order->filled = $this->truncateTo8Decimals(bcadd($order->filled, $orderFillAmount, 8));
        $overlaping->filled = $this->truncateTo8Decimals(bcadd($overlaping->filled, $remainingToFill, 8));

        $this->updateRemainingToSell($order);
        $this->updateRemainingToSell($overlaping);

        if (bccomp($order->remaining_to_sell, '0', 8) < 0) {
            $order->remaining_to_sell = '0';
        }

        if (bccomp($overlaping->remaining_to_sell, '0', 8) < 0) {
            $overlaping->remaining_to_sell = '0';
        }

        if (bccomp($order->remaining_to_sell, '0', 8) === 0) {
            $order = $this->completeOrder($order);
        }

        if (bccomp($overlaping->remaining_to_sell, '0', 8) === 0) {
            $overlaping = $this->completeOrder($overlaping);
        }

        $overlaping->save();
    }

    private function updateRemainingToSell(Order $order): void
    {
        if ($order->order_type === 'sell') {
            $order->remaining_to_sell = $this->truncateTo8Decimals(bcsub($order->sold_amount, $order->filled, 8));
        } else {
            $order->remaining_to_sell = $this->truncateTo8Decimals(bcsub($order->purchased_amount, $order->filled, 8));
        }

        if (bccomp($order->remaining_to_sell, '0', 8) < 0) {
            $order->remaining_to_sell = '0';
        }
    }

    private function completeOrder(Order $order): Order
    {
        $order->status = 'completed';

        $userBalance = UserBalance::where('user_id', Auth::user()->id)
            ->where('crypto_id', $order->purchased_id)
            ->get()->first();
        $userBalance->balance += $order->purchased_amount;
        $userBalance->save();

        event(new OrderCompleted($order));

        return $order;
    }
}
