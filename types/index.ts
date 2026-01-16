export interface KPIStats {
    label: string
    value: string | number
    change?: number // percentage
    trend?: "up" | "down" | "neutral"
}

export interface VisitorData {
    date: string
    visitors: number
    pageviews: number
}

export interface CourseData {
    id: number
    name: string
    sales: number
    revenue: number
    students: number
    image?: string
}
