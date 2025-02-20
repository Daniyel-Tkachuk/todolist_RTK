import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatus,
    themeMode: "light" as ThemeMode,
    error: null as string | null,
  },
  reducers: (creators) => ({
    changeTheme: creators.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setStatus: creators.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setError: creators.reducer<{ error: null | string }>((state, action) => {
      state.error = action.payload.error
    }),
  }),
})

export const appReducer = appSlice.reducer
export const { changeTheme, setStatus, setError } = appSlice.actions
