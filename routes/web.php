<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\TransactionController;
use App\Models\Crypto;
use App\Models\PriceRecord;
use App\Models\UserBalance;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'cryptos' => Crypto::with('mainPriceComparison', 'childPriceComparison')->where('disabled', '=', false)->where('symbol', '!=', 'EUR')->get()
        ]);
    })->name('dashboard');

    Route::get('/crypto/show/{id}', function (Request $request , int $id) {
        $transactionController = new TransactionController();

        return Inertia::render('crypto', [
            'crypto' => Crypto::with(['mainPriceComparison', 'childPriceComparison'])->where('disabled', '=', false)->find($id),
            'volume24h' => TransactionController::volume24h($id),
            'priceRecords' => PriceRecord::whereHas('pair', fn($query) => $query->where('main_id', $id))->get(),
            'state' => request()->query('state')
        ]);
    })->name('crypto.show');

    Route::get('/crypto/add', function () {
        return Inertia::render('add-crypto');
    })->name('crypto.add');
    Route::post('/crypto/add', [CryptoController::class, 'storeInertia']);

    Route::post('/cryptos/disable/{id}', [CryptoController::class, 'changeDisableState'])->name('crypto.disable');

    Route::get('/crypto/list', function () {
        return Inertia::render('list-cryptos', [
            'cryptos' => Crypto::where('symbol', '!=', 'EUR')->get()
        ]);
    })->name('crypto.list');

    Route::get('/my-balances', function() {
        return Inertia::render('balances', [
            'userBalances' => UserBalance::with('crypto')->where('user_id', '=',Auth::user()->id)->get()
        ]);
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
