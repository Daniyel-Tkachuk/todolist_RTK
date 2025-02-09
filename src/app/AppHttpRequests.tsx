import Checkbox from "@mui/material/Checkbox"
import axios from "axios"
import React, { ChangeEvent, useEffect, useState } from "react"
import { AddItemForm } from "../common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "../common/components/EditableSpan/EditableSpan"
import { Todolist } from "../features/todolists/api/todolistsApi.types"
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  DomainTask,
  GetTasksResponse,
  UpdateTaskModel,
  UpdateTaskResponse,
} from "../features/todolists/api/tasksApi.types"
import { todolistsApi } from "../features/todolists/api/todolistsApi"
import { TaskStatus } from "common/enums/enums"

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<{
    [key: string]: DomainTask[]
  }>({})

  useEffect(() => {
    todolistsApi.getTodolists().then((res) => {
      const todolists = res.data
      setTodolists(todolists)
      todolists.forEach((tl) => {
        axios
          .get<GetTasksResponse>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${tl.id}/tasks`, {
            headers: {
              Authorization: "Bearer 2fbe7acb-0a44-473e-adfc-3b838956436b",
              "API-KEY": "68ce592e-fe87-4422-ab28-6cb2289a24e0",
            },
          })
          .then((res) => {
            setTasks((prevState) => {
              return { ...prevState, [tl.id]: res.data.items }
            })
          })
      })
    })
  }, [])

  const createTodolistHandler = (title: string) => {
    todolistsApi.createTodolist(title).then((res) => {
      const newTodolist = res.data.data.item
      setTodolists([newTodolist, ...todolists])
    })
  }

  const removeTodolistHandler = (id: string) => {
    todolistsApi.deleteTodolist(id).then((res) => {
      const newTodolists = todolists.filter((item) => item.id !== id)
      setTodolists(newTodolists)
    })
  }

  const updateTodolistHandler = (id: string, title: string) => {
    todolistsApi.updateTodolist({ id, title }).then((res) => {
      const newTodolists = todolists.map((item) => (item.id === id ? { ...item, title } : item))
      setTodolists(newTodolists)
    })
  }

  const createTaskHandler = (title: string, todolistId: string) => {
    axios
      .post<CreateTaskResponse>(
        `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks`,
        { title },
        {
          headers: {
            Authorization: "Bearer 2fbe7acb-0a44-473e-adfc-3b838956436b",
            "API-KEY": "68ce592e-fe87-4422-ab28-6cb2289a24e0",
          },
        },
      )
      .then((res) => {
        const newTask = res.data.data.item
        setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
      })
  }

  const removeTaskHandler = (taskId: string, todolistId: string) => {
    axios
      .delete<DeleteTaskResponse>(
        `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${taskId}`,
        {
          headers: {
            Authorization: "Bearer 2fbe7acb-0a44-473e-adfc-3b838956436b",
            "API-KEY": "68ce592e-fe87-4422-ab28-6cb2289a24e0",
          },
        },
      )
      .then((res) => {
        setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter((t) => t.id !== taskId) })
      })
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New

    const model: UpdateTaskModel = {
      status,
      title: task.title,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
    }

    axios
      .put<UpdateTaskResponse>(
        `https://social-network.samuraijs.com/api/1.1/todo-lists/${task.todoListId}/tasks/${task.id}`,
        model,
        {
          headers: {
            Authorization: "Bearer 2fbe7acb-0a44-473e-adfc-3b838956436b",
            "API-KEY": "68ce592e-fe87-4422-ab28-6cb2289a24e0",
          },
        },
      )
      .then((res) => {
        const newTasks = tasks[task.todoListId].map((t) => (t.id === task.id ? { ...t, ...model } : t))
        setTasks({ ...tasks, [task.todoListId]: newTasks })
      })
  }

  const changeTaskTitleHandler = (title: string, task: DomainTask) => {
    const model: UpdateTaskModel = {
      status: task.status,
      title,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
    }

    axios
      .put<UpdateTaskResponse>(
        `https://social-network.samuraijs.com/api/1.1/todo-lists/${task.todoListId}/tasks/${task.id}`,
        model,
        {
          headers: {
            Authorization: "Bearer 2fbe7acb-0a44-473e-adfc-3b838956436b",
            "API-KEY": "68ce592e-fe87-4422-ab28-6cb2289a24e0",
          },
        },
      )
      .then((res) => {
        const newTasks = tasks[task.todoListId].map((t) => (t.id === task.id ? { ...t, ...model } : t))
        setTasks({ ...tasks, [task.todoListId]: newTasks })
      })
  }

  return (
    <div style={{ margin: "20px" }}>
      <AddItemForm addItem={createTodolistHandler} />

      {/* Todolists */}
      {todolists.map((tl) => {
        return (
          <div key={tl.id} style={todolist}>
            <div>
              <EditableSpan value={tl.title} onChange={(title: string) => updateTodolistHandler(tl.id, title)} />
              <button onClick={() => removeTodolistHandler(tl.id)}>x</button>
            </div>
            <AddItemForm addItem={(title) => createTaskHandler(title, tl.id)} />

            {/* Tasks */}
            {!!tasks[tl.id] &&
              tasks[tl.id].map((task: DomainTask) => {
                return (
                  <div key={task.id}>
                    <Checkbox checked={task.status === 2} onChange={(e) => changeTaskStatusHandler(e, task)} />
                    <EditableSpan value={task.title} onChange={(title) => changeTaskTitleHandler(title, task)} />
                    <button onClick={() => removeTaskHandler(task.id, tl.id)}>x</button>
                  </div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}

// Styles
const todolist: React.CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "300px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
