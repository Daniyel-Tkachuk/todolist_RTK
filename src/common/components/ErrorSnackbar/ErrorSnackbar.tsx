import React, { SyntheticEvent } from "react"
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { selectAppError } from "../../../app/appSelectors"
import { setAppErrorAC } from "../../../app/app-reducer"

export const ErrorSnackbar = () => {
  const error = useAppSelector(selectAppError)
  const dispatch = useAppDispatch()

  const handleClose = (_: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return
    }

    dispatch(setAppErrorAC(null))
  }

  return (
    <div>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}
