import type { CryptoData, CryptoDetail, PriceHistoryEntry, CryptoMetric } from "@/lib/types"

// Get API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

// List of cryptocurrencies to fetch
const CRYPTO_IDS = ["bitcoin", "ethereum", "solana"]

// CoinGecko API base URL
const API_BASE_URL = "https://api.coingecko.com/api/v3"

// Helper function to format API URL with key
const formatApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}?x_cg_pro_api_key=${API_KEY}`
}

// Fetch crypto data from CoinGecko API
export async function fetchCryptoData(): Promise<CryptoData[]> {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.error("CoinGecko API key is not configured")
      return generateCryptoData() // Fallback to mock data
    }

    // Fetch data for multiple coins
    const response = await fetch(
      formatApiUrl(
        `/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(",")}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
      ),
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto data: ${response.status}`)
    }

    const data = await response.json()

    // Map CoinGecko response to our CryptoData type
    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap || 0,
    }))
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    // Return mock data if API call fails
    return generateCryptoData()
  }
}

// Fetch crypto details for a specific cryptocurrency
export async function getCryptoDetails(id: string): Promise<CryptoDetail> {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.error("CoinGecko API key is not configured")
      // Fallback to mock data
      const cryptoData = generateCryptoData().find((c) => c.id === id)
      if (!cryptoData) {
        throw new Error(`Crypto data not found for ${id}`)
      }
      return generateCryptoDetail(cryptoData)
    }

    // Fetch detailed data for the specific coin
    const response = await fetch(formatApiUrl(`/coins/${id}`))

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto details: ${response.status}`)
    }

    const data = await response.json()

    // Fetch price history data from the market_chart endpoint
    const historyResponse = await fetch(
      formatApiUrl(`/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`),
    )

    if (!historyResponse.ok) {
      throw new Error(`Failed to fetch price history: ${historyResponse.status}`)
    }

    const historyData = await historyResponse.json()

    // Convert price history data to our format
    const priceHistory: PriceHistoryEntry[] = historyData.prices.map((item: [number, number]) => {
      const [timestamp, price] = item
      return {
        date: new Date(timestamp).toISOString().split("T")[0], // Format as YYYY-MM-DD
        price: price,
      }
    })

    // Generate metrics from available data
    const metrics: CryptoMetric[] = [
      {
        name: "Trading Volume",
        value: `$${formatNumber(data.market_data.total_volume.usd)}`,
        change: data.market_data.price_change_percentage_24h || 0,
      },
      {
        name: "Market Dominance",
        value: `${((data.market_data.market_cap.usd / 2000000000000) * 100).toFixed(2)}%`, // Approximation
        change: data.market_data.market_cap_change_percentage_24h || 0,
      },
      {
        name: "Volatility Index",
        value: (Math.abs(data.market_data.price_change_percentage_24h || 0) / 2).toFixed(2),
        change: data.market_data.price_change_percentage_7d || 0,
      },
      {
        name: "Social Sentiment",
        value: data.sentiment_votes_up_percentage ? `${data.sentiment_votes_up_percentage.toFixed(2)}%` : "N/A",
        change: data.sentiment_votes_up_percentage ? (data.sentiment_votes_up_percentage - 50) / 5 : 0,
      },
      {
        name: "Developer Activity",
        value: data.developer_data?.commit_count_4_weeks?.toString() || "N/A",
        change: 0, // No change data available
      },
      {
        name: "Active Addresses",
        value: formatNumber(Math.random() * 1000000), // Not available in API, using mock
        change: Math.random() * 20 - 10,
      },
    ]

    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h || 0,
      marketCap: data.market_data.market_cap.usd,
      rank: data.market_cap_rank || 0,
      volume24h: data.market_data.total_volume.usd || 0,
      circulatingSupply: data.market_data.circulating_supply || 0,
      allTimeHigh: data.market_data.ath.usd || 0,
      description:
        data.description?.en?.split(". ").slice(0, 3).join(". ") + "." || `${data.name} is a cryptocurrency.`,
      priceHistory: priceHistory,
      metrics: metrics,
    }
  } catch (error) {
    console.error(`Error fetching crypto details for ${id}:`, error)

    // Fallback to mock data
    const cryptoData = generateCryptoData().find((c) => c.id === id)
    if (!cryptoData) {
      throw new Error(`Crypto data not found for ${id}`)
    }

    return generateCryptoDetail(cryptoData)
  }
}

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K"
  }
  return num.toString()
}

// Generate mock crypto data for fallback
function generateCryptoData(): CryptoData[] {
  return CRYPTO_IDS.map((id) => {
    const name = id.charAt(0).toUpperCase() + id.slice(1)
    const symbol = id.substring(0, 3).toUpperCase()
    return {
      id,
      name,
      symbol,
      price: Math.random() * 50000 + 100, // $100 to $50,100
      change24h: Math.random() * 20 - 10, // -10% to +10%
      marketCap: Math.random() * 1000000000000, // $0 to $1 trillion
    }
  })
}

// Generate random price history
function generatePriceHistory(basePrice: number): PriceHistoryEntry[] {
  const history = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Random price fluctuation around base price
    const fluctuation = Math.random() * 0.2 - 0.1 // -10% to +10%
    const price = basePrice * (1 + fluctuation)

    history.push({
      date: date.toISOString().split("T")[0],
      price,
    })
  }

  return history
}

// Generate detailed crypto data for fallback
function generateCryptoDetail(cryptoData: CryptoData): CryptoDetail {
  return {
    ...cryptoData,
    rank: Math.floor(Math.random() * 100) + 1,
    volume24h: Math.random() * 10000000000,
    circulatingSupply: Math.random() * 1000000000,
    allTimeHigh: cryptoData.price * (1 + Math.random() * 0.5),
    description: `${cryptoData.name} is a decentralized digital currency that can be transferred on the peer-to-peer ${cryptoData.name} network. ${cryptoData.name} transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.`,
    priceHistory: generatePriceHistory(cryptoData.price),
    metrics: generateCryptoMetrics(),
  }
}

// Generate random metrics for crypto details
function generateCryptoMetrics(): CryptoMetric[] {
  const metricNames = [
    "Trading Volume",
    "Market Dominance",
    "Volatility Index",
    "Social Sentiment",
    "Developer Activity",
    "Active Addresses",
  ]

  return metricNames.map((name) => ({
    name,
    value: name.includes("Volume")
      ? `$${(Math.random() * 10000000000).toLocaleString()}`
      : name.includes("Dominance")
        ? `${(Math.random() * 100).toFixed(2)}%`
        : (Math.random() * 1000).toFixed(2),
    change: Math.random() * 20 - 10, // -10% to +10%
  }))
}

