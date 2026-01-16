import { NextRequest, NextResponse } from "next/server"
import { runGa4Report, GA4Row } from '@/lib/ga4'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get("from") || "30daysAgo"
        const to = searchParams.get("to") || "today"

        // 1. Top Countries
        const countryRes = await runGa4Report({
            dateRanges: [{ startDate: from, endDate: to }],
            dimensions: [{ name: "country" }],
            metrics: [{ name: "sessions" }, { name: "totalUsers" }],
            limit: 15,
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }]
        })

        const countries = countryRes.rows ? (countryRes.rows as GA4Row[]).map((row) => ({
            country: row.dimensionValues?.[0]?.value || "Unknown",
            sessions: parseInt(row.metricValues?.[0]?.value || "0"),
            totalUsers: parseInt(row.metricValues?.[1]?.value || "0")
        })) : []

        // 2. Brazil Regions & Cities
        // We filter by country = "Brazil"
        const brRes = await runGa4Report({
            dateRanges: [{ startDate: from, endDate: to }],
            dimensions: [{ name: "region" }, { name: "city" }],
            metrics: [{ name: "sessions" }],
            dimensionFilter: {
                filter: {
                    fieldName: "country",
                    stringFilter: {
                        value: "Brazil"
                    }
                }
            },
            limit: 50
        })

        const regionsMap = new Map<string, number>()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cities: any[] = []

        if (brRes.rows) {
            (brRes.rows as GA4Row[]).forEach((row) => {
                const region = row.dimensionValues?.[0]?.value || "Unknown"
                const city = row.dimensionValues?.[1]?.value || "Unknown"
                const sessions = parseInt(row.metricValues?.[0]?.value || "0")

                // Sum regions
                regionsMap.set(region, (regionsMap.get(region) || 0) + sessions)

                // Collect cities
                cities.push({ city, region, sessions })
            })
        }

        const regions = Array.from(regionsMap.entries())
            .map(([name, sessions]) => ({ name, sessions }))
            // Sort by sessions
            .sort((a, b) => b.sessions - a.sessions)
            .slice(0, 10)

        // Sort cities
        cities.sort((a, b) => b.sessions - a.sessions)
        const topCities = cities.slice(0, 20)

        return NextResponse.json({
            items: [],
            meta: {
                countries,
                regions,
                cities: topCities
            }
        })

    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
