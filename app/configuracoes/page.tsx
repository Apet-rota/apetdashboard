import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfigPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-apet-black">Configurações & Integrações</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Status das Integrações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <div className="font-semibold">WooCommerce REST API</div>
                            <div className="text-sm text-gray-500">Conexão para vendas e pedidos</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Conectado</Badge>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <div className="font-semibold">JetEngine CCT (Visitas)</div>
                            <div className="text-sm text-gray-500">Dados de tráfego e analytics</div>
                        </div>
                        <Badge variant="secondary">Simulado (Mock)</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold">GeoIP Database</div>
                            <div className="text-sm text-gray-500">Localização de visitantes</div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Pendente</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
