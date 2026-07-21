<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="sitemap" type="application/xml" href="{{ url('/sitemap.xml') }}">
    <title>GIHANGA | Rwanda's Premium Fashion Marketplace</title>
    @viteReactRefresh
    @vite(['resources/js/index.css', 'resources/js/main.tsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
