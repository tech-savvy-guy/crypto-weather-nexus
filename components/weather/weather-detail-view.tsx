"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { toggleFavorite } from "@/lib/redux/slices/weatherSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Droplets, Thermometer, Wind, Cloud, Sun, Umbrella } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WeatherDetail } from "@/lib/types"
import WeatherHistoryChart from "./weather-history-chart"
import WeatherHistoryTable from "./weather-history-table"
import { Badge } from "@/components/ui/badge"

interface WeatherDetailViewProps {
  weather: WeatherDetail
}

export default function WeatherDetailView({ weather }: WeatherDetailViewProps) {
  const dispatch = useDispatch<AppDispatch>()
  const favorites = useSelector((state: RootState) => state.weather.favorites)
  const isFavorite = favorites.includes(weather.city)

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
    <div className="space-y-8">
      <Card className="gradient-card overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getWeatherIcon(weather.condition)}</span>
              <div>
                <CardTitle className="text-2xl">{weather.city}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-1 font-normal">
                    {weather.condition}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleFavorite(weather.city))}
              className={`rounded-full ${isFavorite ? "text-yellow-500" : ""}`}
            >
              <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm text-muted-foreground">Temperature</div>
                <div className="font-medium">{weather.temperature}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Humidity</div>
                <div className="font-medium">{weather.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <Wind className="h-5 w-5 text-slate-500" />
              <div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
                <div className="font-medium">{weather.windSpeed} km/h</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <Cloud className="h-5 w-5 text-blue-300" />
              <div>
                <div className="text-sm text-muted-foreground">Cloud Cover</div>
                <div className="font-medium">{weather.cloudCover}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <Sun className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-sm text-muted-foreground">UV Index</div>
                <div className="font-medium">{weather.uvIndex}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <Umbrella className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-sm text-muted-foreground">Precipitation</div>
                <div className="font-medium">{weather.precipitation} mm</div>
              </div>
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
            Chart
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4 animate-in">
          <Card className="gradient-card overflow-hidden">
            <CardHeader>
              <CardTitle>Temperature History (Last 7 Days)</CardTitle>
              <CardDescription>Historical temperature data for {weather.city}</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <WeatherHistoryChart history={weather.history} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4 animate-in">
          <Card className="gradient-card overflow-hidden">
            <CardHeader>
              <CardTitle>Weather History (Last 7 Days)</CardTitle>
              <CardDescription>Historical weather data for {weather.city}</CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherHistoryTable history={weather.history} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

