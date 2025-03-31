import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Notification } from "@/lib/types"

interface NotificationsState {
  items: Notification[]
}

const initialState: NotificationsState = {
  items: [],
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload)
      // Keep only the latest 10 notifications
      if (state.items.length > 10) {
        state.items = state.items.slice(0, 10)
      }
    },
    clearNotifications: (state) => {
      state.items = []
    },
  },
})

export const { addNotification, clearNotifications } = notificationsSlice.actions
export default notificationsSlice.reducer

