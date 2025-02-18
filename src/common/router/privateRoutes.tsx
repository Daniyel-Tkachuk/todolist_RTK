import { RouteObject } from "react-router"
import { Main } from "../../app/Main"
import { FaqPage } from "common/components/Faq/FaqPage"
import { Path } from "common/router/path"

export const privateRoutes: RouteObject[] = [
  {
    path: Path.Main,
    element: <Main />,
  },
  {
    path: Path.Faq,
    element: <FaqPage />,
  },
]
