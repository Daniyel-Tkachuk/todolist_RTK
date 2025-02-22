import { Todolist } from "../api/todolistsApi.types"
import { AppDispatch } from "../../../app/store"
import { todolistsApi } from "../api/todolistsApi"
import { RequestStatus, setAppStatus } from "../../../app/appSlice"
import { ResultCode } from "common/enums"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { fetchTasksThunkTC } from "./tasksSlice"
import { createSlice } from "@reduxjs/toolkit"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
  entityStatus: RequestStatus
}

const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    removeTodolist: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) state.splice(index, 1)
    }),
    addTodolist: create.reducer<{ todolist: Todolist }>((state, action) => {
      const newTodolist: DomainTodolist = {
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      }
      state.unshift(newTodolist)
    }),
    changeTodolistTitle: create.reducer<{ id: string; title: string }>((state, action) => {
      const todolist = state.find((tl) => tl.id === action.payload.id)
      if (todolist) todolist.title = action.payload.title
    }),
    changeTodolistEntityStatus: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const todolist = state.find((tl) => tl.id === action.payload.id)
      if (todolist) todolist.entityStatus = action.payload.entityStatus
    }),
    changeTodolistFilter: create.reducer<{ id: string; filter: FilterValuesType }>((state, action) => {
      const todolist = state.find((tl) => tl.id === action.payload.id)
      if (todolist) todolist.filter = action.payload.filter
    }),
    setTodolists: create.reducer<{ todolists: Todolist[] }>((_, action) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
    }),
    clearTodolistsData: create.reducer(() => {
      return []
    }),
  }),
})

export const todolistsReducer = todolistsSlice.reducer
export const {
  removeTodolist,
  addTodolist,
  setTodolists,
  changeTodolistEntityStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  clearTodolistsData,
} = todolistsSlice.actions

// ------------------ THUNKS ---------------------------

export const fetchTodolistsThunk = () => (dispatch: AppDispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi
    .getTodolists()
    .then((res) => {
      dispatch(setTodolists({ todolists: res.data }))
      dispatch(setAppStatus({ status: "succeeded" }))
      return res.data
    })
    .then((res) => {
      res.forEach((tl) => {
        dispatch(fetchTasksThunkTC(tl.id))
      })
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const addTodolistTC = (title: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        const todolist = res.data.data.item
        dispatch(addTodolist({ todolist }))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const removeTodolistTC = (id: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  dispatch(changeTodolistEntityStatus({ id, entityStatus: "loading" }))
  todolistsApi
    .deleteTodolist(id)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTodolist({ id }))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
        dispatch(changeTodolistEntityStatus({ id, entityStatus: "failed" }))
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
      dispatch(changeTodolistEntityStatus({ id, entityStatus: "failed" }))
    })
}

export const updateTodolistTitleTC = (args: { id: string; title: string }) => (dispatch: AppDispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi
    .updateTodolist(args)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitle(args))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}
