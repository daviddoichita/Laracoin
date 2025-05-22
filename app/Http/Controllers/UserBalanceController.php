<?php

namespace App\Http\Controllers;

use App\Models\UserBalance;
use Illuminate\Http\Request;
use Str;

class UserBalanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(UserBalance::all());
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
            'balance' => 'required'
        ]);

        $userBalance = UserBalance::create([
            'uuid' => Str::uuid(),
            'user_id' => $request->user_id,
            'crypto_id' => $request->crypto_id,
            'balance' => $request->balance,
            'locked_balance' => 0
        ]);

        return response()->json([
            'created' => $userBalance
        ]);
    }
}
