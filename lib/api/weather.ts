import type { WeatherData, WeatherDetail } from "@/lib/types"

// Cities for the weather dashboard
const cities = ["London", "New York", "Tokyo", "Paris", "Sydney", "Kolkata", "Chennai"]

// Generate random weather history
function generateWeatherHistory(city: string) {
  const weatherConditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm", "Snowy", "Foggy"]
  const history = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    history.push({
      date: date.toISOString().split("T")[0],
      temperature: Math.floor(Math.random() * 35) - 5,
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
    })
  }

  return history
}

// Fetch weather data from wttr.in API
async function fetchWeatherFromApi(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      headers: {
        "User-Agent": "CryptoWeatherNexus/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${city}`)
    }

    const data = await response.json()
    const currentCondition = data.current_condition[0]

    return {
      city: city,
      temperature: Number.parseInt(currentCondition.temp_C),
      humidity: Number.parseInt(currentCondition.humidity),
      windSpeed: Number.parseInt(currentCondition.windspeedKmph),
      condition: currentCondition.weatherDesc[0].value,
    }
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error)
    // Return fallback data if API fails
    return {
      city: city,
      temperature: Math.floor(Math.random() * 35) - 5,
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      condition: "Partly Cloudy",
    }
  }
}

// Fetch weather data for all cities
export async function fetchWeatherData(): Promise<WeatherData[]> {
  try {
    // Use Promise.all to fetch data for all cities in parallel
    const weatherPromises = cities.map((city) => fetchWeatherFromApi(city))
    return await Promise.all(weatherPromises)
  } catch (error) {
    console.error("Error fetching weather data:", error)

    // Return mock data if API fails
    return cities.map((city) => ({
      city,
      temperature: Math.floor(Math.random() * 35) - 5,
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      condition: "Partly Cloudy",
    }))
  }
}

// Fetch weather details for a specific city
export async function getWeatherDetails(city: string): Promise<WeatherDetail> {
  try {
    const weatherData = await fetchWeatherFromApi(city)

    // Fetch additional data from the API
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      headers: {
        "User-Agent": "CryptoWeatherNexus/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch detailed weather data for ${city}`)
    }

    const data = await response.json()
    const currentCondition = data.current_condition[0]

    return {
      ...weatherData,
      cloudCover: Number.parseInt(currentCondition.cloudcover),
      uvIndex: Number.parseInt(currentCondition.uvIndex),
      precipitation: Number.parseFloat(currentCondition.precipMM),
      history: generateWeatherHistory(city), // Still using mock data for history
    }
  } catch (error) {
    console.error(`Error fetching weather details for ${city}:`, error)

    // Return fallback data if API fails
    const weatherData = {
      city,
      temperature: Math.floor(Math.random() * 35) - 5,
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      condition: "Partly Cloudy",
    }

    return {
      ...weatherData,
      cloudCover: Math.floor(Math.random() * 100),
      uvIndex: Math.floor(Math.random() * 11),
      precipitation: Math.floor(Math.random() * 50),
      history: generateWeatherHistory(city),
    }
  }
}

