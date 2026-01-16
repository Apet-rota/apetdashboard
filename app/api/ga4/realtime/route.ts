import { NextResponse } from "next/server"
import { runGa4RealtimeReport, GA4Row } from '@/lib/ga4'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
    try {
        // 1. Total Active Users (Metric: activeUsers) - Deduplicated
        const activeRes = await runGa4RealtimeReport({
            metrics: [{ name: "activeUsers" }]
        })
        const totalActive = parseInt(activeRes.rows?.[0]?.metricValues?.[0]?.value || "0")

        // 2. Chart Data (Minutes Ago)
        const chartRes = await runGa4RealtimeReport({
            dimensions: [{ name: "minutesAgo" }],
            metrics: [{ name: "activeUsers" }],
            orderBys: [{ dimension: { dimensionName: "minutesAgo" } }]
        })

        const chartData = chartRes.rows ? (chartRes.rows as GA4Row[]).map((row) => ({
            minAgo: parseInt(row.dimensionValues?.[0]?.value || "0"),
            users: parseInt(row.metricValues?.[0]?.value || "0")
        })) : []

        // Reverse to show oldest to newest if needed, or keeping explicit order
        // Usually chart expects time ascending. minutesAgo 29 is oldest.
        chartData.sort((a, b) => b.minAgo - a.minAgo)

        // 3. Top Locations (Country & City)
        const locationRes = await runGa4RealtimeReport({
            dimensions: [{ name: "country" }, { name: "city" }],
            metrics: [{ name: "activeUsers" }]
        })

        const countriesMap = new Map<string, number>()
        const citiesMap = new Map<string, number>()

        if (locationRes.rows) {
            (locationRes.rows as GA4Row[]).forEach((row) => {
                const country = row.dimensionValues?.[0]?.value || "Unknown"
                const city = row.dimensionValues?.[1]?.value || "Unknown"
                const count = parseInt(row.metricValues?.[0]?.value || "0")

                countriesMap.set(country, (countriesMap.get(country) || 0) + count)
                if (city !== "(not set)") {
                    citiesMap.set(city, (citiesMap.get(city) || 0) + count)
                }
            })
        }

        const topCountries = Array.from(countriesMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        const topCities = Array.from(citiesMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        return NextResponse.json({
            meta: {
                totalActive,
                chartData,
                topCountries,
                topCities
            }
        })

    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
