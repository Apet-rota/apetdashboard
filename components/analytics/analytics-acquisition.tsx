"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MetricInfo } from "./metric-info"
import { Maximize2 } from "lucide-react"

interface AnalyticsAcquisitionProps {
    channels: { name: string, sessions: number }[]
    sources: { name: string, sessions: number }[]
    loading: boolean
}

const COLORS = ['#DC2626', '#1E293B', '#475569', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'];

export function AnalyticsAcquisition({ channels, sources, loading }: AnalyticsAcquisitionProps) {
    const totalSessions = channels.reduce((acc, curr) => acc + curr.sessions, 0)

    // Sort channels by sessions descending
    const sortedChannels = [...channels].sort((a, b) => b.sessions - a.sessions)
    const topChannels = sortedChannels.slice(0, 6)

    const topSources = sources.slice(0, 8)

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="h-[400px] animate-pulse bg-gray-50 border-0" />
                    <Card className="h-[400px] animate-pulse bg-gray-50 border-0" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-apet-black">Aquisição</h2>
                <MetricInfo
                    customInfo={{
                        title: "Aquisição de Tráfego",
                        definition: "Como os usuários chegam ao seu site (Canais) e quais links específicos (Origem/Mídia) eles usaram.",
                        tip: "Use para identificar qual campanha ou rede social traz mais resultado."
                    }}
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Channels (Donut) */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-apet-black flex items-center gap-2">
                                Canais
                                <MetricInfo metricKey="channels" />
                            </h3>
                        </div>

                        <div className="flex flex-col h-full">
                            <div className="h-[220px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sortedChannels}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="sessions"
                                            nameKey="name"
                                            stroke="none"
                                        >
                                            {sortedChannels.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: any) => [value?.toLocaleString() || "0", "Sessões"]}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Center Total */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-apet-black">{totalSessions.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Sessões</div>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Legend */}
                            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3">
                                {topChannels.map((channel, i) => {
                                    const percent = totalSessions > 0 ? (channel.sessions / totalSessions) * 100 : 0
                                    return (
                                        <div key={i} className="flex items-center justify-between text-sm group">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <span
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                                />
                                                <span className="truncate text-gray-600 group-hover:text-apet-black transition-colors" title={channel.name}>
                                                    {channel.name}
                                                </span>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="font-semibold text-gray-900 block">{percent.toFixed(1)}%</span>
                                                <span className="text-xs text-gray-400 block">{channel.sessions}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* View All Channels Modal (if many) */}
                            {channels.length > 6 && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="w-full mt-4 text-apet-red hover:text-apet-red/80 hover:bg-red-50">
                                            Ver todos os canais
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Todos os Canais de Aquisição</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4 max-h-[400px] overflow-auto space-y-2">
                                            {sortedChannels.map((channel, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-500">
                                                            {i + 1}
                                                        </span>
                                                        <span className="font-medium text-gray-900">{channel.name}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold">{channel.sessions.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {((channel.sessions / totalSessions) * 100).toFixed(1)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Sources (List) */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-apet-black flex items-center gap-2">
                                Top Origem / Mídia
                                <MetricInfo metricKey="sources" />
                            </h3>
                        </div>

                        <div className="space-y-1">
                            {/* Header */}
                            <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pb-2 border-b">
                                <div className="col-span-1">#</div>
                                <div className="col-span-7">Origem / Mídia</div>
                                <div className="col-span-4 text-right">Sessões</div>
                            </div>

                            {/* Rows */}
                            <div className="space-y-2 mt-2">
                                {topSources.map((item, i) => {
                                    const maxVal = Math.max(...sources.map(s => s.sessions))
                                    const percent = maxVal > 0 ? (item.sessions / maxVal) * 100 : 0

                                    return (
                                        <div key={i} className="group grid grid-cols-12 items-center px-2 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                            <div className="col-span-1 text-xs font-mono text-gray-400 group-hover:text-apet-black">{i + 1}</div>
                                            <div className="col-span-7 pr-4">
                                                <div className="font-medium text-sm text-gray-700 truncate group-hover:text-apet-black" title={item.name}>
                                                    {item.name}
                                                </div>
                                                <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full bg-apet-black/80 group-hover:bg-apet-black transition-all"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-4 text-right">
                                                <span className="font-bold text-sm text-gray-900 block">{item.sessions.toLocaleString()}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {totalSessions > 0 ? ((item.sessions / totalSessions) * 100).toFixed(1) : 0}% do total
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* View All Sources Modal */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full mt-6 border-dashed border-gray-300 text-gray-500 hover:text-apet-black hover:border-gray-400">
                                        <Maximize2 className="w-4 h-4 mr-2" />
                                        Ver todas as origens
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Todas as Origens de Tráfego</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4 max-h-[500px] overflow-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Rank</th>
                                                    <th className="px-4 py-3">Origem / Mídia</th>
                                                    <th className="px-4 py-3 text-right">Sessões</th>
                                                    <th className="px-4 py-3 text-right rounded-tr-lg">% Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {sources.map((item, i) => (
                                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-gray-400">{i + 1}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                                        <td className="px-4 py-3 text-right font-bold">{item.sessions.toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-right text-gray-500">
                                                            {totalSessions > 0 ? ((item.sessions / totalSessions) * 100).toFixed(1) : 0}%
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
