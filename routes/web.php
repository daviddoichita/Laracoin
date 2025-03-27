<?php

use App\Models\Crypto;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'cryptos' => Crypto::with('mainPriceComparison', 'childPriceComparison')->get()
        ]);
    })->name('dashboard');
});

Route::get('/crypto/{id}', function (int $id) {
    return Inertia::render('crypto', [
        'crypto' => Crypto::with(['mainPriceComparison', 'childPriceComparison'])->find($id)
    ]);
})->name('crypto.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
