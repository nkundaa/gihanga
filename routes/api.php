<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerDashboardController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\FeaturedItemController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationPreferenceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SellerDashboardController;
use App\Http\Controllers\Api\SellerProductController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\StoreFollowerController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,60');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink'])->middleware('throttle:5,60');
Route::post('/reset-password', [ForgotPasswordController::class, 'reset'])->middleware('throttle:5,60');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,60');

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);

Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{slug}', [StoreController::class, 'show']);

Route::get('/banners', [BannerController::class, 'index']);
Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/promotions/{promotion}', [PromotionController::class, 'show']);
Route::get('/featured', [FeaturedItemController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Addresses
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{address}', [AddressController::class, 'update']);
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{cart}', [CartController::class, 'update']);
    Route::delete('/cart/{cart}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:10,60');
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Reviews
    Route::post('/products/{slug}/reviews', [ReviewController::class, 'store']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy']);
    Route::get('/wishlist/{product}/check', [WishlistController::class, 'check']);

    // Store Followers
    Route::get('/followed-stores', [StoreFollowerController::class, 'index']);
    Route::post('/followed-stores', [StoreFollowerController::class, 'store']);
    Route::delete('/followed-stores/{store}', [StoreFollowerController::class, 'destroy']);
    Route::get('/followed-stores/{store}/check', [StoreFollowerController::class, 'check']);

    // Customer Dashboard
    Route::get('/dashboard', [CustomerDashboardController::class, 'stats']);
    Route::get('/dashboard/recommendations', [CustomerDashboardController::class, 'recommendations']);
    Route::get('/dashboard/stores', [CustomerDashboardController::class, 'favoriteStores']);
    Route::get('/dashboard/activity', [CustomerDashboardController::class, 'recentActivity']);

    // Messaging
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/conversations', [MessageController::class, 'store']);
    Route::get('/conversations/{conversation}', [MessageController::class, 'show']);
    Route::post('/conversations/{conversation}/reply', [MessageController::class, 'reply']);
    Route::put('/conversations/{conversation}/close', [MessageController::class, 'close']);

    // Reports
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllRead']);

    // Notification Preferences
    Route::get('/notification-preferences', [NotificationPreferenceController::class, 'show']);
    Route::put('/notification-preferences', [NotificationPreferenceController::class, 'update']);

    // Delivery Tracking
    Route::get('/orders/{order}/delivery', [DeliveryController::class, 'track']);

    // Activity Log
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    // Store settings (owner)
    Route::put('/stores/{store}/settings', [StoreController::class, 'update']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */

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

        // Banners
        Route::post('/banners', [BannerController::class, 'store']);
        Route::put('/banners/{banner}', [BannerController::class, 'update']);
        Route::delete('/banners/{banner}', [BannerController::class, 'destroy']);

        // Featured Items
        Route::post('/featured', [FeaturedItemController::class, 'store']);
        Route::delete('/featured/{featured_item}', [FeaturedItemController::class, 'destroy']);
        Route::put('/featured/reorder', [FeaturedItemController::class, 'reorder']);

        // Reports Management
        Route::get('/reports', [ReportController::class, 'index']);
        Route::put('/reports/{report}/resolve', [ReportController::class, 'resolve']);

        // Roles & Permissions
        Route::get('/roles', [PermissionController::class, 'roles']);
        Route::get('/permissions', [PermissionController::class, 'permissions']);
        Route::post('/users/{user}/assign-role', [PermissionController::class, 'assignRole']);
        Route::post('/users/{user}/remove-role', [PermissionController::class, 'removeRole']);
        Route::put('/roles/{role}/permissions', [PermissionController::class, 'syncPermissions']);

        // Activity Logs
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);

        // Delivery Management
        Route::put('/orders/{order}/delivery', [DeliveryController::class, 'update']);
        Route::post('/orders/{order}/delivery/location', [DeliveryController::class, 'updateLocation']);
    });

    /*
    |--------------------------------------------------------------------------
    | Seller Routes
    |--------------------------------------------------------------------------
    */

    Route::prefix('seller')->middleware('role:seller')->group(function () {
        Route::get('/dashboard', [SellerDashboardController::class, 'stats']);
        Route::get('/dashboard/revenue', [SellerDashboardController::class, 'revenue']);
        Route::get('/dashboard/customers', [SellerDashboardController::class, 'customers']);
        Route::get('/dashboard/wallet', [SellerDashboardController::class, 'wallet']);
        Route::post('/dashboard/export', [SellerDashboardController::class, 'export']);
        Route::get('/orders', [SellerDashboardController::class, 'orders']);

        // Brands
        Route::get('/brands', [SellerProductController::class, 'brands']);
        Route::post('/brands', [SellerProductController::class, 'storeBrand']);

        // Products (full CRUD)
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

        // Store Settings
        Route::put('/store', [SellerDashboardController::class, 'updateStore']);

        // Notifications
        Route::get('/notifications', [SellerDashboardController::class, 'notifications']);
        Route::put('/notifications/{id}/read', [SellerDashboardController::class, 'markNotificationRead']);
        Route::put('/notifications/read-all', [SellerDashboardController::class, 'markAllNotificationsRead']);

        // Promotions
        Route::post('/promotions', [PromotionController::class, 'store']);
        Route::put('/promotions/{promotion}', [PromotionController::class, 'update']);
        Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy']);

        // Seller Statistics
        Route::get('/statistics', [SellerDashboardController::class, 'statistics']);

        // Delivery for seller's orders
        Route::get('/orders/{order}/delivery', [DeliveryController::class, 'show']);
    });
});
