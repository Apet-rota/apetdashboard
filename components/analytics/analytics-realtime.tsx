"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { MetricInfo } from "./metric-info"

// Simple Recharts for Sparkline
import { BarChart, Bar, ResponsiveContainer } from 'recharts'

import { AnalyticsRealtimeData } from "@/types/analytics"

export function AnalyticsRealtime() {
    const [data, setData] = useState<AnalyticsRealtimeData | null>(null)
    const [loading, setLoading] = useState(true)

    async function fetchRealtime() {
        try {
            const res = await fetch("/api/ga4/realtime")
            if (res.ok) {
                const json = await res.json()
                setData(json.meta)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRealtime()
        // Poll every 30s
        const interval = setInterval(fetchRealtime, 30000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {/* Main Realtime Card */}
            <Card className="lg:col-span-1 bg-gradient-to-br from-white to-red-50/20 border-apet-red/20 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium text-white/80 uppercase tracking-widest">
                                Tempo Real
                            </CardTitle>
                            <MetricInfo metricKey="activeUsers" className="text-white/50 hover:text-white" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Activity className="h-5 w-5 animate-pulse text-apet-red" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6">
                        <span className="text-5xl font-extrabold text-apet-black">
                            {loading ? "-" : data?.totalActive || 0}
                        </span>
                        <span className="text-sm text-gray-500 mt-2 uppercase tracking-wider font-semibold">Usuários Ativos</span>
                    </div>

                    {/* Micro Sparkline */}
                    <div className="h-16 mt-4 w-full">
                        {!loading && data?.chartData && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.chartData}>
                                    <Bar dataKey="users" fill="#DC2626" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2">Usuários por minuto</p>
                </CardContent>
            </Card>

            {/* Top Locations Realtime */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Top Localizações (Agora)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-8">
                        {/* Countries */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">Países</h4>
                            <div className="space-y-2">
                                {loading ? <SkeletonLines /> : data?.topCountries?.length === 0 ? <Empty /> : (
                                    data?.topCountries.map((c: { name: string, count: number }, i: number) => (
                                        <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-1 last:border-0">
                                            <span className="truncate max-w-[120px] font-medium">{c.name}</span>
                                            <span className="font-bold">{c.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Cities */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">Cidades</h4>
                            <div className="space-y-2">
                                {loading ? <SkeletonLines /> : data?.topCities?.length === 0 ? <Empty /> : (
                                    data?.topCities.map((c: { name: string, count: number }, i: number) => (
                                        <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-1 last:border-0">
                                            <span className="truncate max-w-[120px] text-gray-600">{c.name}</span>
                                            <span className="font-bold">{c.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function SkeletonLines() {
    return <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />)}</div>
}
function Empty() {
    return <div className="text-xs text-gray-400 italic text-center">Sem dados no momento</div>
}
