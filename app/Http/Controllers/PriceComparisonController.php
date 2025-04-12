<?php

namespace App\Http\Controllers;

use App\Events\PriceComparisonUpdated;
use App\Models\PriceComparison;
use Illuminate\Http\Request;

class PriceComparisonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(PriceComparison::with(['mainCrypto', 'childCrypto'])->get());
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
            'main_id' => 'required',
            'child_id' => 'required',
            'pair_symbol' => 'string|required',
            'price' => 'required'
        ]);

        $priceComparison = PriceComparison::create([
            'main_id' => $request->main_id,
            'child_id' => $request->child_id,
            'pair_symbol' => $request->pair_symbol,
            'price' => $request->price,
            'last_update' => 0,
        ]);

        return response()->json([
            'created' => $priceComparison
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(PriceComparison::with(['mainCrypto', 'childCrypto'])->find($id));
    }

    public function showByPair(string $symbol)
    {
        return response()->json(PriceComparison::where('pair_symbol', '=', $symbol)->get());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $request->validate([
            'price' => 'required'
        ]);

        $priceComparison = PriceComparison::with('mainCrypto', 'childCrypto')->find($id);

        // Need the update to be daily
        $current = 1 / $priceComparison->price;
        $new = 1 / $request->price;
        $priceUpdatePercentage = abs($current - $new) / (($current + $new) / 2);

        if ($request->price < $priceComparison->price) {
            $priceUpdatePercentage *= -1;
        }

        $priceComparison->price = $request->price;
        $priceComparison->last_update = $priceUpdatePercentage;

        $priceComparison->save();

        event(new PriceComparisonUpdated($priceComparison));

        return response()->json([
            'message' => 'Update Successfully',
            'updatePercent' => $priceUpdatePercentage
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $priceComparison = PriceComparison::find($id);

        $priceComparison->delete();

        return response()->json([
            'message' => 'Destroy successfull'
        ]);
    }
}
