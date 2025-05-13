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
            $table->foreignId('user_id');
            $table->foreignId('sold_id');
            $table->foreignId('purchased_id');
            $table->enum('order_type', ['buy', 'sell']);
            $table->decimal('sold_amount', 18, 8);
            $table->decimal('remaining_to_sell', 18, 8);
            $table->decimal('purchased_amount', 18, 8);
            $table->decimal('filled', 18, 8);
            $table->decimal('price', 18, 8);
            $table->enum('status', ['pending', 'completed', 'canceled']);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
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
