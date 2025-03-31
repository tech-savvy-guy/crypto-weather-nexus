"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Chart = React.forwardRef<HTMLDivElement, ChartProps>(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("h-full w-full", className)} ref={ref} {...props}>
      {children}
    </div>
  )
})
Chart.displayName = "Chart"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("h-full w-full", className)} ref={ref} {...props}>
        {children}
      </div>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipProps {
  children: React.ReactNode
}

export const ChartTooltip = ({ children }: ChartTooltipProps) => {
  return <>{children}</>
}

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-popover p-4 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface LineChartProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[]
  x: (d: T) => string | number | Date
  y: (d: T) => number
  children: React.ReactNode
}

export const LineChart = <T extends {}>({ data, x, y, children, ...props }: LineChartProps<T>) => {
  // Convert data to SVG coordinates
  const svgData = React.useMemo(() => {
    if (!data.length) return []

    // Get min and max values for x and y
    const xValues = data.map((d) => new Date(x(d)).getTime())
    const yValues = data.map((d) => y(d))

    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues) * 0.9 // Add some padding
    const yMax = Math.max(...yValues) * 1.1

    // Convert to SVG coordinates (0,0 is top-left)
    return data.map((d) => ({
      original: d,
      x: ((new Date(x(d)).getTime() - xMin) / (xMax - xMin)) * 100,
      y: 100 - ((y(d) - yMin) / (yMax - yMin)) * 100,
    }))
  }, [data, x, y])

  return (
    <div className="relative h-full w-full" {...props}>
      <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null
          return React.cloneElement(child as React.ReactElement, { data: svgData })
        })}
      </svg>
    </div>
  )
}

interface AreaChartProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[]
  x: (d: T) => string | number | Date
  y: (d: T) => number
  children: React.ReactNode
}

export const AreaChart = <T extends {}>({ data, x, y, children, ...props }: AreaChartProps<T>) => {
  // Convert data to SVG coordinates
  const svgData = React.useMemo(() => {
    if (!data.length) return []

    // Get min and max values for x and y
    const xValues = data.map((d) => new Date(x(d)).getTime())
    const yValues = data.map((d) => y(d))

    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues) * 0.9 // Add some padding
    const yMax = Math.max(...yValues) * 1.1

    // Convert to SVG coordinates (0,0 is top-left)
    return data.map((d) => ({
      original: d,
      x: ((new Date(x(d)).getTime() - xMin) / (xMax - xMin)) * 100,
      y: 100 - ((y(d) - yMin) / (yMax - yMin)) * 100,
    }))
  }, [data, x, y])

  return (
    <div className="relative h-full w-full" {...props}>
      <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null
          return React.cloneElement(child as React.ReactElement, { data: svgData })
        })}
      </svg>
    </div>
  )
}

interface ScaleProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LinearScale = ({ ...props }: ScaleProps) => {
  return <g {...props} className="text-muted-foreground text-xs"></g>
}

export const TimeScale = ({ ...props }: ScaleProps) => {
  return <g {...props} className="text-muted-foreground text-xs"></g>
}

interface LineProps extends React.SVGProps<SVGPathElement> {
  data: Array<{ x: number; y: number; original: any }>
  curve?: "linear" | "monotone" | "step"
  color?: string
  strokeWidth?: number
}

export const Line = ({
  data,
  curve = "linear",
  color = "hsl(var(--primary))",
  strokeWidth = 2,
  ...props
}: LineProps) => {
  const path = React.useMemo(() => {
    if (!data.length) return ""

    let pathString = `M ${data[0].x},${data[0].y}`

    for (let i = 1; i < data.length; i++) {
      pathString += ` L ${data[i].x},${data[i].y}`
    }

    return pathString
  }, [data])

  return <path d={path} stroke={color} strokeWidth={strokeWidth} fill="none" {...props} />
}

interface AreaProps extends React.SVGProps<SVGPathElement> {
  data: Array<{ x: number; y: number; original: any }>
  curve?: "linear" | "monotone" | "step"
  color?: string
  fillOpacity?: number
  strokeWidth?: number
}

export const Area = ({
  data,
  curve = "linear",
  color = "hsl(var(--primary))",
  fillOpacity = 0.2,
  strokeWidth = 2,
  ...props
}: AreaProps) => {
  const path = React.useMemo(() => {
    if (!data.length) return ""

    let pathString = `M ${data[0].x},${data[0].y}`

    for (let i = 1; i < data.length; i++) {
      pathString += ` L ${data[i].x},${data[i].y}`
    }

    // Complete the area by drawing to the bottom right and then bottom left
    pathString += ` L ${data[data.length - 1].x},100 L ${data[0].x},100 Z`

    return pathString
  }, [data])

  return <path d={path} stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={fillOpacity} {...props} />
}

