<?php

namespace App\Http\Controllers;

use App\Models\Crypto;
use App\Models\PriceComparison;
use App\Models\PriceRecord;
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
            'symbol' => 'required|string|max:10',
            'icon' => 'required|string',
            'max_supply' => 'required',
            'circulating_supply' => 'required'
        ]);

        $crypto = Crypto::create([
            'name' => $request->name,
            'symbol' => $request->symbol,
            'icon' => $request->icon,
            'max_supply' => $request->max_supply,
            'circulating_supply' => $request->circulating_supply
        ]);

        return response()->json([
            'created' => $crypto
        ]);
    }

    public function storeInertia(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'symbol' => 'required|string|max:10',
            'icon' => 'required|string',
            'max_supply' => 'required',
            'circulating_supply' => 'required',
            'price' => 'required'
        ]);

        $crypto = Crypto::create([
            'name' => $request->name,
            'symbol' => $request->symbol,
            'icon' => $request->icon,
            'max_supply' => $request->max_supply,
            'circulating_supply' => $request->circulating_supply
        ]);

        $priceComparison = PriceComparison::create([
            'main_id' => $crypto->id,
            'child_id' => 1,
            'pair_symbol' => $crypto->symbol . '_EUR',
            'price' => $request->price,
            'last_update' => 0,
        ]);

        $priceRecord = PriceRecord::create([
            'pair_id' => $priceComparison->id,
            'price' => $priceComparison->price,
        ]);

        return redirect()->intended(route('crypto.add', absolute: false));
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

    public function changeDisableState(int $id)
    {
        $crypto = Crypto::find($id);

        $crypto->disabled = !$crypto->disabled;

        $crypto->save();

        return redirect()->intended(route('crypto.list', absolute: false));
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
