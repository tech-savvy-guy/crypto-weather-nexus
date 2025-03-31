import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchNewsData as fetchNews } from "@/lib/api/news"
import type { NewsArticle } from "@/lib/types"

interface NewsState {
  data: NewsArticle[]
  loading: "idle" | "pending" | "succeeded" | "failed"
  error: string | null
}

const initialState: NewsState = {
  data: [],
  loading: "idle",
  error: null,
}

export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async () => {
  try {
    const data = await fetchNews()
    return data
  } catch (error) {
    throw new Error("Failed to fetch news data")
  }
})

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = "pending"
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = "failed"
        state.error = action.error.message || "Failed to fetch news data"
      })
  },
})

export default newsSlice.reducer

