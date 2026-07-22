<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SellerDashboardController;
use App\Http\Controllers\Api\StoreController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,60');
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
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{cart}', [CartController::class, 'update']);
    Route::delete('/cart/{cart}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:10,60');
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    Route::post('/products/{slug}/reviews', [ReviewController::class, 'store']);

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
        Route::get('/orders', [SellerDashboardController::class, 'orders']);
        Route::get('/products', [SellerDashboardController::class, 'storeProducts']);
        Route::post('/products', [SellerDashboardController::class, 'storeProduct']);
        Route::put('/products/{product}', [SellerDashboardController::class, 'updateProduct']);
        Route::delete('/products/{product}', [SellerDashboardController::class, 'destroyProduct']);
        Route::put('/store', [SellerDashboardController::class, 'updateStore']);
        Route::get('/notifications', [SellerDashboardController::class, 'notifications']);
        Route::put('/notifications/{id}/read', [SellerDashboardController::class, 'markNotificationRead']);
        Route::put('/notifications/read-all', [SellerDashboardController::class, 'markAllNotificationsRead']);
    });

    Route::put('/stores/{store}/settings', [StoreController::class, 'update']);
});
