"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { fetchCryptoData, toggleFavorite } from "@/lib/redux/slices/cryptoSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingDown, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function CryptoDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error, favorites } = useSelector((state: RootState) => state.crypto)

  useEffect(() => {
    dispatch(fetchCryptoData())

    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchCryptoData())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  if (loading === "pending" && !data.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-muted-foreground mb-4 text-center">{error}</p>
          <Button onClick={() => dispatch(fetchCryptoData())} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {favorites.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500 fill-yellow-500" />
            Favorite Cryptocurrencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data
              .filter((crypto) => favorites.includes(crypto.id))
              .map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  crypto={crypto}
                  isFavorite={favorites.includes(crypto.id)}
                  onToggleFavorite={() => dispatch(toggleFavorite(crypto.id))}
                />
              ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">All Cryptocurrencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              isFavorite={favorites.includes(crypto.id)}
              onToggleFavorite={() => dispatch(toggleFavorite(crypto.id))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface CryptoCardProps {
  crypto: {
    id: string
    name: string
    symbol: string
    price: number
    change24h: number
    marketCap: number
  }
  isFavorite: boolean
  onToggleFavorite: () => void
}

function CryptoCard({ crypto, isFavorite, onToggleFavorite }: CryptoCardProps) {
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
    <Card className="overflow-hidden gradient-card hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <span className="text-2xl mr-2 font-mono">{getCryptoIcon(crypto.id)}</span>
              <div>
                <h3 className="text-xl font-semibold">{crypto.name}</h3>
                <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorite}
              className={`rounded-full ${isFavorite ? "text-yellow-500" : ""}`}
            >
              <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold">
              ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${isPositiveChange ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
            >
              {isPositiveChange ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">{Math.abs(crypto.change24h).toFixed(2)}%</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Market Cap: ${crypto.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <Button asChild variant="outline" className="w-full mt-2 group">
            <Link href={`/crypto/${crypto.id}`} className="flex items-center justify-center">
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

