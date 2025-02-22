import List from "@mui/material/List"
import { useAppSelector } from "common/hooks/useAppSelector"
import { Task } from "./Task/Task"
import { DomainTodolist } from "../../../../model/todolistsSlice"
import { TaskStatus } from "common/enums"
import { selectTasks } from "../../../../model/tasksSlice"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const tasks = useAppSelector(selectTasks)

  const allTodolistTasks = tasks[todolist.id] || []

  const tasksForTodolist = (() => {
    switch (todolist.filter) {
      case "active": {
        return allTodolistTasks.filter((t) => t.status === TaskStatus.New)
      }
      case "completed": {
        return allTodolistTasks.filter((t) => t.status === TaskStatus.Completed)
      }
      default: {
        return allTodolistTasks
      }
    }
  })()

  return (
    <>
      {tasksForTodolist && tasksForTodolist.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {tasksForTodolist?.map((task) => {
            return <Task key={task.id} task={task} todolist={todolist} />
          })}
        </List>
      )}
    </>
  )
}
