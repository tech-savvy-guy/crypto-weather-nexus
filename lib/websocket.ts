import type { WebSocketMessage } from "@/lib/types"

// Store previous prices from WebSocket for notification comparison only
const previousPrices: Record<string, number> = {}
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 5000 // 5 seconds

// CoinCap WebSocket implementation for notifications only
export function setupWebSocket({
  onMessage,
  onError,
}: {
  onMessage: (message: WebSocketMessage) => void
  onError: (error: Error) => void
}) {
  console.log("Setting up WebSocket for price notifications...")

  // Define the cryptocurrencies we want to track
  const cryptos = ["bitcoin", "ethereum", "solana"]

  // Try to establish WebSocket connection
  let ws: WebSocket | null = null

  function connectWebSocket() {
    try {
      // Create WebSocket connection to CoinCap
      ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptos.join(",")}`)

      // Initialize connection
      ws.onopen = () => {
        console.log("CoinCap WebSocket connection established for notifications")
        reconnectAttempts = 0 // Reset reconnect attempts on successful connection
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

            // Only send notification if change is significant (> 0.05%)
            if (Math.abs(change) > 0.05) {
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
        // and we haven't exceeded max reconnect attempts
        if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          // 1000 is normal closure
          reconnectAttempts++
          const delay = RECONNECT_DELAY * reconnectAttempts // Exponential backoff
          console.log(
            `Attempting to reconnect in ${delay / 1000} seconds... (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
          )

          setTimeout(() => {
            connectWebSocket()
          }, delay)
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.log("Max reconnect attempts reached. Notifications may not be available.")
          onError(new Error("Failed to establish WebSocket connection after multiple attempts"))
        }
      }
    } catch (error) {
      console.error("Error setting up WebSocket:", error)
      onError(new Error("Failed to set up WebSocket connection"))
    }
  }

  // Start with WebSocket connection attempt
  connectWebSocket()

  // Return disconnect function
  return {
    disconnect: () => {
      if (ws) {
        ws.close()
        ws = null
      }
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

