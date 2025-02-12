import { Todolist } from "../api/todolistsApi.types"
import { AppDispatch } from "../../../app/store"
import { todolistsApi } from "../api/todolistsApi"
import { setAppStatusAC } from "../../../app/app-reducer"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
}

const initialState: DomainTodolist[] = []

export const todolistsReducer = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.todolists.map((tl) => ({ ...tl, filter: "all" }))
    }
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.id)
    }

    case "ADD-TODOLIST": {
      const newTodolist: DomainTodolist = {
        filter: "all",
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

// ------------------ THUNKS ---------------------------

export const fetchTodolistsThunk = () => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  todolistsApi.getTodolists().then((res) => {
    dispatch(setTodolistAC(res.data))
    dispatch(setAppStatusAC("succeeded"))
  })
}

export const addTodolistTC = (title: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  todolistsApi.createTodolist(title).then((res) => {
    const todolist = res.data.data.item
    dispatch(addTodolistAC(todolist))
    dispatch(setAppStatusAC("succeeded"))
  })
}

export const removeTodolistTC = (id: string) => (dispatch: AppDispatch) => {
  todolistsApi.deleteTodolist(id).then(() => {
    dispatch(removeTodolistAC(id))
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

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | setTodolistsAT
