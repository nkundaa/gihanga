<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SellerDashboardController;
use App\Http\Controllers\Api\CustomerDashboardController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\SellerProductController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,60');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink'])->middleware('throttle:5,60');
Route::post('/reset-password', [ForgotPasswordController::class, 'reset'])->middleware('throttle:5,60');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,60');

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{slug}', [StoreController::class, 'show']);

Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{address}', [AddressController::class, 'update']);
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{cart}', [CartController::class, 'update']);
    Route::delete('/cart/{cart}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:10,60');
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    Route::get('/dashboard', [CustomerDashboardController::class, 'stats']);
    Route::get('/dashboard/recommendations', [CustomerDashboardController::class, 'recommendations']);
    Route::get('/dashboard/stores', [CustomerDashboardController::class, 'favoriteStores']);
    Route::get('/dashboard/activity', [CustomerDashboardController::class, 'recentActivity']);

    Route::post('/products/{slug}/reviews', [ReviewController::class, 'store']);

    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/conversations', [MessageController::class, 'store']);
    Route::get('/conversations/{conversation}', [MessageController::class, 'show']);
    Route::post('/conversations/{conversation}/reply', [MessageController::class, 'reply']);
    Route::put('/conversations/{conversation}/close', [MessageController::class, 'close']);

    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/products', [AdminController::class, 'products']);
        Route::get('/stores', [AdminController::class, 'stores']);
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/sellers', [AdminController::class, 'sellers']);
        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::put('/sellers/{seller}', [AdminController::class, 'updateSeller']);
        Route::put('/stores/{store}', [AdminController::class, 'updateStore']);
    });

    Route::prefix('seller')->middleware('role:seller')->group(function () {
        Route::get('/dashboard', [SellerDashboardController::class, 'stats']);
        Route::get('/dashboard/revenue', [SellerDashboardController::class, 'revenue']);
        Route::get('/dashboard/customers', [SellerDashboardController::class, 'customers']);
        Route::get('/dashboard/wallet', [SellerDashboardController::class, 'wallet']);
        Route::post('/dashboard/export', [SellerDashboardController::class, 'export']);
        Route::get('/orders', [SellerDashboardController::class, 'orders']);

        Route::get('/brands', [SellerProductController::class, 'brands']);
        Route::post('/brands', [SellerProductController::class, 'storeBrand']);

        Route::get('/products', [SellerProductController::class, 'index']);
        Route::post('/products', [SellerProductController::class, 'store']);
        Route::get('/products/{product}', [SellerProductController::class, 'show']);
        Route::put('/products/{product}', [SellerProductController::class, 'update']);
        Route::delete('/products/{product}', [SellerProductController::class, 'destroy']);
        Route::post('/products/upload-images', [SellerProductController::class, 'uploadImages']);
        Route::put('/products/reorder-images', [SellerProductController::class, 'reorderImages']);
        Route::put('/products/set-thumbnail', [SellerProductController::class, 'setThumbnail']);
        Route::post('/products/{product}/publish', [SellerProductController::class, 'publish']);
        Route::post('/products/{product}/archive', [SellerProductController::class, 'archive']);
        Route::post('/products/{product}/duplicate', [SellerProductController::class, 'duplicate']);

        Route::put('/store', [SellerDashboardController::class, 'updateStore']);
        Route::get('/notifications', [SellerDashboardController::class, 'notifications']);
        Route::put('/notifications/{id}/read', [SellerDashboardController::class, 'markNotificationRead']);
        Route::put('/notifications/read-all', [SellerDashboardController::class, 'markAllNotificationsRead']);
    });

    Route::put('/stores/{store}/settings', [StoreController::class, 'update']);
});
