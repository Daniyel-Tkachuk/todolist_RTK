import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import { Path } from "common/router"
import { AddItemForm } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { Navigate } from "react-router-dom"
import { addTodolistTC } from "features/todolists/model/todolists-reducer"
import { Todolists } from "features/todolists/ui/Todolists/Todolists"
import { selectIsLoggedIn } from "features/auth/model/auth-reducer"
import { useAddTodolistMutation } from "features/todolists/api/_todolistsApi"

export const Main = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const [addTodolist] = useAddTodolistMutation()

  const addTodolistHandler = (title: string) => {
    addTodolist(title)
  }

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
