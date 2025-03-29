<?php

use App\Http\Controllers\TransactionController;
use App\Models\Crypto;
use App\Models\PriceRecord;
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
    $transactionController = new TransactionController();

    return Inertia::render('crypto', [
        'crypto' => Crypto::with(['mainPriceComparison', 'childPriceComparison'])->find($id),
        'volume24h' => $transactionController->volume24h($id),
        'priceRecords' => PriceRecord::whereHas('pair', fn($query) => $query->where('main_id', $id))->get()
    ]);
})->name('crypto.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
