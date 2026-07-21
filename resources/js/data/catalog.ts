import { api } from "../api";

export type Category = {
  id?: number;
  slug: string;
  title: string;
  copy: string;
  count: number;
  image: string;
};

export type Product = {
  id?: number;
  slug: string;
  name: string;
  storeSlug: string;
  storeName: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  tag?: string;
  badge?: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  images: string[];
  featured?: boolean;
};

export type Store = {
  id?: number;
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  productCount: number;
  verified: boolean;
  cover: string;
  avatar: string;
  accent: string;
  hours: string;
  founded: string;
};

export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  size?: string;
  color?: string;
};

export type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderLine = {
  productSlug: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image: string;
};

export type Order = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  payment: "mobile_money" | "card";
  createdAt: string;
  storeSlug: string;
  storeName: string;
};

export type AdminStats = {
  totalProducts: number;
  totalStores: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeStores: number;
  averageRating: number;
};

const IMAGES = {
  hero: "/images/hero.jpg",
  clothes: "/images/clothes.jpg",
  clothesAlt: "/images/clothesAlt.jpg",
  clothesStreet: "/images/clothesStreet.jpg",
  shoes: "/images/shoes.jpg",
  shoesRed: "/images/shoesRed.jpg",
  shoesHeel: "/images/shoesHeel.jpg",
  accessories: "/images/accessories.jpg",
  bags: "/images/bags.jpg",
  bagsTote: "/images/bagsTote.jpg",
  bagsStudio: "/images/bagsStudio.jpg",
  watches: "/images/watches.jpg",
  sportswear: "/images/sportswear.jpg",
  street: "/images/street.jpg",
  streetTwo: "/images/streetTwo.jpg",
  portraitOne: "/images/portraitOne.jpg",
  portraitTwo: "/images/portraitTwo.jpg",
  portraitThree: "/images/portraitThree.jpg",
  boutiqueWindow: "/images/boutiqueWindow.jpg",
  boutiqueColor: "/images/boutiqueColor.jpg",
  boutiqueRack: "/images/boutiqueRack.jpg",
  boutiqueKnit: "/images/boutiqueKnit.jpg",
  boutiqueMono: "/images/boutiqueMono.jpg",
  boutiqueMall: "/images/boutiqueMall.jpg",
  atelierOne: "/images/atelierOne.jpg",
  atelierTwo: "/images/atelierTwo.jpg",
  atelierThree: "/images/atelierThree.jpg",
  atelierFour: "/images/atelierFour.jpg",
};

export const heroImages = IMAGES;

export const apiFetch = {
  categories: async (): Promise<Category[]> => {
    try {
      const res = await api.categories.list();
      return res.data.categories;
    } catch { return []; }
  },

  products: async (params?: Record<string, string | number | undefined>): Promise<Product[]> => {
    try {
      const res = await api.products.list(params);
      const priceRange = res.data.priceRange;
      const products = res.data.products.map(mapProduct);
      return products;
    } catch { return []; }
  },

  product: async (slug: string): Promise<{ product: Product | null; storeProducts: Product[]; similar: Product[] }> => {
    try {
      const res = await api.products.show(slug);
      return {
        product: mapProduct(res.data.product),
        storeProducts: (res.data.storeProducts || []).map(mapProduct),
        similar: (res.data.similar || []).map(mapProduct),
      };
    } catch { return { product: null, storeProducts: [], similar: [] }; }
  },

  stores: async (): Promise<Store[]> => {
    try {
      const res = await api.stores.list();
      return res.data.stores.map(mapStore);
    } catch { return []; }
  },

  store: async (slug: string): Promise<{ store: Store | null; otherStores: Store[] }> => {
    try {
      const res = await api.stores.show(slug);
      return {
        store: mapStore(res.data.store),
        otherStores: (res.data.otherStores || []).map(mapStore),
      };
    } catch { return { store: null, otherStores: [] }; }
  },

  reviews: async (slug: string): Promise<Review[]> => {
    try {
      const res = await api.products.reviews(slug);
      return res.data.reviews.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        name: (r as { user?: { name?: string } }).user?.name || "Anonymous",
        avatar: "/images/portraitOne.jpg",
        rating: r.rating as number,
        date: new Date(r.created_at as string).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        text: (r.text as string) || "",
        size: r.size as string | undefined,
        color: r.color as string | undefined,
      }));
    } catch { return []; }
  },

  adminStats: async (): Promise<AdminStats> => {
    try {
      const res = await api.admin.stats();
      return res.data.stats;
    } catch {
      return { totalProducts: 0, totalStores: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0, activeStores: 0, averageRating: 0 };
    }
  },
};

function mapProduct(p: Record<string, unknown>): Product {
  return {
    id: p.id as number,
    slug: p.slug as string,
    name: p.name as string,
    storeSlug: (p.store as Record<string, unknown>)?.slug as string || "",
    storeName: (p.store as Record<string, unknown>)?.name as string || "",
    category: (p.category as Record<string, unknown>)?.slug as string || p.category_id as string,
    price: p.price as number,
    originalPrice: p.original_price as number | undefined,
    discount: p.original_price ? `-${Math.round((((p.original_price as number) - (p.price as number)) / (p.original_price as number)) * 100)}%` : undefined,
    rating: p.rating as number,
    reviews: p.reviews_count as number,
    tag: p.tag as string | undefined,
    badge: p.badge as string | undefined,
    description: p.description as string,
    sizes: p.sizes as string[] | undefined,
    colors: p.colors as string[] | undefined,
    images: p.images as string[],
    featured: p.featured as boolean | undefined,
  };
}

function mapStore(s: Record<string, unknown>): Store {
  return {
    id: s.id as number,
    slug: s.slug as string,
    name: s.name as string,
    tagline: s.tagline as string,
    bio: s.bio as string,
    category: s.category as string,
    location: s.location as string,
    rating: s.rating as number,
    reviews: s.reviews_count as number,
    productCount: s.product_count as number,
    verified: s.verified as boolean,
    cover: s.cover as string,
    avatar: s.avatar as string,
    accent: s.accent as string,
    hours: s.hours as string,
    founded: s.founded as string,
  };
}

export const formatRwf = (n: number) => `RWF ${n.toLocaleString("en-US")}`;

export const testimonials: Testimonial[] = [
  { name: "Aline Uwera", role: "Customer in Kimihurura", image: IMAGES.portraitOne, quote: "GIHANGA feels curated, calm and trustworthy. I found a dress from a real Kigali boutique and the experience felt premium from start to finish." },
  { name: "Mireille Kayitesi", role: "Stylist and shopper", image: IMAGES.portraitTwo, quote: "The product presentation makes local fashion feel global. It is elegant, fast and easy to understand without losing the boutique feeling." },
  { name: "Grace Ishimwe", role: "Accessories collector", image: IMAGES.portraitThree, quote: "I love that verified stores are central to the experience. It gives me confidence to discover new boutiques across Kigali." },
];

// Legacy mock data kept as fallback
export const categories: Category[] = [
  { slug: "shoes", title: "Shoes", copy: "Statement sneakers, heels and leather classics.", count: 412, image: IMAGES.shoes },
  { slug: "clothes", title: "Clothes", copy: "Editorial fits from Kigali's sharpest boutiques.", count: 928, image: IMAGES.clothes },
  { slug: "accessories", title: "Accessories", copy: "Jewelry, eyewear and finishing touches.", count: 364, image: IMAGES.accessories },
  { slug: "bags", title: "Bags", copy: "Everyday totes and evening signatures.", count: 246, image: IMAGES.bags },
  { slug: "watches", title: "Watches", copy: "Minimal timepieces with polished detail.", count: 118, image: IMAGES.watches },
  { slug: "sportswear", title: "Sportswear", copy: "Performance pieces made for city movement.", count: 203, image: IMAGES.sportswear },
];

export const stores: Store[] = [
  { slug: "inzuki-atelier", name: "Inzuki Atelier", tagline: "Contemporary Rwandan fashion house", bio: "A Kigali atelier crafting contemporary womenswear that bridges East African heritage and global editorial taste. Each collection is cut in-house and released in limited drops.", category: "Clothes", location: "Kimihurura, Kigali", rating: 4.9, reviews: 312, productCount: 64, verified: true, cover: IMAGES.boutiqueWindow, avatar: IMAGES.atelierOne, accent: "berry", hours: "Mon–Sat 9:00 – 19:00", founded: "2018" },
  { slug: "kigali-carry", name: "Kigali Carry", tagline: "Considered bags for the modern commute", bio: "A bag studio designing totes, mini bags and travel pieces with vegetable-tanned leathers sourced through verified regional partners.", category: "Bags", location: "Nyarutarama, Kigali", rating: 4.8, reviews: 214, productCount: 38, verified: true, cover: IMAGES.bagsTote, avatar: IMAGES.atelierTwo, accent: "mauve", hours: "Mon–Fri 10:00 – 18:00", founded: "2020" },
  { slug: "milles-collines-shoes", name: "Milles Collines Shoes", tagline: "Hand-finished footwear, made slowly", bio: "A footwear atelier where every pair is hand-finished in Kigali. Loafers, heels and sneakers designed to age beautifully.", category: "Shoes", location: "Kacyiru, Kigali", rating: 4.8, reviews: 186, productCount: 52, verified: true, cover: IMAGES.shoes, avatar: IMAGES.atelierFour, accent: "berry", hours: "Tue–Sat 10:00 – 18:30", founded: "2016" },
  { slug: "nyamirambo-gems", name: "Nyamirambo Gems", tagline: "Artisan jewelry from Kigali's old town", bio: "An accessories house working with local goldsmiths to create everyday jewelry with an editorial point of view.", category: "Accessories", location: "Nyamirambo, Kigali", rating: 5, reviews: 274, productCount: 92, verified: true, cover: IMAGES.accessories, avatar: IMAGES.atelierThree, accent: "mauve", hours: "Mon–Sat 9:30 – 18:00", founded: "2014" },
  { slug: "isano-movement", name: "Isano Movement", tagline: "Performance sportswear, Kigali-born", bio: "Sportswear engineered for Kigali's hills, climate and nightlife. Technical fabrics, tailored silhouettes.", category: "Sportswear", location: "Remera, Kigali", rating: 4.7, reviews: 148, productCount: 67, verified: true, cover: IMAGES.sportswear, avatar: IMAGES.streetTwo, accent: "berry", hours: "Daily 7:00 – 21:00", founded: "2021" },
  { slug: "maison-kivu", name: "Maison Kivu", tagline: "Slow fashion for the whole wardrobe", bio: "A multi-category boutique with curated ready-to-wear, accessories and home textiles from Kigali's independent makers.", category: "Multi", location: "Gikondo, Kigali", rating: 4.9, reviews: 402, productCount: 128, verified: true, cover: IMAGES.boutiqueRack, avatar: IMAGES.boutiqueKnit, accent: "mauve", hours: "Mon–Sat 9:00 – 20:00", founded: "2015" },
];

const mk = (slug: string, name: string, storeSlug: string, storeName: string, category: string, price: number, originalPrice: number | undefined, tag: string | undefined, rating: number, reviews: number, images: string[], extras: Partial<Product> = {}): Product => ({
  slug, name, storeSlug, storeName, category, price, originalPrice,
  discount: originalPrice ? `-${Math.round(((originalPrice - price) / originalPrice) * 100)}%` : undefined,
  rating, reviews, tag,
  description: "A considered piece from the GIHANGA network. Cut and finished by a verified Kigali atelier, with transparent pricing, tracked delivery and buyer protection built in.",
  sizes: category === "Shoes" ? ["38", "39", "40", "41", "42", "43"] : category === "Clothes" ? ["XS", "S", "M", "L", "XL"] : undefined,
  colors: ["Berry", "Mauve", "Ink"],
  images, ...extras,
});

export const products: Product[] = [
  mk("atelier-silk-co-ord", "Atelier Silk Co-ord", "inzuki-atelier", "Inzuki Atelier", "clothes", 68000, 83000, "Limited drop", 4.9, 128, [IMAGES.clothes, IMAGES.clothesAlt, IMAGES.streetTwo], { featured: true }),
  mk("kigali-leather-loafer", "Kigali Leather Loafer", "milles-collines-shoes", "Milles Collines Shoes", "shoes", 92000, 105000, "Hand finished", 4.8, 96, [IMAGES.shoes, IMAGES.shoesHeel], { featured: true }),
  mk("umurage-berry-hoops", "Umurage Berry Hoops", "nyamirambo-gems", "Nyamirambo Gems", "accessories", 36000, undefined, "New", 5, 214, [IMAGES.accessories], { featured: true }),
  mk("nyarutarama-mini-tote", "Nyarutarama Mini Tote", "kigali-carry", "Kigali Carry", "bags", 74000, 92000, "Most wished", 4.9, 184, [IMAGES.bags, IMAGES.bagsStudio, IMAGES.bagsTote], { featured: true }),
  mk("ink-red-heel", "Ink Red Heel", "milles-collines-shoes", "Milles Collines Shoes", "shoes", 86000, undefined, "Editor's pick", 4.7, 74, [IMAGES.shoesRed, IMAGES.shoesHeel]),
  mk("rem-runner", "Rem Runner", "isano-movement", "Isano Movement", "sportswear", 54000, 64000, "City drop", 4.6, 88, [IMAGES.sportswear, IMAGES.street]),
  mk("maison-cream-coat", "Maison Cream Coat", "maison-kivu", "Maison Kivu", "clothes", 128000, 160000, "Archive", 4.9, 46, [IMAGES.clothesAlt, IMAGES.streetTwo]),
  mk("kivu-leather-tote", "Kivu Leather Tote", "maison-kivu", "Maison Kivu", "bags", 96000, undefined, "Signature", 4.8, 152, [IMAGES.bagsTote, IMAGES.bagsStudio]),
  mk("berry-silk-slip", "Berry Silk Slip", "inzuki-atelier", "Inzuki Atelier", "clothes", 58000, 72000, "Capsule", 4.9, 62, [IMAGES.clothesStreet, IMAGES.streetTwo]),
  mk("hill-tech-jacket", "Hill Tech Jacket", "isano-movement", "Isano Movement", "sportswear", 78000, 98000, "Technical", 4.7, 94, [IMAGES.street, IMAGES.sportswear]),
  mk("gemma-signet", "Gemma Signet", "nyamirambo-gems", "Nyamirambo Gems", "accessories", 42000, undefined, "Heirloom", 5, 128, [IMAGES.accessories]),
  mk("atelier-pleated-skirt", "Atelier Pleated Skirt", "inzuki-atelier", "Inzuki Atelier", "clothes", 46000, 58000, "Capsule", 4.8, 58, [IMAGES.clothesAlt, IMAGES.clothes]),
];

export const reviews: Record<string, Review[]> = {
  "atelier-silk-co-ord": [
    { id: "r1", name: "Aline Uwera", avatar: IMAGES.portraitOne, rating: 5, date: "Mar 2026", text: "The silk is incredible — light, breathable and the cut is flattering. Perfect for evening events in Kigali.", size: "M", color: "Berry" },
    { id: "r2", name: "Mireille Kayitesi", avatar: IMAGES.portraitTwo, rating: 5, date: "Feb 2026", text: "Wore this to a wedding and received so many compliments. The stitching is immaculate.", size: "S", color: "Mauve" },
  ],
  "kigali-leather-loafer": [
    { id: "r3", name: "Grace Ishimwe", avatar: IMAGES.portraitThree, rating: 4, date: "Apr 2026", text: "Beautiful loafers, very comfortable after a short break-in. The leather quality is excellent.", size: "40", color: "Ink" },
    { id: "r4", name: "Jean Pierre", avatar: IMAGES.portraitOne, rating: 5, date: "Mar 2026", text: "My go-to pair for office and weekend. Hand-finished detail is noticeable.", size: "41", color: "Berry" },
  ],
  "umurage-berry-hoops": [
    { id: "r5", name: "Diane Mukamana", avatar: IMAGES.portraitTwo, rating: 5, date: "Apr 2026", text: "Delicate and bold at the same time. These hoops work with everything.", color: "Berry" },
  ],
  "nyarutarama-mini-tote": [
    { id: "r6", name: "Clarisse Uwimana", avatar: IMAGES.portraitThree, rating: 5, date: "Mar 2026", text: "The perfect size for daily essentials. Leather is softening beautifully.", size: "One", color: "Ink" },
    { id: "r7", name: "Aline Uwera", avatar: IMAGES.portraitOne, rating: 4, date: "Feb 2026", text: "Elegant and practical. Fits my laptop and still looks chic.", size: "One", color: "Mauve" },
  ],
  "ink-red-heel": [
    { id: "r8", name: "Sandrine Niyonzima", avatar: IMAGES.portraitTwo, rating: 5, date: "Apr 2026", text: "The most stunning red heel I have ever owned. True to size and surprisingly comfortable.", size: "38", color: "Berry" },
  ],
  "rem-runner": [
    { id: "r9", name: "Patrick Habimana", avatar: IMAGES.portraitThree, rating: 4, date: "Mar 2026", text: "Great runners for Kigali hills. Lightweight and breathable.", size: "42", color: "Ink" },
  ],
  "maison-cream-coat": [
    { id: "r10", name: "Mireille Kayitesi", avatar: IMAGES.portraitTwo, rating: 5, date: "Feb 2026", text: "A timeless coat. The structure is impeccable and the cream color is versatile.", size: "M", color: "Ink" },
  ],
  "kivu-leather-tote": [
    { id: "r11", name: "Grace Ishimwe", avatar: IMAGES.portraitThree, rating: 5, date: "Jan 2026", text: "My everyday carry. Spacious, elegant and the vegetable-tanned leather ages beautifully.", size: "One", color: "Berry" },
  ],
  "berry-silk-slip": [
    { id: "r12", name: "Aline Uwera", avatar: IMAGES.portraitOne, rating: 5, date: "Mar 2026", text: "Silk slip that feels luxurious against the skin. The berry color is gorgeous.", size: "S", color: "Berry" },
  ],
  "hill-tech-jacket": [
    { id: "r13", name: "Patrick Habimana", avatar: IMAGES.portraitThree, rating: 4, date: "Feb 2026", text: "Technical and stylish. Handles the rain well and looks great layered.", size: "L", color: "Ink" },
  ],
  "gemma-signet": [
    { id: "r14", name: "Diane Mukamana", avatar: IMAGES.portraitThree, rating: 5, date: "Apr 2026", text: "A signet ring with soul. Craftsmanship is evident in every detail.", color: "Berry" },
  ],
  "atelier-pleated-skirt": [
    { id: "r15", name: "Sandrine Niyonzima", avatar: IMAGES.portraitThree, rating: 5, date: "Mar 2026", text: "The pleats are perfectly pressed and the fit is elegant. Pairs with everything.", size: "M", color: "Mauve" },
  ],
};

export const mockOrders: Order[] = [];

export const getAdminStats = (): AdminStats => ({
  totalProducts: products.length,
  totalStores: stores.length,
  totalOrders: mockOrders.length,
  totalRevenue: mockOrders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0),
  pendingOrders: mockOrders.filter((o) => o.status === "pending" || o.status === "confirmed").length,
  activeStores: stores.filter((s) => s.verified).length,
  averageRating: stores.reduce((a, s) => a + s.rating, 0) / stores.length,
});

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getStore = (slug: string) => stores.find((s) => s.slug === slug);
export const productsByStore = (slug: string) => products.filter((p) => p.storeSlug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const getReviews = (slug: string) => reviews[slug] ?? [];
export const productPriceRange = () => {
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};
