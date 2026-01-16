"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisitorData } from "@/types"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

interface TrafficChartProps {
    data: VisitorData[]
}

export function TrafficChart({ data }: TrafficChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Tráfego do Site</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#B80820" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#B80820" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0B0B0B",
                                borderRadius: "12px",
                                border: "none",
                                fontSize: "12px",
                                color: "#fff",
                            }}
                            itemStyle={{ color: "#fff" }}
                            labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#B80820"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                            name="Visitantes"
                        />
                        <Area
                            type="monotone"
                            dataKey="pageviews"
                            stroke="#555555"
                            strokeWidth={2}
                            fillOpacity={0}
                            fill="transparent"
                            name="Visualizações"
                            strokeDasharray="4 4"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
