// Weather Types
export interface WeatherData {
  city: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
}

export interface WeatherHistoryEntry {
  date: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
}

export interface WeatherDetail extends WeatherData {
  cloudCover: number
  uvIndex: number
  precipitation: number
  history: WeatherHistoryEntry[]
}

// Crypto Types
export interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
}

export interface PriceHistoryEntry {
  date: string
  price: number
}

export interface CryptoMetric {
  name: string
  value: string
  change: number
}

export interface CryptoDetail extends CryptoData {
  rank: number
  volume24h: number
  circulatingSupply: number
  allTimeHigh: number
  description: string
  priceHistory: PriceHistoryEntry[]
  metrics: CryptoMetric[]
}

// News Types
export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: "price_alert" | "weather_alert"
  timestamp: string
}

// WebSocket Types
export interface WebSocketMessage {
  type: "price_alert" | "weather_alert"
  [key: string]: any
}

