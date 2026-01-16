"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MetricInfo } from "./metric-info"

import { AnalyticsTimeSeriesItem } from "@/types/analytics"

interface AnalyticsTimeseriesProps {
    data: AnalyticsTimeSeriesItem[]
    loading: boolean
}

export function AnalyticsTimeseries({ data, loading }: AnalyticsTimeseriesProps) {
    const [metric, setMetric] = useState("sessions")

    // Transform date YYYYMMDD to readable
    const chartData = useMemo(() => {
        if (!data) return []
        return data.map((item: { date: string }) => {
            // "20231025" -> Date
            const y = item.date.substring(0, 4) // eslint-disable-line @typescript-eslint/no-unused-vars
            const m = item.date.substring(4, 6)
            const d = item.date.substring(6, 8)
            return {
                ...item,
                formattedDate: `${d}/${m}`
            }
        })
    }, [data])

    const config: Record<string, { label: string, color: string }> = {
        sessions: { label: "Sessões", color: "#DC2626" }, // APET Red
        users: { label: "Usuários", color: "#2563EB" }, // Blue
        pageviews: { label: "Pageviews", color: "#059669" }, // Green
        engagedSessions: { label: "Engajadas", color: "#D97706" } // Amber
    }

    const currentConfig = config[metric]

    if (loading) {
        return (
            <Card className="h-[400px]">
                <CardHeader><div className="h-6 w-40 bg-gray-100 rounded animate-pulse" /></CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="h-full w-full bg-gray-50 rounded-lg animate-pulse" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <CardTitle>Evolução no Período</CardTitle>
                            <MetricInfo
                                customInfo={{
                                    title: "Série Temporal",
                                    definition: "Visualização diária das métricas selecionadas.",
                                    tip: "Use as abas para alternar entre Sessões, Usuários e Pageviews."
                                }}
                            />
                        </div>
                        <CardDescription>Acompanhe o desempenho diário</CardDescription>
                    </div>
                    <Tabs value={metric} onValueChange={setMetric} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
                            <TabsTrigger value="sessions">Sessões</TabsTrigger>
                            <TabsTrigger value="users">Usuários</TabsTrigger>
                            <TabsTrigger value="pageviews">Views</TabsTrigger>
                            <TabsTrigger value="engagedSessions">Engaj.</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="formattedDate"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#6B7280" }}
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#6B7280" }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                            />
                            <Area
                                type="monotone"
                                dataKey={metric}
                                stroke={currentConfig.color}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorMetric)"
                                name={currentConfig.label}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
