import type { CryptoMetric } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingDown, TrendingUp } from "lucide-react"

interface CryptoMetricsTableProps {
  metrics: CryptoMetric[]
}

export default function CryptoMetricsTable({ metrics }: CryptoMetricsTableProps) {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Metric</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Change (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.name} className="hover:bg-secondary/30">
              <TableCell className="font-medium">{metric.name}</TableCell>
              <TableCell>{metric.value}</TableCell>
              <TableCell className="text-right">
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${metric.change >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                >
                  {metric.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(metric.change).toFixed(2)}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

