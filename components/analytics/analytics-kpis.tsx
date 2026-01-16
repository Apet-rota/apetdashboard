"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MousePointerClick, Eye, Activity, Timer } from "lucide-react"
import { MetricInfo } from "./metric-info"

import { AnalyticsOverview } from "@/types/analytics"

interface AnalyticsKPIsProps {
    data: AnalyticsOverview | null
    loading: boolean
}

export function AnalyticsKPIs({ data, loading }: AnalyticsKPIsProps) {
    // Helpers
    const formatNum = (n: number) => n?.toLocaleString("pt-BR") || "0"
    const formatTime = (sec: number) => {
        if (!sec) return "0s"
        const m = Math.floor(sec / 60)
        const s = Math.round(sec % 60)
        return `${m}m ${s}s`
    }
    const formatPercent = (n: number) => `${(n * 100).toFixed(1)}%`

    const cards = [
        {
            title: "Sessões",
            value: data?.sessions,
            formatter: formatNum,
            icon: MousePointerClick,
            desc: "Total de visitas",
            metricKey: "sessions"
        },
        {
            title: "Usuários",
            value: data?.users,
            formatter: formatNum,
            icon: Users,
            desc: "Visitantes únicos",
            metricKey: "users"
        },
        {
            title: "Pageviews",
            value: data?.screenPageViews,
            formatter: formatNum,
            icon: Eye,
            desc: "Visualizações de tela",
            metricKey: "pageviews"
        },
        {
            title: "Engajamento",
            value: data?.engagementRate,
            formatter: formatPercent,
            icon: Activity,
            desc: "Taxa de engajamento",
            metricKey: "engagementRate"
        },
        {
            title: "Tempo Médio",
            value: data?.averageSessionDuration,
            formatter: formatTime,
            icon: Timer,
            desc: "Duração média da sessão",
            metricKey: "avgSessionDuration"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {cards.map((card, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            {card.title}
                            <MetricInfo metricKey={card.metricKey} />
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-apet-red opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-apet-black truncate">
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
                            ) : (
                                card.value !== undefined ? card.formatter(card.value!) : "-"
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
