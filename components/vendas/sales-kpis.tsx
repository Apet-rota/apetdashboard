import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react"
import { SalesStats } from "@/types/woocommerce"

interface SalesKPIsProps {
    stats: SalesStats | null;
    loading: boolean;
}

export function SalesKPIs({ stats, loading }: SalesKPIsProps) {
    if (loading || !stats) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Receita Total</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-apet-black">{formatCurrency(stats.totalRevenue)}</div>
                    <p className="text-xs text-gray-500">No período selecionado</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Pedidos</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-apet-red" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-apet-black">{stats.totalOrders}</div>
                    <p className="text-xs text-gray-500">Processados & Concluídos</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Ticket Médio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-apet-black">{formatCurrency(stats.averageTicket)}</div>
                    <p className="text-xs text-gray-500">Receita / Pedidos</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Itens Vendidos</CardTitle>
                    <Package className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-apet-black">{stats.totalItems}</div>
                    <p className="text-xs text-gray-500">Produtos/Cursos</p>
                </CardContent>
            </Card>
        </div>
    )
}
