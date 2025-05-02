<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TransactionController;
use App\Models\Crypto;
use App\Models\Order;
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

    Route::get('/crypto/show/{id}', function (int $id) {
        return Inertia::render('crypto', [
            'crypto' => Crypto::with(['mainPriceComparison', 'childPriceComparison'])->where('disabled', '=', false)->find($id),
            'volume24h' => TransactionController::volume24h($id),
            'priceRecords' => PriceRecord::whereHas('pair', fn($query) => $query->where('main_id', $id))->get(),
            'state' => request()->query('state'),
            'userBalance' => UserBalance::all()->where('user_id', '=', Auth::user()->id)
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

    Route::get('/my-balances', function () {
        return Inertia::render('balances', [
            'userBalances' => UserBalance::with('crypto')->where('user_id', '=', Auth::user()->id)->get()
        ]);
    });

    Route::get('/my-orders', function () {
        return Inertia::render('orders', [
            'userOrders' => Order::where('user_id', '=', Auth::user()->id)->get(),
            'cryptos' => Crypto::all()
        ]);
    });

    Route::post('/new-order', [OrderController::class, 'storeInertia'])->name('new-order');
    Route::get('/cancel-order/{id}', [OrderController::class, 'cancelOrderInertia'])->name('cancel-order');

    Route::get('/metrics', function () {
        return Inertia::render('metrics');
    });

    Route::get('/admin/pulse', function () {
        return redirect('/pulse');
    })->name('pulse');

    Route::get('/admin/telescope', function () {
        return redirect('/telescope');
    })->name('telescope');
});


require_once __DIR__ . '/settings.php';
require_once __DIR__ . '/auth.php';
