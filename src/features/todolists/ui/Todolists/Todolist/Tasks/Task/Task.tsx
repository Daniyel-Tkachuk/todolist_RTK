import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import { ChangeEvent } from "react"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { removeTaskTC, updateTaskTC } from "../../../../../model/tasksSlice"
import { DomainTodolist } from "../../../../../model/todolistsSlice"
import { getListItemSx } from "./Task.styles"
import { EditableSpan } from "common/components"
import { DomainTask } from "../../../../../api/tasksApi.types"
import { TaskStatus } from "common/enums"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const Task = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(removeTaskTC({ taskId: task.id, todolistId: todolist.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    dispatch(updateTaskTC({ taskId: task.id, todolistId: todolist.id, domainModel: { status } }))
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(updateTaskTC({ taskId: task.id, todolistId: todolist.id, domainModel: { title } }))
  }

  return (
    <ListItem key={task.id} sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div>
        <Checkbox
          disabled={todolist.entityStatus === "loading"}
          checked={task.status === TaskStatus.Completed}
          onChange={changeTaskStatusHandler}
        />
        <EditableSpan
          disabled={todolist.entityStatus === "loading"}
          value={task.title}
          onChange={changeTaskTitleHandler}
        />
      </div>
      <IconButton disabled={todolist.entityStatus === "loading"} onClick={removeTaskHandler}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
