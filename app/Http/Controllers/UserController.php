<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(User::with(['userBalance.crypto', 'notifications'])->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(User::with(['userBalance', 'notifications'])->find($id));
    }
}
