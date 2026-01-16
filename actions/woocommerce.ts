"use server";

import api from "@/lib/woocommerce";
import { WooOrder, SalesStats } from "@/types/woocommerce";

// Helper to calculate date range
function getDateRange(period: string, customRange?: { from: Date, to: Date }): { after: string; before: string } {
    const now = new Date();
    // Default "before" is end of today
    const beforeDate = new Date();
    beforeDate.setHours(23, 59, 59, 999);

    const afterDate = new Date();

    switch (period) {
        case 'custom':
            if (customRange) {
                // Ensure we respect the full day boundaries
                const from = new Date(customRange.from);
                from.setHours(0, 0, 0, 0);

                const to = new Date(customRange.to);
                to.setHours(23, 59, 59, 999);

                return { after: from.toISOString(), before: to.toISOString() };
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

    return { after: afterDate.toISOString(), before: beforeDate.toISOString() };
}

export async function fetchSalesData(period: string, customRange?: { from: Date, to: Date }, status: string = 'all') {
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

        const response = await api.get("orders", {
            after,
            before,
            per_page: 100,
            status: statusParam
        });

        const orders: WooOrder[] = response.data;

        // Calculate Stats
        let totalRevenue = 0;
        let totalItems = 0;

        // Filter logic for Revenue/KPIs
        // If specific status selected, calculate revenue for THAT status (even if it is 'cancelled', technically revenue is 0 but sum(total) might be non-zero before refund).
        // If 'all' selected, ONLY count 'completed' and 'processing' for Revenue/Ticket.

        const validRevenueStatuses = ['completed', 'processing'];

        orders.forEach(order => {
            const isRevenueValid = status === 'all' ? validRevenueStatuses.includes(order.status) : true;

            if (isRevenueValid) {
                totalRevenue += parseFloat(order.total);
            }

            // Items: count all items in the filtered set
            order.line_items.forEach(item => {
                totalItems += item.quantity;
            });
        });

        // Total Orders: Just the count of what we fetched (which matches the status filter)
        const totalOrders = orders.length;

        // Ticket Average: Revenue / Count of Revenue-Generating Orders (or Total Orders?)
        // To be safe/accurate ticket: Revenue / Orders that contributed to revenue.
        const revenueOrdersCount = status === 'all'
            ? orders.filter(o => validRevenueStatuses.includes(o.status)).length
            : orders.length;

        const averageTicket = revenueOrdersCount > 0 ? totalRevenue / revenueOrdersCount : 0;

        // Group by day for charts
        const salesByDate: Record<string, { date: string, revenue: number, orders: number }> = {};

        orders.forEach(order => {
            const date = order.date_created.split('T')[0];
            if (!salesByDate[date]) {
                salesByDate[date] = { date, revenue: 0, orders: 0 };
            }

            const isRevenueValid = status === 'all' ? validRevenueStatuses.includes(order.status) : true;
            if (isRevenueValid) {
                salesByDate[date].revenue += parseFloat(order.total);
            }

            salesByDate[date].orders += 1;
        });

        // Top Products
        const productsMap: Record<number, { name: string, revenue: number, units: number }> = {};

        orders.forEach(order => {
            const isRevenueValid = status === 'all' ? validRevenueStatuses.includes(order.status) : true;

            order.line_items.forEach(item => {
                if (!productsMap[item.product_id]) {
                    productsMap[item.product_id] = { name: item.name, revenue: 0, units: 0 };
                }
                if (isRevenueValid) {
                    productsMap[item.product_id].revenue += parseFloat(item.total);
                }
                productsMap[item.product_id].units += item.quantity;
            });
        });

        const topProducts = Object.values(productsMap)
            .sort((a, b) => b.revenue - a.revenue) // Sort by revenue by default
            .slice(0, 10);

        return {
            stats: {
                totalRevenue,
                totalOrders,
                averageTicket,
                totalItems,
                totalRefunds: 0,
                newCustomers: 0
            } as SalesStats,
            chartData: Object.values(salesByDate).sort((a, b) => a.date.localeCompare(b.date)),
            topProducts
        };

    } catch (error) {
        console.error("WooCommerce Fetch Error:", error);
        throw new Error("Failed to fetch sales data");
    }
}

export async function fetchOrders(
    page: number = 1,
    per_page: number = 10,
    status: string = 'any',
    search: string = '',
    period: string = '30d',
    customRange?: { from: Date, to: Date }
) {
    const { after, before } = getDateRange(period, customRange);

    try {
        const params: Record<string, string | number> = {
            page,
            per_page,
            search,
            after,
            before
        };

        if (status !== 'all' && status !== 'any') {
            params.status = status;
        }

        const response = await api.get("orders", params);

        return {
            orders: response.data as WooOrder[],
            totalOrders: parseInt(response.headers['x-wp-total'] || '0', 10),
            totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10)
        };
    } catch (error) {
        console.error("WooCommerce Fetch Orders Error:", error);
        throw new Error("Failed to fetch orders");
    }
}

export async function fetchOrderDetails(orderId: number) {
    try {
        const response = await api.get(`orders/${orderId}`);
        return response.data as WooOrder;
    } catch (error) {
        console.error("WooCommerce Fetch Order Details Error:", error);
        return null;
    }
}
