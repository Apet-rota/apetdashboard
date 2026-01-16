"use client"

import { useState, useEffect } from "react"
import { WooOrder } from "@/types/woocommerce"
import { fetchOrders } from "@/actions/woocommerce"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, Eye, ExternalLink } from "lucide-react"

// Simple Drawer for Order Details
// In a full app, this might be a Shadcn Sheet or Dialog.
// Using a fixed overlay custom drawer for simplicity and dependency avoidance if not installed.
function OrderDrawer({ order, onClose }: { order: WooOrder, onClose: () => void }) {
    if (!order) return null;

    const formatCurrency = (val: string | number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity" onClick={onClose}>
            <div className="h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-apet-black">Pedido #{order.number}</h2>
                        <span className="text-sm text-gray-500">
                            {new Date(order.date_created).toLocaleDateString()} às {new Date(order.date_created).toLocaleTimeString()}
                        </span>
                    </div>
                    <Button variant="ghost" onClick={onClose}>X</Button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className={order.status === 'completed' ? 'bg-green-600' : ''}>
                            {order.status}
                        </Badge>
                        <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
                        <div className="text-sm text-gray-600">
                            <p className="font-medium text-gray-900">{order.billing.first_name} {order.billing.last_name}</p>
                            <p>{order.billing.email}</p>
                            <p>{order.billing.phone}</p>
                            <p className="mt-1">
                                {order.billing.city} - {order.billing.state}
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Itens ({order.line_items.length})</h3>
                        <ul className="space-y-3">
                            {order.line_items.map(item => (
                                <li key={item.id} className="flex justify-between text-sm">
                                    <div className="flex-1 pr-2">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-500">Qtd: {item.quantity}</div>
                                    </div>
                                    <div className="font-semibold">{formatCurrency(item.total)}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t pt-4">
                        <Button className="w-full flex items-center justify-center gap-2" variant="outline" asChild>
                            <a href={`https://apet.org.br/wp-admin/post.php?post=${order.id}&action=edit`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Ver no WooCommerce Admin
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export interface OrdersTableProps {
    statusFilter: string;
    period: string;
    dateRange?: { from: Date, to: Date };
}

export function OrdersTable({ statusFilter, period, dateRange }: OrdersTableProps) {
    const [orders, setOrders] = useState<WooOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    // Detailed Order State
    const [selectedOrder, setSelectedOrder] = useState<WooOrder | null>(null);

    // Main data loading function
    async function loadOrders() {
        setLoading(true);
        try {
            const data = await fetchOrders(page, 10, statusFilter, search, period, dateRange);
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Effect: Refetch when filters change (reset to page 1)
    useEffect(() => {
        setPage(1);
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, period, dateRange]);

    // Effect: Refetch when page changes (but don't reset page)
    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // Effect: Refetch on Search (debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            loadOrders();
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const formatCurrency = (val: string) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Últimos Pedidos</CardTitle>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    className="pl-9 w-[200px]"
                                    placeholder="Buscar por nome/ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="p-3">Pedido</th>
                                    <th className="p-3">Cliente</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Total</th>
                                    <th className="p-3 text-center">Itens</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    // Skeleton Rows
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0">
                                            <td className="p-3"><div className="h-4 w-12 bg-gray-100 rounded"></div></td>
                                            <td className="p-3"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                                            <td className="p-3"><div className="h-4 w-16 bg-gray-100 rounded"></div></td>
                                            <td className="p-3 text-right"><div className="h-4 w-16 bg-gray-100 rounded inline-block"></div></td>
                                            <td className="p-3 text-center"><div className="h-4 w-8 bg-gray-100 rounded inline-block"></div></td>
                                            <td className="p-3 text-center"><div className="h-6 w-16 bg-gray-100 rounded inline-block"></div></td>
                                        </tr>
                                    ))
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-3 font-medium">#{order.number}</td>
                                            <td className="p-3">
                                                <div className="font-medium text-gray-900">{order.billing.first_name || "Cliente"} {order.billing.last_name}</div>
                                                <div className="text-xs text-gray-400">{order.billing.email}</div>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="outline" className={`
                                                    ${order.status === 'completed' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                                                    ${order.status === 'processing' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                                                    ${order.status === 'cancelled' ? 'border-red-200 bg-red-50 text-red-700' : ''}
                                                    ${order.status === 'pending' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : ''}
                                                `}>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-right font-semibold">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="p-3 text-center text-gray-500">
                                                {order.line_items.reduce((acc, item) => acc + item.quantity, 0)}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                                                    <Eye className="h-4 w-4 text-gray-500 hover:text-apet-red" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-gray-500">
                            Página {page} de {totalPages || 1}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages || loading}
                            >
                                Próxima
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedOrder && (
                <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </>
    );
}
