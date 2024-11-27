import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "app/baseApi"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, string>({
      query: (todoId) => `todo-lists/${todoId}/tasks`,
      providesTags: ["Tasks"],
    }),
    createTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todoId: string; title: string }>({
      query: ({ todoId, title }) => ({
        url: `todo-lists/${todoId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: build.mutation<BaseResponse, { todoId: string; taskId: string }>({
      query: ({ todoId, taskId }) => ({
        url: `todo-lists/${todoId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todoId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todoId, taskId, model }) => ({
        url: `todo-lists/${todoId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi

export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { title: string; todolistId: string }) {
    const { title, todolistId } = payload
    return instance.post<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(payload: { todolistId: string; taskId: string }) {
    const { taskId, todolistId } = payload
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
    const { taskId, todolistId, model } = payload
    return instance.put<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}
