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
            'total_amount' => 'required',
            'price' => 'required',
        ]);

        $order = Order::create([
            'user_id' => $request->user_id,
            'sold_id' => $request->sold_id,
            'purchased_id' => $request->purchased_id,
            'order_type' => $request->order_type,
            'total_amount' => $request->total_amount,
            'price' => $request->price,
            'filled' => 0,
            'status' => 'pending'
        ]);

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
        $this->storeCommon($request);

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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }
}
