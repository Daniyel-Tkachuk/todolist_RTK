import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"
import { Path } from "common/router/path"
import { selectIsLoggedIn } from "../../../features/auth/model/authSlice"

export const ProtectedRoutes = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const getJSX = () => {
    if (isLoggedIn) {
      return <Outlet />
    }
    return <Navigate to={Path.Login} />
  }

  return getJSX()
}
