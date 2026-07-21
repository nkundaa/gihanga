<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/setup', function () {
    $token = request('token');
    $expected = env('SETUP_TOKEN', 'gihanga-setup-2026');

    if ($token !== $expected) {
        abort(401, 'Invalid setup token');
    }

    $output = [];

    $exit = Artisan::call('migrate', ['--force' => true]);
    $output[] = 'migrate: ' . ($exit === 0 ? 'OK' : "FAIL (exit $exit)") . "\n" . Artisan::output();

    $exit = Artisan::call('db:seed', ['--force' => true]);
    $output[] = 'db:seed: ' . ($exit === 0 ? 'OK' : "FAIL (exit $exit)") . "\n" . Artisan::output();

    $exit = Artisan::call('storage:link', ['--force' => true]);
    $output[] = 'storage:link: ' . ($exit === 0 ? 'OK' : "FAIL (exit $exit)") . "\n" . Artisan::output();

    if (env('APP_ENV') === 'production') {
        $exit = Artisan::call('config:cache');
        $output[] = 'config:cache: ' . ($exit === 0 ? 'OK' : "FAIL (exit $exit)") . "\n" . Artisan::output();

        $exit = Artisan::call('route:cache');
        $output[] = 'route:cache: ' . ($exit === 0 ? 'OK' : "FAIL (exit $exit)") . "\n" . Artisan::output();

        $exit = Artisan::call('view:cache');
        $output[] = 'view:cache: ' . ($exit === 0 ? 'OK' : "FAIL (exit $exit)") . "\n" . Artisan::output();
    }

    return response()->json([
        'success' => true,
        'output' => $output,
    ]);
});

Route::get('/{any?}', function () {
    return view('layouts.app');
})->where('any', '.*');
