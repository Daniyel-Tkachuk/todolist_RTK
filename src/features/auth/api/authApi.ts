import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { LoginInputs } from "../ui/Login/Login"
import { UserType } from "./authApi.types"

export const authApi = {
  me() {
    return instance.get<BaseResponse<{ data: UserType }>>("auth/me")
  },
  login(payload: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>("/auth/login", payload)
  },
  logout() {
    return instance.delete<BaseResponse>("/auth/login")
  },
}
