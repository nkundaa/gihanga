import type { Product, Store, Category, Review, Order, AdminStats, OrderStatus } from "../data/catalog";

interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  short_description: string | null;
  full_description: string | null;
  price: number;
  original_price: number | null;
  sale_price: number | null;
  sale_start: string | null;
  sale_end: string | null;
  rating: number;
  reviews_count: number;
  tag: string | null;
  badge: string | null;
  sizes: string[] | null;
  colors: string[] | null;
  images: string[];
  video_url: string | null;
  featured: boolean;
  discount: string | null;
  is_active: boolean;
  visibility: string;
  stock_quantity: number;
  low_stock_alert: number;
  allow_backorders: string;
  sku: string | null;
  barcode: string | null;
  tax_class: string;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  package_type: string | null;
  shipping_class: string | null;
  estimated_delivery: string | null;
  free_shipping: boolean;
  pickup_available: boolean;
  recommended: boolean;
  flash_sale: boolean;
  warranty: string | null;
  return_policy: string | null;
  min_order: number;
  max_order: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  canonical_url: string | null;
  og_image: string | null;
  store: ApiStore | null;
  category: ApiCategory | null;
  brand: { id: number; name: string; slug: string } | null;
  tags: Array<{ id: number; name: string; slug: string }> | null;
  variants: Array<{
    id: number;
    sku: string | null;
    barcode: string | null;
    price: number | null;
    sale_price: number | null;
    stock: number;
    weight: string | null;
    image: string | null;
    attributes: Record<string, string> | null;
    sort_order: number;
  }> | null;
  product_images: Array<{
    id: number;
    path: string;
    alt: string | null;
    is_thumbnail: boolean;
    sort_order: number;
  }> | null;
  created_at: string;
}

interface ApiStore {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  category: string;
  location: string;
  rating: number;
  reviews_count: number;
  products_count: number;
  verified: boolean;
  cover: string;
  avatar: string;
  accent: string;
  payment_number: string | null;
  payment_provider: string | null;
  hours: string;
  founded: string;
  is_active: boolean;
}

interface ApiCategory {
  id: number;
  slug: string;
  title: string;
  copy: string;
  count: number;
  image: string;
}

interface ApiReview {
  id: number;
  rating: number;
  text: string;
  size: string | null;
  color: string | null;
  created_at: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

interface ApiCartItem {
  id: number;
  product_id: number;
  size: string | null;
  color: string | null;
  quantity: number;
  product: ApiProduct;
}

interface ApiOrder {
  id: number;
  order_number: string;
  user_id: number;
  store_id: number;
  status: OrderStatus;
  subtotal: number;
  delivery: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  delivery_notes: string | null;
  payment_method: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  items: Array<{
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    size: string | null;
    color: string | null;
    image: string | null;
  }>;
  store: ApiStore | null;
  payment: {
    method: string;
    amount: number;
    status: string;
  } | null;
}

export function transformProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    storeSlug: p.store?.slug ?? "",
    storeName: p.store?.name ?? "",
    category: p.category?.slug ?? "",
    price: Number(p.price) || 0,
    originalPrice: p.original_price != null ? Number(p.original_price) : undefined,
    salePrice: p.sale_price != null ? Number(p.sale_price) : undefined,
    saleStart: p.sale_start ?? undefined,
    saleEnd: p.sale_end ?? undefined,
    discount: p.discount ?? undefined,
    rating: Number(p.rating) || 0,
    reviews: Number(p.reviews_count) || 0,
    tag: p.tag ?? undefined,
    badge: p.badge ?? undefined,
    description: p.description,
    shortDescription: p.short_description ?? undefined,
    fullDescription: p.full_description ?? undefined,
    sizes: p.sizes ?? undefined,
    colors: p.colors ?? undefined,
    images: p.images,
    videoUrl: p.video_url ?? undefined,
    featured: p.featured,
    isActive: p.is_active,
    visibility: p.visibility,
    stockQuantity: p.stock_quantity,
    lowStockAlert: p.low_stock_alert,
    allowBackorders: p.allow_backorders,
    sku: p.sku ?? undefined,
    barcode: p.barcode ?? undefined,
    taxClass: p.tax_class,
    weight: p.weight ?? undefined,
    length: p.length ?? undefined,
    width: p.width ?? undefined,
    height: p.height ?? undefined,
    packageType: p.package_type ?? undefined,
    shippingClass: p.shipping_class ?? undefined,
    estimatedDelivery: p.estimated_delivery ?? undefined,
    freeShipping: p.free_shipping,
    pickupAvailable: p.pickup_available,
    recommended: p.recommended,
    flashSale: p.flash_sale,
    warranty: p.warranty ?? undefined,
    returnPolicy: p.return_policy ?? undefined,
    minOrder: p.min_order,
    maxOrder: p.max_order ?? undefined,
    seoTitle: p.seo_title ?? undefined,
    seoDescription: p.seo_description ?? undefined,
    seoKeywords: p.seo_keywords ?? undefined,
    canonicalUrl: p.canonical_url ?? undefined,
    ogImage: p.og_image ?? undefined,
    brand: p.brand ?? undefined,
    tags: p.tags ?? undefined,
    variants: p.variants ?? undefined,
    productImages: p.product_images ?? undefined,
  };
}

export function transformStore(s: ApiStore): Store {
  return {
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    bio: s.bio,
    category: s.category,
    location: s.location,
    rating: Number(s.rating) || 0,
    reviews: Number(s.reviews_count) || 0,
    productCount: Number(s.products_count) || 0,
    verified: s.verified,
    cover: s.cover,
    avatar: s.avatar,
    accent: s.accent,
    paymentNumber: s.payment_number ?? undefined,
    paymentProvider: s.payment_provider ?? undefined,
    hours: s.hours,
    founded: s.founded,
  };
}

export function transformCategory(c: ApiCategory): Category {
  return {
    slug: c.slug,
    title: c.title,
    copy: c.copy,
    count: c.count,
    image: c.image,
  };
}

export function transformReview(r: ApiReview): Review {
  return {
    id: String(r.id),
    name: r.user.name,
    avatar: r.user.avatar ?? "/images/portraitOne.jpg",
    rating: r.rating,
    date: new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" }),
    text: r.text,
    size: r.size ?? undefined,
    color: r.color ?? undefined,
  };
}

export function transformCartItem(item: ApiCartItem) {
  return {
    id: item.id,
    product_id: item.product_id,
    product: transformProduct(item.product),
    size: item.size ?? undefined,
    color: item.color ?? undefined,
    quantity: item.quantity,
  };
}

export function transformOrder(o: ApiOrder): Order {
  return {
    id: o.order_number,
    customer: o.customer_name,
    phone: o.customer_phone,
    email: o.customer_email,
    address: o.customer_address,
    deliveryNotes: o.delivery_notes ?? undefined,
    lines: (o.items ?? []).map((i) => ({
      productSlug: "",
      productName: i.product_name,
      quantity: i.quantity,
      price: i.price,
      size: i.size ?? undefined,
      color: i.color ?? undefined,
      image: i.image ?? "",
    })),
    subtotal: o.subtotal,
    delivery: o.delivery,
    total: o.total,
    status: o.status,
    payment: o.payment_method as "mobile_money" | "card",
    createdAt: new Date(o.created_at).toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }),
    storeSlug: o.store?.slug ?? "",
    storeName: o.store?.name ?? "",
  };
}
