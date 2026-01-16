"use client"

import { useEffect, useState, useCallback } from "react"
import { useFilters } from "@/components/dashboard/filter-context"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"

// Components
import { AnalyticsKPIs } from "@/components/analytics/analytics-kpis"
import { AnalyticsRealtime } from "@/components/analytics/analytics-realtime"
import { AnalyticsTimeseries } from "@/components/analytics/analytics-timeseries"
import { AnalyticsAcquisition } from "@/components/analytics/analytics-acquisition"
import { AnalyticsGeo } from "@/components/analytics/analytics-geo"
import { AnalyticsPages } from "@/components/analytics/analytics-pages"
import {
    AnalyticsOverview,
    AnalyticsTimeSeriesItem,
    AnalyticsAcquisitionChannel,
    AnalyticsAcquisitionSource,
    AnalyticsGeoCountry,
    AnalyticsGeoRegion,
    AnalyticsGeoCity,
    AnalyticsPageItem,
    AnalyticsLandingPageItem
} from "@/types/analytics"

export default function AnalyticsPage() {
    const { period, dateRange } = useFilters()

    // Data States
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
    const [timeseries, setTimeseries] = useState<AnalyticsTimeSeriesItem[]>([])
    const [acquisition, setAcquisition] = useState<{ channels: AnalyticsAcquisitionChannel[], sources: AnalyticsAcquisitionSource[] }>({ channels: [], sources: [] })
    const [geo, setGeo] = useState<{ countries: AnalyticsGeoCountry[], regions: AnalyticsGeoRegion[], cities: AnalyticsGeoCity[] }>({ countries: [], regions: [], cities: [] })
    const [pages, setPages] = useState<{ pages: AnalyticsPageItem[], landings: AnalyticsLandingPageItem[] }>({ pages: [], landings: [] })

    // Loading States
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Helper to determine exact dates for API
    // Since our API expects "from" and "to" (YYYY-MM-DD or GA4 keywords)
    const getQuery = useCallback(() => {
        if (period === 'custom' && dateRange?.from && dateRange?.to) {
            return `from=${dateRange.from.toISOString().split('T')[0]}&to=${dateRange.to.toISOString().split('T')[0]}`
        }
        // Simple mapping for predefined
        switch (period) {
            case 'today': return `from=today&to=today`
            case '7d': return `from=7daysAgo&to=today`
            case '30d': return `from=30daysAgo&to=today`
            case '90d': return `from=90daysAgo&to=today`
            default: return `from=30daysAgo&to=today`
        }
    }, [period, dateRange])

    const fetchAll = useCallback(async () => {
        // If custom is selected but incomplete, wait.
        if (period === 'custom' && (!dateRange?.from || !dateRange?.to)) return

        setLoading(true)
        setError(null)
        const qs = getQuery()

        try {
            const [ovRes, tsRes, acqRes, geoRes, pgRes] = await Promise.all([
                fetch(`/api/ga4/overview?${qs}`),
                fetch(`/api/ga4/timeseries?${qs}`),
                fetch(`/api/ga4/acquisition?${qs}`),
                fetch(`/api/ga4/geo?${qs}`),
                fetch(`/api/ga4/pages?${qs}`)
            ])

            // Process Overview
            if (ovRes.ok) {
                const json = await ovRes.json()
                setOverview(json.items?.[0] || null)
            }

            // Process Timeseries
            if (tsRes.ok) {
                const json = await tsRes.json()
                setTimeseries(json.items || [])
            }

            // Process Acquisition
            if (acqRes.ok) {
                const json = await acqRes.json()
                setAcquisition(json.meta || { channels: [], sources: [] })
            }

            // Process Geo
            if (geoRes.ok) {
                const json = await geoRes.json()
                setGeo(json.meta || { countries: [], regions: [], cities: [] })
            }

            // Process Pages
            if (pgRes.ok) {
                const json = await pgRes.json()
                setPages(json.meta || { pages: [], landings: [] })
            }

        } catch (e: any) {
            console.error(e)
            setError("Falha ao carregar dados. Verifique sua conexão.")
        } finally {
            setLoading(false)
        }
    }, [getQuery, period, dateRange]) // Depend on getQuery, which depends on filters

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-apet-black">Analytics (GA4)</h1>
                    <p className="text-gray-500">
                        {period === 'custom' && dateRange?.from ? (
                            `Período: ${dateRange.from.toLocaleDateString()} até ${dateRange.to?.toLocaleDateString() || '...'}`
                        ) : (
                            "Visão completa de tráfego e audiência."
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 hidden sm:inline-block">
                        {loading ? "Atualizando..." : "Atualizado agora"}
                    </span>
                    <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            {/* Realtime Block (Always Visible, independent of range filter) */}
            <AnalyticsRealtime />

            {/* Main Stats */}
            <AnalyticsKPIs data={overview} loading={loading} />

            {/* Timeseries Chart */}
            <AnalyticsTimeseries data={timeseries} loading={loading} />

            {/* Acquisition */}
            <AnalyticsAcquisition
                channels={acquisition.channels}
                sources={acquisition.sources}
                loading={loading}
            />

            {/* Geo */}
            <AnalyticsGeo
                countries={geo.countries}
                regions={geo.regions}
                cities={geo.cities}
                loading={loading}
            />

            {/* Content */}
            <AnalyticsPages
                pages={pages.pages}
                landings={pages.landings}
                loading={loading}
            />
        </div>
    )
}
