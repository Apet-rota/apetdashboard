"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsGeoCountry, AnalyticsGeoRegion, AnalyticsGeoCity } from "@/types/analytics"
import { Globe } from "lucide-react"
import { MetricInfo } from "./metric-info"
import { GeoMap } from "./geo-map"

// Map of common Country Names to Emoji Flags (Simple version)
const FLAG_MAP: Record<string, string> = {
    "Brazil": "🇧🇷",
    "United States": "🇺🇸",
    "Portugal": "🇵🇹",
    "United Kingdom": "🇬🇧",
    "Germany": "🇩🇪",
    "Argentina": "🇦🇷",
    "France": "🇫🇷",
    "Canada": "🇨🇦",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹"
}

interface AnalyticsGeoProps {
    countries: AnalyticsGeoCountry[]
    regions: AnalyticsGeoRegion[]
    cities: AnalyticsGeoCity[]
    loading: boolean
}

export function AnalyticsGeo({ countries, regions, loading }: AnalyticsGeoProps) {
    const [tab, setTab] = useState("br")

    if (loading) return <Card className="h-[400px] animate-pulse bg-gray-50" />

    // Prepare data for Maps
    // For World: use countries
    // For Brazil: use regions using "State of X" format potentially matching map
    // GA4 regions: "State of Sao Paulo", "State of Rio de Janeiro" or just "Sao Paulo"
    // Map expectations: "São Paulo", "Rio de Janeiro". Need fuzzy match or data prop.

    // Attempt to clean GA4 region names for better matching if needed by GeoMap
    const brData = regions.map(r => ({
        name: r.name.replace("State of ", ""), // Clean "State of " prefix often sent by GA4
        value: r.sessions
    }))

    const worldData = countries.map(c => ({
        name: c.country,
        value: c.sessions
    }))

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Geografia
                    </CardTitle>
                    <MetricInfo metricKey="geo" />
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList>
                            <TabsTrigger value="br">Brasil (Estados)</TabsTrigger>
                            <TabsTrigger value="world">Mundo</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column: Map */}
                        <div className="w-full min-h-[300px] flex items-center justify-center">
                            {tab === "br" ? (
                                <GeoMap data={brData} scope="br" />
                            ) : (
                                <GeoMap data={worldData} scope="world" />
                            )}
                        </div>

                        {/* Right Column: List */}
                        <div className="w-full">
                            <TabsContent value="br" className="mt-0">
                                <div className="space-y-1">
                                    <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pb-2 border-b">
                                        <div className="col-span-2">Rank</div>
                                        <div className="col-span-8">Estado</div>
                                        <div className="col-span-2 text-right">Sessões</div>
                                    </div>
                                    <div className="max-h-[300px] overflow-auto space-y-1 mt-2 pr-2">
                                        {regions.map((r, i) => (
                                            <div key={i} className="grid grid-cols-12 items-center px-2 py-2 text-sm hover:bg-gray-50 rounded transition-colors group">
                                                <div className="col-span-2 font-mono text-gray-400 group-hover:text-apet-black">#{i + 1}</div>
                                                <div className="col-span-8 font-medium text-gray-700 truncate">{r.name}</div>
                                                <div className="col-span-2 text-right font-bold">{r.sessions.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="world" className="mt-0">
                                <div className="space-y-1">
                                    <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pb-2 border-b">
                                        <div className="col-span-2">Rank</div>
                                        <div className="col-span-8">País</div>
                                        <div className="col-span-2 text-right">Sessões</div>
                                    </div>
                                    <div className="max-h-[300px] overflow-auto space-y-1 mt-2 pr-2">
                                        {countries.map((c, i) => (
                                            <div key={i} className="grid grid-cols-12 items-center px-2 py-2 text-sm hover:bg-gray-50 rounded transition-colors group">
                                                <div className="col-span-2 font-mono text-gray-400 group-hover:text-apet-black">#{i + 1}</div>
                                                <div className="col-span-8 font-medium text-gray-700 truncate flex items-center gap-2">
                                                    <span className="text-base">{FLAG_MAP[c.country] || "🌍"}</span>
                                                    {c.country}
                                                </div>
                                                <div className="col-span-2 text-right font-bold">{c.sessions.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    )
}
