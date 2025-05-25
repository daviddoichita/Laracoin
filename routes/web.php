<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TransactionController;
use App\Models\Crypto;
use App\Models\Order;
use App\Models\PriceComparison;
use App\Models\PriceRecord;
use App\Models\Transaction;
use App\Models\UserBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'cryptos' => Crypto::with('mainPriceComparison', 'childPriceComparison')
                ->where('disabled', '=', false)
                ->where('symbol', '!=', 'EUR')->get()
        ]);
    })->name('dashboard');

    Route::get('/crypto/show/{id}/{interval}', function (int $id, string $invterval) {
        if ($id == Crypto::where('symbol', 'EUR')->get()->first()->id) {
            return redirect('dashboard');
        }

        $intervalMapping = [
            '5m' => 5,
            '15m' => 15,
            '30m' => 30,
            '1h' => 60,
        ];

        if (!isset($intervalMapping[$invterval])) {
            abort(400, 'Invalid interval');
        }

        $intervalMinutes = $intervalMapping[$invterval];
        $priceRecords = DB::select("
            WITH ranked AS (
                SELECT 
                    pr.*,
                    ROW_NUMBER() OVER (
                        PARTITION BY DATE_TRUNC('hour', pr.created_at) + 
                            INTERVAL '{$intervalMinutes} minutes' * FLOOR(DATE_PART('minute', pr.created_at) / {$intervalMinutes})
                        ORDER BY pr.created_at
                    ) AS rn
                FROM price_records pr
                JOIN price_comparison pc ON pr.pair_id = pc.id
                WHERE pc.main_id = ?
            )
            SELECT * FROM ranked WHERE rn = 1 ORDER BY created_at
        ", [$id]);

        // Convert to collection to maintain consistency with your code
        $priceRecords = collect($priceRecords);

        Log::info(json_encode($priceRecords));

        return Inertia::render('crypto', [
            'crypto' => Crypto::with(['mainPriceComparison', 'childPriceComparison'])
                ->where('disabled', '=', false)->find($id),
            'volume24h' => TransactionController::volume24h($id),
            // 'priceRecords' => PriceRecord::whereHas('pair', fn($query) => $query->where('main_id', $id))->get(),
            'priceRecords' => $priceRecords,
            'state' => request()->query('state'),
            'userBalance' => UserBalance::all()->where('user_id', '=', Auth::user()->id)->values()->toArray()
        ]);
    })->name('crypto.show');

    Route::get('/crypto/add', function () {
        return Inertia::render('add-crypto');
    })->name('crypto.add');

    Route::post('/crypto/store', [CryptoController::class, 'storeInertia'])->name('crypto.store');

    Route::get('/crypto/destroy/{id}', [CryptoController::class, 'destroyInertia'])->name('crypto.delete');

    Route::get('/transaction/new/{balance_id}', function (int $balance_id) {
        return Inertia::render('transaction')->with([
            'userBalance' => UserBalance::find($balance_id)
        ]);
    })->name('transaction.new');

    Route::post('/transactions/create', [TransactionController::class, 'store'])->name('transaction.store');

    Route::post('/cryptos/disable/{id}', [CryptoController::class, 'changeDisableState'])->name('crypto.disable');

    Route::get('/crypto/list', function () {
        return Inertia::render('list-cryptos', [
            'cryptos' => Crypto::where('symbol', '!=', 'EUR')->get()
        ]);
    })->name('crypto.list');

    Route::get('/my-balances', function () {
        return Inertia::render('balances', [
            'userBalances' => UserBalance::with('crypto')->where('user_id', '=', Auth::user()->id)->get(),
            'priceComparison' => PriceComparison::all()
        ]);
    })->name('my-balances');

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

    Route::get('/my-transactions', function () {
        $userBalances = UserBalance::with('crypto')->where('user_id', Auth::user()->id)->get();
        $userBalanceUuids = $userBalances->pluck('uuid')->toArray();

        $incomingTransactions = Transaction::with('crypto')
            ->whereIn('target_uuid', $userBalanceUuids)
            ->get();

        return Inertia::render('transaction-history', [
            'outgoingTransactions' => Transaction::with('crypto')->where('user_id', Auth::user()->id)->get(),
            'incomingTransactions' => $incomingTransactions,
            'userBalances' => $userBalances
        ]);
    })->name('my-transactions');

    Route::get('/admin/pulse', function () {
        return redirect('/pulse');
    })->name('pulse');

    Route::get('/admin/telescope', function () {
        return redirect('/telescope');
    })->name('telescope');

    Route::post('/user_balance/add-euro/{euro}', function ($euro) {
        $user = Auth::user();
        $euroBalance = UserBalance::all()->where('user_id', '=', $user->id)
            ->where('crypto.symbol', '=', 'EUR')
            ->firstOrFail();
        $euroBalance->balance = $euroBalance->balance + $euro;
        $euroBalance->save();

        return Inertia::location(route('my-balances'));
    })->name('add-euro');
});


require_once __DIR__ . '/settings.php';
require_once __DIR__ . '/auth.php';
