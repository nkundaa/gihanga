<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('featured_items', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->unsignedBigInteger('item_id');
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('image')->nullable();
            $table->integer('position')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();
            $table->index(['type', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featured_items');
    }
};
