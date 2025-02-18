import { createBrowserRouter } from "react-router"
import { App } from "../../app/App"
import { ProtectedRoutes } from "common/components/ProtectedRoutes/ProtectedRoutes"
import { privateRoutes } from "common/router/privateRoutes"
import { publicRoutes } from "common/router/publickRoutes"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: privateRoutes,
      },
      ...publicRoutes,
    ],
  },
])
