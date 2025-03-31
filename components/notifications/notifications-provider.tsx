"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { addNotification } from "@/lib/redux/slices/notificationsSlice"
import { setupWebSocket } from "@/lib/websocket"
import { AlertTriangle, TrendingUp, X } from "lucide-react"
import { toast } from "sonner"
import type { WeatherData } from "@/lib/types"

export default function NotificationsProvider() {
  const dispatch = useDispatch<AppDispatch>()
  const weatherData = useSelector((state: RootState) => state.weather.data)
  const previousWeatherRef = useRef<WeatherData[]>([])

  // Check for weather changes and create notifications
  useEffect(() => {
    if (weatherData.length === 0 || previousWeatherRef.current.length === 0) {
      // Initialize previous weather data on first load
      previousWeatherRef.current = [...weatherData]
      return
    }

    // Compare current weather with previous weather
    weatherData.forEach((currentCity) => {
      const prevCity = previousWeatherRef.current.find((city) => city.city === currentCity.city)

      if (prevCity) {
        // Check for condition change
        if (prevCity.condition !== currentCity.condition) {
          createWeatherNotification(
            currentCity.city,
            `Weather changed from ${prevCity.condition} to ${currentCity.condition}`,
          )
        }

        // Check for significant temperature change (more than 2 degrees)
        const tempDiff = Math.abs(prevCity.temperature - currentCity.temperature)
        if (tempDiff >= 2) {
          const direction = currentCity.temperature > prevCity.temperature ? "increased" : "decreased"
          createWeatherNotification(
            currentCity.city,
            `Temperature ${direction} from ${prevCity.temperature}°C to ${currentCity.temperature}°C`,
          )
        }
      }
    })

    // Update previous weather data reference
    previousWeatherRef.current = [...weatherData]
  }, [weatherData, dispatch])

  // Function to create weather notifications
  const createWeatherNotification = (city: string, alert: string) => {
    const notification = {
      id: Date.now().toString(),
      title: "Weather Alert",
      message: `${city}: ${alert}`,
      type: "weather_alert" as const,
      timestamp: new Date().toISOString(),
    }

    dispatch(addNotification(notification))

    toast.custom(
      (t) => (
        <div className="custom-toast-wrapper">
          <div className="custom-toast-icon-container weather">
            <AlertTriangle className="custom-toast-icon" />
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
              <div className="custom-toast-wrapper">
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

