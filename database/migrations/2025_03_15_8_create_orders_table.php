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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_balance_id');
            $table->foreignId('sold_id');
            $table->foreignId('purchased_id');
            $table->enum('order_type', ['buy', 'sell']);
            $table->decimal('total_amount', 18, 8);
            $table->decimal('filled', 18, 8);
            $table->decimal('price', 18, 8);
            $table->enum('status', ['pending', 'completed', 'canceled']);
            $table->timestamps();

            $table->foreign('user_balance_id')->references('id')->on('user_balances')->cascadeOnDelete();
            $table->foreign('sold_id')->references('id')->on('cryptos')->cascadeOnDelete();
            $table->foreign('purchased_id')->references('id')->on('cryptos')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
