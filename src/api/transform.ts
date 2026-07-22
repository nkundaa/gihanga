import type { Product, Store, Category, Review, Order, AdminStats, OrderStatus } from "../data/catalog";

interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  rating: number;
  reviews_count: number;
  tag: string | null;
  badge: string | null;
  sizes: string[] | null;
  colors: string[] | null;
  images: string[];
  featured: boolean;
  discount: string | null;
  store: ApiStore | null;
  category: ApiCategory | null;
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
    slug: p.slug,
    name: p.name,
    storeSlug: p.store?.slug ?? "",
    storeName: p.store?.name ?? "",
    category: p.category?.slug ?? "",
    price: Number(p.price) || 0,
    originalPrice: p.original_price != null ? Number(p.original_price) : undefined,
    discount: p.discount ?? undefined,
    rating: Number(p.rating) || 0,
    reviews: Number(p.reviews_count) || 0,
    tag: p.tag ?? undefined,
    badge: p.badge ?? undefined,
    description: p.description,
    sizes: p.sizes ?? undefined,
    colors: p.colors ?? undefined,
    images: p.images,
    featured: p.featured,
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
    lines: o.items.map((i) => ({
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
