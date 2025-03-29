<?php

namespace App\Http\Controllers;

use App\Models\PriceRecord;
use Illuminate\Http\Request;

class PriceRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $priceRecords = PriceRecord::with('pair')->get();

        return response()->json([
            'count' => sizeof($priceRecords),
            'data' => $priceRecords
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(PriceRecord::with('pair')->find($id));
    }

    public function showByPair(int $pairId)
    {
        return response()->json(
            PriceRecord::with('pair')->where('pair_id', '=', $pairId)->get()
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PriceRecord $priceRecord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PriceRecord $priceRecord)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PriceRecord $priceRecord)
    {
        //
    }
}
