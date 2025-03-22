<?php

namespace App\Http\Controllers;

use App\Models\Crypto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

use function Illuminate\Log\log;

class CryptoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Crypto::all());
    }

    public function indexFull()
    {
        return response()->json(Crypto::with(['mainPriceComparison', 'childPriceComparison'])->get());
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
            'name' => 'required|string|max:50',
            'symbol' => 'required|string|max:10'
        ]);

        $crypto = Crypto::create([
            'name' => $request->name,
            'symbol' => $request->symbol
        ]);

        return response()->json([
            'created' => $crypto
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(Crypto::find($id));
    }

    public function showFull(int $id)
    {
        return response()->json(Crypto::with(['mainPriceComparison', 'childPriceComparison'])->find($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Crypto $crypto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'symbol' => 'required|string|max:10'
        ]);

        $current = Crypto::find($id);

        $current->name = $request->name;
        $current->symbol = $request->symbol;

        $current->save();

        return response()->json([
            'message' => 'Update successfull',
            'crypto' => $current
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $crypto = Crypto::find($id);
        $crypto->delete();

        return response()->json([
            'message' => 'Delete successfull'
        ]);
    }
}
