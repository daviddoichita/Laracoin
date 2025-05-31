<?php

namespace App\Http\Controllers;

use App\Events\TransactionInserted;
use App\Events\TransactionReceived;
use App\Models\Transaction;
use App\Models\UserBalance;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Log;
use Ramsey\Uuid\Exception\InvalidUuidStringException;
use Ramsey\Uuid\Uuid;

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
            'user_balance' => 'required',
            'crypto_id' => 'required',
            'from_uuid' => 'required',
            'target_uuid' => 'required',
            'amount' => 'required'
        ]);

        try {
            $target_uuid_parsed = Uuid::fromString($request->target_uuid);

            if (!UserBalance::where('user_id', '!=', Auth::user()->id)->where('uuid', $target_uuid_parsed->toString())->exists()) {
                return back()->withErrors(['target_uuid' => 'Invalid target uuid']);
            }

            $userBalance = UserBalance::where('id', $request->user_balance)->first();
            if (!$userBalance || $userBalance->balance < $request->amount) {
                return back()->withErrors(['amount' => 'Amount cannot be greater than available balance']);
            }

            $userBalance->balance -= $request->amount;
            $userBalance->save();

            $transaction = Transaction::create([
                'user_id' => Auth::user()->id,
                'crypto_id' => $request->crypto_id,
                'from_uuid' => $request->from_uuid,
                'target_uuid' => $request->target_uuid,
                'amount' => $request->amount,
            ]);

            $targetBalance = UserBalance::where('uuid', $request->target_uuid)->first();

            if ($targetBalance->crypto_id != $request->crypto_id) {
                return back()->withErrors(['target_uuid' => 'Cannot send this crypto to target uuid']);
            }
            $targetBalance->balance += $request->amount;
            $targetBalance->save();

            event(new TransactionInserted($transaction));
            event(new TransactionReceived($targetBalance->user_id, $transaction));
        } catch (InvalidUuidStringException $e) {
            return back()->withErrors(['target_uuid' => 'Invalid target uuid']);
        } catch (\Throwable $e) {
            Log::info($e);
            return back()->withErrors(['target_uuid' => 'An unexpected error occurred while processing the ID.']);
        }

        return back();
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
        $transactions = Transaction::with('crypto')
            ->where('crypto_id', '=', $id)
            ->where('created_at', '>=', Carbon::now()->subDay())->get();
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
