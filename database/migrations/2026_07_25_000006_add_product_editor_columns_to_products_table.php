<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->string('short_description', 300)->nullable()->after('description');
            $table->longText('full_description')->nullable()->after('short_description');
            $table->string('video_url')->nullable();
            $table->decimal('sale_price', 12, 0)->nullable();
            $table->timestamp('sale_start')->nullable();
            $table->timestamp('sale_end')->nullable();
            $table->string('tax_class')->default('taxable');
            $table->string('sku')->nullable()->unique();
            $table->string('barcode')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->integer('low_stock_alert')->default(5);
            $table->string('allow_backorders')->default('no');
            $table->decimal('weight', 10, 2)->nullable();
            $table->decimal('length', 10, 2)->nullable();
            $table->decimal('width', 10, 2)->nullable();
            $table->decimal('height', 10, 2)->nullable();
            $table->string('package_type')->nullable();
            $table->string('shipping_class')->nullable();
            $table->string('estimated_delivery')->nullable();
            $table->boolean('free_shipping')->default(false);
            $table->boolean('pickup_available')->default(false);
            $table->string('visibility')->default('draft');
            $table->timestamp('scheduled_at')->nullable();
            $table->boolean('recommended')->default(false);
            $table->boolean('flash_sale')->default(false);
            $table->text('warranty')->nullable();
            $table->text('return_policy')->nullable();
            $table->integer('min_order')->default(1);
            $table->integer('max_order')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->text('seo_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_image')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'brand_id', 'short_description', 'full_description', 'video_url',
                'sale_price', 'sale_start', 'sale_end', 'tax_class', 'sku', 'barcode',
                'stock_quantity', 'low_stock_alert', 'allow_backorders',
                'weight', 'length', 'width', 'height', 'package_type', 'shipping_class',
                'estimated_delivery', 'free_shipping', 'pickup_available',
                'visibility', 'scheduled_at', 'recommended', 'flash_sale',
                'warranty', 'return_policy', 'min_order', 'max_order',
                'seo_title', 'seo_description', 'seo_keywords', 'canonical_url', 'og_image',
            ]);
        });
    }
};