import type { CryptoData, CryptoDetail } from "@/lib/types"

// Mock data for cryptocurrencies
const cryptos = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
]

// Generate random crypto data
function generateCryptoData(): CryptoData[] {
  return cryptos.map((crypto) => ({
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    price: Math.random() * 50000 + 100, // $100 to $50,100
    change24h: Math.random() * 20 - 10, // -10% to +10%
    marketCap: Math.random() * 1000000000000, // $0 to $1 trillion
  }))
}

// Generate random price history
function generatePriceHistory(basePrice: number) {
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

// Generate random metrics for crypto details
function generateCryptoMetrics() {
  const metricNames = [
    "Trading Volume",
    "Market Dominance",
    "Volatility Index",
    "Social Sentiment",
    "Developer Activity",
    "Network Hash Rate",
    "Active Addresses",
  ]

  return metricNames.map((name) => ({
    name,
    value: name.includes("Volume")
      ? `$${(Math.random() * 10000000000).toLocaleString()}`
      : name.includes("Rate")
        ? `${(Math.random() * 1000000).toLocaleString()} H/s`
        : name.includes("Dominance")
          ? `${(Math.random() * 100).toFixed(2)}%`
          : (Math.random() * 1000).toFixed(2),
    change: Math.random() * 20 - 10, // -10% to +10%
  }))
}

// Fetch crypto data
export async function fetchCryptoData(): Promise<CryptoData[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return generateCryptoData()
}

// Fetch crypto details for a specific cryptocurrency
export async function getCryptoDetails(id: string): Promise<CryptoDetail> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const crypto = cryptos.find((c) => c.id === id)

  if (!crypto) {
    throw new Error(`Crypto data not found for ${id}`)
  }

  const cryptoData = generateCryptoData().find((c) => c.id === id)

  if (!cryptoData) {
    throw new Error(`Crypto data not found for ${id}`)
  }

  return {
    ...cryptoData,
    rank: Math.floor(Math.random() * 100) + 1,
    volume24h: Math.random() * 10000000000,
    circulatingSupply: Math.random() * 1000000000,
    allTimeHigh: cryptoData.price * (1 + Math.random() * 0.5),
    description: `${crypto.name} is a decentralized digital currency that can be transferred on the peer-to-peer ${crypto.name} network. ${crypto.name} transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.`,
    priceHistory: generatePriceHistory(cryptoData.price),
    metrics: generateCryptoMetrics(),
  }
}

