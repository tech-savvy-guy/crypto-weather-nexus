import { configureStore } from "@reduxjs/toolkit"
import weatherReducer from "./slices/weatherSlice"
import cryptoReducer from "./slices/cryptoSlice"
import newsReducer from "./slices/newsSlice"
import notificationsReducer from "./slices/notificationsSlice"

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

