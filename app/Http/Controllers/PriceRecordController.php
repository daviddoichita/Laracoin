<?php

namespace App\Http\Controllers;

use App\Models\PriceRecord;

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
}
