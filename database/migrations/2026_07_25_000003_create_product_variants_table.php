<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->unique()->nullable();
            $table->string('barcode')->nullable();
            $table->decimal('price', 12, 0)->nullable();
            $table->decimal('sale_price', 12, 0)->nullable();
            $table->integer('stock')->default(0);
            $table->string('weight')->nullable();
            $table->string('image')->nullable();
            $table->json('attributes')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};