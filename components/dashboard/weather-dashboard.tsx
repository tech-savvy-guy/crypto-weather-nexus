"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { fetchWeatherData, toggleFavorite } from "@/lib/redux/slices/weatherSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Droplets, Thermometer, Wind, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function WeatherDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error, favorites } = useSelector((state: RootState) => state.weather)

  useEffect(() => {
    dispatch(fetchWeatherData())

    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchWeatherData())
    }, 300000)

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
          <Button onClick={() => dispatch(fetchWeatherData())} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Filter favorite cities
  const favoriteCities = data.filter((city) => favorites.includes(city.city))

  // Filter non-favorite cities
  const otherCities = data.filter((city) => !favorites.includes(city.city))

  return (
    <div className="space-y-8">
      {favoriteCities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500 fill-yellow-500" />
            Favorite Cities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCities.map((city) => (
              <WeatherCard
                key={city.city}
                city={city}
                isFavorite={true}
                onToggleFavorite={() => dispatch(toggleFavorite(city.city))}
              />
            ))}
          </div>
        </div>
      )}

      {otherCities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{favoriteCities.length > 0 ? "Other Cities" : "All Cities"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCities.map((city) => (
              <WeatherCard
                key={city.city}
                city={city}
                isFavorite={false}
                onToggleFavorite={() => dispatch(toggleFavorite(city.city))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface WeatherCardProps {
  city: {
    city: string
    temperature: number
    humidity: number
    windSpeed: number
    condition: string
  }
  isFavorite: boolean
  onToggleFavorite: () => void
}

function WeatherCard({ city, isFavorite, onToggleFavorite }: WeatherCardProps) {
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()

    // Clear and sunny conditions
    if (conditionLower.includes("sunny") || conditionLower.includes("clear sky")) return "☀️"

    // Partly cloudy conditions
    if (conditionLower.includes("partly cloudy") || conditionLower.includes("scattered clouds")) return "⛅"

    // Cloudy conditions
    if (conditionLower.includes("cloudy") || conditionLower.includes("broken clouds")) return "☁️"
    if (conditionLower.includes("overcast")) return "☁️"

    // Rain conditions
    if (conditionLower.includes("light rain") || conditionLower.includes("drizzle")) return "🌦️"
    if (conditionLower.includes("moderate rain")) return "🌧️"
    if (conditionLower.includes("heavy rain") || conditionLower.includes("shower")) return "🌧️"
    if (conditionLower.includes("rain")) return "🌧️"

    // Thunderstorm conditions
    if (conditionLower.includes("thunder") || conditionLower.includes("lightning")) return "⛈️"

    // Snow conditions
    if (conditionLower.includes("light snow") || conditionLower.includes("flurries")) return "🌨️"
    if (conditionLower.includes("snow")) return "❄️"
    if (conditionLower.includes("blizzard")) return "❄️"

    // Fog and mist conditions
    if (conditionLower.includes("fog")) return "🌫️"
    if (conditionLower.includes("mist")) return "🌫️"
    if (conditionLower.includes("haze")) return "🌫️"

    // Special conditions
    if (conditionLower.includes("sleet") || conditionLower.includes("freezing rain")) return "🌨️"
    if (conditionLower.includes("hail")) return "🌨️"
    if (conditionLower.includes("dust") || conditionLower.includes("sand")) return "💨"
    if (conditionLower.includes("tornado") || conditionLower.includes("hurricane")) return "🌪️"

    // Default for clear or unknown conditions
    if (conditionLower.includes("clear")) return "🌤️"

    return "🌤️" // Default icon
  }

  return (
    <Card className="overflow-hidden gradient-card hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{city.city}</h3>
              <div className="flex items-center mt-1">
                <span className="text-3xl mr-2">{getWeatherIcon(city.condition)}</span>
                <Badge variant="secondary" className="font-normal">
                  {city.condition}
                </Badge>
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

          <div className="grid grid-cols-1 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Thermometer className="h-5 w-5 text-red-500" />
              <span className="font-medium">{city.temperature}°C</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Droplets className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Humidity: {city.humidity}%</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Wind className="h-5 w-5 text-slate-500" />
              <span className="font-medium">Wind: {city.windSpeed} km/h</span>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full mt-2 group">
            <a
              href={`https://wttr.in/${encodeURIComponent(city.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              View Details
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

