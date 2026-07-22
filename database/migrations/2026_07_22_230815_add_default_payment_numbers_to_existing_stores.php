<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $stores = DB::table('stores')->whereNull('payment_number')->orWhere('payment_number', '')->get();
        $i = 1;
        foreach ($stores as $store) {
            DB::table('stores')->where('id', $store->id)->update([
                'payment_number' => '+250 788 100 ' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'payment_provider' => $i % 2 === 0 ? 'airtel' : 'mtn',
            ]);
            $i++;
        }

        DB::table('sellers')->whereNull('payment_number')->orWhere('payment_number', '')->update([
            'payment_number' => '+250 788 100 001',
            'payment_provider' => 'mtn',
        ]);
    }

    public function down(): void
    {
        DB::table('stores')->whereNotNull('payment_number')->update([
            'payment_number' => null,
            'payment_provider' => null,
        ]);
        DB::table('sellers')->whereNotNull('payment_number')->update([
            'payment_number' => null,
            'payment_provider' => null,
        ]);
    }
};
