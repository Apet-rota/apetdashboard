import { NextRequest, NextResponse } from "next/server"
import { runGa4Report, GA4Row } from '@/lib/ga4'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get("from") || "30daysAgo"
        const to = searchParams.get("to") || "today"

        // 1. Top Pages (Path) - Metric: screenPageViews
        const pagesRes = await runGa4Report({
            dateRanges: [{ startDate: from, endDate: to }],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }],
            limit: 20,
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }]
        })

        const pages = pagesRes.rows ? (pagesRes.rows as GA4Row[]).map((row) => ({
            path: row.dimensionValues?.[0]?.value || "Unknown",
            views: parseInt(row.metricValues?.[0]?.value || "0")
        })) : []

        // 2. Top Landing Pages - Metric: sessions, engagedSessions
        const landingRes = await runGa4Report({
            dateRanges: [{ startDate: from, endDate: to }],
            dimensions: [{ name: "landingPage" }],
            metrics: [{ name: "sessions" }, { name: "engagedSessions" }],
            limit: 20,
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }]
        })

        const landings = landingRes.rows ? (landingRes.rows as GA4Row[]).map((row) => {
            const sessions = parseInt(row.metricValues?.[0]?.value || "0")
            const engaged = parseInt(row.metricValues?.[1]?.value || "0")
            return {
                path: row.dimensionValues?.[0]?.value || "Unknown",
                sessions,
                engaged,
                rate: sessions > 0 ? (engaged / sessions) * 100 : 0
            }
        }) : []

        // Sort landings by engagement rate (optional, or stick to sessions)
        // Let's stick to order from API (sessions) or re-sort
        // landings.sort((a, b) => b.sessions - a.sessions)

        return NextResponse.json({
            items: [],
            meta: {
                pages,
                landings
            }
        })

    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
