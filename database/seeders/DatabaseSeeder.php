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
        $names = ['Euro', 'Bitcoin', 'Ethereum'];
        $symbols = ['EUR', 'BTC', 'ETH'];

        $len = count($names);
        for ($i = 0; $i < $len; $i++) {
            DB::table('cryptos')->insert([
                'name' => $names[$i],
                'symbol' => $symbols[$i],
            ]);
        }

        DB::table('price_comparison')->insert([
            'main_id' => '1',
            'child_id' => '2',
            'pair_symbol' => 'EUR_BTC',
            'price' => '0.00001282',
        ]);

        DB::table('price_comparison')->insert([
            'main_id' => '1',
            'child_id' => '3',
            'pair_symbol' => 'EUR_ETH',
            'price' => '0.0005',
        ]);

        DB::table('users')->insert([
            'name' => 'admin',
            'surnames' => 'admin',
            'nif' => '12312323A',
            'phone_number' => '123123123',
            'email' => 'admin@local.com',
            'password' => Hash::make('admin'),
        ]);
    }
}
