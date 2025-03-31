"use client"

import type { WeatherHistoryEntry } from "@/lib/types"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  LinearScale,
  TimeScale,
} from "@/components/ui/chart"
import { useState } from "react"

interface WeatherHistoryChartProps {
  history: WeatherHistoryEntry[]
}

export default function WeatherHistoryChart({ history }: WeatherHistoryChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<WeatherHistoryEntry | null>(null)

  const data = history.map((entry) => ({
    date: new Date(entry.date),
    temperature: entry.temperature,
  }))

  return (
    <ChartContainer className="h-full">
      <Chart>
        <TimeScale />
        <LinearScale />
        <LineChart data={data} x={(d) => d.date} y={(d) => d.temperature}>
          <Line curve="monotone" color="hsl(var(--primary))" strokeWidth={2} className="animate-pulse-slow" />
          <ChartTooltip>
            {({ datum }) => (
              <ChartTooltipContent>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{datum.date.toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Temperature: {datum.temperature}°C</p>
                </div>
              </ChartTooltipContent>
            )}
          </ChartTooltip>
        </LineChart>
      </Chart>
    </ChartContainer>
  )
}

