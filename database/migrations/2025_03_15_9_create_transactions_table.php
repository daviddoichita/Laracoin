<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('crypto_id');
            $table->uuid('from_uuid');
            $table->uuid('target_uuid');
            $table->decimal('amount', 18, 8);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('crypto_id')->references('id')->on('cryptos')->cascadeOnDelete();
            $table->foreign('from_uuid')->references('uuid')->on('user_balances')->cascadeOnDelete();
            $table->foreign('target_uuid')->references('uuid')->on('user_balances')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
