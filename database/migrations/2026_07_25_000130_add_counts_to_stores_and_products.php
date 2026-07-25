<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('stores', 'followers_count')) {
            Schema::table('stores', fn(Blueprint $t) => $t->integer('followers_count')->default(0));
        }
        if (!Schema::hasColumn('stores', 'products_count')) {
            Schema::table('stores', fn(Blueprint $t) => $t->integer('products_count')->default(0));
        }
        if (!Schema::hasColumn('products', 'wishlists_count')) {
            Schema::table('products', fn(Blueprint $t) => $t->integer('wishlists_count')->default(0));
        }
        if (!Schema::hasColumn('products', 'orders_count')) {
            Schema::table('products', fn(Blueprint $t) => $t->integer('orders_count')->default(0));
        }
    }

    public function down(): void
    {
        $cols = ['followers_count', 'products_count'];
        if (Schema::hasColumn('stores', 'followers_count')) {
            Schema::table('stores', fn(Blueprint $t) => $t->dropColumn($cols));
        }
        if (Schema::hasColumn('products', 'wishlists_count')) {
            Schema::table('products', fn(Blueprint $t) => $t->dropColumn(['wishlists_count', 'orders_count']));
        }
    }
};
