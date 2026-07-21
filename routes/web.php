<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', function () {
    $url = 'https://gihanga.vrt.rw';

    $pages = [
        ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
        ['loc' => '/home', 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => '/shop', 'priority' => '0.8', 'changefreq' => 'daily'],
        ['loc' => '/stores', 'priority' => '0.8', 'changefreq' => 'weekly'],
        ['loc' => '/about', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['loc' => '/contact', 'priority' => '0.5', 'changefreq' => 'monthly'],
        ['loc' => '/sell', 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['loc' => '/sell-apply', 'priority' => '0.5', 'changefreq' => 'monthly'],
        ['loc' => '/plans', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['loc' => '/why-gihanga', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['loc' => '/editorial', 'priority' => '0.5', 'changefreq' => 'weekly'],
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($pages as $page) {
        $xml .= '  <url>' . "\n";
        $xml .= '    <loc>' . $url . $page['loc'] . '</loc>' . "\n";
        $xml .= '    <changefreq>' . $page['changefreq'] . '</changefreq>' . "\n";
        $xml .= '    <priority>' . $page['priority'] . '</priority>' . "\n";
        $xml .= '  </url>' . "\n";
    }

    $xml .= '</urlset>';

    return Response::make($xml, 200, ['Content-Type' => 'application/xml']);
});

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
