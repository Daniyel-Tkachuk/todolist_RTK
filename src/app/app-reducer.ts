export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

type InitialState = typeof initialState

const initialState = {
  status: "idle" as RequestStatus,
  themeMode: "light" as ThemeMode,
}

export const appReducer = (state: InitialState = initialState, action: ActionsType): InitialState => {
  switch (action.type) {
    case "CHANGE_THEME":
      return { ...state, themeMode: action.payload.themeMode }
    case "SET_STATUS": {
      return { ...state, status: action.payload.status }
    }
    default:
      return state
  }
}

// Action creators
export const changeThemeAC = (themeMode: ThemeMode) => {
  return {
    type: "CHANGE_THEME",
    payload: { themeMode },
  } as const
}

export const setAppStatusAC = (status: RequestStatus) => {
  return {
    type: "SET_STATUS",
    payload: { status },
  } as const
}

// Actions types
type ChangeThemeActionType = ReturnType<typeof changeThemeAC>
type SetStatusAT = ReturnType<typeof setAppStatusAC>

type ActionsType = ChangeThemeActionType | SetStatusAT
