<?php

namespace App\Listeners;

use App\Events\OrderCompleted;
use App\Events\OrderCreated;
use App\Events\OrderFilled;
use App\Models\Order;
use App\Models\UserBalance;
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
        $parts = explode('.', $number);

        if (count($parts) === 1 || strlen($parts[1]) <= 8) {
            return $number;
        }

        return $parts[0] . '.' . substr($parts[1], 0, 8);
    }

    /**
     * Handle the event.
     */
    public function handle(OrderCreated $event): void
    {
        $order = $event->created;

        $matchingOrders = $this->getMatchingOrders($order);

        foreach ($matchingOrders as $matchingOrder) {
            $this->processOrderMatching($order, $matchingOrder);

            if ($order->status === 'completed') {
                break;
            }
        }

        $order->save();
    }

    private function getMatchingOrders(Order $order)
    {
        $query = Order::where('status', 'pending')
            ->where('user_id', '!=', $order->user_id)
            ->where('order_type', $order->order_type === 'buy' ? 'sell' : 'buy')
            ->where('sold_id', $order->purchased_id)
            ->where('purchased_id', $order->sold_id);

        if ($order->order_type === 'buy') {
            $query->where('price', '<=', $order->price)
                ->orderBy('price', 'asc');
        } else {
            $query->where('price', '>=', $order->price)
                ->orderBy('price', 'desc');
        }

        return $query->get();
    }

    private function processOrderMatching(Order $order, Order $matchingOrder): void
    {
        $orderRemaining = $this->getRemainingAmount($order);
        $matchingRemaining = $this->getRemainingAmount($matchingOrder);

        $fillAmount = bccomp($orderRemaining, $matchingRemaining, 8) <= 0
            ? $orderRemaining
            : $matchingRemaining;

        if (bccomp($fillAmount, '0', 8) > 0) {
            $this->executeOrderFill($order, $matchingOrder, $fillAmount);
        }
    }

    private function getRemainingAmount(Order $order): string
    {
        if ($order->order_type === 'sell') {
            return bcsub($order->sold_amount, $order->filled, 8);
        } else {
            $numerator = bcsub($order->sold_amount, bcmul($order->filled, $order->price, 8), 8);
            return bcdiv($numerator, $order->price, 8);
        }
    }

    private function executeOrderFill(Order $order, Order $matchingOrder, string $fillAmount): void
    {
        $executionPrice = $matchingOrder->price;

        $order->filled = $this->truncateTo8Decimals(bcadd($order->filled, $fillAmount, 8));
        $matchingOrder->filled = $this->truncateTo8Decimals(bcadd($matchingOrder->filled, $fillAmount, 8));

        $this->updateRemainingToSell($order);
        $this->updateRemainingToSell($matchingOrder);

        if (
            bccomp($order->remaining_to_sell, '0', 8) <= 0 ||
            (bccomp($order->remaining_to_sell, '0', 8) < 0 &&
                bccomp($order->remaining_to_sell, '-0.00000001', 8) > -1)
        ) {
            $order->remaining_to_sell = '0';
            $this->completeOrder($order);
        }

        if (
            bccomp($matchingOrder->remaining_to_sell, '0', 8) <= 0 ||
            (bccomp($matchingOrder->remaining_to_sell, '0', 8) < 0 &&
                bccomp($matchingOrder->remaining_to_sell, '-0.00000001', 8) > -1)
        ) {
            $matchingOrder->remaining_to_sell = '0';
            $this->completeOrder($matchingOrder);
        }

        event(new OrderFilled($order, $fillAmount));
        event(new OrderFilled($matchingOrder, $fillAmount));

        $matchingOrder->save();

        $this->updateUserBalances($order, $matchingOrder, $fillAmount, $executionPrice);
    }

    private function updateRemainingToSell(Order $order): void
    {
        if ($order->order_type === 'sell') {
            $order->remaining_to_sell = $this->truncateTo8Decimals(bcsub($order->sold_amount, $order->filled, 16));
        } else {
            $spent = ceil($order->filled * $order->price);
            $order->remaining_to_sell = $this->truncateTo8Decimals(bcsub($order->sold_amount, $spent, 16));
        }

        if (
            bccomp($order->remaining_to_sell, '0', 8) < 0 &&
            bccomp($order->remaining_to_sell, '-0.00000001', 8) > -1
        ) {
            $order->remaining_to_sell = '0';
        }
    }

    private function completeOrder(Order $order): void
    {
        $order->status = 'completed';
        event(new OrderCompleted($order));
    }

    private function updateUserBalances(Order $buyOrder, Order $sellOrder, string $fillAmount, string $executionPrice): void
    {
        if ($buyOrder->order_type === 'sell') {
            $temp = $buyOrder;
            $buyOrder = $sellOrder;
            $sellOrder = $temp;
        }

        $spentAmount = $this->truncateTo8Decimals(bcmul($fillAmount, $executionPrice, 8));

        $sellerReceivedBalance = UserBalance::firstOrCreate(
            ['user_id' => $sellOrder->user_id, 'crypto_id' => $sellOrder->purchased_id],
            ['balance' => '0']
        );
        $sellerReceivedBalance->balance = bcadd($sellerReceivedBalance->balance, $spentAmount, 8);
        $sellerReceivedBalance->save();

        $buyerReceivedBalance = UserBalance::firstOrCreate(
            ['user_id' => $buyOrder->user_id, 'crypto_id' => $buyOrder->purchased_id],
            ['balance' => '0']
        );
        $buyerReceivedBalance->balance = bcadd($buyerReceivedBalance->balance, $fillAmount, 8);
        $buyerReceivedBalance->save();
    }
}
