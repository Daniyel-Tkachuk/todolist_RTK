import { setAppStatus, setAppError } from "../../app/app-reducer"
import { AppDispatch } from "../../app/store"

export const handleServerNetworkError = (err: { message: string }, dispatch: AppDispatch) => {
  dispatch(setAppError({ error: err.message }))
  dispatch(setAppStatus({ status: "failed" }))
}
