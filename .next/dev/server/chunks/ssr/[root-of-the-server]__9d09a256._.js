module.exports = [
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/woocommerce.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$woocommerce$2f$woocommerce$2d$rest$2d$api$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@woocommerce/woocommerce-rest-api/index.js [app-rsc] (ecmascript)");
;
// Initialize the WooCommerce API client
// Note: In Next.js, use environment variables to keep secrets safe.
// NEVER expose your Consumer Secret in client-side code (files without 'use server' logic that might leak).
// Initialize the WooCommerce API client
// Note: In Next.js, use environment variables to keep secrets safe.
// NEVER expose your Consumer Secret in client-side code (files without 'use server' logic that might leak).
const isConfigured = process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET;
const api = isConfigured ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$woocommerce$2f$woocommerce$2d$rest$2d$api$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]({
    url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://apet.org.br",
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    version: "wc/v3"
}) : {
    get: async ()=>{
        console.warn("WooCommerce API not configured. Using fallback.");
        return {
            data: []
        };
    }
};
const __TURBOPACK__default__export__ = api;
}),
"[project]/actions/woocommerce.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40cee040aeeed545e08bf449b1a81de16bc27117f3":"fetchOrderDetails","70b1adec21d6cc6a52c1a5d462d87b038b70bf4397":"fetchSalesData","7ea7124ec707e8fbaeada29b77a7f963eb1e7e0d91":"fetchOrders"},"",""] */ __turbopack_context__.s([
    "fetchOrderDetails",
    ()=>fetchOrderDetails,
    "fetchOrders",
    ()=>fetchOrders,
    "fetchSalesData",
    ()=>fetchSalesData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/woocommerce.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
// Helper to calculate date range
function getDateRange(period, customRange) {
    const now = new Date();
    // Default "before" is end of today
    const beforeDate = new Date();
    beforeDate.setHours(23, 59, 59, 999);
    const afterDate = new Date();
    switch(period){
        case 'custom':
            if (customRange) {
                // Ensure we respect the full day boundaries
                const from = new Date(customRange.from);
                from.setHours(0, 0, 0, 0);
                const to = new Date(customRange.to);
                to.setHours(23, 59, 59, 999);
                return {
                    after: from.toISOString(),
                    before: to.toISOString()
                };
            }
            // Fallback if custom selected but no range provided yet (should match "today" or recent)
            afterDate.setHours(0, 0, 0, 0);
            break;
        case '7d':
            afterDate.setDate(now.getDate() - 7);
            break;
        case '30d':
            afterDate.setDate(now.getDate() - 30);
            break;
        case '90d':
            afterDate.setDate(now.getDate() - 90);
            break;
        case 'today':
        default:
            afterDate.setHours(0, 0, 0, 0);
            break;
    }
    return {
        after: afterDate.toISOString(),
        before: beforeDate.toISOString()
    };
}
async function fetchSalesData(period, customRange, status = 'all') {
    const { after, before } = getDateRange(period, customRange);
    try {
        // Build status string
        // If status is 'all', we default to 'completed,processing,on-hold' so we don't count cancelled/failed in revenue/orders by default,
        // UNLESS the user explicitly wants "all" - but usually dashboard views exclude cancelled.
        // However, user requested detailed filter. 
        // Logic:
        // 1. If user selects specific status (e.g. 'pending'), fetch only that.
        // 2. If user selects 'all', fetch everything? Or just "valid" orders? 
        // User said: "Quando 'Todos' estiver selecionado... KPIs de Receita devem considerar apenas processing+completed".
        // Strategy: Filter at query level? No, if we filter query to only completed, we can't show 'pending' in table if requested.
        // But fetchSalesData is for KPIs/Charts primarily. 
        // Optimization: Let's fetch based on 'all' -> 'any' (fetch everything) and filter in memory for KPIs.
        const statusParam = status === 'all' ? 'any' : status;
        let allOrders = [];
        let currentPage = 1;
        let hasMore = true;
        while(hasMore){
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get("orders", {
                after,
                before,
                per_page: 100,
                page: currentPage,
                status: statusParam
            });
            const pageOrders = response.data;
            allOrders = allOrders.concat(pageOrders);
            if (pageOrders.length < 100) {
                hasMore = false;
            } else {
                currentPage++;
            }
        }
        const orders = allOrders;
        // Calculate Stats
        let totalRevenue = 0;
        let totalItems = 0;
        // Filter logic for Revenue/KPIs
        // If specific status selected, calculate revenue for THAT status (even if it is 'cancelled', technically revenue is 0 but sum(total) might be non-zero before refund).
        // If 'all' selected, ONLY count 'completed' and 'processing' for Revenue/Ticket.
        const validRevenueStatuses = [
            'completed',
            'processing'
        ];
        orders.forEach((order)=>{
            const isRevenueValid = status === 'all' ? validRevenueStatuses.includes(order.status) : true;
            if (isRevenueValid) {
                totalRevenue += parseFloat(order.total);
            }
            // Items: count all items in the filtered set
            order.line_items.forEach((item)=>{
                totalItems += item.quantity;
            });
        });
        // Total Orders: Just the count of what we fetched (which matches the status filter)
        const totalOrders = orders.length;
        // Ticket Average: Revenue / Count of Revenue-Generating Orders (or Total Orders?)
        // To be safe/accurate ticket: Revenue / Orders that contributed to revenue.
        const revenueOrdersCount = status === 'all' ? orders.filter((o)=>validRevenueStatuses.includes(o.status)).length : orders.length;
        const averageTicket = revenueOrdersCount > 0 ? totalRevenue / revenueOrdersCount : 0;
        // Group by day for charts
        const salesByDate = {};
        orders.forEach((order)=>{
            const date = order.date_created.split('T')[0];
            if (!salesByDate[date]) {
                salesByDate[date] = {
                    date,
                    revenue: 0,
                    orders: 0
                };
            }
            const isRevenueValid = status === 'all' ? validRevenueStatuses.includes(order.status) : true;
            if (isRevenueValid) {
                salesByDate[date].revenue += parseFloat(order.total);
            }
            salesByDate[date].orders += 1;
        });
        // Top Products
        const productsMap = {};
        orders.forEach((order)=>{
            const isRevenueValid = status === 'all' ? validRevenueStatuses.includes(order.status) : true;
            order.line_items.forEach((item)=>{
                if (!productsMap[item.product_id]) {
                    productsMap[item.product_id] = {
                        name: item.name,
                        revenue: 0,
                        units: 0
                    };
                }
                if (isRevenueValid) {
                    productsMap[item.product_id].revenue += parseFloat(item.total);
                }
                productsMap[item.product_id].units += item.quantity;
            });
        });
        const topProducts = Object.values(productsMap).sort((a, b)=>b.revenue - a.revenue) // Sort by revenue by default
        .slice(0, 10);
        return {
            stats: {
                totalRevenue,
                totalOrders,
                averageTicket,
                totalItems,
                totalRefunds: 0,
                newCustomers: 0
            },
            chartData: Object.values(salesByDate).sort((a, b)=>a.date.localeCompare(b.date)),
            topProducts
        };
    } catch (error) {
        console.error("WooCommerce Fetch Error:", error);
        throw new Error("Failed to fetch sales data");
    }
}
async function fetchOrders(page = 1, per_page = 10, status = 'any', search = '', period = '30d', customRange) {
    const { after, before } = getDateRange(period, customRange);
    try {
        const params = {
            page,
            per_page,
            search,
            after,
            before
        };
        if (status !== 'all' && status !== 'any') {
            params.status = status;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get("orders", params);
        return {
            orders: response.data,
            totalOrders: parseInt(response.headers['x-wp-total'] || '0', 10),
            totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10)
        };
    } catch (error) {
        console.error("WooCommerce Fetch Orders Error:", error);
        throw new Error("Failed to fetch orders");
    }
}
async function fetchOrderDetails(orderId) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(`orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("WooCommerce Fetch Order Details Error:", error);
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    fetchSalesData,
    fetchOrders,
    fetchOrderDetails
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchSalesData, "70b1adec21d6cc6a52c1a5d462d87b038b70bf4397", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchOrders, "7ea7124ec707e8fbaeada29b77a7f963eb1e7e0d91", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchOrderDetails, "40cee040aeeed545e08bf449b1a81de16bc27117f3", null);
}),
"[project]/.next-internal/server/app/vendas/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/woocommerce.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/woocommerce.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/vendas/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/woocommerce.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "70b1adec21d6cc6a52c1a5d462d87b038b70bf4397",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSalesData"],
    "7ea7124ec707e8fbaeada29b77a7f963eb1e7e0d91",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchOrders"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$vendas$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/vendas/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/woocommerce.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/woocommerce.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9d09a256._.js.map