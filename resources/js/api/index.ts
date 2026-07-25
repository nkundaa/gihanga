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
    updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
      client.put("/me", data),
    updatePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
      client.put("/me/password", data),
    forgotPassword: (data: { email: string }) =>
      client.post("/forgot-password", data),
    resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
      client.post("/reset-password", data),
  },

  messages: {
    conversations: async () => {
      const { data } = await client.get("/conversations");
      return { conversations: data.conversations ?? [] };
    },
    show: async (id: number) => {
      const { data } = await client.get(`/conversations/${id}`);
      return { conversation: data.conversation, messages: data.messages ?? [] };
    },
    create: async (msgData: { store_id: number; order_id?: number; subject?: string; content: string; attachments?: string[] }) => {
      const { data } = await client.post("/conversations", msgData);
      return { conversation: data.conversation, message: data.message };
    },
    reply: async (id: number, msgData: { content: string; attachments?: string[] }) => {
      const { data } = await client.post(`/conversations/${id}/reply`, msgData);
      return { message: data.message };
    },
    close: async (id: number) => {
      await client.put(`/conversations/${id}/close`);
    },
  },

  addresses: {
    list: async () => {
      const { data } = await client.get("/addresses");
      return { addresses: data.addresses ?? [] };
    },
    create: async (addressData: { label?: string; phone: string; address: string; city?: string; is_default?: boolean }) => {
      const { data } = await client.post("/addresses", addressData);
      return { address: data.address };
    },
    update: async (id: number, addressData: { label?: string; phone?: string; address?: string; city?: string; is_default?: boolean }) => {
      const { data } = await client.put(`/addresses/${id}`, addressData);
      return { address: data.address };
    },
    delete: async (id: number) => {
      await client.delete(`/addresses/${id}`);
    },
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

  dashboard: {
    stats: async () => {
      const { data } = await client.get("/dashboard");
      return { stats: data.stats, recentOrders: (data.recentOrders ?? []).map(transformOrder), user: data.user };
    },
    recommendations: async () => {
      const { data } = await client.get("/dashboard/recommendations");
      return { products: (data.products ?? []).map(transformProduct) };
    },
    stores: async () => {
      const { data } = await client.get("/dashboard/stores");
      return { stores: data.stores ?? [] };
    },
    activity: async () => {
      const { data } = await client.get("/dashboard/activity");
      return { activity: data.activity ?? [] };
    },
  },

  seller: {
    dashboard: async () => {
      const { data } = await client.get("/seller/dashboard");
      return { stats: data.stats, store: data.store, orderStatusCounts: data.orderStatusCounts, recentOrders: (data.recentOrders ?? []).map(transformOrder), products: (data.products ?? []).map(transformProduct), topProducts: (data.topProducts ?? []).map(transformProduct), lowStockProducts: (data.lowStockProducts ?? []).map(transformProduct), recentReviews: data.recentReviews ?? [] };
    },
    revenue: async (period?: string) => {
      const { data } = await client.get("/seller/dashboard/revenue", { params: { period } });
      return { revenue: data.revenue ?? [], period: data.period, total: data.total };
    },
    customers: async () => {
      const { data } = await client.get("/seller/dashboard/customers");
      return { customers: data.customers ?? [] };
    },
    wallet: async () => {
      const { data } = await client.get("/seller/dashboard/wallet");
      return { wallet: data.wallet };
    },
    export: async (type: string) => {
      const { data } = await client.post("/seller/dashboard/export", { type });
      return { data: data.data ?? [], type: data.type };
    },
    orders: async () => {
      const { data } = await client.get("/seller/orders");
      return { orders: (data.orders ?? []).map(transformOrder) };
    },
    products: async () => {
      const { data } = await client.get("/seller/products");
      return { products: (data.products ?? []).map(transformProduct) };
    },
    createProduct: async (productData: Record<string, unknown>) => {
      const { data } = await client.post("/seller/products", productData);
      return { product: transformProduct(data.product) };
    },
    getProduct: async (id: number) => {
      const { data } = await client.get(`/seller/products/${id}`);
      return { product: transformProduct(data.product) };
    },
    updateProduct: async (id: number, productData: Record<string, unknown>) => {
      const { data } = await client.put(`/seller/products/${id}`, productData);
      return { product: transformProduct(data.product) };
    },
    deleteProduct: async (id: number) => {
      await client.delete(`/seller/products/${id}`);
    },
    publishProduct: async (id: number) => {
      const { data } = await client.post(`/seller/products/${id}/publish`);
      return { product: data.product };
    },
    archiveProduct: async (id: number) => {
      const { data } = await client.post(`/seller/products/${id}/archive`);
      return { product: data.product };
    },
    duplicateProduct: async (id: number) => {
      const { data } = await client.post(`/seller/products/${id}/duplicate`);
      return { product: transformProduct(data.product) };
    },
    uploadImages: async (formData: FormData) => {
      const { data } = await client.post("/seller/products/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { images: data.images ?? [] };
    },
    brands: async () => {
      const { data } = await client.get("/seller/brands");
      return { brands: data.brands ?? [] };
    },
    createBrand: async (brandData: { name: string }) => {
      const { data } = await client.post("/seller/brands", brandData);
      return { brand: data.brand };
    },
    updateStore: async (storeData: Record<string, unknown>) => {
      const { data } = await client.put("/seller/store", storeData);
      return { store: data.store };
    },
    notifications: async () => {
      const { data } = await client.get("/seller/notifications");
      return { notifications: data.notifications ?? [] };
    },
    markNotificationRead: async (id: string) => {
      await client.put(`/seller/notifications/${id}/read`);
    },
    markAllNotificationsRead: async () => {
      await client.put("/seller/notifications/read-all");
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
