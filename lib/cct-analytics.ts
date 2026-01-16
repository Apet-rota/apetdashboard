// This service mocks the structure of JetEngine CCT "Visitas"
// Schema: object_id, ip_address, user_agent, referrer, session_hash, is_bot, created_at

export interface CCTVisit {
    _ID: number
    object_id: number // page ID
    ip_address: string
    user_agent: string
    referrer: string
    session_hash: string
    is_bot: boolean // 0 or 1 usually
    created_at: string
}

export interface AggregatedAnalytics {
    sessions: number
    pageviews: number
    visitors: number
    bounceRate?: number
    topPages: { id: number, views: number }[]
    topReferrers: { domain: string, count: number }[]
    deviceBreakdown: { mobile: number, desktop: number }
}

const MOCK_REFERRERS = [
    "", // Direct
    "https://google.com/",
    "https://instagram.com/",
    "https://facebook.com/",
    "https://bing.com/",
    "https://linkedin.com/",
    "https://parceiro.com.br"
]

const MOCK_AGENTS = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...", // Mobile
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...", // Desktop
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...", // Desktop
    "Googlebot/2.1 (+http://www.google.com/bot.html)" // Bot
]

function generateRandomVisits(count: number, days: number): CCTVisit[] {
    const visits: CCTVisit[] = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
        const isBot = Math.random() < 0.1
        const date = new Date(now)
        date.setDate(date.getDate() - Math.floor(Math.random() * days))

        // Simulate session clusters
        const sessionHash = `sess_${Math.floor(Math.random() * (count / 3))}`

        visits.push({
            _ID: i,
            object_id: Math.floor(Math.random() * 20) + 1,
            ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
            user_agent: isBot ? MOCK_AGENTS[3] : MOCK_AGENTS[Math.floor(Math.random() * 3)],
            referrer: MOCK_REFERRERS[Math.floor(Math.random() * MOCK_REFERRERS.length)],
            session_hash: sessionHash,
            is_bot: isBot,
            created_at: date.toISOString()
        })
    }
    return visits.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

// Singleton fake database
const MOCK_DB = generateRandomVisits(5000, 90)

export async function getCCTVisits(filters: {
    period: string,
    excludeBots?: boolean
}): Promise<CCTVisit[]> {
    // In real life: fetch from REST API with params

    let filtered = MOCK_DB

    // Filter bots
    if (filters.excludeBots) {
        filtered = filtered.filter(v => !v.is_bot)
    }

    // Filter Date (Rough logic for mock)
    const now = new Date()
    let days = 30
    if (filters.period === '7d') days = 7
    if (filters.period === 'today') days = 1
    if (filters.period === '90d') days = 90

    const cutoff = new Date(now.setDate(now.getDate() - days))
    filtered = filtered.filter(v => new Date(v.created_at) >= cutoff)

    return filtered
}

export function aggregateCCTData(visits: CCTVisit[]): AggregatedAnalytics {
    const uniqueSessions = new Set(visits.map(v => v.session_hash))
    const uniqueIPs = new Set(visits.map(v => v.ip_address))

    const pageCounts: Record<number, number> = {}
    const referrerCounts: Record<string, number> = {}
    let mobile = 0
    let desktop = 0

    visits.forEach(v => {
        // Pages
        pageCounts[v.object_id] = (pageCounts[v.object_id] || 0) + 1

        // Referrer
        let domain = "Direto"
        if (v.referrer) {
            try {
                domain = new URL(v.referrer).hostname
            } catch {
                domain = "Outros"
            }
        }
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1

        // Device
        if (v.user_agent.toLowerCase().includes("mobile") || v.user_agent.toLowerCase().includes("iphone")) {
            mobile++
        } else {
            desktop++
        }
    })

    return {
        sessions: uniqueSessions.size,
        pageviews: visits.length,
        visitors: uniqueIPs.size,
        topPages: Object.entries(pageCounts)
            .map(([id, views]) => ({ id: Number(id), views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 10),
        topReferrers: Object.entries(referrerCounts)
            .map(([domain, count]) => ({ domain, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5),
        deviceBreakdown: { mobile, desktop }
    }
}
