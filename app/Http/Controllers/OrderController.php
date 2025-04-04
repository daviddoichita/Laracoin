<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

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
        return response()->json(Order::with(['userBalance', 'sold', 'purchased'])->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_balance_id' => 'required',
            'sold_id' => 'required',
            'purchased_id' => 'required',
            'order_type' => 'required',
            'total_amount' => 'required',
            'price' => 'required',
        ]);

        $order = Order::create([
            'user_balance_id' => $request->user_balance_id,
            'sold_id' => $request->sold_id,
            'purchased_id' => $request->purchased_id,
            'order_type' => $request->order_type,
            'total_amount' => $request->total_amount,
            'price' => $request->price,
            'filled' => 0,
            'status' => 'pending'
        ]);

        return response()->json([
            'created' => $order
        ]);
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
        return response()->json(Order::with(['userBalance', 'sold', 'purchased'])->find($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
