import { NextRequest, NextResponse } from "next/server"
import { runGa4Report, GA4Row } from '@/lib/ga4'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get("from") || "30daysAgo"
        const to = searchParams.get("to") || "today"

        const response = await runGa4Report({
            dateRanges: [
                {
                    startDate: from,
                    endDate: to,
                },
            ],
            // Dimensions can be empty for overview total
            metrics: [
                { name: "sessions" },
                { name: "totalUsers" },
                { name: "screenPageViews" },
                { name: "engagedSessions" },
                { name: "averageSessionDuration" },
                { name: "engagementRate" },
                { name: "sessionsPerUser" }
            ]
        })

        const items = response.rows ? (response.rows as GA4Row[]).map((row) => ({
            sessions: parseInt(row.metricValues?.[0]?.value || "0"),
            totalUsers: parseInt(row.metricValues?.[1]?.value || "0"),
            screenPageViews: parseInt(row.metricValues?.[2]?.value || "0"),
            engagedSessions: parseInt(row.metricValues?.[3]?.value || "0"),
            averageSessionDuration: parseFloat(row.metricValues?.[4]?.value || "0"),
            engagementRate: parseFloat(row.metricValues?.[5]?.value || "0"),
            sessionsPerUser: parseFloat(row.metricValues?.[6]?.value || "0")
        })) : []

        // Since we didn't request dimensions, should be 1 row
        if (items.length === 0) {
            // Return zeros if no data
            items.push({
                sessions: 0,
                totalUsers: 0,
                screenPageViews: 0,
                engagedSessions: 0,
                averageSessionDuration: 0,
                engagementRate: 0,
                sessionsPerUser: 0
            })
        }

        return NextResponse.json({
            items,
            meta: {
                rowCount: response.rowCount
            }
        })

    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
