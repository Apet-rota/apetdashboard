import { BetaAnalyticsDataClient } from '@google-analytics/data'

export interface GA4Row {
    dimensionValues?: { value?: string }[]
    metricValues?: { value?: string }[]
}

function getGa4Client() {
    const serviceAccountJson = process.env.GA4_SERVICE_ACCOUNT_JSON
    const clientEmail = process.env.GA4_CLIENT_EMAIL
    const privateKey = process.env.GA4_PRIVATE_KEY

    if (serviceAccountJson) {
        try {
            const parsed = JSON.parse(serviceAccountJson)
            // Normalize potential newlines in private_key if it came from a slightly malformed JSON string env
            if (parsed.private_key) {
                parsed.private_key = parsed.private_key.replace(/\\n/g, '\n')
            }
            return new BetaAnalyticsDataClient({ credentials: parsed })
        } catch (e) {
            console.error("Error parsing GA4_SERVICE_ACCOUNT_JSON", e)
            throw new Error("Invalid GA4_SERVICE_ACCOUNT_JSON")
        }
    }

    if (clientEmail && privateKey) {
        return new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey.replace(/\\n/g, '\n'),
            },
        })
    }

    throw new Error("GA4 credentials missing (GA4_SERVICE_ACCOUNT_JSON or GA4_CLIENT_EMAIL+GA4_PRIVATE_KEY)")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runGa4Report(params: { dateRanges?: any[], dimensions?: any[], metrics?: any[], dimensionFilter?: any, limit?: number, orderBys?: any[] }) {
    const analyticsDataClient = getGa4Client()
    const propertyId = process.env.GA4_PROPERTY_ID

    if (!propertyId) {
        throw new Error("GA4_PROPERTY_ID is missing")
    }

    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        ...params,
    })

    return response
}

export async function runGa4RealtimeReport(params: { dimensions?: any[], metrics?: any[], dimensionFilter?: any, limit?: number, orderBys?: any[], metricAggregations?: any[] }) {
    const analyticsDataClient = getGa4Client()
    const propertyId = process.env.GA4_PROPERTY_ID

    if (!propertyId) {
        throw new Error("GA4_PROPERTY_ID is missing")
    }

    const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        ...params,
    })

    return response
}
