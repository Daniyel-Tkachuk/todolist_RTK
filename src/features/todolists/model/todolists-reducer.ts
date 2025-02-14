import { Todolist } from "../api/todolistsApi.types"
import { AppDispatch } from "../../../app/store"
import { todolistsApi } from "../api/todolistsApi"
import { RequestStatus, setAppErrorAC, setAppStatusAC } from "../../../app/app-reducer"
import { ResultCode } from "common/enums"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { handleServerAppError } from "common/utils/handleServerAppError"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
  entityStatus: RequestStatus
}

const initialState: DomainTodolist[] = []

export const todolistsReducer = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
    }
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.id)
    }

    case "ADD-TODOLIST": {
      const newTodolist: DomainTodolist = {
        filter: "all",
        entityStatus: "idle",
        ...action.payload.todolist,
      }
      return [...state, newTodolist]
    }

    case "CHANGE-TODOLIST-TITLE": {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
    }

    case "CHANGE-TODOLIST-FILTER": {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl))
    }
    case "CHANGE-TODOLIST-ENTITY-STATUS": {
      const { id, entityStatus } = action.payload
      return state.map((tl) => (tl.id === id ? { ...tl, entityStatus } : tl))
    }
    default:
      return state
  }
}

// Action creators
export const removeTodolistAC = (id: string) => {
  return { type: "REMOVE-TODOLIST", payload: { id } } as const
}

export const addTodolistAC = (todolist: Todolist) => {
  return { type: "ADD-TODOLIST", payload: { todolist } } as const
}

export const changeTodolistTitleAC = (payload: { id: string; title: string }) => {
  return { type: "CHANGE-TODOLIST-TITLE", payload } as const
}

export const changeTodolistFilterAC = (payload: { id: string; filter: FilterValuesType }) => {
  return { type: "CHANGE-TODOLIST-FILTER", payload } as const
}

export const setTodolistAC = (todolists: Todolist[]) => {
  return {
    type: "SET-TODOLISTS",
    todolists,
  } as const
}

export const changeTodolistEntityStatusAC = (payload: { id: string; entityStatus: RequestStatus }) =>
  ({
    type: "CHANGE-TODOLIST-ENTITY-STATUS",
    payload,
  }) as const

// ------------------ THUNKS ---------------------------

export const fetchTodolistsThunk = () => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  todolistsApi
    .getTodolists()
    .then((res) => {
      dispatch(setTodolistAC(res.data))
      dispatch(setAppStatusAC("succeeded"))
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const addTodolistTC = (title: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  todolistsApi
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        const todolist = res.data.data.item
        dispatch(addTodolistAC(todolist))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const removeTodolistTC = (id: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  dispatch(changeTodolistEntityStatusAC({ id, entityStatus: "loading" }))
  todolistsApi
    .deleteTodolist(id)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTodolistAC(id))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        dispatch(setAppErrorAC(res.data.messages.length ? res.data.messages[0] : "Some error occurred"))
        dispatch(setAppStatusAC("failed"))
        dispatch(changeTodolistEntityStatusAC({ id, entityStatus: "failed" }))
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
      dispatch(changeTodolistEntityStatusAC({ id, entityStatus: "failed" }))
    })
}

export const updateTodolistTitleTC = (args: { id: string; title: string }) => (dispatch: AppDispatch) => {
  todolistsApi.updateTodolist(args).then(() => {
    dispatch(changeTodolistTitleAC(args))
  })
}

// Actions types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsAT = ReturnType<typeof setTodolistAC>
export type changeTodolistEntityStatusAT = ReturnType<typeof changeTodolistEntityStatusAC>

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | setTodolistsAT
  | changeTodolistEntityStatusAT
