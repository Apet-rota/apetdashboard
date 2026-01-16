"use client"

import { useMemo } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import { Tooltip } from "react-tooltip"

// URLs for Map Topologies
const GEO_URL_WORLD = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const GEO_URL_BRAZIL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson"

interface GeoMapProps {
    data: { name: string, value: number }[]
    scope: "world" | "br"
}

export function GeoMap({ data, scope }: GeoMapProps) {
    const geoUrl = scope === "world" ? GEO_URL_WORLD : GEO_URL_BRAZIL

    // Scale for coloring
    const colorScale = useMemo(() => {
        const max = Math.max(...data.map(d => d.value), 0)
        return scaleLinear<string>()
            .domain([0, max])
            .range(["#F5F5F5", "#B80820"]) // Grey to APET Red
    }, [data])

    // Normalize data for lookup
    // World map uses ISO codes or names, Brazil uses State names. 
    // GA4 returns "Brazil", "United States". World atlas uses names in properties.name or similar.
    // Brazil geojson: properties.name
    const dataMap = useMemo(() => {
        const map = new Map<string, number>()
        data.forEach(d => {
            // Simple normalization: lower case
            map.set(d.name.toLowerCase(), d.value)

            // Handle some common GA4 vs Map mismatches if needed
            if (d.name === "United States") map.set("united states of america", d.value)
        })
        return map
    }, [data])

    return (
        <div className="relative w-full h-[300px] bg-gray-50/50 rounded-lg overflow-hidden border border-gray-100">
            <ComposableMap projection={scope === "world" ? "geoMercator" : "geoMercator"}
                projectionConfig={scope === "br" ? { scale: 600, center: [-54, -15] } : { scale: 100 }}
            >
                <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={4}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                // Resolve name
                                const geoName = (geo.properties.name || geo.properties.NAME || "").toString().toLowerCase()
                                const value = dataMap.get(geoName) || 0

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={value > 0 ? colorScale(value) : "#E5E7EB"}
                                        stroke="#FFFFFF"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: "#1E293B", outline: "none", cursor: "pointer" },
                                            pressed: { outline: "none" }
                                        }}
                                        data-tooltip-id="geo-tooltip"
                                        data-tooltip-content={`${geo.properties.name || geo.properties.NAME}: ${value}`}
                                    />
                                )
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
            <Tooltip id="geo-tooltip" style={{ backgroundColor: "#0B0B0B", color: "#FFF", borderRadius: "8px" }} />
        </div>
    )
}
