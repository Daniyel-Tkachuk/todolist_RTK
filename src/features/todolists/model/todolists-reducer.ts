import { v1 } from "uuid"
import { Todolist } from "../api/todolistsApi.types"
import { AppDispatch } from "../../../app/store"
import { todolistsApi } from "../api/todolistsApi"

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
      const { title, todolistId } = action.payload

      const newTodolist: DomainTodolist = {
        id: todolistId,
        title,
        filter: "all",
        addedDate: "",
        order: 0,
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

export const addTodolistAC = (title: string) => {
  return { type: "ADD-TODOLIST", payload: { title, todolistId: v1() } } as const
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

export const fetchTodolistsThunk = (dispatch: AppDispatch) => {
  todolistsApi.getTodolists().then((res) => {
    dispatch(setTodolistAC(res.data))
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
