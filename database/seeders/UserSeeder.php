<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
