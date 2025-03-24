<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceComparisonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('price_comparison')->insert([
            'main_id' => '1',
            'child_id' => '2',
            'pair_symbol' => 'EUR_BTC',
            'price' => '60000'
        ]);

        DB::table('price_comparison')->insert([
            'main_id' => '1',
            'child_id' => '3',
            'pair_symbol' => 'EUR_ETH',
            'price' => '2000'
        ]);
    }
}
