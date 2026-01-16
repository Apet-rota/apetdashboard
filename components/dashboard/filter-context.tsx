"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DateRange } from "react-day-picker"

export type Period = 'today' | '7d' | '30d' | '90d' | 'custom'
export type DeviceType = 'all' | 'mobile' | 'desktop'
export type BotFilter = 'exclude' | 'include'

interface FilterState {
    period: Period
    dateRange: DateRange | undefined
    compare: boolean
    bots: BotFilter
    device: DeviceType
}

interface FilterContextType extends FilterState {
    setPeriod: (p: Period) => void
    setDateRange: (r: DateRange | undefined) => void
    setCompare: (c: boolean) => void
    setBots: (b: BotFilter) => void
    setDevice: (d: DeviceType) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
    const [period, setPeriod] = useState<Period>('30d')
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [compare, setCompare] = useState(true)
    const [bots, setBots] = useState<BotFilter>('exclude')
    const [device, setDevice] = useState<DeviceType>('all')

    return (
        <FilterContext.Provider
            value={{
                period, setPeriod,
                dateRange, setDateRange,
                compare, setCompare,
                bots, setBots,
                device, setDevice
            }}
        >
            {children}
        </FilterContext.Provider>
    )
}

export function useFilters() {
    const context = useContext(FilterContext)
    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider')
    }
    return context
}
