import client from "./client";
import type { Review } from "../data/catalog";
import { transformProduct, transformStore, transformCategory, transformReview, transformCartItem, transformOrder } from "./transform";

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string; role?: string; store_name?: string; payment_number?: string; payment_provider?: string }) =>
      client.post("/register", data),
    login: (data: { email: string; password: string }) =>
      client.post("/login", data),
    logout: () => client.post("/logout"),
    me: () => client.get("/me"),
  },

  categories: {
    list: async () => {
      const { data } = await client.get("/categories");
      return { categories: (data.categories ?? []).map(transformCategory) };
    },
  },

  products: {
    list: async (params?: Record<string, string | number | undefined>) => {
      const { data } = await client.get("/products", { params });
      return {
        products: (data.products ?? []).map(transformProduct),
        priceRange: data.priceRange ?? { min: 0, max: 1000000 },
      };
    },
    show: async (slug: string) => {
      const { data } = await client.get(`/products/${slug}`);
      return {
        product: transformProduct(data.product),
        storeProducts: (data.storeProducts ?? []).map(transformProduct),
        similar: (data.similar ?? []).map(transformProduct),
      };
    },
    reviews: async (slug: string) => {
      const { data } = await client.get(`/products/${slug}/reviews`);
      return { reviews: (data.reviews ?? []).map(transformReview) };
    },
    addReview: async (slug: string, reviewData: { rating: number; text?: string; size?: string; color?: string }) => {
      const { data } = await client.post(`/products/${slug}/reviews`, reviewData);
      return { review: transformReview(data.review) };
    },
  },

  stores: {
    list: async () => {
      const { data } = await client.get("/stores");
      return { stores: (data.stores ?? []).map(transformStore) };
    },
    show: async (slug: string) => {
      const { data } = await client.get(`/stores/${slug}`);
      return {
        store: transformStore(data.store),
        products: (data.store?.products ?? []).map(transformProduct),
        otherStores: (data.otherStores ?? []).map(transformStore),
      };
    },
  },

  cart: {
    list: async () => {
      const { data } = await client.get("/cart");
      return { items: (data.items ?? []).map(transformCartItem) };
    },
    add: async (cartData: { product_id: number; size?: string; color?: string; quantity?: number }) => {
      const { data } = await client.post("/cart", cartData);
      return { item: transformCartItem(data.item) };
    },
    update: async (id: number, cartData: { quantity: number }) => {
      const { data } = await client.put(`/cart/${id}`, cartData);
      if (data.message) return null;
      return { item: transformCartItem(data.item) };
    },
    remove: async (id: number) => {
      await client.delete(`/cart/${id}`);
    },
    clear: async () => {
      await client.delete("/cart");
    },
  },

  orders: {
    list: async () => {
      const { data } = await client.get("/orders");
      return { orders: (data.orders ?? []).map(transformOrder) };
    },
    create: async (orderData: Record<string, unknown>) => {
      const { data } = await client.post("/orders", orderData);
      return { order: transformOrder(data.order) };
    },
    show: async (id: number) => {
      const { data } = await client.get(`/orders/${id}`);
      return { order: transformOrder(data.order) };
    },
  },

  admin: {
    stats: async () => {
      const { data } = await client.get("/admin/stats");
      return { stats: data.stats, recentOrders: (data.recentOrders ?? []).map(transformOrder) };
    },
    products: async () => {
      const { data } = await client.get("/admin/products");
      return { products: (data.products ?? []).map(transformProduct) };
    },
    stores: async () => {
      const { data } = await client.get("/admin/stores");
      return { stores: data.stores };
    },
    orders: async () => {
      const { data } = await client.get("/admin/orders");
      return { orders: (data.orders ?? []).map(transformOrder) };
    },
    users: async () => {
      const { data } = await client.get("/admin/users");
      return { users: data.users };
    },
    sellers: async () => {
      const { data } = await client.get("/admin/sellers");
      return { sellers: data.sellers };
    },
    updateOrderStatus: async (id: number, status: string) => {
      const { data } = await client.put(`/admin/orders/${id}/status`, { status });
      return { order: transformOrder(data.order) };
    },
  },
};
