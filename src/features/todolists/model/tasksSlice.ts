import { AppDispatch, RootState } from "../../../app/store"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../api/tasksApi.types"
import { setAppError, setAppStatus } from "../../../app/appSlice"
import { ResultCode } from "common/enums"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { createSlice } from "@reduxjs/toolkit"
import { addTodolist, clearTodolistsData, removeTodolist } from "./todolistsSlice"

export type TasksStateType = Record<string, DomainTask[]>

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: (create) => ({
    setTasks: create.reducer<{ todolistId: string; tasks: DomainTask[] }>((state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    }),
    removeTask: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index !== -1) tasks.splice(index, 1)
    }),
    addTask: create.reducer<{ task: DomainTask }>((state, action) => {
      const tasks = state[action.payload.task.todoListId]
      tasks.unshift(action.payload.task)
    }),
    updateTask: create.reducer<{ task: DomainTask }>((state, action) => {
      const { todoListId, id } = action.payload.task
      const tasks = state[todoListId]
      const index = tasks.findIndex((t) => t.id === id)
      if (index !== -1) tasks[index] = action.payload.task
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(clearTodolistsData, () => {
        return {}
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const { addTask, removeTask, updateTask, setTasks } = tasksSlice.actions

// ------- THUNKS -------------

export const fetchTasksThunkTC = (todolistId: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  tasksApi
    .getTasks(todolistId)
    .then((res) => {
      if (!res.data.error) {
        dispatch(setTasks({ todolistId, tasks: res.data.items }))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        dispatch(setAppError({ error: res.data.error }))
        dispatch(setAppStatus({ status: "failed" }))
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const removeTaskTC = (args: { todolistId: string; taskId: string }) => (dispatch: AppDispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  tasksApi
    .deleteTask(args)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(removeTask(args))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const addTaskTC = (args: { todolistId: string; title: string }) => (dispatch: AppDispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  tasksApi
    .createTask(args)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(addTask({ task: res.data.data.item }))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const updateTaskTC =
  (args: { todolistId: string; taskId: string; domainModel: UpdateTaskDomainModel }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setAppStatus({ status: "loading" }))

    const { todolistId, taskId, domainModel } = args
    const task = getState().tasks[args.todolistId].find((t) => t.id === args.taskId)

    if (!task) return

    const model: UpdateTaskModel = {
      title: task.title,
      status: task.status,
      startDate: task.startDate,
      priority: task.priority,
      description: task.description,
      deadline: task.deadline,
      ...domainModel,
    }

    tasksApi
      .updateTask({ todolistId, taskId, model })
      .then((res) => {
        if (res.data.resultCode === ResultCode.Success) {
          const task = res.data.data.item
          dispatch(updateTask({ task }))
          dispatch(setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }
