import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchCryptoData as fetchCryptoApiData } from "@/lib/api/crypto"
import type { CryptoData } from "@/lib/types"

interface CryptoState {
  data: CryptoData[]
  loading: "idle" | "pending" | "succeeded" | "failed"
  error: string | null
  favorites: string[]
}

const initialState: CryptoState = {
  data: [],
  loading: "idle",
  error: null,
  favorites: [],
}

export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async () => {
  try {
    const data = await fetchCryptoApiData()
    return data
  } catch (error) {
    throw new Error("Failed to fetch cryptocurrency data")
  }
})

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((c) => c !== id)
      } else {
        state.favorites.push(id)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = "pending"
        state.error = null
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = "failed"
        state.error = action.error.message || "Failed to fetch cryptocurrency data"
      })
  },
})

export const { toggleFavorite } = cryptoSlice.actions
export default cryptoSlice.reducer

