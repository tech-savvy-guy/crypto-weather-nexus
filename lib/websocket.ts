import type { WebSocketMessage } from "@/lib/types"

// Mock WebSocket implementation
export function setupWebSocket({
  onMessage,
  onError,
}: {
  onMessage: (message: WebSocketMessage) => void
  onError: (error: Error) => void
}) {
  console.log("Setting up WebSocket connection...")

  // Simulate connection established
  setTimeout(() => {
    console.log("WebSocket connection established")
  }, 500)

  // Simulate receiving price alerts
  const interval = setInterval(() => {
    const cryptos = [
      { id: "bitcoin", symbol: "BTC" },
      { id: "ethereum", symbol: "ETH" },
      { id: "cardano", symbol: "ADA" },
    ]

    const randomCrypto = cryptos[Math.floor(Math.random() * cryptos.length)]
    const price = Math.random() * 50000 + 100
    const change = Math.random() * 10 - 5 // -5% to +5%

    // Only send notification if change is significant (> 2%)
    if (Math.abs(change) > 2) {
      const message: WebSocketMessage = {
        type: "price_alert",
        id: randomCrypto.id,
        symbol: randomCrypto.symbol,
        price: price.toFixed(2),
        change,
      }

      onMessage(message)
    }
  }, 30000) // Every 30 seconds

  // Return disconnect function
  return {
    disconnect: () => {
      clearInterval(interval)
      console.log("WebSocket connection closed")
    },
  }
}

