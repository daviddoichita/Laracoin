<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Notifications::with('user')->get());
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
            'type' => 'required',
            'message' => 'required',
        ]);

        $notification = Notifications::create([
            'user_id' => $request->user_id,
            'type' => $request->type,
            'message' => $request->message,
            'read' => false
        ]);

        return response()->json([
            'created' => $notification
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(Notifications::with('user')->find($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $request->validate([
            'read' => 'required'
        ]);

        $notification = Notifications::all()->find($id);

        $notification->read = $request->read;

        $notification->save();

        return response()->json([
            'updated' => $notification
        ]);
    }
}
