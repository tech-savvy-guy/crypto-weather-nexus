import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchWeatherData as fetchWeatherApiData } from "@/lib/api/weather"
import type { WeatherData } from "@/lib/types"

interface WeatherState {
  data: WeatherData[]
  loading: "idle" | "pending" | "succeeded" | "failed"
  error: string | null
  favorites: string[]
  lastUpdated: string | null
}

const initialState: WeatherState = {
  data: [],
  loading: "idle",
  error: null,
  favorites: [],
  lastUpdated: null,
}

export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async () => {
  try {
    const data = await fetchWeatherApiData()
    return data
  } catch (error) {
    throw new Error("Failed to fetch weather data")
  }
})

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const city = action.payload
      if (state.favorites.includes(city)) {
        state.favorites = state.favorites.filter((c) => c !== city)
      } else {
        state.favorites.push(city)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = "pending"
        state.error = null
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = "succeeded"
        state.data = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = "failed"
        state.error = action.error.message || "Failed to fetch weather data"
      })
  },
})

export const { toggleFavorite } = weatherSlice.actions
export default weatherSlice.reducer

