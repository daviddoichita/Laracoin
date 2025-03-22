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
        return response()->json(PriceRecord::with('pair')->get());
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
