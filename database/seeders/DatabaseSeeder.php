<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Crypto;
use App\Models\UserBalance;
use Hash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Str;

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
            [
                'name' => 'Thether',
                'symbol' => 'USDT',
                'icon' => 'coins',
                'max_supply' => -1,
                'circulating_supply' => 153000000000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'XRP',
                'symbol' => 'XRP',
                'icon' => 'coins',
                'max_supply' => 100000000000,
                'circulating_supply' => 58000000000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'BNB',
                'symbol' => 'BNB',
                'icon' => 'coins',
                'max_supply' => -1,
                'circulating_supply' => 140000000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Solana',
                'symbol' => 'SOL',
                'icon' => 'coins',
                'max_supply' => -1,
                'circulating_supply' => 522000000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Monero',
                'symbol' => 'XMR',
                'icon' => 'coins',
                'max_supply' => -1,
                'circulating_supply' => 18000000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Polkadot',
                'symbol' => 'DOT',
                'icon' => 'coins',
                'max_supply' => -1,
                'circulating_supply' => 1580000000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Pi',
                'symbol' => 'PI',
                'icon' => 'coins',
                'max_supply' => 100000000000,
                'circulating_supply' => 7000000000,
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
                'price' => 103889,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 3,
                'child_id' => 1,
                'pair_symbol' => 'ETH_EUR',
                'price' => 2505,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 4,
                'child_id' => 1,
                'pair_symbol' => 'USDT_EUR',
                'price' => 1,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 5,
                'child_id' => 1,
                'pair_symbol' => 'XRP_EUR',
                'price' => 2.15,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 6,
                'child_id' => 1,
                'pair_symbol' => 'BNB_EUR',
                'price' => 653,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 7,
                'child_id' => 1,
                'pair_symbol' => 'SOL_EUR',
                'price' => 152,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 8,
                'child_id' => 1,
                'pair_symbol' => 'XMR_EUR',
                'price' => 363,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 9,
                'child_id' => 1,
                'pair_symbol' => 'DOT_EUR',
                'price' => 4,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'main_id' => 10,
                'child_id' => 1,
                'pair_symbol' => 'PI_EUR',
                'price' => 0.6390,
                'last_update' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('price_comparison')->insert($priceComparisons);

        $priceRecords = [
            [
                'pair_id' => 1,
                'price' => 103889,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 2,
                'price' => 2505,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 3,
                'price' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 4,
                'price' => 2.15,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 5,
                'price' => 653,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 6,
                'price' => 152,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 7,
                'price' => 363,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 8,
                'price' => 4,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'pair_id' => 9,
                'price' => 0.390,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        ];

        DB::table('price_records')->insert($priceRecords);

        $users = [
            [
                'name' => 'admin',
                'surnames' => 'admin',
                'nif' => '12312323A',
                'phone_number' => 123123123,
                'admin' => true,
                'email' => 'admin@local.com',
                'password' => Hash::make('admin'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('users')->insert($users);

        $userBalances = [
            [
                'uuid' => Str::uuid(),
                'user_id' => 1,
                'crypto_id' => 1,
                'balance' => 1000,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'uuid' => Str::uuid(),
                'user_id' => 1,
                'crypto_id' => 2,
                'balance' => 80,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'uuid' => Str::uuid(),
                'user_id' => 1,
                'crypto_id' => 3,
                'balance' => 1000,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        ];

        DB::table('user_balances')->insert($userBalances);

        $cryptosSelect = Crypto::all()->where('symbol', '!=', 'EUR')->where('symbol', '!=', 'BTC')->where('symbol', '!=', 'ETH');
        foreach ($cryptosSelect as $cryptoSelect) {
            UserBalance::create([
                'uuid' => Str::uuid(),
                'user_id' => 1,
                'crypto_id' => $cryptoSelect->id,
                'balance' => 50,
            ]);
        }


        $orders = [
            [
                'user_id' => 1,
                'sold_id' => 1,
                'purchased_id' => 2,
                'order_type' => 'buy',
                'purchased_amount' => 80,
                'sold_amount' => 6240249.60999,
                'remaining_to_sell' => 0,
                'filled' => 80,
                'price' => 0.00001282,
                'status' => 'completed',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => 1,
                'sold_id' => 1,
                'purchased_id' => 3,
                'order_type' => 'buy',
                'purchased_amount' => 1000,
                'sold_amount' => 2000000,
                'remaining_to_sell' => 0,
                'filled' => 1000,
                'price' => 0.0005,
                'status' => 'completed',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('orders')->insert($orders);
    }
}
