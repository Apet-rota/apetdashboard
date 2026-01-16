import { KPIStats, VisitorData, CourseData } from "@/types"
import api from "@/lib/woocommerce"

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export async function getOverviewStats(): Promise<KPIStats[]> {
    try {
        // Fetch generic report data (last month)
        const { data: orders } = await api.get("reports/orders/totals")
        // Fetch products count
        const { data: products } = await api.get("reports/products/totals")

        // Total Sales
        const totalSales = Number(orders.find((o: any) => o.slug === "sales")?.total || 0)
        // Net Sales (Receita)
        const netSales = Number(orders.find((o: any) => o.slug === "net_sales")?.total || 0)
        // Orders Count
        const totalOrders = Number(orders.find((o: any) => o.slug === "orders")?.total || 0)

        return [
            { label: "Vendas Totais", value: totalOrders, change: 0, trend: "neutral" },
            { label: "Receita Líquida", value: formatCurrency(netSales), change: 0, trend: "up" },
            { label: "Ticket Médio", value: formatCurrency(totalOrders > 0 ? netSales / totalOrders : 0), change: 0, trend: "neutral" },
            // Fallback for visitors (Woo doesn't have it natively without extensions)
            { label: "Produtos Ativos", value: products.find((p: any) => p.slug === "publish")?.total || 0, change: 0, trend: "neutral" },
        ]
    } catch (error) {
        console.error("WooCommerce API Error:", error)
        return [
            { label: "Sem Conexão", value: "---", trend: "down" },
            { label: "Verifique", value: ".env", trend: "neutral" },
            { label: "Erro", value: "API", trend: "down" },
        ]
    }
}

export async function getTrafficData(): Promise<VisitorData[]> {
    // WooCommerce doesn't provide daily traffic via standard API.
    // We will use "Orders per day" as a proxy for activity for now, 
    // or return mock data if specific Google Analytics integration isn't set up.

    // Mocking traffic for now as per plan, since we need Google Analytics for real traffic.
    return [
        { date: "Seg", visitors: 1200, pageviews: 3800 },
        { date: "Ter", visitors: 1350, pageviews: 4200 },
        { date: "Qua", visitors: 1100, pageviews: 3500 },
        { date: "Qui", visitors: 1500, pageviews: 4800 },
        { date: "Sex", visitors: 1700, pageviews: 5200 },
        { date: "Sab", visitors: 900, pageviews: 2400 },
        { date: "Dom", visitors: 850, pageviews: 2100 },
    ]
}

export async function getTopCourses(): Promise<CourseData[]> {
    try {
        // Fetch top selling products
        const { data: products } = await api.get("products", {
            orderby: "popularity", // Sort by sales
            order: "desc",
            per_page: 6
        })

        return products.map((p: any) => ({
            id: p.id,
            name: p.name,
            sales: p.total_sales,
            revenue: Number(p.price || 0) * p.total_sales,
            students: p.total_sales // Proxy: 1 sale = 1 student
        }))

    } catch (error) {
        console.error("WooCommerce API Error:", error)
        return []
    }
}
