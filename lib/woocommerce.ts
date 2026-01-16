import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Initialize the WooCommerce API client
// Note: In Next.js, use environment variables to keep secrets safe.
// NEVER expose your Consumer Secret in client-side code (files without 'use server' logic that might leak).

// Initialize the WooCommerce API client
// Note: In Next.js, use environment variables to keep secrets safe.
// NEVER expose your Consumer Secret in client-side code (files without 'use server' logic that might leak).

const isConfigured = process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET;

const api = isConfigured
    ? new WooCommerceRestApi({
        url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://apet.org.br",
        consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
        consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
        version: "wc/v3",
    })
    : {
        get: async () => {
            console.warn("WooCommerce API not configured. Using fallback.");
            return { data: [] };
        }
    } as any;

export default api;
