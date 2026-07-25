<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->integer('views')->default(0);
            $table->integer('visitors')->default(0);
            $table->integer('orders')->default(0);
            $table->integer('products_sold')->default(0);
            $table->decimal('revenue', 12, 2)->default(0);
            $table->decimal('commission', 12, 2)->default(0);
            $table->decimal('payout', 12, 2)->default(0);
            $table->timestamps();
            $table->unique(['store_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_statistics');
    }
};
