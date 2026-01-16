export interface AnalyticsOverview {
    sessions: number
    users: number
    screenPageViews: number
    engagedSessions: number
    averageSessionDuration: number
    engagementRate: number
    sessionsPerUser: number
}

export interface AnalyticsTimeSeriesItem {
    date: string
    sessions: number
    users: number
    pageviews: number
    engagedSessions: number
}

export interface AnalyticsAcquisitionChannel {
    name: string
    sessions: number
}

export interface AnalyticsAcquisitionSource {
    name: string
    sessions: number
}

export interface AnalyticsGeoCountry {
    country: string
    sessions: number
    totalUsers?: number
}

export interface AnalyticsGeoRegion {
    name: string
    sessions: number
}

export interface AnalyticsGeoCity {
    city: string
    region?: string
    sessions: number
}

export interface AnalyticsPageItem {
    path: string
    views: number
}

export interface AnalyticsLandingPageItem {
    path: string
    sessions: number
    engaged: number
    rate: number
}

export interface AnalyticsRealtimeData {
    totalActive: number
    chartData: { minAgo: number, users: number }[]
    topCountries: { name: string, count: number }[]
    topCities: { name: string, count: number }[]
}
