"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { MetricInfo } from "./metric-info"

interface AnalyticsPagesProps {
    pages: { path: string, views: number }[]
    landings: { path: string, sessions: number, engaged: number, rate: number }[]
    loading: boolean
}

export function AnalyticsPages({ pages, landings, loading }: AnalyticsPagesProps) {
    if (loading) return <Card className="h-[400px] animate-pulse bg-gray-50" />

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            {/* Top Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CardTitle>Páginas Mais Visitadas</CardTitle>
                        <MetricInfo metricKey="pages" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="pb-2 pl-1">URL</th>
                                    <th className="pb-2 text-right">Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 group">
                                        <td className="py-2 pl-1 font-medium text-gray-700 max-w-[200px] truncate" title={p.path}>
                                            <div className="flex items-center gap-2">
                                                <span className="truncate">{p.path}</span>
                                                <a href={`https://apet.org.br${p.path}`} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 text-apet-red">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="py-2 text-right font-bold">{p.views.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Landing Pages */}
            <Card>
                <CardHeader><CardTitle>Principais Landing Pages</CardTitle></CardHeader>
                <CardContent>
                    <div className="w-full overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="pb-2 pl-1">Landing</th>
                                    <th className="pb-2 text-right">Sessões</th>
                                    <th className="pb-2 text-right">Engaj.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {landings.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                        <td className="py-2 pl-1 font-medium text-gray-700 max-w-[150px] truncate" title={p.path}>
                                            {p.path}
                                        </td>
                                        <td className="py-2 text-right font-bold">{p.sessions.toLocaleString()}</td>
                                        <td className="py-2 text-right text-xs">
                                            <span className={`px-1.5 py-0.5 rounded ${p.rate > 50 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                                                {p.rate.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
