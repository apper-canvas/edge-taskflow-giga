import { configureStore } from "@reduxjs/toolkit"
import authSlice from "@/store/slices/authSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice
  }
})