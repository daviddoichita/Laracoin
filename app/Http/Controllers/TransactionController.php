<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Transaction::all());
    }

    public function indexFull()
    {
        return response()->json(Transaction::with(['user', 'crypto', 'order'])->get());
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
            'user_id' => 'required',
            'crypto_id' => 'required',
            'order_id' => 'required',
            'transaction_type' => 'required',
            'amount' => 'required'
        ]);

        $transaction = Transaction::create([
            'user_id' => $request->user_id,
            'crypto_id' => $request->crypto_id,
            'order_id' => $request->order_id,
            'transaction_type' => $request->transaction_type,
            'amount' => $request->amount,
        ]);

        return response()->json([
            'created' => $transaction
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(Transaction::find($id));
    }

    public function showFull(int $id)
    {
        return response()->json(Transaction::with(['user', 'crypto', 'order'])->find($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
