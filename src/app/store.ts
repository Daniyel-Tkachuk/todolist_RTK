import { UnknownAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { authReducer, authSlice } from "features/auth/model/auth-reducer"
import { tasksReducer, tasksSlice } from "features/todolists/model/tasks-reducer"
import { todolistsReducer, todolistsSlice } from "features/todolists/model/todolists-reducer"
import { appReducer, appSlice } from "./app-reducer"
import { configureStore } from "@reduxjs/toolkit"
import { todolistsApi } from "features/todolists/api/_todolistsApi"

export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [authSlice.name]: authReducer,
    [todolistsApi.reducerPath]: todolistsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todolistsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch

// Создаем тип диспатча который принимает как AC так и TC
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

// @ts-ignore
window.store = store
