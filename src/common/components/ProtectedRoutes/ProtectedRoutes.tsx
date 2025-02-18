import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "../../../features/auth/model/authSelectors"
import { Navigate, Outlet } from "react-router"
import { Path } from "common/router/path"

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
