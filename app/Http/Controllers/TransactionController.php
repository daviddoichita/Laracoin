<?php

namespace App\Http\Controllers;

use App\Events\TransactionInserted;
use App\Models\Transaction;
use Carbon\Carbon;
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

        event(new TransactionInserted($transaction));

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

    public static function volume24h(int $id)
    {
        $transactions = Transaction::with('crypto')->where('crypto_id', '=', $id)->where('created_at', '>=', Carbon::now()->subDay())->get();
        $volume = 0;
        foreach ($transactions as $transaction) {
            $volume += $transaction->amount;
        }

        return $volume;
    }

    public function volume24hApi(int $id)
    {
        return response()->json($this->volume24h($id));
    }
}
