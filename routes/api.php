<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PriceComparisonController;
use App\Http\Controllers\PriceRecordController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserBalanceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth.basic')->group(function () {
	Route::get('/users', [UserController::class, 'index']);
	Route::get('/users/{id}', [UserController::class, 'show']);

	Route::get('/cryptos', [CryptoController::class, 'index']);
	Route::get('/cryptos/full', [CryptoController::class, 'indexFull']);
	Route::get('/cryptos/{id}', [CryptoController::class, 'show']);
	Route::get('/cryptos/{id}/full', [CryptoController::class, 'showFull']);
	Route::post('/cryptos', [CryptoController::class, 'store']);
	Route::put('/cryptos/{id}', [CryptoController::class, 'update']);
	Route::delete('/cryptos/{id}', [CryptoController::class, 'destroy']);

	Route::get('/user_balance', [UserBalanceController::class, 'index']);
	Route::post('/user_balance', [UserBalanceController::class, 'store']);

	Route::get('/notifications', [NotificationController::class, 'index']);
	Route::get('/notifications/{id}', [NotificationController::class, 'show']);
	Route::post('/notifications', [NotificationController::class, 'store']);

	Route::get('/price_comparison', [PriceComparisonController::class, 'index']);
	Route::get('/price_comparison/{id}', [PriceComparisonController::class, 'show']);
	Route::put('/price_comparison/{id}', [PriceComparisonController::class, 'update']);
	Route::post('/price_comparison', [PriceComparisonController::class, 'store']);
	Route::delete('/price_comparison/{id}', [PriceComparisonController::class, 'destroy']);

	Route::get('/price_record', [PriceRecordController::class, 'index']);
	Route::get('/price_record/{id}', [PriceRecordController::class, 'show']);
	Route::get('/price_record/pair/{id}', [PriceRecordController::class, 'showByPair']);

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
