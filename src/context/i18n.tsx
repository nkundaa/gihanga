import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Locale = "en" | "rw";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.categories": "Categories",
    "nav.stores": "Stores",
    "nav.becomeSeller": "Become a Seller",
    "nav.shopNow": "Shop Now",
    "nav.signIn": "Sign in",
    "nav.createAccount": "Create Account",
    "nav.dashboard": "Dashboard",
    "nav.orders": "Orders",
    "nav.messages": "Messages",
    "nav.profile": "Profile",
    "nav.sellerDashboard": "Seller Dashboard",
    "nav.panel": "Panel",
    "nav.signOut": "Sign out",
    "nav.search": "Search",
    "nav.wishlist": "Wishlist",
    "nav.cart": "Cart",
    "search.placeholder": "Search products, brands or stores...",
    "home.hero.title": "Buy and sell fashion in Kigali",
    "home.hero.subtitle": "The easiest marketplace in Rwanda. Browse, shop, or start selling in minutes.",
    "home.search": "Search products, stores and brands...",
    "home.categories": "Categories",
    "home.todaysPicks": "Today's Picks",
    "home.nearby": "Nearby Products",
    "home.topStores": "Top Stores",
    "home.verified": "Verified",
    "home.products": "products",
    "home.stores": "stores",
    "home.rating": "rating",
    "home.sellCta": "Own a store? Start selling today",
    "home.sellCtaSub": "Join Rwanda's easiest marketplace. Set up your store in minutes.",
    "home.startSelling": "Start Selling",
    "product.buyNow": "Buy Now",
    "product.addToCart": "Add to Cart",
    "product.delivery": "Delivery",
    "product.description": "Description",
    "product.reviews": "Reviews",
    "product.moreFromStore": "More from this store",
    "product.verified": "Verified",
    "product.inStock": "In stock",
    "product.outOfStock": "Out of stock",
    "checkout.title": "Checkout",
    "checkout.shipping": "Shipping",
    "checkout.payment": "Payment",
    "checkout.placeOrder": "Place Order",
    "checkout.fullName": "Full name",
    "checkout.phone": "Phone",
    "checkout.email": "Email",
    "checkout.address": "Delivery address",
    "checkout.mtn": "MTN Mobile Money",
    "checkout.airtel": "Airtel Money",
    "checkout.card": "Card Payment",
    "checkout.cod": "Cash on Delivery",
    "checkout.orderSummary": "Order Summary",
    "checkout.subtotal": "Subtotal",
    "checkout.delivery": "Delivery",
    "checkout.total": "Total",
    "checkout.free": "Free",
    "checkout.secure": "Secure checkout",
    "checkout.guest": "Continue as guest",
    "checkout.guestInfo": "Your order will be linked to your contact details.",
    "cart.title": "Your bag",
    "cart.empty": "Your bag is empty",
    "cart.browse": "Browse shop",
    "cart.checkout": "Checkout",
    "cart.subtotal": "Subtotal",
    "cart.delivery": "Delivery",
    "footer.tagline": "The easiest marketplace in Rwanda — connecting verified stores with customers across Kigali.",
    "footer.shop": "Shop",
    "footer.stores": "Stores",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.sell": "Sell",
  },
  rw: {
    "nav.home": "Ahabanza",
    "nav.shop": "Kugura",
    "nav.categories": "Ibyiciro",
    "nav.stores": "Amaduka",
    "nav.becomeSeller": "Kora ubucuruzi",
    "nav.shopNow": "Kugura Nonaha",
    "nav.signIn": "Injira",
    "nav.createAccount": "Fungura Konti",
    "nav.dashboard": "Ikibaho",
    "nav.orders": "Amaode",
    "nav.messages": "Ubutumwa",
    "nav.profile": "Umwirondoro",
    "nav.sellerDashboard": "Ikibaho cy'umucuruzi",
    "nav.panel": "Ikibaho",
    "nav.signOut": "Sohoka",
    "nav.search": "Shakisha",
    "nav.wishlist": "Ibyifuzo",
    "nav.cart": "Igikapu",
    "search.placeholder": "Shakisha ibicuruzwa, amaduka cyangwa imitako...",
    "home.hero.title": "Gura kandi ugurishe imyenda i Kigali",
    "home.hero.subtitle": "Isoko ryoroshye mu Rwanda. Shakisha, gura, cyangwa utangire kugurisha mu minota mike.",
    "home.search": "Shakisha ibicuruzwa, amaduka n'imitako...",
    "home.categories": "Ibyiciro",
    "home.todaysPicks": "Iby'uyu munsi",
    "home.nearby": "Ibicuruzwa byo hafi",
    "home.topStores": "Amaduka meza",
    "home.verified": "Byemejwe",
    "home.products": "ibicuruzwa",
    "home.stores": "amaduka",
    "home.rating": "amanota",
    "home.sellCta": "Ufite iduka? Tangira kugurisha",
    "home.sellCtaSub": "Injira mu isoko ryoroshye mu Rwanda. Shyiraho iduka ryawe mu minota mike.",
    "home.startSelling": "Tangira Kugurisha",
    "product.buyNow": "Gura Nonaha",
    "product.addToCart": "Shyira mu gikapu",
    "product.delivery": "Gutwara",
    "product.description": "Ibisobanuro",
    "product.reviews": "Ibitekerezo",
    "product.moreFromStore": "Ibindi biva muri uyu duka",
    "product.verified": "Byemejwe",
    "product.inStock": "Ihari",
    "product.outOfStock": "Nta kiboneka",
    "checkout.title": "Kwishyura",
    "checkout.shipping": "Gutwara",
    "checkout.payment": "Kwishyura",
    "checkout.placeOrder": "Komeza Ode",
    "checkout.fullName": "Amazina yose",
    "checkout.phone": "Telefoni",
    "checkout.email": "Imeyili",
    "checkout.address": "Aho wohererezwa",
    "checkout.mtn": "MTN Mobile Money",
    "checkout.airtel": "Airtel Money",
    "checkout.card": "Karita",
    "checkout.cod": "Kwishyura iyo ufite",
    "checkout.orderSummary": "Incamake y'ode",
    "checkout.subtotal": "Igiteranyo",
    "checkout.delivery": "Gutwara",
    "checkout.total": "Rusange",
    "checkout.free": "Ubuntu",
    "checkout.secure": "Kwishyura bitekanye",
    "checkout.guest": "Komeza nk'umugore",
    "checkout.guestInfo": "Ode yawe izahuzwa n'amakuru yawe.",
    "cart.title": "Igikapu cyawe",
    "cart.empty": "Igikapu cyawe nta kintu kirimo",
    "cart.browse": "Reba ibicuruzwa",
    "cart.checkout": "Kwishyura",
    "cart.subtotal": "Igiteranyo",
    "cart.delivery": "Gutwara",
    "footer.tagline": "Isoko ryoroshye mu Rwanda — rihuza amaduka yemejwe n'abaguzi muri Kigali.",
    "footer.shop": "Kugura",
    "footer.stores": "Amaduka",
    "footer.about": "Ibyerekeye",
    "footer.contact": "Twandikire",
    "footer.sell": "Kugurisha",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("gihanga_locale");
    return saved === "rw" ? "rw" : "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("gihanga_locale", l);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[locale][key] ?? key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
