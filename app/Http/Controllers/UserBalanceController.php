<?php

namespace App\Http\Controllers;

use App\Models\UserBalance;
use Illuminate\Http\Request;

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
            'user_id' => $request->user_id,
            'crypto_id' => $request->crypto_id,
            'balance' => $request->balance,
            'locked_balance' => 0
        ]);

        return response()->json([
            'created' => $userBalance
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserBalance $userBalance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserBalance $userBalance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserBalance $userBalance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserBalance $userBalance)
    {
        //
    }
}
