import { UnknownAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { tasksReducer, tasksSlice } from "features/todolists/model/tasks-reducer"
import { todolistsReducer, todolistsSlice } from "features/todolists/model/todolists-reducer"
import { appReducer, appSlice } from "./app-reducer"
import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "app/baseApi"

export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch

// Создаем тип диспатча который принимает как AC так и TC
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

// @ts-ignore
window.store = store
