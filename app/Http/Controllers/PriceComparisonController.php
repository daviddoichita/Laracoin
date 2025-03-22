<?php

namespace App\Http\Controllers;

use App\Models\PriceComparison;
use Illuminate\Http\Request;

use function Pest\Laravel\json;

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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PriceComparison $priceComparison)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PriceComparison $priceComparison)
    {
        //
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
