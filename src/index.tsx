import { router } from "common/router"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Provider } from "react-redux"
import { RouterProvider } from "react-router-dom"
import { store } from "./app/store"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)
