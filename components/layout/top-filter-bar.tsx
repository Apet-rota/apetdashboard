"use client"

import * as React from "react"
import { useFilters, Period } from "@/components/dashboard/filter-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Monitor, Smartphone, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
// For now, using simple HTML date inputs to avoid large dependency issues/complexity, 
// but fully respecting the state logic requested.

export function TopFilterBar() {
    const { period, setPeriod, dateRange, setDateRange, bots, setBots, device, setDevice } = useFilters()

    // Local state for the custom inputs before "applying"
    const [draftFrom, setDraftFrom] = React.useState("")
    const [draftTo, setDraftTo] = React.useState("")

    const periods: { label: string; value: Period }[] = [
        { label: "Hoje", value: "today" },
        { label: "7 Dias", value: "7d" },
        { label: "30 Dias", value: "30d" },
        { label: "90 Dias", value: "90d" },
        { label: "Personalizado", value: "custom" },
    ]

    const handleApplyCustom = () => {
        if (draftFrom && draftTo) {
            setDateRange({
                from: new Date(draftFrom),
                to: new Date(draftTo)
            })
        }
    }

    // Sync draft inputs when dateRange changes (e.g. from predefined or initial load)
    React.useEffect(() => {
        if (dateRange?.from) {
            setDraftFrom(dateRange.from.toISOString().split('T')[0])
        }
        if (dateRange?.to) {
            setDraftTo(dateRange.to.toISOString().split('T')[0])
        }
    }, [dateRange])

    return (
        <div className="sticky top-0 z-30 flex flex-col md:flex-row w-full items-start md:items-center justify-between border-b border-apet-border bg-white/80 px-8 py-3 backdrop-blur-md gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Period Selector */}
                <div className="flex items-center rounded-lg border border-apet-border bg-white p-1">
                    {periods.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
                                period === p.value
                                    ? "bg-apet-red text-white shadow-sm"
                                    : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Custom Range Inputs (Only visible if Custom) */}
                {period === "custom" && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="relative">
                            <Input
                                type="date"
                                className="h-8 max-w-[130px] text-xs"
                                value={draftFrom}
                                onChange={(e) => setDraftFrom(e.target.value)}
                            />
                        </div>
                        <span className="text-gray-400 text-xs">até</span>
                        <div className="relative">
                            <Input
                                type="date"
                                className="h-8 max-w-[130px] text-xs"
                                value={draftTo}
                                onChange={(e) => setDraftTo(e.target.value)}
                            />
                        </div>
                        <Button
                            size="sm"
                            className="h-8 text-xs bg-apet-black hover:bg-gray-800"
                            onClick={handleApplyCustom}
                            disabled={!draftFrom || !draftTo || draftFrom > draftTo}
                        >
                            Aplicar
                        </Button>
                    </div>
                )}

                {period !== 'custom' && <div className="hidden md:block h-6 w-px bg-gray-200" />}

                {/* Filters - REMOVED AS REQUESTED */}
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium hidden lg:inline-block">
                    Atualizado: Agora
                </span>
                {/* Export Button - REMOVED AS REQUESTED */}
            </div>
        </div>
    )
}
