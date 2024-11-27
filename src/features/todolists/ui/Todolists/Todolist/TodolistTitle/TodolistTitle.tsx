import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import { EditableSpan } from "common/components"
import { useAppDispatch } from "common/hooks"
import { DomainTodolist } from "../../../../model/todolists-reducer"
import s from "./TodolistTitle.module.css"
import {
  todolistsApi,
  useRemoveTodolistMutation,
  useUpdateTodolistMutation,
} from "features/todolists/api/_todolistsApi"
import { RequestStatus } from "app/app-reducer"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { title, id, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const [removeTodolist] = useRemoveTodolistMutation()
  const [updateTodolist] = useUpdateTodolistMutation()

  const updateQueryData = (status: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const index = state.findIndex((tl) => tl.id === id)
        if (index !== -1) {
          state[index].entityStatus = status
        }
      }),
    )
  }

  const removeTodolistHandler = () => {
    updateQueryData("loading")
    removeTodolist(id)
      .unwrap()
      .catch(() => {
        updateQueryData("idle")
      })
  }

  const updateTodolistHandler = (title: string) => {
    updateTodolist({ id, title })
  }

  return (
    <div className={s.container}>
      <h3>
        <EditableSpan value={title} onChange={updateTodolistHandler} disabled={entityStatus === "loading"} />
      </h3>
      <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
