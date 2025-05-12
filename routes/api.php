<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PriceComparisonController;
use App\Http\Controllers\PriceRecordController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserBalanceController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\Admin;
use Illuminate\Support\Facades\Route;

Route::middleware('auth.basic')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);

    Route::get('/user_balance', [UserBalanceController::class, 'index']);
    Route::post('/user_balance', [UserBalanceController::class, 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::post('/notifications', [NotificationController::class, 'store']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/full', [OrderController::class, 'indexFull']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders/{id}/full', [OrderController::class, 'showFull']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/full', [TransactionController::class, 'indexFull']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::get('/transactions/{id}/24h', [TransactionController::class, 'show24CryptoVolumeApi']);
    Route::get('/transactions/{id}/full', [TransactionController::class, 'showFull']);
    Route::post('/transactions', [TransactionController::class, 'store']);
});

Route::middleware('auth.basic')->group(function () {
    $priceComparisonIdRoute = '/price_comparison/{id}';
    Route::get('/price_comparison', [PriceComparisonController::class, 'index']);
    Route::get($priceComparisonIdRoute, [PriceComparisonController::class, 'show']);
    Route::put($priceComparisonIdRoute, [PriceComparisonController::class, 'update']);
    Route::post('/price_comparison', [PriceComparisonController::class, 'store']);
    Route::delete($priceComparisonIdRoute, [PriceComparisonController::class, 'destroy']);

    Route::get('/price_record', [PriceRecordController::class, 'index']);
    Route::get('/price_record/{id}', [PriceRecordController::class, 'show']);
    Route::get('/price_record/pair/{id}', [PriceRecordController::class, 'showByPair']);

    $cryptoIdRoute = '/crypto/{id}';
    Route::get('/cryptos', [CryptoController::class, 'index']);
    Route::get('/cryptos/full', [CryptoController::class, 'indexFull']);
    Route::get($cryptoIdRoute, [CryptoController::class, 'show']);
    Route::get('/cryptos/{id}/full', [CryptoController::class, 'showFull']);
    Route::post('/cryptos', [CryptoController::class, 'store']);
    Route::put($cryptoIdRoute, [CryptoController::class, 'update']);
    Route::delete($cryptoIdRoute, [CryptoController::class, 'destroy']);
});

Route::get('/price_comparison/pair/{symbol}', [PriceComparisonController::class, 'showByPair'])
    ->name('comparison_by_pair');
