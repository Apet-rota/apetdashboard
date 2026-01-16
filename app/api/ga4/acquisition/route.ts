import { NextRequest, NextResponse } from "next/server"
import { runGa4Report } from "@/lib/ga4"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface GA4Row {
    dimensionValues?: { value?: string }[]
    metricValues?: { value?: string }[]
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get("from") || "30daysAgo"
        const to = searchParams.get("to") || "today"

        // 1. Channel Grouping
        const channelsRes = await runGa4Report({
            dateRanges: [{ startDate: from, endDate: to }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [{ name: "sessions" }],
            limit: 10
        })

        const channels = channelsRes.rows ? (channelsRes.rows as GA4Row[]).map((row) => ({
            name: row.dimensionValues?.[0]?.value || "Unknown",
            sessions: parseInt(row.metricValues?.[0]?.value || "0")
        })) : []

        // 2. Source / Medium
        const sourceRes = await runGa4Report({
            dateRanges: [{ startDate: from, endDate: to }],
            dimensions: [{ name: "sessionSourceMedium" }],
            metrics: [{ name: "sessions" }],
            limit: 20
        })

        const sources = sourceRes.rows ? (sourceRes.rows as GA4Row[]).map((row) => ({
            name: row.dimensionValues?.[0]?.value || "Unknown",
            sessions: parseInt(row.metricValues?.[0]?.value || "0")
        })) : []

        return NextResponse.json({
            items: [],
            meta: {
                channels,
                sources
            }
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
