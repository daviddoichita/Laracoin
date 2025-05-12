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
            'purchased_amount' => 'required',
            'sold_amount' => 'required',
            'price' => 'required',
        ]);

        return Order::create([
            'user_id' => $request->user_id,
            'sold_id' => $request->sold_id,
            'purchased_id' => $request->purchased_id,
            'order_type' => $request->order_type,
            'purchased_amount' => $request->purchased_amount,
            'sold_amount' => $request->sold_amount,
            'price' => $request->price,
            'filled' => 0,
            'status' => 'pending'
        ]);
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

    public function cancelOrderInertia(int $id)
    {
        $order = Order::find($id);
        $order->status = 'canceled';
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
