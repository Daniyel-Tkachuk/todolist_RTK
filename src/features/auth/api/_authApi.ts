import { BaseResponse } from "common/types"
import { LoginArgs } from "./authAPI.types"
import { baseApi } from "app/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
    login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
      query: (payload) => ({
        url: "auth/login",
        method: "POST",
        body: payload,
      }),
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: "auth/login",
        method: "DELETE",
      }),
    }),
  }),
})

export const { useLogoutMutation, useLoginMutation, useMeQuery } = authApi
