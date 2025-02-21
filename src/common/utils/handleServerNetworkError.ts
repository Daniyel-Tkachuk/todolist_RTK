import { setAppStatus, setAppError } from "../../app/appSlice"
import { AppDispatch } from "../../app/store"

export const handleServerNetworkError = (err: { message: string }, dispatch: AppDispatch) => {
  dispatch(setAppError({ error: err.message }))
  dispatch(setAppStatus({ status: "failed" }))
}
