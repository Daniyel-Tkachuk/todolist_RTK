import { RouteObject } from "react-router"
import { Login } from "../../features/auth/ui/Login/Login"
import { Page404 } from "common/components"
import { Path } from "common/router/path"

export const publicRoutes: RouteObject[] = [
  {
    path: Path.Login,
    element: <Login />,
  },
  {
    path: Path.NotFound,
    element: <Page404 />,
  },
]
