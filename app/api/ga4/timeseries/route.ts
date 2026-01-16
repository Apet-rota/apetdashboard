import { NextRequest, NextResponse } from "next/server"
import { runGa4Report, GA4Row } from "@/lib/ga4"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get("from") || "30daysAgo"
        const to = searchParams.get("to") || "today"

        const response = await runGa4Report({
            dateRanges: [{ startDate: from, endDate: to }],
            dimensions: [{ name: "date" }],
            metrics: [
                { name: "sessions" },
                { name: "totalUsers" },
                { name: "screenPageViews" },
                { name: "engagedSessions" }
            ],
            orderBys: [
                { dimension: { dimensionName: "date" } }
            ]
        })


        const items = response.rows ? (response.rows as GA4Row[]).map((row) => ({
            date: row.dimensionValues?.[0]?.value || "Unknown",
            sessions: parseInt(row.metricValues?.[0]?.value || "0"),
            users: parseInt(row.metricValues?.[1]?.value || "0"),
            pageviews: parseInt(row.metricValues?.[2]?.value || "0"),
            engagedSessions: parseInt(row.metricValues?.[3]?.value || "0")
        })) : []

        // Sort by date basic
        items.sort((a, b) => a.date.localeCompare(b.date))

        return NextResponse.json({
            items,
            meta: {
                total: response.rowCount
            }
        })

    } catch (error: unknown) {
        console.error("GA4 Timeseries Error:", error)
        return NextResponse.json(
            { error: "ga4_error", message: (error as Error).message },
            { status: 500 }
        )
    }
}
