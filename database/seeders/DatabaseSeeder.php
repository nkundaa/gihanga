<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\Seller;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gihanga.rw',
            'password' => Hash::make('password'),
            'phone' => '+250 788 000 000',
            'role' => 'admin',
        ]);

        $categories = [
            ['slug' => 'shoes', 'title' => 'Shoes', 'copy' => 'Statement sneakers, heels and leather classics.', 'count' => 412, 'image' => '/images/shoes.jpg'],
            ['slug' => 'clothes', 'title' => 'Clothes', 'copy' => 'Editorial fits from Kigali\'s sharpest boutiques.', 'count' => 928, 'image' => '/images/clothes.jpg'],
            ['slug' => 'accessories', 'title' => 'Accessories', 'copy' => 'Jewelry, eyewear and finishing touches.', 'count' => 364, 'image' => '/images/accessories.jpg'],
            ['slug' => 'bags', 'title' => 'Bags', 'copy' => 'Everyday totes and evening signatures.', 'count' => 246, 'image' => '/images/bags.jpg'],
            ['slug' => 'watches', 'title' => 'Watches', 'copy' => 'Minimal timepieces with polished detail.', 'count' => 118, 'image' => '/images/watches.jpg'],
            ['slug' => 'sportswear', 'title' => 'Sportswear', 'copy' => 'Performance pieces made for city movement.', 'count' => 203, 'image' => '/images/sportswear.jpg'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $storeData = [
            ['slug' => 'inzuki-atelier', 'name' => 'Inzuki Atelier', 'tagline' => 'Contemporary Rwandan fashion house', 'bio' => 'A Kigali atelier crafting contemporary womenswear that bridges East African heritage and global editorial taste. Each collection is cut in-house and released in limited drops.', 'category' => 'Clothes', 'location' => 'Kimihurura, Kigali', 'rating' => 4.9, 'reviews_count' => 312, 'product_count' => 64, 'verified' => true, 'cover' => '/images/boutiqueWindow.jpg', 'avatar' => '/images/atelierOne.jpg', 'accent' => 'berry', 'payment_number' => '+250 788 100 001', 'payment_provider' => 'mtn', 'hours' => 'Mon–Sat 9:00 – 19:00', 'founded' => '2018'],
            ['slug' => 'kigali-carry', 'name' => 'Kigali Carry', 'tagline' => 'Considered bags for the modern commute', 'bio' => 'A bag studio designing totes, mini bags and travel pieces with vegetable-tanned leathers sourced through verified regional partners.', 'category' => 'Bags', 'location' => 'Nyarutarama, Kigali', 'rating' => 4.8, 'reviews_count' => 214, 'product_count' => 38, 'verified' => true, 'cover' => '/images/bagsTote.jpg', 'avatar' => '/images/atelierTwo.jpg', 'accent' => 'mauve', 'payment_number' => '+250 788 100 002', 'payment_provider' => 'airtel', 'hours' => 'Mon–Fri 10:00 – 18:00', 'founded' => '2020'],
            ['slug' => 'milles-collines-shoes', 'name' => 'Milles Collines Shoes', 'tagline' => 'Hand-finished footwear, made slowly', 'bio' => 'A footwear atelier where every pair is hand-finished in Kigali. Loafers, heels and sneakers designed to age beautifully.', 'category' => 'Shoes', 'location' => 'Kacyiru, Kigali', 'rating' => 4.8, 'reviews_count' => 186, 'product_count' => 52, 'verified' => true, 'cover' => '/images/shoes.jpg', 'avatar' => '/images/atelierFour.jpg', 'accent' => 'berry', 'payment_number' => '+250 788 100 003', 'payment_provider' => 'mtn', 'hours' => 'Tue–Sat 10:00 – 18:30', 'founded' => '2016'],
            ['slug' => 'nyamirambo-gems', 'name' => 'Nyamirambo Gems', 'tagline' => 'Artisan jewelry from Kigali\'s old town', 'bio' => 'An accessories house working with local goldsmiths to create everyday jewelry with an editorial point of view.', 'category' => 'Accessories', 'location' => 'Nyamirambo, Kigali', 'rating' => 5.0, 'reviews_count' => 274, 'product_count' => 92, 'verified' => true, 'cover' => '/images/accessories.jpg', 'avatar' => '/images/atelierThree.jpg', 'accent' => 'mauve', 'payment_number' => '+250 788 100 004', 'payment_provider' => 'airtel', 'hours' => 'Mon–Sat 9:30 – 18:00', 'founded' => '2014'],
            ['slug' => 'isano-movement', 'name' => 'Isano Movement', 'tagline' => 'Performance sportswear, Kigali-born', 'bio' => 'Sportswear engineered for Kigali\'s hills, climate and nightlife. Technical fabrics, tailored silhouettes.', 'category' => 'Sportswear', 'location' => 'Remera, Kigali', 'rating' => 4.7, 'reviews_count' => 148, 'product_count' => 67, 'verified' => true, 'cover' => '/images/sportswear.jpg', 'avatar' => '/images/streetTwo.jpg', 'accent' => 'berry', 'payment_number' => '+250 788 100 005', 'payment_provider' => 'mtn', 'hours' => 'Daily 7:00 – 21:00', 'founded' => '2021'],
            ['slug' => 'maison-kivu', 'name' => 'Maison Kivu', 'tagline' => 'Slow fashion for the whole wardrobe', 'bio' => 'A multi-category boutique with curated ready-to-wear, accessories and home textiles from Kigali\'s independent makers.', 'category' => 'Multi', 'location' => 'Gikondo, Kigali', 'rating' => 4.9, 'reviews_count' => 402, 'product_count' => 128, 'verified' => true, 'cover' => '/images/boutiqueRack.jpg', 'avatar' => '/images/boutiqueKnit.jpg', 'accent' => 'mauve', 'payment_number' => '+250 788 100 006', 'payment_provider' => 'airtel', 'hours' => 'Mon–Sat 9:00 – 20:00', 'founded' => '2015'],
        ];

        $catIds = Category::pluck('id', 'slug');

        foreach ($storeData as $i => $sData) {
            $seller = Seller::create([
                'user_id' => User::factory()->create([
                    'name' => $sData['name'] . ' Seller',
                    'email' => str_replace('-', '.', $sData['slug']) . '@gihanga.rw',
                    'password' => Hash::make('password'),
                    'phone' => '+250 788 000 0' . ($i + 1),
                    'role' => 'seller',
                ])->id,
                'business_name' => $sData['name'],
                'phone' => '+250 788 000 0' . ($i + 1),
                'payment_number' => $sData['payment_number'],
                'payment_provider' => $sData['payment_provider'],
                'status' => 'verified',
            ]);

            $store = new Store();
            $store->forceFill([...$sData, 'seller_id' => $seller->id])->save();
        }

        $stores = Store::all();

        $productsData = [
            ['slug' => 'atelier-silk-co-ord', 'name' => 'Atelier Silk Co-ord', 'store_idx' => 0, 'category_slug' => 'clothes', 'price' => 68000, 'original_price' => 83000, 'tag' => 'Limited drop', 'rating' => 4.9, 'reviews_count' => 128, 'images' => ['/images/clothes.jpg', '/images/clothesAlt.jpg', '/images/streetTwo.jpg'], 'featured' => true],
            ['slug' => 'kigali-leather-loafer', 'name' => 'Kigali Leather Loafer', 'store_idx' => 2, 'category_slug' => 'shoes', 'price' => 92000, 'original_price' => 105000, 'tag' => 'Hand finished', 'rating' => 4.8, 'reviews_count' => 96, 'images' => ['/images/shoes.jpg', '/images/shoesHeel.jpg'], 'featured' => true],
            ['slug' => 'umurage-berry-hoops', 'name' => 'Umurage Berry Hoops', 'store_idx' => 3, 'category_slug' => 'accessories', 'price' => 36000, 'original_price' => null, 'tag' => 'New', 'rating' => 5.0, 'reviews_count' => 214, 'images' => ['/images/accessories.jpg'], 'featured' => true],
            ['slug' => 'nyarutarama-mini-tote', 'name' => 'Nyarutarama Mini Tote', 'store_idx' => 1, 'category_slug' => 'bags', 'price' => 74000, 'original_price' => 92000, 'tag' => 'Most wished', 'rating' => 4.9, 'reviews_count' => 184, 'images' => ['/images/bags.jpg', '/images/bagsStudio.jpg', '/images/bagsTote.jpg'], 'featured' => true],
            ['slug' => 'ink-red-heel', 'name' => 'Ink Red Heel', 'store_idx' => 2, 'category_slug' => 'shoes', 'price' => 86000, 'original_price' => null, 'tag' => 'Editor\'s pick', 'rating' => 4.7, 'reviews_count' => 74, 'images' => ['/images/shoesRed.jpg', '/images/shoesHeel.jpg'], 'featured' => false],
            ['slug' => 'rem-runner', 'name' => 'Rem Runner', 'store_idx' => 4, 'category_slug' => 'sportswear', 'price' => 54000, 'original_price' => 64000, 'tag' => 'City drop', 'rating' => 4.6, 'reviews_count' => 88, 'images' => ['/images/sportswear.jpg', '/images/street.jpg'], 'featured' => false],
            ['slug' => 'maison-cream-coat', 'name' => 'Maison Cream Coat', 'store_idx' => 5, 'category_slug' => 'clothes', 'price' => 128000, 'original_price' => 160000, 'tag' => 'Archive', 'rating' => 4.9, 'reviews_count' => 46, 'images' => ['/images/clothesAlt.jpg', '/images/streetTwo.jpg'], 'featured' => false],
            ['slug' => 'kivu-leather-tote', 'name' => 'Kivu Leather Tote', 'store_idx' => 5, 'category_slug' => 'bags', 'price' => 96000, 'original_price' => null, 'tag' => 'Signature', 'rating' => 4.8, 'reviews_count' => 152, 'images' => ['/images/bagsTote.jpg', '/images/bagsStudio.jpg'], 'featured' => false],
            ['slug' => 'berry-silk-slip', 'name' => 'Berry Silk Slip', 'store_idx' => 0, 'category_slug' => 'clothes', 'price' => 58000, 'original_price' => 72000, 'tag' => 'Capsule', 'rating' => 4.9, 'reviews_count' => 62, 'images' => ['/images/clothesStreet.jpg', '/images/streetTwo.jpg'], 'featured' => false],
            ['slug' => 'hill-tech-jacket', 'name' => 'Hill Tech Jacket', 'store_idx' => 4, 'category_slug' => 'sportswear', 'price' => 78000, 'original_price' => 98000, 'tag' => 'Technical', 'rating' => 4.7, 'reviews_count' => 94, 'images' => ['/images/street.jpg', '/images/sportswear.jpg'], 'featured' => false],
            ['slug' => 'gemma-signet', 'name' => 'Gemma Signet', 'store_idx' => 3, 'category_slug' => 'accessories', 'price' => 42000, 'original_price' => null, 'tag' => 'Heirloom', 'rating' => 5.0, 'reviews_count' => 128, 'images' => ['/images/accessories.jpg'], 'featured' => false],
            ['slug' => 'atelier-pleated-skirt', 'name' => 'Atelier Pleated Skirt', 'store_idx' => 0, 'category_slug' => 'clothes', 'price' => 46000, 'original_price' => 58000, 'tag' => 'Capsule', 'rating' => 4.8, 'reviews_count' => 58, 'images' => ['/images/clothesAlt.jpg', '/images/clothes.jpg'], 'featured' => false],
        ];

        $storeList = $stores->values();

        foreach ($productsData as $p) {
            $store = $storeList[$p['store_idx']];
            $product = new Product();
            $product->forceFill([
                'store_id' => $store->id,
                'category_id' => $catIds[$p['category_slug']],
                'slug' => $p['slug'],
                'name' => $p['name'],
                'description' => 'A considered piece from the GIHANGA network. Cut and finished by a verified Kigali atelier, with transparent pricing, tracked delivery and buyer protection built in.',
                'price' => $p['price'],
                'original_price' => $p['original_price'],
                'rating' => $p['rating'],
                'reviews_count' => $p['reviews_count'],
                'tag' => $p['tag'],
                'sizes' => in_array($p['category_slug'], ['shoes']) ? ['38', '39', '40', '41', '42', '43'] : (in_array($p['category_slug'], ['clothes']) ? ['XS', 'S', 'M', 'L', 'XL'] : null),
                'colors' => ['Berry', 'Mauve', 'Ink'],
                'images' => $p['images'],
                'featured' => $p['featured'],
            ])->save();
        }
    }
}
