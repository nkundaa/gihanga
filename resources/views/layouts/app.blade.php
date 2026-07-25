<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="GIHANGA is Rwanda's online marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali." />
    <meta property="og:title" content="GIHANGA | Rwanda's Online Marketplace" />
    <meta property="og:description" content="Shop from verified stores across Kigali with secure payments, live order tracking and fast delivery." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://gihanga.vrt.rw" />
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="sitemap" type="application/xml" href="{{ url('/sitemap.xml') }}">
    <link rel="icon" type="image/x-icon" href="https://vrt.rw/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="https://vrt.rw/favicon.svg" />
    <title>GIHANGA | Rwanda's Online Marketplace</title>
    <script type="application/ld+json">
    {
      "@@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Gihanga Marketplace",
      "url": "{{ url('/') }}",
      "description": "GIHANGA is Rwanda's online marketplace connecting customers with verified clothing, shoe, bag and accessory stores across Kigali."
    }
    </script>
    @viteReactRefresh
    @vite(['resources/js/index.css', 'resources/js/main.tsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
