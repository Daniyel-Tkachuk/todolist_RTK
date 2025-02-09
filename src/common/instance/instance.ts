import axios from "axios"

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  headers: {
    Authorization: "Bearer 2fbe7acb-0a44-473e-adfc-3b838956436b",
    "API-KEY": "68ce592e-fe87-4422-ab28-6cb2289a24e0"
  }
})