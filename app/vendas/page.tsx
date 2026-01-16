"use client"

import { useEffect, useState } from "react"
import { useFilters } from "@/components/dashboard/filter-context"
import { fetchSalesData } from "@/actions/woocommerce"
import { SalesStats } from "@/types/woocommerce"
import { SalesKPIs } from "@/components/vendas/sales-kpis"
import { SalesCharts } from "@/components/vendas/sales-charts"
import { OrdersTable } from "@/components/vendas/orders-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw, Filter } from "lucide-react"

export default function VendasPage() {
    const { period, dateRange } = useFilters()
    const [status, setStatus] = useState("all")

    // Data State
    const [stats, setStats] = useState<SalesStats | null>(null)
    const [chartData, setChartData] = useState<{ date: string, revenue: number, orders: number }[]>([])
    const [topProducts, setTopProducts] = useState<{ name: string, revenue: number, units: number }[]>([])
    const [loading, setLoading] = useState(true)

    // Determine effective range for display
    const isCustom = period === 'custom'

    // Load KPIs and Charts
    async function loadData() {
        // If custom is selected but no range applied yet, don't fetch or fetch default?
        // Action handles fallback to 'today' inside, but better to wait.
        if (isCustom && !dateRange) return;

        setLoading(true)
        try {
            const data = await fetchSalesData(period, dateRange ? { from: dateRange.from!, to: dateRange.to! } : undefined, status)
            setStats(data.stats)
            setChartData(data.chartData)
            setTopProducts(data.topProducts)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, dateRange, status]) // Reload triggers

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-apet-black">Vendas (WooCommerce)</h1>
                    <p className="text-gray-500">
                        {isCustom && dateRange?.from && dateRange?.to ? (
                            <span>
                                Período: {dateRange.from.toLocaleDateString()} a {dateRange.to.toLocaleDateString()}
                            </span>
                        ) : (
                            "Receita, pedidos e desempenho de cursos."
                        )}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter (Global Page Scope) */}
                    <div className="flex items-center gap-2 bg-white border border-apet-border px-3 py-1 rounded-md shadow-sm">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[140px] border-none shadow-none h-8 p-0 text-xs font-semibold focus:ring-0">
                                <SelectValue placeholder="Todos os Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="completed">Concluído</SelectItem>
                                <SelectItem value="processing">Processando</SelectItem>
                                <SelectItem value="on-hold">Em espera</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                                <SelectItem value="refunded">Reembolsado</SelectItem>
                                <SelectItem value="failed">Falhou</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                    <span className="text-xs text-gray-400 hidden sm:inline-block">
                        {loading ? "..." : "Atualizado agora"}
                    </span>

                    <Button variant="ghost" size="icon" onClick={loadData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>

                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Exportar CSV
                    </Button>
                </div>
            </div>

            <SalesKPIs stats={stats} loading={loading} />

            <SalesCharts data={chartData} loading={loading} />

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <OrdersTable statusFilter={status} dateRange={dateRange ? { from: dateRange.from!, to: dateRange.to! } : undefined} period={period} />
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <h3 className="font-bold text-lg mb-4 text-apet-black">Top Cursos ({status === 'all' ? 'Receita' : status})</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />)}
                                </div>
                            ) : topProducts.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">Sem vendas no período/filtro.</p>
                            ) : (
                                topProducts.map((prod, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 hover:bg-gray-50 p-1 rounded transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-apet-red/10 text-xs font-bold text-apet-red">
                                                #{i + 1}
                                            </div>
                                            <div className="truncate">
                                                <p className="truncate text-sm font-medium text-gray-900" title={prod.name}>{prod.name}</p>
                                                <p className="text-[10px] text-gray-500">{prod.units} vendidos</p>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-xs whitespace-nowrap">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.revenue)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
