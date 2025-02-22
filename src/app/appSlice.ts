import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export const appSlice = createSlice({
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
    setAppStatus: creators.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppError: creators.reducer<{ error: null | string }>((state, action) => {
      state.error = action.payload.error
    }),
  }),
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectAppError: (state) => state.error,
  },
})

export const appReducer = appSlice.reducer
export const { changeTheme, setAppStatus, setAppError } = appSlice.actions
export const { selectThemeMode, selectStatus, selectAppError } = appSlice.selectors
