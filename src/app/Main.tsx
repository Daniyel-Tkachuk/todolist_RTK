import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import React from "react"
import { AddItemForm } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { addTodolistTC } from "../features/todolists/model/todolistsSlice"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { selectIsLoggedIn } from "../features/auth/model/authSlice"

export const Main = () => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const addTodolist = (title: string) => {
    dispatch(addTodolistTC(title))
  }

  return (
    <Container fixed>
      {isLoggedIn && (
        <>
          <Grid container sx={{ mb: "30px" }}>
            <AddItemForm addItem={addTodolist} />
          </Grid>

          <Grid container spacing={4}>
            <Todolists />
          </Grid>
        </>
      )}
    </Container>
  )
}
