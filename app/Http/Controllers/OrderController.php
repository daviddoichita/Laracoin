<?php

namespace App\Http\Controllers;

use App\Events\OrderCreated;
use App\Models\Crypto;
use App\Models\Order;
use App\Models\UserBalance;
use Auth;
use Illuminate\Database\Eloquent\JsonEncodingException;
use Illuminate\Http\Request;
use Log;

class OrderController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Order::all());
    }

    public function indexFull()
    {
        return response()->json(Order::with(['user', 'sold', 'purchased'])->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function storeCommon(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'sold_id' => 'required',
            'purchased_id' => 'required',
            'order_type' => 'required',
            'purchased_amount' => 'required',
            'sold_amount' => 'required',
            'price' => 'required',
        ]);

        $order = Order::create([
            'user_id' => $request->user_id,
            'sold_id' => $request->sold_id,
            'purchased_id' => $request->purchased_id,
            'order_type' => $request->order_type,
            'purchased_amount' => $request->purchased_amount,
            'sold_amount' => $request->sold_amount,
            'remaining_to_sell' => $request->sold_amount,
            'price' => $request->price,
            'filled' => 0,
            'status' => 'pending'
        ]);

        $userBalance = UserBalance::where('user_id', Auth::user()->id)
            ->where('crypto_id', $order->sold_id)
            ->get()[0];

        $userBalance->balance -= $order->sold_amount;

        $userBalance->save();

        event(new OrderCreated($order, Crypto::find($order->purchased_id), Crypto::find($order->sold_id)));

        return $order;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $order = $this->storeCommon($request);

        return response()->json([
            'created' => $order
        ]);
    }

    public function storeInertia(Request $request)
    {
        $order = $this->storeCommon($request);

        Log::info('storeCommon result: ' . json_encode($order));

        return back();
    }

    public function cancelOrderInertia(int $id)
    {
        $order = Order::find($id);
        $order->status = 'canceled';

        if ($order->remaining_to_sell > 0) {
            $userBalance = UserBalance::where('user_id', Auth::user()->id)
                ->where('crypto_id', $order->sold_id)->get()->first();
            $userBalance->balance += $order->remaining_to_sell;
            $userBalance->save();
        }

        $order->save();

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(Order::find($id));
    }

    public function showFull(int $id)
    {
        return response()->json(Order::with(['user', 'sold', 'purchased'])->find($id));
    }
}
