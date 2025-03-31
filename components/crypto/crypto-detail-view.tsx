"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { toggleFavorite } from "@/lib/redux/slices/cryptoSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingDown, TrendingUp, DollarSign, BarChart3, Activity, Hash } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CryptoDetail } from "@/lib/types"
import CryptoPriceChart from "./crypto-price-chart"
import CryptoMetricsTable from "./crypto-metrics-table"
import { Badge } from "@/components/ui/badge"

interface CryptoDetailViewProps {
  crypto: CryptoDetail
}

export default function CryptoDetailView({ crypto }: CryptoDetailViewProps) {
  const dispatch = useDispatch<AppDispatch>()
  const favorites = useSelector((state: RootState) => state.crypto.favorites)
  const isFavorite = favorites.includes(crypto.id)
  const isPositiveChange = crypto.change24h >= 0

  // Get crypto icon
  const getCryptoIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case "bitcoin":
        return "₿"
      case "ethereum":
        return "Ξ"
      case "cardano":
        return "₳"
      default:
        return "🪙"
    }
  }

  return (
    <div className="space-y-8">
      <Card className="gradient-card overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-mono">{getCryptoIcon(crypto.id)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{crypto.name}</CardTitle>
                  <Badge variant="outline" className="font-mono font-normal">
                    {crypto.symbol}
                  </Badge>
                </div>
                <CardDescription className="flex items-center mt-1">
                  <Hash className="h-3 w-3 mr-1" />
                  Rank #{crypto.rank}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleFavorite(crypto.id))}
              className={`rounded-full ${isFavorite ? "text-yellow-500" : ""}`}
            >
              <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold">
                  ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full ${isPositiveChange ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                >
                  {isPositiveChange ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium">{Math.abs(crypto.change24h).toFixed(2)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-medium">
                      ${crypto.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Volume (24h)</div>
                    <div className="font-medium">
                      ${crypto.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Circulating Supply</div>
                    <div className="font-medium">
                      {crypto.circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })} {crypto.symbol}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">All-Time High</div>
                    <div className="font-medium">
                      ${crypto.allTimeHigh.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-3">About {crypto.name}</h3>
              <p className="text-muted-foreground leading-relaxed">{crypto.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12 rounded-full p-1">
          <TabsTrigger
            value="chart"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Price Chart
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4 animate-in">
          <Card className="gradient-card overflow-hidden">
            <CardHeader>
              <CardTitle>Price History (Last 30 Days)</CardTitle>
              <CardDescription>Historical price data for {crypto.name}</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <CryptoPriceChart priceHistory={crypto.priceHistory} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4 animate-in">
          <Card className="gradient-card overflow-hidden">
            <CardHeader>
              <CardTitle>Extended Metrics</CardTitle>
              <CardDescription>Detailed metrics for {crypto.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <CryptoMetricsTable metrics={crypto.metrics} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

