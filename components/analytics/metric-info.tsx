"use client"

import { Info } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ga4Metrics, MetricInfo as MetricInfoType } from "@/lib/metrics-ga4"

interface MetricInfoProps {
    metricKey?: string
    customInfo?: MetricInfoType
    className?: string
}

export function MetricInfo({ metricKey, customInfo, className }: MetricInfoProps) {
    const info = customInfo || (metricKey ? ga4Metrics[metricKey] : null)

    if (!info) return null

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`inline-flex items-center justify-center rounded-full text-gray-400 hover:text-apet-blue transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-apet-blue ${className}`}
                    aria-label={`Mais informações sobre ${info.title}`}
                >
                    <Info className="h-3.5 w-3.5 ml-1.5 cursor-help" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 text-sm shadow-xl border-gray-100" side="top" align="start">
                <div className="space-y-3">
                    <h4 className="font-semibold text-apet-black border-b pb-2">
                        {info.title}
                    </h4>
                    <div className="space-y-2 text-gray-600">
                        <p>{info.definition}</p>

                        {info.howMeasured && (
                            <div className="bg-gray-50 p-2 rounded text-xs border border-gray-100">
                                <span className="font-medium text-gray-900 block mb-1">Como é medido:</span>
                                {info.howMeasured}
                            </div>
                        )}

                        {info.tip && (
                            <div className="flex gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                                <span className="font-bold">Dica:</span>
                                {info.tip}
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
