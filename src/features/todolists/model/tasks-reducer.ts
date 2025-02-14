import { AddTodolistActionType, RemoveTodolistActionType } from "./todolists-reducer"
import { AppDispatch, RootState } from "../../../app/store"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../api/tasksApi.types"
import { setAppErrorAC, setAppStatusAC } from "../../../app/app-reducer"
import { ResultCode } from "common/enums"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { handleServerAppError } from "common/utils/handleServerAppError"

export type TasksStateType = Record<string, DomainTask[]>

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "SET_TASKS": {
      const { todolistId, tasks } = action.payload
      return { ...state, [todolistId]: tasks }
    }
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId),
      }
    }

    case "ADD-TASK": {
      const newTask = action.payload.task

      return { ...state, [newTask.todoListId]: [newTask, ...state[newTask.todoListId]] }
    }

    case "UPDATE_TASK": {
      const task = action.payload.task
      return {
        ...state,
        [task.todoListId]: state[task.todoListId].map((t) => (t.id === task.id ? task : t)),
      }
    }

    case "ADD-TODOLIST":
      return { ...state, [action.payload.todolist.id]: [] }

    case "REMOVE-TODOLIST": {
      let copyState = { ...state }
      delete copyState[action.payload.id]
      return copyState
    }

    default:
      return state
  }
}

// Action creators
export const removeTaskAC = (payload: { taskId: string; todolistId: string }) => {
  return {
    type: "REMOVE-TASK",
    payload,
  } as const
}

export const addTaskAC = (payload: { task: DomainTask }) => {
  return {
    type: "ADD-TASK",
    payload,
  } as const
}

export const changeTaskStatusAC = (payload: { taskId: string; isDone: boolean; todolistId: string }) => {
  return {
    type: "CHANGE_TASK_STATUS",
    payload,
  } as const
}

export const changeTaskTitleAC = (payload: { taskId: string; title: string; todolistId: string }) => {
  return {
    type: "CHANGE_TASK_TITLE",
    payload,
  } as const
}

export const setTasksAC = (payload: { todolistId: string; tasks: DomainTask[] }) => {
  return { type: "SET_TASKS", payload } as const
}

export const updateTaskAC = (payload: { task: DomainTask }) =>
  ({
    type: "UPDATE_TASK",
    payload,
  }) as const

// ------- THUNKS -------------

export const fetchTasksThunkTC = (todolistId: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  tasksApi
    .getTasks(todolistId)
    .then((res) => {
      if (!res.data.error) {
        dispatch(setTasksAC({ todolistId, tasks: res.data.items }))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        dispatch(setAppErrorAC(res.data.error))
        dispatch(setAppStatusAC("failed"))
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const removeTaskTC = (args: { todolistId: string; taskId: string }) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  tasksApi
    .deleteTask(args)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(removeTaskAC(args))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const addTaskTC = (args: { todolistId: string; title: string }) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"))
  tasksApi
    .createTask(args)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(addTaskAC({ task: res.data.data.item }))
        dispatch(setAppStatusAC("succeeded"))
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
    dispatch(setAppStatusAC("loading"))

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
          dispatch(updateTaskAC({ task }))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }

// Actions types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksAT = ReturnType<typeof setTasksAC>
export type UpdateTaskAT = ReturnType<typeof updateTaskAC>

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTasksAT
  | UpdateTaskAT
