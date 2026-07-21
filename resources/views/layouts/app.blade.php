<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="GIHANGA is Rwanda's premium fashion marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali.">
    <meta property="og:title" content="GIHANGA | Rwanda's Premium Fashion Marketplace">
    <meta property="og:description" content="Shop from verified fashion stores across Kigali with secure payments, live order tracking and fast delivery.">
    <meta property="og:type" content="website">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', "GIHANGA | Rwanda's Premium Fashion Marketplace")</title>
    @viteReactRefresh
    @vite(['resources/js/index.css', 'resources/js/main.tsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
