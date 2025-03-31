"use client"

import type { PriceHistoryEntry } from "@/lib/types"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Area,
  AreaChart,
  LinearScale,
  TimeScale,
} from "@/components/ui/chart"
import { useState } from "react"

interface CryptoPriceChartProps {
  priceHistory: PriceHistoryEntry[]
}

export default function CryptoPriceChart({ priceHistory }: CryptoPriceChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<PriceHistoryEntry | null>(null)

  const data = priceHistory.map((entry) => ({
    date: new Date(entry.date),
    price: entry.price,
  }))

  return (
    <ChartContainer className="h-full">
      <Chart>
        <TimeScale />
        <LinearScale />
        <AreaChart data={data} x={(d) => d.date} y={(d) => d.price}>
          <Area
            curve="monotone"
            color="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
            className="animate-pulse-slow"
          />
          <ChartTooltip>
            {({ datum }) => (
              <ChartTooltipContent>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{datum.date.toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Price: ${datum.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </ChartTooltipContent>
            )}
          </ChartTooltip>
        </AreaChart>
      </Chart>
    </ChartContainer>
  )
}

