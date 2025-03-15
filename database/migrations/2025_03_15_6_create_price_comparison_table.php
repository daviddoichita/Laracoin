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
        Schema::create('price_comparison', function (Blueprint $table) {
            $table->id();
            $table->foreignId('main_id');
            $table->foreignId('child_id');
            $table->string('pair_symbol', 20);
            $table->decimal('price', 18, 8);
            $table->timestamps();

            $table->foreign('main_id')->references('id')->on('cryptos')->cascadeOnDelete();
            $table->foreign('child_id')->references('id')->on('cryptos')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_comparison');
    }
};
