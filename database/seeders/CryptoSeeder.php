<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CryptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $names = ['Euro', 'Bitcoin', 'Ethereum'];
        $symbols = ['EUR', 'BTC', 'ETH'];

        $len = sizeof($names);
        for ($i = 0; $i < $len; $i++) {
            DB::table('cryptos')->insert([
                'name' => $names[$i],
                'symbol' => $symbols[$i]
            ]);
        }
    }
}
