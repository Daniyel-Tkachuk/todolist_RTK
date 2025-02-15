import { Route, Routes } from "react-router"
import { Main } from "../../app/Main"
import { Login } from "../../features/auth/ui/Login/Login"
import { Page404 } from "common/components"

export const Path = {
  Main: "/",
  Login: "login",
  NotFount: "*",
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route path={Path.Main} element={<Main />} />
      <Route path={Path.Login} element={<Login />} />
      <Route path={Path.NotFount} element={<Page404 />} />
    </Routes>
  )
}
