import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import { EditableSpan } from "common/components"
import { useAppDispatch } from "common/hooks"
import { DomainTodolist, removeTodolistTC, updateTodolistTitleTC } from "../../../../model/todolists-reducer"
import s from "./TodolistTitle.module.css"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { title, id, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const removeTodolistHandler = () => {
    dispatch(removeTodolistTC(id))
  }
  const updateTodolistHandler = (title: string) => {
    dispatch(updateTodolistTitleTC({ id, title }))
  }

  return (
    <div className={s.container}>
      <h3>
        <EditableSpan value={title} disabled={entityStatus === "loading"} onChange={updateTodolistHandler} />
      </h3>
      <IconButton disabled={entityStatus === "loading"} onClick={removeTodolistHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
