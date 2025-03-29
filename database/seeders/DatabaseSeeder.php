<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $now = now();

        $cryptos = [
            [
                'name' => 'Euro',
                'symbol' => 'EUR',
                'icon' => 'coins',
                'max_supply' => 0,
                'circulating_supply' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Bitcoin',
                'symbol' => 'BTC',
                'icon' => 'bitcoin',
                'max_supply' => 21000000,
                'circulating_supply' => 19840000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ethereum',
                'symbol' => 'ETH',
                'icon' => 'coins',
                'max_supply' => -1,
                'circulating_supply' => 120650000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('cryptos')->insert($cryptos);

        $priceComparisons = [
            [
                'main_id' => 2,
                'child_id' => 1,
                'pair_symbol' => 'BTC_EUR',
                'price' => 80000,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 3,
                'child_id' => 1,
                'pair_symbol' => 'ETH_EUR',
                'price' => 2000,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('price_comparison')->insert($priceComparisons);

        $users = [
            [
                'name' => 'admin',
                'surnames' => 'admin',
                'nif' => '12312323A',
                'phone_number' => 123123123,
                'email' => 'admin@local.com',
                'password' => Hash::make('admin'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('users')->insert($users);

        $userBalances = [
            [
                'user_id' => 1,
                'crypto_id' => 1,
                'balance' => 0,
                'locked_balance' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('user_balances')->insert($userBalances);

        $orders = [
            [
                'user_balance_id' => 1,
                'sold_id' => 1,
                'purchased_id' => 2,
                'order_type' => 'buy',
                'total_amount' => 80,
                'filled' => 80,
                'price' => 0.00001282,
                'status' => 'completed',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_balance_id' => 1,
                'sold_id' => 1,
                'purchased_id' => 3,
                'order_type' => 'buy',
                'total_amount' => 1000,
                'filled' => 1000,
                'price' => 0.0005,
                'status' => 'completed',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('orders')->insert($orders);

        $transactions = [
            [
                'user_id' => 1,
                'crypto_id' => 2,
                'order_id' => 1,
                'transaction_type' => 'fill',
                'amount' => 80,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => 1,
                'crypto_id' => 3,
                'order_id' => 2,
                'transaction_type' => 'fill',
                'amount' => 1000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];


        DB::table('transactions')->insert($transactions);
    }
}
