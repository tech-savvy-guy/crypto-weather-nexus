import type { WeatherHistoryEntry } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface WeatherHistoryTableProps {
  history: WeatherHistoryEntry[]
}

export default function WeatherHistoryTable({ history }: WeatherHistoryTableProps) {
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
    if (conditionLower.includes("rain") || conditionLower.includes("rainy")) return "🌧️"

    // Thunderstorm conditions
    if (conditionLower.includes("thunder") || conditionLower.includes("lightning")) return "⛈️"

    // Snow conditions
    if (conditionLower.includes("light snow") || conditionLower.includes("flurries")) return "🌨️"
    if (conditionLower.includes("snow") || conditionLower.includes("snowy")) return "❄️"
    if (conditionLower.includes("blizzard")) return "❄️"

    // Fog and mist conditions
    if (conditionLower.includes("fog") || conditionLower.includes("foggy")) return "🌫️"
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
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Humidity</TableHead>
            <TableHead>Wind</TableHead>
            <TableHead>Condition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry) => (
            <TableRow key={entry.date} className="hover:bg-secondary/30">
              <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
              <TableCell>{entry.temperature}°C</TableCell>
              <TableCell>{entry.humidity}%</TableCell>
              <TableCell>{entry.windSpeed} km/h</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{getWeatherIcon(entry.condition)}</span>
                  <Badge variant="outline" className="font-normal">
                    {entry.condition}
                  </Badge>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

