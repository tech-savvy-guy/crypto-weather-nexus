"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { addNotification } from "@/lib/redux/slices/notificationsSlice"
import { setupWebSocket } from "@/lib/websocket"
import { TrendingUp, X } from "lucide-react"
import { toast } from "sonner"
import type { WeatherData } from "@/lib/types"
import { Mona_Sans as FontSans } from "next/font/google"

// Get the fontSans variable from the layout
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function NotificationsProvider() {
  const dispatch = useDispatch<AppDispatch>()
  const weatherData = useSelector((state: RootState) => state.weather.data)
  const previousWeatherRef = useRef<WeatherData[]>([])

  // Weather notifications are disabled as per user request
  // We're keeping the refs and data for potential future use
  useEffect(() => {
    previousWeatherRef.current = [...weatherData]
  }, [weatherData])

  useEffect(() => {
    // Set up WebSocket connection for crypto price alerts
    const { disconnect } = setupWebSocket({
      onMessage: (message) => {
        if (message.type === "price_alert") {
          const notification = {
            id: Date.now().toString(),
            title: "Price Alert",
            message: `${message.symbol}: ${message.price} (${message.change >= 0 ? "+" : ""}${message.change}%)`,
            type: "price_alert",
            timestamp: new Date().toISOString(),
          }

          dispatch(addNotification(notification))

          toast.custom(
            (t) => (
              <div className="custom-toast-wrapper font-sans">
                <div className="custom-toast-icon-container price">
                  <TrendingUp className="custom-toast-icon" />
                </div>
                <div className="custom-toast-content">
                  <div className="custom-toast-title">{notification.title}</div>
                  <div className="custom-toast-message">{notification.message}</div>
                </div>
                <button className="custom-toast-close" onClick={() => toast.dismiss(t)}>
                  <X size={14} />
                </button>
              </div>
            ),
            {
              duration: 5000,
            },
          )
        }
      },
      onError: (error) => {
        console.error("WebSocket error:", error)
      },
    })

    return () => {
      disconnect()
    }
  }, [dispatch])

  return null
}

