import type { WebSocketMessage } from "@/lib/types"

// Store previous prices to calculate percentage changes
const previousPrices: Record<string, number> = {}

// CoinCap WebSocket implementation
export function setupWebSocket({
  onMessage,
  onError,
}: {
  onMessage: (message: WebSocketMessage) => void
  onError: (error: Error) => void
}) {
  console.log("Setting up CoinCap WebSocket connection...")

  // Define the cryptocurrencies we want to track
  const cryptos = ["bitcoin", "ethereum", "solana"]

  // Create WebSocket connection to CoinCap
  const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`)

  // Initialize connection
  ws.onopen = () => {
    console.log("CoinCap WebSocket connection established")
  }

  // Handle incoming messages
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      // Process each cryptocurrency in the response
      Object.entries(data).forEach(([id, priceStr]) => {
        const currentPrice = Number.parseFloat(priceStr as string)

        // Skip if we don't have a previous price to compare (first message)
        if (previousPrices[id] === undefined) {
          previousPrices[id] = currentPrice
          return
        }

        // Calculate percentage change
        const previousPrice = previousPrices[id]
        const change = ((currentPrice - previousPrice) / previousPrice) * 100

        // Only send notification if change is significant (> 0.5%)
        if (Math.abs(change) > 0.5) {
          // Get symbol based on ID
          const symbol = getSymbolFromId(id)

          const message: WebSocketMessage = {
            type: "price_alert",
            id: id,
            symbol: symbol,
            price: currentPrice.toFixed(2),
            change: Number.parseFloat(change.toFixed(2)),
          }

          onMessage(message)
        }

        // Update previous price
        previousPrices[id] = currentPrice
      })
    } catch (error) {
      console.error("Error processing WebSocket message:", error)
    }
  }

  // Handle errors
  ws.onerror = (error) => {
    console.error("WebSocket error:", error)
    onError(new Error("WebSocket connection error"))
  }

  // Handle connection close
  ws.onclose = (event) => {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)

    // Attempt to reconnect after a delay if the connection was closed unexpectedly
    if (event.code !== 1000) {
      // 1000 is normal closure
      console.log("Attempting to reconnect in 5 seconds...")
      setTimeout(() => {
        setupWebSocket({ onMessage, onError })
      }, 5000)
    }
  }

  // Return disconnect function
  return {
    disconnect: () => {
      ws.close()
      console.log("WebSocket connection closed")
    },
  }
}

// Helper function to get symbol from ID
function getSymbolFromId(id: string): string {
  switch (id) {
    case "bitcoin":
      return "BTC"
    case "ethereum":
      return "ETH"
    case "solana":
      return "SOL"
    default:
      // Capitalize first letter as a fallback
      return id.charAt(0).toUpperCase() + id.slice(1, 3).toUpperCase()
  }
}

