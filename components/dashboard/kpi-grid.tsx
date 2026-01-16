import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPIStats } from "@/types"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

interface KPIGridProps {
    stats: KPIStats[]
}

export function KPIGrid({ stats }: KPIGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            {stat.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-extrabold text-apet-black">{stat.value}</div>
                        <p className="flex items-center text-xs text-gray-500 mt-1">
                            {stat.trend === "up" && (
                                <ArrowUp className="mr-1 h-3 w-3 text-green-600" />
                            )}
                            {stat.trend === "down" && (
                                <ArrowDown className="mr-1 h-3 w-3 text-apet-red" />
                            )}
                            {stat.trend === "neutral" && (
                                <Minus className="mr-1 h-3 w-3 text-gray-400" />
                            )}
                            <span
                                className={
                                    stat.trend === "up"
                                        ? "text-green-600 font-semibold"
                                        : stat.trend === "down"
                                            ? "text-apet-red font-semibold"
                                            : "text-gray-500"
                                }
                            >
                                {stat.change && Math.abs(stat.change)}%
                            </span>
                            <span className="ml-1 text-gray-400">em relação ao mê anterior</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
